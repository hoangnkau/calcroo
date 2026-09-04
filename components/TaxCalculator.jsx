'use client';

import { useCallback, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { FY } from '../lib/tax';
import { incomeAllocation } from '../lib/allocation';
import { buildIncomeExportModel } from '../lib/exportModel';
import SaveConfig from './SaveConfig';
import ChartBoundary from './ChartBoundary';
import ExportButtons from './ExportButtons';

const IncomeDonut = dynamic(() => import('./IncomeDonut'), {
  ssr: false,
  loading: () => <div className="donut-skeleton" aria-hidden="true" />,
});

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
    donutHeading: 'Where your package goes',
    donutCenter: 'Take-home',
    exportHeading: 'Export this breakdown',
    lGross: 'Gross income',
    lTax: 'Income tax',
    lLito: 'Low income tax offset (LITO)',
    lMl: 'Medicare levy',
    lHecs: 'HECS-HELP repayment',
    lNet: 'Take-home pay',
    effLbl: 'Effective tax rate',
    margLbl: 'Marginal tax rate',
    alloc: {
      net: 'Take-home',
      super: 'Superannuation',
      tax: 'Income tax',
      medicare: 'Medicare levy',
      hecs: 'HECS-HELP',
    },
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
    donutHeading: 'Gói thu nhập của bạn đi về đâu',
    donutCenter: 'Thực nhận',
    exportHeading: 'Xuất bảng phân tích này',
    lGross: 'Tổng thu nhập',
    lTax: 'Thuế thu nhập',
    lLito: 'Giảm trừ thu nhập thấp (LITO)',
    lMl: 'Medicare levy',
    lHecs: 'Trả nợ HECS-HELP',
    lNet: 'Lương thực nhận',
    effLbl: 'Thuế suất thực tế',
    margLbl: 'Thuế suất biên',
    alloc: {
      net: 'Thực nhận',
      super: 'Super (hưu trí)',
      tax: 'Thuế thu nhập',
      medicare: 'Medicare levy',
      hecs: 'HECS-HELP',
    },
  },
};

const fmt = (n) => '$' + Math.round(n).toLocaleString('en-AU');

/* Fallback khi Chart.js không tải được — vẫn cho người dùng đủ số liệu. */
function BreakdownLines({ t, f, alloc, withMl, withHecs }) {
  return (
    <div className="lines">
      <div className="line gross">
        <span className="k">{t.lGross}</span>
        <span className="v">{fmt(alloc.salary / f)}</span>
      </div>
      <div className="line minus">
        <span className="k">{t.lTax}</span>
        <span className="v">−{fmt(alloc.tax / f)}</span>
      </div>
      {alloc.offset > 0 && (
        <div className="line plus">
          <span className="k">{t.lLito}</span>
          <span className="v">+{fmt(alloc.offset / f)}</span>
        </div>
      )}
      {withMl && alloc.medicareLevy > 0 && (
        <div className="line minus">
          <span className="k">{t.lMl}</span>
          <span className="v">−{fmt(alloc.medicareLevy / f)}</span>
        </div>
      )}
      {withHecs && alloc.hecs > 0 && (
        <div className="line minus">
          <span className="k">{t.lHecs}</span>
          <span className="v">−{fmt(alloc.hecs / f)}</span>
        </div>
      )}
      <div className="line total">
        <span className="k">{t.lNet}</span>
        <span className="v">{fmt(alloc.net / f)}</span>
      </div>
    </div>
  );
}

export default function TaxCalculator({ lang = 'en' }) {
  const t = STRINGS[lang];
  const [raw, setRaw] = useState('90,000');
  const [withHecs, setWithHecs] = useState(false);
  const [withMl, setWithMl] = useState(true);
  const [freq, setFreq] = useState(1);

  const y = parseFloat(raw.replace(/[^0-9.]/g, '')) || 0;
  const f = freq;

  const alloc = useMemo(
    () => incomeAllocation({ salary: y, withHecs, withMedicare: withMl }),
    [y, withHecs, withMl],
  );

  const donutParts = useMemo(
    () => alloc.parts.map((p) => ({ key: p.key, value: p.value / f })),
    [alloc, f],
  );

  const effRate = y > 0 ? (((alloc.tax + alloc.medicareLevy) / y) * 100).toFixed(1) + '%' : '0%';

  const getModel = useCallback(
    () =>
      buildIncomeExportModel({
        alloc: incomeAllocation({ salary: y, withHecs, withMedicare: withMl }),
        withHecs,
        withMedicare: withMl,
        fyLabel: FY,
      }),
    [y, withHecs, withMl],
  );

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

        <SaveConfig
          tool="income-tax"
          lang={lang}
          getInputs={() => ({ raw, withHecs, withMl, freq })}
          summarise={(i) => `$${i.raw}/yr${i.withHecs ? ' · HECS' : ''}${i.withMl ? '' : ' · no ML'}`}
          suggestName={() => `${lang === 'vi' ? 'Thuế' : 'Tax'} · $${raw} · FY ${FY}`}
          onRestore={(i) => {
            if (i.raw != null) setRaw(String(i.raw));
            if (i.withHecs != null) setWithHecs(!!i.withHecs);
            if (i.withMl != null) setWithMl(!!i.withMl);
            if (i.freq != null) setFreq(Number(i.freq));
          }}
        />
      </div>

      <div className="payslip" aria-live="polite">
        <div className="payslip-head">
          <span className="lbl">{t.psTitle}</span>
          <span className="fy">FY {FY}</span>
        </div>

        <div className="takehome">
          <div className="lbl">{t.takeLbl}</div>
          <div className="big">{fmt(alloc.net / f)}</div>
          <div className="per">{t.perMap[f]}</div>
        </div>

        <div className="freq-row">
          {[1, 12, 26, 52].map((n) => (
            <button key={n} className={f === n ? 'active' : ''} onClick={() => setFreq(n)}>
              {t.freqs[n]}
            </button>
          ))}
        </div>

        <div className="donut-section">
          <div className="donut-heading">{t.donutHeading}</div>
          <ChartBoundary fallback={<BreakdownLines t={t} f={f} alloc={alloc} withMl={withMl} withHecs={withHecs} />}>
            <IncomeDonut
              parts={donutParts}
              labels={t.alloc}
              centerLabel={t.donutCenter}
              centerValue={fmt(alloc.net / f)}
              perLabel={t.perMap[f]}
            />
          </ChartBoundary>
        </div>

        <div className="rate-strip">
          <div>
            <div className="n">{effRate}</div>
            <div className="l">{t.effLbl}</div>
          </div>
          <div>
            <div className="n">{Math.round(alloc.marginalRate * 100)}%</div>
            <div className="l">{t.margLbl}</div>
          </div>
        </div>

        <div className="export-section">
          <div className="donut-heading">{t.exportHeading}</div>
          <ExportButtons getModel={getModel} lang={lang} />
        </div>
      </div>
    </div>
  );
}
