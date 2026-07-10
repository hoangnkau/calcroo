import './globals.css';
import { GA_ID } from '../lib/site';

export const metadata = {
  metadataBase: new URL('https://calcroo.au'),
  title: {
    default: 'Calcroo — Australian Tax & Pay Calculators',
    template: '%s | Calcroo',
  },
  description:
    'Free Australian tax and pay calculators, updated for FY 2026–27. Income tax, HECS-HELP, Medicare levy and take-home pay — fast, private, no sign-up.',
  openGraph: {
    siteName: 'Calcroo',
    type: 'website',
    images: [{ url: '/og.png', width: 1200, height: 630, alt: 'Calcroo — Australian tax & pay calculators, updated for 2026–27' }],
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:wght@500;600;700&family=IBM+Plex+Sans:ital,wght@0,400;0,500;0,600;1,400&family=IBM+Plex+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
        {GA_ID && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`,
              }}
            />
          </>
        )}
      </head>
      <body>{children}</body>
    </html>
  );
}
