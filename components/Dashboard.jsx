'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { SiteHeader, SiteFooter } from './Site';
import {
  listConfigs,
  updateConfig,
  deleteConfig,
  toolLabel,
  toolRoute,
} from '../lib/savedConfigs';

const STRINGS = {
  en: {
    langHref: '?lang=en',
    langLabel: 'Tiếng Việt',
    toLang: '?lang=vi',
    homeHref: '/',
    title: 'Your dashboard',
    intro:
      'Every setup you save from a Calcroo calculator lives here — stored only in this browser, never uploaded. Rename, tweak the numbers, or remove them any time.',
    empty: 'No saved calculations yet.',
    emptyHint: 'Open any pay, tax or HECS calculator and press “💾 Save configuration”.',
    goCalc: 'Browse calculators →',
    count: (n) => `${n} saved ${n === 1 ? 'calculation' : 'calculations'}`,
    savedOn: 'Saved',
    updatedOn: 'Updated',
    rename: 'Rename',
    edit: 'Quick edit',
    close: 'Close',
    open: 'Open in calculator →',
    del: 'Delete',
    confirmDel: (name) => `Delete “${name}”? This cannot be undone.`,
    save: 'Save changes',
    cancel: 'Cancel',
    fieldsNote: 'Values are stored exactly as typed in the calculator.',
    loadErr:
      'Could not read local storage. Your browser may be in private mode or blocking site data.',
    on: 'On',
    off: 'Off',
  },
  vi: {
    langHref: '?lang=vi',
    langLabel: 'English',
    toLang: '?lang=en',
    homeHref: '/vi/',
    title: 'Bảng điều khiển của bạn',
    intro:
      'Mọi cấu hình bạn lưu từ công cụ Calcroo đều nằm ở đây — chỉ lưu trong trình duyệt này, không tải lên đâu cả. Đổi tên, sửa số liệu hoặc xoá bất cứ lúc nào.',
    empty: 'Chưa có bản tính nào được lưu.',
    emptyHint: 'Mở công cụ tính lương, thuế hoặc HECS và bấm “💾 Lưu cấu hình”.',
    goCalc: 'Xem các công cụ →',
    count: (n) => `${n} bản lưu`,
    savedOn: 'Đã lưu',
    updatedOn: 'Cập nhật',
    rename: 'Đổi tên',
    edit: 'Chỉnh sửa nhanh',
    close: 'Đóng',
    open: 'Mở trong công cụ →',
    del: 'Xoá',
    confirmDel: (name) => `Xoá “${name}”? Không thể hoàn tác.`,
    save: 'Lưu thay đổi',
    cancel: 'Huỷ',
    fieldsNote: 'Giá trị được lưu đúng như bạn gõ trong công cụ.',
    loadErr:
      'Không đọc được bộ nhớ cục bộ. Trình duyệt có thể đang ở chế độ ẩn danh hoặc chặn dữ liệu trang.',
    on: 'Bật',
    off: 'Tắt',
  },
};

const fmtDate = (ts) =>
  new Date(ts).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });

const prettyKey = (k) =>
  k
    .replace(/^(with|is|has)([A-Z])/, '$2')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .replace(/^\s*./, (c) => c.toUpperCase())
    .trim();

