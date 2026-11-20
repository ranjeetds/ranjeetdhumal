/**
 * Binary entropy in bits. The server render is the fair coin, p = 0.5, one bit.
 */

import { useId, useState } from 'react';
import { binaryEntropy, entropyCurve } from '@/lib/viz/entropy';

const WIDTH = 720;
const HEIGHT = 280;
const PAD_X = 48;
const PAD_TOP = 20;
const PAD_BOTTOM = 36;

function format(value: number): string {
  return value.toFixed(2);
}

export default function Entropy() {
  const titleId = useId();
  const [probability, setProbability] = useState(0.5);
  const entropy = binaryEntropy(probability);
  const samples = entropyCurve();
  const plotWidth = WIDTH - PAD_X * 2;
  const plotHeight = HEIGHT - PAD_TOP - PAD_BOTTOM;
  const xOf = (p: number) => PAD_X + p * plotWidth;
  const yOf = (value: number) => PAD_TOP + (1 - value) * plotHeight;
  const curve = samples
    .map((sample, index) => `${index === 0 ? 'M' : 'L'}${xOf(sample.probability).toFixed(2)} ${yOf(sample.entropy).toFixed(2)}`)
    .join(' ');

  return (
    <div className="bg-surface">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-labelledby={titleId} className="w-full">
        <title id={titleId}>Binary entropy {format(entropy)} bits at probability {format(probability)}</title>
        <line x1={PAD_X} x2={WIDTH - PAD_X} y1={HEIGHT - PAD_BOTTOM} y2={HEIGHT - PAD_BOTTOM} className="stroke-line-strong" />
        <path d={curve} fill="none" stroke="var(--accent)" strokeWidth={2} />
        <line x1={xOf(probability)} x2={xOf(probability)} y1={PAD_TOP} y2={HEIGHT - PAD_BOTTOM} className="stroke-ink" />
        <circle cx={xOf(probability)} cy={yOf(entropy)} r={5} fill="var(--accent)" />
        <text x={PAD_X} y={HEIGHT - 12} fontSize={11} className="fill-ink-faint">0</text>
        <text x={WIDTH / 2} y={HEIGHT - 12} fontSize={11} textAnchor="middle" className="fill-ink-faint">0.5</text>
        <text x={WIDTH - PAD_X} y={HEIGHT - 12} fontSize={11} textAnchor="end" className="fill-ink-faint">1</text>
      </svg>
      <label className="flex items-center gap-4 border-t border-line px-4 py-3 text-sm text-ink-muted">
        <span className="mono-label w-28 shrink-0">probability</span>
        <input
          type="range"
          min={0.01}
          max={0.99}
          step={0.01}
          value={probability}
          aria-valuetext={format(probability)}
          onChange={(event) => setProbability(Number(event.currentTarget.value))}
          className="w-full"
          style={{ accentColor: 'var(--accent)' }}
        />
        <span className="mono-label w-14 text-right text-ink">{format(probability)}</span>
      </label>
      <p className="border-t border-line px-4 py-3 text-sm leading-relaxed text-ink-muted">
        A coin with P(heads) = {format(probability)} has binary entropy {format(entropy)} bits. The curve uses log base 2. It is highest at 0.50.
      </p>
    </div>
  );
}
