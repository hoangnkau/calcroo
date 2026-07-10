import { SiteHeader, SiteFooter } from '../../components/Site';

export const metadata = { title: 'Privacy Policy', description: 'Calcroo privacy policy.', alternates: { canonical: '/privacy/' } };

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main className="wrap legal">
        <h1>Privacy Policy</h1>
        <p>Last updated: July 2026</p>
        <h2>The numbers you enter</h2>
        <p>All Calcroo calculators run entirely in your browser (client-side). The income and financial figures you type are processed on your device and are not transmitted to, or stored on, our servers.</p>
        <h2>Photos and documents</h2>
        <p>Our paperwork tools (photo resizing, document compression, PDF utilities) also run entirely in your browser. Files you select are read and processed locally on your device using browser APIs, and are never uploaded to, transmitted to, or stored on our servers. Closing the page discards them.</p>
        <h2>Analytics</h2>
        <p>We use privacy-respecting analytics to understand aggregate site usage (pages visited, approximate location by country/state, device type). This data does not include the figures you enter into calculators and is not used to identify you personally.</p>
        <h2>Advertising</h2>
        <p>Calcroo may display advertising (such as Google AdSense) to keep our tools free. Ad providers may use cookies to serve relevant ads; you can manage ad personalisation through your Google settings or opt out of personalised advertising at adssettings.google.com.</p>
        <h2>Cookies</h2>
        <p>We use only the cookies necessary for site functionality, analytics and (if shown) advertising. We do not sell personal information.</p>
        <h2>Contact</h2>
        <p>For privacy questions, reach us via the <a href="/contact/">contact page</a>.</p>
      </main>
      <SiteFooter />
    </>
  );
}
