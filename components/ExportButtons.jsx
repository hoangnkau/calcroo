'use client';

import { useState } from 'react';

const STRINGS = {
  en: {
    excel: 'Export Excel',
    pdf: 'Export PDF',
    busyExcel: 'Building spreadsheet…',
    busyPdf: 'Building PDF…',
    err: 'Could not generate the file. Check your connection and try again, or use another browser.',
    hint: 'Runs entirely in your browser — nothing is uploaded.',
  },
  vi: {
    excel: 'Xuất Excel',
    pdf: 'Xuất PDF',
    busyExcel: 'Đang tạo bảng tính…',
    busyPdf: 'Đang tạo PDF…',
    err: 'Không tạo được file. Kiểm tra kết nối và thử lại, hoặc dùng trình duyệt khác.',
    hint: 'Chạy hoàn toàn trong trình duyệt — không tải gì lên máy chủ.',
  },
};

/**
 * @param {{ getModel: () => object, lang?: 'en'|'vi' }} props
 *   getModel: trả về export-model tại thời điểm bấm (đọc state mới nhất).
 */
export default function ExportButtons({ getModel, lang = 'en' }) {
  const t = STRINGS[lang] || STRINGS.en;
  const [busy, setBusy] = useState(null); // 'xlsx' | 'pdf' | null
  const [error, setError] = useState(false);

  async function run(kind) {
    if (busy) return;
    setBusy(kind);
    setError(false);
    try {
      const model = getModel();
      if (kind === 'xlsx') {
        const { exportIncomeExcel } = await import('../lib/export/excel');
        await exportIncomeExcel(model);
      } else {
        const { exportIncomePdf } = await import('../lib/export/pdf');
        await exportIncomePdf(model);
      }
    } catch (e) {
      if (typeof console !== 'undefined') console.error('[Calcroo] export failed', e);
      setError(true);
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="export-bar no-print">
      <div className="export-btns">
        <button type="button" className="btn-secondary" disabled={!!busy} onClick={() => run('xlsx')}>
          {busy === 'xlsx' ? (
            <>
              <span className="spinner" aria-hidden="true" /> {t.busyExcel}
            </>
          ) : (
            <>⬇ {t.excel}</>
          )}
        </button>
        <button type="button" className="btn-secondary" disabled={!!busy} onClick={() => run('pdf')}>
          {busy === 'pdf' ? (
            <>
              <span className="spinner" aria-hidden="true" /> {t.busyPdf}
            </>
          ) : (
            <>⬇ {t.pdf}</>
          )}
        </button>
      </div>
      {error ? <p className="export-err">{t.err}</p> : <p className="export-hint">{t.hint}</p>}
    </div>
  );
}
