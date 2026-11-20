/**
 * Population z-scores of six numbers. The server render is 1, 2, 3, 4, 5, 9.
 * The deviation divides by six, not by five.
 */

import { useId, useState } from 'react';
import { center } from '@/lib/viz/normalization';

const INITIAL = [1, 2, 3, 4, 5, 9];

function format(value: number): string {
  return value.toFixed(2);
}

export default function Normalization() {
  const titleId = useId();
  const [values, setValues] = useState(INITIAL);
  const [selected, setSelected] = useState(5);
  const summary = center(values);
  const chosen = values[selected] ?? 0;
  const z = summary.z[selected] ?? 0;

  return (
    <div className="bg-surface">
      <svg viewBox="0 0 720 160" role="img" aria-labelledby={titleId} className="w-full">
        <title id={titleId}>
          Mean {format(summary.mean)}, deviation {format(summary.deviation)}
        </title>
        {summary.z.map((score, index) => {
          const height = Math.min(52, Math.abs(score) * 22);
          const x = 48 + index * 110;
          const y = score >= 0 ? 78 - height : 78;
          return (
            <g key={index}>
              <rect x={x} y={y} width={36} height={height} fill={index === selected ? 'var(--accent)' : 'currentColor'} opacity={index === selected ? 1 : 0.35} />
              <text x={x + 18} y={148} fontSize={12} textAnchor="middle" className="fill-ink-faint">
                {format(values[index] ?? 0)}
              </text>
            </g>
          );
        })}
        <line x1={36} x2={684} y1={78} y2={78} className="stroke-line" />
      </svg>
      <div className="flex flex-wrap gap-2 border-t border-line px-4 py-3">
        {values.map((value, index) => (
          <button
            key={index}
            type="button"
            aria-pressed={index === selected}
            onClick={() => setSelected(index)}
            className="mono-label rounded-sm px-3 py-2 text-ink-muted transition-colors duration-200 hover:bg-raised hover:text-ink aria-pressed:bg-raised aria-pressed:text-ink"
          >
            {format(value)}
          </button>
        ))}
        <button
          type="button"
          onClick={() => setValues(INITIAL)}
          className="mono-label rounded-sm px-3 py-2 text-ink-muted transition-colors duration-200 hover:bg-raised hover:text-ink"
        >
          Reset
        </button>
      </div>
      <label className="flex items-center gap-4 border-t border-line px-4 py-3 text-sm text-ink-muted">
        <span className="mono-label w-28 shrink-0">selected</span>
        <input
          type="range"
          min={-2}
          max={12}
          step={0.5}
          value={chosen}
          aria-valuetext={format(chosen)}
          onChange={(event) => {
            const next = Number(event.currentTarget.value);
            setValues((current) => current.map((value, index) => (index === selected ? next : value)));
          }}
          className="w-full"
          style={{ accentColor: 'var(--accent)' }}
        />
        <span className="mono-label w-14 text-right text-ink">{format(chosen)}</span>
      </label>
      <p className="border-t border-line px-4 py-3 text-sm leading-relaxed text-ink-muted">
        Mean {format(summary.mean)}, population deviation {format(summary.deviation)}. The selected value {format(chosen)} is {format(z)} deviations from the mean. Bars above the line are above the mean.
      </p>
    </div>
  );
}
