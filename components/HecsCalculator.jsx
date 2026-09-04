'use client';

import { useMemo, useState } from 'react';
import { FY, hecs, HECS } from '../lib/tax';
import { hecsVoluntaryOutcome, WEEKLY_EXTRA_MAX } from '../lib/hecsPlan';
import SaveConfig from './SaveConfig';
import EtfCtaSlot from './EtfCtaSlot';

const STRINGS = {
  en: {
    inTitle: 'Your details',
    incomeLbl: 'Repayment income (per year)',
    incomeHint: 'Roughly your taxable income, plus add-backs like salary-sacrificed super and reportable fringe benefits.',
    debtLbl: 'Current HELP debt balance',
    debtHint: 'Check your exact balance in the ATO app or myGov.',
    sliderLbl: 'Extra voluntary repayment (per week)',
    sliderHint: 'Drag to see how paying extra each week changes your payoff — updates instantly.',
    perWeek: '/week',
    perYear: 'a year',
    idxLbl: 'Assumed indexation rate (%/yr)',
    growthLbl: 'Assumed income growth (%/yr)',
    psTitle: 'Your HECS outlook',
    compLbl: 'Compulsory repayment this year',
    perFort: 'per fortnight, withheld from pay ≈',
    payoffLbl: 'Time to pay off',
    payoffBase: 'At the compulsory rate only',
    payoffBoosted: 'With your extra repayments',
    payoffYears: (n) => `${n} year${n === 1 ? '' : 's'}`,
    never: 'Not repaid within 50 years',
    neverHint: 'Income stays under the repayment threshold — the debt only moves with indexation.',
    yearsSaved: 'Years saved',
    idxAvoided: 'Indexation avoided',
    nowRepays: (n) => `Extra repayments clear the debt in ${n} year${n === 1 ? '' : 's'} — the compulsory rate alone never does.`,
    dragMore: 'Drag the slider above $0 to model extra repayments.',
    belowThr: `Below the ${'$' + HECS.threshold.toLocaleString('en-AU')} threshold — no compulsory repayment this year.`,
  },
  vi: {
    inTitle: 'Thông tin của bạn',
    incomeLbl: 'Repayment income (mỗi năm)',
    incomeHint: 'Xấp xỉ thu nhập chịu thuế, cộng các khoản như super đóng qua salary sacrifice, fringe benefits.',
    debtLbl: 'Dư nợ HELP hiện tại',
    debtHint: 'Xem số dư chính xác trong app ATO hoặc myGov.',
    sliderLbl: 'Số tiền trả thêm mỗi tuần (Tự nguyện)',
    sliderHint: 'Kéo thanh trượt để xem trả thêm mỗi tuần rút ngắn thời gian thế nào — cập nhật ngay lập tức.',
    perWeek: '/tuần',
    perYear: 'mỗi năm',
    idxLbl: 'Giả định indexation (%/năm)',
    growthLbl: 'Giả định tăng lương (%/năm)',
    psTitle: 'Bức tranh nợ HECS của bạn',
    compLbl: 'Khoản trả bắt buộc năm nay',
    perFort: 'mỗi 2 tuần, trừ qua lương ≈',
    payoffLbl: 'Thời gian trả hết nợ',
    payoffBase: 'Chỉ trả theo mức bắt buộc',
    payoffBoosted: 'Khi trả thêm như bạn nhập',
    payoffYears: (n) => `${n} năm`,
    never: 'Không trả hết trong 50 năm',
    neverHint: 'Thu nhập dưới ngưỡng trả nợ — dư nợ chỉ tăng theo indexation.',
    yearsSaved: 'Số năm tiết kiệm được',
    idxAvoided: 'Indexation tránh được',
    nowRepays: (n) => `Trả thêm giúp trả hết nợ trong ${n} năm — chỉ mức bắt buộc thì không bao giờ hết.`,
    dragMore: 'Kéo thanh trượt lên trên $0 để mô phỏng việc trả thêm.',
    belowThr: `Dưới ngưỡng ${'$' + HECS.threshold.toLocaleString('en-AU')} — năm nay chưa phải trả bắt buộc.`,
  },
};

