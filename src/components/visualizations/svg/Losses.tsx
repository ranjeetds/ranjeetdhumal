/**
 * Mean squared error and binary cross-entropy against one target. The server
 * render is squared error of prediction 0.2 against target 1.
 */

import { useId, useState } from 'react';
import { lossCurve, lossValue, type LossId } from '@/lib/viz/losses';

const WIDTH = 720;
const HEIGHT = 280;
const PAD_X = 48;
const PAD_TOP = 20;
const PAD_BOTTOM = 36;

function format(value: number): string {
  return value.toFixed(2);
}

export default function Losses() {
  const titleId = useId();
  const [id, setId] = useState<LossId>('mse');
  const [prediction, setPrediction] = useState(0.2);
  const [target, setTarget] = useState(1);
  const label: 0 | 1 = target >= 0.5 ? 1 : 0;
  const usedTarget = id === 'mse' ? target : label;
  const value = lossValue(id, prediction, usedTarget);
  const samples = lossCurve(id, usedTarget);
  const peak = Math.max(...samples.map((sample) => sample.loss), value, 0.01);
  const plotWidth = WIDTH - PAD_X * 2;
  const plotHeight = HEIGHT - PAD_TOP - PAD_BOTTOM;
  const xOf = (p: number) => PAD_X + p * plotWidth;
  const yOf = (loss: number) => PAD_TOP + (1 - loss / peak) * plotHeight;
  const curve = samples
    .map(
      (sample, index) =>
        `${index === 0 ? 'M' : 'L'}${xOf(sample.prediction).toFixed(2)} ${yOf(sample.loss).toFixed(2)}`,
    )
    .join(' ');

  return (
    <div className="bg-surface">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-labelledby={titleId} className="w-full">
        <title id={titleId}>
          {id === 'mse' ? 'Squared error' : 'Cross-entropy'} {format(value)} at prediction {format(prediction)}
        </title>
        <line
          x1={PAD_X}
          x2={WIDTH - PAD_X}
          y1={HEIGHT - PAD_BOTTOM}
          y2={HEIGHT - PAD_BOTTOM}
          className="stroke-line-strong"
        />
        <path d={curve} fill="none" stroke="var(--accent)" strokeWidth={2} />
        <line
          x1={xOf(prediction)}
          x2={xOf(prediction)}
          y1={PAD_TOP}
          y2={HEIGHT - PAD_BOTTOM}
          className="stroke-ink"
        />
        <circle cx={xOf(prediction)} cy={yOf(value)} r={5} fill="var(--accent)" />
        <text x={PAD_X} y={HEIGHT - 12} fontSize={11} className="fill-ink-faint">
          0
        </text>
        <text x={WIDTH - PAD_X} y={HEIGHT - 12} fontSize={11} textAnchor="end" className="fill-ink-faint">
          1
        </text>
      </svg>

      <div className="flex flex-wrap gap-2 border-t border-line px-4 py-3">
        <button
          type="button"
          aria-pressed={id === 'mse'}
          onClick={() => setId('mse')}
          className="mono-label rounded-sm px-3 py-2 text-ink-muted transition-colors duration-200 hover:bg-raised hover:text-ink aria-pressed:bg-raised aria-pressed:text-ink"
        >
          Squared error
        </button>
        <button
          type="button"
          aria-pressed={id === 'bce'}
          onClick={() => setId('bce')}
          className="mono-label rounded-sm px-3 py-2 text-ink-muted transition-colors duration-200 hover:bg-raised hover:text-ink aria-pressed:bg-raised aria-pressed:text-ink"
        >
          Cross-entropy
        </button>
        {id === 'bce' ? (
          <>
            <button
              type="button"
              aria-pressed={label === 0}
              onClick={() => setTarget(0)}
              className="mono-label rounded-sm px-3 py-2 text-ink-muted transition-colors duration-200 hover:bg-raised hover:text-ink aria-pressed:bg-raised aria-pressed:text-ink"
            >
              Label 0
            </button>
            <button
              type="button"
              aria-pressed={label === 1}
              onClick={() => setTarget(1)}
              className="mono-label rounded-sm px-3 py-2 text-ink-muted transition-colors duration-200 hover:bg-raised hover:text-ink aria-pressed:bg-raised aria-pressed:text-ink"
            >
              Label 1
            </button>
          </>
        ) : null}
      </div>
      <label className="flex items-center gap-4 border-t border-line px-4 py-3 text-sm text-ink-muted">
        <span className="mono-label w-24 shrink-0">prediction</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={prediction}
          aria-valuetext={format(prediction)}
          onChange={(event) => setPrediction(Number(event.currentTarget.value))}
          className="w-full"
          style={{ accentColor: 'var(--accent)' }}
        />
        <span className="mono-label w-14 text-right text-ink">{format(prediction)}</span>
      </label>
      {id === 'mse' ? (
        <label className="flex items-center gap-4 border-t border-line px-4 py-3 text-sm text-ink-muted">
          <span className="mono-label w-24 shrink-0">target</span>
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={target}
            aria-valuetext={format(target)}
            onChange={(event) => setTarget(Number(event.currentTarget.value))}
            className="w-full"
          style={{ accentColor: 'var(--accent)' }}
          />
          <span className="mono-label w-14 text-right text-ink">{format(target)}</span>
        </label>
      ) : null}
      <p className="border-t border-line px-4 py-3 text-sm leading-relaxed text-ink-muted">
        {id === 'mse'
          ? `Squared error of ${format(prediction)} against ${format(target)} is ${format(value)}. The curve is lowest at the target.`
          : `Cross-entropy of ${format(prediction)} for label ${label} is ${format(value)}. The log is clamped just inside 0 and 1.`}
      </p>
    </div>
  );
}
