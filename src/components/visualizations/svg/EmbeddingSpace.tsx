/**
 * Two hand-placed planes. The server render selects king on the usage plane.
 */

import { useId, useState } from 'react';
import { EMBEDDED_TOKENS, type EmbeddingPlane, nearestTokens, tokenPosition } from '@/lib/viz/embeddings';

const SIZE = 360;
const CENTER = SIZE / 2;
const SCALE = 120;

function place(x: number, y: number): { x: number; y: number } {
  return { x: CENTER + x * SCALE, y: CENTER - y * SCALE };
}

export default function EmbeddingSpace() {
  const titleId = useId();
  const [plane, setPlane] = useState<EmbeddingPlane>('usage');
  const [selected, setSelected] = useState('king');
  const neighbours = nearestTokens(selected, plane);
  const neighbourIds = new Set(neighbours.map((token) => token.id));
  const current = EMBEDDED_TOKENS.find((token) => token.id === selected) ?? EMBEDDED_TOKENS[0];
  if (!current) return null;
  const origin = place(...tokenPosition(current, plane));

  return (
    <div className="bg-surface">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-labelledby={titleId} className="mx-auto w-full max-w-md">
        <title id={titleId}>
          {current.label} on the {plane} plane. Nearest: {neighbours.map((token) => token.label).join(', ')}.
        </title>
        <line x1={24} x2={SIZE - 24} y1={CENTER} y2={CENTER} className="stroke-line" />
        <line x1={CENTER} x2={CENTER} y1={24} y2={SIZE - 24} className="stroke-line" />
        {EMBEDDED_TOKENS.map((token) => {
          const at = place(...tokenPosition(token, plane));
          const from = place(...tokenPosition(current, plane));
          const near = neighbourIds.has(token.id);
          return (
            <g key={token.id}>
              {near ? <line x1={from.x} y1={from.y} x2={at.x} y2={at.y} className="stroke-accent" /> : null}
              <circle
                cx={at.x}
                cy={at.y}
                r={token.id === selected ? 7 : 5}
                fill={token.id === selected || near ? 'var(--accent)' : 'currentColor'}
              />
              <text x={at.x + 8} y={at.y - 8} className="fill-ink-muted" fontSize={12}>
                {token.label}
              </text>
            </g>
          );
        })}
        <circle cx={origin.x} cy={origin.y} r={11} fill="none" stroke="var(--accent)" />
      </svg>
      <div className="flex flex-wrap gap-2 border-t border-line px-4 py-3">
        {(['usage', 'spelling'] as const).map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={item === plane}
            onClick={() => setPlane(item)}
            className="mono-label rounded-sm px-3 py-2 text-ink-muted transition-colors duration-200 hover:bg-raised hover:text-ink aria-pressed:bg-raised aria-pressed:text-ink"
          >
            {item === 'usage' ? 'Usage plane' : 'Spelling plane'}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 border-t border-line px-4 py-3">
        {EMBEDDED_TOKENS.map((token) => (
          <button
            key={token.id}
            type="button"
            aria-pressed={token.id === selected}
            onClick={() => setSelected(token.id)}
            className="mono-label rounded-sm px-3 py-2 text-ink-muted transition-colors duration-200 hover:bg-raised hover:text-ink aria-pressed:bg-raised aria-pressed:text-ink"
          >
            {token.label}
          </button>
        ))}
      </div>
      <p className="border-t border-line px-4 py-3 text-sm leading-relaxed text-ink-muted">
        {current.label} on the {plane} plane. The two nearest are {neighbours.map((token) => token.label).join(' and ')}. Both planes were placed by hand. Switching planes is not a rotation of one space.
      </p>
    </div>
  );
}
