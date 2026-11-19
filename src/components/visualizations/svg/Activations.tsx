/**
 * Sigmoid, tanh, and ReLU, with the tangent at a chosen input. The server
 * render is ReLU at x = 1. ReLU's slope at exactly 0 is drawn as 0.
 */

import { useId, useState } from 'react';
import {
  ACTIVATION_DOMAIN,
  activation,
  activationCurve,
  activationDerivative,
  activationIds,
  activationRange,
  type ActivationId,
} from '@/lib/viz/activations';

const WIDTH = 720;
const HEIGHT = 320;
const PAD_X = 48;
const PAD_TOP = 24;
const PAD_BOTTOM = 36;

const NAMES: Record<ActivationId, string> = {
  sigmoid: 'Sigmoid',
  tanh: 'Tanh',
  relu: 'ReLU',
};

function format(value: number): string {
  return value.toFixed(2);
}

export default function Activations() {
  const titleId = useId();
  const [id, setId] = useState<ActivationId>('relu');
  const [x, setX] = useState(1);

  const y = activation(id, x);
  const slope = activationDerivative(id, x);
  const samples = activationCurve(id);
  const range = activationRange(id);
  const plotWidth = WIDTH - PAD_X * 2;
  const plotHeight = HEIGHT - PAD_TOP - PAD_BOTTOM;

  const xOf = (value: number) =>
    PAD_X + ((value - ACTIVATION_DOMAIN.min) / (ACTIVATION_DOMAIN.max - ACTIVATION_DOMAIN.min)) * plotWidth;
  const yOf = (value: number) => PAD_TOP + ((range.max - value) / (range.max - range.min)) * plotHeight;

  const curve = samples
    .map((sample, index) => `${index === 0 ? 'M' : 'L'}${xOf(sample.x).toFixed(2)} ${yOf(sample.y).toFixed(2)}`)
    .join(' ');
  const left = Math.max(ACTIVATION_DOMAIN.min, x - 0.75);
  const right = Math.min(ACTIVATION_DOMAIN.max, x + 0.75);
  const zero = yOf(0);

  return (
    <div className="bg-surface">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-labelledby={titleId} className="w-full">
        <title id={titleId}>
          {NAMES[id]} at input {format(x)} is {format(y)}, with slope {format(slope)}
        </title>
        <line x1={PAD_X} x2={WIDTH - PAD_X} y1={zero} y2={zero} className="stroke-line" />
        <line
          x1={xOf(0)}
          x2={xOf(0)}
          y1={PAD_TOP}
          y2={HEIGHT - PAD_BOTTOM}
          className="stroke-line"
        />
        <path d={curve} fill="none" stroke="var(--accent)" strokeWidth={2} />
        <line
          x1={xOf(left)}
          y1={yOf(y + slope * (left - x))}
          x2={xOf(right)}
          y2={yOf(y + slope * (right - x))}
          className="stroke-ink"
          strokeWidth={1.5}
        />
        <circle cx={xOf(x)} cy={yOf(y)} r={5} fill="var(--accent)" />
        <text x={PAD_X} y={HEIGHT - 12} fontSize={11} className="fill-ink-faint">
          {ACTIVATION_DOMAIN.min}
        </text>
        <text x={WIDTH - PAD_X} y={HEIGHT - 12} fontSize={11} textAnchor="end" className="fill-ink-faint">
          {ACTIVATION_DOMAIN.max}
        </text>
      </svg>

      <div className="flex flex-wrap gap-2 border-t border-line px-4 py-3">
        {activationIds.map((candidate) => (
          <button
            key={candidate}
            type="button"
            aria-pressed={candidate === id}
            onClick={() => setId(candidate)}
            className="mono-label rounded-sm px-3 py-2 text-ink-muted transition-colors duration-200 hover:bg-raised hover:text-ink aria-pressed:bg-raised aria-pressed:text-ink"
          >
            {NAMES[candidate]}
          </button>
        ))}
      </div>
      <label className="flex items-center gap-4 border-t border-line px-4 py-3 text-sm text-ink-muted">
        <span className="mono-label w-16 shrink-0">input</span>
        <input
          type="range"
          min={ACTIVATION_DOMAIN.min}
          max={ACTIVATION_DOMAIN.max}
          step={0.05}
          value={x}
          aria-valuetext={format(x)}
          onChange={(event) => setX(Number(event.currentTarget.value))}
          className="w-full"
          style={{ accentColor: 'var(--accent)' }}
        />
        <span className="mono-label w-14 text-right text-ink">{format(x)}</span>
      </label>
      <p className="border-t border-line px-4 py-3 text-sm leading-relaxed text-ink-muted">
        {NAMES[id]} of {format(x)} is {format(y)}. The short line is the tangent, slope {format(slope)}.
        {id === 'relu' ? ' At exactly 0 the slope is undefined; this figure draws 0.' : ''}
      </p>
    </div>
  );
}