function ConfigCard({ rec, lang, onChange, onDelete }) {
  const t = STRINGS[lang];
  const [renaming, setRenaming] = useState(false);
  const [nameDraft, setNameDraft] = useState(rec.name);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(rec.inputs || {});

  useEffect(() => {
    setNameDraft(rec.name);
    setDraft(rec.inputs || {});
  }, [rec]);

  async function commitName() {
    const next = nameDraft.trim();
    setRenaming(false);
    if (next && next !== rec.name) await onChange(rec.id, { name: next });
    else setNameDraft(rec.name);
  }

  async function commitEdit() {
    setEditing(false);
    await onChange(rec.id, { inputs: draft });
  }

  const entries = Object.entries(rec.inputs || {});

  return (
    <li className="dash-card">
      <div className="dash-card-top">
        <span className="dash-badge">{toolLabel(rec.tool, lang)}</span>
        <time className="dash-date" dateTime={new Date(rec.updatedAt).toISOString()}>
          {rec.updatedAt !== rec.createdAt ? t.updatedOn : t.savedOn} {fmtDate(rec.updatedAt)}
        </time>
      </div>

      {renaming ? (
        <input
          className="dash-name-input"
          autoFocus
          value={nameDraft}
          onChange={(e) => setNameDraft(e.target.value)}
          onBlur={commitName}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commitName();
            if (e.key === 'Escape') {
              setNameDraft(rec.name);
              setRenaming(false);
            }
          }}
        />
      ) : (
        <button type="button" className="dash-name" onClick={() => setRenaming(true)} title={t.rename}>
          {rec.name}
        </button>
      )}

      {rec.summary && !editing && <p className="dash-summary">{rec.summary}</p>}

      {editing && (
        <div className="dash-edit">
          {entries.map(([k, v]) => (
            <label key={k} className="dash-edit-row">
              <span>{prettyKey(k)}</span>
              {typeof v === 'boolean' ? (
                <input
                  type="checkbox"
                  checked={!!draft[k]}
                  onChange={(e) => setDraft({ ...draft, [k]: e.target.checked })}
                />
              ) : (
                <input
                  type="text"
                  value={draft[k] ?? ''}
                  onChange={(e) => setDraft({ ...draft, [k]: e.target.value })}
                />
              )}
            </label>
          ))}
          <p className="dash-fields-note">{t.fieldsNote}</p>
          <div className="dash-actions">
            <button type="button" className="btn-primary" onClick={commitEdit}>
              {t.save}
            </button>
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setDraft(rec.inputs || {});
                setEditing(false);
              }}
            >
              {t.cancel}
            </button>
          </div>
        </div>
      )}

      {!editing && (
        <div className="dash-actions">
          <Link className="dash-link" href={`${toolRoute(rec.tool, lang)}?config=${rec.id}`}>
            {t.open}
          </Link>
          {entries.length > 0 && (
            <button type="button" className="dash-act" onClick={() => setEditing(true)}>
              {t.edit}
            </button>
          )}
          <button type="button" className="dash-act" onClick={() => setRenaming(true)}>
            {t.rename}
          </button>
          <button
            type="button"
            className="dash-act dash-act-danger"
            onClick={() => {
              if (window.confirm(t.confirmDel(rec.name))) onDelete(rec.id);
            }}
          >
            {t.del}
          </button>
        </div>
      )}
    </li>
  );
}

export default function Dashboard() {
  const [lang, setLang] = useState('en');
  const [configs, setConfigs] = useState(null); // null = loading
  const [error, setError] = useState(false);
  const t = STRINGS[lang];

  // Ngôn ngữ: từ ?lang= hoặc localStorage
  useEffect(() => {
    let initial = 'en';
    try {
      const q = new URLSearchParams(window.location.search).get('lang');
      const stored = window.localStorage.getItem('calcroo_lang');
      if (q === 'vi' || q === 'en') initial = q;
      else if (stored === 'vi' || stored === 'en') initial = stored;
    } catch (e) {
      /* ignore */
    }
    setLang(initial);
  }, []);

  const reload = useCallback(() => {
    listConfigs()
      .then((rows) => {
        setConfigs(rows);
        setError(false);
      })
      .catch(() => {
        setConfigs([]);
        setError(true);
      });
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  function switchLang(next) {
    setLang(next);
    try {
      window.localStorage.setItem('calcroo_lang', next);
      const url = new URL(window.location.href);
      url.searchParams.set('lang', next);
      window.history.replaceState(null, '', url);
    } catch (e) {
      /* ignore */
    }
  }

  async function handleChange(id, patch) {
    const updated = await updateConfig(id, patch);
    if (updated) setConfigs((prev) => (prev ? prev.map((r) => (r.id === id ? updated : r)) : prev));
  }

  async function handleDelete(id) {
    await deleteConfig(id);
    setConfigs((prev) => (prev ? prev.filter((r) => r.id !== id) : prev));
  }

  return (
    <>
      <SiteHeader homeHref={t.homeHref} />
      <main className="wrap">
        <section className="hero">
          <div className="fy-chip">{lang === 'vi' ? 'Lưu cục bộ' : 'Stored on this device'}</div>
          <div className="dash-head">
            <h1>{t.title}</h1>
            <button type="button" className="lang-link" onClick={() => switchLang(lang === 'vi' ? 'en' : 'vi')}>
              {t.langLabel}
            </button>
          </div>
          <p>{t.intro}</p>
        </section>

        {error && <p className="saveconfig-err">{t.loadErr}</p>}

        {configs === null && !error && <p className="dash-loading">…</p>}

        {configs !== null && configs.length === 0 && !error && (
          <div className="card dash-empty">
            <p>
              <strong>{t.empty}</strong>
            </p>
            <p className="hint">{t.emptyHint}</p>
            <Link className="btn-secondary" href={t.homeHref} style={{ width: 'auto', display: 'inline-block' }}>
              {t.goCalc}
            </Link>
          </div>
        )}

        {configs !== null && configs.length > 0 && (
          <>
            <p className="tools-sub" style={{ marginTop: '1.5rem' }}>
              {t.count(configs.length)}
            </p>
            <ul className="dash-list">
              {configs.map((rec) => (
                <ConfigCard
                  key={rec.id}
                  rec={rec}
                  lang={lang}
                  onChange={handleChange}
                  onDelete={handleDelete}
                />
              ))}
            </ul>
          </>
        )}
      </main>
      <SiteFooter vi={lang === 'vi'} />
    </>
  );
}
