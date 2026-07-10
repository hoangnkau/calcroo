'use client';

import { useState } from 'react';
import { FY, incomeTax, lito, medicare, hecs, marginalRate } from '../lib/tax';

const STRINGS = {
  en: {
    inTitle: 'Your details',
    incomeLbl: 'Annual taxable income (before tax)',
    incomeHint: 'Salary excluding superannuation. Super is paid on top by your employer.',
    resLbl: 'Residency for tax purposes',
    resOpt1: 'Australian resident',
    resHint: 'Currently covers residents. Non-resident & working-holiday rates are coming soon.',
    hecsLbl: 'I have a HECS-HELP debt',
    hecsHint: 'Compulsory repayment under the marginal system (2026–27 threshold: $69,528).',
    mlLbl: 'Include Medicare levy (2%)',
    mlHint: 'Low-income reduction applied automatically. Untick if you hold a full exemption.',
    psTitle: 'Estimated payslip',
    takeLbl: 'Take-home pay',
    freqs: { 1: 'Yearly', 12: 'Monthly', 26: 'Fortnightly', 52: 'Weekly' },
    perMap: { 1: 'per year', 12: 'per month', 26: 'per fortnight', 52: 'per week' },
    lGross: 'Gross income',
    lTax: 'Income tax',
    lLito: 'Low income tax offset (LITO)',
    lMl: 'Medicare levy',
    lHecs: 'HECS-HELP repayment',
    lNet: 'Take-home pay',
    effLbl: 'Effective tax rate',
    margLbl: 'Marginal tax rate',
  },
  vi: {
    inTitle: 'Thông tin của bạn',
    incomeLbl: 'Thu nhập chịu thuế mỗi năm (trước thuế)',
    incomeHint: 'Lương chưa gồm superannuation. Super do chủ lao động đóng thêm ngoài lương.',
    resLbl: 'Tình trạng cư trú thuế',
    resOpt1: 'Thường trú thuế tại Úc (resident)',
    resHint: 'Hiện tính cho resident. Thuế non-resident & working holiday sẽ bổ sung sau.',
    hecsLbl: 'Tôi đang có nợ HECS-HELP',
    hecsHint: 'Trả nợ bắt buộc theo cách tính lũy tiến (ngưỡng 2026–27: $69.528).',
    mlLbl: 'Tính Medicare levy (2%)',
    mlHint: 'Tự động giảm cho thu nhập thấp. Bỏ chọn nếu bạn được miễn hoàn toàn.',
    psTitle: 'Phiếu lương ước tính',
    takeLbl: 'Lương thực nhận',
    freqs: { 1: 'Mỗi năm', 12: 'Mỗi tháng', 26: 'Mỗi 2 tuần', 52: 'Mỗi tuần' },
    perMap: { 1: 'mỗi năm', 12: 'mỗi tháng', 26: 'mỗi 2 tuần', 52: 'mỗi tuần' },
    lGross: 'Tổng thu nhập',
    lTax: 'Thuế thu nhập',
    lLito: 'Giảm trừ thu nhập thấp (LITO)',
    lMl: 'Medicare levy',
    lHecs: 'Trả nợ HECS-HELP',
    lNet: 'Lương thực nhận',
    effLbl: 'Thuế suất thực tế',
    margLbl: 'Thuế suất biên',
  },
};

const fmt = (n) => '$' + Math.round(n).toLocaleString('en-AU');

export default function TaxCalculator({ lang = 'en' }) {
  const t = STRINGS[lang];
  const [raw, setRaw] = useState('90,000');
  const [withHecs, setWithHecs] = useState(false);
  const [withMl, setWithMl] = useState(true);
  const [freq, setFreq] = useState(1);

  const y = parseFloat(raw.replace(/[^0-9.]/g, '')) || 0;
  const grossTax = incomeTax(y);
  const off = Math.min(lito(y), grossTax);
  const taxAfter = grossTax - off;
  const ml = withMl ? medicare(y) : 0;
  const hc = withHecs ? hecs(y) : 0;
  const net = y - taxAfter - ml - hc;
  const f = freq;

  const onIncome = (e) => {
    const n = parseFloat(e.target.value.replace(/[^0-9.]/g, '')) || 0;
    setRaw(n ? n.toLocaleString('en-AU') : '');
  };

  return (
    <div className="grid">
      <div className="card">
        <h2>{t.inTitle}</h2>

        <div className="field">
          <label htmlFor="income">{t.incomeLbl}</label>
          <div className="money-input">
            <span>$</span>
            <input type="text" id="income" inputMode="numeric" autoComplete="off" value={raw} onChange={onIncome} />
          </div>
          <div className="hint">{t.incomeHint}</div>
        </div>

        <div className="field">
          <label htmlFor="residency">{t.resLbl}</label>
          <select id="residency" defaultValue="resident">
            <option value="resident">{t.resOpt1}</option>
          </select>
          <div className="hint">{t.resHint}</div>
        </div>

        <div className="field">
          <label className="check" htmlFor="hecs">
            <input type="checkbox" id="hecs" checked={withHecs} onChange={(e) => setWithHecs(e.target.checked)} />
            <div>
              <div className="t">{t.hecsLbl}</div>
              <div className="s">{t.hecsHint}</div>
            </div>
          </label>
        </div>

        <div className="field">
          <label className="check" htmlFor="ml">
            <input type="checkbox" id="ml" checked={withMl} onChange={(e) => setWithMl(e.target.checked)} />
            <div>
              <div className="t">{t.mlLbl}</div>
              <div className="s">{t.mlHint}</div>
            </div>
          </label>
        </div>
      </div>

      <div className="payslip" aria-live="polite">
        <div className="payslip-head">
          <span className="lbl">{t.psTitle}</span>
          <span className="fy">FY {FY}</span>
        </div>

        <div className="takehome">
          <div className="lbl">{t.takeLbl}</div>
          <div className="big">{fmt(net / f)}</div>
          <div className="per">{t.perMap[f]}</div>
        </div>

        <div className="freq-row">
          {[1, 12, 26, 52].map((n) => (
            <button key={n} className={f === n ? 'active' : ''} onClick={() => setFreq(n)}>
              {t.freqs[n]}
            </button>
          ))}
        </div>

        <div className="lines">
          <div className="line gross">
            <span className="k">{t.lGross}</span>
            <span className="v">{fmt(y / f)}</span>
          </div>
          <div className="line minus">
            <span className="k">{t.lTax}</span>
            <span className="v">−{fmt(taxAfter / f)}</span>
          </div>
          {off > 0 && (
            <div className="line plus">
              <span className="k">{t.lLito}</span>
              <span className="v">+{fmt(off / f)}</span>
            </div>
          )}
          {withMl && (
            <div className="line minus">
              <span className="k">{t.lMl}</span>
              <span className="v">−{fmt(ml / f)}</span>
            </div>
          )}
          {withHecs && (
            <div className="line minus">
              <span className="k">{t.lHecs}</span>
              <span className="v">−{fmt(hc / f)}</span>
            </div>
          )}
          <div className="line total">
            <span className="k">{t.lNet}</span>
            <span className="v">{fmt(net / f)}</span>
          </div>
        </div>

        <div className="rate-strip">
          <div>
            <div className="n">{y > 0 ? (((taxAfter + ml) / y) * 100).toFixed(1) + '%' : '0%'}</div>
            <div className="l">{t.effLbl}</div>
          </div>
          <div>
            <div className="n">{marginalRate(y) * 100}%</div>
            <div className="l">{t.margLbl}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
