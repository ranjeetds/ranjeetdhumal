/**
 * Gradient descent with momentum on a two-dimensional, non-convex loss surface.
 *
 * Architecture notes (this file is the reference implementation for future figures):
 *  - The server render is a complete, static figure. Hydration only adds interaction,
 *    so the figure is meaningful with JavaScript disabled or still loading.
 *  - Animation writes straight to the DOM from a Motion tween. React renders once per
 *    run, never once per frame.
 *  - Reduced motion: runs appear in their final state instead of animating.
 *  - Pointer interaction has a keyboard equivalent (the "New descent" button).
 *  - Motion is imported piecemeal. `animateValue` plus the hooks cost about 10 kB gzipped;
 *    the general `animate()` is 26 kB and the `motion.*` components 48 kB, so reach for
 *    those only when a figure needs what they add (layout, gestures, springs on elements).
 */

import { animateValue, useInView, useReducedMotion } from 'motion/react';
import { type MouseEvent, useCallback, useEffect, useId, useRef, useState } from 'react';
import {
  type Point,
  contourLines,
  extent,
  sampleGrid,
  simplify,
  toPathData,
} from '@/lib/viz/contours';
import { DOMAIN, descend, loss } from '@/lib/viz/loss-surface';

/* ------------------------------------------------------------------ geometry */

const WIDTH = 720;
const HEIGHT = 480;
const X_SPAN = DOMAIN.x[1] - DOMAIN.x[0];
const Y_SPAN = DOMAIN.y[1] - DOMAIN.y[0];

/** Parameter space → SVG user space (y flipped so "up" is positive, as on paper). */
const toSvg = ([x, y]: Point): Point => [
  ((x - DOMAIN.x[0]) / X_SPAN) * WIDTH,
  ((DOMAIN.y[1] - y) / Y_SPAN) * HEIGHT,
];

const round = (value: number) => Math.round(value * 10) / 10;

/* ------------------------------------------------------------------ static scene */
// Computed once per module load: at build time for the server render and once in the
// browser on hydration (a few milliseconds), rather than shipped twice as props.

const CONTOUR_COUNT = 14;

const CONTOURS = (() => {
  const cols = 121;
  const rows = 81;
  // Sample top-to-bottom so grid rows line up with SVG's downward y axis.
  const grid = sampleGrid(loss, DOMAIN.x, [DOMAIN.y[1], DOMAIN.y[0]], cols, rows);
  const [min, max] = extent(grid);

  return Array.from({ length: CONTOUR_COUNT }, (_, i) => {
    const height = (i + 1) / (CONTOUR_COUNT + 1);
    const lines = contourLines(grid, min + (max - min) * height).map((line) =>
      simplify(
        line.map(([col, row]): Point => [(col * WIDTH) / (cols - 1), (row * HEIGHT) / (rows - 1)]),
        0.3,
      ),
    );
    // Lower contours are drawn stronger, so the valleys read as depth.
    return { d: toPathData(lines), opacity: 0.1 + 0.42 * (1 - height) ** 1.6 };
  });
})();

// Found numerically by descending from a point inside each valley.
const VALLEYS: readonly { label: string; start: Point }[] = [
  { label: 'Global min', start: [1.25, -0.45] },
  { label: 'Local min', start: [-1.45, 0.65] },
];

const MINIMA = VALLEYS.map(({ label, start }) => {
  const point = descend(start).points.at(-1) as Point;
  const [x, y] = toSvg(point);
  return { label, x, y, loss: loss(point[0], point[1]) };
});

const X_TICKS = [-2, -1, 0, 1, 2].map((x) => toSvg([x, 0])[0]);
const Y_TICKS = [-1, 0, 1].map((y) => toSvg([0, y])[1]);

/* ------------------------------------------------------------------ runs */

/** The server-rendered run: it starts on the far side of the ridge and gets trapped. */
const FIRST_START: Point = [-2.55, -1.45];
/** Played once when the figure first scrolls into view; this one finds the deeper valley. */
const SECOND_START: Point = [2.55, 1.55];
/** Starting points for the "New descent" button, chosen to alternate between valleys. */
const SEEDS: readonly Point[] = [
  [-0.35, 1.7],
  [0.2, -1.8],
  [-2.7, 1.6],
  [2.8, -1.7],
  [-2.9, -0.2],
  [0.1, 0.9],
];

const MAX_RUNS = 4;
/** Trace opacity by age: the newest run is solid, older ones recede. */
const OPACITY_BY_AGE = [1, 0.4, 0.22, 0.1];
const MS_PER_STEP = 26;

interface Run {
  id: number;
  /** Positions in SVG user space, one per optimizer step. */
  points: Point[];
  /** `points` pre-formatted as "x,y" for building polyline strings cheaply. */
  coords: string[];
  losses: number[];
  animated: boolean;
}

