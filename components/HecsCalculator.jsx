'use client';

import { useState } from 'react';
import { FY, hecs, simulateHecs, HECS } from '../lib/tax';

const STRINGS = {
  en: {
    inTitle: 'Your details',
    incomeLbl: 'Repayment income (per year)',
    incomeHint: 'Roughly your taxable income, plus add-backs like salary-sacrificed super and reportable fringe benefits.',
    debtLbl: 'Current HELP debt balance',
    debtHint: 'Check your exact balance in the ATO app or myGov.',
    volLbl: 'Extra voluntary repayment (per year)',
    volHint: 'Optional — see how paying extra changes your payoff time.',
    idxLbl: 'Assumed indexation rate (%/yr)',
    growthLbl: 'Assumed income growth (%/yr)',
    psTitle: 'Your HECS outlook',
    compLbl: 'Compulsory repayment this year',
    perFort: 'per fortnight, withheld from pay ≈',
    payoffLbl: 'Time to pay off',
    payoffYears: (n) => `${n} year${n === 1 ? '' : 's'}`,
    never: 'Not repaid within 50 years',
    neverHint: 'Income stays under the repayment threshold — the debt only moves with indexation.',
    idxPaid: 'Total indexation added over that time',
    withVol: 'With your extra repayments',
    savedYears: (n) => `${n} year${n === 1 ? '' : 's'} sooner`,
    savedIdx: 'indexation saved',
    belowThr: `Below the ${'$' + HECS.threshold.toLocaleString('en-AU')} threshold — no compulsory repayment this year.`,
  },
  vi: {
    inTitle: 'Thông tin của bạn',
    incomeLbl: 'Repayment income (mỗi năm)',
    incomeHint: 'Xấp xỉ thu nhập chịu thuế, cộng các khoản như super đóng qua salary sacrifice, fringe benefits.',
    debtLbl: 'Dư nợ HELP hiện tại',
    debtHint: 'Xem số dư chính xác trong app ATO hoặc myGov.',
    volLbl: 'Trả thêm tự nguyện (mỗi năm)',
    volHint: 'Không bắt buộc — xem trả thêm rút ngắn thời gian bao nhiêu.',
    idxLbl: 'Giả định indexation (%/năm)',
    growthLbl: 'Giả định tăng lương (%/năm)',
    psTitle: 'Bức tranh nợ HECS của bạn',
    compLbl: 'Khoản trả bắt buộc năm nay',
    perFort: 'mỗi 2 tuần, trừ qua lương ≈',
    payoffLbl: 'Thời gian trả hết nợ',
    payoffYears: (n) => `${n} năm`,
    never: 'Không trả hết trong 50 năm',
    neverHint: 'Thu nhập dưới ngưỡng trả nợ — dư nợ chỉ tăng theo indexation.',
    idxPaid: 'Tổng indexation cộng thêm trong thời gian đó',
    withVol: 'Nếu trả thêm như bạn nhập',
    savedYears: (n) => `sớm hơn ${n} năm`,
    savedIdx: 'indexation tiết kiệm được',
    belowThr: `Dưới ngưỡng ${'$' + HECS.threshold.toLocaleString('en-AU')} — năm nay chưa phải trả bắt buộc.`,
  },
};

const fmt = (n) => '$' + Math.round(n).toLocaleString('en-AU');
const num = (s) => parseFloat(String(s).replace(/[^0-9.]/g, '')) || 0;

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
  const [vol, setVol] = useState('');
  const [idx, setIdx] = useState('3.0');
  const [growth, setGrowth] = useState('3.0');

  const y = num(income);
  const d = num(debt);
  const v = num(vol);
  const idxR = Math.min(Math.max(num(idx), 0), 15) / 100;
  const gR = Math.min(Math.max(num(growth), 0), 15) / 100;

  const comp = hecs(y);
  const base = simulateHecs(d, y, { idx: idxR, growth: gR });
  const withVol = v > 0 ? simulateHecs(d, y, { idx: idxR, growth: gR, voluntary: v }) : null;

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
        <MoneyField id="h-vol" label={t.volLbl} hint={t.volHint} value={vol} onChange={onMoney(setVol)} />
        <div className="grid" style={{ gap: '0.9rem', gridTemplateColumns: '1fr 1fr' }}>
          <MoneyField id="h-idx" label={t.idxLbl} symbol="%" value={idx} onChange={(e) => setIdx(e.target.value.replace(/[^0-9.]/g, ''))} />
          <MoneyField id="h-growth" label={t.growthLbl} symbol="%" value={growth} onChange={(e) => setGrowth(e.target.value.replace(/[^0-9.]/g, ''))} />
        </div>
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

        <div className="lines" style={{ borderBottom: '1px dashed var(--line)' }}>
          <div className="line gross">
            <span className="k">{t.payoffLbl}</span>
            <span className="v">{base.repaid ? t.payoffYears(base.years) : t.never}</span>
          </div>
          {base.repaid ? (
            <div className="line minus">
              <span className="k">{t.idxPaid}</span>
              <span className="v">−{fmt(base.totalIndexation)}</span>
            </div>
          ) : (
            <div className="line">
              <span className="k" style={{ fontSize: '.8rem' }}>{t.neverHint}</span>
              <span className="v"></span>
            </div>
          )}
        </div>

        {withVol && withVol.repaid && (
          <div className="lines">
            <div className="line gross">
              <span className="k">{t.withVol}</span>
              <span className="v" style={{ color: 'var(--green)' }}>
                {t.payoffYears(withVol.years)}
                {base.repaid && base.years > withVol.years ? ` · ${t.savedYears(base.years - withVol.years)}` : ''}
              </span>
            </div>
            {base.repaid && (
              <div className="line plus">
                <span className="k">{t.savedIdx}</span>
                <span className="v">+{fmt(Math.max(base.totalIndexation - withVol.totalIndexation, 0))}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
