'use client';

import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';

const STRINGS = {
  en: {
    inTitle: 'Your files',
    pick: 'Add PDFs or photos',
    pickHint: 'PDF, JPG or PNG — add as many as you need. Everything is merged in your browser; nothing is uploaded.',
    qLbl: 'Photo quality (for image pages)',
    qHigh: 'High (sharpest, larger file)',
    qMed: 'Medium (recommended)',
    qLow: 'Compact (smallest file)',
    listEmpty: 'No files yet — add PDFs or photos above. They will appear here in merge order.',
    encrypted: 'password-protected — cannot merge',
    merge: 'Merge into one PDF',
    working: 'Merging…',
    psTitle: 'Merged PDF',
    empty: 'Add files and press Merge — the result appears here.',
    pages: 'pages',
    files: 'files',
    dl: 'Download merged PDF',
    up: 'Move up',
    down: 'Move down',
    remove: 'Remove',
    err: 'Could not read this file — it may be corrupted or password-protected.',
  },
  vi: {
    inTitle: 'File của bạn',
    pick: 'Thêm PDF hoặc ảnh',
    pickHint: 'PDF, JPG hoặc PNG — thêm bao nhiêu tùy ý. Mọi thứ gộp ngay trên trình duyệt; không upload đi đâu.',
    qLbl: 'Chất lượng ảnh (cho trang từ ảnh)',
    qHigh: 'Cao (nét nhất, file lớn hơn)',
    qMed: 'Vừa (khuyên dùng)',
    qLow: 'Gọn (file nhỏ nhất)',
    listEmpty: 'Chưa có file — thêm PDF hoặc ảnh ở trên. Danh sách hiện theo thứ tự gộp.',
    encrypted: 'có mật khẩu — không gộp được',
    merge: 'Gộp thành một PDF',
    working: 'Đang gộp…',
    psTitle: 'PDF đã gộp',
    empty: 'Thêm file rồi bấm Gộp — kết quả hiện ở đây.',
    pages: 'trang',
    files: 'file',
    dl: 'Tải PDF đã gộp',
    up: 'Lên',
    down: 'Xuống',
    remove: 'Xóa',
    err: 'Không đọc được file này — có thể bị hỏng hoặc có mật khẩu.',
  },
};

const QUALITY = {
  high: { q: 0.9, edge: 2200 },
  med: { q: 0.78, edge: 1700 },
  low: { q: 0.62, edge: 1300 },
};

const A4 = { w: 595.28, h: 841.89 };
const MARGIN = 24;

const fmtKB = (b) => (b >= 1048576 ? (b / 1048576).toFixed(2) + ' MB' : Math.round(b / 1024) + ' KB');

async function imageToJpegBytes(file, opt) {
  const url = URL.createObjectURL(file);
  const img = await new Promise((res, rej) => {
    const im = new Image();
    im.onload = () => res(im);
    im.onerror = rej;
    im.src = url;
  });
  URL.revokeObjectURL(url);
  const scale = Math.min(1, opt.edge / Math.max(img.width, img.height));
  const c = document.createElement('canvas');
  c.width = Math.round(img.width * scale);
  c.height = Math.round(img.height * scale);
  const ctx = c.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, c.width, c.height);
  ctx.drawImage(img, 0, 0, c.width, c.height);
  const blob = await new Promise((res) => c.toBlob(res, 'image/jpeg', opt.q));
  return new Uint8Array(await blob.arrayBuffer());
}

