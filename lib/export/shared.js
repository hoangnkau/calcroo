/* Tiện ích dùng chung cho Excel / PDF export (client-side). */

export function formatDate(d) {
  try {
    return new Date(d).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  } catch (e) {
    return new Date(d).toDateString();
  }
}

export const money = (n) =>
  (n < 0 ? '-$' : '$') + Math.round(Math.abs(n)).toLocaleString('en-AU');

/** Tải blob về máy (site thật, không phải Artifact sandbox). */
export function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.rel = 'noopener';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
