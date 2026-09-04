'use client';

import { useEffect, useRef, useState } from 'react';
import { encodeShareState, decodeShareState, readShareParam, buildShareUrl } from '../lib/shareLink';

const STRINGS = {
  en: {
    open: '🔗 Share this calculation',
    copied: 'Share link copied',
    copyManual: 'Could not copy automatically — copy the link below.',
    loaded: 'Loaded from a shared link.',
    badLink: 'This share link is invalid or corrupted — please re-enter the numbers.',
    urlLabel: 'Share link',
  },
  vi: {
    open: '🔗 Chia sẻ bảng tính này',
    copied: 'Đã copy link chia sẻ',
    copyManual: 'Không tự copy được — hãy chép link bên dưới.',
    loaded: 'Đã tải bảng tính từ link chia sẻ.',
    badLink: 'Link chia sẻ không hợp lệ hoặc đã hỏng — hãy nhập lại số liệu.',
    urlLabel: 'Link chia sẻ',
  },
};

async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch (e) {
    /* fall through to legacy path */
  }
  try {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.top = '-1000px';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  } catch (e) {
    return false;
  }
}

/**
 * @param {{
 *   tool: string, lang?: 'en'|'vi',
 *   getState: () => object,             // = getInputs của calculator
 *   onRestore: (inputs:object) => void,
 *   paramKey?: string
 * }} props
 */
export default function ShareButton({ tool, lang = 'en', getState, onRestore, paramKey = 'data' }) {
  const t = STRINGS[lang] || STRINGS.en;
  const [toast, setToast] = useState(null); // { kind:'ok'|'warn', msg }
  const [note, setNote] = useState(null); // { kind:'ok'|'err', msg }
  const [shareUrl, setShareUrl] = useState('');
  const restoreRef = useRef(onRestore);
  restoreRef.current = onRestore;

  // ----- mở link ?data= : giải mã + điền vào input -----
  useEffect(() => {
    const raw = readShareParam(paramKey);
    if (!raw) return;
    const decoded = decodeShareState(raw);
    if (decoded && decoded.d && (!decoded.t || decoded.t === tool)) {
      try {
        restoreRef.current?.(decoded.d);
        setNote({ kind: 'ok', msg: t.loaded });
      } catch (e) {
        if (typeof console !== 'undefined') console.error('[Calcroo] share restore failed', e);
        setNote({ kind: 'err', msg: t.badLink });
      }
    } else if (decoded === null) {
      setNote({ kind: 'err', msg: t.badLink });
    }
    // decoded.t khác tool -> link của công cụ khác, để component đó xử lý
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tool, paramKey]);

  // tự ẩn: toast luôn ẩn; note thành công ẩn sau 6s, note lỗi giữ lại
  useEffect(() => {
    if (!toast) return undefined;
    const id = setTimeout(() => setToast(null), 3400);
    return () => clearTimeout(id);
  }, [toast]);

  useEffect(() => {
    if (note && note.kind === 'ok') {
      const id = setTimeout(() => setNote(null), 6000);
      return () => clearTimeout(id);
    }
    return undefined;
  }, [note]);

  async function onShare() {
    try {
      const encoded = encodeShareState({ v: 1, t: tool, d: getState() });
      const url = buildShareUrl(encoded, paramKey);
      setShareUrl(url);
      const ok = await copyToClipboard(url);
      setToast({ kind: ok ? 'ok' : 'warn', msg: ok ? t.copied : t.copyManual });
    } catch (e) {
      if (typeof console !== 'undefined') console.error('[Calcroo] share failed', e);
      setToast({ kind: 'warn', msg: t.copyManual });
    }
  }

  return (
    <div className="sharebtn no-print">
      {note && (
        <p className={`share-note ${note.kind === 'err' ? 'err' : ''}`} role="status">
          {note.msg}
        </p>
      )}

      <button type="button" className="btn-secondary" onClick={onShare}>
        {t.open}
      </button>

      {shareUrl && (
        <label className="share-url">
          <span>{t.urlLabel}</span>
          <input
            type="text"
            readOnly
            value={shareUrl}
            onFocus={(e) => e.target.select()}
            onClick={(e) => e.target.select()}
          />
        </label>
      )}

      {toast && (
        <div className={`share-toast ${toast.kind}`} role="status" aria-live="polite">
          {toast.kind === 'ok' ? '✓ ' : '⚠ '}
          {toast.msg}
        </div>
      )}
    </div>
  );
}
