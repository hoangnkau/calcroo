'use client';

import { memo } from 'react';

/* Biểu đồ cột so sánh — thuần SVG, 0 dependency.
   - update real-time: chỉ là render lại React, các <rect> có CSS transition.
   - responsive: viewBox + width 100%.
   - memo: chỉ vẽ lại khi props đổi. */

const VB_W = 560;
const VB_H = 320;
const M = { top: 28, right: 16, bottom: 46, left: 54 };
const PLOT_W = VB_W - M.left - M.right;
const PLOT_H = VB_H - M.top - M.bottom;

function niceCeil(v) {
  if (!Number.isFinite(v) || v <= 0) return 1;
  const mag = Math.pow(10, Math.floor(Math.log10(v)));
  const n = v / mag;
  const step = n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10;
  return step * mag;
}

const axisFmt = (v) =>
  Math.abs(v) >= 1000 ? '$' + Math.round(v / 100) / 10 + 'k' : '$' + Math.round(v);

function PayCompareChart({ data, labels, job1Name, job2Name, fmt }) {
  const values = data.flatMap((d) => [Math.max(0, d.job1), Math.max(0, d.job2)]);
  const max = niceCeil(Math.max(1, ...values));
  const groupW = PLOT_W / data.length;
  const barW = Math.min(46, groupW * 0.3);
  const innerGap = Math.min(12, groupW * 0.06);
  const pairW = barW * 2 + innerGap;

  const yFor = (v) => M.top + PLOT_H * (1 - Math.max(0, v) / max);
  const gridLines = [0, 0.25, 0.5, 0.75, 1].map((f) => f * max);

  return (
    <svg
      className="cmp-chart"
      viewBox={`0 0 ${VB_W} ${VB_H}`}
      preserveAspectRatio="xMidYMid meet"
      role="img"
      aria-label={`${job1Name} vs ${job2Name}`}
    >
      <title>{`${job1Name} vs ${job2Name}`}</title>

      {/* legend */}
      <g className="cmp-legend" fontSize="13">
        <rect x={M.left} y={8} width={12} height={12} rx={2} className="cmp-swatch-1" />
        <text x={M.left + 18} y={18}>{job1Name}</text>
        <rect x={M.left + PLOT_W / 2} y={8} width={12} height={12} rx={2} className="cmp-swatch-2" />
        <text x={M.left + PLOT_W / 2 + 18} y={18}>{job2Name}</text>
      </g>

      {/* gridlines + y labels */}
      <g className="cmp-grid" fontSize="11">
        {gridLines.map((gv, i) => {
          const gy = yFor(gv);
          return (
            <g key={i}>
              <line x1={M.left} y1={gy} x2={VB_W - M.right} y2={gy} />
              <text x={M.left - 8} y={gy + 4} textAnchor="end">
                {axisFmt(gv)}
              </text>
            </g>
          );
        })}
      </g>

      {/* bars */}
      {data.map((d, i) => {
        const gx = M.left + i * groupW;
        const pairX = gx + (groupW - pairW) / 2;
        const bars = [
          { v: Math.max(0, d.job1), x: pairX, cls: 'cmp-bar-1' },
          { v: Math.max(0, d.job2), x: pairX + barW + innerGap, cls: 'cmp-bar-2' },
        ];
        return (
          <g key={d.key}>
            {bars.map((b, j) => {
              const by = yFor(b.v);
              const bh = Math.max(0, M.top + PLOT_H - by);
              return (
                <g key={j}>
                  <rect
                    className={`cmp-bar ${b.cls}`}
                    x={b.x}
                    y={by}
                    width={barW}
                    height={bh}
                    rx={3}
                  />
                  <text
                    className="cmp-bar-val"
                    x={b.x + barW / 2}
                    y={by - 6}
                    textAnchor="middle"
                    fontSize="12"
                  >
                    {fmt(b.v)}
                  </text>
                </g>
              );
            })}
            <text
              className="cmp-cat"
              x={gx + groupW / 2}
              y={VB_H - M.bottom + 22}
              textAnchor="middle"
              fontSize="13"
            >
              {labels[d.key]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

export default memo(PayCompareChart);
