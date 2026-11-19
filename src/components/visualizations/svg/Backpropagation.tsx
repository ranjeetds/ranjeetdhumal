/**
 * Forward and backward numbers on a one-hidden-unit network, plus one gradient
 * step. The server render is the default weights before any step.
 */

import { useId, useState } from 'react';
import { tinyPass, tinyStep, type TinyNet } from '@/lib/viz/backprop';

const LEARNING_RATE = 0.2;

const INITIAL: TinyNet = {
  x: 1,
  w1: 0.5,
  b1: 0.2,
  w2: 0.8,
  b2: -0.1,
  target: 1,
};

function format(value: number): string {
  return value.toFixed(3);
}

export default function Backpropagation() {
  const titleId = useId();
  const [net, setNet] = useState<TinyNet>(INITIAL);
  const pass = tinyPass(net);

  const rows: { label: string; value: string }[] = [
    { label: 'pre-activation', value: format(pass.pre) },
    { label: 'hidden', value: format(pass.hidden) },
    { label: 'output', value: format(pass.output) },
    { label: 'loss', value: format(pass.loss) },
    { label: 'dL/d output', value: format(pass.gradients.output) },
    { label: 'dL/d w2', value: format(pass.gradients.w2) },
    { label: 'dL/d b2', value: format(pass.gradients.b2) },
    { label: 'dL/d hidden', value: format(pass.gradients.hidden) },
    { label: 'ReLU gate', value: String(pass.gradients.reluGate) },
    { label: 'dL/d w1', value: format(pass.gradients.w1) },
    { label: 'dL/d b1', value: format(pass.gradients.b1) },
  ];

  const sliders: { label: string; key: keyof TinyNet; min: number; max: number; step: number }[] = [
    { label: 'x', key: 'x', min: -2, max: 2, step: 0.1 },
    { label: 'w1', key: 'w1', min: -2, max: 2, step: 0.05 },
    { label: 'b1', key: 'b1', min: -2, max: 2, step: 0.05 },
    { label: 'w2', key: 'w2', min: -2, max: 2, step: 0.05 },
    { label: 'b2', key: 'b2', min: -2, max: 2, step: 0.05 },
    { label: 'target', key: 'target', min: -1, max: 2, step: 0.1 },
  ];

  return (
    <div className="bg-surface">
      <svg viewBox="0 0 720 120" role="img" aria-labelledby={titleId} className="w-full">
        <title id={titleId}>
          Loss {format(pass.loss)} with ReLU gate {pass.gradients.reluGate}
        </title>
        <text x={28} y={36} fontSize={13} className="fill-ink-muted">
          x {format(net.x)} → w1, b1 → ReLU → w2, b2 → output {format(pass.output)}
        </text>
        <text x={28} y={72} fontSize={13} className="fill-ink-muted">
          target {format(net.target)} · loss {format(pass.loss)} · gate {pass.gradients.reluGate}
        </text>
        <text x={28} y={104} fontSize={13} fill="var(--accent)">
          one step subtracts {LEARNING_RATE} times each parameter gradient
        </text>
      </svg>

      <dl className="grid grid-cols-2 gap-px border-t border-line bg-line sm:grid-cols-3">
        {rows.map((row) => (
          <div key={row.label} className="bg-surface px-4 py-3">
            <dt className="mono-label text-ink-faint">{row.label}</dt>
            <dd className="mt-1 text-sm text-ink">{row.value}</dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-wrap gap-2 border-t border-line px-4 py-3">
        <button
          type="button"
          onClick={() => setNet((current) => tinyStep(current, LEARNING_RATE))}
          className="mono-label rounded-sm bg-raised px-3 py-2 text-ink"
        >
          One step
        </button>
        <button
          type="button"
          onClick={() => setNet(INITIAL)}
          className="mono-label rounded-sm px-3 py-2 text-ink-muted transition-colors duration-200 hover:bg-raised hover:text-ink"
        >
          Reset
        </button>
      </div>

      {sliders.map((slider) => (
        <label
          key={slider.key}
          className="flex items-center gap-4 border-t border-line px-4 py-3 text-sm text-ink-muted"
        >
          <span className="mono-label w-16 shrink-0">{slider.label}</span>
          <input
            type="range"
            min={slider.min}
            max={slider.max}
            step={slider.step}
            value={net[slider.key]}
            aria-valuetext={format(net[slider.key])}
            onChange={(event) =>
              setNet((current) => ({ ...current, [slider.key]: Number(event.currentTarget.value) }))
            }
            className="w-full"
            style={{ accentColor: 'var(--accent)' }}
          />
          <span className="mono-label w-16 text-right text-ink">{format(net[slider.key])}</span>
        </label>
      ))}
    </div>
  );
}
