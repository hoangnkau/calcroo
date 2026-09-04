/* ============================================================
   CALCROO — PURE HECS VOLUNTARY-REPAYMENT HELPERS
   Không phụ thuộc React. Tách riêng để dễ unit test.
   ============================================================ */

import { hecs, simulateHecs } from './tax';
import { clamp } from './pay';

export const WEEKLY_EXTRA_MAX = 500;

/**
 * Tác động của việc trả thêm HECS tự nguyện mỗi tuần.
 *
 * @param {{debt:number, income:number, weeklyExtra?:number,
 *          idx?:number, growth?:number}} input   idx/growth ở dạng thập phân (0.03 = 3%)
 * @returns {{
 *   annualExtra:number, monthlyExtra:number, compulsory:number,
 *   base:object, boosted:object,
 *   yearsSaved:number, indexationAvoided:number,
 *   nowRepays:boolean            // true nếu trước đây không trả hết, giờ thì có
 * }}
 */
export function hecsVoluntaryOutcome({ debt, income, weeklyExtra = 0, idx = 0.03, growth = 0.03 } = {}) {
  const d = Math.max(0, +debt || 0);
  const y = Math.max(0, +income || 0);
  const weekly = clamp(weeklyExtra, 0, WEEKLY_EXTRA_MAX * 4); // cho phép vượt trần UI khi gọi trực tiếp
  const annualExtra = weekly * 52;

  const opts = { idx, growth };
  const base = simulateHecs(d, y, opts);
  const boosted = annualExtra > 0 ? simulateHecs(d, y, { ...opts, voluntary: annualExtra }) : base;

  const bothRepaid = base.repaid && boosted.repaid;
  const yearsSaved = bothRepaid ? Math.max(0, base.years - boosted.years) : 0;
  const indexationAvoided = bothRepaid
    ? Math.max(0, base.totalIndexation - boosted.totalIndexation)
    : 0;

  return {
    annualExtra,
    monthlyExtra: annualExtra / 12,
    compulsory: hecs(y),
    base,
    boosted,
    yearsSaved,
    indexationAvoided,
    nowRepays: !base.repaid && boosted.repaid,
  };
}
