/* ============================================================
   CALCROO — EXCEL EXPORT (SheetJS / xlsx)
   Hoàn toàn client-side. Thư viện load động khi bấm nút.
   .xlsx: header, khối input, bảng dữ liệu, CÔNG THỨC Excel
   (per-period = annual/N, super = gross*rate, net = tổng).
   ============================================================ */

import { SUPER } from '../tax';
import { formatDate, triggerDownload } from './shared';

const MONEY_FMT = '$#,##0;[Red]-$#,##0';

export async function exportIncomeExcel(model) {
  const XLSX = await import('xlsx');

  const aoa = [];
  const merges = [];

  aoa.push([`Calcroo — ${model.title}`]);
  merges.push({ s: { r: 0, c: 0 }, e: { r: 0, c: 4 } });
  aoa.push([`FY ${model.fyLabel} · Generated ${formatDate(model.generatedAt)} · calcroo.au`]);
  merges.push({ s: { r: 1, c: 0 }, e: { r: 1, c: 4 } });
  aoa.push([]);

  aoa.push(['Inputs']);
  model.meta.forEach((m) => aoa.push([m.label, m.value]));
  aoa.push([]);

  aoa.push(['Item', 'Per year', 'Per month', 'Per fortnight', 'Per week']);

  const rowByKey = {};
  model.rows.forEach((r) => {
    rowByKey[r.key] = aoa.length; // 0-based; +1 = số dòng Excel
    aoa.push([r.label, r.annual, null, null, null]);
  });

  aoa.push([]);
  aoa.push([`Effective tax rate`, model.rates.effectiveLabel]);
  aoa.push([`Marginal tax rate`, model.rates.marginalLabel]);
  aoa.push([]);
  aoa.push(['Notes']);
  const notesStart = aoa.length;
  model.notes.forEach((n) => aoa.push([n]));
  model.notes.forEach((_, i) =>
    merges.push({ s: { r: notesStart + i, c: 0 }, e: { r: notesStart + i, c: 4 } }),
  );

  const ws = XLSX.utils.aoa_to_sheet(aoa);

  const R = (k) => rowByKey[k] + 1;
  const has = (k) => k in rowByKey;

  model.rows.forEach((r) => {
    const rr = R(r.key);

    if (r.kind === 'super' && has('gross')) {
      ws['B' + rr] = { t: 'n', f: `B${R('gross')}*${SUPER.sgRate}`, v: r.annual, z: MONEY_FMT };
    } else if (r.kind === 'total') {
      const terms = ['gross', 'tax', 'lito', 'medicare', 'hecs'].filter(has).map((k) => 'B' + R(k));
      ws['B' + rr] = { t: 'n', f: terms.join('+'), v: r.annual, z: MONEY_FMT };
    } else {
      ws['B' + rr] = { t: 'n', v: r.annual, z: MONEY_FMT };
    }

    [['C', 12], ['D', 26], ['E', 52]].forEach(([col, div]) => {
      ws[col + rr] = { t: 'n', f: `B${rr}/${div}`, v: r.annual / div, z: MONEY_FMT };
    });
  });

  ws['!cols'] = [{ wch: 40 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];
  ws['!merges'] = merges;

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Breakdown');

  const out = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  triggerDownload(
    new Blob([out], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    }),
    model.fileBase + '.xlsx',
  );
}
