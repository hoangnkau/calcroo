import { SiteHeader, SiteFooter } from '../../components/Site';

export const metadata = { title: 'Contact', description: 'Contact Calcroo.', alternates: { canonical: '/contact/', languages: { en: '/contact/', vi: '/vi/lien-he/' } } };

export default function Page() {
  return (
    <>
      <SiteHeader />
      <main className="wrap legal">
        <h1>Contact</h1>
        <p>Found a number that looks off, or a calculator you wish existed? We genuinely want to hear it — accuracy reports are answered first.</p>
        <p>Email: <a href="mailto:hello@calcroo.au">hello@calcroo.au</a></p>
        <p>We aim to reply within a few business days. For urgent tax questions, contact the ATO on 13 28 61 or a registered tax agent.</p>
      </main>
      <SiteFooter />
    </>
  );
}
