'use client';

import { useEffect, useRef, useState } from 'react';

// Chuẩn ảnh hộ chiếu/visa Úc: 35×45mm. Ở 300 DPI = 413×531 px.
const OUT_W = 413;
const OUT_H = 531;

const STRINGS = {
  en: {
    inTitle: 'Your photo',
    pick: 'Choose a photo',
    repick: 'Choose a different photo',
    pickHint: 'Use a recent photo against a plain, light background. Nothing is uploaded — everything happens in your browser.',
    zoom: 'Zoom',
    dragHint: 'Drag the photo to position it. Head should fill most of the frame (chin to crown 32–36mm).',
    lowRes: '⚠ Photo may be too small — the crop is below 413×531px and could look blurry. Use a higher-resolution photo.',
    psTitle: 'Australian 35×45mm standard',
    dlSingle: 'Download photo (35×45mm, 413×531px)',
    dlSheet: 'Download 6×4″ print sheet (4 photos)',
    sheetHint: 'Print the sheet as a standard 6×4″ photo at Kmart, Big W or Officeworks for under a dollar, then cut along the guides.',
    empty: 'Your cropped photo will appear here.',
  },
  vi: {
    inTitle: 'Ảnh của bạn',
    pick: 'Chọn ảnh',
    repick: 'Chọn ảnh khác',
    pickHint: 'Dùng ảnh mới chụp, nền trơn sáng màu. Ảnh không được upload đi đâu — mọi xử lý chạy ngay trên trình duyệt.',
    zoom: 'Phóng to',
    dragHint: 'Kéo ảnh để căn vị trí. Khuôn mặt chiếm phần lớn khung (cằm đến đỉnh đầu 32–36mm).',
    lowRes: '⚠ Ảnh có thể quá nhỏ — vùng crop dưới 413×531px, in ra dễ mờ. Hãy dùng ảnh độ phân giải cao hơn.',
    psTitle: 'Chuẩn Úc 35×45mm',
    dlSingle: 'Tải ảnh (35×45mm, 413×531px)',
    dlSheet: 'Tải khổ in 6×4″ (4 ảnh)',
    sheetHint: 'Mang file khổ in ra Kmart, Big W hoặc Officeworks in như ảnh 6×4″ thường (dưới 1 đô), rồi cắt theo vạch.',
    empty: 'Ảnh đã crop sẽ hiện ở đây.',
  },
};

