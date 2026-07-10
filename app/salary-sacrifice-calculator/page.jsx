import SalarySacrificeCalculator from '../../components/SalarySacrificeCalculator';
import { SiteHeader, SiteFooter } from '../../components/Site';
import Link from 'next/link';

export const metadata = {
  title: 'Salary Sacrifice Super Calculator 2026–27 — Tax Savings & the HECS Catch',
  description:
    'Free salary sacrifice calculator for Australia, FY 2026–27. See your tax saving, what actually lands in super after 15% contributions tax, the concessional cap — and the HECS impact most calculators miss.',
  alternates: {
    canonical: '/salary-sacrifice-calculator/',
    languages: {
      en: '/salary-sacrifice-calculator/',
      vi: '/vi/tinh-salary-sacrifice/',
    },
  },
};

const FAQ = [
  {
    q: 'How much tax do I save by salary sacrificing into super?',
    a: 'Sacrificed amounts skip your marginal tax rate (plus 2% Medicare levy) and are instead taxed at 15% inside your fund. On $100,000, sacrificing $10,000 saves $3,200 in income tax and Medicare levy; after $1,500 contributions tax, $8,500 lands in super at a cost of only $6,800 in take-home pay.',
  },
  {
    q: 'Does salary sacrificing reduce my HECS repayment?',
    a: 'No — and this catches many people out. HECS is calculated on your repayment income, which adds reportable super contributions back to your taxable income. Sacrifice $10,000 from a $100,000 salary and your HECS repayment is still calculated on $100,000. Your employer may even under-withhold for HECS because your PAYG income looks lower, leaving a bill at tax time.',
  },
  {
    q: 'What is the concessional contributions cap?',
    a: 'The annual limit on before-tax super contributions — your employer’s 12% super guarantee plus anything you salary sacrifice, combined. Exceeding it means the excess is effectively taxed at your marginal rate instead of 15%. The calculator shows your cap usage; if you have unused cap from the past 5 years and a super balance under $500,000, carry-forward rules may let you contribute more.',
  },
  {
    q: 'Is salary sacrificing worth it on a lower income?',
    a: 'The benefit equals the gap between your marginal rate and 15%. At the 30% bracket (plus Medicare) you save about 17c per dollar; at the 15% bracket the saving is close to zero, and below the tax-free threshold sacrificing actually costs you. Lower earners are often better served by after-tax contributions and the government co-contribution instead.',
  },
  {
    q: 'What’s the catch with salary sacrificing?',
    a: 'The money is preserved: you generally can’t touch it until you reach preservation age. Other trade-offs: HECS repayments don’t fall, Division 293 adds 15% extra contributions tax for very high earners (income + concessional contributions above $250,000), and a lower PAYG salary can slightly affect borrowing-power assessments with some lenders.',
  },
  {
    q: 'How do I set up salary sacrifice?',
    a: 'Ask your payroll or HR for a salary sacrifice arrangement into super — it must be agreed prospectively (for future pay, not pay already earned) and documented. There’s no ATO form; it’s an agreement between you and your employer. Check that your employer still pays the 12% super guarantee on your pre-sacrifice salary, which has been the legal requirement since 2020.',
  },
];

export default function Page() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <>
      <SiteHeader langHref="/vi/tinh-salary-sacrifice/" langLabel="Tiếng Việt" />
      <main className="wrap">
        <section className="hero">
          <div className="fy-chip">Updated for FY 2026–27</div>
          <h1>Salary Sacrifice Calculator 2026–27</h1>
          <p>
            See the real trade: tax saved, what actually lands in super after the 15% contributions tax, your
            concessional cap — and the HECS effect most calculators quietly ignore.
          </p>
        </section>

        <SalarySacrificeCalculator lang="en" />

        <article className="content">
          <h2>How salary sacrificing to super works</h2>
          <p>
            A salary sacrifice arrangement redirects part of your pay into super <em>before</em> income tax. The
            sacrificed amount skips your marginal rate (30%, 37% or 45%, plus 2% Medicare levy) and is instead taxed at{' '}
            <strong>15% inside your fund</strong>. The saving is the gap between those two rates — which is why the
            strategy is powerful in the 30%+ brackets and weak below them.
          </p>

          <div className="example">
            <strong>$100,000 salary, sacrificing $10,000</strong> — income tax and Medicare fall by $3,200; the fund
            takes $1,500 contributions tax; <strong>$8,500 lands in super</strong> while take-home pay drops only{' '}
            <strong>$6,800</strong>. Every dollar into super costs 80 cents of spending money.
          </div>
          <div className="example">
            <strong>$80,000 salary, sacrificing $5,000</strong> — take-home drops $3,400, $4,250 reaches super. Same
            80c-per-dollar economics, because both incomes sit in the 30% bracket.
          </div>

          <h2>The HECS catch: sacrificing doesn’t shrink your repayment</h2>
          <p>
            HECS-HELP repayments are based on <strong>repayment income</strong>, which takes your taxable income and{' '}
            <em>adds back</em> reportable super contributions. Sacrifice $10,000 from a $100,000 salary and your
            repayment is still assessed on $100,000 — about $4,571 in 2026–27, not the $3,071 a naive calculation on
            $90,000 would suggest. That’s a <strong>$1,500 difference</strong> many super-fund calculators silently get
            wrong.
          </p>
          <p>
            The practical sting: your employer withholds HECS based on your <em>reduced</em> PAYG salary, so too little
            may be set aside during the year — the shortfall arrives as a bill with your tax assessment. If you
            sacrifice and have HECS, consider asking payroll for extra withholding or putting the difference aside.
          </p>

          <h2>Mind the concessional cap</h2>
          <p>
            The cap counts your employer’s 12% super guarantee <em>plus</em> your sacrificed amounts. On a $150,000
            salary, employer super is already $18,000, leaving $14,500 of headroom under a $32,500 cap. Go over and the
            excess is effectively taxed at your marginal rate — undoing the benefit. If your super balance is under
            $500,000, unused cap from the previous five years can be carried forward, which is the main legitimate way
            to contribute more in one year.
          </p>

          <h2>When salary sacrifice is — and isn’t — attractive</h2>
          <ul>
            <li><strong>Strongest:</strong> 37–45% brackets, no near-term need for the cash, cap headroom available.</li>
            <li><strong>Solid:</strong> 30% bracket — a 17c-per-dollar saving compounding for decades.</li>
            <li><strong>Weak:</strong> income mostly in the 15% bracket — the wedge nearly vanishes; after-tax contributions plus the government co-contribution often beat it.</li>
            <li><strong>Cautions:</strong> money is locked until preservation age; Division 293 (extra 15% for incomes above $250,000); HECS unchanged; sacrificed pay can affect some lenders’ borrowing assessments.</li>
          </ul>

          <h2>Frequently asked questions</h2>
          {FAQ.map((f) => (
            <div className="faq-item" key={f.q}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}

          <p>
            See the flow-through to your payslip in the <Link href="/income-tax-calculator/">Income Tax Calculator</Link>,
            or check your repayment in the <Link href="/hecs-repayment-calculator/">HECS Repayment Calculator</Link>.
          </p>

          <p className="disclaimer">
            Calcroo provides estimates for general information only — not financial, tax or legal advice, and super
            strategy depends heavily on personal circumstances. Caps, rates and thresholds: confirm at{' '}
            <a href="https://www.ato.gov.au" rel="noopener">ato.gov.au</a>. Consider advice from a licensed financial
            adviser before changing contributions.
          </p>
        </article>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}