function createRun(id: number, start: Point, animated: boolean): Run {
  const { points, losses } = descend(start);
  const svgPoints = points.map(toSvg);
  return {
    id,
    points: svgPoints,
    coords: svgPoints.map(([x, y]) => `${round(x)},${round(y)}`),
    losses,
    animated,
  };
}

interface Frame {
  x: number;
  y: number;
  step: number;
  loss: number;
  /** Polyline `points` for the path travelled so far. */
  trail: string;
}

/** The state of a run at `progress` ∈ [0, 1], interpolating between optimizer steps. */
function sample(run: Run, progress: number): Frame {
  const lastIndex = run.points.length - 1;
  const position = Math.min(Math.max(progress, 0), 1) * lastIndex;
  const index = Math.min(Math.floor(position), lastIndex - 1);
  const t = position - index;

  const [ax, ay] = run.points[index] as Point;
  const [bx, by] = run.points[index + 1] as Point;
  const lossA = run.losses[index] as number;
  const lossB = run.losses[index + 1] as number;
  const x = ax + (bx - ax) * t;
  const y = ay + (by - ay) * t;

  return {
    x,
    y,
    step: Math.round(position),
    loss: lossA + (lossB - lossA) * t,
    trail: `${run.coords.slice(0, index + 1).join(' ')} ${round(x)},${round(y)}`,
  };
}

const formatStep = (step: number) => String(step).padStart(3, '0');
/** Signed, fixed-width loss with a typographic minus so digits do not shift as it changes. */
const formatLoss = (value: number, digits = 3) =>
  `${value < 0 ? '−' : '+'}${Math.abs(value).toFixed(digits)}`;

/* ------------------------------------------------------------------ components */

interface RunTraceProps {
  run: Run;
  /** 0 for the newest run, counting up for older ones. */
  age: number;
  onFrame: (runId: number, frame: Frame) => void;
}

function RunTrace({ run, age, onFrame }: RunTraceProps) {
  const trailRef = useRef<SVGPolylineElement>(null);
  const headRef = useRef<SVGGElement>(null);
  const startProgress = run.animated ? 0 : 1;
  // Frozen at mount so React never fights the per-frame DOM writes below.
  const [initial] = useState(() => sample(run, startProgress));
  const [startX, startY] = run.points[0] as Point;

  const draw = useCallback(
    (progress: number) => {
      const frame = sample(run, progress);
      trailRef.current?.setAttribute('points', frame.trail);
      headRef.current?.setAttribute('transform', `translate(${round(frame.x)} ${round(frame.y)})`);
      onFrame(run.id, frame);
    },
    [run, onFrame],
  );

  useEffect(() => {
    draw(startProgress);
    if (!run.animated) return;
    const animation = animateValue({
      keyframes: [0, 1],
      duration: (run.points.length - 1) * MS_PER_STEP,
      ease: 'linear', // each step takes equal time, so the optimizer's own dynamics show
      onUpdate: draw,
    });
    return () => animation.stop();
  }, [run, startProgress, draw]);

  return (
    <g
      className="transition-opacity duration-700"
      style={{ opacity: OPACITY_BY_AGE[age] ?? 0 }}
    >
      <polyline
        ref={trailRef}
        points={initial.trail}
        className="stroke-accent"
        fill="none"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={round(startX)}
        cy={round(startY)}
        r={4}
        className="fill-surface stroke-ink-muted"
        strokeWidth={1.25}
      />
      <g ref={headRef} transform={`translate(${round(initial.x)} ${round(initial.y)})`}>
        <circle r={12} className="fill-accent/20" />
        <circle r={4.5} className="fill-accent" />
      </g>
    </g>
  );
}

