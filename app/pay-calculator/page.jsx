import PayCalculator from '../../components/PayCalculator';
import { SiteHeader, SiteFooter } from '../../components/Site';
import Link from 'next/link';

export const metadata = {
  title: 'Pay Calculator Australia 2026–27 — Hourly, Weekly & Annual After Tax',
  description:
    'Free Australian pay calculator for FY 2026–27. Convert hourly, weekly, fortnightly, monthly and annual pay — and see your take-home amount after tax, Medicare levy and HECS in every pay cycle.',
  alternates: {
    canonical: '/pay-calculator/',
    languages: {
      en: '/pay-calculator/',
      vi: '/vi/tinh-luong-uc/',
    },
  },
};

const FAQ = [
  {
    q: 'How do I convert an hourly rate to an annual salary in Australia?',
    a: 'Multiply your hourly rate by your weekly hours, then by 52. A standard full-time week is 38 hours, so $35 an hour is $35 × 38 × 52 = $69,160 a year before tax. This assumes paid annual leave — for casuals, weeks you don’t work aren’t paid, so annualising overstates income unless you work year-round.',
  },
  {
    q: 'What is $35 an hour after tax in Australia?',
    a: 'At 38 hours a week, $35 an hour is $69,160 a year. In 2026–27 that attracts about $11,268 in income tax and $1,383 Medicare levy, leaving take-home pay of roughly $56,509 a year — about $1,087 a week, or $28.60 an hour after tax.',
  },
  {
    q: 'What is $80,000 a year per hour in Australia?',
    a: 'On a standard 38-hour week, $80,000 a year works out to about $40.49 an hour before tax. After roughly $14,520 income tax and $1,600 Medicare levy, take-home pay is about $63,880 a year, or $1,228 a week.',
  },
  {
    q: 'Why is my fortnightly pay slightly different from this calculator?',
    a: 'Employers withhold tax using ATO withholding schedules, which round per pay period and annualise each payslip separately. Small differences wash out at tax time: your actual tax is calculated on your annual taxable income when you lodge your return, so over- or under-withholding becomes a refund or a bill.',
  },
  {
    q: 'Does the calculator include superannuation?',
    a: 'Enter your pay excluding super. The superannuation guarantee (12% in 2026–27) is paid by your employer on top of your wages into your super fund. If you have a “package including super” figure, divide it by 1.12 to get your base salary first.',
  },
  {
    q: 'How many work hours are in a year in Australia?',
    a: 'A 38-hour week over 52 weeks is 1,976 hours a year. Full-time employees are paid for all 52 weeks (including 4 weeks of annual leave), which is why annual salaries divide evenly by 52 — casual workers should instead multiply their rate by hours actually worked.',
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
      <SiteHeader langHref="/vi/tinh-luong-uc/" langLabel="Tiếng Việt" />
      <main className="wrap">
        <section className="hero">
          <div className="fy-chip">Updated for FY 2026–27</div>
          <h1>Pay Calculator Australia 2026–27</h1>
          <p>
            Convert your pay between hourly, weekly, fortnightly, monthly and yearly — and see the take-home amount for
            every cycle after tax, Medicare levy and HECS-HELP.
          </p>
        </section>

        <PayCalculator lang="en" />

        <article className="content">
          <h2>Converting pay periods: how the maths works</h2>
          <p>
            Australian jobs quote pay in different units — awards and casual roles in dollars per hour, salaried roles
            per year, rentals and budgets per week. Converting between them is simple arithmetic built on the standard{' '}
            <strong>38-hour full-time week</strong> and a <strong>52-week year</strong>:
          </p>
          <ul>
            <li>Hourly → yearly: rate × weekly hours × 52 (at 38 hours, that’s rate × 1,976)</li>
            <li>Yearly → weekly: salary ÷ 52 · Yearly → fortnightly: ÷ 26 · Yearly → monthly: ÷ 12</li>
            <li>Yearly → hourly: salary ÷ (weekly hours × 52)</li>
          </ul>
          <p>
            The pre-tax conversion is the easy half. The number that actually matters — what lands in your account —
            depends on income tax, the Medicare levy and any HECS-HELP repayment, all of which are calculated on your{' '}
            <em>annual</em> income and then spread across your pays. That’s what this calculator does for you.
          </p>

          <h2>Worked examples for 2026–27</h2>
          <div className="example">
            <strong>$35/hour, full-time (38h)</strong> — $1,330 a week, $69,160 a year before tax. Income tax $11,268
            and Medicare levy $1,383 leave take-home pay of about <strong>$56,509 a year</strong> — $1,087 a week, or
            an effective <strong>$28.60 per hour</strong> after tax.
          </div>
          <div className="example">
            <strong>$80,000/year salary</strong> — $40.49 an hour on a 38-hour week. After $14,520 tax and $1,600
            Medicare levy, take-home is about <strong>$63,880</strong>: $1,228 a week, $2,457 a fortnight, $5,323 a
            month.
          </div>
          <div className="example">
            <strong>$30/hour part-time (20h)</strong> — $31,200 a year. Tax is only $1,250 (after the low income tax
            offset) and the Medicare levy is reduced to $398 under the low-income shade-in, leaving about{' '}
            <strong>$29,552 a year</strong> or $568 a week. At lower incomes, a much bigger share of each dollar stays
            with you.
          </div>

          <h2>Salary vs hourly: traps to watch</h2>
          <h3>“Package” vs “base” salary</h3>
          <p>
            Job ads sometimes quote a package <em>including</em> super. A &quot;$88,000 package&quot; at the 2026–27
            super rate of 12% is a base salary of about $78,571 — divide by 1.12. All tax in this calculator applies to
            the base, because super isn’t part of your taxable salary.
          </p>
          <h3>Casual rates aren’t comparable one-for-one</h3>
          <p>
            Casual hourly rates include a loading (typically 25%) that compensates for no paid leave. $35/hour casual
            is closer to $28/hour permanent once leave entitlements are counted — and casuals aren’t paid for weeks
            they don’t work, so multiplying by 52 can overstate a casual’s real annual income. Our upcoming{' '}
            <strong>casual pay calculator</strong> will handle loadings and penalty rates properly.
          </p>
          <h3>Withholding ≠ your actual tax</h3>
          <p>
            The tax taken from each payslip follows ATO withholding tables — a good approximation spread across the
            year, not your final bill. Your true tax is settled when you lodge a return: deductions, offsets, a second
            job or a mid-year pay change all move the final number, which is why refunds (and debts) happen.
          </p>

          <h2>Frequently asked questions</h2>
          {FAQ.map((f) => (
            <div className="faq-item" key={f.q}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}

          <p>
            Want the full tax breakdown by bracket, with LITO and HECS bands itemised? Use our{' '}
            <Link href="/income-tax-calculator/">Income Tax Calculator 2026–27</Link>.
          </p>

          <p className="disclaimer">
            Calcroo provides estimates for general information only — not financial or tax advice. Figures assume you
            are an Australian resident for tax purposes with one job, claiming the tax-free threshold, and exclude
            deductions, offsets and levies not listed. Confirm your situation with{' '}
            <a href="https://www.ato.gov.au" rel="noopener">ato.gov.au</a> or a registered tax agent.
          </p>
        </article>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}