const fmt = (n) => '$' + Math.round(n).toLocaleString('en-AU');
const num = (s) => parseFloat(String(s).replace(/[^0-9.]/g, '')) || 0;
const clampPct = (n) => Math.min(Math.max(n, 0), 15);

function MoneyField({ id, label, hint, value, onChange, symbol = '$' }) {
  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      <div className="money-input">
        <span>{symbol}</span>
        <input type="text" id={id} inputMode="decimal" autoComplete="off" value={value} onChange={onChange} />
      </div>
      {hint && <div className="hint">{hint}</div>}
    </div>
  );
}

export default function HecsCalculator({ lang = 'en' }) {
  const t = STRINGS[lang];
  const [income, setIncome] = useState('85,000');
  const [debt, setDebt] = useState('30,000');
  const [weeklyExtra, setWeeklyExtra] = useState(0);
  const [idx, setIdx] = useState('3.0');
  const [growth, setGrowth] = useState('3.0');

  const y = num(income);
  const d = num(debt);
  const idxR = clampPct(num(idx)) / 100;
  const gR = clampPct(num(growth)) / 100;

  const comp = hecs(y);

  // pure, memoised — cheap enough to run on every slider frame
  const outcome = useMemo(
    () => hecsVoluntaryOutcome({ debt: d, income: y, weeklyExtra, idx: idxR, growth: gR }),
    [d, y, weeklyExtra, idxR, gR],
  );
  const { base, boosted, yearsSaved, indexationAvoided, nowRepays, monthlyExtra, annualExtra } = outcome;

  // timeline bar widths (0–100%), relative to the longer of the two payoffs
  const scale = Math.max(base.repaid ? base.years : 50, boosted.repaid ? boosted.years : 50, 1);
  const baseW = ((base.repaid ? base.years : 50) / scale) * 100;
  const boostW = ((boosted.repaid ? boosted.years : 50) / scale) * 100;

  const sliderPct = (weeklyExtra / WEEKLY_EXTRA_MAX) * 100;

  const onMoney = (set) => (e) => {
    const n = num(e.target.value);
    set(n ? n.toLocaleString('en-AU') : '');
  };

  return (
    <div className="grid">
      <div className="card">
        <h2>{t.inTitle}</h2>
        <MoneyField id="h-income" label={t.incomeLbl} hint={t.incomeHint} value={income} onChange={onMoney(setIncome)} />
        <MoneyField id="h-debt" label={t.debtLbl} hint={t.debtHint} value={debt} onChange={onMoney(setDebt)} />

        <div className="field">
          <label htmlFor="h-extra">{t.sliderLbl}</label>
          <div className="slider-head">
            <span className="slider-value">
              {fmt(weeklyExtra)}
              <span className="slider-unit"> {t.perWeek}</span>
            </span>
            <span className="slider-sub">
              {weeklyExtra > 0 ? `${fmt(annualExtra)} ${t.perYear}` : '—'}
            </span>
          </div>
          <input
            className="range"
            type="range"
            id="h-extra"
            min={0}
            max={WEEKLY_EXTRA_MAX}
            step={5}
            value={weeklyExtra}
            onChange={(e) => setWeeklyExtra(Number(e.target.value))}
            style={{ '--pct': sliderPct + '%' }}
            aria-valuetext={`${fmt(weeklyExtra)} ${t.perWeek}`}
          />
          <div className="slider-scale" aria-hidden="true">
            <span>$0</span>
            <span>${WEEKLY_EXTRA_MAX / 2}</span>
            <span>${WEEKLY_EXTRA_MAX}</span>
          </div>
          <div className="hint">{t.sliderHint}</div>
        </div>

        <div className="grid" style={{ gap: '0.9rem', gridTemplateColumns: '1fr 1fr' }}>
          <MoneyField id="h-idx" label={t.idxLbl} symbol="%" value={idx} onChange={(e) => setIdx(e.target.value.replace(/[^0-9.]/g, ''))} />
          <MoneyField id="h-growth" label={t.growthLbl} symbol="%" value={growth} onChange={(e) => setGrowth(e.target.value.replace(/[^0-9.]/g, ''))} />
        </div>

        <SaveConfig
          tool="hecs"
          lang={lang}
          getInputs={() => ({ income, debt, weeklyExtra: String(weeklyExtra), idx, growth })}
          summarise={(i) => `$${i.debt} debt · $${i.income}/yr${Number(i.weeklyExtra) > 0 ? ' · +$' + i.weeklyExtra + '/wk' : ''}`}
          suggestName={() => `HECS · $${debt}`}
          onRestore={(i) => {
            if (i.income != null) setIncome(String(i.income));
            if (i.debt != null) setDebt(String(i.debt));
            if (i.weeklyExtra != null) setWeeklyExtra(Number(String(i.weeklyExtra).replace(/[^0-9.]/g, '')) || 0);
            else if (i.vol != null) setWeeklyExtra(Math.round((num(i.vol) / 52) / 5) * 5); // di sản: vol theo năm
            if (i.idx != null) setIdx(String(i.idx));
            if (i.growth != null) setGrowth(String(i.growth));
          }}
        />
      </div>

      <div className="payslip" aria-live="polite">
        <div className="payslip-head">
          <span className="lbl">{t.psTitle}</span>
          <span className="fy">FY {FY}</span>
        </div>

        <div className="takehome">
          <div className="lbl">{t.compLbl}</div>
          <div className="big" style={{ color: comp > 0 ? 'var(--danger)' : 'var(--green)' }}>
            {comp > 0 ? '−' + fmt(comp) : '$0'}
          </div>
          <div className="per">{comp > 0 ? `${t.perFort} ${fmt(comp / 26)}` : t.belowThr}</div>
        </div>

        {/* payoff timeline — smooth width transitions on change */}
        <div className="lines" style={{ borderBottom: '1px dashed var(--line)' }}>
          <div className="hecs-track">
            <div className="hecs-track-row">
              <span className="hecs-track-lbl">{t.payoffBase}</span>
              <span className="hecs-track-val">{base.repaid ? t.payoffYears(base.years) : t.never}</span>
            </div>
            <div className="hecs-bar-rail">
              <div className="hecs-bar hecs-bar-base" style={{ width: baseW + '%' }} />
            </div>
          </div>

          <div className="hecs-track">
            <div className="hecs-track-row">
              <span className="hecs-track-lbl">{t.payoffBoosted}</span>
              <span className="hecs-track-val" style={{ color: weeklyExtra > 0 ? 'var(--green)' : 'var(--muted)' }}>
                {boosted.repaid ? t.payoffYears(boosted.years) : t.never}
              </span>
            </div>
            <div className="hecs-bar-rail">
              <div className="hecs-bar hecs-bar-boost" style={{ width: boostW + '%' }} />
            </div>
          </div>
        </div>

        <div className="rate-strip">
          <div>
            <div className="n" style={{ color: yearsSaved > 0 ? 'var(--green)' : 'var(--ink)' }}>
              {yearsSaved > 0 ? '−' + t.payoffYears(yearsSaved) : '—'}
            </div>
            <div className="l">{t.yearsSaved}</div>
          </div>
          <div>
            <div className="n" style={{ color: indexationAvoided > 0 ? 'var(--green)' : 'var(--ink)' }}>
              {indexationAvoided > 0 ? '+' + fmt(indexationAvoided) : '—'}
            </div>
            <div className="l">{t.idxAvoided}</div>
          </div>
        </div>

        {weeklyExtra === 0 && <div className="lines"><div className="line"><span className="k" style={{ fontSize: '.82rem' }}>{t.dragMore}</span></div></div>}
        {nowRepays && (
          <div className="lines">
            <div className="line plus">
              <span className="k" style={{ fontSize: '.82rem' }}>{t.nowRepays(boosted.years)}</span>
            </div>
          </div>
        )}
        {!base.repaid && !nowRepays && weeklyExtra > 0 && (
          <div className="lines"><div className="line"><span className="k" style={{ fontSize: '.82rem' }}>{t.neverHint}</span></div></div>
        )}

        <EtfCtaSlot monthly={weeklyExtra > 0 ? monthlyExtra : 0} lang={lang} />
      </div>
    </div>
  );
}
