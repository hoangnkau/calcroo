'use client';

import { useState } from 'react';
import { FY_RETURN, incomeTax2526, lito2526, medicare2526, hecs2526 } from '../lib/tax2526';

const STRINGS = {
  en: {
    inTitle: 'Your 2025–26 year',
    incomeLbl: 'Total income (1 Jul 2025 – 30 Jun 2026)',
    incomeHint: 'Salary/wages from your income statement, plus interest, dividends, other income.',
    dedLbl: 'Deductions you’ll claim',
    dedHint: 'Work-related expenses, working-from-home, donations, agent fees…',
    whLbl: 'Total tax withheld',
    whHint: 'From your income statement in myGov (marked “tax ready” from late July) or your final payslip.',
    hecsLbl: 'I had a HECS-HELP debt in 2025–26',
    mlLbl: 'Include Medicare levy (2%)',
    psTitle: 'Estimated outcome',
    refund: 'Estimated refund',
    owing: 'Estimated amount owing',
    even: 'Roughly square',
    lTaxable: 'Taxable income',
    lTax: 'Tax on taxable income (2025–26 rates)',
    lLito: 'Low income tax offset',
    lMl: 'Medicare levy',
    lHecs: 'HECS-HELP repayment',
    lLiab: 'Total liability',
    lWh: 'Tax withheld',
  },
  vi: {
    inTitle: 'Năm 2025–26 của bạn',
    incomeLbl: 'Tổng thu nhập (1/7/2025 – 30/6/2026)',
    incomeHint: 'Lương từ income statement, cộng lãi ngân hàng, cổ tức, thu nhập khác.',
    dedLbl: 'Các khoản khấu trừ sẽ khai',
    dedHint: 'Chi phí liên quan công việc, làm việc tại nhà, từ thiện, phí tax agent…',
    whLbl: 'Tổng thuế đã bị trừ',
    whHint: 'Xem trong income statement trên myGov (hiện “tax ready” từ cuối tháng 7) hoặc payslip cuối cùng.',
    hecsLbl: 'Tôi có nợ HECS-HELP trong năm 2025–26',
    mlLbl: 'Tính Medicare levy (2%)',
    psTitle: 'Kết quả ước tính',
    refund: 'Ước tính được hoàn',
    owing: 'Ước tính phải đóng thêm',
    even: 'Xấp xỉ hòa',
    lTaxable: 'Thu nhập chịu thuế',
    lTax: 'Thuế trên thu nhập (biểu 2025–26)',
    lLito: 'Giảm trừ LITO',
    lMl: 'Medicare levy',
    lHecs: 'Trả nợ HECS-HELP',
    lLiab: 'Tổng nghĩa vụ',
    lWh: 'Thuế đã bị trừ',
  },
};

const fmt = (n) => '$' + Math.round(Math.abs(n)).toLocaleString('en-AU');
const num = (s) => parseFloat(String(s).replace(/[^0-9.]/g, '')) || 0;

function Money({ id, label, hint, value, onChange }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="money-input">
        <span>$</span>
        <input type="text" id={id} inputMode="numeric" autoComplete="off" value={value} onChange={onChange} />
      </div>
      {hint && <div className="hint">{hint}</div>}
    </div>
  );
}

export default function RefundCalculator({ lang = 'en' }) {
  const t = STRINGS[lang];
  const [income, setIncome] = useState('80,000');
  const [ded, setDed] = useState('2,500');
  const [wh, setWh] = useState('16,388');
  const [withHecs, setWithHecs] = useState(false);
  const [withMl, setWithMl] = useState(true);

  const taxable = Math.max(num(income) - num(ded), 0);
  const grossTax = incomeTax2526(taxable);
  const off = Math.min(lito2526(taxable), grossTax);
  const tax = grossTax - off;
  const ml = withMl ? medicare2526(taxable) : 0;
  const hc = withHecs ? hecs2526(taxable) : 0;
  const liability = tax + ml + hc;
  const outcome = num(wh) - liability; // dương = hoàn, âm = đóng thêm

  const onMoney = (set) => (e) => {
    const n = num(e.target.value);
    set(n ? n.toLocaleString('en-AU') : '');
  };

  const label = Math.abs(outcome) < 1 ? t.even : outcome > 0 ? t.refund : t.owing;
  const color = Math.abs(outcome) < 1 ? 'var(--muted)' : outcome > 0 ? 'var(--green)' : 'var(--danger)';

  return (
    <div className="grid">
      <div className="card">
        <h2>{t.inTitle}</h2>
        <Money id="r-income" label={t.incomeLbl} hint={t.incomeHint} value={income} onChange={onMoney(setIncome)} />
        <Money id="r-ded" label={t.dedLbl} hint={t.dedHint} value={ded} onChange={onMoney(setDed)} />
        <Money id="r-wh" label={t.whLbl} hint={t.whHint} value={wh} onChange={onMoney(setWh)} />
        <div className="field">
          <label className="check" htmlFor="r-hecs">
            <input type="checkbox" id="r-hecs" checked={withHecs} onChange={(e) => setWithHecs(e.target.checked)} />
            <div><div className="t">{t.hecsLbl}</div></div>
          </label>
        </div>
        <div className="field">
          <label className="check" htmlFor="r-ml">
            <input type="checkbox" id="r-ml" checked={withMl} onChange={(e) => setWithMl(e.target.checked)} />
            <div><div className="t">{t.mlLbl}</div></div>
          </label>
        </div>
      </div>

      <div className="payslip" aria-live="polite">
        <div className="payslip-head">
          <span className="lbl">{t.psTitle}</span>
          <span className="fy">FY {FY_RETURN}</span>
        </div>

        <div className="takehome">
          <div className="lbl">{label}</div>
          <div className="big" style={{ color }}>
            {outcome > 0 ? '+' : outcome < -0.99 ? '−' : ''}{fmt(outcome)}
          </div>
        </div>

        <div className="lines">
          <div className="line gross"><span className="k">{t.lTaxable}</span><span className="v">{fmt(taxable)}</span></div>
          <div className="line minus"><span className="k">{t.lTax}</span><span className="v">−{fmt(tax)}</span></div>
          {off > 0 && <div className="line plus"><span className="k">{t.lLito}</span><span className="v">{lang === 'en' ? 'included' : 'đã gồm'} +{fmt(off)}</span></div>}
          {withMl && <div className="line minus"><span className="k">{t.lMl}</span><span className="v">−{fmt(ml)}</span></div>}
          {withHecs && <div className="line minus"><span className="k">{t.lHecs}</span><span className="v">−{fmt(hc)}</span></div>}
          <div className="line total" style={{ color: 'var(--ink)' }}>
            <span className="k" style={{ color: 'var(--ink)' }}>{t.lLiab}</span>
            <span className="v" style={{ color: 'var(--ink)' }}>{fmt(liability)}</span>
          </div>
          <div className="line gross"><span className="k">{t.lWh}</span><span className="v">{fmt(num(wh))}</span></div>
        </div>
      </div>
    </div>
  );
}
