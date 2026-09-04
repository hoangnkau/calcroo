import Dashboard from '../../components/Dashboard';

export const metadata = {
  title: 'Your Dashboard — Saved Pay & Tax Calculations',
  description:
    'Your saved Calcroo pay, tax and HECS setups — stored privately in your browser, no account needed. Rename, quick-edit or remove them any time.',
  robots: { index: false, follow: false },
  alternates: { canonical: '/dashboard/' },
};

export default function Page() {
  return <Dashboard />;
}
