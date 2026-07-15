import CvBuilder from '../../components/CvBuilder';
import { SiteHeader, SiteFooter } from '../../components/Site';
import Link from 'next/link';

export const metadata = {
  title: 'Australian CV Builder — Free, ATS-Friendly Resume in the Australian Format',
  description:
    'Build an Australian-format resume free in your browser: no photo, no date of birth, ATS-friendly single column, real-text PDF export. Autosaves locally — nothing is uploaded.',
  alternates: {
    canonical: '/cv-builder/',
    languages: {
      en: '/cv-builder/',
      vi: '/vi/tao-cv-uc/',
    },
  },
};

const FAQ = [
  {
    q: 'Why no photo or date of birth on an Australian resume?',
    a: 'Australian hiring norms — shaped by anti-discrimination law — expect resumes without a photo, date of birth, marital status or nationality. Including them marks a resume as non-local and puts recruiters in an awkward position. Suburb and state are enough for location; a full street address is unnecessary too.',
  },
  {
    q: 'How long should an Australian CV be?',
    a: 'Two pages is the sweet spot for most people; up to three is accepted for long careers. One page suits students and first jobs. Cut the oldest, least relevant roles first — recruiters spend well under a minute on the first pass.',
  },
  {
    q: 'What does ATS-friendly actually mean?',
    a: 'Applicant Tracking Systems parse your resume into a database before a human sees it. They read real text in a single column with standard headings — and choke on two-column layouts, text boxes, graphics and resumes exported as images. This builder uses a single column, standard headings and prints to a real-text PDF, which is exactly what parses cleanly.',
  },
  {
    q: 'Is my CV data uploaded anywhere?',
    a: 'No. Everything you type is autosaved to your own browser (localStorage) so you can come back and keep editing on the same device — but it never leaves that device. Clear it any time with the button in the tool.',
  },
  {
    q: 'How do I get the PDF?',
    a: 'Press Download PDF and choose “Save as PDF” in your browser’s print dialog. The output is genuine selectable text — not a screenshot — sized to A4 with proper margins. Name the file professionally: Firstname-Lastname-Resume.pdf.',
  },
  {
    q: 'Should I write “references available on request”?',
    a: 'It remains the Australian standard and is the default here. List actual referees only when the job ad asks, or late in a process — and always warn your referees first. Two is typical: a recent manager and one other professional contact.',
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
      <SiteHeader langHref="/vi/tao-cv-uc/" langLabel="Tiếng Việt" />
      <main className="wrap">
        <section className="hero no-print">
          <div className="fy-chip">Free · ATS-friendly · Australian format</div>
          <h1>Australian CV Builder</h1>
          <p>
            Build a clean, ATS-friendly resume in the Australian format — no photo, no date of birth, real-text PDF.
            Autosaves in your browser; nothing is ever uploaded.
          </p>
        </section>

        <CvBuilder lang="en" />

        <article className="content no-print">
          <h2>What makes a resume “Australian format”?</h2>
          <p>
            If you learned CV-writing elsewhere, unlearn three habits. <strong>No photo, no date of birth, no personal
            details</strong> like marital status — Australian anti-discrimination norms keep them off the page, and
            including them instantly reads as a non-local application. <strong>Achievements over duties</strong>: each
            bullet should start with an action verb and show a result (&quot;Processed 60+ customer orders per shift
            with zero stock discrepancies&quot; beats &quot;responsible for orders&quot;). And{' '}
            <strong>referees stay off the page</strong> — &quot;available on request&quot; is the standard.
          </p>

          <h2>Beating the robot before the human</h2>
          <p>
            Most medium-to-large employers run resumes through an ATS first. The systems reward exactly what this
            builder produces: a single column, standard section headings, real text (never an image export), and plain
            bullet points. They also reward <strong>keywords from the job ad</strong> — mirror the ad&apos;s exact
            terms for skills and systems in your bullets and skills line. The builder above has a "Match a job ad"
            panel: paste the ad, and it checks which key terms already appear in your CV so you know exactly what to
            add. Tailoring the summary and top bullets per application takes five minutes and multiplies callbacks.
          </p>

          <h2>Bullet formula that works</h2>
          <p>
            <em>Action verb + what you did + measurable result.</em> Managed, built, reduced, trained, resolved,
            increased. Numbers make claims believable: team sizes, order volumes, percentages, dollar figures. Even
            casual and hospitality work has numbers — covers per service, registers balanced, staff trained.
          </p>

          <h2>Frequently asked questions</h2>
          {FAQ.map((f) => (
            <div className="faq-item" key={f.q}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}

          <p>
            Landed the job? Work out your real take-home with the{' '}
            <Link href="/pay-calculator/">Pay Calculator</Link>, or compare a casual offer with the{' '}
            <Link href="/casual-pay-calculator/">Casual Pay Calculator</Link>.
          </p>

          <p className="disclaimer">
            General guidance on common Australian resume conventions — expectations vary by industry and employer, so
            follow any specific application instructions. Your CV data is stored only in your own browser and is never
            transmitted to Calcroo.
          </p>
        </article>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}
