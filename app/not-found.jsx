import Link from 'next/link';
import { SiteHeader, SiteFooter } from '../components/Site';

export default function NotFound() {
  return (
    <>
      <SiteHeader langHref="/vi/" langLabel="Tiếng Việt" />
      <main className="wrap">
        <section className="hero">
          <div className="fy-chip">404</div>
          <h1>Page not found · Không tìm thấy trang</h1>
          <p>
            The page may have moved, or the address has a typo. Trang có thể đã chuyển, hoặc địa chỉ gõ nhầm.
          </p>
        </section>
        <div className="tools-grid" style={{ marginTop: '1.5rem' }}>
          <Link href="/" className="tool-card">
            <span className="live">EN</span>
            <h3>All tools — English</h3>
            <p>Tax, pay and paperwork tools, updated for FY 2026–27.</p>
          </Link>
          <Link href="/vi/" className="tool-card">
            <span className="live">VI</span>
            <h3>Trang chủ tiếng Việt</h3>
            <p>Bộ công cụ thuế, lương và giấy tờ cho người Việt tại Úc.</p>
          </Link>
          <Link href="/income-tax-calculator/" className="tool-card">
            <span className="live">Popular</span>
            <h3>Income Tax Calculator</h3>
            <p>Take-home pay under the 2026–27 rates.</p>
          </Link>
          <Link href="/tax-refund-calculator/" className="tool-card">
            <span className="live">Tax time</span>
            <h3>Tax Refund Calculator</h3>
            <p>Estimate your 2025–26 return before you lodge.</p>
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