export default function PhotoResizer({ lang = 'en' }) {
  const t = STRINGS[lang];
  const canvasRef = useRef(null);
  const dragRef = useRef(null);
  const [img, setImg] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [lowRes, setLowRes] = useState(false);

  function draw(canvas, scaleTo = 1) {
    const ctx = canvas.getContext('2d');
    const W = OUT_W * scaleTo;
    const H = OUT_H * scaleTo;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, W, H);
    if (!img) return;
    const base = Math.max(W / img.width, H / img.height); // cover
    const s = base * zoom;
    const dw = img.width * s;
    const dh = img.height * s;
    const dx = (W - dw) / 2 + pos.x * scaleTo;
    const dy = (H - dh) / 2 + pos.y * scaleTo;
    ctx.drawImage(img, dx, dy, dw, dh);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) draw(canvas);
    if (img) {
      // độ phân giải nguồn trong vùng crop: bao nhiêu px nguồn ứng với 413px đầu ra
      const base = Math.max(OUT_W / img.width, OUT_H / img.height);
      setLowRes(base * zoom > 1.01);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [img, zoom, pos]);

  const onFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const im = new Image();
    im.onload = () => {
      setImg(im);
      setZoom(1);
      setPos({ x: 0, y: 0 });
      URL.revokeObjectURL(url);
    };
    im.src = url;
  };

  const onPointerDown = (e) => {
    if (!img) return;
    dragRef.current = { x: e.clientX, y: e.clientY, px: pos.x, py: pos.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const onPointerMove = (e) => {
    if (!dragRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const scale = OUT_W / rect.width; // css px → canvas px
    setPos({
      x: dragRef.current.px + (e.clientX - dragRef.current.x) * scale,
      y: dragRef.current.py + (e.clientY - dragRef.current.y) * scale,
    });
  };
  const onPointerUp = () => {
    dragRef.current = null;
  };

  function download(canvas, name) {
    canvas.toBlob(
      (blob) => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = name;
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 5000);
      },
      'image/jpeg',
      0.92
    );
  }

  const dlSingle = () => {
    const c = document.createElement('canvas');
    c.width = OUT_W;
    c.height = OUT_H;
    draw(c, 1);
    download(c, 'australian-visa-photo-35x45.jpg');
  };

  const dlSheet = () => {
    // Khổ in 6×4 inch ngang @300dpi = 1800×1200, xếp 4 ảnh 2×2 kèm vạch cắt
    const c = document.createElement('canvas');
    c.width = 1800;
    c.height = 1200;
    const ctx = c.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, 1800, 1200);
    const one = document.createElement('canvas');
    one.width = OUT_W;
    one.height = OUT_H;
    draw(one, 1);
    const gx = (1800 - 2 * OUT_W) / 3;
    const gy = (1200 - 2 * OUT_H) / 3;
    const xs = [gx, gx * 2 + OUT_W];
    const ys = [gy, gy * 2 + OUT_H];
    ctx.strokeStyle = '#bbbbbb';
    ctx.lineWidth = 2;
    for (const x of xs)
      for (const y of ys) {
        ctx.drawImage(one, x, y);
        ctx.strokeRect(x - 1, y - 1, OUT_W + 2, OUT_H + 2); // vạch cắt
      }
    download(c, 'visa-photo-print-sheet-6x4.jpg');
  };

  return (
    <div className="grid">
      <div className="card">
        <h2>{t.inTitle}</h2>

        <div className="field">
          <label className="photo-pick">
            <input type="file" accept="image/*" onChange={onFile} style={{ display: 'none' }} />
            <span>{img ? t.repick : t.pick}</span>
          </label>
          <div className="hint">{t.pickHint}</div>
        </div>

        {img && (
          <>
            <div className="field">
              <label htmlFor="ph-zoom">
                {t.zoom} — {zoom.toFixed(2)}×
              </label>
              <input
                type="range"
                id="ph-zoom"
                min="1"
                max="3"
                step="0.01"
                value={zoom}
                onChange={(e) => setZoom(+e.target.value)}
                style={{ width: '100%', accentColor: 'var(--green)' }}
              />
              <div className="hint">{t.dragHint}</div>
            </div>
            {lowRes && (
              <div className="hint" style={{ padding: '.7rem .9rem', border: '1.5px solid var(--danger)', borderRadius: 9, color: 'var(--danger)' }}>
                {t.lowRes}
              </div>
            )}
          </>
        )}
      </div>

      <div className="payslip">
        <div className="payslip-head">
          <span className="lbl">{t.psTitle}</span>
          <span className="fy">35×45mm · 300 DPI</span>
        </div>
        <div style={{ padding: '1.3rem 1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <canvas
            ref={canvasRef}
            width={OUT_W}
            height={OUT_H}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            style={{
              width: '100%',
              maxWidth: 240,
              aspectRatio: '35 / 45',
              border: '1px solid var(--line)',
              borderRadius: 8,
              touchAction: 'none',
              cursor: img ? 'grab' : 'default',
              background: '#fff',
            }}
          />
          {!img && <div className="hint">{t.empty}</div>}
          {img && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '.55rem', width: '100%' }}>
              <button className="btn-primary" onClick={dlSingle}>{t.dlSingle}</button>
              <button className="btn-secondary" onClick={dlSheet}>{t.dlSheet}</button>
              <div className="hint" style={{ textAlign: 'center' }}>{t.sheetHint}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
