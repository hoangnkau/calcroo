'use client';

import { useState } from 'react';
import { FY, incomeTax, lito, medicare, hecs } from '../lib/tax';

const STRINGS = {
  en: {
    inTitle: 'Your pay',
    amountLbl: 'Pay amount (before tax)',
    periodLbl: 'Per',
    periods: { hour: 'Hour', week: 'Week', fortnight: 'Fortnight', month: 'Month', year: 'Year' },
    hoursLbl: 'Hours per week',
    hoursHint: 'Full-time standard is 38 hours. Used to convert hourly pay.',
    hecsLbl: 'I have a HECS-HELP debt',
    hecsHint: 'Compulsory repayment under the marginal system (2026–27 threshold: $69,528).',
    mlLbl: 'Include Medicare levy (2%)',
    mlHint: 'Low-income reduction applied automatically.',
    psTitle: 'Pay breakdown',
    colPeriod: 'Period',
    colGross: 'Gross',
    colNet: 'Take-home',
    rows: { hour: 'Hourly', week: 'Weekly', fortnight: 'Fortnightly', month: 'Monthly', year: 'Yearly' },
    sumTax: 'Income tax',
    sumMl: 'Medicare levy',
    sumHecs: 'HECS-HELP',
    sumNote: 'per year',
  },
  vi: {
    inTitle: 'Mức lương của bạn',
    amountLbl: 'Số tiền lương (trước thuế)',
    periodLbl: 'Tính theo',
    periods: { hour: 'Giờ', week: 'Tuần', fortnight: '2 tuần', month: 'Tháng', year: 'Năm' },
    hoursLbl: 'Số giờ làm mỗi tuần',
    hoursHint: 'Full-time chuẩn là 38 giờ. Dùng để quy đổi lương theo giờ.',
    hecsLbl: 'Tôi đang có nợ HECS-HELP',
    hecsHint: 'Trả nợ bắt buộc theo cách tính lũy tiến (ngưỡng 2026–27: $69.528).',
    mlLbl: 'Tính Medicare levy (2%)',
    mlHint: 'Tự động giảm cho thu nhập thấp.',
    psTitle: 'Bảng quy đổi lương',
    colPeriod: 'Kỳ',
    colGross: 'Trước thuế',
    colNet: 'Thực nhận',
    rows: { hour: 'Mỗi giờ', week: 'Mỗi tuần', fortnight: 'Mỗi 2 tuần', month: 'Mỗi tháng', year: 'Mỗi năm' },
    sumTax: 'Thuế thu nhập',
    sumMl: 'Medicare levy',
    sumHecs: 'HECS-HELP',
    sumNote: 'mỗi năm',
  },
};