export default function PdfMerger({ lang = 'en' }) {
  const t = STRINGS[lang];
  const [items, setItems] = useState([]); // {id, name, file, isPdf, size, bad}
  const [quality, setQuality] = useState('med');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState(null); // {url, size, pages}

  const onFiles = (e) => {
    const files = Array.from(e.target.files || []);
    setResult(null);
    setItems((prev) => [
      ...prev,
      ...files.map((f, i) => ({
        id: Date.now() + '-' + i + '-' + f.name,
        name: f.name,
        file: f,
        isPdf: f.type === 'application/pdf' || /\.pdf$/i.test(f.name),
        size: f.size,
        bad: false,
      })),
    ]);
    e.target.value = '';
  };

  const move = (idx, dir) => {
    setItems((prev) => {
      const next = [...prev];
      const j = idx + dir;
      if (j < 0 || j >= next.length) return prev;
      [next[idx], next[j]] = [next[j], next[idx]];
      return next;
    });
    setResult(null);
  };

  const remove = (idx) => {
    setItems((prev) => prev.filter((_, i) => i !== idx));
    setResult(null);
  };

  async function merge() {
    if (!items.length) return;
    setBusy(true);
    setResult(null);
    const out = await PDFDocument.create();
    const opt = QUALITY[quality];
    const next = [...items];

    for (let i = 0; i < next.length; i++) {
      const it = next[i];
      try {
        if (it.isPdf) {
          const bytes = new Uint8Array(await it.file.arrayBuffer());
          const src = await PDFDocument.load(bytes); // PDF có mật khẩu sẽ throw
          const pages = await out.copyPages(src, src.getPageIndices());
          pages.forEach((p) => out.addPage(p));
        } else {
          const jpg = await imageToJpegBytes(it.file, opt);
          const emb = await out.embedJpg(jpg);
          const page = out.addPage([A4.w, A4.h]);
          const maxW = A4.w - MARGIN * 2;
          const maxH = A4.h - MARGIN * 2;
          const s = Math.min(maxW / emb.width, maxH / emb.height);
          const w = emb.width * s;
          const h = emb.height * s;
          page.drawImage(emb, { x: (A4.w - w) / 2, y: (A4.h - h) / 2, width: w, height: h });
        }
        next[i] = { ...it, bad: false };
      } catch {
        next[i] = { ...it, bad: true };
      }
    }
    setItems(next);

    if (out.getPageCount() > 0) {
      const bytes = await out.save({ useObjectStreams: true });
      const blob = new Blob([bytes], { type: 'application/pdf' });
      setResult({ url: URL.createObjectURL(blob), size: blob.size, pages: out.getPageCount() });
    }
    setBusy(false);
  }

  const dl = () => {
    if (!result) return;
    const a = document.createElement('a');
    a.href = result.url;
    a.download = 'merged.pdf';
    a.click();
  };

  return (
    <div className="grid">
      <div className="card">
        <h2>{t.inTitle}</h2>

        <div className="field">
          <label className="photo-pick">
            <input
              type="file"
              accept="application/pdf,image/jpeg,image/png"
              multiple
              onChange={onFiles}
              style={{ display: 'none' }}
            />
            <span>{t.pick}</span>
          </label>
          <div className="hint">{t.pickHint}</div>
        </div>

        <div className="field">
          <label htmlFor="pm-q">{t.qLbl}</label>
          <select id="pm-q" value={quality} onChange={(e) => setQuality(e.target.value)}>
            <option value="high">{t.qHigh}</option>
            <option value="med">{t.qMed}</option>
            <option value="low">{t.qLow}</option>
          </select>
        </div>

        {items.length === 0 ? (
          <div className="hint">{t.listEmpty}</div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '.45rem' }}>
            {items.map((it, i) => (
              <div key={it.id} className="pm-item">
                <span className="pm-n">{i + 1}.</span>
                <span className="pm-name" title={it.name}>
                  {it.isPdf ? '📄' : '🖼'} {it.name}
                  <em>
                    {' '}
                    · {fmtKB(it.size)}
                    {it.bad ? ' · ' + t.encrypted : ''}
                  </em>
                </span>
                <span className="pm-btns">
                  <button aria-label={t.up} onClick={() => move(i, -1)} disabled={i === 0}>↑</button>
                  <button aria-label={t.down} onClick={() => move(i, 1)} disabled={i === items.length - 1}>↓</button>
                  <button aria-label={t.remove} onClick={() => remove(i)} className="pm-x">✕</button>
                </span>
              </div>
            ))}
          </div>
        )}

        {items.length > 0 && (
          <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={merge} disabled={busy}>
            {busy ? t.working : t.merge}
          </button>
        )}
      </div>

      <div className="payslip">
        <div className="payslip-head">
          <span className="lbl">{t.psTitle}</span>
          <span className="fy">PDF</span>
        </div>
        <div style={{ padding: '1.3rem 1.5rem' }}>
          {!result && <div className="hint">{t.empty}</div>}
          {result && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.9rem' }}>
              <div className="lines" style={{ padding: 0, border: 'none' }}>
                <div className="line total">
                  <span className="k">merged.pdf</span>
                  <span className="v">
                    {fmtKB(result.size)} · {result.pages} {t.pages}
                  </span>
                </div>
              </div>
              <button className="btn-primary" onClick={dl}>{t.dl}</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
