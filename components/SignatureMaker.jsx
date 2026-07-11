'use client';

import { useEffect, useRef, useState } from 'react';

const STRINGS = {
  en: {
    inTitle: 'Draw your signature',
    hint: 'Use your finger on a phone, or mouse/trackpad on a computer. Nothing is uploaded — it never leaves your device.',
    penLbl: 'Pen',
    black: 'Black',
    blue: 'Blue',
    thin: 'Fine',
    med: 'Medium',
    thick: 'Bold',
    clear: 'Clear',
    dl: 'Download PNG (transparent)',
    psTitle: 'How to use it',
    tip1: 'Word / Google Docs: Insert → Image, place it over the signature line, shrink to fit.',
    tip2: 'PDF form apps (Adobe, Preview, phone editors): add image → select the PNG.',
    tip3: 'The background is transparent, so it sits cleanly on any document colour.',
    legal: 'For documents requiring a witnessed or “wet-ink” signature (some statutory declarations, wills), check the requirement first — an image may not be accepted.',
  },
  vi: {
    inTitle: 'Vẽ chữ ký của bạn',
    hint: 'Dùng ngón tay trên điện thoại, hoặc chuột/trackpad trên máy tính. Không upload đi đâu — chữ ký không rời máy bạn.',
    penLbl: 'Bút',
    black: 'Đen',
    blue: 'Xanh',
    thin: 'Mảnh',
    med: 'Vừa',
    thick: 'Đậm',
    clear: 'Xóa vẽ lại',
    dl: 'Tải PNG (nền trong suốt)',
    psTitle: 'Dùng như thế nào',
    tip1: 'Word / Google Docs: Insert → Image, đặt lên dòng ký, thu nhỏ cho vừa.',
    tip2: 'App điền PDF (Adobe, Preview, app điện thoại): thêm ảnh → chọn file PNG.',
    tip3: 'Nền trong suốt nên đặt lên giấy tờ màu gì cũng sạch sẽ.',
    legal: 'Giấy tờ yêu cầu ký tươi hoặc có người chứng kiến (một số statutory declaration, di chúc) — kiểm tra yêu cầu trước, ảnh chữ ký có thể không được chấp nhận.',
  },
};

export default function SignatureMaker({ lang = 'en' }) {
  const t = STRINGS[lang];
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const last = useRef(null);
  const [color, setColor] = useState('#111111');
  const [width, setWidth] = useState(3);
  const [hasInk, setHasInk] = useState(false);

  useEffect(() => {
    const c = canvasRef.current;
    const dpr = window.devicePixelRatio || 1;
    c.width = 800 * dpr;
    c.height = 300 * dpr;
    c.getContext('2d').scale(dpr, dpr);
  }, []);

  const pos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: ((e.clientX - rect.left) / rect.width) * 800, y: ((e.clientY - rect.top) / rect.height) * 300 };
  };

  const down = (e) => {
    drawing.current = true;
    last.current = pos(e);
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const move = (e) => {
    if (!drawing.current) return;
    const p = pos(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.beginPath();
    ctx.moveTo(last.current.x, last.current.y);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
    last.current = p;
    setHasInk(true);
  };
  const up = () => {
    drawing.current = false;
  };

  const clear = () => {
    const c = canvasRef.current;
    c.getContext('2d').clearRect(0, 0, c.width, c.height);
    setHasInk(false);
  };

  const dl = () => {
    canvasRef.current.toBlob((blob) => {
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = 'signature.png';
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 5000);
    }, 'image/png');
  };

  const Pen = ({ v, label, cur, set }) => (
    <button
      className={cur === v ? 'btn-primary' : 'btn-secondary'}
      style={{ width: 'auto', padding: '.45rem .8rem', fontSize: '.78rem' }}
      onClick={() => set(v)}
    >
      {label}
    </button>
  );

  return (
    <div className="grid">
      <div className="card">
        <h2>{t.inTitle}</h2>
        <canvas
          ref={canvasRef}
          onPointerDown={down}
          onPointerMove={move}
          onPointerUp={up}
          style={{
            width: '100%',
            aspectRatio: '8 / 3',
            border: '2px dashed var(--line)',
            borderRadius: 10,
            touchAction: 'none',
            cursor: 'crosshair',
            background:
              'repeating-linear-gradient(0deg, transparent, transparent 58px, var(--line) 58px, var(--line) 59px)',
          }}
        />
        <div className="hint" style={{ marginTop: '.5rem' }}>{t.hint}</div>

        <div style={{ display: 'flex', gap: '.45rem', flexWrap: 'wrap', marginTop: '.9rem', alignItems: 'center' }}>
          <span className="hint" style={{ marginRight: '.2rem' }}>{t.penLbl}:</span>
          <Pen v="#111111" label={t.black} cur={color} set={setColor} />
          <Pen v="#1a3faa" label={t.blue} cur={color} set={setColor} />
          <Pen v={2} label={t.thin} cur={width} set={setWidth} />
          <Pen v={3} label={t.med} cur={width} set={setWidth} />
          <Pen v={5} label={t.thick} cur={width} set={setWidth} />
        </div>

        <div style={{ display: 'flex', gap: '.55rem', marginTop: '1rem' }}>
          <button className="btn-secondary" style={{ width: 'auto' }} onClick={clear}>{t.clear}</button>
          <button className="btn-primary" style={{ flex: 1 }} onClick={dl} disabled={!hasInk}>{t.dl}</button>
        </div>
      </div>

      <div className="payslip">
        <div className="payslip-head">
          <span className="lbl">{t.psTitle}</span>
          <span className="fy">PNG</span>
        </div>
        <div style={{ padding: '1.3rem 1.5rem' }}>
          <ul className="cv-ul" style={{ margin: 0, paddingLeft: '1.1rem' }}>
            <li style={{ fontSize: '.86rem', margin: '.4rem 0' }}>{t.tip1}</li>
            <li style={{ fontSize: '.86rem', margin: '.4rem 0' }}>{t.tip2}</li>
            <li style={{ fontSize: '.86rem', margin: '.4rem 0' }}>{t.tip3}</li>
          </ul>
          <div className="hint" style={{ marginTop: '1rem', padding: '.7rem .9rem', border: '1.5px solid var(--wattle)', borderRadius: 9, color: '#8a6508' }}>
            {t.legal}
          </div>
        </div>
      </div>
    </div>
  );
}
