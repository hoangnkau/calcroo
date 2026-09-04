/* ============================================================
   CALCROO — PURE INCOME-ALLOCATION HELPER
   "Mỗi đô la tổng thù lao (lương + super) đi về đâu."
   Không phụ thuộc React. Tách riêng để dễ unit test.
   ============================================================ */

import { computePay } from './pay';
import { SUPER, marginalRate } from './tax';

/** Bảng màu chuyên nghiệp, dùng chung cho donut + PDF. */
export const ALLOCATION_COLORS = {
  net: '#0e6b4f',
  super: '#3b8ea5',
  tax: '#c1553a',
  medicare: '#e0a52e',
  hecs: '#7c6aa8',
};

export const ALLOCATION_LABELS_EN = {
  net: 'Take-home pay',
  super: 'Superannuation',
  tax: 'Income tax',
  medicare: 'Medicare levy',
  hecs: 'HECS-HELP',
};

export const ALLOCATION_ORDER = ['net', 'super', 'tax', 'medicare', 'hecs'];

/**
 * @param {{salary:number, withHecs?:boolean, withMedicare?:boolean, superRate?:number}} input
 * @returns {{
 *   package:number, salary:number, super:number,
 *   tax:number, offset:number, medicareLevy:number, hecs:number, net:number,
 *   effectiveRate:number, marginalRate:number,
 *   parts: Array<{key:string, value:number, pct:number}>   // cộng lại = package
 * }}
 */
export function incomeAllocation({
  salary,
  withHecs = false,
  withMedicare = true,
  superRate = SUPER.sgRate,
} = {}) {
  const p = computePay({ amount: salary, period: 'year', withHecs, withMedicare });
  const superAmt = Math.max(0, +salary || 0) * superRate;
  const pkg = p.annual + superAmt;
  const denom = pkg || 1;

  const raw = [
    { key: 'net', value: p.net },
    { key: 'super', value: superAmt },
    { key: 'tax', value: p.tax },
    { key: 'medicare', value: p.medicareLevy },
    { key: 'hecs', value: p.hecs },
  ];

  return {
    package: pkg,
    salary: p.annual,
    super: superAmt,
    tax: p.tax,
    offset: p.offset,
    medicareLevy: p.medicareLevy,
    hecs: p.hecs,
    net: p.net,
    effectiveRate: p.annual > 0 ? (p.tax + p.medicareLevy + p.hecs) / p.annual : 0,
    marginalRate: marginalRate(p.annual),
    parts: raw
      .filter((s) => s.value > 0.5)
      .map((s) => ({ ...s, pct: s.value / denom })),
  };
}
