import PdfSplitter from '../../components/PdfSplitter';
import { SiteHeader, SiteFooter } from '../../components/Site';
import Link from 'next/link';

export const metadata = {
  title: 'PDF Splitter — Extract or Remove Pages Online, Free & Private',
  description:
    'Split a PDF in your browser: keep only the pages you need or remove the ones you don’t — bank statements, scans, contracts. Free, no upload, files never leave your device.',
  alternates: {
    canonical: '/pdf-splitter/',
    languages: { en: '/pdf-splitter/', vi: '/vi/tach-pdf/' },
  },
};

const FAQ = [
  {
    q: 'How do I extract just a few pages from a PDF?',
    a: 'Choose the PDF, pick “Keep only these pages”, and type the pages — “1-3, 7” keeps pages 1, 2, 3 and 7 in that order. Press Split and download the new file. The original PDF is untouched.',
  },
  {
    q: 'Can I delete pages from a PDF instead?',
    a: 'Yes — switch the mode to “Remove these pages”. Everything except the pages you list is kept, in original order. Handy for dropping blank scan pages or the marketing page banks append to statements.',
  },
  {
    q: 'Is my PDF uploaded to a server?',
    a: 'No. Splitting runs entirely in your browser with the pdf-lib library — statements, contracts and IDs never leave your device. Load the page, disconnect from the internet, and it still works.',
  },
  {
    q: 'Why won’t my bank statement split?',
    a: 'It is probably password-protected — many banks encrypt statements with your date of birth or account number. Browsers can’t edit encrypted PDFs. Open it with the password, use Print → “Save as PDF” to make an unlocked copy, then split that.',
  },
  {
    q: 'Does splitting reduce quality?',
    a: 'No — pages are copied as-is, not re-rendered. Text stays selectable and images keep their original resolution. The output is often smaller simply because it contains fewer pages.',
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
      <SiteHeader langHref="/vi/tach-pdf/" langLabel="Tiếng Việt" />
      <main className="wrap">
        <section className="hero">
          <div className="fy-chip">Client-side · files never leave your device</div>
          <h1>PDF Splitter</h1>
          <p>
            Keep only the pages you need — or drop the ones you don&apos;t — free in your browser. The natural partner
            to our PDF Merger.
          </p>
        </section>

        <PdfSplitter lang="en" />

        <article className="content">
          <h2>Why you keep needing this</h2>
          <p>
            Portals ask for <em>specific</em> pages: the last three months of a 12-month statement, the signature page
            of a contract, two payslips out of a year&apos;s scan bundle. Sending the whole file means slower uploads,
            blown size limits, and sharing far more of your financial life than the request needed. Splitting first is
            both the polite and the private option — and doing it <strong>locally in your browser</strong> means your
            statements never sit on a stranger&apos;s server.
          </p>
          <h2>Split, then merge — the full workflow</h2>
          <p>
            The application-paperwork loop usually runs: split the pages you need from big files here, compress any
            heavy photo scans with the <Link href="/document-compressor/">Document Compressor</Link>, then staple
            everything into one clean attachment with the <Link href="/pdf-merger/">PDF Merger</Link> in the order the
            assessor asked for. Three tools, zero uploads.
          </p>
          <h2>Frequently asked questions</h2>
          {FAQ.map((f) => (
            <div className="faq-item" key={f.q}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}
          <p className="disclaimer">
            Calcroo splits files as a convenience — follow the format and size instructions in your actual application.
            Files are processed locally in your browser and are never uploaded to Calcroo.
          </p>
        </article>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}
