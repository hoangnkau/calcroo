'use client';

import { useState } from 'react';
import {
  FY_DATA, incomeTaxForMonths, litoFor, medicareFor, hecsFor, mlsFor, partYearThreshold, WFH_FIXED_RATE,
} from '../lib/tax';

const STRINGS = {
  en: {
    inTitle: 'Your tax return details',
    yearLbl: 'Income year',
    yearHint: 'Lodging now (July 2026)? That is your 2025-26 return. Pick 2026-27 to plan ahead.',
    incomeLbl: 'Total income (salary, interest, etc.)',
    incHint: 'Enter a total, or open the breakdown below to itemise.',
    incAutoHint: 'Auto-summed from your breakdown below.',
    incTitle: 'Itemise income',
    iSalary: 'Salary & wages — main job',
    iJob2: 'Second job / other salary',
    iInterest: 'Bank interest',
    iDiv: 'Dividends received',
    iFrank: 'Franking credits (from dividend statements)',
    iFrankHint: 'Grossed up into income, then refunded as a credit — often turns share income into extra refund.',
    iBiz: 'Business / side-gig net income (ABN)',
    iOtherInc: 'Other income (net rent, capital gains after discount, taxable Centrelink...)',
    incTotal: 'Income total',
    lFrank: 'Franking credits offset',
    dedLbl: 'Total deductions',
    dedHint: 'Enter a total, or open the breakdown below to itemise.',
    dedAutoHint: 'Auto-summed from your breakdown below.',
    itemTitle: 'Itemise deductions',
    wfhLbl: 'Working-from-home hours (whole year)',
    wfhRateLbl: 'c/hour',
    wfhHint: 'Fixed-rate method. Keep a record of hours (diary or roster). Check the current rate on ato.gov.au.',
    dCar: 'Work travel & car (not home-to-work)',
    dCloth: 'Uniforms, protective clothing & laundry',
    dTools: 'Tools, equipment & self-education',
    dGifts: 'Donations ($2+ to registered charities)',
    dAgent: 'Tax agent fee (paid last year)',
    dOther: 'Other deductions',
    itemTotal: 'Breakdown total',
    whLbl: 'Total tax withheld',
    whHint: 'From your income statement in myGov (ATO > Employment) or your final payslip.',
    hecsLbl: 'I have a HECS-HELP debt',
    advTitle: 'Advanced options',
    monthsLbl: 'Months as Australian resident this year',
    monthsFull: 'Full year (12 months)',
    monthsHint: 'Arrived (or left) partway through the year? Your tax-free threshold is reduced.',
    superLbl: 'Salary-sacrificed super (reportable)',
    superHint: 'Added back for HECS and surcharge income tests.',
    mlLbl: 'Medicare levy',
    mlFull: 'Standard (2%, with low-income reduction)',
    mlExempt: 'Fully exempt (e.g. visa not entitled to Medicare)',
    coverLbl: 'I had private hospital cover all year',
    coverHint: 'Without cover, higher incomes pay the Medicare levy surcharge (1-1.5%).',
    psTitle: 'Your estimate',
    refund: 'Estimated refund',
    owing: 'Estimated amount owing',
    even: 'About even',
    lTaxable: 'Taxable income',
    lThr: 'Tax-free threshold applied',
    lTax: 'Income tax (after offsets)',
    lMl: 'Medicare levy',
    lMls: 'Medicare levy surcharge',
    lHecs: 'HECS-HELP repayment',
    lLiab: 'Total tax assessed',
    lWh: 'Tax you already paid (withheld)',
    perK: 'Refund per extra $1,000 deductions',
    margLbl: 'Marginal tax rate',
  },
  vi: {
    inTitle: 'Thông tin khai thuế của bạn',
    yearLbl: 'Năm thu nhập',
    yearHint: 'Khai bây giờ (tháng 7/2026) tức là khai cho năm 2025-26. Chọn 2026-27 nếu muốn ước tính trước.',
    incomeLbl: 'Tổng thu nhập (lương, lãi bank...)',
    incHint: 'Nhập tổng, hoặc mở bảng bên dưới để tính chi tiết.',
    incAutoHint: 'Tự cộng từ bảng chi tiết bên dưới.',
    incTitle: 'Tính chi tiết thu nhập',
    iSalary: 'Lương — job chính',
    iJob2: 'Job thứ hai / lương khác',
    iInterest: 'Lãi ngân hàng',
    iDiv: 'Cổ tức nhận được',
    iFrank: 'Franking credits (trên dividend statement)',
    iFrankHint: 'Được cộng vào thu nhập rồi hoàn lại như một khoản credit — thường biến thu nhập cổ phiếu thành tiền hoàn thêm.',
    iBiz: 'Thu nhập ròng ABN / side gig',
    iOtherInc: 'Thu nhập khác (tiền thuê nhà ròng, capital gains sau discount, Centrelink chịu thuế...)',
    incTotal: 'Tổng thu nhập',
    lFrank: 'Hoàn franking credits',
    dedLbl: 'Tổng deductions (khoản khấu trừ)',
    dedHint: 'Nhập tổng, hoặc mở bảng bên dưới để tính chi tiết.',
    dedAutoHint: 'Tự cộng từ bảng chi tiết bên dưới.',
    itemTitle: 'Tính chi tiết deductions',
    wfhLbl: 'Số giờ làm việc tại nhà (cả năm)',
    wfhRateLbl: 'c/giờ',
    wfhHint: 'Phương pháp fixed-rate. Cần ghi lại số giờ (nhật ký, roster). Kiểm tra mức hiện hành trên ato.gov.au.',
    dCar: 'Đi lại công việc & xe (không tính nhà ↔ chỗ làm)',
    dCloth: 'Đồng phục, đồ bảo hộ & tiền giặt',
    dTools: 'Dụng cụ, thiết bị & học nâng cao tay nghề',
    dGifts: 'Từ thiện ($2+ cho tổ chức có đăng ký)',
    dAgent: 'Phí tax agent (trả năm ngoái)',
    dOther: 'Khoản khấu trừ khác',
    itemTotal: 'Tổng bảng chi tiết',
    whLbl: 'Tổng thuế đã bị trừ (tax withheld)',
    whHint: 'Xem income statement trong myGov (ATO > Employment) hoặc payslip cuối năm.',
    hecsLbl: 'Tôi đang có nợ HECS-HELP',
    advTitle: 'Tùy chọn nâng cao',
    monthsLbl: 'Số tháng là resident thuế trong năm',
    monthsFull: 'Cả năm (12 tháng)',
    monthsHint: 'Mới đến (hoặc rời) Úc giữa năm? Ngưỡng miễn thuế của bạn bị giảm theo tỷ lệ.',
    superLbl: 'Super đóng qua salary sacrifice',
    superHint: 'Bị cộng ngược khi tính HECS và surcharge.',
    mlLbl: 'Medicare levy',
    mlFull: 'Tiêu chuẩn (2%, tự giảm cho thu nhập thấp)',
    mlExempt: 'Miễn hoàn toàn (visa không thuộc diện Medicare)',
    coverLbl: 'Tôi có bảo hiểm bệnh viện tư cả năm',
    coverHint: 'Không có bảo hiểm, thu nhập cao phải đóng thêm Medicare levy surcharge (1-1.5%).',
    psTitle: 'Ước tính của bạn',
    refund: 'Dự kiến được hoàn',
    owing: 'Dự kiến phải đóng thêm',
    even: 'Xấp xỉ hòa',
    lTaxable: 'Thu nhập chịu thuế',
    lThr: 'Ngưỡng miễn thuế áp dụng',
    lTax: 'Thuế thu nhập (sau giảm trừ)',
    lMl: 'Medicare levy',
    lMls: 'Medicare levy surcharge',
    lHecs: 'Trả nợ HECS-HELP',
    lLiab: 'Tổng thuế phải nộp',
    lWh: 'Thuế đã nộp qua lương',
    perK: 'Hoàn thêm mỗi $1.000 deductions',
    margLbl: 'Thuế suất biên',
  },
};

