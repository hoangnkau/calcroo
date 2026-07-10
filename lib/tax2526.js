/* ============================================================
   CALCROO — TAX DATA FY 2025-26 (dùng cho TAX RETURN đang khai 7/2026)
   Người khai thuế tháng 7-10/2026 khai cho năm KẾT THÚC 30/6/2026,
   nên phải dùng biểu 2025-26 (bậc 16%), KHÔNG dùng 2026-27.
   HECS 2025-26: ✓ đối chiếu bảng ATO "Table 2: 2025–26" user cung cấp.
   Medicare threshold 2025-26: $27.222 — VERIFY với ATO khi có dịp.
   ============================================================ */

export const FY_RETURN = '2025–26';

const BRACKETS = [
  { upTo: 18200, rate: 0.0 },
  { upTo: 45000, rate: 0.16 }, // 2025-26 vẫn là 16% (giảm còn 15% từ 1/7/2026)
  { upTo: 135000, rate: 0.3 },
  { upTo: 190000, rate: 0.37 },
  { upTo: Infinity, rate: 0.45 },
];

const LITO = { max: 700, t1: 37500, r1: 0.05, t2: 45000, r2: 0.015 };
const MEDICARE = { rate: 0.02, lowThreshold: 27222, shadeRate: 0.1 };
// ATO Table 2 (2025–26): nil ≤67.000 | 15c 67.001–125.000 | 8.700 + 17c 125.001–179.285 | 10% toàn bộ từ 179.286
const HECS = { threshold: 67000, mid: 125000, midBase: 8700, r1: 0.15, r2: 0.17, flatFrom: 179286, flatRate: 0.1 };

export function incomeTax2526(y) {
  let tax = 0;
  let prev = 0;
  for (const b of BRACKETS) {
    if (y > prev) tax += (Math.min(y, b.upTo) - prev) * b.rate;
    prev = b.upTo;
  }
  return tax;
}

export function lito2526(y) {
  if (y <= LITO.t1) return LITO.max;
  if (y <= LITO.t2) return Math.max(0, LITO.max - (y - LITO.t1) * LITO.r1);
  return Math.max(0, LITO.max - (LITO.t2 - LITO.t1) * LITO.r1 - (y - LITO.t2) * LITO.r2);
}

export function medicare2526(y) {
  if (y <= MEDICARE.lowThreshold) return 0;
  return Math.min(y * MEDICARE.rate, (y - MEDICARE.lowThreshold) * MEDICARE.shadeRate);
}

export function hecs2526(y) {
  if (y <= HECS.threshold) return 0;
  if (y >= HECS.flatFrom) return y * HECS.flatRate;
  if (y > HECS.mid) return HECS.midBase + (y - HECS.mid) * HECS.r2;
  return (y - HECS.threshold) * HECS.r1;
}
