import './globals.css';

export const metadata = {
  metadataBase: new URL('https://calcroo.au'),
  title: {
    default: 'Calcroo — Australian Tax & Pay Calculators',
    template: '%s | Calcroo',
  },
  description:
    'Free Australian tax and pay calculators, updated for FY 2026–27. Income tax, HECS-HELP, Medicare levy and take-home pay — fast, private, no sign-up.',
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
      </head>
      <body>{children}</body>
    </html>
  );
}
