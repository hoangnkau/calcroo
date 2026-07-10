import TaxCalculator from '../../components/TaxCalculator';
import { SiteHeader, SiteFooter } from '../../components/Site';

export const metadata = {
  title: 'Income Tax Calculator Australia 2026–27 — Take-Home Pay, HECS & Medicare',
  description:
    'Free Australian income tax calculator updated for FY 2026–27. Instantly see your take-home pay, income tax, Medicare levy and HECS-HELP repayment under the new 15% bracket and marginal HECS system.',
  alternates: {
    canonical: '/income-tax-calculator/',
    languages: {
      en: '/income-tax-calculator/',
      vi: '/vi/tinh-thue-thu-nhap-uc/',
    },
  },
};

const FAQ = [
  {
    q: 'What are the Australian income tax rates for 2026–27?',
    a: 'For Australian residents in 2026–27: the first $18,200 is tax-free, income from $18,201 to $45,000 is taxed at 15% (cut from 16% on 1 July 2026), $45,001 to $135,000 at 30%, $135,001 to $190,000 at 37%, and everything above $190,000 at 45%. The Medicare levy of 2% applies on top for most taxpayers.',
  },
  {
    q: 'How is HECS-HELP repayment calculated in 2026–27?',
    a: 'HECS-HELP uses a marginal repayment system. For 2026–27 you repay nothing on repayment income up to $69,528, then 15c for each dollar between $69,529 and $129,717, and $9,028 plus 17c for each dollar from $129,718 to $186,050. Above $186,050, repayment switches to a flat 10% of your total repayment income. Unlike the pre-2025 system, the marginal rates apply only to income above each threshold — not your whole income.',
  },
  {
    q: 'How much HECS do I pay if I earn $130,000?',
    a: 'On $130,000 of repayment income in 2026–27, you repay $9,028 (the full 15% band from $69,529 to $129,717) plus 17% of the $283 above $129,717 (about $48) — a total compulsory repayment of about $9,076 for the year.',
  },
  {
    q: 'Did the government really cut 20% off HECS debts?',
    a: 'Yes. A one-off 20% reduction was applied to outstanding HELP, VET and other student loan balances, based on the amount owed as at 1 June 2025. It reduced your debt balance automatically — you did not need to apply. It does not change your compulsory repayment rate, which is based on your income.',
  },
  {
    q: 'Does this calculator include superannuation?',
    a: 'Enter your salary excluding super. Employer super (12% in 2026–27) is paid on top of your salary into your super fund and is not part of your taxable income, so it does not affect the income tax calculated here.',
  },
  {
    q: 'Is this calculator accurate for non-residents or working holiday makers?',
    a: 'Not yet — this calculator currently applies Australian resident tax rates only, including the tax-free threshold and low income tax offset. Non-residents and working holiday makers are taxed under different schedules. Dedicated modes for those cases are on our roadmap.',
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
      <SiteHeader langHref="/vi/tinh-thue-thu-nhap-uc/" langLabel="Tiếng Việt" />
      <main className="wrap">
        <section className="hero">
          <div className="fy-chip">Updated for FY 2026–27 · rates from 1 July 2026</div>
          <h1>Income Tax Calculator Australia 2026–27</h1>
          <p>
            See your take-home pay, income tax, Medicare levy and HECS-HELP repayment under the new 2026–27 rates —
            instantly, privately, in your browser.
          </p>
        </section>

        <TaxCalculator lang="en" />

        <article className="content">
          <h2>How income tax works in Australia in 2026–27</h2>
          <p>
            Australia uses a progressive tax system: your income is split into brackets, and each bracket is taxed at
            its own rate. You never pay the top rate on your whole income — only on the part that falls inside that
            bracket. From <strong>1 July 2026</strong>, the second bracket rate dropped from 16% to <strong>15%</strong>,
            which means every taxpayer earning over $45,000 saves up to $268 a year compared with 2025–26.
          </p>

          <table>
            <thead>
              <tr>
                <th>Taxable income (2026–27)</th>
                <th>Rate</th>
                <th>Tax on this bracket</th>
              </tr>
            </thead>
            <tbody>
              <tr><td>$0 – $18,200</td><td>0%</td><td>Nil</td></tr>
              <tr><td>$18,201 – $45,000</td><td>15%</td><td>15c for each $1 over $18,200</td></tr>
              <tr><td>$45,001 – $135,000</td><td>30%</td><td>$4,020 + 30c for each $1 over $45,000</td></tr>
              <tr><td>$135,001 – $190,000</td><td>37%</td><td>$31,020 + 37c for each $1 over $135,000</td></tr>
              <tr><td>$190,001 +</td><td>45%</td><td>$51,370 + 45c for each $1 over $190,000</td></tr>
            </tbody>
          </table>

          <p>
            On top of income tax, most taxpayers pay the <strong>Medicare levy</strong> of 2% of taxable income, which
            funds the public health system. If your income is below the low-income threshold you pay a reduced levy or
            none at all, and some people (for example certain visa holders not entitled to Medicare) can claim a full
            exemption.
          </p>

          <h2>What changed on 1 July 2026</h2>
          <ul>
            <li>
              <strong>Tax cut:</strong> the 16% rate on income between $18,201 and $45,000 fell to 15%. A further cut
              to 14% is legislated for 1 July 2027.
            </li>
            <li>
              <strong>Superannuation guarantee</strong> remains at 12%, paid by your employer on top of your salary.
            </li>
            <li>
              <strong>HECS-HELP indexation and thresholds</strong> were updated for the new financial year under the
              marginal repayment system introduced in 2025–26.
            </li>
          </ul>

          <h2>Worked examples</h2>
          <div className="example">
            <strong>Earning $60,000</strong> — income tax is $8,520, reduced by a $100 low income tax offset to $8,420.
            Medicare levy adds $1,200. Total deductions: $9,620, leaving take-home pay of about <strong>$50,380</strong>{' '}
            a year ($4,198 a month).
          </div>
          <div className="example">
            <strong>Earning $90,000</strong> — income tax is $17,520 and Medicare levy $1,800, for take-home pay of
            about <strong>$70,680</strong> ($5,890 a month). With a HECS debt, a compulsory repayment of $3,071 applies,
            reducing take-home pay to about $67,609.
          </div>
          <div className="example">
            <strong>Earning $150,000</strong> — income tax is $36,570 and Medicare levy $3,000, leaving about{' '}
            <strong>$110,430</strong> a year ($9,203 a month). The marginal rate is 37%, but the effective rate is only
            26.4% — a good illustration of how bracket-by-bracket taxation works.
          </div>

          <h2>HECS-HELP repayments: the new marginal system</h2>
          <p>
            Since 2025–26, compulsory HELP repayments work like tax brackets instead of the old &quot;cliff&quot;
            system. For 2026–27, nothing is repaid on repayment income up to <strong>$69,528</strong>. Above that, you
            repay <strong>15c per dollar</strong> up to $129,717, then <strong>$9,028 plus 17c per dollar</strong> up
            to $186,050. From <strong>$186,051</strong>, the repayment becomes a flat <strong>10% of your total
            repayment income</strong>. Under the pre-2025 rules, crossing a threshold increased the rate on your{' '}
            <em>entire</em> income; under the marginal system only the income above each threshold is affected.
          </p>
          <p>
            Repayments are based on your <em>repayment income</em>, which is taxable income plus certain add-backs such
            as reportable fringe benefits and salary-sacrificed super. If you salary sacrifice, your HECS repayment can
            be higher than this calculator shows — our upcoming salary sacrifice calculator will handle that case.
          </p>

          <h2>What counts as taxable income?</h2>
          <p>
            Taxable income is your assessable income (salary, wages, bank interest, dividends, net rental income and so
            on) minus allowable deductions (work-related expenses, donations, accountant fees). This calculator takes
            the figure you enter as taxable income. If you expect significant deductions, enter your income after
            subtracting them for a closer estimate of your tax refund position.
          </p>

          <h2>Frequently asked questions</h2>
          {FAQ.map((f) => (
            <div className="faq-item" key={f.q}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}

          <p className="disclaimer">
            Calcroo provides estimates for general information only — it is not financial, tax or legal advice, and
            does not consider your personal circumstances. Figures apply to Australian residents for tax purposes and
            exclude offsets, levies and surcharges not listed (such as the Medicare levy surcharge and Division 293
            tax). Rates are based on Australian Taxation Office published figures for 2026–27. Always confirm with{' '}
            <a href="https://www.ato.gov.au" rel="noopener">ato.gov.au</a> or a registered tax agent.
          </p>
        </article>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}
