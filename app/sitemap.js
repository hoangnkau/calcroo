export const dynamic = 'force-static';

export default function sitemap() {
  const base = 'https://calcroo.au';
  const now = new Date();
  return [
    { url: `${base}/`, lastModified: now, priority: 1 },
    { url: `${base}/vi/`, lastModified: now, priority: 0.9 },
    { url: `${base}/income-tax-calculator/`, lastModified: now, priority: 0.9 },
    { url: `${base}/pay-calculator/`, lastModified: now, priority: 0.9 },
    { url: `${base}/hecs-repayment-calculator/`, lastModified: now, priority: 0.9 },
    { url: `${base}/casual-pay-calculator/`, lastModified: now, priority: 0.9 },
    { url: `${base}/salary-sacrifice-calculator/`, lastModified: now, priority: 0.9 },
    { url: `${base}/vi/tinh-salary-sacrifice/`, lastModified: now, priority: 0.8 },
    { url: `${base}/vi/tinh-luong-casual/`, lastModified: now, priority: 0.8 },
    { url: `${base}/vi/tinh-tra-no-hecs/`, lastModified: now, priority: 0.8 },
    { url: `${base}/vi/tinh-luong-uc/`, lastModified: now, priority: 0.8 },
    { url: `${base}/vi/tinh-thue-thu-nhap-uc/`, lastModified: now, priority: 0.8 },
    { url: `${base}/about/`, lastModified: now, priority: 0.3 },
    { url: `${base}/privacy/`, lastModified: now, priority: 0.3 },
    { url: `${base}/terms/`, lastModified: now, priority: 0.3 },
    { url: `${base}/contact/`, lastModified: now, priority: 0.3 },
  ];
}
