'use client';

import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { FY } from '../lib/tax';
import { computePay, comparePay, clamp, DIVISORS } from '../lib/pay';
import { readShareParam, decodeShareState } from '../lib/shareLink';
import SaveShareBar from './SaveShareBar';
import ShareButton from './ShareButton';
import PayCompareChart from './PayCompareChart';

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
    // compare mode
    compareOn: '⚖️ Compare with another job',
    compareOff: '← Back to a single job',
    job1: 'Job 1',
    job2: 'Job 2',
    cmpTitle: 'Job 1 vs Job 2',
    viewLbl: 'Show per',
    views: { year: 'Year', month: 'Month', week: 'Week' },
    catTax: 'Income tax',
    catHecs: 'HECS-HELP',
    catNet: 'Take-home',
    deltaTitle: 'Job 2 vs Job 1',
    deltaSame: 'No difference',
    netHeadline: 'Take-home',
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
    // compare mode
    compareOn: '⚖️ So sánh với Job khác',
    compareOff: '← Về chế độ một job',
    job1: 'Job 1',
    job2: 'Job 2',
    cmpTitle: 'Job 1 vs Job 2',
    viewLbl: 'Xem theo',
    views: { year: 'Năm', month: 'Tháng', week: 'Tuần' },
    catTax: 'Thuế thu nhập',
    catHecs: 'HECS-HELP',
    catNet: 'Thực nhận',
    deltaTitle: 'Job 2 so với Job 1',
    deltaSame: 'Không chênh lệch',
    netHeadline: 'Thực nhận',
  },
};

