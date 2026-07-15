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
    refRequest: '"Available on request" (standard)',
    refList: 'List referees',
    refText: 'Name — role, company, phone',
    remove: 'Remove',
    psTitle: 'Preview — A4',
    print: 'Download PDF',
    printHint: 'In the print dialog, choose "Save as PDF". The result is real selectable text — exactly what ATS systems need.',
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
    printHint: 'Trong hộp thoại in, chọn "Save as PDF". Kết quả là chữ thật chọn-copy được — đúng thứ hệ thống ATS cần.',
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

const STOPWORDS = new Set(
  (
    'a about above after again against all am an and any are as at be because been before being below ' +
    'between both but by could did do does doing down during each few for from further had has have having ' +
    'he her here hers herself him himself his how i if in into is it its itself just me more most my myself ' +
    'no nor not now of off on once only or other our ours ourselves out over own same she should so some such ' +
    'than that the their theirs them themselves then there these they this those through to too under until ' +
    'up very was we were what when where which while who whom why will with you your yours yourself yourselves ' +
    'able across also always among another apply applicant applicants applying available background based basic ' +
    'candidate candidates capable currently day days duties eligible etc every excellent experience good great ' +
    'high highly hour hours ideal including job jobs looking must need needed needs offer offering opportunity ' +
    'position preferred required requirement requirements responsibilities role strong successful suitable team ' +
    'time using week weeks well work working works would year years'
  ).split(/\s+/)
);

function extractKeywords(text, max) {
  const limit = max || 16;
  const clauses = text.split(/[.,;:!?()\n/]+/);
  const freq = new Map();
  for (const clause of clauses) {
    const words = (clause.toLowerCase().match(/[a-z][a-z']*/g) || []).filter(
      (w) => w.length >= 3 && !STOPWORDS.has(w)
    );
    for (const w of words) freq.set(w, (freq.get(w) || 0) + 1);
    for (let i = 0; i < words.length - 1; i++) {
      const bg = words[i] + ' ' + words[i + 1];
      freq.set(bg, (freq.get(bg) || 0) + 1.2);
    }
  }
  const sorted = [...freq.entries()].sort((a, b) => b[1] - a[1] || b[0].length - a[0].length);
  const out = [];
  for (const [w] of sorted) {
    if (out.some((s) => s.includes(' ') && s.split(' ').includes(w))) continue;
    out.push(w);
    if (out.length >= limit) break;
  }
  return out;
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

  function analyze() {
    const keywords = extractKeywords(jobAd);
    if (!keywords.length) {
      setKw({ matched: [], missing: [], none: true });
      return;
    }
    const cvText = [
      cv.name, cv.title, cv.summary, cv.skills,
      ...cv.experience.flatMap((e) => [e.role, e.company, e.bullets]),
      ...cv.education.flatMap((e) => [e.degree, e.school]),
    ].join(' ').toLowerCase();
    const matched = keywords.filter((k) => cvText.indexOf(k) !== -1);
    const missing = keywords.filter((k) => cvText.indexOf(k) === -1);
    setKw({ matched, missing, none: false });
  }

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
          <button className="btn-primary" onClick={() => window.print()}>{t.print}</button>
          <div className="hint">{t.printHint}</div>
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
                    <span className="kw-chip miss" key={k}>+ {k}</span>
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
  );
}
