/* ============================================================
   CALCROO — TAX DATA FY 2026-27
   ⚠ ĐÂY LÀ FILE DUY NHẤT CHỨA SỐ LIỆU THUẾ.
   Mỗi năm tài chính (1/7) chỉ cần cập nhật file này.
   Nguồn đối chiếu: ato.gov.au — VERIFY TRƯỚC KHI PUBLISH.
   ============================================================ */

export const FY = '2026–27';

// Super 2026-27 — ✓ ĐÃ ĐỐI CHIẾU ATO 7/2026: SG 12%, concessional cap $32.500 (tăng từ $30.000)
export const SUPER = { sgRate: 0.12, concessionalCap: 32500, contribTax: 0.15 };

// Bậc thuế resident từ 1/7/2026 (bậc 16% giảm còn 15%) — ✓ ĐÃ ĐỐI CHIẾU ATO 7/2026
export const BRACKETS = [
  { upTo: 18200, rate: 0.0 },
  { upTo: 45000, rate: 0.15 },
  { upTo: 135000, rate: 0.3 },
  { upTo: 190000, rate: 0.37 },
  { upTo: Infinity, rate: 0.45 },
];

// Low Income Tax Offset — ✓ ĐÃ ĐỐI CHIẾU ATO 7/2026: max $700, phase-out đến $66.667
export const LITO = { max: 700, t1: 37500, r1: 0.05, t2: 45000, r2: 0.015 };

// Medicare levy 2026-27 — ✓ ĐÃ ĐỐI CHIẾU ATO 7/2026: ngưỡng độc thân $28.011 (upper $35.013, shade 10%)
export const MEDICARE = { rate: 0.02, lowThreshold: 28011, shadeRate: 0.1 };

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

/* ============================================================
   DỮ LIỆU ĐA NĂM — cho Tax Refund Estimator (khai thuế năm cũ)
   2025-26: bậc 16%; HECS theo bảng ATO chính thức đã đối chiếu
   2026-27: trùng các hằng số phía trên (đã đối chiếu ATO 7/2026)
   ⚠ Medicare 2025-26: ngưỡng $27.222 là số 2024-25 (ngưỡng này
   được công bố lùi trong Budget) — cập nhật khi ATO công bố.
   ============================================================ */
export const FY_DATA = {
  '2025-26': {
    label: '2025–26',
    brackets: [
      { upTo: 18200, rate: 0.0 },
      { upTo: 45000, rate: 0.16 },
      { upTo: 135000, rate: 0.3 },
      { upTo: 190000, rate: 0.37 },
      { upTo: Infinity, rate: 0.45 },
    ],
    lito: { max: 700, t1: 37500, r1: 0.05, t2: 45000, r2: 0.015 },
    medicare: { rate: 0.02, lowThreshold: 27222, shadeRate: 0.1 },
    hecs: { threshold: 67000, mid: 125000, midBase: 8700, r1: 0.15, r2: 0.17, flatFrom: 179286, flatRate: 0.1 },
    // MLS (độc thân) 2025-26 — ✓ ĐÃ ĐỐI CHIẾU 7/2026: $101k / $118k / $158k
    mls: [
      { from: 158000, rate: 0.015 },
      { from: 118000, rate: 0.0125 },
      { from: 101000, rate: 0.01 },
    ],
  },
  '2026-27': {
    label: '2026–27',
    brackets: BRACKETS,
    lito: LITO,
    medicare: MEDICARE,
    hecs: HECS,
    // MLS (độc thân) 2026-27 — ✓ CẬP NHẬT 7/2026: $105k / $123k / $164k (nguồn user đối chiếu)
    mls: [
      { from: 164000, rate: 0.015 },
      { from: 123000, rate: 0.0125 },
      { from: 105000, rate: 0.01 },
    ],
  },
};

// Ngưỡng miễn thuế part-year cho người đến/rời Úc giữa năm (công thức ATO)
// threshold = $13.464 + ($4.736 × số tháng là resident / 12); đủ 12 tháng = $18.200
export const PART_YEAR = { base: 13464, perYear: 4736 };

export function partYearThreshold(months) {
  const m = Math.min(Math.max(months, 1), 12);
  return PART_YEAR.base + (PART_YEAR.perYear * m) / 12;
}

// Thuế thu nhập với ngưỡng miễn thuế tùy chỉnh (cho part-year resident)
export function incomeTaxForMonths(y, fy, months = 12) {
  const brackets = FY_DATA[fy].brackets.map((b, i) =>
    i === 0 ? { ...b, upTo: months >= 12 ? b.upTo : partYearThreshold(months) } : b
  );
  let tax = 0;
  let prev = 0;
  for (const b of brackets) {
    if (y > prev) tax += (Math.min(y, b.upTo) - prev) * b.rate;
    prev = Math.min(b.upTo, y) > prev ? b.upTo : prev;
    if (y <= b.upTo) break;
    prev = b.upTo;
  }
  return tax;
}

// Medicare Levy Surcharge (độc thân, không có bảo hiểm bệnh viện tư)
export function mlsFor(mlsIncome, fy) {
  for (const tier of FY_DATA[fy].mls) {
    if (mlsIncome > tier.from) return mlsIncome * tier.rate;
  }
  return 0;
}

export function incomeTaxFor(y, fy) {
  let tax = 0;
  let prev = 0;
  for (const b of FY_DATA[fy].brackets) {
    if (y > prev) tax += (Math.min(y, b.upTo) - prev) * b.rate;
    prev = b.upTo;
  }
  return tax;
}

export function litoFor(y, fy) {
  const L = FY_DATA[fy].lito;
  if (y <= L.t1) return L.max;
  if (y <= L.t2) return Math.max(0, L.max - (y - L.t1) * L.r1);
  return Math.max(0, L.max - (L.t2 - L.t1) * L.r1 - (y - L.t2) * L.r2);
}

export function medicareFor(y, fy) {
  const M = FY_DATA[fy].medicare;
  if (y <= M.lowThreshold) return 0;
  return Math.min(y * M.rate, (y - M.lowThreshold) * M.shadeRate);
}

export function hecsFor(y, fy) {
  const H = FY_DATA[fy].hecs;
  if (y <= H.threshold) return 0;
  if (y >= H.flatFrom) return y * H.flatRate;
  if (y > H.mid) return H.midBase + (y - H.mid) * H.r2;
  return (y - H.threshold) * H.r1;
}

// Mô phỏng thời gian trả hết nợ HECS (đơn giản hóa: indexation áp lên dư nợ đầu năm,
// khoản trả bắt buộc + tự nguyện trừ cuối năm; ngưỡng HECS giữ nguyên theo 2026-27)
export function simulateHecs(debt, income, { idx = 0.03, growth = 0.03, voluntary = 0, maxYears = 50 } = {}) {
  let bal = debt;
  let y = income;
  let years = 0;
  let totalIndexation = 0;
  let totalPaid = 0;
  while (bal > 0.5 && years < maxYears) {
    const indexation = bal * idx;
    bal += indexation;
    totalIndexation += indexation;
    const pay = Math.min(bal, hecs(y) + voluntary);
    bal -= pay;
    totalPaid += pay;
    y *= 1 + growth;
    years++;
    if (pay <= 0) break; // thu nhập dưới ngưỡng và không trả tự nguyện → không bao giờ trả hết
  }
  return { years, totalIndexation, totalPaid, remaining: Math.max(bal, 0), repaid: bal <= 0.5 };
}
