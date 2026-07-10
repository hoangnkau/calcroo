'use client';

import { useState } from 'react';
import { FY, incomeTax, lito, medicare, hecs } from '../lib/tax';

const STRINGS = {
  en: {
    inTitle: 'Your casual work',
    rateLbl: 'Casual hourly rate (incl. loading)',
    rateHint: 'The rate on your payslip — casual loading (usually 25%) already included.',
    ordLbl: 'Ordinary hours per week (Mon–Fri)',
    satLbl: 'Saturday hours / week',
    sunLbl: 'Sunday hours / week',
    phLbl: 'Public holiday hours / year',
    multLbl: '× rate',
    multHint: 'Penalty multipliers vary by award — check yours on fairwork.gov.au. Common casual rates: Sat ×1.5, Sun ×1.75, public holidays ×2.5.',
    weeksLbl: 'Weeks worked per year',
    weeksHint: 'Casuals aren’t paid for weeks off — many work 44–48 weeks, not 52.',
    hecsLbl: 'I have a HECS-HELP debt',
    mlLbl: 'Include Medicare levy (2%)',
    psTitle: 'Casual pay summary',
    weekLbl: 'Typical week (gross)',
    perYr: 'per year gross ≈',
    lGross: 'Annual gross income',
    lTax: 'Income tax',
    lLito: 'Low income tax offset',
    lMl: 'Medicare levy',
    lHecs: 'HECS-HELP repayment',
    lNet: 'Take-home per year',
    netWeek: 'Take-home per working week',
    effHour: 'Effective hourly after tax',
  },
  vi: {
    inTitle: 'Việc casual của bạn',
    rateLbl: 'Lương giờ casual (đã gồm loading)',
    rateHint: 'Mức trên payslip — casual loading (thường 25%) đã cộng sẵn.',
    ordLbl: 'Giờ thường mỗi tuần (T2–T6)',
    satLbl: 'Giờ thứ Bảy / tuần',
    sunLbl: 'Giờ Chủ nhật / tuần',
    phLbl: 'Giờ ngày lễ / năm',
    multLbl: '× lương',
    multHint: 'Hệ số penalty tùy award — kiểm tra award của bạn trên fairwork.gov.au. Mức casual phổ biến: T7 ×1.5, CN ×1.75, ngày lễ ×2.5.',
    weeksLbl: 'Số tuần làm mỗi năm',
    weeksHint: 'Casual nghỉ tuần nào mất lương tuần đó — nhiều người làm 44–48 tuần, không phải 52.',
    hecsLbl: 'Tôi đang có nợ HECS-HELP',
    mlLbl: 'Tính Medicare levy (2%)',
    psTitle: 'Tổng kết lương casual',
    weekLbl: 'Một tuần điển hình (trước thuế)',
    perYr: 'mỗi năm trước thuế ≈',
    lGross: 'Tổng thu nhập năm',
    lTax: 'Thuế thu nhập',
    lLito: 'Giảm trừ LITO',
    lMl: 'Medicare levy',
    lHecs: 'Trả nợ HECS-HELP',
    lNet: 'Thực nhận mỗi năm',
    netWeek: 'Thực nhận mỗi tuần làm',
    effHour: 'Lương giờ thực sau thuế',
  },
};

const fmt = (n) => '$' + Math.round(n).toLocaleString('en-AU');
const fmt2 = (n) => '$' + n.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const num = (s) => parseFloat(String(s).replace(/[^0-9.]/g, '')) || 0;

function SmallField({ id, label, value, onChange, symbol }) {
  return (
    <div className="field" style={{ marginBottom: 0 }}>
      <label htmlFor={id} style={{ fontSize: '.78rem' }}>{label}</label>
      <div className="money-input">
        {symbol && <span>{symbol}</span>}
        <input
          type="text" id={id} inputMode="decimal" autoComplete="off" value={value} onChange={onChange}
          style={symbol ? {} : { paddingLeft: '.9rem' }}
        />
      </div>
    </div>
  );
}

