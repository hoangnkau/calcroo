import Link from 'next/link';
import { SiteHeader, SiteFooter } from '../../../components/Site';

export const metadata = {
  title: 'Hướng Dẫn — Thuế & Tiền Bạc Ở Úc, Nói Cho Dễ Hiểu',
  description:
    'Các bài hướng dẫn tiếng Việt về thuế và lương ở Úc: khai thuế, deductions, HECS và hơn nữa — mỗi bài đi kèm đúng công cụ tính.',
  alternates: { canonical: '/vi/huong-dan/', languages: { en: '/guides/', vi: '/vi/huong-dan/' } },
};

const GUIDES = [
  {
    href: '/vi/huong-dan/khai-thue-uc-2026/',
    tag: 'Mùa thuế 2026',
    name: 'Hướng Dẫn Khai Thuế Úc 2026 Cho Người Mới',
    desc: 'Mốc thời gian, 7 bước trên myTax, chuẩn bị giấy tờ, và năm nay có gì khác.',
  },
];

export default function Page() {
  return (
    <>
      <SiteHeader homeHref="/vi/" langHref="/guides/" langLabel="English" />
      <main className="wrap">
        <section className="hero">
          <div className="fy-chip">Hướng dẫn</div>
          <h1>Thuế &amp; tiền bạc ở Úc, nói cho dễ hiểu</h1>
          <p>
            Bài hướng dẫn tiếng Việt viết riêng cho người Việt tại Úc, đi kèm đúng công cụ tính — không thuật ngữ rối
            rắm, đúng biểu thuế năm hiện hành. Bài mới được bổ sung quanh năm.
          </p>
        </section>
        <div className="tools-grid" style={{ marginTop: '1.5rem' }}>
          {GUIDES.map((g) => (
            <Link key={g.href} href={g.href} className="tool-card">
              <span className="live">{g.tag}</span>
              <h3>{g.name}</h3>
              <p>{g.desc}</p>
            </Link>
          ))}
        </div>
      </main>
      <SiteFooter vi />
    </>
  );
}
