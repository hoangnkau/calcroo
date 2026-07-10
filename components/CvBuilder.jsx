'use client';

import { useEffect, useRef, useState } from 'react';

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
    refRequest: '“Available on request” (standard)',
    refList: 'List referees',
    refText: 'Name — role, company, phone',
    remove: 'Remove',
    psTitle: 'Preview — A4',
    print: 'Download PDF',
    printHint: 'In the print dialog, choose “Save as PDF”. The result is real selectable text — exactly what ATS systems need.',
    clear: 'Clear all data',
    clearConfirm: 'Delete all CV data saved in this browser?',
    saved: 'Autosaved in your browser — nothing is uploaded.',
    cvSummary: 'Summary',
    cvExp: 'Experience',
    cvEdu: 'Education',
    cvSkills: 'Skills',
    cvRef: 'Referees',
    cvRefRequest: 'Available on request.',
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
    refRequest: '“Available on request” (chuẩn phổ biến)',
    refList: 'Liệt kê người tham chiếu',
    refText: 'Tên — chức vụ, công ty, số điện thoại',
    remove: 'Xóa',
    psTitle: 'Xem trước — A4',
    print: 'Tải PDF',
    printHint: 'Trong hộp thoại in, chọn “Save as PDF”. Kết quả là chữ thật chọn-copy được — đúng thứ hệ thống ATS cần.',
    clear: 'Xóa toàn bộ dữ liệu',
    clearConfirm: 'Xóa toàn bộ dữ liệu CV lưu trong trình duyệt này?',
    saved: 'Tự lưu trong trình duyệt của bạn — không upload đi đâu.',
    cvSummary: 'Summary',
    cvExp: 'Experience',
    cvEdu: 'Education',
    cvSkills: 'Skills',
    cvRef: 'Referees',
    cvRefRequest: 'Available on request.',
  },
};

const KEY = 'calcroo-cv-v1';

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

  return (
    <>
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
            <button className="btn-primary" onClick={() => window.print()}>{t.print}</button>
            <div className="hint">{t.printHint}</div>
            <div className="hint">💾 {t.saved}</div>
            <button className="cv-rm" onClick={clearAll} style={{ alignSelf: 'flex-start' }}>{t.clear}</button>
          </div>
        </div>

        {/* ---------- PREVIEW / PRINT SHEET ---------- */}
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
                <p className="cv-p">{cv.summary}</p>
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
                          <li key={j}>{b}</li>
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
                <p className="cv-p">{skills.join(' · ')}</p>
              </>
            )}

            <h2 className="cv-h">{t.cvRef}</h2>
            <p className="cv-p">{cv.referees === 'list' && cv.refereeText.trim() ? cv.refereeText : t.cvRefRequest}</p>
          </div>
        </div>
      </div>
    </>
  );
}
