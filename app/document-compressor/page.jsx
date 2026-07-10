import DocCompressor from '../../components/DocCompressor';
import { SiteHeader, SiteFooter } from '../../components/Site';
import Link from 'next/link';

export const metadata = {
  title: 'Document Compressor — Shrink Photos & Scans for Upload Limits, Free',
  description:
    'Compress document photos and scans to fit upload limits — 5MB for immi, 1–2MB for bank and government portals — free in your browser. Files are never uploaded to us.',
  alternates: {
    canonical: '/document-compressor/',
    languages: {
      en: '/document-compressor/',
      vi: '/vi/nen-anh-giay-to/',
    },
  },
};

const FAQ = [
  {
    q: 'Why is my phone photo of a document 8MB?',
    a: 'Modern phone cameras shoot at 12–48 megapixels with light compression — great for landscapes, absurd overkill for a payslip. A document only needs to be readable: around 1,500–2,400px on the long edge at moderate JPEG quality is crisp on any screen and usually lands between 200KB and 1MB.',
  },
  {
    q: 'Will compressing make my document unreadable?',
    a: 'Not at sensible targets. This tool reduces file size by combining smart resizing with JPEG quality tuning, and it refuses to shrink below the point where text typically stays legible — if your target is impossibly small for the content, it tells you and gives the smallest readable result instead.',
  },
  {
    q: 'What file size does ImmiAccount accept?',
    a: 'Attachment limits are commonly around 5MB per file, but they vary by form and change over time — check the limit shown in your actual application. The ≤5MB preset here exists for exactly that case; if your scan bundle is still too big, splitting pages or using our upcoming PDF tools helps.',
  },
  {
    q: 'Is my document uploaded to your server?',
    a: 'No. Compression happens entirely in your browser using the Canvas API — the file never leaves your device, which matters when the document is your passport, payslip or bank statement. Closing the tab discards everything.',
  },
  {
    q: 'My iPhone photo won’t load — why?',
    a: 'It is probably HEIC, Apple’s format that most non-Safari browsers cannot read. Fix it at the source: Settings → Camera → Formats → “Most Compatible” shoots JPEG, or share the photo to yourself in a chat app (which converts it) and save that copy.',
  },
  {
    q: 'Can I compress a PDF here?',
    a: 'Not yet — this tool handles images (JPG, PNG, WebP). A dedicated PDF merge & compress tool is next on our roadmap; for now, many portals accept a compressed JPG of each page just as happily.',
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
      <SiteHeader langHref="/vi/nen-anh-giay-to/" langLabel="Tiếng Việt" />
      <main className="wrap">
        <section className="hero">
          <div className="fy-chip">Client-side · files never leave your device</div>
          <h1>Document Compressor</h1>
          <p>
            Shrink photos and scans of documents to fit any upload limit — immi, Centrelink, banks, email — free in
            your browser, with your paperwork never touching our servers.
          </p>
        </section>

        <DocCompressor lang="en" />

        <article className="content">
          <h2>The upload-limit problem, solved properly</h2>
          <p>
            Every application portal has a file-size ceiling, every phone camera blows past it, and the usual
            &quot;fixes&quot; are bad: emailing the photo to yourself (quality roulette), screenshotting it (resolution
            loss), or uploading your passport scan to a random compression website (a privacy decision you shouldn&apos;t
            have to make). This tool does it correctly: pick the limit, and it finds the best combination of dimensions
            and JPEG quality that fits under it — <strong>locally, in your browser</strong>.
          </p>

          <h2>Pick the right target</h2>
          <ul>
            <li><strong>≤ 5MB:</strong> the common per-file ceiling for visa attachments in ImmiAccount-style portals.</li>
            <li><strong>≤ 1–2MB:</strong> typical for bank loan portals, myGov linked services and job application systems.</li>
            <li><strong>≤ 500KB:</strong> safe for email attachments in bulk and older government forms.</li>
            <li><strong>≤ 100–250KB:</strong> profile documents, web forms with strict limits.</li>
          </ul>
          <p>
            One habit worth keeping: compress a <em>copy</em> for uploading and keep your original full-quality photo
            archived — you can always compress again, but you can&apos;t un-compress.
          </p>

          <h2>Scan tips that beat any compressor</h2>
          <p>
            A good source photo compresses smaller <em>and</em> reads better: lay the document flat in even light (no
            flash glare), fill the frame, hold the phone parallel to the page, and use your phone&apos;s built-in
            document mode (iPhone Notes scanner or Google Drive scan) which flattens and sharpens text before you even
            get here.
          </p>

          <h2>Frequently asked questions</h2>
          {FAQ.map((f) => (
            <div className="faq-item" key={f.q}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}

          <p>
            Preparing a visa application? Get your photo right with the{' '}
            <Link href="/visa-photo-resizer/">Visa Photo Resizer</Link>, and the money side with our{' '}
            <Link href="/tax-refund-calculator/">Tax Refund Calculator</Link>.
          </p>

          <p className="disclaimer">
            Calcroo compresses files as a convenience — upload limits and document requirements are set by each portal
            and change over time; always follow the instructions in your actual application. Files are processed
            locally in your browser and are never uploaded to Calcroo.
          </p>
        </article>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}
