import { SiteHeader, SiteFooter } from '../../components/Site';

export const metadata = { title: 'About', description: 'About Calcroo — free Australian tax and pay calculators.', alternates: { canonical: '/about/', languages: { en: '/about/', vi: '/vi/gioi-thieu/' } } };

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main className="wrap legal">
        <h1>About Calcroo</h1>
        <p>Calcroo builds free tools for the money and paperwork questions Australians actually face: tax and pay calculators updated for each financial year from day one, and paperwork utilities — visa photos, document compression, PDFs — for the applications that go with them.</p>
        <h2>How we work</h2>
        <ul>
          <li><strong>Client-side by design:</strong> every calculation runs in your browser, and so do our paperwork tools — the photos and documents you process never leave your device. We don&apos;t have servers that store them.</li>
          <li><strong>Sources you can check:</strong> our rates and thresholds are based on figures published by the Australian Taxation Office (ato.gov.au) and are reviewed against official sources before each financial year.</li>
          <li><strong>Plain answers:</strong> we show the full breakdown — tax, Medicare levy, HECS-HELP — not a single mystery number.</li>
        </ul>
        <h2>What we are not</h2>
        <p>Calcroo is an information tool, not a financial adviser, tax agent or credit provider. Our results are estimates for general information only. For advice on your personal situation, speak to a registered tax agent or licensed adviser.</p>
        <p>Questions or corrections? Visit our <a href="/contact/">contact page</a>.</p>
      </main>
      <SiteFooter />
    </>
  );
}
