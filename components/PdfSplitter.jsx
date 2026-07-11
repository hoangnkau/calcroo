'use client';

import { useState } from 'react';
import { PDFDocument } from 'pdf-lib';

const STRINGS = {
  en: {
    inTitle: 'Your PDF',
    pick: 'Choose a PDF',
    repick: 'Choose a different PDF',
    pickHint: 'Split entirely in your browser — the file is never uploaded.',
    loaded: (n) => `${n} pages loaded`,
    modeLbl: 'What do you want to do?',
    keep: 'Keep only these pages',
    remove: 'Remove these pages',
    rangeLbl: 'Pages (e.g. 1-3, 5, 8-10)',
    rangeHint: 'Comma-separated page numbers and ranges. Order is preserved.',
    split: 'Split PDF',
    working: 'Splitting…',
    badRange: '⚠ No valid pages in that range — check the numbers against the page count.',
    encrypted: '⚠ This PDF is password-protected. Open it with its password, Print → “Save as PDF”, then split that copy.',
    psTitle: 'Result',
    empty: 'Choose a PDF, enter pages, press Split.',
    pages: 'pages',
    dl: 'Download split PDF',
  },
  vi: {
    inTitle: 'File PDF của bạn',
    pick: 'Chọn PDF',
    repick: 'Chọn PDF khác',
    pickHint: 'Tách ngay trong trình duyệt — file không bao giờ được upload.',
    loaded: (n) => `Đã nạp ${n} trang`,
    modeLbl: 'Bạn muốn làm gì?',
    keep: 'Chỉ giữ những trang này',
    remove: 'Xóa những trang này',
    rangeLbl: 'Trang (vd: 1-3, 5, 8-10)',
    rangeHint: 'Số trang và khoảng trang, cách nhau dấu phẩy. Thứ tự được giữ nguyên.',
    split: 'Tách PDF',
    working: 'Đang tách…',
    badRange: '⚠ Không có trang hợp lệ trong khoảng đó — kiểm tra lại số trang.',
    encrypted: '⚠ PDF này có mật khẩu. Mở bằng mật khẩu, Print → “Save as PDF”, rồi tách bản đó.',
    psTitle: 'Kết quả',
    empty: 'Chọn PDF, nhập trang, bấm Tách.',
    pages: 'trang',
    dl: 'Tải PDF đã tách',
  },
};

const fmtKB = (b) => (b >= 1048576 ? (b / 1048576).toFixed(2) + ' MB' : Math.round(b / 1024) + ' KB');

function parseRanges(input, max) {
  const out = [];
  for (const part of input.split(',')) {
    const p = part.trim();
    if (!p) continue;
    const m = p.match(/^(\d+)\s*-\s*(\d+)$/);
    if (m) {
      const a = parseInt(m[1], 10);
      const b = parseInt(m[2], 10);
      for (let i = Math.min(a, b); i <= Math.max(a, b); i++) if (i >= 1 && i <= max) out.push(i - 1);
    } else if (/^\d+$/.test(p)) {
      const n = parseInt(p, 10);
      if (n >= 1 && n <= max) out.push(n - 1);
    }
  }
  return [...new Set(out)];
}

export default function PdfSplitter({ lang = 'en' }) {
  const t = STRINGS[lang];
  const [file, setFile] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [mode, setMode] = useState('keep');
  const [range, setRange] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [result, setResult] = useState(null);

  const onFile = async (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    setErr('');
    setResult(null);
    setPageCount(0);
    try {
      const src = await PDFDocument.load(new Uint8Array(await f.arrayBuffer()));
      setFile(f);
      setPageCount(src.getPageCount());
    } catch {
      setFile(null);
      setErr(t.encrypted);
    }
    e.target.value = '';
  };

  async function run() {
    if (!file) return;
    setBusy(true);
    setErr('');
    setResult(null);
    try {
      const src = await PDFDocument.load(new Uint8Array(await file.arrayBuffer()));
      const total = src.getPageCount();
      const sel = parseRanges(range, total);
      const idx =
        mode === 'keep'
          ? sel
          : Array.from({ length: total }, (_, i) => i).filter((i) => !sel.includes(i));
      if (!idx.length) {
        setErr(t.badRange);
        setBusy(false);
        return;
      }
      const out = await PDFDocument.create();
      const pages = await out.copyPages(src, idx);
      pages.forEach((p) => out.addPage(p));
      const bytes = await out.save({ useObjectStreams: true });
      const blob = new Blob([bytes], { type: 'application/pdf' });
      setResult({ url: URL.createObjectURL(blob), size: blob.size, pages: idx.length });
    } catch {
      setErr(t.encrypted);
    }
    setBusy(false);
  }

  const dl = () => {
    const a = document.createElement('a');
    a.href = result.url;
    a.download = 'split.pdf';
    a.click();
  };

  return (
    <div className="grid">
      <div className="card">
        <h2>{t.inTitle}</h2>
        <div className="field">
          <label className="photo-pick">
            <input type="file" accept="application/pdf" onChange={onFile} style={{ display: 'none' }} />
            <span>{file ? t.repick : t.pick}</span>
          </label>
          <div className="hint">{t.pickHint} {pageCount > 0 && <strong>{t.loaded(pageCount)}</strong>}</div>
        </div>

        {file && (
          <>
            <div className="field">
              <label htmlFor="ps-mode">{t.modeLbl}</label>
              <select id="ps-mode" value={mode} onChange={(e) => setMode(e.target.value)}>
                <option value="keep">{t.keep}</option>
                <option value="remove">{t.remove}</option>
              </select>
            </div>
            <div className="field">
              <label htmlFor="ps-range">{t.rangeLbl}</label>
              <input type="text" className="cv-in" id="ps-range" inputMode="numeric" autoComplete="off"
                placeholder="1-3, 5" value={range} onChange={(e) => setRange(e.target.value)} />
              <div className="hint">{t.rangeHint}</div>
            </div>
            <button className="btn-primary" onClick={run} disabled={busy || !range.trim()}>
              {busy ? t.working : t.split}
            </button>
          </>
        )}
        {err && (
          <div className="hint" style={{ marginTop: '.8rem', padding: '.7rem .9rem', border: '1.5px solid var(--danger)', borderRadius: 9, color: 'var(--danger)' }}>
            {err}
          </div>
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
                  <span className="k">split.pdf</span>
                  <span className="v">{fmtKB(result.size)} · {result.pages} {t.pages}</span>
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
