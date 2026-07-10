import Link from 'next/link';
import { SiteHeader, SiteFooter } from '../components/Site';

export const metadata = {
  title: 'Calcroo — Free Australian Tax & Pay Calculators (FY 2026–27)',
  description:
    'Free, fast Australian tax and pay calculators updated for FY 2026–27. Income tax, take-home pay, HECS-HELP and more — no sign-up, everything runs in your browser.',
  alternates: { canonical: '/' },
};

const TOOLS = [
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
  { name: 'HECS Repayment Calculator', desc: 'Your compulsory repayment and payoff timeline under the marginal system.' },
  { name: 'Casual Pay Calculator', desc: 'Casual loading, penalty rates and public holidays by state.' },
  { name: 'Salary Sacrifice Calculator', desc: 'Super contributions, tax savings and the HECS impact most tools miss.' },
];

export default function Home() {
  return (
    <>
      <SiteHeader langHref="/vi/tinh-thue-thu-nhap-uc/" langLabel="Tiếng Việt" />
      <main className="wrap">
        <section className="hero">
          <div className="fy-chip">Updated for FY 2026–27</div>
          <h1>Australian tax &amp; pay calculators that give you a straight answer</h1>
          <p>
            Free, fast and private — every Calcroo tool runs entirely in your browser. No sign-up, no spreadsheet
            downloads, no &quot;talk to an adviser&quot; wall. Just type your numbers and see where your money goes.
          </p>
        </section>

        <div className="tools-grid">
          {TOOLS.map((t) =>
            t.live ? (
              <Link key={t.name} href={t.href} className="tool-card">
                <span className="live">Live</span>
                <h3>{t.name}</h3>
                <p>{t.desc}</p>
              </Link>
            ) : (
              <div key={t.name} className="tool-card disabled">
                <span className="soon">Coming soon</span>
                <h3>{t.name}</h3>
                <p>{t.desc}</p>
              </div>
            )
          )}
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
            We&apos;re starting with the calculations Australians look up most — income tax, take-home pay and
            HECS-HELP — and adding new tools through 2026. Something you&apos;d like us to build?{' '}
            <Link href="/contact/">Tell us</Link>.
          </p>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
