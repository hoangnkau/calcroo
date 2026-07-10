import Link from 'next/link';
import { SiteHeader, SiteFooter } from '../components/Site';

export const metadata = {
  title: 'Calcroo — Free Australian Tax & Pay Calculators (FY 2026–27)',
  description:
    'Free, fast Australian tax and pay calculators updated for FY 2026–27, plus paperwork tools for life admin. No sign-up, everything runs in your browser.',
  alternates: { canonical: '/', languages: { en: '/', vi: '/vi/' } },
};

const FINANCE = [
  {
    href: '/tax-refund-calculator/',
    live: true,
    name: 'Tax Refund Calculator',
    desc: 'Estimate your 2025–26 tax return before you lodge — refund or bill, at the correct rates.',
  },
  {
    href: '/income-tax-calculator/',
    live: true,
    name: 'Income Tax Calculator',
    desc: 'Take-home pay, income tax, Medicare levy and HECS-HELP under the 2026–27 rates.',
  },
  {
    href: '/pay-calculator/',
    live: true,
    name: 'Pay Calculator',
    desc: 'Convert annual, monthly, hourly and weekly pay — before and after tax.',
  },
  {
    href: '/hecs-repayment-calculator/',
    live: true,
    name: 'HECS Repayment Calculator',
    desc: 'Your compulsory repayment and payoff timeline under the marginal system.',
  },
  {
    href: '/casual-pay-calculator/',
    live: true,
    name: 'Casual Pay Calculator',
    desc: 'Casual loading, weekend & public holiday penalty rates, and real weeks worked.',
  },
  {
    href: '/salary-sacrifice-calculator/',
    live: true,
    name: 'Salary Sacrifice Calculator',
    desc: 'Super contributions, tax savings and the HECS impact most tools miss.',
  },
];

const PAPERWORK = [
  {
    href: '/visa-photo-resizer/',
    live: true,
    name: 'Visa Photo Resizer',
    desc: 'Crop and size photos to the Australian 35×45mm passport/visa standard — right in your browser.',
  },
  {
    name: 'Document Compressor',
    desc: 'Shrink photos and scans to fit upload limits for immi, Centrelink and bank portals.',
  },
  {
    name: 'PDF Merge & Compress',
    desc: 'Combine payslips and documents into one PDF for loan or visa applications. Files never leave your device.',
  },
  {
    name: 'Australian CV Builder',
    desc: 'An ATS-friendly resume in the Australian format — no photo, no date of birth.',
  },
];

function ToolCard({ t }) {
  return t.live ? (
    <Link href={t.href} className="tool-card">
      <span className="live">Live</span>
      <h3>{t.name}</h3>
      <p>{t.desc}</p>
    </Link>
  ) : (
    <div className="tool-card disabled">
      <span className="soon">Coming soon</span>
      <h3>{t.name}</h3>
      <p>{t.desc}</p>
    </div>
  );
}

export default function Home() {
  return (
    <>
      <SiteHeader langHref="/vi/" langLabel="Tiếng Việt" />
      <main className="wrap">
        <section className="hero">
          <div className="fy-chip">Updated for FY 2026–27</div>
          <h1>Australian tax &amp; pay calculators that give you a straight answer</h1>
          <p>
            Free, fast and private — every Calcroo tool runs entirely in your browser. No sign-up, no spreadsheet
            downloads, no &quot;talk to an adviser&quot; wall. Just type your numbers and see where your money goes.
          </p>
        </section>

        <h2 className="tools-h">Tax &amp; pay calculators</h2>
        <p className="tools-sub">All six updated for the 2026–27 financial year — and tax-time 2026 ready.</p>
        <div className="tools-grid">
          {FINANCE.map((t) => (
            <ToolCard key={t.name} t={t} />
          ))}
        </div>

        <h2 className="tools-h">Paperwork tools</h2>
        <p className="tools-sub">Life-admin utilities for visas, loans and applications — all client-side, in progress now.</p>
        <div className="tools-grid">
          {PAPERWORK.map((t) => (
            <ToolCard key={t.name} t={t} />
          ))}
        </div>

        <article className="content">
          <h2>Why Calcroo?</h2>
          <p>
            Most Australian tax calculators are built by banks and lenders to funnel you toward their products, or
            they lag behind when rates change. Calcroo is different: we update on day one of every financial year
            (the 2026–27 rates went live from 1 July 2026), we show our working, and your numbers never leave your
            device — every calculation happens locally in your browser.
          </p>
          <p>
            We started with the calculations Australians look up most — income tax, take-home pay, HECS-HELP and tax
            refunds — and we&apos;re now building the paperwork tools that go with them. Something you&apos;d like us
            to build? <Link href="/contact/">Tell us</Link>.
          </p>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
