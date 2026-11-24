/**
 * A straight cut, an axis-aligned tree, and a product score on one exclusive-or.
 * The server render is the linear cut at the start of the designed path.
 */

import { useId, useState } from 'react';
import {
  BOUNDARY_MODELS,
  BOUNDARY_POINTS,
  type BoundaryModel,
  boundaryLabel,
  boundaryMistakes,
  linearCut,
  treeCuts,
} from '@/lib/viz/boundaries';

const SIZE = 360;
const MIN = -1.8;
const MAX = 1.8;

function place(x: number, y: number): { x: number; y: number } {
  return {
    x: ((x - MIN) / (MAX - MIN)) * SIZE,
    y: ((MAX - y) / (MAX - MIN)) * SIZE,
  };
}

const MODEL_LABEL: Record<BoundaryModel, string> = {
  linear: 'Linear cut',
  tree: 'Tree',
  network: 'Small network',
};

export default function DecisionBoundaries() {
  const titleId = useId();
  const [model, setModel] = useState<BoundaryModel>('linear');
  const [fit, setFit] = useState(0);
  const [probeX, setProbeX] = useState(0.4);
  const [probeY, setProbeY] = useState(0.4);
  const mistakes = boundaryMistakes(model, fit);
  const probe = boundaryLabel(model, probeX, probeY, fit);
  const cut = linearCut(fit);
  const cuts = treeCuts(fit);
  const from = place(cut.x1, cut.y1);
  const to = place(cut.x2, cut.y2);
  const cells = 36;
  const cell = SIZE / cells;

  return (
    <div className="bg-surface">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-labelledby={titleId} className="mx-auto w-full max-w-md">
        <title id={titleId}>
          {MODEL_LABEL[model]} mislabels {mistakes} of the eight fixed points. The probe is class {probe}.
        </title>
        {model === 'network' &&
          Array.from({ length: cells * cells }, (_, index) => {
            const column = index % cells;
            const row = Math.floor(index / cells);
            const x = MIN + ((column + 0.5) / cells) * (MAX - MIN);
            const y = MAX - ((row + 0.5) / cells) * (MAX - MIN);
            const label = boundaryLabel('network', x, y, fit);
            return (
              <rect
                key={index}
                x={column * cell}
                y={row * cell}
                width={cell + 0.4}
                height={cell + 0.4}
                fill={label === 1 ? 'var(--accent)' : 'currentColor'}
                opacity={0.14}
              />
            );
          })}
        {model === 'tree' && (
          <g className="stroke-accent" fill="none" strokeWidth={1.5}>
            <line x1={place(cuts.x, 0).x} x2={place(cuts.x, 0).x} y1={0} y2={SIZE} />
            <line x1={0} x2={SIZE} y1={place(0, cuts.y).y} y2={place(0, cuts.y).y} />
          </g>
        )}
        {model === 'linear' && (
          <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} className="stroke-accent" strokeWidth={1.5} />
        )}
        {BOUNDARY_POINTS.map((point, index) => {
          const at = place(point.x, point.y);
          const wrong = boundaryLabel(model, point.x, point.y, fit) !== point.label;
          return (
            <g key={index}>
              {point.label === 0 ? (
                <circle cx={at.x} cy={at.y} r={6} fill="currentColor" />
              ) : (
                <rect x={at.x - 5} y={at.y - 5} width={10} height={10} fill="var(--accent)" />
              )}
              {wrong ? <circle cx={at.x} cy={at.y} r={11} fill="none" stroke="currentColor" strokeDasharray="2 2" /> : null}
            </g>
          );
        })}
        <circle cx={place(probeX, probeY).x} cy={place(probeX, probeY).y} r={7} fill="none" stroke="var(--accent)" strokeWidth={2} />
      </svg>
      <div className="flex flex-wrap gap-2 border-t border-line px-4 py-3">
        {BOUNDARY_MODELS.map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={item === model}
            onClick={() => setModel(item)}
            className="mono-label rounded-sm px-3 py-2 text-ink-muted transition-colors duration-200 hover:bg-raised hover:text-ink aria-pressed:bg-raised aria-pressed:text-ink"
          >
            {MODEL_LABEL[item]}
          </button>
        ))}
      </div>
      <label className="flex items-center gap-4 border-t border-line px-4 py-3 text-sm text-ink-muted">
        <span className="mono-label w-16 shrink-0">Fit</span>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={fit}
          aria-valuetext={fit.toFixed(2)}
          onChange={(event) => setFit(Number(event.currentTarget.value))}
          className="w-full"
          style={{ accentColor: 'var(--accent)' }}
        />
        <span className="mono-label w-14 text-right text-ink">{fit.toFixed(2)}</span>
      </label>
      <label className="flex items-center gap-4 border-t border-line px-4 py-3 text-sm text-ink-muted">
        <span className="mono-label w-16 shrink-0">Probe x</span>
        <input
          type="range"
          min={-1.6}
          max={1.6}
          step={0.05}
          value={probeX}
          aria-valuetext={probeX.toFixed(2)}
          onChange={(event) => setProbeX(Number(event.currentTarget.value))}
          className="w-full"
          style={{ accentColor: 'var(--accent)' }}
        />
        <span className="mono-label w-14 text-right text-ink">{probeX.toFixed(2)}</span>
      </label>
      <label className="flex items-center gap-4 border-t border-line px-4 py-3 text-sm text-ink-muted">
        <span className="mono-label w-16 shrink-0">Probe y</span>
        <input
          type="range"
          min={-1.6}
          max={1.6}
          step={0.05}
          value={probeY}
          aria-valuetext={probeY.toFixed(2)}
          onChange={(event) => setProbeY(Number(event.currentTarget.value))}
          className="w-full"
          style={{ accentColor: 'var(--accent)' }}
        />
        <span className="mono-label w-14 text-right text-ink">{probeY.toFixed(2)}</span>
      </label>
      <p className="border-t border-line px-4 py-3 text-sm leading-relaxed text-ink-muted">
        Ink circles are class 0. Accent squares are class 1. A dashed ring is a fixed point this rule gets wrong.{' '}
        {MODEL_LABEL[model]} at fit {fit.toFixed(2)} misses {mistakes} of 8. The probe at ({probeX.toFixed(2)}, {probeY.toFixed(2)}) is called class {probe}. The fit is a designed path between two rules, not a training run.
      </p>
    </div>
  );
}