export default function GradientDescent() {
  const rootRef = useRef<HTMLDivElement>(null);
  const stepRef = useRef<HTMLElement>(null);
  const lossRef = useRef<HTMLElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const glowId = useId();

  const reduceMotion = useReducedMotion();
  const inView = useInView(rootRef, { once: true, amount: 0.5 });

  const [runs, setRuns] = useState<Run[]>(() => [createRun(0, FIRST_START, false)]);
  const [initialFrame] = useState(() => sample(runs[0] as Run, 1));
  const nextId = useRef(1);
  const latestId = useRef(0);
  const nextSeed = useRef(0);
  const hasLaunched = useRef(false);

  const launch = useCallback(
    (start: Point) => {
      const run = createRun(nextId.current++, start, !reduceMotion);
      latestId.current = run.id;
      hasLaunched.current = true;
      setRuns((current) => [...current, run].slice(-MAX_RUNS));
    },
    [reduceMotion],
  );

  // The readout follows the newest run only; older runs may still be finishing.
  const handleFrame = useCallback((runId: number, frame: Frame) => {
    if (runId !== latestId.current) return;
    if (stepRef.current) stepRef.current.textContent = formatStep(frame.step);
    if (lossRef.current) lossRef.current.textContent = formatLoss(frame.loss);
  }, []);

  // One unprompted run when the figure first comes into view, to show that it is alive
  // and that a different start reaches a different minimum. Then it waits for the reader.
  useEffect(() => {
    if (!inView || reduceMotion || hasLaunched.current) return;
    const timer = window.setTimeout(() => {
      if (!hasLaunched.current) launch(SECOND_START);
    }, 700);
    return () => window.clearTimeout(timer);
  }, [inView, reduceMotion, launch]);

  const handleClick = (event: MouseEvent<SVGSVGElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    launch([
      DOMAIN.x[0] + ((event.clientX - bounds.left) / bounds.width) * X_SPAN,
      DOMAIN.y[1] - ((event.clientY - bounds.top) / bounds.height) * Y_SPAN,
    ]);
  };

  const handleNewDescent = () => {
    launch(SEEDS[nextSeed.current++ % SEEDS.length] as Point);
  };

  return (
    <div ref={rootRef}>
      <div className="relative">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-labelledby={`${titleId} ${descriptionId}`}
          onClick={handleClick}
          className="block h-auto w-full cursor-crosshair touch-manipulation select-none"
        >
          <title id={titleId}>Gradient descent on a loss surface</title>
          <desc id={descriptionId}>
            A contour map of a loss surface with two valleys separated by a ridge. Traces show an
            optimizer rolling downhill from different starting points: some settle in the deeper,
            global minimum on the right, others are trapped in the shallower local minimum on the
            left.
          </desc>

          <defs>
            <radialGradient id={glowId}>
              <stop offset="0" style={{ stopColor: 'var(--accent)', stopOpacity: 0.16 }} />
              <stop offset="1" style={{ stopColor: 'var(--accent)', stopOpacity: 0 }} />
            </radialGradient>
          </defs>

          {/* A faint warmth in each valley, scaled by its depth. */}
          {MINIMA.map((minimum) => (
            <circle
              key={minimum.label}
              cx={round(minimum.x)}
              cy={round(minimum.y)}
              r={round(130 * Math.abs(minimum.loss))}
              fill={`url(#${glowId})`}
            />
          ))}

          <g className="stroke-ink" fill="none" strokeWidth={1}>
            {CONTOURS.map((contour, i) => (
              <path
                key={i}
                d={contour.d}
                strokeOpacity={round(contour.opacity * 100) / 100}
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </g>

          <g className="stroke-ink-faint" strokeWidth={1}>
            {X_TICKS.map((x) => (
              <line key={`x${x}`} x1={x} x2={x} y1={HEIGHT} y2={HEIGHT - 7} />
            ))}
            {Y_TICKS.map((y) => (
              <line key={`y${y}`} x1={0} x2={7} y1={y} y2={y} />
            ))}
          </g>

          <g className="stroke-ink" strokeWidth={1.25} strokeLinecap="round">
            {MINIMA.map((minimum) => (
              <path
                key={minimum.label}
                d={`M${round(minimum.x - 7)} ${round(minimum.y)}h14M${round(minimum.x)} ${round(minimum.y - 7)}v14`}
              />
            ))}
          </g>

          {runs.map((run, i) => (
            <RunTrace key={run.id} run={run} age={runs.length - 1 - i} onFrame={handleFrame} />
          ))}
        </svg>

        {/* Labels are HTML so they stay legible when the SVG scales down. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 font-mono text-[0.6875rem] text-ink-faint"
        >
          {MINIMA.map((minimum) => (
            // Sits below the marker on a translucent chip, so traces spiralling into the
            // minimum pass behind the text instead of through it.
            <span
              key={minimum.label}
              className="absolute hidden -translate-x-1/2 translate-y-6 rounded-xs bg-surface/85 px-1.5 py-0.5 tracking-wide whitespace-nowrap sm:block"
              style={{
                left: `${round((minimum.x / WIDTH) * 100)}%`,
                top: `${round((minimum.y / HEIGHT) * 100)}%`,
              }}
            >
              {minimum.label} <span className="text-ink-muted">{formatLoss(minimum.loss, 2)}</span>
            </span>
          ))}
          <span className="absolute top-2 left-3">θ₂</span>
          <span className="absolute right-3 bottom-2">θ₁</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 border-t border-line py-1.5 pr-1.5 pl-4">
        <dl className="mono-label flex gap-x-5 text-ink-faint tabular-nums">
          <div className="flex gap-2">
            <dt>Step</dt>
            <dd ref={stepRef} className="text-ink">
              {formatStep(initialFrame.step)}
            </dd>
          </div>
          <div className="flex gap-2">
            <dt>Loss</dt>
            <dd ref={lossRef} className="text-ink">
              {formatLoss(initialFrame.loss)}
            </dd>
          </div>
        </dl>
        <button
          type="button"
          onClick={handleNewDescent}
          className="mono-label rounded-sm px-3 py-2 text-ink-muted transition-colors duration-200 hover:bg-raised hover:text-ink"
        >
          New descent
        </button>
      </div>
    </div>
  );
}