export default function CasualPayCalculator({ lang = 'en' }) {
  const t = STRINGS[lang];
  const [rate, setRate] = useState('32');
  const [ord, setOrd] = useState('20');
  const [sat, setSat] = useState('0');
  const [satX, setSatX] = useState('1.5');
  const [sun, setSun] = useState('0');
  const [sunX, setSunX] = useState('1.75');
  const [ph, setPh] = useState('0');
  const [phX, setPhX] = useState('2.5');
  const [weeks, setWeeks] = useState('48');
  const [withHecs, setWithHecs] = useState(false);
  const [withMl, setWithMl] = useState(true);

  const r = num(rate);
  const w = Math.min(Math.max(num(weeks) || 48, 1), 52);
  const weekly = r * num(ord) + r * num(sat) * (num(satX) || 1) + r * num(sun) * (num(sunX) || 1);
  const annual = weekly * w + r * num(ph) * (num(phX) || 1);

  const grossTax = incomeTax(annual);
  const off = Math.min(lito(annual), grossTax);
  const tax = grossTax - off;
  const ml = withMl ? medicare(annual) : 0;
  const hc = withHecs ? hecs(annual) : 0;
  const net = annual - tax - ml - hc;
  const totalHours = (num(ord) + num(sat) + num(sun)) * w + num(ph);

  const on = (set) => (e) => set(e.target.value.replace(/[^0-9.]/g, ''));

  return (
    <div className="grid">
      <div className="card">
        <h2>{t.inTitle}</h2>

        <div className="field">
          <label htmlFor="c-rate">{t.rateLbl}</label>
          <div className="money-input">
            <span>$</span>
            <input type="text" id="c-rate" inputMode="decimal" autoComplete="off" value={rate} onChange={on(setRate)} />
          </div>
          <div className="hint">{t.rateHint}</div>
        </div>

        <div className="field">
          <label htmlFor="c-ord">{t.ordLbl}</label>
          <div className="money-input">
            <span>⏱</span>
            <input type="text" id="c-ord" inputMode="decimal" autoComplete="off" value={ord} onChange={on(setOrd)} />
          </div>
        </div>

        <div className="grid" style={{ gap: '.7rem', gridTemplateColumns: '1.4fr 1fr', marginBottom: '1.1rem' }}>
          <SmallField id="c-sat" label={t.satLbl} value={sat} onChange={on(setSat)} symbol="⏱" />
          <SmallField id="c-satx" label={t.multLbl} value={satX} onChange={on(setSatX)} symbol="×" />
          <SmallField id="c-sun" label={t.sunLbl} value={sun} onChange={on(setSun)} symbol="⏱" />
          <SmallField id="c-sunx" label={t.multLbl} value={sunX} onChange={on(setSunX)} symbol="×" />
          <SmallField id="c-ph" label={t.phLbl} value={ph} onChange={on(setPh)} symbol="⏱" />
          <SmallField id="c-phx" label={t.multLbl} value={phX} onChange={on(setPhX)} symbol="×" />
        </div>
        <div className="hint" style={{ marginTop: '-.5rem', marginBottom: '1.1rem' }}>{t.multHint}</div>

        <div className="field">
          <label htmlFor="c-weeks">{t.weeksLbl}</label>
          <div className="money-input">
            <span>📅</span>
            <input type="text" id="c-weeks" inputMode="numeric" autoComplete="off" value={weeks} onChange={on(setWeeks)} />
          </div>
          <div className="hint">{t.weeksHint}</div>
        </div>

        <div className="field">
          <label className="check" htmlFor="c-hecs">
            <input type="checkbox" id="c-hecs" checked={withHecs} onChange={(e) => setWithHecs(e.target.checked)} />
            <div><div className="t">{t.hecsLbl}</div></div>
          </label>
        </div>
        <div className="field">
          <label className="check" htmlFor="c-ml">
            <input type="checkbox" id="c-ml" checked={withMl} onChange={(e) => setWithMl(e.target.checked)} />
            <div><div className="t">{t.mlLbl}</div></div>
          </label>
        </div>
      </div>

      <div className="payslip" aria-live="polite">
        <div className="payslip-head">
          <span className="lbl">{t.psTitle}</span>
          <span className="fy">FY {FY}</span>
        </div>

        <div className="takehome">
          <div className="lbl">{t.weekLbl}</div>
          <div className="big">{fmt(weekly)}</div>
          <div className="per">{t.perYr} {fmt(annual)}</div>
        </div>

        <div className="lines" style={{ borderBottom: '1px dashed var(--line)' }}>
          <div className="line gross"><span className="k">{t.lGross}</span><span className="v">{fmt(annual)}</span></div>
          <div className="line minus"><span className="k">{t.lTax}</span><span className="v">−{fmt(tax)}</span></div>
          {withMl && <div className="line minus"><span className="k">{t.lMl}</span><span className="v">−{fmt(ml)}</span></div>}
          {withHecs && <div className="line minus"><span className="k">{t.lHecs}</span><span className="v">−{fmt(hc)}</span></div>}
          <div className="line total"><span className="k">{t.lNet}</span><span className="v">{fmt(net)}</span></div>
        </div>

        <div className="rate-strip">
          <div>
            <div className="n">{fmt(w > 0 ? net / w : 0)}</div>
            <div className="l">{t.netWeek}</div>
          </div>
          <div>
            <div className="n">{totalHours > 0 ? fmt2(net / totalHours) : '$0.00'}</div>
            <div className="l">{t.effHour}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
