/* ============================================================
   CALCROO — TAX DATA FY 2026-27
   ⚠ ĐÂY LÀ FILE DUY NHẤT CHỨA SỐ LIỆU THUẾ.
   Mỗi năm tài chính (1/7) chỉ cần cập nhật file này.
   Nguồn đối chiếu: ato.gov.au — VERIFY TRƯỚC KHI PUBLISH.
   ============================================================ */

export const FY = '2026–27';

// Bậc thuế resident từ 1/7/2026 (bậc 16% giảm còn 15%)
export const BRACKETS = [
  { upTo: 18200, rate: 0.0 },
  { upTo: 45000, rate: 0.15 },
  { upTo: 135000, rate: 0.3 },
  { upTo: 190000, rate: 0.37 },
  { upTo: Infinity, rate: 0.45 },
];

// Low Income Tax Offset
export const LITO = { max: 700, t1: 37500, r1: 0.05, t2: 45000, r2: 0.015 };

// Medicare levy — ngưỡng thu nhập thấp (độc thân, chưa SAPTO) — VERIFY số 2026-27
export const MEDICARE = { rate: 0.02, lowThreshold: 27222, shadeRate: 0.1 };

// HECS-HELP 2026-27 — ✓ ĐÃ ĐỐI CHIẾU ATO (bảng "2026–27 repayment thresholds and rates")
// Nil đến $69.528 | 15c/$1 phần $69.529–$129.717 | $9.028 + 17c/$1 phần $129.718–$186.050
// Từ $186.051: 10% phẳng trên TOÀN BỘ repayment income
export const HECS = { threshold: 69528, mid: 129717, midBase: 9028, r1: 0.15, r2: 0.17, flatFrom: 186051, flatRate: 0.1 };

export function incomeTax(y) {
  let tax = 0;
  let prev = 0;
  for (const b of BRACKETS) {
    if (y > prev) tax += (Math.min(y, b.upTo) - prev) * b.rate;
    prev = b.upTo;
  }
  return tax;
}

export function lito(y) {
  if (y <= LITO.t1) return LITO.max;
  if (y <= LITO.t2) return Math.max(0, LITO.max - (y - LITO.t1) * LITO.r1);
  return Math.max(0, LITO.max - (LITO.t2 - LITO.t1) * LITO.r1 - (y - LITO.t2) * LITO.r2);
}

export function medicare(y) {
  if (y <= MEDICARE.lowThreshold) return 0;
  return Math.min(y * MEDICARE.rate, (y - MEDICARE.lowThreshold) * MEDICARE.shadeRate);
}

export function hecs(y) {
  if (y <= HECS.threshold) return 0;
  if (y >= HECS.flatFrom) return y * HECS.flatRate; // 10% phẳng trên toàn bộ repayment income
  if (y > HECS.mid) return HECS.midBase + (y - HECS.mid) * HECS.r2; // dùng $9.028 chốt sẵn của ATO
  return (y - HECS.threshold) * HECS.r1;
}

export function marginalRate(y) {
  let prev = 0;
  for (const b of BRACKETS) {
    if (y <= b.upTo) return b.rate;
    prev = b.upTo;
  }
  return 0.45;
}
