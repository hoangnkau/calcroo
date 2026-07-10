import { SiteHeader, SiteFooter } from '../../../components/Site';
import Link from 'next/link';

export const metadata = {
  title: 'How to Lodge Your Tax Return in 2026 — Dates, myTax Steps & Refunds',
  description:
    'Everything about lodging your 2025–26 Australian tax return: key dates, the myTax walkthrough, what to have ready, common deductions, HECS changes and how refunds work in 2026.',
  alternates: {
    canonical: '/guides/tax-return-2026-australia/',
    languages: {
      en: '/guides/tax-return-2026-australia/',
      vi: '/vi/huong-dan/khai-thue-uc-2026/',
    },
  },
};

const FAQ = [
  {
    q: 'When is the tax return deadline in 2026?',
    a: '31 October 2026 if you lodge yourself through myTax. If you register with a registered tax agent before 31 October, your deadline extends — often to May 2027. Lodging late without an agent can attract failure-to-lodge penalties even when you are owed a refund.',
  },
  {
    q: 'When will I get my refund?',
    a: 'Most electronically lodged returns are processed within about two weeks, with the refund paid to the bank account you nominate in the return. Complex returns, data mismatches or old debts can slow it down; you can track progress in the ATO section of myGov.',
  },
  {
    q: 'Should I lodge on 1 July?',
    a: 'Usually no. Employers have until mid-July to finalise income statements, and banks and health funds pre-fill through July. Lodging before your income statement shows “Tax ready” is the top cause of amended returns. Late July is the sweet spot for most people.',
  },
  {
    q: 'Do I need to lodge if I earned under $18,200?',
    a: 'If any tax was withheld from your pay — common for casuals and part-timers — lodge: that withheld tax generally comes back as a refund. If you truly had no tax withheld and no obligation, submit a “non-lodgment advice” through myGov instead so the ATO does not chase you.',
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
      <SiteHeader langHref="/vi/huong-dan/khai-thue-uc-2026/" langLabel="Tiếng Việt" />
      <main className="wrap">
        <section className="hero">
          <div className="fy-chip">Guide · tax time 2026</div>
          <h1>How to Lodge Your Tax Return in 2026</h1>
          <p>
            The 2025–26 income year ended on 30 June. Here is the whole process — dates, documents, myTax steps and
            refund timing — in one page.
          </p>
        </section>

        <article className="content" style={{ marginTop: '1rem' }}>
          <h2>The 2026 tax-time calendar</h2>
          <ul>
            <li><strong>1 July 2026</strong> — lodgment opens for the 2025–26 year in myTax.</li>
            <li><strong>14 July 2026</strong> — employers’ deadline to finalise your income statement.</li>
            <li><strong>Mid–late July</strong> — statements show “Tax ready”; bank interest, dividends and health-fund details pre-fill. The sensible time to lodge starts here.</li>
            <li><strong>31 October 2026</strong> — deadline for self-lodgers, and the last day to register with a tax agent for an extended deadline.</li>
          </ul>

          <h2>What to have ready</h2>
          <p>
            A linked <strong>myGov → ATO</strong> account does most of the collecting for you: income statements from
            every employer, bank interest and private health details flow in automatically. What the ATO can&apos;t
            pre-fill is your side of the ledger — <strong>deduction records</strong>: working-from-home hours (a diary
            or roster), receipts for tools, uniforms and self-education, donation receipts, and last year&apos;s tax
            agent fee. If you drive for work, your logbook or kilometre record.
          </p>

          <h2>myTax in seven steps</h2>
          <ol>
            <li>Sign in to myGov → Australian Taxation Office → <em>Lodge your tax return</em>.</li>
            <li>Confirm your contact and bank details — this is the account your refund lands in.</li>
            <li>Review pre-filled income: every employer, bank interest, dividends. Add anything missing (cash income, side-gig ABN income).</li>
            <li>Add deductions by category. Claim what is real and substantiated — inflated work expenses are the ATO&apos;s favourite audit trigger.</li>
            <li>Answer the Medicare and private health questions — this is where the levy surcharge is worked out.</li>
            <li>Check the estimate screen. It should be close to our <Link href="/tax-refund-calculator/">Tax Refund Calculator</Link> figure if your inputs match.</li>
            <li>Submit. You will get a receipt immediately and a notice of assessment in about two weeks.</li>
          </ol>

          <h2>What is different this year</h2>
          <p>
            Two things make 2026 returns unusual. First, this is the first full return under the{' '}
            <strong>HECS marginal repayment system</strong> — many employers over-withheld early in 2025–26 while
            tables caught up, and that excess comes back through this assessment (our{' '}
            <Link href="/hecs-repayment-calculator/">HECS calculator</Link> shows your correct repayment). Second, the
            one-off <strong>20% HELP debt reduction</strong> was applied to balances during the year — it does not
            change your refund, but check your loan balance in myGov reflects it.
          </p>
          <p>
            And remember the year trap: the return you lodge now uses <strong>2025–26 rates</strong> — the 16% bracket
            and the $67,000 HECS threshold. The 15% rate everyone is talking about applies to pay from 1 July 2026 and
            belongs to <em>next</em> year&apos;s return.
          </p>

          <h2>Self-lodge or tax agent?</h2>
          <p>
            Simple affairs — salary, bank interest, standard deductions — take under an hour in myTax, free. An agent
            earns their $80–200 fee when you have ABN or business income, investments or property, a first-year return
            you are unsure about, or a messy year (multiple jobs, mid-year arrival). The fee is deductible next year,
            and legitimate agents are registered — check them at tpb.gov.au.
          </p>

          <h2>Frequently asked questions</h2>
          {FAQ.map((f) => (
            <div className="faq-item" key={f.q}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}

          <p>
            Before you lodge, estimate the outcome with the{' '}
            <Link href="/tax-refund-calculator/">Tax Refund Calculator</Link> — income, deductions, HECS and the
            Medicare levy surcharge, at the correct 2025–26 rates.
          </p>

          <p className="disclaimer">
            General information only — not tax advice, and individual circumstances vary. Dates and processes are as
            published for tax time 2026; confirm current details at{' '}
            <a href="https://www.ato.gov.au" rel="noopener">ato.gov.au</a> or with a registered tax agent.
          </p>
        </article>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}
