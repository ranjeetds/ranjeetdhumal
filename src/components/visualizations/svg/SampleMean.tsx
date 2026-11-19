/**
 * A sample drawn from a fixed skewed population, drawn as two histograms and two means.
 *
 * The server render is draw 1 at sample size 30. Changing the size keeps the same
 * shuffle and adds points. Drawing again starts a new shuffle. There is no animation,
 * so reduced motion and the static render are the same picture.
 */

import { useId, useState } from 'react';
import {
  BIN_COUNT,
  POPULATION,
  POPULATION_MEAN,
  SAMPLE_SIZES,
  type SampleSize,
  drawSample,
  histogram,
  mean,
  populationExtent,
  spread,
} from '@/lib/viz/sample';

const WIDTH = 720;
const HEIGHT = 280;
const PAD_X = 28;
const PAD_TOP = 16;
const PAD_BOTTOM = 36;
const PLOT_WIDTH = WIDTH - PAD_X * 2;
const PLOT_HEIGHT = HEIGHT - PAD_TOP - PAD_BOTTOM;

const format = (value: number) => value.toFixed(1);

const xOf = (value: number) =>
  PAD_X + ((value - populationExtent.min) / (populationExtent.max - populationExtent.min)) * PLOT_WIDTH;

export default function SampleMean() {
  const titleId = useId();
  const [size, setSize] = useState<SampleSize>(30);
  const [draw, setDraw] = useState(1);

  const sample = drawSample(10_000 + draw, size);
  const sampleMean = mean(sample);
  const sampleSpread = spread(sample);
  const populationBins = histogram(POPULATION, BIN_COUNT);
  const sampleBins = histogram(sample, BIN_COUNT);
  const fractions = [
    ...populationBins.map((count) => count / POPULATION.length),
    ...sampleBins.map((count) => count / sample.length),
  ];
  const tallest = Math.max(...fractions, 0.001);
  const slot = PLOT_WIDTH / BIN_COUNT;
  const gap = 3;
  const barHeight = (fraction: number) => (fraction / tallest) * PLOT_HEIGHT;

  return (
    <div>
      <p id={titleId} className="sr-only">
        A histogram of a designed population and one sample drawn from it. The sample mean and the
        population mean are marked. Change the sample size or draw again.
      </p>

      <div className="flex flex-wrap items-center gap-2 border-b border-line px-4 py-3">
        <div role="group" aria-label="Sample size" className="flex flex-wrap gap-2">
          {SAMPLE_SIZES.map((candidate) => (
            <button
              key={candidate}
              type="button"
              aria-pressed={candidate === size}
              onClick={() => setSize(candidate)}
              className="mono-label rounded-sm px-3 py-2 text-ink-muted transition-colors duration-200 hover:bg-raised hover:text-ink aria-pressed:bg-raised aria-pressed:text-ink"
            >
              n = {candidate}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={() => setDraw((current) => current + 1)}
          className="mono-label rounded-sm px-3 py-2 text-ink-muted transition-colors duration-200 hover:bg-raised hover:text-ink"
        >
          Draw again
        </button>
      </div>

      <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} role="img" aria-labelledby={titleId} className="w-full">
        {populationBins.map((count, index) => {
          const height = barHeight(count / POPULATION.length);
          const sampleCount = sampleBins[index] ?? 0;
          const sampleHeight = barHeight(sampleCount / sample.length);
          const x = PAD_X + index * slot;
          return (
            <g key={index}>
              <rect
                x={x + gap / 2}
                y={PAD_TOP + PLOT_HEIGHT - height}
                width={slot - gap}
                height={height}
                className="fill-line"
              />
              <rect
                x={x + gap}
                y={PAD_TOP + PLOT_HEIGHT - sampleHeight}
                width={Math.max(0, slot - gap * 2)}
                height={sampleHeight}
                fill="var(--accent)"
                opacity={0.9}
              />
            </g>
          );
        })}

        <line
          x1={PAD_X}
          x2={WIDTH - PAD_X}
          y1={PAD_TOP + PLOT_HEIGHT}
          y2={PAD_TOP + PLOT_HEIGHT}
          className="stroke-line-strong"
        />
        <line
          x1={xOf(POPULATION_MEAN)}
          x2={xOf(POPULATION_MEAN)}
          y1={PAD_TOP}
          y2={PAD_TOP + PLOT_HEIGHT}
          className="stroke-ink-faint"
          strokeDasharray="3 4"
        />
        <line
          x1={xOf(sampleMean)}
          x2={xOf(sampleMean)}
          y1={PAD_TOP}
          y2={PAD_TOP + PLOT_HEIGHT}
          stroke="var(--accent)"
          strokeWidth={2}
        />
        <text x={PAD_X} y={HEIGHT - 12} fontSize={11} className="fill-ink-faint">
          {format(populationExtent.min)}
        </text>
        <text x={xOf(POPULATION_MEAN)} y={HEIGHT - 12} fontSize={11} textAnchor="middle" className="fill-ink-faint">
          population {format(POPULATION_MEAN)}
        </text>
        <text x={WIDTH - PAD_X} y={HEIGHT - 12} fontSize={11} textAnchor="end" className="fill-ink-faint">
          {format(populationExtent.max)}
        </text>
      </svg>

      <p className="border-t border-line px-4 py-3 text-sm leading-relaxed text-ink-muted">
        Draw {draw}, n = {size}. The sample mean is {format(sampleMean)} and its spread is{' '}
        {format(sampleSpread)}. The population mean is {format(POPULATION_MEAN)}. The grey bars are
        the whole population. The coloured bars are this draw. A larger n on the same draw keeps
        these points and adds more.
      </p>
    </div>
  );
}
