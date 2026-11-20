/**
 * Sinusoidal positional encoding, width 8. The server render is position 0,
 * where every sine is 0 and every cosine is 1.
 */

import { useId, useState } from 'react';
import { POSITION_WIDTH, positionalColumn, positionalComponent } from '@/lib/viz/positional';

const WIDTH = 720;
const HEIGHT = 220;
const PAD_X = 48;
const PAD_Y = 24;

function format(value: number): string {
  return value.toFixed(2);
}

export default function PositionalEncoding() {
  const titleId = useId();
  const [position, setPosition] = useState(0);
  const column = positionalColumn(position);
  const plotWidth = WIDTH - PAD_X * 2;
  const plotHeight = HEIGHT - PAD_Y * 2;
  const xOf = (value: number) => PAD_X + (value / 32) * plotWidth;
  const yOf = (value: number) => PAD_Y + ((1 - value) / 2) * plotHeight;
  const sine = Array.from({ length: 65 }, (_, index) => {
    const at = (index / 64) * 32;
    return `${index === 0 ? 'M' : 'L'}${xOf(at).toFixed(2)} ${yOf(positionalComponent(at, 0)).toFixed(2)}`;
  }).join(' ');

  return (
    <div className="bg-surface">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-labelledby={titleId} className="w-full">
        <title id={titleId}>Position {position}, first component {format(column[0] ?? 0)}</title>
        <line x1={PAD_X} x2={WIDTH - PAD_X} y1={yOf(0)} y2={yOf(0)} className="stroke-line" />
        <path d={sine} fill="none" stroke="var(--accent)" strokeWidth={2} />
        <circle cx={xOf(position)} cy={yOf(column[0] ?? 0)} r={5} fill="var(--accent)" />
        <text x={PAD_X} y={HEIGHT - 8} fontSize={11} className="fill-ink-faint">0</text>
        <text x={WIDTH - PAD_X} y={HEIGHT - 8} fontSize={11} textAnchor="end" className="fill-ink-faint">32</text>
      </svg>
      <dl className="grid grid-cols-4 gap-px border-t border-line bg-line sm:grid-cols-8">
        {column.map((value, index) => (
          <div key={index} className="bg-surface px-3 py-3">
            <dt className="mono-label text-ink-faint">{index % 2 === 0 ? `sin ${index}` : `cos ${index}`}</dt>
            <dd className="mt-1 text-sm text-ink">{format(value)}</dd>
          </div>
        ))}
      </dl>
      <label className="flex items-center gap-4 border-t border-line px-4 py-3 text-sm text-ink-muted">
        <span className="mono-label w-24 shrink-0">position</span>
        <input
          type="range"
          min={0}
          max={32}
          step={1}
          value={position}
          aria-valuetext={String(position)}
          onChange={(event) => setPosition(Number(event.currentTarget.value))}
          className="w-full"
          style={{ accentColor: 'var(--accent)' }}
        />
        <span className="mono-label w-8 text-right text-ink">{position}</span>
      </label>
      <p className="border-t border-line px-4 py-3 text-sm leading-relaxed text-ink-muted">
        Position {position} of {POSITION_WIDTH}. The curve is the first component, a sine. Even columns are sines and odd columns are cosines. At position 0 every sine is 0 and every cosine is 1.
      </p>
    </div>
  );
}
