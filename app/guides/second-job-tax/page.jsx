import { SiteHeader, SiteFooter } from '../../../components/Site';
import Link from 'next/link';

export const metadata = {
  title: 'Second Job Tax in Australia — The “Taxed Higher” Myth, Explained',
  description:
    'Does a second job get taxed more in Australia? No — but withholding works differently, and the tax-free threshold and HECS create real traps. Worked examples at 2026–27 rates.',
  alternates: {
    canonical: '/guides/second-job-tax/',
    languages: { en: '/guides/second-job-tax/', vi: '/vi/huong-dan/lam-2-job-thue/' },
  },
};

const FAQ = [
  {
    q: 'Is a second job taxed at a higher rate?',
    a: 'No. Australia taxes your combined income through the same brackets regardless of how many jobs produce it. What is true: your second job’s dollars stack on top of your first job’s, so they are taxed at your marginal rate (often 30%+) rather than enjoying the tax-free threshold again — and withholding without the threshold looks harsher on the payslip.',
  },
  {
    q: 'Why does my second job withhold so much tax?',
    a: 'Because you (correctly) did not claim the tax-free threshold there, its withholding schedule assumes every dollar is taxed from the first cent. That often slightly over-withholds — which returns to you as a refund at tax time. Annoying during the year, but the safe direction to err.',
  },
  {
    q: 'What if I claimed the threshold at both jobs?',
    a: 'Both employers withheld as if they were your only job, so combined withholding falls short of your actual tax — the gap becomes a bill with your assessment. Fix it going forward: give your second employer a withholding declaration unticking the threshold. If the bill is large, the ATO offers payment plans.',
  },
  {
    q: 'How does HECS work with two jobs?',
    a: 'This is the sneakiest trap: employers only withhold HECS when your pay at that job crosses the threshold. Two jobs each under $69,528 (2026–27) means nobody withholds a cent — but your repayment is assessed on combined income. Two jobs at $45,000 and $30,000 = $75,000 repayment income = about an $820 HECS bill nobody set aside. Ask one employer to withhold extra, or save for it.',
  },
];

export default function Page() {
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };

  return (
    <>
      <SiteHeader langHref="/vi/huong-dan/lam-2-job-thue/" langLabel="Tiếng Việt" />
      <main className="wrap">
        <section className="hero">
          <div className="fy-chip">Guide · FY 2026–27</div>
          <h1>Second Job Tax: The Myth and the Maths</h1>
          <p>
            &quot;Don&apos;t take a second job, it gets taxed to death&quot; — half myth, half misunderstanding. Here
            is what actually happens to your tax when job number two starts.
          </p>
        </section>

        <article className="content" style={{ marginTop: '1rem' }}>
          <h2>The myth, retired</h2>
          <p>
            There is no special &quot;second job tax rate&quot;. The ATO taxes your <strong>combined annual
            income</strong> through the same brackets whether it came from one payer or five. The confusion comes from
            two real effects: your second job&apos;s income <em>stacks on top</em> of your first (so it is taxed at
            your marginal rate, not from zero), and its payslip withholding looks heavier because the tax-free
            threshold is — correctly — not claimed there.
          </p>

          <div className="example">
            <strong>Worked example (2026–27):</strong> Job 1 pays $50,000, job 2 adds $20,000 — combined $70,000. Total
            tax and Medicare: about <strong>$12,920</strong>. On $50,000 alone it would be $6,270 — so the extra
            $20,000 carries about $6,650, an average of <strong>33 cents per dollar</strong>. Not because job 2 is
            &quot;taxed higher&quot; — because those dollars sit in the 30% bracket plus Medicare instead of starting
            at zero. Model your own combination in the <Link href="/pay-calculator/">Pay Calculator</Link>.
          </div>

          <h2>Where the threshold goes</h2>
          <p>
            Claim the tax-free threshold at your <strong>main job only</strong>. The second job withholds without it —
            which usually <em>over</em>-withholds slightly and comes back as a refund. The genuinely expensive mistake
            is claiming it twice: combined withholding falls short and the difference arrives as a bill. Full details
            in our <Link href="/guides/tax-free-threshold/">tax-free threshold guide</Link>.
          </p>

          <h2>The HECS two-job trap</h2>
          <p>
            Employers withhold HECS only when <em>that job&apos;s</em> pay crosses the repayment threshold ($69,528 in
            2026–27). Two jobs each below it → <strong>nobody withholds anything</strong> → but the ATO assesses your
            repayment on the combined total. $45,000 + $30,000 = $75,000 repayment income ≈ an{' '}
            <strong>$820 bill</strong> at tax time that no payslip ever hinted at. If this is you: ask your main
            employer for extra withholding, or park the amount in savings — the{' '}
            <Link href="/hecs-repayment-calculator/">HECS calculator</Link> tells you how much.
          </p>

          <h2>At tax time it all comes out in the wash</h2>
          <p>
            Every job&apos;s income statement lands in myGov automatically and you lodge <strong>one</strong> return
            combining everything. Withholding was only ever an estimate — the return is where reality settles. Estimate
            yours before lodging with the <Link href="/tax-refund-calculator/">Tax Refund Calculator</Link> (it has a
            second-job line in the income breakdown).
          </p>

          <h2>Frequently asked questions</h2>
          {FAQ.map((f) => (
            <div className="faq-item" key={f.q}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}

          <p className="disclaimer">
            General information at published 2026–27 resident rates — not tax advice. Confirm your situation at{' '}
            <a href="https://www.ato.gov.au" rel="noopener">ato.gov.au</a> or with a registered tax agent.
          </p>
        </article>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}
