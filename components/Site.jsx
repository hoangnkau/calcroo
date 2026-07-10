import Link from 'next/link';

export function RooLogo({ size = 26 }) {
  // Kangaroo mark — đơn giản, 1 màu, dùng làm logo + favicon
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <circle cx="16" cy="16" r="16" fill="#0e6b4f" />
      <path
        d="M9 23c2.5-.5 4.5-2 5.5-4.5S17 13 19.5 12c1.8-.7 3.5-.3 4.5.5-1.5.2-2.5 1-3 2.5 1.5-.5 2.8 0 3.5 1-1.3 0-2.3.6-2.8 1.8-.8 2-2.7 3.7-5.2 4.5-2.3.8-5 .9-7.5.7z"
        fill="#f7f8f4"
      />
      <circle cx="23.4" cy="10.6" r="1.6" fill="#e8a70e" />
    </svg>
  );
}

export function SiteHeader({ langHref, langLabel, homeHref = '/' }) {
  return (
    <header className="site-header">
      <div className="wrap">
        <Link href={homeHref} className="brand">
          <RooLogo />
          <strong>
            calc<em>roo</em>
          </strong>
        </Link>
        {langHref && (
          <Link href={langHref} className="lang-link">
            {langLabel}
          </Link>
        )}
      </div>
    </header>
  );
}

export function SiteFooter({ vi = false }) {
  const year = new Date().getFullYear();
  return (
    <footer className="site-footer">
      <div className="wrap">
        <span>© {year} Calcroo · calcroo.au</span>
        <nav>
          <Link href="/about/">{vi ? 'Giới thiệu' : 'About'}</Link>
          <Link href="/privacy/">{vi ? 'Quyền riêng tư' : 'Privacy'}</Link>
          <Link href="/terms/">{vi ? 'Điều khoản' : 'Terms'}</Link>
          <Link href="/contact/">{vi ? 'Liên hệ' : 'Contact'}</Link>
        </nav>
      </div>
    </footer>
  );
}
