import PdfMerger from '../../components/PdfMerger';
import { SiteHeader, SiteFooter } from '../../components/Site';
import Link from 'next/link';

export const metadata = {
  title: 'PDF Merger — Combine PDFs & Photos Into One File, Free & Private',
  description:
    'Merge PDFs and photos of documents into a single PDF for loan, visa and rental applications — free, in your browser. Reorder pages, convert images to A4 pages, nothing uploaded.',
  alternates: {
    canonical: '/pdf-merger/',
    languages: {
      en: '/pdf-merger/',
      vi: '/vi/gop-pdf/',
    },
  },
};

const FAQ = [
  {
    q: 'How do I combine my payslips into one PDF?',
    a: 'Add each payslip above — PDFs straight from your payroll portal, or photos of paper ones — arrange them newest-first (or however the lender asked), and press Merge. Photos are placed on clean A4 pages automatically. Banks and brokers typically want your last 2–3 payslips as a single attachment, which is exactly what this produces.',
  },
  {
    q: 'Are my documents uploaded to your server?',
    a: 'No. Merging runs entirely in your browser using the pdf-lib library — your payslips, statements and IDs never leave your device. That is the whole point: these are the most sensitive documents you own, and they should not pass through a stranger’s server just to be stapled together.',
  },
  {
    q: 'Can I mix PDFs and photos in one merge?',
    a: 'Yes — that is the main use case. Bank statements download as PDFs while the odd paper document gets photographed; add both, order them with the arrows, and each photo becomes a centred A4 page in the final file. Choose Medium quality for a good size/sharpness balance.',
  },
  {
    q: 'Why does it say a file is password-protected?',
    a: 'Some bank statements are encrypted with your date of birth or account number. Browsers cannot merge encrypted PDFs without the password. Fix: open the PDF, enter its password, then use Print → “Save as PDF” to create an unlocked copy, and merge that.',
  },
  {
    q: 'Is there a file size or page limit?',
    a: 'Only your device’s memory — dozens of pages and files up to a few hundred MB total are fine on a modern phone or laptop. If your merged file ends up too big for a portal, compress the photo pages first with our Document Compressor, or choose the Compact quality setting.',
  },
  {
    q: 'Can this compress an existing scanned PDF?',
    a: 'Not yet — shrinking a scanned PDF properly means re-rendering its pages, which is a heavier tool we may add later. For now the effective workaround is upstream: compress images with our Document Compressor before merging, and use the Compact quality setting here.',
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
      <SiteHeader langHref="/vi/gop-pdf/" langLabel="Tiếng Việt" />
      <main className="wrap">
        <section className="hero">
          <div className="fy-chip">Client-side · files never leave your device</div>
          <h1>PDF Merger</h1>
          <p>
            Combine PDFs and photos of documents into one clean file for loan, visa and rental applications — free, in
            your browser, with your paperwork never touching a server.
          </p>
        </section>

        <PdfMerger lang="en" />

        <article className="content">
          <h2>One application, one file</h2>
          <p>
            Every serious application — home loan, visa, rental — ends with the same instruction: <em>attach your
            documents as a single PDF</em>. What you actually have is a folder of bank-statement PDFs, payslip
            downloads and phone photos of paper documents. This tool staples them together properly: PDFs keep their
            original quality page-for-page, photos are placed on centred A4 pages, and the arrows let you put
            everything in the order the assessor asked for.
          </p>

          <h2>The privacy part actually matters here</h2>
          <p>
            Think about what is in a merge like this: payslips with your salary, statements with your spending, your
            passport. The popular merge sites process files on their servers — you are trusting a company you have
            never heard of with your complete financial identity to save a stapling step. Calcroo merges with{' '}
            <strong>pdf-lib running locally in your browser</strong>: disconnect from the internet after the page loads
            and it still works, because nothing is sent anywhere.
          </p>

          <h2>Order matters to assessors</h2>
          <ul>
            <li><strong>Home loan:</strong> payslips newest-first, then bank statements by account, then ID — or exactly the order in your broker’s checklist.</li>
            <li><strong>Visa:</strong> follow the document checklist order in your ImmiAccount application; assessors work through it top to bottom.</li>
            <li><strong>Rental:</strong> cover note, ID, proof of income, references — make the property manager’s skim effortless.</li>
          </ul>

          <h2>Frequently asked questions</h2>
          {FAQ.map((f) => (
            <div className="faq-item" key={f.q}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}

          <p>
            Round out the application kit: size your photo with the{' '}
            <Link href="/visa-photo-resizer/">Visa Photo Resizer</Link>, shrink heavy scans with the{' '}
            <Link href="/document-compressor/">Document Compressor</Link>, and check the money side with the{' '}
            <Link href="/income-tax-calculator/">Income Tax Calculator</Link>.
          </p>

          <p className="disclaimer">
            Calcroo merges files as a convenience — always follow the attachment format, order and size instructions in
            your actual application. Files are processed locally in your browser and are never uploaded to Calcroo.
          </p>
        </article>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}
