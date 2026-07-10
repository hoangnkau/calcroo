import { SiteHeader, SiteFooter } from '../../components/Site';

export const metadata = { title: 'Terms of Use', description: 'Calcroo terms of use.', alternates: { canonical: '/terms/', languages: { en: '/terms/', vi: '/vi/dieu-khoan/' } } };

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main className="wrap legal">
        <h1>Terms of Use</h1>
        <p>Last updated: July 2026</p>
        <h2>Estimates only — not advice</h2>
        <p>Calcroo provides calculators and content for general information purposes. Results are estimates based on the inputs you provide and published rates, and do not constitute financial, taxation or legal advice. They do not take into account your objectives, financial situation or needs. Before acting, confirm figures with the Australian Taxation Office (ato.gov.au) or consult a registered tax agent or licensed financial adviser.</p>
        <h2>Paperwork tools</h2>
        <p>Our photo, document and PDF utilities format files to common Australian specifications as a convenience. Requirements change and vary by application type — always confirm current specifications with the relevant authority (such as the Department of Home Affairs for visa and passport photos) before submitting. We do not guarantee that any file produced will be accepted by a third party.</p>
        <h2>Accuracy</h2>
        <p>We take care to keep rates and thresholds current for each financial year, but we do not guarantee that all information is complete, accurate or up to date at all times. Tax law changes and individual circumstances vary.</p>
        <h2>Liability</h2>
        <p>To the maximum extent permitted by law, Calcroo excludes liability for any loss arising from reliance on information or results provided on this site.</p>
        <h2>Acceptable use</h2>
        <p>You may use our tools freely for personal and professional purposes. You may not scrape, republish or resell our content or embed our tools without permission.</p>
      </main>
      <SiteFooter />
    </>
  );
}
