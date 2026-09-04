/* ============================================================
   CALCROO — BULK IMAGE PROCESSOR (client)
   - Ưu tiên Web Worker; tự fallback về main-thread nếu:
     browser không hỗ trợ Worker / OffscreenCanvas, hoặc worker lỗi.
   - Xử lý TUẦN TỰ từng file -> RAM chỉ giữ 1 ảnh tại một thời điểm.
   ============================================================ */

import { compressImage } from './imageCompress';

export function workerSupported() {
  return typeof window !== 'undefined' && typeof window.Worker === 'function';
}

/* ---- main-thread fallback ---- */
const domIo = {
  makeCanvas: (w, h) => {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    return c;
  },
  encode: (canvas, q) => new Promise((res) => canvas.toBlob(res, 'image/jpeg', q)),
};

async function loadDrawable(file) {
  if (typeof createImageBitmap === 'function') {
    try {
      const bmp = await createImageBitmap(file);
      return { drawable: bmp, release: () => bmp.close && bmp.close() };
    } catch (e) {
      /* thử <img> */
    }
  }
  const url = URL.createObjectURL(file);
  try {
    const img = await new Promise((resolve, reject) => {
      const im = new Image();
      im.onload = () => resolve(im);
      im.onerror = () => reject(new Error('decode'));
      im.src = url;
    });
    return { drawable: img, release: () => {} };
  } finally {
    URL.revokeObjectURL(url);
  }
}

async function runMainThread(file, targetBytes, opt, onProgress) {
  const { drawable, release } = await loadDrawable(file);
  try {
    const res = await compressImage(drawable, targetBytes, domIo, opt, onProgress);
    if (!res || !res.blob) throw new Error('failed');
    return res;
  } finally {
    release();
  }
}

/**
 * @returns {{
 *   usingWorker: boolean,
 *   process: (file:File, targetBytes:number, opt:object, onProgress:(p:number)=>void)
 *              => Promise<{blob:Blob,w:number,h:number,reached:boolean}>,
 *   destroy: () => void
 * }}
 */
export function createBulkImageProcessor() {
  let worker = null;
  let usingWorker = false;
  const pending = new Map();

  if (workerSupported()) {
    try {
      // File tĩnh trong /public — không qua bundler, an toàn cho static export.
      worker = new Worker('/workers/imageCompress.js');
      usingWorker = true;
      worker.onmessage = (e) => {
        const { id, progress, done, error, blob, w, h, reached } = e.data || {};
        const task = pending.get(id);
        if (!task) return;
        if (progress != null) {
          task.onProgress && task.onProgress(progress);
        } else if (done) {
          pending.delete(id);
          task.resolve({ blob, w, h, reached });
        } else if (error) {
          pending.delete(id);
          task.reject(new Error(error));
        }
      };
      worker.onerror = () => {
        // lỗi cấp worker -> huỷ hết task đang chờ, chuyển sang main-thread
        usingWorker = false;
        pending.forEach((task) => task.reject(new Error('worker-crashed')));
        pending.clear();
      };
    } catch (e) {
      worker = null;
      usingWorker = false;
    }
  }

  let seq = 0;

  async function process(file, targetBytes, opt, onProgress) {
    if (usingWorker && worker) {
      const id = 'img-' + (seq += 1);
      try {
        return await new Promise((resolve, reject) => {
          pending.set(id, { resolve, reject, onProgress });
          worker.postMessage({ id, file, targetBytes, opt });
        });
      } catch (e) {
        // task này fail trong worker -> thử lại trên main-thread
        pending.delete(id);
        if (String(e.message).includes('unsupported') || String(e.message).includes('worker-crashed')) {
          usingWorker = false;
        }
      }
    }
    return runMainThread(file, targetBytes, opt, onProgress);
  }

  return {
    get usingWorker() {
      return usingWorker;
    },
    process,
    destroy() {
      try {
        if (worker) worker.terminate();
      } catch (e) {
        /* noop */
      }
      pending.clear();
      worker = null;
    },
  };
}
