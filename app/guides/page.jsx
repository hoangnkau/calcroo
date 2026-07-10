import Link from 'next/link';
import { SiteHeader, SiteFooter } from '../../components/Site';

export const metadata = {
  title: 'Guides — Australian Tax & Money, Explained Simply',
  description:
    'Plain-English guides to Australian tax and pay: lodging your return, deductions, HECS and more — each paired with the right calculator.',
  alternates: { canonical: '/guides/', languages: { en: '/guides/', vi: '/vi/huong-dan/' } },
};

const GUIDES = [
  {
    href: '/guides/tax-return-2026-australia/',
    tag: 'Tax time 2026',
    name: 'How to Lodge Your Tax Return in 2026',
    desc: 'Key dates, the myTax walkthrough, what to have ready, and what is different this year.',
  },
];

export default function Page() {
  return (
    <>
      <SiteHeader langHref="/vi/huong-dan/" langLabel="Tiếng Việt" />
      <main className="wrap">
        <section className="hero">
          <div className="fy-chip">Guides</div>
          <h1>Australian tax &amp; money, explained simply</h1>
          <p>
            Plain-English guides that pair with our calculators — no jargon, current-year rates, and the traps other
            sites skip. New guides are added through the year.
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
      <SiteFooter />
    </>
  );
}