const fmt = (n) => '$' + Math.round(n).toLocaleString('en-AU');
const fmt2 = (n) => '$' + n.toLocaleString('en-AU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const cleanNum = (s) => String(s).replace(/[^0-9.]/g, '');
const toCalcInput = (j) => ({
  amount: parseFloat(cleanNum(j.raw)) || 0,
  period: j.period,
  hoursPerWeek: clamp(parseFloat(j.hours) || 38, 1, 100),
  withHecs: j.withHecs,
  withMedicare: j.withMl,
});

const DEFAULT_1 = { raw: '40', period: 'hour', hours: '38', withHecs: false, withMl: true };
const DEFAULT_2 = { raw: '48', period: 'hour', hours: '38', withHecs: true, withMl: true };

/* ---- input column (memoised so editing one job doesn't re-render the other) ---- */
const PayInputs = memo(function PayInputs({ idp, title, t, values, onField }) {
  return (
    <div className="card pay-col">
      <h2>{title}</h2>

      <div className="field">
        <label htmlFor={`${idp}-amount`}>{t.amountLbl}</label>
        <div className="money-input">
          <span>$</span>
          <input
            type="text"
            id={`${idp}-amount`}
            inputMode="decimal"
            autoComplete="off"
            value={values.raw}
            onChange={(e) => onField('raw', cleanNum(e.target.value))}
          />
        </div>
      </div>

      <div className="field">
        <label htmlFor={`${idp}-period`}>{t.periodLbl}</label>
        <select id={`${idp}-period`} value={values.period} onChange={(e) => onField('period', e.target.value)}>
          {Object.entries(t.periods).map(([k, v]) => (
            <option key={k} value={k}>
              {v}
            </option>
          ))}
        </select>
      </div>

      {values.period === 'hour' && (
        <div className="field">
          <label htmlFor={`${idp}-hours`}>{t.hoursLbl}</label>
          <div className="money-input">
            <span>⏱</span>
            <input
              type="text"
              id={`${idp}-hours`}
              inputMode="decimal"
              autoComplete="off"
              value={values.hours}
              onChange={(e) => onField('hours', cleanNum(e.target.value))}
            />
          </div>
        </div>
      )}

      <div className="field">
        <label className="check" htmlFor={`${idp}-hecs`}>
          <input
            type="checkbox"
            id={`${idp}-hecs`}
            checked={values.withHecs}
            onChange={(e) => onField('withHecs', e.target.checked)}
          />
          <div>
            <div className="t">{t.hecsLbl}</div>
          </div>
        </label>
      </div>

      <div className="field">
        <label className="check" htmlFor={`${idp}-ml`}>
          <input
            type="checkbox"
            id={`${idp}-ml`}
            checked={values.withMl}
            onChange={(e) => onField('withMl', e.target.checked)}
          />
          <div>
            <div className="t">{t.mlLbl}</div>
          </div>
        </label>
      </div>
    </div>
  );
});

/* ---- compare view ---- */
function CompareView({ t, lang, job1, job2, setJob1, setJob2, setField1, setField2, view, setView }) {
  const cmp = useMemo(() => comparePay(toCalcInput(job1), toCalcInput(job2)), [job1, job2]);
  const div = DIVISORS[view];

  const chartData = useMemo(
    () => [
      { key: 'tax', job1: cmp.a.tax / div, job2: cmp.b.tax / div },
      { key: 'hecs', job1: cmp.a.hecs / div, job2: cmp.b.hecs / div },
      { key: 'net', job1: cmp.a.net / div, job2: cmp.b.net / div },
    ],
    [cmp, div],
  );

  const chartLabels = useMemo(
    () => ({ tax: t.catTax, hecs: t.catHecs, net: t.catNet }),
    [t],
  );

  const deltaRows = [
    { key: 'tax', label: t.catTax, goodWhenLower: true },
    { key: 'hecs', label: t.catHecs, goodWhenLower: true },
    { key: 'net', label: t.catNet, goodWhenLower: false },
  ];

  return (
    <div className="pay-compare">
      <div className="pay-compare-cols">
        <PayInputs idp="j1" title={t.job1} t={t} values={job1} onField={setField1} />
        <PayInputs idp="j2" title={t.job2} t={t} values={job2} onField={setField2} />
      </div>

      <div className="pay-compare-actions">
        <ShareButton
          tool="pay-compare"
          lang={lang}
          getState={() => ({ job1, job2, view })}
          onRestore={(d) => {
            if (d.job1 && typeof d.job1 === 'object') setJob1((j) => ({ ...j, ...d.job1 }));
            if (d.job2 && typeof d.job2 === 'object') setJob2((j) => ({ ...j, ...d.job2 }));
            if (d.view === 'year' || d.view === 'month' || d.view === 'week') setView(d.view);
          }}
        />
      </div>

      <div className="payslip cmp-panel" aria-live="polite">
        <div className="payslip-head">
          <span className="lbl">{t.cmpTitle}</span>
          <span className="fy">FY {FY}</span>
        </div>

        <div className="freq-row" role="group" aria-label={t.viewLbl}>
          {['year', 'month', 'week'].map((p) => (
            <button key={p} className={view === p ? 'active' : ''} onClick={() => setView(p)}>
              {t.views[p]}
            </button>
          ))}
        </div>

        <div className="cmp-summary">
          <div>
            <span className="cmp-summary-lbl">{t.job1} · {t.netHeadline}</span>
            <strong>{fmt(cmp.a.net / div)}</strong>
            <small>/ {t.views[view].toLowerCase()}</small>
          </div>
          <div>
            <span className="cmp-summary-lbl">{t.job2} · {t.netHeadline}</span>
            <strong className="j2">{fmt(cmp.b.net / div)}</strong>
            <small>/ {t.views[view].toLowerCase()}</small>
          </div>
        </div>

        <div className="cmp-chart-wrap">
          <PayCompareChart
            data={chartData}
            labels={chartLabels}
            job1Name={t.job1}
            job2Name={t.job2}
            fmt={fmt}
          />
        </div>

        <div className="lines cmp-deltas">
          <div className="line gross">
            <span className="k">{t.deltaTitle}</span>
            <span className="v" style={{ color: 'var(--muted)', fontWeight: 400 }}>
              / {t.views[view].toLowerCase()}
            </span>
          </div>
          {deltaRows.map(({ key, label, goodWhenLower }) => {
            const dv = cmp.delta[key] / div;
            const neutral = Math.abs(dv) < 0.5;
            const good = neutral ? null : goodWhenLower ? dv < 0 : dv > 0;
            const sign = dv > 0 ? '+' : dv < 0 ? '−' : '';
            return (
              <div className="line" key={key}>
                <span className="k">{label}</span>
                <span
                  className="v"
                  style={{ color: neutral ? 'var(--muted)' : good ? 'var(--green)' : 'var(--danger)' }}
                >
                  {neutral ? t.deltaSame : sign + fmt(Math.abs(dv))}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ---- single view (unchanged behaviour, now on the pure helper) ---- */
function SingleView({ t, lang, raw, setRaw, period, setPeriod, hours, setHours, withHecs, setWithHecs, withMl, setWithMl }) {
  const amount = parseFloat(cleanNum(raw)) || 0;
  const h = clamp(parseFloat(hours) || 38, 1, 100);

  const r = useMemo(
    () => computePay({ amount, period, hoursPerWeek: h, withHecs, withMedicare: withMl }),
    [amount, period, h, withHecs, withMl],
  );
  const { annual, tax, medicareLevy: ml, hecs: hc, net: netAnnual } = r;
  const divisors = { hour: h * 52, week: 52, fortnight: 26, month: 12, year: 1 };

  return (
    <div className="grid">
      <div className="card">
        <h2>{t.inTitle}</h2>

        <div className="field">
          <label htmlFor="pay-amount">{t.amountLbl}</label>
          <div className="money-input">
            <span>$</span>
            <input
              type="text"
              id="pay-amount"
              inputMode="decimal"
              autoComplete="off"
              value={raw}
              onChange={(e) => setRaw(cleanNum(e.target.value))}
            />
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
                onChange={(e) => setHours(cleanNum(e.target.value))}
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

        <SaveShareBar
          tool="pay"
          lang={lang}
          getInputs={() => ({ raw, period, hours, withHecs, withMl })}
          summarise={(i) => `${i.period === 'hour' ? '$' + i.raw + '/hr · ' + i.hours + 'h/wk' : '$' + i.raw + '/' + i.period}${i.withHecs ? ' · HECS' : ''}`}
          suggestName={() => `${lang === 'vi' ? 'Lương' : 'Pay'} · ${period === 'hour' ? '$' + raw + '/h' : '$' + raw + '/' + period}`}
          onRestore={(i) => {
            if (i.raw != null) setRaw(String(i.raw));
            if (i.period) setPeriod(i.period);
            if (i.hours != null) setHours(String(i.hours));
            if (i.withHecs != null) setWithHecs(!!i.withHecs);
            if (i.withMl != null) setWithMl(!!i.withMl);
          }}
        />
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

function sharedIsCompare() {
  if (typeof window === 'undefined') return false;
  try {
    const raw = readShareParam('data');
    return raw ? decodeShareState(raw)?.t === 'pay-compare' : false;
  } catch (e) {
    return false;
  }
}

export default function PayCalculator({ lang = 'en' }) {
  const t = STRINGS[lang];
  const [compare, setCompare] = useState(false);

  // Mở link chia sẻ chế độ so sánh -> bật compare (sau hydrate, tránh mismatch).
  useEffect(() => {
    if (sharedIsCompare()) setCompare(true);
  }, []);

  // single-mode state
  const [raw, setRaw] = useState('40');
  const [period, setPeriod] = useState('hour');
  const [hours, setHours] = useState('38');
  const [withHecs, setWithHecs] = useState(false);
  const [withMl, setWithMl] = useState(true);

  // compare-mode state
  const [job1, setJob1] = useState(DEFAULT_1);
  const [job2, setJob2] = useState(DEFAULT_2);
  const [view, setView] = useState('year');

  const setField1 = useCallback((k, v) => setJob1((j) => ({ ...j, [k]: v })), []);
  const setField2 = useCallback((k, v) => setJob2((j) => ({ ...j, [k]: v })), []);

  return (
    <>
      <div className="pay-mode-bar no-print">
        <button
          type="button"
          className={`btn-secondary pay-mode-btn${compare ? ' active' : ''}`}
          aria-pressed={compare}
          onClick={() => setCompare((c) => !c)}
        >
          {compare ? t.compareOff : t.compareOn}
        </button>
      </div>

      {compare ? (
        <CompareView
          t={t}
          lang={lang}
          job1={job1}
          job2={job2}
          setJob1={setJob1}
          setJob2={setJob2}
          setField1={setField1}
          setField2={setField2}
          view={view}
          setView={setView}
        />
      ) : (
        <SingleView
          t={t}
          lang={lang}
          raw={raw}
          setRaw={setRaw}
          period={period}
          setPeriod={setPeriod}
          hours={hours}
          setHours={setHours}
          withHecs={withHecs}
          setWithHecs={setWithHecs}
          withMl={withMl}
          setWithMl={setWithMl}
        />
      )}
    </>
  );
}
