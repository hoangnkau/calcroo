'use client';

/* ============================================================
   MONETIZATION SLOT — CHỈ UI, CHƯA CÓ LOGIC AFFILIATE
   Hiện khi người dùng trả thêm HECS > $0. Sau này gắn CTA
   affiliate ETF vào đây (link, tracking, disclosure...).
   Không render gì khi monthly <= 0.
   ============================================================ */

const STRINGS = {
  en: {
    tag: 'Idea',
    title: (m) => `You're freeing up about $${m}/month`,
    body:
      'Some people split extra cash between clearing HECS and a low-cost index fund. HECS has no interest — only indexation — so the maths is rarely clear-cut.',
    cta: 'Compare options',
    soon: 'Coming soon',
    disc: 'Not financial advice.',
  },
  vi: {
    tag: 'Gợi ý',
    title: (m) => `Bạn đang dành thêm khoảng $${m}/tháng`,
    body:
      'Một số người chia khoản dư giữa việc trả HECS và một quỹ chỉ số chi phí thấp. HECS không có lãi suất — chỉ có indexation — nên lựa chọn hiếm khi rõ ràng.',
    cta: 'Xem các lựa chọn',
    soon: 'Sắp có',
    disc: 'Không phải tư vấn tài chính.',
  },
};

export default function EtfCtaSlot({ monthly = 0, lang = 'en' }) {
  if (!monthly || monthly <= 0) return null;
  const t = STRINGS[lang] || STRINGS.en;
  const m = Math.round(monthly).toLocaleString('en-AU');

  return (
    <aside className="etf-slot no-print" data-slot="etf-affiliate" aria-label={t.tag}>
      <div className="etf-slot-tag">{t.tag}</div>
      <p className="etf-slot-title">{t.title(m)}</p>
      <p className="etf-slot-body">{t.body}</p>
      <div className="etf-slot-foot">
        {/* TODO(monetization): thay bằng link affiliate + tracking */}
        <button type="button" className="btn-secondary" disabled>
          {t.cta}
        </button>
        <span className="etf-slot-soon">{t.soon}</span>
        <span className="etf-slot-disc">{t.disc}</span>
      </div>
    </aside>
  );
}
