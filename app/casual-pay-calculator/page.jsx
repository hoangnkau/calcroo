import CasualPayCalculator from '../../components/CasualPayCalculator';
import { SiteHeader, SiteFooter } from '../../components/Site';
import Link from 'next/link';

export const metadata = {
  title: 'Casual Pay Calculator Australia 2026–27 — Loading, Penalty Rates & Take-Home',
  description:
    'Free casual pay calculator for Australia, FY 2026–27. Weekend and public holiday penalty hours, realistic weeks worked, casual loading — and your real take-home pay after tax.',
  alternates: {
    canonical: '/casual-pay-calculator/',
    languages: {
      en: '/casual-pay-calculator/',
      vi: '/vi/tinh-luong-casual/',
    },
  },
};

const FAQ = [
  {
    q: 'What is casual loading in Australia?',
    a: 'Casual loading is an extra percentage — 25% under most awards — added to the base hourly rate to compensate casuals for entitlements they don’t get: paid annual leave, paid sick leave, notice of termination and redundancy pay. A permanent role at $25.60/hour and a casual role at $32/hour are roughly equivalent once the loading is stripped out.',
  },
  {
    q: 'How much tax do casuals pay in Australia?',
    a: 'The same income tax rates as everyone else — there is no special “casual tax”. If more tax seems to come out of a big week, that’s just withholding tables treating that week as if you earned that much all year; it evens out in your tax return. Your actual tax is based on your total annual income.',
  },
  {
    q: 'What are typical penalty rates for casuals?',
    a: 'It depends entirely on your award. As a rough guide, many hospitality and retail awards pay casuals around 1.5× on Saturdays, 1.75× on Sundays and 2.5× on public holidays (all relative to the base rate, with loading interactions varying by award). Always check your exact award and classification on fairwork.gov.au — the calculator lets you set your own multipliers.',
  },
  {
    q: 'Why shouldn’t I multiply my weekly pay by 52?',
    a: 'Because casuals aren’t paid for weeks they don’t work — holidays, quiet seasons, exam weeks, being sick. Working 46 weeks instead of 52 at $35/hour full-time hours is roughly an $8,000 difference in gross income. Our calculator defaults to 48 weeks; set it to your reality.',
  },
  {
    q: 'Do casual workers get superannuation?',
    a: 'Yes — employers must pay the superannuation guarantee (12% in 2026–27) on your ordinary time earnings, regardless of casual status or how few hours you work. Check your payslip and super fund account; unpaid super is one of the most common problems casual workers face.',
  },
  {
    q: 'What is the minimum casual wage in Australia?',
    a: 'From 1 July 2026 the national minimum wage plus 25% casual loading sets the floor for award-free casuals, and most industries have higher award minimums by classification and age. If your rate looks below the minimum for your award, check fairwork.gov.au or call the Fair Work Ombudsman — being paid cash does not remove these rights.',
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
      <SiteHeader langHref="/vi/tinh-luong-casual/" langLabel="Tiếng Việt" />
      <main className="wrap">
        <section className="hero">
          <div className="fy-chip">Updated for FY 2026–27</div>
          <h1>Casual Pay Calculator Australia 2026–27</h1>
          <p>
            Built for how casual work actually pays: penalty hours on weekends and public holidays, weeks you don’t
            work, casual loading — and what’s left after tax.
          </p>
        </section>

        <CasualPayCalculator lang="en" />

        <article className="content">
          <h2>Why casual pay needs its own calculator</h2>
          <p>
            Standard salary calculators assume a neat 38-hour week, 52 paid weeks a year and one flat rate. Casual work
            breaks all three assumptions: your rate carries a <strong>25% loading</strong>, your best money often comes
            from <strong>penalty hours</strong> on weekends and public holidays, and you’re only paid for{' '}
            <strong>weeks you actually work</strong>. Ignore any of these and your annual estimate can be thousands of
            dollars off — in either direction.
          </p>

          <h2>Worked examples for 2026–27</h2>
          <div className="example">
            <strong>Student schedule: $32/hour, 20 ordinary hours + 8 Sunday hours (×1.75), 48 weeks</strong> — a
            typical week grosses $1,088, or $52,224 a year. After $5,971 tax and $1,044 Medicare levy, take-home is
            about <strong>$45,209</strong> — roughly $942 per working week. Note how the 8 Sunday hours contribute $448
            of the $1,088: penalty hours punch far above their weight.
          </div>
          <div className="example">
            <strong>Full-time casual: $35/hour, 38 hours, 46 weeks</strong> (allowing for quiet weeks and unpaid
            breaks) — $61,180 gross, take-home about <strong>$51,165</strong>. The same rate at a naive 52 weeks would
            show $69,160 gross — an $8,000 overestimate that matters if you’re budgeting rent or a loan application.
          </div>

          <h2>Casual loading: what the extra 25% is really for</h2>
          <p>
            The loading isn’t a bonus — it’s compensation, paid hourly, for entitlements you give up: 4 weeks of paid
            annual leave, paid personal leave, redundancy pay and notice. That’s why comparing a casual rate to a
            permanent rate at face value misleads: <strong>divide the casual rate by 1.25</strong> for a fair
            comparison. $32 casual ≈ $25.60 permanent, before you weigh job security and predictable hours.
          </p>

          <h2>Penalty rates: check your award, not the internet</h2>
          <p>
            Weekend and public holiday multipliers are set by your <strong>award</strong> (or enterprise agreement),
            and they genuinely differ — hospitality, retail, aged care and warehousing all handle casual weekend rates
            differently, and some awards apply the multiplier to the base rate while others interact with the loading.
            The multipliers in this calculator are editable defaults, not advice: find your award and classification on{' '}
            fairwork.gov.au (the P.A.C.T. pay calculator there is the official source) and enter your real numbers.
          </p>
          <p>
            Public holidays also vary by state — most states and territories observe between 10 and 13 a year, and
            several have regional or part-day holidays. If you regularly work them at 2.5×, they can add four figures
            to your year; enter your expected public holiday hours annually in the calculator.
          </p>

          <h2>Tax for casuals: three things to get right</h2>
          <ul>
            <li>
              <strong>Claim the tax-free threshold at one job only.</strong> Two casual jobs both claiming it is the
              classic recipe for a year-end tax bill.
            </li>
            <li>
              <strong>Big weeks get over-withheld.</strong> Withholding tables annualise each pay, so a huge week is
              taxed as if every week were huge. You get the excess back at tax time — it’s not lost.
            </li>
            <li>
              <strong>Super applies to casuals.</strong> 12% on ordinary time earnings from your employer, no minimum
              hours. Verify it’s actually landing in your fund.
            </li>
          </ul>

          <h2>Frequently asked questions</h2>
          {FAQ.map((f) => (
            <div className="faq-item" key={f.q}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}

          <p>
            Comparing a casual offer against a salaried role? Run the salary through our{' '}
            <Link href="/pay-calculator/">Pay Calculator</Link>, and see the full tax breakdown in the{' '}
            <Link href="/income-tax-calculator/">Income Tax Calculator</Link>.
          </p>

          <p className="disclaimer">
            Calcroo provides estimates for general information only — not financial, tax or legal advice. Penalty rates
            and minimum wages depend on your award, agreement and classification: confirm them at fairwork.gov.au. Tax
            figures assume an Australian resident claiming the tax-free threshold at one job. Check{' '}
            <a href="https://www.ato.gov.au" rel="noopener">ato.gov.au</a> or a registered tax agent for your
            circumstances.
          </p>
        </article>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}
