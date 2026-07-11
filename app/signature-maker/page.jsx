import SignatureMaker from '../../components/SignatureMaker';
import { SiteHeader, SiteFooter } from '../../components/Site';
import Link from 'next/link';

export const metadata = {
  title: 'Signature Maker — Draw & Download a Transparent PNG Signature, Free',
  description:
    'Draw your signature with a finger or mouse and download it as a transparent PNG to drop into rental agreements, forms and PDFs. Free, in your browser — never uploaded.',
  alternates: {
    canonical: '/signature-maker/',
    languages: { en: '/signature-maker/', vi: '/vi/tao-chu-ky/' },
  },
};

const FAQ = [
  {
    q: 'How do I put this signature into a PDF or Word document?',
    a: 'Download the PNG, then: in Word or Google Docs use Insert → Image and drag it onto the signature line; in PDF apps (Adobe Reader, macOS Preview, most phone PDF editors) use the add-image or fill-and-sign option and select the file. The transparent background means no white box over the document.',
  },
  {
    q: 'Is a drawn signature image legally valid in Australia?',
    a: 'For most everyday documents — rental agreements, employment forms, consent forms — electronic signatures including an image are generally accepted under the Electronic Transactions Act, if the parties agree. Some documents still demand wet-ink or witnessed signatures (certain statutory declarations, wills, some land dealings). When it matters, check the specific requirement first.',
  },
  {
    q: 'Is my signature uploaded or stored anywhere?',
    a: 'No. Drawing happens on a canvas in your browser, the PNG is generated on your device, and closing the tab discards everything. Given a signature is exactly the thing you don’t want floating around the internet, that is the whole point.',
  },
  {
    q: 'Why draw on my phone instead of my computer?',
    a: 'Fingers on a touchscreen produce far more natural signatures than a mouse. Open this page on your phone, sign with your finger, download — the PNG lands in your phone, ready to insert or send to yourself.',
  },
  {
    q: 'Which pen colour should I use?',
    a: 'Black is the safe default and scans cleanly. Blue is popular because it makes the signature visibly “added” rather than photocopied — some people prefer that on contracts. Both are provided.',
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
      <SiteHeader langHref="/vi/tao-chu-ky/" langLabel="Tiếng Việt" />
      <main className="wrap">
        <section className="hero">
          <div className="fy-chip">Client-side · never uploaded</div>
          <h1>Signature Maker</h1>
          <p>
            Draw your signature, download a transparent PNG, drop it onto any form or agreement — free, in your
            browser, and your signature never leaves your device.
          </p>
        </section>

        <SignatureMaker lang="en" />

        <article className="content">
          <h2>The last step of every application</h2>
          <p>
            Rental agreement at 9pm, employment form due tomorrow, a consent form for school — all needing a signature
            while the printer is out of ink or doesn&apos;t exist. The print-sign-scan ritual is dead: draw once here
            (a phone finger works best), keep the PNG, and sign documents in seconds for years. Because the background
            is transparent, it sits on any page like ink, not like a pasted white sticker.
          </p>
          <h2>Complete the paperwork kit</h2>
          <p>
            Signature sorted, the rest of the pile is covered too: pull the right pages with the{' '}
            <Link href="/pdf-splitter/">PDF Splitter</Link>, shrink scans with the{' '}
            <Link href="/document-compressor/">Document Compressor</Link>, and staple everything into one attachment
            with the <Link href="/pdf-merger/">PDF Merger</Link>.
          </p>
          <h2>Frequently asked questions</h2>
          {FAQ.map((f) => (
            <div className="faq-item" key={f.q}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}
          <p className="disclaimer">
            General information only — whether an electronic signature is acceptable depends on the document and the
            parties; some documents legally require wet-ink or witnessed signatures. When in doubt, confirm with the
            requesting organisation. Signatures are generated locally and never uploaded to Calcroo.
          </p>
        </article>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}
