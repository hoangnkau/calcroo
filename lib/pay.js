/* ============================================================
   CALCROO — PURE PAY-CALCULATION HELPERS
   Không phụ thuộc React. Tách riêng để dễ unit test.
   ============================================================ */

import { incomeTax, lito, medicare, hecs } from './tax';

export const PERIODS = ['hour', 'week', 'fortnight', 'month', 'year'];

/** Chia thu nhập năm ra kỳ hiển thị. */
export const DIVISORS = { year: 1, month: 12, fortnight: 26, week: 52 };

export function clamp(n, min, max) {
  const x = Number.isFinite(+n) ? +n : min;
  return Math.min(Math.max(x, min), max);
}

/** Hệ số quy đổi một khoản trả theo `period` thành số năm. */
export function annualMultiplier(period, hoursPerWeek = 38) {
  switch (period) {
    case 'hour':
      return clamp(hoursPerWeek, 1, 100) * 52;
    case 'week':
      return 52;
    case 'fortnight':
      return 26;
    case 'month':
      return 12;
    case 'year':
    default:
      return 1;
  }
}

/**
 * Tính lương thực nhận + các khoản khấu trừ cho một công việc.
 *
 * @param {{amount:number, period?:string, hoursPerWeek?:number,
 *          withHecs?:boolean, withMedicare?:boolean}} input
 * @returns {{annual:number, grossTax:number, offset:number, tax:number,
 *            medicareLevy:number, hecs:number, net:number,
 *            effectiveRate:number}}
 */
export function computePay(input = {}) {
  const {
    amount = 0,
    period = 'year',
    hoursPerWeek = 38,
    withHecs = false,
    withMedicare = true,
  } = input;

  const annual = Math.max(0, +amount || 0) * annualMultiplier(period, hoursPerWeek);
  const grossTax = incomeTax(annual);
  const offset = Math.min(lito(annual), grossTax);
  const tax = grossTax - offset;
  const medicareLevy = withMedicare ? medicare(annual) : 0;
  const hecsRepay = withHecs ? hecs(annual) : 0;
  const net = annual - tax - medicareLevy - hecsRepay;

  return {
    annual,
    grossTax,
    offset,
    tax,
    medicareLevy,
    hecs: hecsRepay,
    net,
    effectiveRate: annual > 0 ? (tax + medicareLevy + hecsRepay) / annual : 0,
  };
}

/**
 * So sánh hai công việc. `delta` = giá trị Job 2 trừ Job 1 (dương = Job 2 nhiều hơn).
 *
 * @returns {{a:object, b:object, delta:{annual,tax,medicareLevy,hecs,net:number}}}
 */
export function comparePay(job1 = {}, job2 = {}) {
  const a = computePay(job1);
  const b = computePay(job2);
  const keys = ['annual', 'tax', 'medicareLevy', 'hecs', 'net'];
  const delta = {};
  for (const k of keys) delta[k] = b[k] - a[k];
  return { a, b, delta };
}

/** Dữ liệu cho biểu đồ cột so sánh, đã quy đổi theo kỳ (year|month|week). */
export function comparisonChartData(job1, job2, viewPeriod = 'year') {
  const { a, b } = comparePay(job1, job2);
  const div = DIVISORS[viewPeriod] || 1;
  return [
    { key: 'tax', job1: a.tax / div, job2: b.tax / div },
    { key: 'hecs', job1: a.hecs / div, job2: b.hecs / div },
    { key: 'net', job1: a.net / div, job2: b.net / div },
  ];
}
