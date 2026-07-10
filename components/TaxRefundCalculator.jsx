'use client';

import { useState } from 'react';
import { FY_DATA, incomeTaxFor, litoFor, medicareFor, hecsFor } from '../lib/tax';

const STRINGS = {
  en: {
    inTitle: 'Your tax return details',
    yearLbl: 'Income year',
    yearHint: 'Lodging now (July 2026)? That’s your 2025–26 return. Pick 2026–27 to plan ahead for next year.',
    incomeLbl: 'Total income (salary, interest, etc.)',
    dedLbl: 'Total deductions',
    dedHint: 'Work-related expenses, working-from-home, donations, agent fees…',
    whLbl: 'Total tax withheld',
    whHint: 'From your income statement in myGov (ATO → Employment) or your final payslip — the year’s PAYG withholding total.',
    hecsLbl: 'I have a HECS-HELP debt',
    hecsHint: 'Your compulsory repayment is assessed in the return.',
    psTitle: 'Your estimate',
    refund: 'Estimated refund',
    owing: 'Estimated amount owing',
    even: 'About even',
    lTaxable: 'Taxable income',
    lTax: 'Income tax (after offsets)',
    lMl: 'Medicare levy',
    lHecs: 'HECS-HELP repayment',
    lLiab: 'Total tax assessed',
    lWh: 'Tax you already paid (withheld)',
  },
  vi: {
    inTitle: 'Thông tin khai thuế của bạn',
    yearLbl: 'Năm thu nhập',
    yearHint: 'Khai bây giờ (tháng 7/2026) tức là khai cho năm 2025–26. Chọn 2026–27 nếu muốn ước tính trước cho năm nay.',
    incomeLbl: 'Tổng thu nhập (lương, lãi bank...)',
    dedLbl: 'Tổng deductions (khoản khấu trừ)',
    dedHint: 'Chi phí làm việc, working-from-home, từ thiện, phí tax agent…',
    whLbl: 'Tổng thuế đã bị trừ (tax withheld)',
    whHint: 'Xem income statement trong myGov (ATO → Employment) hoặc payslip cuối năm — tổng PAYG withholding cả năm.',
    hecsLbl: 'Tôi đang có nợ HECS-HELP',
    hecsHint: 'Khoản trả bắt buộc được quyết toán trong tax return.',
    psTitle: 'Ước tính của bạn',
    refund: 'Dự kiến được hoàn',
    owing: 'Dự kiến phải đóng thêm',
    even: 'Xấp xỉ hòa',
    lTaxable: 'Thu nhập chịu thuế',
    lTax: 'Thuế thu nhập (sau giảm trừ)',
    lMl: 'Medicare levy',
    lHecs: 'Trả nợ HECS-HELP',
    lLiab: 'Tổng thuế phải nộp',
    lWh: 'Thuế đã nộp qua lương',
  },
};

const fmt = (n) => '$' + Math.round(Math.abs(n)).toLocaleString('en-AU');
const num = (s) => parseFloat(String(s).replace(/[^0-9.]/g, '')) || 0;

export default function TaxRefundCalculator({ lang = 'en' }) {
  const t = STRINGS[lang];
  const [fy, setFy] = useState('2025-26');
  const [income, setIncome] = useState('75,000');
  const [ded, setDed] = useState('1,500');
  const [wh, setWh] = useState('16,000');
  const [withHecs, setWithHecs] = useState(false);

  const taxable = Math.max(num(income) - num(ded), 0);
  const gross = incomeTaxFor(taxable, fy);
  const off = Math.min(litoFor(taxable, fy), gross);
  const tax = gross - off;
  const ml = medicareFor(taxable, fy);
  const hc = withHecs ? hecsFor(taxable, fy) : 0;
  const liability = tax + ml + hc;
  const result = num(wh) - liability; // + = refund, − = owing

  const onMoney = (set) => (e) => {
    const n = num(e.target.value);
    set(n ? n.toLocaleString('en-AU') : '');
  };

  const isRefund = result > 5;
  const isOwing = result < -5;

  return (
    <div className="grid">
      <div className="card">
        <h2>{t.inTitle}</h2>

        <div className="field">
          <label htmlFor="r-year">{t.yearLbl}</label>
          <select id="r-year" value={fy} onChange={(e) => setFy(e.target.value)}>
            {Object.entries(FY_DATA).map(([k, v]) => (
              <option key={k} value={k}>
                FY {v.label}
              </option>
            ))}
          </select>
          <div className="hint">{t.yearHint}</div>
        </div>

        <div className="field">
          <label htmlFor="r-income">{t.incomeLbl}</label>
          <div className="money-input">
            <span>$</span>
            <input type="text" id="r-income" inputMode="numeric" autoComplete="off" value={income} onChange={onMoney(setIncome)} />
          </div>
        </div>

        <div className="field">
          <label htmlFor="r-ded">{t.dedLbl}</label>
          <div className="money-input">
            <span>$</span>
            <input type="text" id="r-ded" inputMode="numeric" autoComplete="off" value={ded} onChange={onMoney(setDed)} />
          </div>
          <div className="hint">{t.dedHint}</div>
        </div>

        <div className="field">
          <label htmlFor="r-wh">{t.whLbl}</label>
          <div className="money-input">
            <span>$</span>
            <input type="text" id="r-wh" inputMode="numeric" autoComplete="off" value={wh} onChange={onMoney(setWh)} />
          </div>
          <div className="hint">{t.whHint}</div>
        </div>

        <div className="field">
          <label className="check" htmlFor="r-hecs">
            <input type="checkbox" id="r-hecs" checked={withHecs} onChange={(e) => setWithHecs(e.target.checked)} />
            <div>
              <div className="t">{t.hecsLbl}</div>
              <div className="s">{t.hecsHint}</div>
            </div>
          </label>
        </div>
      </div>

      <div className="payslip" aria-live="polite">
        <div className="payslip-head">
          <span className="lbl">{t.psTitle}</span>
          <span className="fy">FY {FY_DATA[fy].label}</span>
        </div>

        <div className="takehome">
          <div className="lbl">{isRefund ? t.refund : isOwing ? t.owing : t.even}</div>
          <div className="big" style={{ color: isOwing ? 'var(--danger)' : 'var(--green)' }}>
            {isOwing ? '−' : ''}{fmt(result)}
          </div>
        </div>

        <div className="lines">
          <div className="line gross"><span className="k">{t.lTaxable}</span><span className="v">{fmt(taxable)}</span></div>
          <div className="line minus"><span className="k">{t.lTax}</span><span className="v">−{fmt(tax)}</span></div>
          <div className="line minus"><span className="k">{t.lMl}</span><span className="v">−{fmt(ml)}</span></div>
          {withHecs && (
            <div className="line minus"><span className="k">{t.lHecs}</span><span className="v">−{fmt(hc)}</span></div>
          )}
          <div className="line minus" style={{ borderTop: '1px solid var(--line)', marginTop: '.4rem', paddingTop: '.6rem' }}>
            <span className="k" style={{ fontWeight: 600, color: 'var(--ink)' }}>{t.lLiab}</span>
            <span className="v" style={{ fontWeight: 600 }}>−{fmt(liability)}</span>
          </div>
          <div className="line plus"><span className="k">{t.lWh}</span><span className="v">+{fmt(num(wh))}</span></div>
          <div className="line total">
            <span className="k">{isRefund ? t.refund : isOwing ? t.owing : t.even}</span>
            <span className="v" style={{ color: isOwing ? 'var(--danger)' : 'var(--green)' }}>
              {isOwing ? '−' : ''}{fmt(result)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
