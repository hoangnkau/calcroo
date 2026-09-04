/* ============================================================
   CALCROO — SHARE LINK (mã hoá state vào URL, 100% client-side)
   Nén bằng lz-string rồi bọc URL-safe. KHÔNG có gì lên server:
   payload nằm trọn trong query string, chỉ giải mã ở trình duyệt.
   Chỉ encode field người dùng nhập — không kèm tên, email, thiết bị.
   ============================================================ */

import LZString from 'lz-string';

const compressToEncodedURIComponent = LZString.compressToEncodedURIComponent;
const decompressFromEncodedURIComponent = LZString.decompressFromEncodedURIComponent;

const MARK = 'A'; // đánh dấu thuật toán, để sau này đổi format vẫn giải mã cũ được

/**
 * @param {{v?:number, t:string, d:object}} payload  t = tool key, d = inputs
 * @returns {string} chuỗi ngắn, an toàn đặt trong URL
 */
export function encodeShareState(payload) {
  const json = JSON.stringify({ v: payload.v || 1, t: payload.t, d: payload.d || {} });
  // lz-string uri-safe vẫn dùng '+' và '$' -> dễ bị mã hoá/hiểu sai trong query.
  // Đổi sang '.' và '_' (ngoài bảng chữ lz, an toàn URL), đảo lại khi decode.
  return MARK + compressToEncodedURIComponent(json).replace(/\+/g, '.').replace(/\$/g, '_');
}

/**
 * @param {string} raw
 * @returns {{v:number, t:string|null, d:object|null} | null}  null nếu hỏng
 */
export function decodeShareState(raw) {
  if (typeof raw !== 'string' || raw.length < 2 || raw[0] !== MARK) return null;
  try {
    const body = raw
      .slice(1)
      .replace(/\./g, '+')
      .replace(/_/g, '$')
      .replace(/ /g, '+'); // ' ' = '+' bị mangle bởi trình xử lý query nào đó
    const json = decompressFromEncodedURIComponent(body);
    if (!json) return null;
    const p = JSON.parse(json);
    if (!p || typeof p !== 'object') return null;
    return {
      v: typeof p.v === 'number' ? p.v : 1,
      t: typeof p.t === 'string' ? p.t : null,
      d: p.d && typeof p.d === 'object' && !Array.isArray(p.d) ? p.d : null,
    };
  } catch (e) {
    return null;
  }
}

/**
 * Đọc tham số chia sẻ từ URL hiện tại — KHÔNG dùng URLSearchParams vì nó
 * biến '+' thành dấu cách và làm hỏng chuỗi nén.
 * @param {string} key
 * @returns {string|null}
 */
export function readShareParam(key = 'data') {
  if (typeof window === 'undefined') return null;
  const esc = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const fromSearch = (window.location.search || '').match(new RegExp('[?&]' + esc + '=([^&#]*)'));
  if (fromSearch && fromSearch[1]) return fromSearch[1];
  const fromHash = (window.location.hash || '').match(new RegExp('[#&]' + esc + '=([^&]*)'));
  return fromHash && fromHash[1] ? fromHash[1] : null;
}

/** Tạo URL chia sẻ cho trang hiện tại (bỏ mọi query cũ). */
export function buildShareUrl(encoded, key = 'data') {
  const { origin, pathname } = window.location;
  return `${origin}${pathname}?${key}=${encoded}`;
}
