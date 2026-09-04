'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { saveConfig, getConfig } from '../lib/savedConfigs';

const STRINGS = {
  en: {
    open: '💾 Save configuration',
    heading: 'Name this save',
    placeholder: 'e.g. Job A salary, FY26-27 plan',
    save: 'Save',
    cancel: 'Cancel',
    saved: 'Saved to your dashboard',
    view: 'Open dashboard →',
    restored: (name) => `Loaded “${name}” from your dashboard.`,
    error: 'Could not save — your browser may be blocking local storage (private window?).',
  },
  vi: {
    open: '💾 Lưu cấu hình',
    heading: 'Đặt tên cho bản lưu',
    placeholder: 'VD: Lương Job A, Kế hoạch FY26-27',
    save: 'Lưu',
    cancel: 'Huỷ',
    saved: 'Đã lưu vào bảng điều khiển',
    view: 'Mở bảng điều khiển →',
    restored: (name) => `Đã tải “${name}” từ bảng điều khiển.`,
    error: 'Không lưu được — trình duyệt có thể đang chặn bộ nhớ cục bộ (cửa sổ ẩn danh?).',
  },
};

/**
 * Nút "Lưu cấu hình" cho các công cụ tính lương / thuế / HECS.
 *
 * @param {string}   tool        khoá công cụ (khớp lib/savedConfigs TOOLS)
 * @param {'en'|'vi'} lang
 * @param {() => object} getInputs   trả về toàn bộ state input hiện tại
 * @param {(inputs:object) => void} [onRestore]  áp lại input khi mở từ ?config=<id>
 * @param {(inputs:object) => string} [summarise]  chuỗi tóm tắt ngắn hiển thị ở dashboard
 * @param {() => string} [suggestName]  gợi ý tên mặc định
 */
export default function SaveConfig({ tool, lang = 'en', getInputs, onRestore, summarise, suggestName }) {
  const t = STRINGS[lang] || STRINGS.en;
  const [openForm, setOpenForm] = useState(false);
  const [name, setName] = useState('');
  const [status, setStatus] = useState(null); // 'saved' | 'error' | null
  const [restoredName, setRestoredName] = useState(null);
  const inputRef = useRef(null);
  const restoreRef = useRef(onRestore);
  restoreRef.current = onRestore;

  // Mở lại cấu hình từ link ?config=<id>
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const id = new URLSearchParams(window.location.search).get('config');
    if (!id) return;
    let cancelled = false;
    getConfig(id)
      .then((rec) => {
        if (cancelled || !rec || rec.tool !== tool || !restoreRef.current) return;
        restoreRef.current(rec.inputs || {});
        setRestoredName(rec.name);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [tool]);

  useEffect(() => {
    if (openForm && inputRef.current) inputRef.current.focus();
  }, [openForm]);

  function startSave() {
    setStatus(null);
    setName(suggestName ? suggestName() : '');
    setOpenForm(true);
  }

  async function confirmSave() {
    try {
      const inputs = getInputs ? getInputs() : {};
      const summary = summarise ? summarise(inputs) : '';
      await saveConfig({ tool, name, inputs, lang, summary });
      setOpenForm(false);
      setStatus('saved');
    } catch (err) {
      setStatus('error');
    }
  }

  return (
    <div className="saveconfig no-print">
      {restoredName && <p className="saveconfig-note">{t.restored(restoredName)}</p>}

      {!openForm && (
        <button type="button" className="btn-secondary" onClick={startSave}>
          {t.open}
        </button>
      )}

      {openForm && (
        <div className="saveconfig-form">
          <label htmlFor={`sc-name-${tool}`}>{t.heading}</label>
          <input
            ref={inputRef}
            id={`sc-name-${tool}`}
            type="text"
            autoComplete="off"
            placeholder={t.placeholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') confirmSave();
              if (e.key === 'Escape') setOpenForm(false);
            }}
          />
          <div className="saveconfig-btns">
            <button type="button" className="btn-primary" onClick={confirmSave}>
              {t.save}
            </button>
            <button type="button" className="btn-secondary" onClick={() => setOpenForm(false)}>
              {t.cancel}
            </button>
          </div>
        </div>
      )}

      {status === 'saved' && (
        <p className="saveconfig-ok">
          ✓ {t.saved} ·{' '}
          <Link href={`/dashboard/${lang === 'vi' ? '?lang=vi' : ''}`}>{t.view}</Link>
        </p>
      )}
      {status === 'error' && <p className="saveconfig-err">{t.error}</p>}
    </div>
  );
}
