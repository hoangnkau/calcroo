import TaxRefundCalculator from '../../components/TaxRefundCalculator';
import { SiteHeader, SiteFooter } from '../../components/Site';
import Link from 'next/link';

export const metadata = {
  title: 'Tax Refund Calculator 2026 — Estimate Your 2025–26 Tax Return',
  description:
    'Free tax refund calculator for your 2025–26 Australian tax return (lodging July–October 2026). Enter income, deductions and tax withheld to estimate your refund or bill — using the correct 2025–26 rates.',
  alternates: {
    canonical: '/tax-refund-calculator/',
    languages: {
      en: '/tax-refund-calculator/',
      vi: '/vi/tinh-hoan-thue-uc/',
    },
  },
};

const FAQ = [
  {
    q: 'Which tax year does my July 2026 tax return cover?',
    a: 'The return you lodge from 1 July 2026 covers income earned between 1 July 2025 and 30 June 2026 — so it uses the 2025–26 rates, including the 16% second bracket. The cut to 15% only applies to income you earn from 1 July 2026, which lands in next year’s return. This calculator uses the correct 2025–26 rates.',
  },
  {
    q: 'When can I lodge my 2026 tax return, and when is the deadline?',
    a: 'You can lodge via myTax from 1 July 2026, but it’s smart to wait until your income statement shows “tax ready” in myGov (usually late July) so the pre-filled numbers are final. The self-lodgment deadline is 31 October 2026; if you register with a tax agent before that date, you typically get an extended deadline.',
  },
  {
    q: 'How much tax will I get back if I earn $60,000?',
    a: 'There’s no fixed answer — a refund is simply the difference between what was withheld from your pay and your actual liability. On $60,000 taxable income in 2025–26, the liability is about $9,888 (tax $8,688 after LITO, Medicare levy $1,200). If your employer withheld more than that — common if you had deductions, gaps between jobs, or leftover offsets — the excess comes back as a refund.',
  },
  {
    q: 'Why do deductions increase my refund?',
    a: 'Deductions reduce your taxable income, and the saving equals the deduction times your marginal rate. Claiming $2,500 of work expenses at the 30% bracket (plus 2% Medicare) puts about $800 back in your pocket. Keep receipts — the ATO can ask for evidence up to 5 years later.',
  },
  {
    q: 'Why did my HECS make my refund smaller?',
    a: 'Your compulsory HECS repayment is settled through your tax return. If your employer withheld too little for it during the year, the shortfall is deducted from your refund (or added to your bill). Note: many people’s 2025–26 repayment is lower than expected because of the new marginal system — if your employer kept withholding at old rates early in the year, that excess comes back to you in this return.',
  },
  {
    q: 'Is this estimate the same as my ATO notice of assessment?',
    a: 'No — it’s a close estimate for planning. Your actual assessment can differ due to private health insurance and the Medicare levy surcharge, other offsets, HELP add-backs like reportable super, capital gains, or ATO adjustments to prior debts. For the official figure, lodge via myTax or use a registered tax agent.',
  },
  {
    q: 'What is the Medicare levy surcharge, and will it hit me?',
    a: 'On top of the standard 2% Medicare levy, singles earning above about $101,000 (2025–26) without private hospital cover pay an extra 1–1.5% surcharge on their income — $1,500 on $120,000. It catches people who got a pay rise and never bought cover. Untick “private hospital cover” in the advanced options to see your exposure; thresholds are for singles and rise for families.',
  },
  {
    q: 'I moved to Australia partway through the year — do I get the full $18,200 tax-free threshold?',
    a: 'No — the threshold is pro-rated: $13,464 plus $4,736 × months you were a resident ÷ 12. Arrive in January and your 2025–26 threshold is about $15,832, not $18,200. Set your resident months in the advanced options — most calculators ignore this and overstate refunds for new arrivals.',
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
      <SiteHeader langHref="/vi/tinh-hoan-thue-uc/" langLabel="Tiếng Việt" />
      <main className="wrap">
        <section className="hero">
          <div className="fy-chip">For 2025–26 returns · lodge 1 Jul – 31 Oct 2026</div>
          <h1>Tax Refund Calculator 2026</h1>
          <p>
            Estimate your 2025–26 tax return before you lodge: enter your income, deductions and tax withheld, and see
            whether a refund or a bill is coming — calculated on the correct 2025–26 rates.
          </p>
        </section>

        <TaxRefundCalculator lang="en" />

        <article className="content">
          <h2>How a tax refund actually works</h2>
          <p>
            Through the year, your employer withholds tax from each pay using ATO schedules — a running estimate of
            your annual bill. When you lodge your return, the ATO calculates your <em>actual</em> liability from your
            real taxable income. <strong>Refund = tax withheld − actual liability.</strong> That’s all a refund is: a
            settlement of the difference. Deductions, job changes mid-year, unused offsets and over-withheld HECS all
            tilt the balance toward you.
          </p>

          <h2>One trap this calculator avoids: the right year’s rates</h2>
          <p>
            The return you lodge in July–October 2026 covers the year that <em>ended</em> 30 June 2026 — so it must use{' '}
            <strong>2025–26 rates</strong>: the second bracket at <strong>16%</strong>, and the 2025–26 HECS thresholds
            ($67,000 minimum). The much-advertised 15% rate only applies to income earned from 1 July 2026, which
            belongs to <em>next</em> year’s return. Several calculators quietly mix the two years; ours keeps them
            separate (our other tools use 2026–27 rates for current-year pay).
          </p>

          <h2>Worked examples</h2>
          <div className="example">
            <strong>$80,000 salary, $2,500 in deductions</strong> — taxable income $77,500, liability $15,588. An
            employer withholding against the full $80,000 took about $16,388, so the estimated refund is{' '}
            <strong>≈ $800</strong> — almost exactly the deductions × 32% (marginal rate + Medicare).
          </div>
          <div className="example">
            <strong>Student on $32,000, $3,500 withheld</strong> — liability is only $1,986 thanks to the tax-free
            threshold, LITO and the reduced Medicare levy, so the estimated refund is <strong>≈ $1,514</strong>. Lower
            incomes with any withholding often see the largest refunds relative to income.
          </div>

          <h2>Surcharge and part-year rules: the two silent adjusters</h2>
          <p>
            Two items blindside more people than any others at tax time. The <strong>Medicare levy surcharge</strong>:
            earn above the threshold without private hospital cover and an extra 1–1.5% applies to your whole income
            — a $1,500 surprise at $120,000. And the <strong>part-year tax-free threshold</strong>: arrive or leave
            Australia mid-year and your $18,200 threshold shrinks pro-rata, so new residents often owe more than a
            standard calculator suggests. This estimator models both — open the advanced options.
          </p>

          <h2>Deductions people forget</h2>
          <ul>
            <li><strong>Working-from-home:</strong> the fixed-rate method needs a record of hours — a diary or roster works. The calculator's deduction breakdown has a built-in hours helper that does the maths for you.</li>
            <li><strong>Tools, uniforms and laundry,</strong> union fees, professional memberships and subscriptions used for work.</li>
            <li><strong>Self-education</strong> connected to your current job, and work-related travel between job sites (not home-to-work).</li>
            <li><strong>Last year’s tax agent fee</strong> is deductible this year, and donations of $2+ to registered charities.</li>
          </ul>
          <p>
            Only claim what you actually spent and can evidence — the ATO’s data-matching is extensive, and inflated
            claims are the fastest way to turn a refund into an audit.
          </p>

          <h2>Timeline for the 2026 season</h2>
          <ul>
            <li><strong>1 July 2026:</strong> myTax opens for 2025–26 returns.</li>
            <li><strong>Late July:</strong> income statements marked “tax ready”; pre-fill data (bank interest, dividends, health cover) flows in. Lodging before this risks amendments.</li>
            <li><strong>31 October 2026:</strong> deadline to self-lodge, or to be registered with a tax agent for an extension.</li>
            <li><strong>Refund timing:</strong> most myTax refunds arrive within about 2 weeks of lodgment.</li>
          </ul>

          <h2>Frequently asked questions</h2>
          {FAQ.map((f) => (
            <div className="faq-item" key={f.q}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}

          <p>
            Planning the year ahead instead? Our <Link href="/income-tax-calculator/">Income Tax Calculator</Link> uses
            the new 2026–27 rates, and the <Link href="/hecs-repayment-calculator/">HECS Repayment Calculator</Link>{' '}
            shows your repayment under this year’s thresholds.
          </p>

          <p className="disclaimer">
            Calcroo provides estimates for general information only — not tax advice, and not a substitute for your ATO
            assessment. Estimates cover singles’ Medicare levy surcharge thresholds only (family thresholds differ) and exclude private health rebate adjustments, capital gains, and other offsets or debts. Surcharge thresholds should be confirmed against ato.gov.au. Lodge via myGov/myTax or a registered tax agent; verify rates at{' '}
            <a href="https://www.ato.gov.au" rel="noopener">ato.gov.au</a>.
          </p>
        </article>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}
