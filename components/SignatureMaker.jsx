'use client';

import { useEffect, useRef, useState } from 'react';

const STRINGS = {
  en: {
    tabDraw: 'Draw',
    tabPhoto: 'From a photo',
    inTitle: 'Your signature',
    hint: 'Use your finger on a phone, or mouse/trackpad on a computer. Nothing is uploaded — it never leaves your device.',
    penLbl: 'Pen',
    black: 'Black',
    blue: 'Blue',
    original: 'Original ink',
    thin: 'Fine',
    med: 'Medium',
    thick: 'Bold',
    clear: 'Clear',
    dl: 'Download PNG (transparent)',
    photoPick: 'Choose a photo of your signature',
    photoRepick: 'Choose a different photo',
    photoHint: 'Sign with a dark pen on plain paper, photograph from directly above in even light (no flash), and fill the frame. Processed entirely in your browser.',
    sensLbl: 'Background removal strength',
    sensHint: 'Slide right if faint strokes disappear; slide left if paper shadows remain.',
    empty: 'Your extracted signature appears here on a transparent background.',
    psTitle: 'How to use it',
    tip1: 'Word / Google Docs: Insert → Image, place it over the signature line, shrink to fit.',
    tip2: 'PDF form apps (Adobe, Preview, phone editors): add image → select the PNG.',
    tip3: 'The background is transparent, so it sits cleanly on any document colour.',
    legal: 'For documents requiring a witnessed or “wet-ink” signature (some statutory declarations, wills), check the requirement first — an image may not be accepted.',
  },
  vi: {
    tabDraw: 'Vẽ tay',
    tabPhoto: 'Từ ảnh chụp',
    inTitle: 'Chữ ký của bạn',
    hint: 'Dùng ngón tay trên điện thoại, hoặc chuột/trackpad trên máy tính. Không upload đi đâu — chữ ký không rời máy bạn.',
    penLbl: 'Bút',
    black: 'Đen',
    blue: 'Xanh',
    original: 'Giữ màu mực gốc',
    thin: 'Mảnh',
    med: 'Vừa',
    thick: 'Đậm',
    clear: 'Xóa vẽ lại',
    dl: 'Tải PNG (nền trong suốt)',
    photoPick: 'Chọn ảnh chụp chữ ký',
    photoRepick: 'Chọn ảnh khác',
    photoHint: 'Ký bút mực đậm trên giấy trơn, chụp thẳng từ trên xuống dưới ánh sáng đều (tắt flash), chữ ký chiếm gần hết khung. Xử lý hoàn toàn trong trình duyệt.',
    sensLbl: 'Độ mạnh tách nền',
    sensHint: 'Kéo phải nếu nét mảnh bị mất; kéo trái nếu còn sót bóng giấy.',
    empty: 'Chữ ký sau khi tách nền sẽ hiện ở đây.',
    psTitle: 'Dùng như thế nào',
    tip1: 'Word / Google Docs: Insert → Image, đặt lên dòng ký, thu nhỏ cho vừa.',
    tip2: 'App điền PDF (Adobe, Preview, app điện thoại): thêm ảnh → chọn file PNG.',
    tip3: 'Nền trong suốt nên đặt lên giấy tờ màu gì cũng sạch sẽ.',
    legal: 'Giấy tờ yêu cầu ký tươi hoặc có người chứng kiến (một số statutory declaration, di chúc) — kiểm tra yêu cầu trước, ảnh chữ ký có thể không được chấp nhận.',
  },
};

const CHECKER =
  'repeating-conic-gradient(#e8e8e4 0% 25%, #f7f8f4 0% 50%) 0 0 / 18px 18px';

