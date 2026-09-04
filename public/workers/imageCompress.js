/* ============================================================
   CALCROO — IMAGE COMPRESS WEB WORKER (classic, self-contained)
   File tĩnh trong /public — KHÔNG qua bundler, chạy được ngay
   trong static export. Dùng OffscreenCanvas + createImageBitmap.

   ⚠ Thuật toán ở đây phải khớp với lib/imageCompress.js
     (bản main-thread fallback). Sửa thì sửa cả hai.
   ============================================================ */

var DEFAULTS = {
  maxEdge: 2400,
  minEdge: 900,
  qLo: 0.45,
  qHi: 0.92,
  rounds: 8,
  shrink: 0.82,
  bisect: 6,
};

async function compress(bitmap, targetBytes, opt) {
  var o = Object.assign({}, DEFAULTS, opt || {});
  var sw = bitmap.width;
  var sh = bitmap.height;
  if (!sw || !sh) return null;

  var scale = Math.min(1, o.maxEdge / Math.max(sw, sh));
  var best = null;
  var reached = false;

  for (var round = 0; round < o.rounds; round++) {
    var w = Math.max(1, Math.round(sw * scale));
    var h = Math.max(1, Math.round(sh * scale));
    var canvas = new OffscreenCanvas(w, h);
    var ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(bitmap, 0, 0, w, h);

    var enc = function (q) {
      return canvas.convertToBlob({ type: 'image/jpeg', quality: q });
    };

    var blob = await enc(o.qHi);
    if (blob && blob.size <= targetBytes) {
      best = { blob: blob, w: w, h: h };
      reached = true;
      break;
    }

    var lo = o.qLo;
    var hi = o.qHi;
    for (var i = 0; i < o.bisect; i++) {
      var mid = (lo + hi) / 2;
      var b = await enc(mid);
      if (b && b.size <= targetBytes) lo = mid;
      else hi = mid;
    }
    blob = await enc(lo);
    best = { blob: blob, w: w, h: h };
    if (blob && blob.size <= targetBytes) {
      reached = true;
      break;
    }

    self.postMessage({ id: self.__id, progress: Math.min(0.95, (round + 1) / o.rounds) });
    if (Math.max(w, h) * o.shrink < o.minEdge) break;
    scale *= o.shrink;
  }

  return best ? { blob: best.blob, w: best.w, h: best.h, reached: reached } : null;
}

self.onmessage = async function (e) {
  var data = e.data || {};
  var id = data.id;
  self.__id = id;
  try {
    if (typeof OffscreenCanvas === 'undefined' || typeof createImageBitmap !== 'function') {
      self.postMessage({ id: id, error: 'unsupported' });
      return;
    }
    var bitmap = await createImageBitmap(data.file);
    var res = await compress(bitmap, data.targetBytes, data.opt);
    if (bitmap.close) bitmap.close();

    if (!res || !res.blob) {
      self.postMessage({ id: id, error: 'failed' });
      return;
    }
    self.postMessage({
      id: id,
      done: true,
      blob: res.blob,
      w: res.w,
      h: res.h,
      reached: res.reached,
    });
  } catch (err) {
    self.postMessage({ id: id, error: (err && err.message) || String(err) });
  }
};
