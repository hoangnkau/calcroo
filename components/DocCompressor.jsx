'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import DropZone from './DropZone';
import { createBulkImageProcessor } from '../lib/bulkImage';

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
    inTitle: 'Your document photos or scans',
    drop: 'Drop images here or click to choose',
    dropHint: 'JPG / PNG / WebP — add as many as you need. Everything runs in your browser; nothing is uploaded.',
    heicHint: 'iPhone HEIC not loading? Camera → Formats → “Most Compatible”, or re-save as JPEG.',
    targetLbl: 'Target size per file (your portal’s upload limit)',
    targetHint: 'immi/ImmiAccount ~5MB, most bank & gov portals 1–2MB, email 500KB–1MB.',
    compressAll: 'Compress all',
    working: 'Compressing…',
    queued: 'Queued',
    processing: 'Compressing',
    done: 'Done',
    failed: 'Failed',
    cantReach: 'smallest legible size',
    remove: 'Remove',
    clearAll: 'Clear all',
    dl: 'Download',
    dlAll: 'Download all',
    psTitle: 'Batch result',
    empty: 'Add images, pick a target size, then Compress all.',
    totalBefore: 'Total before',
    totalAfter: 'Total after',
    saved: 'saved',
    filesDone: 'files compressed',
    engineWorker: 'Background worker — UI stays responsive',
    engineMain: 'Worker unavailable — processing on the main thread',
  },
  vi: {
    inTitle: 'Ảnh giấy tờ / bản scan',
    drop: 'Kéo thả ảnh vào đây hoặc bấm để chọn',
    dropHint: 'JPG / PNG / WebP — thêm bao nhiêu tuỳ ý. Chạy ngay trên trình duyệt; không upload đi đâu.',
    heicHint: 'Ảnh HEIC iPhone không hiện? Camera → Formats → “Most Compatible”, hoặc lưu lại thành JPEG.',
    targetLbl: 'Dung lượng mục tiêu mỗi file (giới hạn upload của cổng nộp)',
    targetHint: 'immi/ImmiAccount ~5MB, đa số cổng ngân hàng & chính phủ 1–2MB, email 500KB–1MB.',
    compressAll: 'Nén tất cả',
    working: 'Đang nén…',
    queued: 'Chờ',
    processing: 'Đang nén',
    done: 'Xong',
    failed: 'Lỗi',
    cantReach: 'mức nhỏ nhất còn rõ chữ',
    remove: 'Xoá',
    clearAll: 'Xoá hết',
    dl: 'Tải về',
    dlAll: 'Tải tất cả',
    psTitle: 'Kết quả cả lô',
    empty: 'Thêm ảnh, chọn dung lượng mục tiêu, rồi bấm Nén tất cả.',
    totalBefore: 'Tổng trước',
    totalAfter: 'Tổng sau',
    saved: 'giảm',
    filesDone: 'file đã nén',
    engineWorker: 'Xử lý ngầm — UI không bị đơ',
    engineMain: 'Không dùng được worker — xử lý trên luồng chính',
  },
};

const fmtKB = (b) =>
  b >= 1024 * 1024 ? (b / 1024 / 1024).toFixed(2) + ' MB' : Math.round(b / 1024) + ' KB';

const isImage = (f) => /^image\/(jpeg|png|webp)$/.test(f.type) || /\.(jpe?g|png|webp)$/i.test(f.name);

let uid = 0;

