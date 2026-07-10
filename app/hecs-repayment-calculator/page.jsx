import HecsCalculator from '../../components/HecsCalculator';
import { SiteHeader, SiteFooter } from '../../components/Site';
import Link from 'next/link';

export const metadata = {
  title: 'HECS Repayment Calculator 2026–27 — Payoff Time & Voluntary Repayments',
  description:
    'Free HECS-HELP repayment calculator for 2026–27. See your compulsory repayment under the marginal system, how long your debt will take to pay off with indexation, and how much voluntary repayments save.',
  alternates: {
    canonical: '/hecs-repayment-calculator/',
    languages: {
      en: '/hecs-repayment-calculator/',
      vi: '/vi/tinh-tra-no-hecs/',
    },
  },
};

const FAQ = [
  {
    q: 'How much HECS do I repay if I earn $100,000?',
    a: 'On $100,000 of repayment income in 2026–27, your compulsory repayment is 15c for each dollar above the $69,528 threshold: ($100,000 − $69,528) × 15% ≈ $4,571 for the year, or about $176 a fortnight withheld from your pay.',
  },
  {
    q: 'How long does it take to pay off a HECS debt?',
    a: 'It depends on your balance, income and indexation. As a guide under 2026–27 settings: a $30,000 debt on an $85,000 income takes roughly 9 years through compulsory repayments alone, while a $50,000 debt on $75,000 takes around 18 years — with about $20,000 of indexation added along the way. Higher income or voluntary repayments shorten this substantially.',
  },
  {
    q: 'Does HECS have interest?',
    a: 'No interest — but the balance is indexed each 1 June so it keeps pace with the cost of living. Since 2023, indexation is the lower of CPI and the Wage Price Index, which capped the 2023 rate at 3.2% (revised down from 7.1%) and 2024 at 4%. Indexation applies to your balance before that year’s compulsory repayment is credited, which is one reason paying early can save money.',
  },
  {
    q: 'Should I pay off my HECS early?',
    a: 'It’s a trade-off, not a rule. Voluntary repayments avoid future indexation (a guaranteed “return” equal to the indexation rate), but the money is locked away — HECS has no repayments when your income is low, which makes it the most flexible debt most people will ever hold. Compare against your mortgage offset rate and other goals; for personal advice, speak to a licensed adviser.',
  },
  {
    q: 'What income counts for HECS — is it just my salary?',
    a: 'Repayments are based on repayment income: taxable income plus reportable fringe benefits, reportable super contributions (like salary sacrifice), total net investment losses and exempt foreign employment income. This is why salary sacrificing can increase your HECS repayment even though it lowers your taxable income.',
  },
  {
    q: 'Was 20% really taken off HECS debts?',
    a: 'Yes — a one-off 20% reduction was applied to student loan balances that existed on 1 June 2025, processed automatically by the ATO with no application needed. Check your current balance in the ATO app or myGov; this calculator works from whatever balance you enter.',
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
      <SiteHeader langHref="/vi/tinh-tra-no-hecs/" langLabel="Tiếng Việt" />
      <main className="wrap">
        <section className="hero">
          <div className="fy-chip">Updated for FY 2026–27 · marginal system</div>
          <h1>HECS Repayment Calculator 2026–27</h1>
          <p>
            See your compulsory repayment under the new marginal system, how long your debt will really take to clear
            with indexation — and how many years voluntary repayments could save.
          </p>
        </section>

        <HecsCalculator lang="en" />

        <article className="content">
          <h2>How HECS-HELP repayments work in 2026–27</h2>
          <p>
            Compulsory repayments now work like tax brackets. For 2026–27, nothing is repaid on repayment income up to{' '}
            <strong>$69,528</strong>; you repay <strong>15c per dollar</strong> up to $129,717, then{' '}
            <strong>$9,028 plus 17c per dollar</strong> up to $186,050; and from <strong>$186,051</strong> the
            repayment is a flat <strong>10% of your total repayment income</strong>. Thresholds are indexed each year
            in line with average weekly earnings.
          </p>
          <p>
            Your employer withholds an amount toward the repayment from each pay (that’s why you tell them you have a
            study loan on your TFN declaration), but the actual repayment is calculated once a year from your tax
            return and credited to your loan <em>after</em> indexation is applied on 1 June.
          </p>

          <h2>Indexation: the quiet force on your balance</h2>
          <p>
            HELP debts carry no interest, but every 1 June the outstanding balance is indexed — now at the{' '}
            <strong>lower of CPI and the Wage Price Index</strong>. That sequencing matters: indexation hits the
            balance before your compulsory repayment for the year is credited. On a $50,000 debt, 3% indexation adds
            $1,500 in a single day. Our calculator models this year-by-year, which is why the payoff timeline can be
            longer than a naive &quot;balance ÷ repayment&quot; estimate.
          </p>

          <h2>What the timeline looks like in practice</h2>
          <div className="example">
            <strong>$30,000 debt, $85,000 income</strong> — compulsory repayment starts at about $2,321 a year. At 3%
            indexation and 3% income growth, the debt clears in roughly <strong>9 years</strong>, with about $5,400 of
            indexation added along the way.
          </div>
          <div className="example">
            <strong>Same debt and income, plus $3,000 voluntary per year</strong> — payoff drops to about{' '}
            <strong>6 years</strong> and roughly $2,300 of indexation is avoided. Voluntary repayments early in the
            life of the debt save the most, because they cut the balance that gets indexed every June.
          </div>
          <div className="example">
            <strong>$50,000 debt, $75,000 income</strong> — repayments start at just $821 a year, barely ahead of
            indexation. The debt takes around <strong>18 years</strong> to clear and accrues about{' '}
            <strong>$20,300 of indexation</strong>. This is the profile where extra repayments (or income growth)
            change the picture most dramatically.
          </div>

          <h2>Assumptions in this calculator</h2>
          <ul>
            <li>2026–27 repayment thresholds are held constant in future years (in reality they rise with wages).</li>
            <li>Indexation and income growth use the rates you set (defaults 3%) and apply once per year.</li>
            <li>Indexation is applied to the balance before the year’s repayments are credited, matching the ATO’s June/July sequencing.</li>
            <li>Repayment income is treated as your entered figure; add-backs like salary-sacrificed super are up to you to include.</li>
          </ul>

          <h2>Frequently asked questions</h2>
          {FAQ.map((f) => (
            <div className="faq-item" key={f.q}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}

          <p>
            Want to see the repayment in the context of your whole payslip — tax, Medicare levy and take-home pay? Use
            our <Link href="/income-tax-calculator/">Income Tax Calculator</Link> or{' '}
            <Link href="/pay-calculator/">Pay Calculator</Link>.
          </p>

          <p className="disclaimer">
            Calcroo provides estimates for general information only — not financial, tax or legal advice. Payoff
            projections depend on assumptions about indexation, income growth and unchanged thresholds that will not
            hold exactly in reality. Loan balances, rates and thresholds: check{' '}
            <a href="https://www.ato.gov.au" rel="noopener">ato.gov.au</a> and your myGov account, or speak to a
            registered tax agent.
          </p>
        </article>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}
