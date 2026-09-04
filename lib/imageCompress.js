/* ============================================================
   CALCROO — CORE NÉN ẢNH (dùng chung main-thread & Web Worker)
   Không đụng tới DOM trực tiếp: caller truyền vào cách tạo canvas
   và cách encode (HTMLCanvas hoặc OffscreenCanvas).
   ============================================================ */

export const DEFAULTS = {
  maxEdge: 2400, // trần cạnh dài
  minEdge: 900, // dưới mức này chữ giấy tờ khó đọc -> dừng hạ kích thước
  qLo: 0.45,
  qHi: 0.92,
  rounds: 8,
  shrink: 0.82,
  bisect: 6,
};

/**
 * @param {{width:number,height:number}} source  ImageBitmap | HTMLImageElement
 * @param {number} targetBytes
 * @param {{ makeCanvas:(w:number,h:number)=>any, encode:(canvas:any,q:number)=>Promise<Blob> }} io
 * @param {object} [opt]
 * @param {(p:number)=>void} [onProgress] 0..1
 * @returns {Promise<{blob:Blob,w:number,h:number,reached:boolean}|null>}
 */
export async function compressImage(source, targetBytes, io, opt = {}, onProgress) {
  const o = { ...DEFAULTS, ...opt };
  const sw = source.width || source.naturalWidth;
  const sh = source.height || source.naturalHeight;
  if (!sw || !sh) return null;

  let scale = Math.min(1, o.maxEdge / Math.max(sw, sh));
  let best = null;
  let reached = false;

  for (let round = 0; round < o.rounds; round += 1) {
    const w = Math.max(1, Math.round(sw * scale));
    const h = Math.max(1, Math.round(sh * scale));
    const canvas = io.makeCanvas(w, h);
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(source, 0, 0, w, h);

    let blob = await io.encode(canvas, o.qHi);
    if (blob && blob.size <= targetBytes) {
      best = { blob, w, h };
      reached = true;
      break;
    }

    let lo = o.qLo;
    let hi = o.qHi;
    for (let i = 0; i < o.bisect; i += 1) {
      const mid = (lo + hi) / 2;
      const b = await io.encode(canvas, mid);
      if (b && b.size <= targetBytes) lo = mid;
      else hi = mid;
    }
    blob = await io.encode(canvas, lo);
    best = { blob, w, h };
    if (blob && blob.size <= targetBytes) {
      reached = true;
      break;
    }

    if (onProgress) onProgress(Math.min(0.95, (round + 1) / o.rounds));
    if (Math.max(w, h) * o.shrink < o.minEdge) break;
    scale *= o.shrink;
  }

  if (onProgress) onProgress(1);
  return best ? { ...best, reached } : null;
}
