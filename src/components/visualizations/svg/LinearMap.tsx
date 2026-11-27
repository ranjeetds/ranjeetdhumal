/**
 * A 2×2 matrix acting on the plane. The server render is the Stretch preset
 * applied to (1, 0.5). The columns of the matrix are where the basis arrows go.
 */

import { useId, useState } from 'react';
import {
  DEFAULT_INPUT,
  MAP_PRESETS,
  apply,
  determinant,
  fixedLineSentence,
  fixedLines,
  formatCoord,
  formatPair,
  rank,
  type MapPreset,
} from '@/lib/viz/linear-map';
import type { Vec } from '@/lib/viz/dot';

const WIDTH = 480;
const HEIGHT = 400;
const CENTER = { x: 240, y: 200 };
const SCALE = 58;

function openingPreset(): MapPreset {
  const preset = MAP_PRESETS[0];
  if (!preset) throw new Error('Linear map presets are missing.');
  return preset;
}

function toSvg(v: Vec): { x: number; y: number } {
  return { x: CENTER.x + v[0] * SCALE, y: CENTER.y - v[1] * SCALE };
}

function circleImage(matrix: MapPreset['matrix']): string {
  const points: string[] = [];
  for (let step = 0; step <= 64; step += 1) {
    const angle = (step / 64) * Math.PI * 2;
    const image = toSvg(apply(matrix, [Math.cos(angle), Math.sin(angle)]));
    points.push(`${image.x.toFixed(1)},${image.y.toFixed(1)}`);
  }
  return points.join(' ');
}

export default function LinearMap() {
  const titleId = useId();
  const [preset, setPreset] = useState<MapPreset>(openingPreset);
  const [input, setInput] = useState<Vec>(DEFAULT_INPUT);
  const matrix = preset.matrix;
  const image = apply(matrix, input);
  const lines = fixedLines(matrix);
  const e1 = apply(matrix, [1, 0]);
  const e2 = apply(matrix, [0, 1]);
  const tip = toSvg(image);
  const start = toSvg([0, 0]);
  const basis = [e1, e2] as const;

  return (
    <div className="bg-surface">
      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-labelledby={titleId} className="mx-auto w-full max-w-xl">
        <title id={titleId}>
          {preset.label}. Rank {rank(matrix)}. {formatPair(input)} goes to {formatPair(image)}. {fixedLineSentence(lines)}
        </title>
        <line x1={28} x2={WIDTH - 28} y1={CENTER.y} y2={CENTER.y} className="stroke-line" />
        <line x1={CENTER.x} x2={CENTER.x} y1={24} y2={HEIGHT - 24} className="stroke-line" />
        <circle cx={CENTER.x} cy={CENTER.y} r={SCALE} className="fill-none stroke-line" />
        {lines.kind === 'lines' &&
          lines.values.map((line) => {
            const length = Math.hypot(line.direction[0], line.direction[1]) || 1;
            const unit: Vec = [line.direction[0] / length, line.direction[1] / length];
            const from = toSvg([-unit[0] * 3.2, -unit[1] * 3.2]);
            const to = toSvg([unit[0] * 3.2, unit[1] * 3.2]);
            return (
              <line
                key={`${line.lambda}`}
                x1={from.x}
                y1={from.y}
                x2={to.x}
                y2={to.y}
                className="stroke-signal"
                strokeDasharray="4 4"
                strokeOpacity={0.85}
              />
            );
          })}
        <polyline points={circleImage(matrix)} className="fill-none stroke-accent" strokeWidth={1.5} />
        {basis.map((vector, index) => {
          const end = toSvg(vector);
          const key = `column-${index}`;
          if (Math.hypot(vector[0], vector[1]) < 1e-9) {
            return (
              <path
                key={key}
                d={`M${start.x - 5} ${start.y}h10M${start.x} ${start.y - 5}v10`}
                className="stroke-ink"
                strokeWidth={1.25}
              />
            );
          }
          return (
            <g key={key}>
              <line x1={start.x} y1={start.y} x2={end.x} y2={end.y} className="stroke-ink" strokeWidth={1.5} />
              <circle cx={end.x} cy={end.y} r={3.5} className="fill-ink" />
            </g>
          );
        })}
        <line x1={start.x} y1={start.y} x2={tip.x} y2={tip.y} className="stroke-signal" strokeWidth={2} />
        <circle cx={tip.x} cy={tip.y} r={4} className="fill-signal" />
      </svg>

      <div className="flex flex-wrap gap-2 border-t border-line px-4 py-3" role="group" aria-label="Matrix">
        {MAP_PRESETS.map((item) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={item.id === preset.id}
            onClick={() => setPreset(item)}
            className="rounded-sm border border-line px-2 py-1.5 text-sm text-ink-muted hover:text-ink aria-pressed:border-accent aria-pressed:text-ink"
          >
            {item.label}
          </button>
        ))}
      </div>

      {(
        [
          ['x', input[0], (value: number) => setInput([value, input[1]])],
          ['y', input[1], (value: number) => setInput([input[0], value])],
        ] as const
      ).map(([label, value, set]) => (
        <label key={label} className="flex items-center gap-4 border-t border-line px-4 py-3 text-sm text-ink-muted">
          <span className="mono-label w-16 shrink-0">{label}</span>
          <input
            type="range"
            min={-1.5}
            max={1.5}
            step={0.05}
            value={value}
            aria-valuetext={formatCoord(value)}
            onChange={(event) => set(Number(event.currentTarget.value))}
            className="w-full"
            style={{ accentColor: 'var(--accent)' }}
          />
          <span className="num w-14 text-right text-ink">{formatCoord(value)}</span>
        </label>
      ))}

      <p className="border-t border-line px-4 py-3 text-sm leading-relaxed text-ink-muted">
        {preset.label}. Rank {rank(matrix)}. Determinant {formatCoord(determinant(matrix))}. e1 goes to {formatPair(e1)}.
        e2 goes to {formatPair(e2)}. The input {formatPair(input)} goes to {formatPair(image)}. {fixedLineSentence(lines)} The
        ink arrows are the columns. The amber curve is the unit circle after the map. A dashed line is a direction that
        stays on itself.
      </p>
    </div>
  );
}