export default function SignatureMaker({ lang = 'en' }) {
  const t = STRINGS[lang];
  const [tab, setTab] = useState('draw');

  /* ---------- DRAW MODE ---------- */
  const canvasRef = useRef(null);
  const drawing = useRef(false);
  const last = useRef(null);
  const [color, setColor] = useState('#111111');
  const [width, setWidth] = useState(3);
  const [hasInk, setHasInk] = useState(false);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c || c.dataset.init) return;
    c.dataset.init = '1';
    const dpr = window.devicePixelRatio || 1;
    c.width = 800 * dpr;
    c.height = 300 * dpr;
    c.getContext('2d').scale(dpr, dpr);
  }, [tab]);

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
  const up = () => (drawing.current = false);
  const clearDraw = () => {
    const c = canvasRef.current;
    c.getContext('2d').clearRect(0, 0, c.width, c.height);
    setHasInk(false);
  };
  const dlDraw = () => {
    canvasRef.current.toBlob((blob) => saveBlob(blob), 'image/png');
  };

  /* ---------- PHOTO MODE ---------- */
  const outRef = useRef(null); // canvas hiển thị kết quả
  const dataRef = useRef(null); // {w, h, ratio: Float32Array, rgb: Uint8ClampedArray}
  const [hasPhoto, setHasPhoto] = useState(false);
  const [sens, setSens] = useState(0.82);
  const [inkMode, setInkMode] = useState('original');

  const onPhoto = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const url = URL.createObjectURL(f);
    const im = new Image();
    im.onload = () => {
      URL.revokeObjectURL(url);
      prepare(im);
      setHasPhoto(true);
    };
    im.src = url;
    e.target.value = '';
  };

  function prepare(im) {
    // 1) hạ kích thước
    const scale = Math.min(1, 1600 / Math.max(im.width, im.height));
    const w = Math.round(im.width * scale);
    const h = Math.round(im.height * scale);
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d');
    ctx.drawImage(im, 0, 0, w, h);
    const src = ctx.getImageData(0, 0, w, h).data;

    // 2) ước lượng nền bằng blur rẻ: thu nhỏ /16 rồi phóng lại
    const sw = Math.max(1, Math.round(w / 16));
    const sh = Math.max(1, Math.round(h / 16));
    const sc = document.createElement('canvas');
    sc.width = sw;
    sc.height = sh;
    sc.getContext('2d').drawImage(c, 0, 0, sw, sh);
    const bc = document.createElement('canvas');
    bc.width = w;
    bc.height = h;
    const bctx = bc.getContext('2d');
    bctx.imageSmoothingEnabled = true;
    bctx.drawImage(sc, 0, 0, w, h);
    const bg = bctx.getImageData(0, 0, w, h).data;

    // 3) ratio = độ sáng pixel / độ sáng nền (khử bóng, giấy ngả màu)
    const n = w * h;
    const ratio = new Float32Array(n);
    const rgb = new Uint8ClampedArray(n * 3);
    for (let i = 0; i < n; i++) {
      const j = i * 4;
      const lum = 0.299 * src[j] + 0.587 * src[j + 1] + 0.114 * src[j + 2];
      const bl = Math.max(0.299 * bg[j] + 0.587 * bg[j + 1] + 0.114 * bg[j + 2], 16);
      ratio[i] = lum / bl;
      rgb[i * 3] = src[j];
      rgb[i * 3 + 1] = src[j + 1];
      rgb[i * 3 + 2] = src[j + 2];
    }
    dataRef.current = { w, h, ratio, rgb };
    render(sens, inkMode);
  }

  function render(thr, mode) {
    const d = dataRef.current;
    if (!d) return;
    const { w, h, ratio, rgb } = d;
    const soft = 0.12;
    const img = new ImageData(w, h);
    const px = img.data;
    let minX = w, minY = h, maxX = -1, maxY = -1;
    for (let i = 0; i < w * h; i++) {
      let a = (thr - ratio[i]) / soft;
      a = a < 0 ? 0 : a > 1 ? 1 : a;
      const A = Math.round(a * 255);
      const j = i * 4;
      if (mode === 'black') {
        px[j] = 17; px[j + 1] = 17; px[j + 2] = 17;
      } else if (mode === 'blue') {
        px[j] = 26; px[j + 1] = 63; px[j + 2] = 170;
      } else {
        px[j] = rgb[i * 3]; px[j + 1] = rgb[i * 3 + 1]; px[j + 2] = rgb[i * 3 + 2];
      }
      px[j + 3] = A;
      if (A > 12) {
        const x = i % w, y = (i / w) | 0;
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
    const out = outRef.current;
    if (maxX < 0) { // không có mực
      out.width = 10; out.height = 10;
      return;
    }
    const pad = 14;
    minX = Math.max(0, minX - pad); minY = Math.max(0, minY - pad);
    maxX = Math.min(w - 1, maxX + pad); maxY = Math.min(h - 1, maxY + pad);
    const cw = maxX - minX + 1, ch = maxY - minY + 1;
    const full = document.createElement('canvas');
    full.width = w; full.height = h;
    full.getContext('2d').putImageData(img, 0, 0);
    out.width = cw; out.height = ch;
    out.getContext('2d').drawImage(full, minX, minY, cw, ch, 0, 0, cw, ch);
  }

  useEffect(() => {
    if (hasPhoto) render(sens, inkMode);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sens, inkMode]);

  const dlPhoto = () => outRef.current.toBlob((b) => saveBlob(b), 'image/png');

  function saveBlob(blob) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'signature.png';
    a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 5000);
  }

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

        <div style={{ display: 'flex', gap: '.45rem', marginBottom: '1rem' }}>
          <Pen v="draw" label={t.tabDraw} cur={tab} set={setTab} />
          <Pen v="photo" label={t.tabPhoto} cur={tab} set={setTab} />
        </div>

        {tab === 'draw' && (
          <>
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
              <button className="btn-secondary" style={{ width: 'auto' }} onClick={clearDraw}>{t.clear}</button>
              <button className="btn-primary" style={{ flex: 1 }} onClick={dlDraw} disabled={!hasInk}>{t.dl}</button>
            </div>
          </>
        )}

        {tab === 'photo' && (
          <>
            <div className="field">
              <label className="photo-pick">
                <input type="file" accept="image/*" onChange={onPhoto} style={{ display: 'none' }} />
                <span>{hasPhoto ? t.photoRepick : t.photoPick}</span>
              </label>
              <div className="hint">{t.photoHint}</div>
            </div>

            {hasPhoto && (
              <>
                <div className="field">
                  <label htmlFor="sig-sens">{t.sensLbl} — {Math.round(sens * 100)}</label>
                  <input
                    type="range" id="sig-sens" min="0.6" max="0.95" step="0.01"
                    value={sens}
                    onChange={(e) => setSens(+e.target.value)}
                    style={{ width: '100%', accentColor: 'var(--green)' }}
                  />
                  <div className="hint">{t.sensHint}</div>
                </div>
                <div style={{ display: 'flex', gap: '.45rem', flexWrap: 'wrap', alignItems: 'center' }}>
                  <span className="hint" style={{ marginRight: '.2rem' }}>{t.penLbl}:</span>
                  <Pen v="original" label={t.original} cur={inkMode} set={setInkMode} />
                  <Pen v="black" label={t.black} cur={inkMode} set={setInkMode} />
                  <Pen v="blue" label={t.blue} cur={inkMode} set={setInkMode} />
                </div>
              </>
            )}

            <div style={{ marginTop: '1rem', border: '2px dashed var(--line)', borderRadius: 10, minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '.8rem', background: CHECKER }}>
              {!hasPhoto && <span className="hint">{t.empty}</span>}
              <canvas ref={outRef} style={{ maxWidth: '100%', maxHeight: 220, display: hasPhoto ? 'block' : 'none' }} />
            </div>

            {hasPhoto && (
              <button className="btn-primary" style={{ marginTop: '1rem', width: '100%' }} onClick={dlPhoto}>{t.dl}</button>
            )}
          </>
        )}
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
