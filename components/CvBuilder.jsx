'use client';

import { useEffect, useRef, useState } from 'react';
import { scanJobAd, highlightSegments } from '../lib/cv/keywords';

const EMPTY = {
  name: '',
  title: '',
  phone: '',
  email: '',
  location: '',
  summary: '',
  experience: [{ role: '', company: '', dates: '', bullets: '' }],
  education: [{ degree: '', school: '', year: '' }],
  skills: '',
  referees: 'request',
  refereeText: '',
};

const STRINGS = {
  en: {
    inTitle: 'Your details',
    name: 'Full name',
    title: 'Professional title (e.g. Retail Assistant, Junior Accountant)',
    phone: 'Phone',
    email: 'Email',
    location: 'Suburb, State (e.g. Bankstown, NSW)',
    locationHint: 'Australian CVs: no photo, no date of birth, no full street address — suburb and state is enough.',
    summary: 'Professional summary (2–3 sentences)',
    expTitle: 'Experience',
    role: 'Job title',
    company: 'Company',
    dates: 'Dates (e.g. Mar 2024 – present)',
    bullets: 'Achievements — one per line, start with an action verb',
    addExp: '+ Add another role',
    eduTitle: 'Education',
    degree: 'Qualification',
    school: 'Institution',
    year: 'Year',
    addEdu: '+ Add education',
    skills: 'Skills (comma separated)',
    refTitle: 'Referees',
    refRequest: '"Available on request" (standard)',
    refList: 'List referees',
    refText: 'Name — role, company, phone',
    remove: 'Remove',
    psTitle: 'Preview — A4',
    print: 'Download PDF',
    printHint: 'One-click A4 PDF with real, selectable text — exactly what Australian ATS systems parse. No images, no rasterising.',
    pdfBusy: 'Building PDF…',
    pdfNonLatin: 'The one-click PDF supports Latin characters only. Your CV has Vietnamese diacritics — use “Print → Save as PDF” below to keep them intact.',
    pdfErr: 'Could not build the PDF. Try “Print → Save as PDF” instead.',
    printAlt: 'Print → Save as PDF',
    printAltHint: 'Alternative: your browser’s print dialog. Untick “Headers and footers” for a clean ATS file.',
    kwAdd: 'add to Skills',
    clear: 'Clear all data',
    clearConfirm: 'Delete all CV data saved in this browser?',
    saved: 'Autosaved in your browser — nothing is uploaded.',
    cvSummary: 'Summary',
    cvExp: 'Experience',
    cvEdu: 'Education',
    cvSkills: 'Skills',
    cvRef: 'Referees',
    cvRefRequest: 'Available on request.',
    kwTitle: 'Match a job ad',
    kwHint: 'Paste the job ad text — we pull out the key skills and check which already appear in your CV. Nothing is sent anywhere; this runs in your browser.',
    kwPlaceholder: 'Paste the job description here…',
    kwAnalyze: 'Analyse match',
    kwScore: 'keyword match',
    kwOk: 'Already in your CV',
    kwMiss: 'Missing — add if genuinely true',
    kwNone: 'Could not find enough distinct keywords — try pasting the full "requirements" or "about you" section.',
  },
  vi: {
    inTitle: 'Thông tin của bạn',
    name: 'Họ tên',
    title: 'Chức danh (vd: Retail Assistant, Junior Accountant)',
    phone: 'Điện thoại',
    email: 'Email',
    location: 'Suburb, Bang (vd: Bankstown, NSW)',
    locationHint: 'CV chuẩn Úc: không ảnh, không ngày sinh, không địa chỉ đầy đủ — suburb và bang là đủ.',
    summary: 'Tóm tắt nghề nghiệp (2–3 câu)',
    expTitle: 'Kinh nghiệm',
    role: 'Vị trí',
    company: 'Công ty',
    dates: 'Thời gian (vd: Mar 2024 – present)',
    bullets: 'Thành tích — mỗi dòng một ý, bắt đầu bằng động từ',
    addExp: '+ Thêm vị trí',
    eduTitle: 'Học vấn',
    degree: 'Bằng cấp',
    school: 'Trường',
    year: 'Năm',
    addEdu: '+ Thêm học vấn',
    skills: 'Kỹ năng (phân cách bằng dấu phẩy)',
    refTitle: 'Người tham chiếu',
    refRequest: '"Available on request" (chuẩn phổ biến)',
    refList: 'Liệt kê người tham chiếu',
    refText: 'Tên — chức vụ, công ty, số điện thoại',
    remove: 'Xóa',
    psTitle: 'Xem trước — A4',
    print: 'Tải PDF',
    printHint: 'PDF A4 một chạm, chữ thật chọn-copy được — đúng thứ hệ thống ATS của công ty Úc cần. Không ảnh, không rasterize.',
    pdfBusy: 'Đang tạo PDF…',
    pdfNonLatin: 'PDF một chạm chỉ hỗ trợ ký tự Latin. CV của bạn có dấu tiếng Việt — hãy dùng “In → Lưu PDF” bên dưới để giữ nguyên dấu.',
    pdfErr: 'Không tạo được PDF. Hãy dùng “In → Lưu PDF”.',
    printAlt: 'In → Lưu PDF',
    printAltHint: 'Cách khác: hộp thoại in của trình duyệt. Bỏ chọn “Headers and footers” để file sạch cho ATS.',
    kwAdd: 'thêm vào Kỹ năng',
    clear: 'Xóa toàn bộ dữ liệu',
    clearConfirm: 'Xóa toàn bộ dữ liệu CV lưu trong trình duyệt này?',
    saved: 'Tự lưu trong trình duyệt của bạn — không upload đi đâu.',
    cvSummary: 'Summary',
    cvExp: 'Experience',
    cvEdu: 'Education',
    cvSkills: 'Skills',
    cvRef: 'Referees',
    cvRefRequest: 'Available on request.',
    kwTitle: 'So khớp với tin tuyển dụng',
    kwHint: 'Dán nội dung tin tuyển dụng — công cụ bóc từ khóa kỹ năng chính và kiểm tra CV của bạn đã có từ nào. Không gửi đi đâu cả; chạy ngay trong trình duyệt.',
    kwPlaceholder: 'Dán mô tả công việc vào đây…',
    kwAnalyze: 'Phân tích',
    kwScore: 'từ khóa khớp',
    kwOk: 'Đã có trong CV',
    kwMiss: 'Còn thiếu — thêm nếu đúng sự thật',
    kwNone: 'Chưa tìm đủ từ khóa riêng biệt — thử dán trọn phần "requirements" hoặc "about you".',
  },
};

