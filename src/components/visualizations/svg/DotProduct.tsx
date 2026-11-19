/**
 * Two arrows and their dot product. The server render is (1, 0) against
 * (0.6, 0.8). The angle is omitted when either arrow has length 0.
 */

import { useId, useState } from 'react';
import { angleDegrees, dot, norm, type Vec } from '@/lib/viz/dot';

const SIZE = 360;
const CENTER = SIZE / 2;
const SCALE = 70;

function format(value: number): string {
  return value.toFixed(2);
}

export default function DotProduct() {
  const titleId = useId();
  const [a, setA] = useState<Vec>([1, 0]);
  const [b, setB] = useState<Vec>([0.6, 0.8]);
  const product = dot(a, b);
  const angle = angleDegrees(a, b);
  const point = (v: Vec) => ({ x: CENTER + v[0] * SCALE, y: CENTER - v[1] * SCALE });
  const tipA = point(a);
  const tipB = point(b);

  const sliders: { label: string; value: number; set: (value: number) => void }[] = [
    { label: 'a1', value: a[0], set: (value) => setA([value, a[1]]) },
    { label: 'a2', value: a[1], set: (value) => setA([a[0], value]) },
    { label: 'b1', value: b[0], set: (value) => setB([value, b[1]]) },
    { label: 'b2', value: b[1], set: (value) => setB([b[0], value]) },
  ];

  return (
    <div className="bg-surface">
      <svg viewBox={`0 0 ${SIZE} ${SIZE}`} role="img" aria-labelledby={titleId} className="mx-auto w-full max-w-md">
        <title id={titleId}>
          Dot product {format(product)}
          {angle === undefined ? ', angle undefined' : `, angle ${format(angle)} degrees`}
        </title>
        <line x1={24} x2={SIZE - 24} y1={CENTER} y2={CENTER} className="stroke-line" />
        <line x1={CENTER} x2={CENTER} y1={24} y2={SIZE - 24} className="stroke-line" />
        <line x1={CENTER} y1={CENTER} x2={tipA.x} y2={tipA.y} className="stroke-ink" strokeWidth={2} />
        <line x1={CENTER} y1={CENTER} x2={tipB.x} y2={tipB.y} stroke="var(--accent)" strokeWidth={2} />
        <circle cx={tipA.x} cy={tipA.y} r={4} className="fill-ink" />
        <circle cx={tipB.x} cy={tipB.y} r={4} fill="var(--accent)" />
      </svg>

      {sliders.map((slider) => (
        <label
          key={slider.label}
          className="flex items-center gap-4 border-t border-line px-4 py-3 text-sm text-ink-muted"
        >
          <span className="mono-label w-16 shrink-0">{slider.label}</span>
          <input
            type="range"
            min={-2}
            max={2}
            step={0.05}
            value={slider.value}
            aria-valuetext={format(slider.value)}
            onChange={(event) => slider.set(Number(event.currentTarget.value))}
            className="w-full"
            style={{ accentColor: 'var(--accent)' }}
          />
          <span className="mono-label w-14 text-right text-ink">{format(slider.value)}</span>
        </label>
      ))}
      <p className="border-t border-line px-4 py-3 text-sm leading-relaxed text-ink-muted">
        a · b = {format(product)}. |a| = {format(norm(a))}, |b| = {format(norm(b))}.{' '}
        {angle === undefined
          ? 'One vector has length 0, so there is no angle.'
          : `The angle between them is ${format(angle)} degrees.`}
      </p>
    </div>
  );
}
