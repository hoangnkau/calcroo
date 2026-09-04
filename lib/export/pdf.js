/* ============================================================
   CALCROO — PDF EXPORT (jsPDF + jspdf-autotable)
   Hoàn toàn client-side. Thư viện load động khi bấm nút.
   A4, logo vector, bảng biểu chọn được text (không phải ảnh),
   thanh phân bổ thu nhập vẽ bằng vector, footer disclaimer.
   ============================================================ */

import { formatDate, money } from './shared';

const GREEN = [14, 107, 79];
const INK = [23, 40, 31];
const MUTED = [95, 111, 102];
const LINE = [223, 229, 223];
const ALT = [243, 247, 244];

const hexToRgb = (h) => {
  const s = h.replace('#', '');
  return [parseInt(s.slice(0, 2), 16), parseInt(s.slice(2, 4), 16), parseInt(s.slice(4, 6), 16)];
};

export async function exportIncomePdf(model) {
  const [jspdfMod, autoTableMod] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ]);
  const jsPDF = jspdfMod.jsPDF || jspdfMod.default;
  const autoTable = autoTableMod.default || autoTableMod;

  const doc = new jsPDF({ unit: 'pt', format: 'a4', compress: true });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const M = 48;

  /* ---------- header + logo (vector) ---------- */
  doc.setFillColor(...GREEN);
  doc.circle(M + 8, M, 8, 'F');
  doc.setFillColor(255, 255, 255);
  doc.circle(M + 11, M - 3, 2.2, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...INK);
  doc.text('Calcroo', M + 24, M + 5);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  doc.text(`FY ${model.fyLabel}`, W - M, M, { align: 'right' });

  /* ---------- title ---------- */
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(19);
  doc.setTextColor(...INK);
  doc.text(model.title, M, M + 42);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  doc.text(`Generated ${formatDate(model.generatedAt)}  ·  calcroo.au`, M, M + 57);

  doc.setDrawColor(...LINE);
  doc.line(M, M + 68, W - M, M + 68);

  /* ---------- inputs ---------- */
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...INK);
  doc.text('Inputs', M, M + 88);

  autoTable(doc, {
    startY: M + 96,
    theme: 'plain',
    styles: { fontSize: 9, cellPadding: 2.5, textColor: INK },
    columnStyles: { 0: { cellWidth: 230, textColor: MUTED }, 1: { fontStyle: 'bold' } },
    body: model.meta.map((m) => [m.label, m.value]),
  });

  /* ---------- breakdown table ---------- */
  const per = (n, d) => money(n / d);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...INK);
  doc.text('Breakdown', M, doc.lastAutoTable.finalY + 22);

  autoTable(doc, {
    startY: doc.lastAutoTable.finalY + 30,
    head: [['Item', 'Per year', 'Per month', 'Per fortnight', 'Per week']],
    body: model.rows.map((r) => [
      r.label,
      money(r.annual),
      per(r.annual, 12),
      per(r.annual, 26),
      per(r.annual, 52),
    ]),
    styles: { fontSize: 9.5, cellPadding: 5, textColor: INK, lineColor: LINE, lineWidth: 0.3 },
    headStyles: { fillColor: GREEN, textColor: [255, 255, 255], fontStyle: 'bold', halign: 'right' },
    columnStyles: {
      0: { halign: 'left', cellWidth: 'auto' },
      1: { halign: 'right' },
      2: { halign: 'right' },
      3: { halign: 'right' },
      4: { halign: 'right' },
    },
    alternateRowStyles: { fillColor: ALT },
    didParseCell: (data) => {
      if (data.section !== 'body') return;
      const row = model.rows[data.row.index];
      if (row && row.kind === 'total') {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.textColor = GREEN;
        data.cell.styles.fillColor = [255, 255, 255];
      }
      if (data.column.index === 0) data.cell.styles.halign = 'left';
    },
  });

  let y = doc.lastAutoTable.finalY + 16;

  /* ---------- rates ---------- */
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(...INK);
  doc.text(
    `Effective tax rate:  ${model.rates.effectiveLabel}       Marginal tax rate:  ${model.rates.marginalLabel}`,
    M,
    y,
  );
  y += 24;

  /* ---------- allocation bar (vector) ---------- */
  const parts = (model.allocation && model.allocation.parts) || [];
  if (parts.length) {
    if (y + 90 > H - 130) {
      doc.addPage();
      y = M;
    }
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(...INK);
    doc.text('Where your package goes', M, y);
    y += 12;

    const barW = W - M * 2;
    const barH = 16;
    const total = parts.reduce((a, p) => a + p.value, 0) || 1;
    let x = M;
    doc.setDrawColor(255, 255, 255);
    doc.setLineWidth(0.75);
    parts.forEach((p) => {
      const w = (p.value / total) * barW;
      doc.setFillColor(...hexToRgb(p.color));
      doc.rect(x, y, w, barH, 'F');
      x += w;
    });
    doc.setLineWidth(0.3);
    y += barH + 14;

    // legend, 2 per line
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    const colW = barW / 2;
    parts.forEach((p, i) => {
      const cx = M + (i % 2) * colW;
      const cy = y + Math.floor(i / 2) * 15;
      doc.setFillColor(...hexToRgb(p.color));
      doc.rect(cx, cy - 6, 8, 8, 'F');
      doc.setTextColor(...INK);
      doc.text(`${p.label}`, cx + 13, cy);
      doc.setTextColor(...MUTED);
      doc.text(`${(p.pct * 100).toFixed(1)}%  ·  ${money(p.value)}`, cx + colW - 12, cy, { align: 'right' });
    });
    y += Math.ceil(parts.length / 2) * 15 + 12;
  }

  /* ---------- notes / footer ---------- */
  if (y > H - 120) {
    doc.addPage();
    y = M;
  }
  doc.setDrawColor(...LINE);
  doc.line(M, y, W - M, y);
  y += 14;
  doc.setFontSize(7.6);
  doc.setTextColor(...MUTED);
  model.notes.forEach((n) => {
    const lines = doc.splitTextToSize(n, W - M * 2);
    doc.text(lines, M, y);
    y += lines.length * 9 + 3;
  });

  /* page numbers */
  const pages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pages; i += 1) {
    doc.setPage(i);
    doc.setFontSize(7.5);
    doc.setTextColor(...MUTED);
    doc.text(`Page ${i} of ${pages}`, W - M, H - 24, { align: 'right' });
    doc.text('calcroo.au', M, H - 24);
  }

  doc.save(model.fileBase + '.pdf');
}
