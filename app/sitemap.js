export const dynamic = 'force-static';

export default function sitemap() {
  const base = 'https://calcroo.au';
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, priority: 1 },
    { url: `${base}/vi/`, lastModified: now, priority: 0.9 },
    { url: `${base}/income-tax-calculator/`, lastModified: now, priority: 0.9 },
    { url: `${base}/tax-refund-calculator/`, lastModified: now, priority: 0.9 },
    { url: `${base}/vi/tinh-hoan-thue-uc/`, lastModified: now, priority: 0.8 },
    { url: `${base}/pay-calculator/`, lastModified: now, priority: 0.9 },
    { url: `${base}/hecs-repayment-calculator/`, lastModified: now, priority: 0.9 },
    { url: `${base}/casual-pay-calculator/`, lastModified: now, priority: 0.9 },
    { url: `${base}/salary-sacrifice-calculator/`, lastModified: now, priority: 0.9 },
    { url: `${base}/visa-photo-resizer/`, lastModified: now, priority: 0.9 },
    { url: `${base}/document-compressor/`, lastModified: now, priority: 0.9 },
    { url: `${base}/pdf-merger/`, lastModified: now, priority: 0.9 },
    { url: `${base}/cv-builder/`, lastModified: now, priority: 0.9 },
    { url: `${base}/vi/tao-cv-uc/`, lastModified: now, priority: 0.8 },
    { url: `${base}/guides/tax-return-2026-australia/`, lastModified: now, priority: 0.8 },
    { url: `${base}/vi/huong-dan/khai-thue-uc-2026/`, lastModified: now, priority: 0.7 },
    { url: `${base}/vi/gop-pdf/`, lastModified: now, priority: 0.8 },
    { url: `${base}/vi/nen-anh-giay-to/`, lastModified: now, priority: 0.8 },
    { url: `${base}/vi/chinh-anh-visa-uc/`, lastModified: now, priority: 0.8 },
    { url: `${base}/vi/tinh-salary-sacrifice/`, lastModified: now, priority: 0.8 },
    { url: `${base}/vi/tinh-luong-casual/`, lastModified: now, priority: 0.8 },
    { url: `${base}/vi/tinh-tra-no-hecs/`, lastModified: now, priority: 0.8 },
    { url: `${base}/vi/tinh-luong-uc/`, lastModified: now, priority: 0.8 },
    { url: `${base}/vi/tinh-thue-thu-nhap-uc/`, lastModified: now, priority: 0.8 },
    { url: `${base}/about/`, lastModified: now, priority: 0.3 },
    { url: `${base}/vi/gioi-thieu/`, lastModified: now, priority: 0.3 },
    { url: `${base}/vi/bao-mat/`, lastModified: now, priority: 0.3 },
    { url: `${base}/vi/dieu-khoan/`, lastModified: now, priority: 0.3 },
    { url: `${base}/vi/lien-he/`, lastModified: now, priority: 0.3 },
    { url: `${base}/privacy/`, lastModified: now, priority: 0.3 },
    { url: `${base}/terms/`, lastModified: now, priority: 0.3 },
    { url: `${base}/contact/`, lastModified: now, priority: 0.3 },
  ];
}
