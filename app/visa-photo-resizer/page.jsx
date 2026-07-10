import PhotoResizer from '../../components/PhotoResizer';
import { SiteHeader, SiteFooter } from '../../components/Site';
import Link from 'next/link';

export const metadata = {
  title: 'Australian Visa & Passport Photo Resizer — 35×45mm Online, Free',
  description:
    'Crop and resize any photo to the Australian passport and visa standard (35×45mm, 413×531px) free in your browser. Nothing is uploaded. Download a single photo or a printable 6×4″ sheet of four.',
  alternates: {
    canonical: '/visa-photo-resizer/',
    languages: {
      en: '/visa-photo-resizer/',
      vi: '/vi/chinh-anh-visa-uc/',
    },
  },
};

const FAQ = [
  {
    q: 'What size is an Australian passport or visa photo?',
    a: '35mm wide × 45mm high, with the face (chin to crown) taking up 32–36mm of the height. For digital uploads that equals 413×531 pixels at 300 DPI — exactly what this tool exports. Always check the current requirements for your specific application on the Department of Home Affairs or Australian Passport Office websites.',
  },
  {
    q: 'Can I take an Australian visa photo at home with my phone?',
    a: 'Yes, and it is widely accepted if you meet the rules: recent (under 6 months old), plain light-coloured background, even lighting with no shadows, neutral expression with mouth closed, eyes open and visible, no glasses glare (or no glasses), head uncovered unless for religious reasons. Have someone else take it from about 1.5m away — selfies distort facial proportions.',
  },
  {
    q: 'Is my photo uploaded to your server?',
    a: 'No. The photo is processed entirely inside your browser using the Canvas API — it never leaves your device, we never see it, and closing the tab discards it. That is also why the tool works offline once the page has loaded.',
  },
  {
    q: 'How do I print the photos cheaply?',
    a: 'Download the 6×4″ print sheet (it contains four correctly-sized photos with cut guides) and print it as a standard 6×4 photo at Kmart, Big W, Officeworks or any photo kiosk — usually under $1, versus $17–25 for a photo-shop passport photo service. Cut along the grey guides with scissors or a guillotine.',
  },
  {
    q: 'What photo size does ImmiAccount accept for online visa applications?',
    a: 'Online lodgment usually accepts a good-quality JPEG of your compliant photo; keep it under the stated file-size limit (commonly around 5MB) and make sure the image is sharp and uncropped from the 35×45 frame. The 413×531px export from this tool is well within limits — if your portal rejects large scans, our upcoming document compressor will help.',
  },
  {
    q: 'Why was my photo rejected even though the size was right?',
    a: 'Size is only one rule. The most common rejection reasons are shadows on the face or background, hair covering the eyes or face outline, smiling or open mouth, glare on glasses, low resolution or over-compression, and photos older than 6 months. Fix the shot, not just the crop.',
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
      <SiteHeader langHref="/vi/chinh-anh-visa-uc/" langLabel="Tiếng Việt" />
      <main className="wrap">
        <section className="hero">
          <div className="fy-chip">35×45mm · Australian standard</div>
          <h1>Australian Visa &amp; Passport Photo Resizer</h1>
          <p>
            Crop any photo to the official Australian 35×45mm standard, free in your browser. Download a digital copy
            for online applications, or a 6×4″ sheet of four to print for under a dollar.
          </p>
        </section>

        <PhotoResizer lang="en" />

        <article className="content">
          <h2>The Australian photo standard, in plain words</h2>
          <p>
            Australian passport and visa photos must be <strong>35mm × 45mm</strong>, in colour, taken within the last
            6 months, against a <strong>plain light-coloured background</strong>. Your face must be centred and sharp,
            taking up <strong>32–36mm from chin to crown</strong>, with a neutral expression, mouth closed and eyes
            open. Head coverings are only allowed for religious reasons, and glasses are best avoided entirely — glare
            is a leading rejection cause. This tool locks the 35:45 frame for you; your job is to position the face and
            get the shot itself right.
          </p>

          <h2>How to take a compliant photo at home</h2>
          <ul>
            <li><strong>Background:</strong> stand ~0.5m in front of a plain white or light-grey wall to avoid shadows behind you.</li>
            <li><strong>Light:</strong> face a window or two even light sources — no side shadows across the face.</li>
            <li><strong>Camera:</strong> have someone shoot from ~1.5m at eye level. Selfie-distance shots distort your nose and forehead.</li>
            <li><strong>Pose:</strong> shoulders square, neutral expression, hair off the face. Then upload here, drag and zoom until the head fills the guide proportions, and download.</li>
          </ul>

          <h2>Print for cents, not twenty dollars</h2>
          <p>
            The <strong>6×4″ print sheet</strong> is the money-saver: it packs four correctly-sized photos with cut
            guides into one standard photo print. Kmart, Big W and Officeworks kiosks print 6×4 photos for well under a
            dollar — a 95% saving on the typical $17–25 photo-shop passport service, and you get spares for future
            applications.
          </p>

          <h2>Frequently asked questions</h2>
          {FAQ.map((f) => (
            <div className="faq-item" key={f.q}>
              <h3>{f.q}</h3>
              <p>{f.a}</p>
            </div>
          ))}

          <p>
            Sorting the rest of your application? Our <Link href="/tax-refund-calculator/">Tax Refund Calculator</Link>{' '}
            covers the money side, and PDF tools for merging your documents are coming next.
          </p>

          <p className="disclaimer">
            Calcroo formats photos to the commonly published Australian 35×45mm specification as a convenience — it is
            not affiliated with the Department of Home Affairs, and photo requirements vary by application and change
            over time. Always confirm current rules at{' '}
            <a href="https://immi.homeaffairs.gov.au" rel="noopener">immi.homeaffairs.gov.au</a> or the Australian
            Passport Office before submitting. Photos are processed locally in your browser and are never uploaded.
          </p>
        </article>
      </main>
      <SiteFooter />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
    </>
  );
}
