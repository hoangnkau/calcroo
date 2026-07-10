'use client';

import { useState } from 'react';
import { FY, incomeTax, lito, medicare, hecs, SUPER } from '../lib/tax';

const STRINGS = {
  en: {
    inTitle: 'Your details',
    salaryLbl: 'Annual salary (excl. super)',
    sacLbl: 'Salary sacrifice to super (per year)',
    sacHint: 'Pre-tax contributions on top of your employer’s 12%.',
    hecsLbl: 'I have a HECS-HELP debt',
    hecsHint: 'Sacrificed super is added back to your HECS repayment income.',
    psTitle: 'With vs without sacrifice',
    thNow: 'Take-home now',
    thAfter: 'Take-home with sacrifice',
    perYear: 'per year',
    lessTh: 'Take-home reduces by',
    taxSaved: 'Income tax + Medicare saved',
    contribTax: 'Contributions tax in fund (15%)',
    intoSuper: 'Net added to your super',
    per1: (c) => `Each $1 into super costs ${c}c of take-home`,
    hecsSame: 'HECS repayment: unchanged',
    hecsSameHint: 'Repayment income adds sacrificed super back — sacrificing doesn’t reduce HECS.',
    capOk: (used, cap) => `Concessional cap: ${used} of ${cap} used (incl. employer 12%)`,
    capOver: (over) => `⚠ Over the concessional cap by ${over} — excess is taxed at your marginal rate. Reduce the sacrifice amount.`,
  },
  vi: {
    inTitle: 'Thông tin của bạn',
    salaryLbl: 'Lương năm (chưa gồm super)',
    sacLbl: 'Salary sacrifice vào super (mỗi năm)',
    sacHint: 'Khoản đóng trước thuế, cộng thêm ngoài 12% chủ lao động đóng.',
    hecsLbl: 'Tôi đang có nợ HECS-HELP',
    hecsHint: 'Super sacrifice bị cộng ngược vào repayment income của HECS.',
    psTitle: 'Có vs không sacrifice',
    thNow: 'Thực nhận hiện tại',
    thAfter: 'Thực nhận khi sacrifice',
    perYear: 'mỗi năm',
    lessTh: 'Thực nhận giảm',
    taxSaved: 'Thuế + Medicare tiết kiệm',
    contribTax: 'Thuế đóng góp trong quỹ (15%)',
    intoSuper: 'Số thực vào super',
    per1: (c) => `Mỗi $1 vào super chỉ tốn ${c}c thực nhận`,
    hecsSame: 'Khoản trả HECS: không đổi',
    hecsSameHint: 'Repayment income cộng ngược super sacrifice — sacrifice không giảm được HECS.',
    capOk: (used, cap) => `Concessional cap: đã dùng ${used} / ${cap} (gồm 12% chủ đóng)`,
    capOver: (over) => `⚠ Vượt concessional cap ${over} — phần vượt bị đánh thuế theo thuế suất biên. Hãy giảm mức sacrifice.`,
  },
};

const fmt = (n) => '$' + Math.round(n).toLocaleString('en-AU');
const num = (s) => parseFloat(String(s).replace(/[^0-9.]/g, '')) || 0;

function totals(taxable) {
  const g = incomeTax(taxable);
  const off = Math.min(lito(taxable), g);
  return (g - off) + medicare(taxable);
}