const KEY = 'calcroo-cv-v1';

/* Highlight từ khoá đã khớp trong preview (chỉ trên màn hình, không in ra PDF). */
function Hi({ text, terms }) {
  if (!terms || !terms.length || !text) return text || null;
  return highlightSegments(text, terms).map((seg, i) =>
    seg.hit ? (
      <mark className="cv-hi" key={i}>
        {seg.text}
      </mark>
    ) : (
      <span key={i}>{seg.text}</span>
    ),
  );
}

export default function CvBuilder({ lang = 'en' }) {
  const t = STRINGS[lang];
  const [cv, setCv] = useState(EMPTY);
  const loaded = useRef(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setCv({ ...EMPTY, ...JSON.parse(raw) });
    } catch {}
    loaded.current = true;
  }, []);

  useEffect(() => {
    if (!loaded.current) return;
    const id = setTimeout(() => {
      try {
        localStorage.setItem(KEY, JSON.stringify(cv));
      } catch {}
    }, 400);
    return () => clearTimeout(id);
  }, [cv]);

  const set = (k) => (e) => setCv({ ...cv, [k]: e.target.value });
  const setArr = (arrKey, i, k) => (e) => {
    const next = cv[arrKey].map((it, j) => (j === i ? { ...it, [k]: e.target.value } : it));
    setCv({ ...cv, [arrKey]: next });
  };
  const addRow = (arrKey, empty) => () => setCv({ ...cv, [arrKey]: [...cv[arrKey], empty] });
  const rmRow = (arrKey, i) => () => setCv({ ...cv, [arrKey]: cv[arrKey].filter((_, j) => j !== i) });

  const clearAll = () => {
    if (confirm(t.clearConfirm)) {
      setCv(EMPTY);
      try {
        localStorage.removeItem(KEY);
      } catch {}
    }
  };

  const contact = [cv.phone, cv.email, cv.location].filter(Boolean).join('  ·  ');
  const skills = cv.skills.split(',').map((s) => s.trim()).filter(Boolean);

  const [jobAd, setJobAd] = useState('');
  const [kw, setKw] = useState(null);
  const [pdfBusy, setPdfBusy] = useState(false);
  const [pdfMsg, setPdfMsg] = useState(null); // null | 'non-latin' | 'error'

  function analyze() {
    const res = scanJobAd(jobAd, cv);
    setKw(res.enough ? { ...res, none: false } : { matched: [], missing: [], none: true });
  }

  // gợi ý: chèn nhanh 1 từ khoá còn thiếu vào ô Skills
  function addToSkills(term) {
    setCv((prev) => {
      const cur = prev.skills.trim();
      if (new RegExp('(^|,\\s*)' + term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\s*(,|$)', 'i').test(cur)) {
        return prev;
      }
      return { ...prev, skills: cur ? `${cur}, ${term}` : term };
    });
    setKw((prev) =>
      prev
        ? {
            ...prev,
            matched: [...prev.matched, term],
            missing: prev.missing.filter((m) => m !== term),
          }
        : prev,
    );
  }

  async function downloadPdf() {
    if (pdfBusy) return;
    setPdfBusy(true);
    setPdfMsg(null);
    try {
      const { exportCvPdf } = await import('../lib/export/cvPdf');
      const r = await exportCvPdf(cv, {
        sectionSummary: t.cvSummary,
        sectionExp: t.cvExp,
        sectionEdu: t.cvEdu,
        sectionSkills: t.cvSkills,
        sectionRef: t.cvRef,
        refOnRequest: t.cvRefRequest,
      });
      if (!r.ok) setPdfMsg(r.reason === 'non-latin' ? 'non-latin' : 'error');
    } catch (e) {
      if (typeof console !== 'undefined') console.error('[Calcroo] CV PDF failed', e);
      setPdfMsg('error');
    } finally {
      setPdfBusy(false);
    }
  }

  const kwTerms = kw && !kw.none ? kw.matched : [];

  return (
    <div className="grid cv-grid">
      <div className="card no-print">
        <h2>{t.inTitle}</h2>

        <div className="field"><label>{t.name}</label><input type="text" className="cv-in" value={cv.name} onChange={set('name')} /></div>
        <div className="field"><label>{t.title}</label><input type="text" className="cv-in" value={cv.title} onChange={set('title')} /></div>
        <div className="grid" style={{ gap: '.7rem', gridTemplateColumns: '1fr 1fr' }}>
          <div className="field"><label>{t.phone}</label><input type="text" className="cv-in" value={cv.phone} onChange={set('phone')} /></div>
          <div className="field"><label>{t.email}</label><input type="text" className="cv-in" value={cv.email} onChange={set('email')} /></div>
        </div>
        <div className="field">
          <label>{t.location}</label>
          <input type="text" className="cv-in" value={cv.location} onChange={set('location')} />
          <div className="hint">{t.locationHint}</div>
        </div>
        <div className="field">
          <label>{t.summary}</label>
          <textarea className="cv-in" rows={3} value={cv.summary} onChange={set('summary')} />
        </div>

        <h2 style={{ marginTop: '1.4rem' }}>{t.expTitle}</h2>
        {cv.experience.map((ex, i) => (
          <div key={i} className="cv-block">
            <div className="grid" style={{ gap: '.7rem', gridTemplateColumns: '1fr 1fr' }}>
              <div className="field"><label>{t.role}</label><input type="text" className="cv-in" value={ex.role} onChange={setArr('experience', i, 'role')} /></div>
              <div className="field"><label>{t.company}</label><input type="text" className="cv-in" value={ex.company} onChange={setArr('experience', i, 'company')} /></div>
            </div>
            <div className="field"><label>{t.dates}</label><input type="text" className="cv-in" value={ex.dates} onChange={setArr('experience', i, 'dates')} /></div>
            <div className="field"><label>{t.bullets}</label><textarea className="cv-in" rows={3} value={ex.bullets} onChange={setArr('experience', i, 'bullets')} /></div>
            {cv.experience.length > 1 && (
              <button className="cv-rm" onClick={rmRow('experience', i)}>✕ {t.remove}</button>
            )}
          </div>
        ))}
        <button className="btn-secondary" onClick={addRow('experience', { role: '', company: '', dates: '', bullets: '' })}>{t.addExp}</button>

        <h2 style={{ marginTop: '1.4rem' }}>{t.eduTitle}</h2>
        {cv.education.map((ed, i) => (
          <div key={i} className="cv-block">
            <div className="field"><label>{t.degree}</label><input type="text" className="cv-in" value={ed.degree} onChange={setArr('education', i, 'degree')} /></div>
            <div className="grid" style={{ gap: '.7rem', gridTemplateColumns: '2fr 1fr' }}>
              <div className="field"><label>{t.school}</label><input type="text" className="cv-in" value={ed.school} onChange={setArr('education', i, 'school')} /></div>
              <div className="field"><label>{t.year}</label><input type="text" className="cv-in" value={ed.year} onChange={setArr('education', i, 'year')} /></div>
            </div>
            {cv.education.length > 1 && (
              <button className="cv-rm" onClick={rmRow('education', i)}>✕ {t.remove}</button>
            )}
          </div>
        ))}
        <button className="btn-secondary" onClick={addRow('education', { degree: '', school: '', year: '' })}>{t.addEdu}</button>

        <div className="field" style={{ marginTop: '1.4rem' }}>
          <label>{t.skills}</label>
          <textarea className="cv-in" rows={2} value={cv.skills} onChange={set('skills')} />
        </div>

        <div className="field">
          <label>{t.refTitle}</label>
          <select value={cv.referees} onChange={set('referees')}>
            <option value="request">{t.refRequest}</option>
            <option value="list">{t.refList}</option>
          </select>
          {cv.referees === 'list' && (
            <textarea className="cv-in" rows={2} style={{ marginTop: '.5rem' }} placeholder={t.refText} value={cv.refereeText} onChange={set('refereeText')} />
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '.55rem', marginTop: '1.2rem' }}>
          <button className="btn-primary" onClick={downloadPdf} disabled={pdfBusy}>
            {pdfBusy ? (
              <><span className="spinner" aria-hidden="true" /> {t.pdfBusy}</>
            ) : (
              <>⬇ {t.print}</>
            )}
          </button>
          <div className="hint">{t.printHint}</div>
          {pdfMsg === 'non-latin' && <div className="export-err">{t.pdfNonLatin}</div>}
          {pdfMsg === 'error' && <div className="export-err">{t.pdfErr}</div>}

          <button className="btn-secondary" onClick={() => window.print()} style={{ width: 'auto' }}>
            🖨 {t.printAlt}
          </button>
          <div className="hint">{t.printAltHint}</div>

          <div className="hint">💾 {t.saved}</div>
          <button className="cv-rm" onClick={clearAll} style={{ alignSelf: 'flex-start' }}>{t.clear}</button>
        </div>

        <details className="adv" style={{ marginTop: '1.3rem' }}>
          <summary>{t.kwTitle}</summary>
          <div className="field">
            <textarea
              className="cv-in"
              rows={5}
              placeholder={t.kwPlaceholder}
              value={jobAd}
              onChange={(e) => setJobAd(e.target.value)}
            />
            <div className="hint">{t.kwHint}</div>
          </div>
          <button className="btn-primary" onClick={analyze} disabled={!jobAd.trim()}>{t.kwAnalyze}</button>

          {kw && kw.none && <div className="hint" style={{ marginTop: '.8rem' }}>{t.kwNone}</div>}

          {kw && !kw.none && (
            <div style={{ marginTop: '1rem' }}>
              <div className="kw-score" style={{ color: 'var(--green)' }}>
                {kw.matched.length}/{kw.matched.length + kw.missing.length}{' '}
                <span style={{ fontSize: '.8rem', fontWeight: 500, color: 'var(--muted)' }}>{t.kwScore}</span>
              </div>
              {kw.matched.length > 0 && (
                <div style={{ marginTop: '.7rem' }}>
                  <div className="hint" style={{ marginBottom: '.3rem' }}>{t.kwOk}</div>
                  {kw.matched.map((k) => (
                    <span className="kw-chip ok" key={k}>✓ {k}</span>
                  ))}
                </div>
              )}
              {kw.missing.length > 0 && (
                <div style={{ marginTop: '.9rem' }}>
                  <div className="hint" style={{ marginBottom: '.3rem' }}>{t.kwMiss}</div>
                  {kw.missing.map((k) => (
                    <button
                      type="button"
                      className="kw-chip miss"
                      key={k}
                      onClick={() => addToSkills(k)}
                      title={t.kwAdd}
                    >
                      + {k}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </details>
      </div>

      <div className="cv-wrap">
        <div className="payslip-head no-print" style={{ borderRadius: '14px 14px 0 0' }}>
          <span className="lbl">{t.psTitle}</span>
          <span className="fy">ATS-friendly</span>
        </div>
        <div className="cv-sheet">
          <h1 className="cv-name">{cv.name || '—'}</h1>
          {cv.title && <div className="cv-title">{cv.title}</div>}
          {contact && <div className="cv-contact">{contact}</div>}

          {cv.summary && (
            <>
              <h2 className="cv-h">{t.cvSummary}</h2>
              <p className="cv-p"><Hi text={cv.summary} terms={kwTerms} /></p>
            </>
          )}

          {cv.experience.some((e) => e.role || e.company) && (
            <>
              <h2 className="cv-h">{t.cvExp}</h2>
              {cv.experience.filter((e) => e.role || e.company).map((ex, i) => (
                <div key={i} className="cv-job">
                  <div className="cv-job-head">
                    <strong>{ex.role}</strong>
                    <span>{ex.dates}</span>
                  </div>
                  <div className="cv-company">{ex.company}</div>
                  {ex.bullets.trim() && (
                    <ul className="cv-ul">
                      {ex.bullets.split('\n').map((b) => b.trim()).filter(Boolean).map((b, j) => (
                        <li key={j}><Hi text={b} terms={kwTerms} /></li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </>
          )}

          {cv.education.some((e) => e.degree || e.school) && (
            <>
              <h2 className="cv-h">{t.cvEdu}</h2>
              {cv.education.filter((e) => e.degree || e.school).map((ed, i) => (
                <div key={i} className="cv-job-head" style={{ marginBottom: '.15cm' }}>
                  <span><strong>{ed.degree}</strong>{ed.school ? ` — ${ed.school}` : ''}</span>
                  <span>{ed.year}</span>
                </div>
              ))}
            </>
          )}

          {skills.length > 0 && (
            <>
              <h2 className="cv-h">{t.cvSkills}</h2>
              <p className="cv-p"><Hi text={skills.join(' · ')} terms={kwTerms} /></p>
            </>
          )}

          <h2 className="cv-h">{t.cvRef}</h2>
          <p className="cv-p">{cv.referees === 'list' && cv.refereeText.trim() ? cv.refereeText : t.cvRefRequest}</p>
        </div>
      </div>
    </div>
  );
}