export default function DocCompressor({ lang = 'en' }) {
  const t = STRINGS[lang];
  const [items, setItems] = useState([]);
  const [target, setTarget] = useState(1000);
  const [running, setRunning] = useState(false);
  const [engine, setEngine] = useState(null); // 'worker' | 'main'
  const procRef = useRef(null);
  const itemsRef = useRef(items);
  itemsRef.current = items;

  useEffect(
    () => () => {
      if (procRef.current) procRef.current.destroy();
      itemsRef.current.forEach((it) => it.result && it.result.url && URL.revokeObjectURL(it.result.url));
    },
    [],
  );

  const addFiles = useCallback((files) => {
    const next = files.filter(isImage).map((file) => ({
      id: 'f' + (uid += 1),
      file,
      name: file.name,
      size: file.size,
      status: 'queued',
      progress: 0,
      result: null,
      error: null,
    }));
    if (next.length) setItems((prev) => [...prev, ...next]);
  }, []);

  const patch = useCallback((id, fields) => {
    setItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...fields } : it)));
  }, []);

  const removeItem = useCallback((id) => {
    setItems((prev) => {
      const gone = prev.find((it) => it.id === id);
      if (gone && gone.result && gone.result.url) URL.revokeObjectURL(gone.result.url);
      return prev.filter((it) => it.id !== id);
    });
  }, []);

  const clearAll = useCallback(() => {
    itemsRef.current.forEach((it) => it.result && it.result.url && URL.revokeObjectURL(it.result.url));
    setItems([]);
  }, []);

  async function runAll() {
    if (running) return;
    const pending = itemsRef.current.filter((it) => it.status === 'queued' || it.status === 'error');
    if (!pending.length) return;

    setRunning(true);
    if (!procRef.current) procRef.current = createBulkImageProcessor();
    const proc = procRef.current;
    setEngine(proc.usingWorker ? 'worker' : 'main');

    for (const it of pending) {
      patch(it.id, { status: 'processing', progress: 0, error: null });
      let lastP = 0;
      try {
        const res = await proc.process(
          it.file,
          target * 1024,
          {},
          (p) => {
            if (p - lastP >= 0.05 || p === 1) {
              lastP = p;
              patch(it.id, { progress: p });
            }
          },
        );
        const url = URL.createObjectURL(res.blob);
        patch(it.id, {
          status: 'done',
          progress: 1,
          result: { blob: res.blob, url, w: res.w, h: res.h, reached: res.reached, size: res.blob.size },
        });
      } catch (e) {
        if (typeof console !== 'undefined') console.error('[Calcroo] compress failed', it.name, e);
        patch(it.id, { status: 'error', error: String((e && e.message) || e) });
      }
      // nhường luồng cho UI vẽ lại giữa các file
      await new Promise((r) => setTimeout(r, 0));
    }

    setEngine(proc.usingWorker ? 'worker' : 'main');
    setRunning(false);
  }

  function downloadOne(it) {
    if (!it.result) return;
    const a = document.createElement('a');
    a.href = it.result.url;
    a.download = it.name.replace(/\.(jpe?g|png|webp)$/i, '') + '-compressed.jpg';
    document.body.appendChild(a);
    a.click();
    a.remove();
  }

  function downloadAll() {
    const done = itemsRef.current.filter((it) => it.status === 'done');
    done.forEach((it, i) => setTimeout(() => downloadOne(it), i * 180));
  }

  const doneItems = items.filter((it) => it.status === 'done');
  const totalBefore = items.reduce((s, it) => s + it.size, 0);
  const totalAfter = doneItems.reduce((s, it) => s + (it.result ? it.result.size : 0), 0);
  const doneBefore = doneItems.reduce((s, it) => s + it.size, 0);
  const pct = doneBefore > 0 ? Math.round((1 - totalAfter / doneBefore) * 100) : 0;

  return (
    <div className="grid">
      <div className="card">
        <h2>{t.inTitle}</h2>

        <div className="field">
          <DropZone
            accept="image/jpeg,image/png,image/webp"
            disabled={running}
            label={t.drop}
            hint={t.dropHint}
            onFiles={addFiles}
          />
          <div className="hint">{t.heicHint}</div>
        </div>

        <div className="field">
          <label htmlFor="dc-target">{t.targetLbl}</label>
          <select id="dc-target" value={target} onChange={(e) => setTarget(+e.target.value)} disabled={running}>
            {PRESETS.map((p) => (
              <option key={p.kb} value={p.kb}>
                ≤ {p.label}
              </option>
            ))}
          </select>
          <div className="hint">{t.targetHint}</div>
        </div>

        {items.length > 0 && (
          <>
            <ul className="file-list">
              {items.map((it) => (
                <li key={it.id} className={`file-row is-${it.status}`}>
                  {it.result ? (
                    <img className="file-thumb" src={it.result.url} alt="" loading="lazy" />
                  ) : (
                    <span className="file-thumb ph">🖼</span>
                  )}
                  <div className="file-main">
                    <span className="file-name" title={it.name}>{it.name}</span>
                    <span className="file-meta">
                      {it.status === 'done' && it.result
                        ? `${fmtKB(it.size)} → ${fmtKB(it.result.size)}` +
                          (it.result.reached ? '' : ` · ${t.cantReach}`)
                        : it.status === 'error'
                        ? t.failed
                        : `${fmtKB(it.size)} · ${t[it.status] || it.status}`}
                    </span>
                    {it.status === 'processing' && (
                      <span className="file-bar">
                        <span className="file-bar-fill" style={{ width: Math.round(it.progress * 100) + '%' }} />
                      </span>
                    )}
                  </div>
                  <div className="file-actions">
                    {it.status === 'done' && (
                      <button type="button" className="file-btn" onClick={() => downloadOne(it)}>
                        ⬇
                      </button>
                    )}
                    <button
                      type="button"
                      className="file-btn file-btn-x"
                      onClick={() => removeItem(it.id)}
                      disabled={running && it.status === 'processing'}
                      aria-label={t.remove}
                    >
                      ✕
                    </button>
                  </div>
                </li>
              ))}
            </ul>

            <div className="file-list-actions">
              <button type="button" className="btn-primary" onClick={runAll} disabled={running}>
                {running ? t.working : t.compressAll}
              </button>
              <button type="button" className="cv-rm" onClick={clearAll} disabled={running}>
                {t.clearAll}
              </button>
            </div>
            {engine && (
              <div className="hint engine-badge">
                {engine === 'worker' ? '⚙ ' + t.engineWorker : '• ' + t.engineMain}
              </div>
            )}
          </>
        )}
      </div>

      <div className="payslip">
        <div className="payslip-head">
          <span className="lbl">{t.psTitle}</span>
          <span className="fy">JPEG</span>
        </div>
        <div style={{ padding: '1.3rem 1.5rem' }}>
          {items.length === 0 && <div className="hint">{t.empty}</div>}
          {items.length > 0 && (
            <div className="lines" style={{ padding: 0, border: 'none' }}>
              <div className="line">
                <span className="k">{t.totalBefore}</span>
                <span className="v">{fmtKB(totalBefore)}</span>
              </div>
              {doneItems.length > 0 && (
                <>
                  <div className="line total">
                    <span className="k">{t.totalAfter}</span>
                    <span className="v">{fmtKB(totalAfter)}</span>
                  </div>
                  <div className="line plus">
                    <span className="k">
                      {doneItems.length} {t.filesDone}
                    </span>
                    <span className="v">−{pct}% {t.saved}</span>
                  </div>
                </>
              )}
            </div>
          )}
          {doneItems.length > 0 && (
            <button type="button" className="btn-primary" style={{ marginTop: '1rem' }} onClick={downloadAll}>
              ⬇ {t.dlAll} ({doneItems.length})
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