export default function SalarySacrificeCalculator({ lang = 'en' }) {
  const t = STRINGS[lang];
  const [salary, setSalary] = useState('100,000');
  const [sac, setSac] = useState('10,000');
  const [withHecs, setWithHecs] = useState(false);

  const y = num(salary);
  const s = Math.min(num(sac), y);

  // HECS: repayment income = taxable + sacrifice cộng ngược = y (không đổi)
  const hecsAmt = withHecs ? hecs(y) : 0;

  const taxNow = totals(y);
  const thNow = y - taxNow - hecsAmt;

  const taxAfter = totals(y - s);
  const thAfter = (y - s) - taxAfter - hecsAmt;

  const taxSaved = taxNow - taxAfter;
  const contribTax = s * SUPER.contribTax;
  const intoSuper = s - contribTax;
  const thDrop = thNow - thAfter;
  const costPer1 = intoSuper > 0 ? Math.round((thDrop / intoSuper) * 100) : 0;

  const capUsed = y * SUPER.sgRate + s;
  const overCap = capUsed - SUPER.concessionalCap;

  const onMoney = (set) => (e) => {
    const n = num(e.target.value);
    set(n ? n.toLocaleString('en-AU') : '');
  };

  return (
    <div className="grid">
      <div className="card">
        <h2>{t.inTitle}</h2>

        <div className="field">
          <label htmlFor="s-salary">{t.salaryLbl}</label>
          <div className="money-input">
            <span>$</span>
            <input type="text" id="s-salary" inputMode="numeric" autoComplete="off" value={salary} onChange={onMoney(setSalary)} />
          </div>
        </div>

        <div className="field">
          <label htmlFor="s-sac">{t.sacLbl}</label>
          <div className="money-input">
            <span>$</span>
            <input type="text" id="s-sac" inputMode="numeric" autoComplete="off" value={sac} onChange={onMoney(setSac)} />
          </div>
          <div className="hint">{t.sacHint}</div>
        </div>

        <div className="field">
          <label className="check" htmlFor="s-hecs">
            <input type="checkbox" id="s-hecs" checked={withHecs} onChange={(e) => setWithHecs(e.target.checked)} />
            <div>
              <div className="t">{t.hecsLbl}</div>
              <div className="s">{t.hecsHint}</div>
            </div>
          </label>
        </div>

        <div
          className="hint"
          style={{
            padding: '.7rem .9rem',
            border: '1.5px solid ' + (overCap > 0 ? 'var(--danger)' : 'var(--line)'),
            borderRadius: 9,
            color: overCap > 0 ? 'var(--danger)' : 'var(--muted)',
          }}
        >
          {overCap > 0
            ? t.capOver(fmt(overCap))
            : t.capOk(fmt(capUsed), fmt(SUPER.concessionalCap))}
        </div>
      </div>

      <div className="payslip" aria-live="polite">
        <div className="payslip-head">
          <span className="lbl">{t.psTitle}</span>
          <span className="fy">FY {FY}</span>
        </div>

        <div className="takehome">
          <div className="lbl">{t.intoSuper}</div>
          <div className="big">{fmt(intoSuper)}</div>
          <div className="per">{t.per1(costPer1)}</div>
        </div>

        <div className="lines" style={{ borderBottom: '1px dashed var(--line)' }}>
          <div className="line gross"><span className="k">{t.thNow}</span><span className="v">{fmt(thNow)}</span></div>
          <div className="line gross"><span className="k">{t.thAfter}</span><span className="v">{fmt(thAfter)}</span></div>
          <div className="line minus"><span className="k">{t.lessTh}</span><span className="v">−{fmt(thDrop)}</span></div>
        </div>

        <div className="lines" style={{ borderBottom: withHecs ? '1px dashed var(--line)' : 'none' }}>
          <div className="line plus"><span className="k">{t.taxSaved}</span><span className="v">+{fmt(taxSaved)}</span></div>
          <div className="line minus"><span className="k">{t.contribTax}</span><span className="v">−{fmt(contribTax)}</span></div>
        </div>

        {withHecs && (
          <div className="lines">
            <div className="line">
              <span className="k" style={{ fontWeight: 600, color: 'var(--ink)' }}>{t.hecsSame}</span>
              <span className="v">−{fmt(hecsAmt)}</span>
            </div>
            <div className="line">
              <span className="k" style={{ fontSize: '.78rem' }}>{t.hecsSameHint}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
