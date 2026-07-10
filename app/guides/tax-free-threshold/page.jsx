import { SiteHeader, SiteFooter } from '../../../components/Site';
import Link from 'next/link';

export const metadata = {
  title: 'The Tax-Free Threshold Explained — $18,200, Who Claims It & When',
  description:
    'What the $18,200 tax-free threshold actually means in 2026–27: how to claim it, why you only claim it at one job, the part-year rule for new arrivals, and why you really pay nothing up to about $22,800.',
  alternates: {
    canonical: '/guides/tax-free-threshold/',
    languages: { en: '/guides/tax-free-threshold/', vi: '/vi/huong-dan/nguong-mien-thue/' },
  },
};

const FAQ = [
  {
    q: 'Do I pay tax if I earn under $18,200?',
    a: 'No income tax — and thanks to the Low Income Tax Offset, the practical zero-tax floor is higher: about $22,860 in 2026–27 before any income tax is actually payable, and the Medicare levy only starts above $28,011. But if your employer withheld tax during the year, you must lodge a return to get it refunded.',
  },
  {
    q: 'Should I tick “claim the tax-free threshold” on my TFN declaration?',
    a: 'Yes — at your main job (usually the one paying you most). Ticking it means your employer withholds less tax each pay. Leave it unticked at any second job, otherwise both employers under-withhold and the shortfall becomes a bill at tax time.',
  },
  {
    q: 'I arrived in Australia partway through the year — do I get the full threshold?',
    a: 'No. Part-year residents get $13,464 plus $4,736 × months of residency ÷ 12. Arrive in January and your threshold for that year is about $15,832. Our Tax Refund Calculator has a resident-months setting that applies this automatically.',
  },
  {
    q: 'Does the threshold apply to working holiday makers?',
    a: 'Generally no — most working holiday makers (subclass 417/462) are taxed at 15% from the first dollar under separate rates, regardless of the threshold. Residency and visa status change the picture, so check your specific situation with the ATO.',
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
      <SiteHeader langHref="/vi/huong-dan/nguong-mien-thue/" langLabel="Tiếng Việt" />
      <main className="wrap">
        <section className="hero">
          <div className="fy-chip">Guide · FY 2026–27</div>
          <h1>The Tax-Free Threshold, Explained</h1>
          <p>
            The first $18,200 you earn each year is income-tax free — but how you claim it, where you claim it, and
            what happens mid-year are where people get caught.
          </p>
        </section>

        <article className="content" style={{ marginTop: '1rem' }}>
          <h2>What it actually is</h2>
          <p>
            Australian residents pay <strong>no income tax on the first $18,200</strong> of taxable income each
            financial year. It is not a discount you apply for annually — it is built into the tax brackets. What you{' '}
            <em>do</em> control is the <strong>TFN declaration</strong> you fill in when starting a job: ticking
            &quot;claim the tax-free threshold&quot; tells that employer to withhold as if your first $18,200 is
            tax-free, so more of each pay reaches your pocket during the year.
          </p>

          <h2>The real zero-tax floor is higher than $18,200</h2>
          <p>
            Two quiet helpers push the practical floor up. The <strong>Low Income Tax Offset</strong> (up to $700)
            wipes out the tax bill until income reaches about <strong>$22,860</strong> in 2026–27. And the{' '}
            <strong>Medicare levy</strong> has its own low-income threshold — nothing is payable below{' '}
            <strong>$28,011</strong> for singles, then it shades in gradually. So a student earning $22,000 pays
            precisely zero — and if tax was withheld from their casual pay, all of it comes back at tax time. Check
            your own numbers in the <Link href="/income-tax-calculator/">Income Tax Calculator</Link>.
          </p>

          <h2>One job claims it. Only one.</h2>
          <p>
            The threshold belongs to <em>you</em>, not to each job — claim it at your highest-paying job and leave the
            box unticked everywhere else. Claiming at two jobs is the single most common cause of surprise tax bills:
            both employers withhold as if they are your only income, the combined withholding falls short, and the ATO
            collects the difference at assessment. Working two jobs? Our{' '}
            <Link href="/guides/second-job-tax/">second-job tax guide</Link> walks through the maths.
          </p>

          <h2>Arrived or left mid-year? It shrinks</h2>
          <p>
            The full $18,200 assumes a full year of Australian tax residency. New arrivals get a pro-rated threshold:{' '}
            <strong>$13,464 + $4,736 × months here ÷ 12</strong>. Land in January and your first-year threshold is
            about $15,832 — a detail most calculators ignore and new migrants discover as an unexpected bill. The{' '}
            <Link href="/tax-refund-calculator/">Tax Refund Calculator</Link> has a resident-months setting for exactly
            this.
          </p>

          <h2>Frequently asked questions</h2>
          {FAQ.map((f) => (
            <div className="faq-item" key={f.q}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}

          <p className="disclaimer">
            General information only, based on published 2026–27 resident rates — not tax advice. Residency and visa
            status change outcomes; confirm your situation at{' '}
            <a href="https://www.ato.gov.au" rel="noopener">ato.gov.au</a> or with a registered tax agent.
          </p>
        </article>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}
