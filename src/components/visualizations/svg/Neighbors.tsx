/**
 * k nearest neighbours. The server render is the query at the origin with k = 3,
 * which votes for class 0.
 */

import { useId, useState } from 'react';
import { NEIGHBOR_POINTS, nearest } from '@/lib/viz/neighbors';

const SIZE = 360;
const CENTER = SIZE / 2;
const SCALE = 70;

function format(value: number): string {
  return value.toFixed(2);
}

export default function Neighbors() {
  const titleId = useId();
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [k, setK] = useState(3);
  const vote = nearest(x, y, k);
  const chosen = new Set(vote.neighbors.map((neighbor) => neighbor.index));
  const point = (px: number, py: number) => ({ x: CENTER + px * SCALE, y: CENTER - py * SCALE });
  const query = point(x, y);

  return (
    <div className="bg-surface">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-labelledby={titleId} className="mx-auto w-full max-w-md">
        <title id={titleId}>
          {vote.label === undefined ? 'The k neighbours tie' : `The vote is class ${vote.label}`}
        </title>
        <line x1={24} x2={SIZE - 24} y1={CENTER} y2={CENTER} className="stroke-line" />
        <line x1={CENTER} x2={CENTER} y1={24} y2={SIZE - 24} className="stroke-line" />
        {NEIGHBOR_POINTS.map((neighbor, index) => {
          const at = point(neighbor.x, neighbor.y);
          const queryPoint = point(x, y);
          return (
            <g key={index}>
              {chosen.has(index) ? (
                <line x1={queryPoint.x} y1={queryPoint.y} x2={at.x} y2={at.y} className="stroke-line-strong" />
              ) : null}
              <circle cx={at.x} cy={at.y} r={6} fill={neighbor.label === 0 ? 'currentColor' : 'var(--accent)'} />
            </g>
          );
        })}
        <circle cx={query.x} cy={query.y} r={7} fill="none" stroke="var(--accent)" strokeWidth={2} />
      </svg>
      <div className="flex flex-wrap gap-2 border-t border-line px-4 py-3">
        {[1, 3, 5].map((count) => (
          <button
            key={count}
            type="button"
            aria-pressed={count === k}
            onClick={() => setK(count)}
            className="mono-label rounded-sm px-3 py-2 text-ink-muted transition-colors duration-200 hover:bg-raised hover:text-ink aria-pressed:bg-raised aria-pressed:text-ink"
          >
            k = {count}
          </button>
        ))}
      </div>
      <label className="flex items-center gap-4 border-t border-line px-4 py-3 text-sm text-ink-muted">
        <span className="mono-label w-16 shrink-0">x</span>
        <input type="range" min={-2} max={2} step={0.05} value={x} aria-valuetext={format(x)} onChange={(event) => setX(Number(event.currentTarget.value))} className="w-full" style={{ accentColor: 'var(--accent)' }} />
        <span className="mono-label w-14 text-right text-ink">{format(x)}</span>
      </label>
      <label className="flex items-center gap-4 border-t border-line px-4 py-3 text-sm text-ink-muted">
        <span className="mono-label w-16 shrink-0">y</span>
        <input type="range" min={-2} max={2} step={0.05} value={y} aria-valuetext={format(y)} onChange={(event) => setY(Number(event.currentTarget.value))} className="w-full" style={{ accentColor: 'var(--accent)' }} />
        <span className="mono-label w-14 text-right text-ink">{format(y)}</span>
      </label>
      <p className="border-t border-line px-4 py-3 text-sm leading-relaxed text-ink-muted">
        Query ({format(x)}, {format(y)}), k = {k}. Ink points are class 0. Accent points are class 1. Lines mark the neighbours in the vote.{' '}
        {vote.label === undefined ? 'The two classes tie.' : `The vote is class ${vote.label}.`} An equal distance keeps the earlier point in the fixed list.
      </p>
    </div>
  );
}
