'use client';

import { memo, useMemo } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { ALLOCATION_COLORS } from '../lib/allocation';

ChartJS.register(ArcElement, Tooltip);

const fmt = (n) => '$' + Math.round(n).toLocaleString('en-AU');
const colorFor = (k) => ALLOCATION_COLORS[k] || '#5f6f66';

/**
 * @param {{
 *   parts: Array<{key:string, value:number}>,   // đã quy đổi theo kỳ
 *   labels: Record<string,string>,
 *   centerLabel: string, centerValue: string, perLabel?: string
 * }} props
 */
function IncomeDonut({ parts, labels, centerLabel, centerValue, perLabel }) {
  const total = parts.reduce((a, p) => a + p.value, 0) || 1;

  const data = useMemo(
    () => ({
      labels: parts.map((p) => labels[p.key] || p.key),
      datasets: [
        {
          data: parts.map((p) => Math.max(0, Math.round(p.value))),
          backgroundColor: parts.map((p) => colorFor(p.key)),
          borderColor: '#ffffff',
          borderWidth: 2,
          hoverOffset: 6,
        },
      ],
    }),
    [parts, labels],
  );

  const options = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: true,
      cutout: '62%',
      animation: { duration: 300, easing: 'easeOutQuart' },
      plugins: {
        legend: { display: false },
        tooltip: {
          padding: 10,
          backgroundColor: '#17281f',
          titleFont: { family: 'IBM Plex Sans, system-ui, sans-serif' },
          bodyFont: { family: 'IBM Plex Mono, monospace' },
          callbacks: {
            label: (ctx) => {
              const sum = ctx.dataset.data.reduce((a, b) => a + b, 0) || 1;
              return ` ${ctx.label}: ${fmt(ctx.parsed)} (${((ctx.parsed / sum) * 100).toFixed(1)}%)`;
            },
          },
        },
      },
    }),
    [],
  );

  return (
    <div className="donut-wrap">
      <div className="donut-canvas">
        <Doughnut data={data} options={options} aria-label={`${centerLabel} ${centerValue}`} />
        <div className="donut-center" aria-hidden="true">
          <span className="donut-center-lbl">{centerLabel}</span>
          <strong>{centerValue}</strong>
          {perLabel && <small>{perLabel}</small>}
        </div>
      </div>

      <ul className="donut-legend">
        {parts.map((p) => (
          <li key={p.key}>
            <span className="donut-dot" style={{ background: colorFor(p.key) }} />
            <span className="donut-legend-lbl">{labels[p.key] || p.key}</span>
            <span className="donut-legend-pct">{((p.value / total) * 100).toFixed(1)}%</span>
            <span className="donut-legend-val">{fmt(p.value)}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default memo(IncomeDonut);