const fmt = (n) => '$' + Math.round(Math.abs(n)).toLocaleString('en-AU');
const num = (s) => parseFloat(String(s).replace(/[^0-9.]/g, '')) || 0;

function MoneyRow({ id, label, value, onChange }) {
  return (
    <div className="field">
      <label htmlFor={id} style={{ fontSize: '.78rem' }}>{label}</label>
      <div className="money-input">
        <span>$</span>
        <input type="text" id={id} inputMode="numeric" autoComplete="off" value={value} onChange={onChange} />
      </div>
    </div>
  );
}

export default function TaxRefundCalculator({ lang = 'en' }) {
  const t = STRINGS[lang];
  const [fy, setFy] = useState('2025-26');
  const [income, setIncome] = useState('75,000');
  const [itemiseInc, setItemiseInc] = useState(false);
  const [iSalary, setISalary] = useState('75,000');
  const [iJob2, setIJob2] = useState('');
  const [iInterest, setIInterest] = useState('');
  const [iDiv, setIDiv] = useState('');
  const [iFrank, setIFrank] = useState('');
  const [iBiz, setIBiz] = useState('');
  const [iOtherInc, setIOtherInc] = useState('');
  const [dedTotal, setDedTotal] = useState('1,500');
  const [itemise, setItemise] = useState(false);
  const [wfhHours, setWfhHours] = useState('');
  const [wfhRate, setWfhRate] = useState(String(Math.round(WFH_FIXED_RATE * 100)));
  const [dCar, setDCar] = useState('');
  const [dCloth, setDCloth] = useState('');
  const [dTools, setDTools] = useState('');
  const [dGifts, setDGifts] = useState('');
  const [dAgent, setDAgent] = useState('');
  const [dOther, setDOther] = useState('');
  const [wh, setWh] = useState('16,000');
  const [withHecs, setWithHecs] = useState(false);
  const [months, setMonths] = useState(12);
  const [repSuper, setRepSuper] = useState('');
  const [mlMode, setMlMode] = useState('full');
  const [hasCover, setHasCover] = useState(false);

  const frankCr = itemiseInc ? num(iFrank) : 0;
  const incSum = num(iSalary) + num(iJob2) + num(iInterest) + num(iDiv) + frankCr + num(iBiz) + num(iOtherInc);
  const incomeVal = itemiseInc ? incSum : num(income);

  const wfhDed = num(wfhHours) * ((num(wfhRate) || 70) / 100);
  const itemSum = wfhDed + num(dCar) + num(dCloth) + num(dTools) + num(dGifts) + num(dAgent) + num(dOther);
  const ded = itemise ? itemSum : num(dedTotal);

  function liabilityAt(taxableY) {
    const gross = incomeTaxForMonths(taxableY, fy, months);
    const off = Math.min(litoFor(taxableY, fy), gross);
    const tax = gross - off;
    const ml = mlMode === 'exempt' ? 0 : medicareFor(taxableY, fy);
    const test = taxableY + num(repSuper);
    const hc = withHecs ? hecsFor(test, fy) : 0;
    const mls = hasCover || mlMode === 'exempt' ? 0 : mlsFor(test, fy);
    return { tax, ml, hc, mls, total: tax + ml + hc + mls };
  }

  const taxable = Math.max(incomeVal - ded, 0);
  const L = liabilityAt(taxable);
  const result = num(wh) + frankCr - L.total;
  const perK = L.total - liabilityAt(Math.max(taxable - 1000, 0)).total; // hoàn thêm chính xác cho $1.000 deduction kế tiếp

  const onMoney = (set) => (e) => {
    const n = num(e.target.value);
    set(n ? n.toLocaleString('en-AU') : '');
  };
  const onRaw = (set) => (e) => set(e.target.value.replace(/[^0-9.]/g, ''));

  const isRefund = result > 5;
  const isOwing = result < -5;
  const thr = partYearThreshold(months);

  return (
    <div className="grid">
      <div className="card">
        <h2>{t.inTitle}</h2>

        <div className="field">
          <label htmlFor="r-year">{t.yearLbl}</label>
          <select id="r-year" value={fy} onChange={(e) => setFy(e.target.value)}>
            {Object.entries(FY_DATA).map(([k, v]) => (
              <option key={k} value={k}>FY {v.label}</option>
            ))}
          </select>
          <div className="hint">{t.yearHint}</div>
        </div>

        <div className="field">
          <label htmlFor="r-income">{t.incomeLbl}</label>
          <div className="money-input">
            <span>$</span>
            <input
              type="text" id="r-income" inputMode="numeric" autoComplete="off"
              value={itemiseInc ? Math.round(incSum).toLocaleString('en-AU') : income}
              onChange={onMoney(setIncome)}
              readOnly={itemiseInc}
              style={itemiseInc ? { background: 'var(--green-soft)', borderColor: 'var(--green)' } : {}}
            />
          </div>
          <div className="hint">{itemiseInc ? t.incAutoHint : t.incHint}</div>
        </div>

        <details className="adv" onToggle={(e) => setItemiseInc(e.currentTarget.open)}>
          <summary>{t.incTitle}</summary>
          <MoneyRow id="r-isalary" label={t.iSalary} value={iSalary} onChange={onMoney(setISalary)} />
          <MoneyRow id="r-ijob2" label={t.iJob2} value={iJob2} onChange={onMoney(setIJob2)} />
          <MoneyRow id="r-iinterest" label={t.iInterest} value={iInterest} onChange={onMoney(setIInterest)} />
          <MoneyRow id="r-idiv" label={t.iDiv} value={iDiv} onChange={onMoney(setIDiv)} />
          <div className="field">
            <label htmlFor="r-ifrank" style={{ fontSize: '.78rem' }}>{t.iFrank}</label>
            <div className="money-input">
              <span>$</span>
              <input type="text" id="r-ifrank" inputMode="numeric" autoComplete="off" value={iFrank} onChange={onMoney(setIFrank)} />
            </div>
            <div className="hint">{t.iFrankHint}</div>
          </div>
          <MoneyRow id="r-ibiz" label={t.iBiz} value={iBiz} onChange={onMoney(setIBiz)} />
          <MoneyRow id="r-iotherinc" label={t.iOtherInc} value={iOtherInc} onChange={onMoney(setIOtherInc)} />
          <div className="hint" style={{ padding: '.6rem .9rem', border: '1.5px solid var(--green)', borderRadius: 9, color: 'var(--green)', fontWeight: 600 }}>
            {t.incTotal}: {fmt(incSum)}
          </div>
        </details>

        <div style={{ marginTop: '1.1rem' }} />

        <div className="field">
          <label htmlFor="r-ded">{t.dedLbl}</label>
          <div className="money-input">
            <span>$</span>
            <input
              type="text" id="r-ded" inputMode="numeric" autoComplete="off"
              value={itemise ? Math.round(itemSum).toLocaleString('en-AU') : dedTotal}
              onChange={onMoney(setDedTotal)}
              readOnly={itemise}
              style={itemise ? { background: 'var(--green-soft)', borderColor: 'var(--green)' } : {}}
            />
          </div>
          <div className="hint">{itemise ? t.dedAutoHint : t.dedHint}</div>
        </div>

        <details className="adv" onToggle={(e) => setItemise(e.currentTarget.open)}>
          <summary>{t.itemTitle}</summary>

          <div className="field">
            <label htmlFor="r-wfh" style={{ fontSize: '.78rem' }}>{t.wfhLbl}</label>
            <div className="grid" style={{ gap: '.6rem', gridTemplateColumns: '1.6fr 1fr' }}>
              <div className="money-input">
                <span>⏱</span>
                <input type="text" id="r-wfh" inputMode="numeric" autoComplete="off" value={wfhHours} onChange={onRaw(setWfhHours)} />
              </div>
              <div className="money-input">
                <span>¢</span>
                <input type="text" aria-label={t.wfhRateLbl} inputMode="numeric" autoComplete="off" value={wfhRate} onChange={onRaw(setWfhRate)} />
              </div>
            </div>
            <div className="hint">{t.wfhHint} {num(wfhHours) > 0 && <strong>= {fmt(wfhDed)}</strong>}</div>
          </div>

          <MoneyRow id="r-dcar" label={t.dCar} value={dCar} onChange={onMoney(setDCar)} />
          <MoneyRow id="r-dcloth" label={t.dCloth} value={dCloth} onChange={onMoney(setDCloth)} />
          <MoneyRow id="r-dtools" label={t.dTools} value={dTools} onChange={onMoney(setDTools)} />
          <MoneyRow id="r-dgifts" label={t.dGifts} value={dGifts} onChange={onMoney(setDGifts)} />
          <MoneyRow id="r-dagent" label={t.dAgent} value={dAgent} onChange={onMoney(setDAgent)} />
          <MoneyRow id="r-dother" label={t.dOther} value={dOther} onChange={onMoney(setDOther)} />

          <div className="hint" style={{ padding: '.6rem .9rem', border: '1.5px solid var(--green)', borderRadius: 9, color: 'var(--green)', fontWeight: 600 }}>
            {t.itemTotal}: {fmt(itemSum)}
          </div>
        </details>

        <div className="field" style={{ marginTop: '1.1rem' }}>
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
            <div><div className="t">{t.hecsLbl}</div></div>
          </label>
        </div>

        <details className="adv">
          <summary>{t.advTitle}</summary>

          <div className="field">
            <label htmlFor="r-months">{t.monthsLbl}</label>
            <select id="r-months" value={months} onChange={(e) => setMonths(+e.target.value)}>
              <option value={12}>{t.monthsFull}</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
            <div className="hint">{t.monthsHint}</div>
          </div>

          <div className="field">
            <label htmlFor="r-super">{t.superLbl}</label>
            <div className="money-input">
              <span>$</span>
              <input type="text" id="r-super" inputMode="numeric" autoComplete="off" value={repSuper} onChange={onMoney(setRepSuper)} />
            </div>
            <div className="hint">{t.superHint}</div>
          </div>

          <div className="field">
            <label htmlFor="r-ml">{t.mlLbl}</label>
            <select id="r-ml" value={mlMode} onChange={(e) => setMlMode(e.target.value)}>
              <option value="full">{t.mlFull}</option>
              <option value="exempt">{t.mlExempt}</option>
            </select>
          </div>

          <div className="field" style={{ marginBottom: 0 }}>
            <label className="check" htmlFor="r-cover">
              <input type="checkbox" id="r-cover" checked={hasCover} onChange={(e) => setHasCover(e.target.checked)} />
              <div>
                <div className="t">{t.coverLbl}</div>
                <div className="s">{t.coverHint}</div>
              </div>
            </label>
          </div>
        </details>
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

        <div className="lines" style={{ borderBottom: '1px dashed var(--line)' }}>
          <div className="line gross"><span className="k">{t.lTaxable}</span><span className="v">{fmt(taxable)}</span></div>
          {months < 12 && (
            <div className="line"><span className="k">{t.lThr}</span><span className="v">{fmt(thr)}</span></div>
          )}
          <div className="line minus"><span className="k">{t.lTax}</span><span className="v">−{fmt(L.tax)}</span></div>
          {L.ml > 0 && <div className="line minus"><span className="k">{t.lMl}</span><span className="v">−{fmt(L.ml)}</span></div>}
          {L.mls > 0 && <div className="line minus"><span className="k">{t.lMls}</span><span className="v">−{fmt(L.mls)}</span></div>}
          {withHecs && <div className="line minus"><span className="k">{t.lHecs}</span><span className="v">−{fmt(L.hc)}</span></div>}
          <div className="line minus" style={{ borderTop: '1px solid var(--line)', marginTop: '.4rem', paddingTop: '.6rem' }}>
            <span className="k" style={{ fontWeight: 600, color: 'var(--ink)' }}>{t.lLiab}</span>
            <span className="v" style={{ fontWeight: 600 }}>−{fmt(L.total)}</span>
          </div>
          <div className="line plus"><span className="k">{t.lWh}</span><span className="v">+{fmt(num(wh))}</span></div>
          {frankCr > 0 && <div className="line plus"><span className="k">{t.lFrank}</span><span className="v">+{fmt(frankCr)}</span></div>}
          <div className="line total">
            <span className="k">{isRefund ? t.refund : isOwing ? t.owing : t.even}</span>
            <span className="v" style={{ color: isOwing ? 'var(--danger)' : 'var(--green)' }}>
              {isOwing ? '−' : ''}{fmt(result)}
            </span>
          </div>
        </div>

        <div className="rate-strip">
          <div>
            <div className="n" style={{ color: 'var(--green)' }}>+{fmt(perK)}</div>
            <div className="l">{t.perK}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
