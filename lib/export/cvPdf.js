/* ============================================================
   CALCROO — CV -> PDF (jsPDF, text-selectable, ATS-friendly)
   Một cột, font chuẩn, tiêu đề mục rõ ràng, KHÔNG bảng/không ảnh
   -> ATS của công ty Úc đọc tốt. Thư viện load động khi bấm nút.

   Giới hạn: font chuẩn jsPDF là WinAnsi -> không có dấu tiếng Việt.
   Nếu CV chứa ký tự ngoài Latin-1, trả {ok:false} để UI hướng
   người dùng sang nút In (giữ nguyên dấu).
   ============================================================ */

const NON_LATIN1 = /[^\u0000-\u00FF]/;

const clean = (s) => String(s == null ? '' : s).replace(/\s+/g, ' ').trim();

function collectText(cv) {
  const parts = [cv.name, cv.title, cv.phone, cv.email, cv.location, cv.summary, cv.skills, cv.refereeText];
  (cv.experience || []).forEach((e) => parts.push(e.role, e.company, e.dates, e.bullets));
  (cv.education || []).forEach((e) => parts.push(e.degree, e.school, e.year));
  return parts.filter(Boolean).join(' ');
}

/**
 * @param {object} cv
 * @param {{ sectionSummary?:string, sectionExp?:string, sectionEdu?:string,
 *           sectionSkills?:string, sectionRef?:string, refOnRequest?:string,
 *           fileName?:string }} [labels]
 * @returns {Promise<{ok:true} | {ok:false, reason:'non-latin'|'error'}>}
 */
export async function exportCvPdf(cv, labels = {}) {
  if (NON_LATIN1.test(collectText(cv))) {
    return { ok: false, reason: 'non-latin' };
  }

  try {
    const jspdfMod = await import('jspdf');
    const jsPDF = jspdfMod.jsPDF || jspdfMod.default;

    const L = {
      sectionSummary: 'Summary',
      sectionExp: 'Experience',
      sectionEdu: 'Education',
      sectionSkills: 'Skills',
      sectionRef: 'Referees',
      refOnRequest: 'Available on request.',
      fileName: 'cv',
      ...labels,
    };

    const doc = new jsPDF({ unit: 'pt', format: 'a4', compress: true });
    const W = doc.internal.pageSize.getWidth();
    const H = doc.internal.pageSize.getHeight();
    const M = 54;
    const MAXW = W - M * 2;
    let y = M;

    const ink = [17, 17, 17];
    const grey = [90, 90, 90];

    const need = (h) => {
      if (y + h > H - M) {
        doc.addPage();
        y = M;
      }
    };
    const text = (str, size, style, color, gap) => {
      doc.setFont('helvetica', style || 'normal');
      doc.setFontSize(size);
      doc.setTextColor(...(color || ink));
      const lines = doc.splitTextToSize(clean(str), MAXW);
      lines.forEach((ln) => {
        need(size + 3);
        doc.text(ln, M, y);
        y += size + 3;
      });
      if (gap) y += gap;
    };
    const sectionHead = (label) => {
      y += 8;
      need(22);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(10.5);
      doc.setTextColor(...ink);
      doc.text(label.toUpperCase(), M, y);
      y += 5;
      doc.setDrawColor(30, 30, 30);
      doc.setLineWidth(0.8);
      doc.line(M, y, W - M, y);
      y += 12;
    };

    // ---- header ----
    text(cv.name || 'Your Name', 18, 'bold', ink, 2);
    if (clean(cv.title)) text(cv.title, 11, 'normal', grey, 2);
    const contact = [cv.phone, cv.email, cv.location].map(clean).filter(Boolean).join('   |   ');
    if (contact) text(contact, 9.5, 'normal', grey, 4);

    // ---- summary ----
    if (clean(cv.summary)) {
      sectionHead(L.sectionSummary);
      text(cv.summary, 9.8, 'normal', ink, 2);
    }

    // ---- experience ----
    const exp = (cv.experience || []).filter((e) => clean(e.role) || clean(e.company));
    if (exp.length) {
      sectionHead(L.sectionExp);
      exp.forEach((e) => {
        need(30);
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(10.5);
        doc.setTextColor(...ink);
        doc.text(clean(e.role) || clean(e.company), M, y);
        if (clean(e.dates)) {
          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(...grey);
          doc.text(clean(e.dates), W - M, y, { align: 'right' });
        }
        y += 14;
        if (clean(e.company) && clean(e.role)) {
          doc.setFont('helvetica', 'italic');
          doc.setFontSize(9.5);
          doc.setTextColor(...grey);
          doc.text(clean(e.company), M, y);
          y += 13;
        }
        String(e.bullets || '')
          .split('\n')
          .map((b) => clean(b))
          .filter(Boolean)
          .forEach((b) => {
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(9.6);
            doc.setTextColor(...ink);
            const lines = doc.splitTextToSize(b, MAXW - 14);
            lines.forEach((ln, idx) => {
              need(13);
              doc.text(idx === 0 ? '•' : '', M, y);
              doc.text(ln, M + 14, y);
              y += 13;
            });
          });
        y += 6;
      });
    }

    // ---- education ----
    const edu = (cv.education || []).filter((e) => clean(e.degree) || clean(e.school));
    if (edu.length) {
      sectionHead(L.sectionEdu);
      edu.forEach((e) => {
        need(15);
        const left = [clean(e.degree), clean(e.school)].filter(Boolean).join(' — ');
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9.8);
        doc.setTextColor(...ink);
        doc.text(left, M, y);
        if (clean(e.year)) {
          doc.setTextColor(...grey);
          doc.text(clean(e.year), W - M, y, { align: 'right' });
        }
        y += 14;
      });
    }

    // ---- skills ----
    const skills = String(cv.skills || '')
      .split(',')
      .map((s) => clean(s))
      .filter(Boolean);
    if (skills.length) {
      sectionHead(L.sectionSkills);
      text(skills.join('  ·  '), 9.8, 'normal', ink, 2);
    }

    // ---- referees ----
    sectionHead(L.sectionRef);
    const ref = cv.referees === 'list' && clean(cv.refereeText) ? cv.refereeText : L.refOnRequest;
    text(ref, 9.8, 'normal', ink, 0);

    doc.save((clean(cv.name).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || L.fileName) + '-cv.pdf');
    return { ok: true };
  } catch (e) {
    if (typeof console !== 'undefined') console.error('[Calcroo] CV PDF failed', e);
    return { ok: false, reason: 'error' };
  }
}