const fmt = (n) => '$' + Math.round(n).toLocaleString('en-AU');
const fmt2 = (n) => '$' + n.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export default function PayCalculator({ lang = 'en' }) {
  const t = STRINGS[lang];
  const [raw, setRaw] = useState('40');
  const [period, setPeriod] = useState('hour');
  const [hours, setHours] = useState('38');
  const [withHecs, setWithHecs] = useState(false);
  const [withMl, setWithMl] = useState(true);

  const amount = parseFloat(raw.replace(/[^0-9.]/g, '')) || 0;
  const h = Math.min(Math.max(parseFloat(hours) || 38, 1), 100);

  const toAnnual = { hour: h * 52, week: 52, fortnight: 26, month: 12, year: 1 };
  const annual = amount * toAnnual[period];

  const grossTax = incomeTax(annual);
  const off = Math.min(lito(annual), grossTax);
  const tax = grossTax - off;
  const ml = withMl ? medicare(annual) : 0;
  const hc = withHecs ? hecs(annual) : 0;
  const netAnnual = annual - tax - ml - hc;

  const divisors = { hour: h * 52, week: 52, fortnight: 26, month: 12, year: 1 };

  const onAmount = (e) => {
    const v = e.target.value.replace(/[^0-9.]/g, '');
    setRaw(v);
  };

  return (
    <div className="grid">
      <div className="card">
        <h2>{t.inTitle}</h2>

        <div className="field">
          <label htmlFor="pay-amount">{t.amountLbl}</label>
          <div className="money-input">
            <span>$</span>
            <input type="text" id="pay-amount" inputMode="decimal" autoComplete="off" value={raw} onChange={onAmount} />
          </div>
        </div>

        <div className="field">
          <label htmlFor="pay-period">{t.periodLbl}</label>
          <select id="pay-period" value={period} onChange={(e) => setPeriod(e.target.value)}>
            {Object.entries(t.periods).map(([k, v]) => (
              <option key={k} value={k}>
                {v}
              </option>
            ))}
          </select>
        </div>

        {period === 'hour' && (
          <div className="field">
            <label htmlFor="pay-hours">{t.hoursLbl}</label>
            <div className="money-input">
              <span>⏱</span>
              <input
                type="text"
                id="pay-hours"
                inputMode="decimal"
                autoComplete="off"
                value={hours}
                onChange={(e) => setHours(e.target.value.replace(/[^0-9.]/g, ''))}
              />
            </div>
            <div className="hint">{t.hoursHint}</div>
          </div>
        )}

        <div className="field">
          <label className="check" htmlFor="pay-hecs">
            <input type="checkbox" id="pay-hecs" checked={withHecs} onChange={(e) => setWithHecs(e.target.checked)} />
            <div>
              <div className="t">{t.hecsLbl}</div>
              <div className="s">{t.hecsHint}</div>
            </div>
          </label>
        </div>

        <div className="field">
          <label className="check" htmlFor="pay-ml">
            <input type="checkbox" id="pay-ml" checked={withMl} onChange={(e) => setWithMl(e.target.checked)} />
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

        <div className="lines" style={{ borderBottom: '1px dashed var(--line)' }}>
          <div className="line gross">
            <span className="k">{t.colPeriod}</span>
            <span
              className="v"
              style={{ display: 'flex', gap: '1.6rem', fontFamily: 'var(--font-display)', fontWeight: 600 }}
            >
              <span style={{ minWidth: '5.5rem', textAlign: 'right' }}>{t.colGross}</span>
              <span style={{ minWidth: '5.5rem', textAlign: 'right', color: 'var(--green)' }}>{t.colNet}</span>
            </span>
          </div>
          {Object.entries(t.rows).map(([k, label]) => (
            <div className="line" key={k}>
              <span className="k">{label}</span>
              <span className="v" style={{ display: 'flex', gap: '1.6rem' }}>
                <span style={{ minWidth: '5.5rem', textAlign: 'right' }}>
                  {k === 'hour' ? fmt2(annual / divisors[k]) : fmt(annual / divisors[k])}
                </span>
                <span style={{ minWidth: '5.5rem', textAlign: 'right', color: 'var(--green)', fontWeight: 600 }}>
                  {k === 'hour' ? fmt2(netAnnual / divisors[k]) : fmt(netAnnual / divisors[k])}
                </span>
              </span>
            </div>
          ))}
        </div>

        <div className="lines">
          <div className="line minus">
            <span className="k">{t.sumTax}</span>
            <span className="v">
              −{fmt(tax)} <span style={{ color: 'var(--muted)', fontWeight: 400 }}>/ {t.sumNote}</span>
            </span>
          </div>
          {withMl && (
            <div className="line minus">
              <span className="k">{t.sumMl}</span>
              <span className="v">
                −{fmt(ml)} <span style={{ color: 'var(--muted)', fontWeight: 400 }}>/ {t.sumNote}</span>
              </span>
            </div>
          )}
          {withHecs && (
            <div className="line minus">
              <span className="k">{t.sumHecs}</span>
              <span className="v">
                −{fmt(hc)} <span style={{ color: 'var(--muted)', fontWeight: 400 }}>/ {t.sumNote}</span>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
