'use client';

import { useState } from 'react';

const PRESETS = [
  { kb: 5000, label: '5 MB' },
  { kb: 2000, label: '2 MB' },
  { kb: 1000, label: '1 MB' },
  { kb: 500, label: '500 KB' },
  { kb: 250, label: '250 KB' },
  { kb: 100, label: '100 KB' },
];

const STRINGS = {
  en: {
    inTitle: 'Your document photo or scan',
    pick: 'Choose an image',
    repick: 'Choose a different image',
    pickHint: 'JPG or PNG of a document, ID, payslip or form. Processed entirely in your browser — never uploaded.',
    heicHint: 'iPhone photo not loading? It may be HEIC format — set Camera → Formats → “Most Compatible”, or send it to yourself in a chat app and save the JPEG.',
    targetLbl: 'Target size (your portal’s upload limit)',
    targetHint: 'Common limits: immi/ImmiAccount ~5MB per file, many bank and government portals 1–2MB, email attachments 500KB–1MB.',
    compress: 'Compress',
    working: 'Compressing…',
    origLbl: 'Original',
    resultLbl: 'Compressed',
    reduction: 'smaller',
    cantReach: '⚠ Could not reach the target without making the document unreadable — this is the smallest legible result.',
    dl: 'Download compressed JPG',
    psTitle: 'Result',
    empty: 'Choose an image and a target size, then press Compress.',
    dims: 'dimensions',
  },
  vi: {
    inTitle: 'Ảnh giấy tờ hoặc bản scan',
    pick: 'Chọn ảnh',
    repick: 'Chọn ảnh khác',
    pickHint: 'JPG hoặc PNG của giấy tờ, ID, payslip, biểu mẫu. Xử lý ngay trên trình duyệt — không upload đi đâu.',
    heicHint: 'Ảnh iPhone không hiện? Có thể là định dạng HEIC — chỉnh Camera → Formats → “Most Compatible”, hoặc gửi ảnh qua app chat rồi lưu bản JPEG.',
    targetLbl: 'Dung lượng mục tiêu (giới hạn upload của cổng nộp)',
    targetHint: 'Giới hạn phổ biến: immi/ImmiAccount ~5MB mỗi file, nhiều cổng ngân hàng và chính phủ 1–2MB, đính kèm email 500KB–1MB.',
    compress: 'Nén ảnh',
    working: 'Đang nén…',
    origLbl: 'Ảnh gốc',
    resultLbl: 'Sau khi nén',
    reduction: 'nhỏ hơn',
    cantReach: '⚠ Không thể đạt mục tiêu mà vẫn giữ giấy tờ đọc được — đây là mức nhỏ nhất còn rõ chữ.',
    dl: 'Tải ảnh JPG đã nén',
    psTitle: 'Kết quả',
    empty: 'Chọn ảnh và dung lượng mục tiêu, rồi bấm Nén ảnh.',
    dims: 'kích thước',
  },
};

const fmtKB = (bytes) =>
  bytes >= 1024 * 1024 ? (bytes / 1024 / 1024).toFixed(2) + ' MB' : Math.round(bytes / 1024) + ' KB';

const toBlob = (canvas, q) => new Promise((res) => canvas.toBlob(res, 'image/jpeg', q));

export default function DocCompressor({ lang = 'en' }) {
  const t = STRINGS[lang];
  const [file, setFile] = useState(null);
  const [img, setImg] = useState(null);
  const [target, setTarget] = useState(1000);
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null); // {blob, url, w, h, reached}

  const onFile = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    setResult(null);
    const url = URL.createObjectURL(f);
    const im = new Image();
    im.onload = () => {
      setFile(f);
      setImg(im);
      URL.revokeObjectURL(url);
    };
    im.onerror = () => URL.revokeObjectURL(url);
    im.src = url;
  };

  async function run() {
    if (!img) return;
    setBusy(true);
    setResult(null);
    const targetBytes = target * 1024;
    const MIN_EDGE = 900; // dưới mức này chữ giấy tờ bắt đầu khó đọc
    let scale = Math.min(1, 2400 / Math.max(img.width, img.height)); // trần 2400px cạnh dài
    let best = null;
    let reached = false;

    for (let round = 0; round < 8; round++) {
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      const ctx = c.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);

      // binary search quality 0.45–0.92
      let lo = 0.45;
      let hi = 0.92;
      let blob = await toBlob(c, hi);
      if (blob.size <= targetBytes) {
        best = { blob, w, h };
        reached = true;
        break;
      }
      for (let i = 0; i < 6; i++) {
        const mid = (lo + hi) / 2;
        blob = await toBlob(c, mid);
        if (blob.size <= targetBytes) lo = mid;
        else hi = mid;
      }
      blob = await toBlob(c, lo);
      best = { blob, w, h };
      if (blob.size <= targetBytes) {
        reached = true;
        break;
      }
      if (Math.max(w, h) * 0.82 < MIN_EDGE) break; // không hạ thêm nữa
      scale *= 0.82;
    }

    if (best) {
      setResult({ ...best, url: URL.createObjectURL(best.blob), reached });
    }
    setBusy(false);
  }

  const dl = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result.url;
    a.download = 'compressed-document.jpg';
    a.click();
  };

  return (
    <div className="grid">
      <div className="card">
        <h2>{t.inTitle}</h2>

        <div className="field">
          <label className="photo-pick">
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={onFile} style={{ display: 'none' }} />
            <span>{img ? t.repick : t.pick}</span>
          </label>
          <div className="hint">{t.pickHint}</div>
          <div className="hint">{t.heicHint}</div>
        </div>

        <div className="field">
          <label htmlFor="dc-target">{t.targetLbl}</label>
          <select id="dc-target" value={target} onChange={(e) => setTarget(+e.target.value)}>
            {PRESETS.map((p) => (
              <option key={p.kb} value={p.kb}>≤ {p.label}</option>
            ))}
          </select>
          <div className="hint">{t.targetHint}</div>
        </div>

        {img && (
          <button className="btn-primary" onClick={run} disabled={busy}>
            {busy ? t.working : t.compress}
          </button>
        )}
      </div>

      <div className="payslip">
        <div className="payslip-head">
          <span className="lbl">{t.psTitle}</span>
          <span className="fy">JPEG</span>
        </div>
        <div style={{ padding: '1.3rem 1.5rem' }}>
          {!img && <div className="hint">{t.empty}</div>}
          {img && file && (
            <div className="lines" style={{ padding: 0, border: 'none' }}>
              <div className="line">
                <span className="k">{t.origLbl}</span>
                <span className="v">{fmtKB(file.size)} · {img.width}×{img.height}</span>
              </div>
              {result && (
                <>
                  <div className="line total">
                    <span className="k">{t.resultLbl}</span>
                    <span className="v">{fmtKB(result.blob.size)} · {result.w}×{result.h}</span>
                  </div>
                  <div className="line plus">
                    <span className="k"></span>
                    <span className="v">−{Math.round((1 - result.blob.size / file.size) * 100)}% {t.reduction}</span>
                  </div>
                </>
              )}
            </div>
          )}
          {result && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.7rem', marginTop: '1rem' }}>
              {!result.reached && (
                <div className="hint" style={{ padding: '.7rem .9rem', border: '1.5px solid var(--wattle)', borderRadius: 9, color: '#8a6508' }}>
                  {t.cantReach}
                </div>
              )}
              <img
                src={result.url}
                alt="compressed preview"
                style={{ width: '100%', borderRadius: 8, border: '1px solid var(--line)' }}
              />
              <button className="btn-primary" onClick={dl}>{t.dl}</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
