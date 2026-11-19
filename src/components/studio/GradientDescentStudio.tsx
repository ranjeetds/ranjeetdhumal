/**
 * Gradient descent as a studio instrument.
 *
 * The server render is the settled run for the default preset, so the figure is
 * complete without JavaScript. Play, step, and parameter changes write the trace
 * through refs. The path itself comes from `optimize` in `@/lib/viz/loss-surface`.
 */

import { useEffect, useId, useMemo, useRef, useState, type MouseEvent } from 'react';
import { contourLines, extent, sampleGrid, simplify, toPathData, type Point } from '@/lib/viz/contours';
import {
  DOMAIN,
  type DescentStep,
  type OptimizerId,
  type SurfaceId,
  optimize,
  surfaceGradient,
  surfaceLoss,
} from '@/lib/viz/loss-surface';

const WIDTH = 720;
const HEIGHT = 480;
const X_SPAN = DOMAIN.x[1] - DOMAIN.x[0];
const Y_SPAN = DOMAIN.y[1] - DOMAIN.y[0];

const toSvg = (x: number, y: number): Point => [
  ((x - DOMAIN.x[0]) / X_SPAN) * WIDTH,
  ((DOMAIN.y[1] - y) / Y_SPAN) * HEIGHT,
];

const round = (value: number) => Math.round(value * 10) / 10;
const formatSigned = (value: number, digits = 3) =>
  `${value < 0 ? '−' : '+'}${Math.abs(value).toFixed(digits)}`;

interface Config {
  surface: SurfaceId;
  optimizer: OptimizerId;
  learningRate: number;
  momentum: number;
  maxSteps: number;
  start: Point;
}

const INITIAL: Config = {
  surface: 'valleys',
  optimizer: 'momentum',
  learningRate: 0.045,
  momentum: 0.88,
  maxSteps: 120,
  start: [-2.55, -1.45],
};

const PRESETS: readonly { id: string; label: string; config: Config }[] = [
  { id: 'ridge', label: 'Across the ridge', config: INITIAL },
  {
    id: 'deep',
    label: 'Deeper valley',
    config: { ...INITIAL, start: [2.55, 1.55] },
  },
  {
    id: 'steep',
    label: 'Too steep',
    config: { ...INITIAL, optimizer: 'momentum', learningRate: 1.2, momentum: 0.9, start: [-2.55, -1.45] },
  },
  {
    id: 'bowl',
    label: 'Convex bowl',
    config: {
      surface: 'bowl',
      optimizer: 'sgd',
      learningRate: 0.35,
      momentum: 0,
      maxSteps: 80,
      start: [-2.2, 1.4],
    },
  },
];

function contoursFor(surface: SurfaceId) {
  const cols = 97;
  const rows = 65;
  const grid = sampleGrid(
    (x, y) => surfaceLoss(surface, x, y),
    DOMAIN.x,
    [DOMAIN.y[1], DOMAIN.y[0]],
    cols,
    rows,
  );
  const [min, max] = extent(grid);
  return Array.from({ length: 12 }, (_, index) => {
    const height = (index + 1) / 13;
    const lines = contourLines(grid, min + (max - min) * height).map((line) =>
      simplify(
        line.map(([col, row]): Point => [(col * WIDTH) / (cols - 1), (row * HEIGHT) / (rows - 1)]),
        0.35,
      ),
    );
    return { d: toPathData(lines), opacity: 0.12 + 0.4 * (1 - height) ** 1.6 };
  });
}

function minima(surface: SurfaceId): Point[] {
  const seeds: Point[] = surface === 'bowl' ? [[0.4, -0.2]] : [[1.25, -0.45], [-1.45, 0.65]];
  return seeds.map((seed) => {
    const steps = optimize(surface, seed, {
      learningRate: 0.08,
      momentum: 0.5,
      maxSteps: 80,
      optimizer: 'momentum',
    });
    const last = steps.at(-1);
    return last ? [last.x, last.y] : seed;
  });
}

function pathOf(steps: readonly DescentStep[], count: number): string {
  return steps
    .slice(0, count)
    .map((step) => {
      const [x, y] = toSvg(step.x, step.y);
      return `${round(x)},${round(y)}`;
    })
    .join(' ');
}

function readConfig(search: string): Config | undefined {
  const params = new URLSearchParams(search);
  const surface = params.get('surface');
  const optimizer = params.get('opt');
  if (surface !== 'valleys' && surface !== 'bowl') return undefined;
  if (optimizer !== 'sgd' && optimizer !== 'momentum' && optimizer !== 'adam') return undefined;
  const learningRate = Number(params.get('lr'));
  const momentum = Number(params.get('mu'));
  const x = Number(params.get('x'));
  const y = Number(params.get('y'));
  const maxSteps = Number(params.get('steps'));
  if (![learningRate, momentum, x, y].every((value) => Number.isFinite(value))) return undefined;
  return {
    surface,
    optimizer,
    learningRate,
    momentum,
    maxSteps: Number.isFinite(maxSteps) && maxSteps >= 1 && maxSteps <= 400 ? maxSteps : surface === 'bowl' ? 80 : 120,
    start: [x, y],
  };
}

export default function GradientDescentStudio() {
  const titleId = useId();
  const [config, setConfig] = useState<Config>(INITIAL);
  const [compared, setCompared] = useState<string[]>([]);
  const [seed, setSeed] = useState(1);
  const steps = useMemo(
    () =>
      optimize(config.surface, config.start, {
        learningRate: config.learningRate,
        momentum: config.momentum,
        maxSteps: config.maxSteps,
        optimizer: config.optimizer,
      }),
    [config],
  );
  const contours = useMemo(() => contoursFor(config.surface), [config.surface]);
  const marks = useMemo(() => minima(config.surface), [config.surface]);
  const cursor = useRef(steps.length - 1);
  const playing = useRef(0);
  const trailRef = useRef<SVGPolylineElement>(null);
  const headRef = useRef<SVGGElement>(null);
  const arrowRef = useRef<SVGLineElement>(null);
  const stepRef = useRef<HTMLElement>(null);
  const lossRef = useRef<HTMLElement>(null);
  const gradRef = useRef<HTMLElement>(null);
  const thetaRef = useRef<HTMLElement>(null);
  const statusRef = useRef<HTMLElement>(null);

  const draw = (index: number) => {
    const clamped = Math.min(Math.max(index, 0), steps.length - 1);
    cursor.current = clamped;
    const current = steps[clamped];
    if (!current) return;
    trailRef.current?.setAttribute('points', pathOf(steps, clamped + 1));
    const [hx, hy] = toSvg(current.x, current.y);
    headRef.current?.setAttribute('transform', `translate(${round(hx)} ${round(hy)})`);
    const [gx, gy] = surfaceGradient(config.surface, current.x, current.y);
    const scale = 0.35 / Math.max(Math.hypot(gx, gy), 0.15);
    const [ax, ay] = toSvg(current.x - gx * scale, current.y - gy * scale);
    arrowRef.current?.setAttribute('x1', String(round(hx)));
    arrowRef.current?.setAttribute('y1', String(round(hy)));
    arrowRef.current?.setAttribute('x2', String(round(ax)));
    arrowRef.current?.setAttribute('y2', String(round(ay)));
    if (stepRef.current) stepRef.current.textContent = String(clamped);
    if (lossRef.current) lossRef.current.textContent = formatSigned(current.loss);
    if (gradRef.current) gradRef.current.textContent = current.gradient.toFixed(3);
    if (thetaRef.current) thetaRef.current.textContent = `${current.x.toFixed(2)}, ${current.y.toFixed(2)}`;
    if (statusRef.current) {
      const outside = current.x < DOMAIN.x[0] || current.x > DOMAIN.x[1] || current.y < DOMAIN.y[0] || current.y > DOMAIN.y[1];
      const settled = clamped === steps.length - 1 && current.gradient < 0.02;
      statusRef.current.textContent = outside ? 'Left the frame' : settled ? 'Settled' : 'Walking';
    }
  };

  const stop = () => {
    window.clearInterval(playing.current);
    playing.current = 0;
  };

  useEffect(() => {
    const motion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    draw(motion ? steps.length - 1 : steps.length - 1);
    return stop;
    // draw closes over the latest steps. Re-running when the path changes is the point.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [steps, config.surface]);

  const urlReady = useRef(false);
  useEffect(() => {
    const onPreset = (event: Event) => {
      if (!(event instanceof CustomEvent) || typeof event.detail !== 'string') return;
      const preset = PRESETS.find((item) => item.id === event.detail);
      if (!preset) return;
      stop();
      setConfig(preset.config);
    };
    window.addEventListener('studio-preset', onPreset);
    return () => window.removeEventListener('studio-preset', onPreset);
  }, []);

  useEffect(() => {
    if (!urlReady.current) {
      urlReady.current = true;
      const restored = readConfig(window.location.search);
      if (restored) {
        setConfig(restored);
        return;
      }
    }
    const params = new URLSearchParams(window.location.search);
    params.set('surface', config.surface);
    params.set('opt', config.optimizer);
    params.set('lr', String(config.learningRate));
    params.set('mu', String(config.momentum));
    params.set('x', config.start[0].toFixed(2));
    params.set('y', config.start[1].toFixed(2));
    params.set('steps', String(config.maxSteps));
    const next = `${window.location.pathname}?${params}${window.location.hash}`;
    if (`${window.location.pathname}${window.location.search}${window.location.hash}` !== next) {
      window.history.replaceState(null, '', next);
    }
  }, [config]);

  const patch = (partial: Partial<Config>) => {
    stop();
    setConfig((current) => ({ ...current, ...partial }));
  };

  const play = () => {
    stop();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      draw(steps.length - 1);
      return;
    }
    if (cursor.current >= steps.length - 1) draw(0);
    playing.current = window.setInterval(() => {
      if (cursor.current >= steps.length - 1) {
        stop();
        return;
      }
      draw(cursor.current + 1);
    }, 42);
  };

  const randomStart = () => {
    const next = seed + 1;
    setSeed(next);
    const a = Math.sin(next * 12.9898) * 43758.5453;
    const b = Math.sin(next * 78.233) * 24634.6345;
    const u = a - Math.floor(a);
    const v = b - Math.floor(b);
    patch({
      start: [DOMAIN.x[0] + 0.12 * X_SPAN + u * 0.76 * X_SPAN, DOMAIN.y[0] + 0.12 * Y_SPAN + v * 0.76 * Y_SPAN],
    });
  };

  const onSurfaceClick = (event: MouseEvent<SVGSVGElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    patch({
      start: [
        DOMAIN.x[0] + ((event.clientX - bounds.left) / bounds.width) * X_SPAN,
        DOMAIN.y[1] - ((event.clientY - bounds.top) / bounds.height) * Y_SPAN,
      ],
    });
  };

  const settled = steps.at(-1);
  const fullPath = pathOf(steps, steps.length);
  const head = settled ? toSvg(settled.x, settled.y) : toSvg(INITIAL.start[0], INITIAL.start[1]);

  return (
    <div className="lg:grid lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-start">
      <div className="min-w-0 border-b border-line lg:border-r lg:border-b-0">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-labelledby={titleId}
          onClick={onSurfaceClick}
          className="block h-auto w-full cursor-crosshair touch-manipulation"
        >
          <title id={titleId}>Loss surface with an optimization trace</title>
          <g className="stroke-ink" fill="none" strokeWidth={1}>
            {contours.map((contour, index) => (
              <path key={index} d={contour.d} strokeOpacity={round(contour.opacity * 100) / 100} />
            ))}
          </g>
          {marks.map((mark) => {
            const [x, y] = toSvg(mark[0], mark[1]);
            return (
              <path
                key={`${mark[0]}-${mark[1]}`}
                d={`M${round(x - 6)} ${round(y)}h12M${round(x)} ${round(y - 6)}v12`}
                className="stroke-ink"
                strokeWidth={1.25}
              />
            );
          })}
          {compared.map((points) => (
            <polyline key={points.slice(0, 24)} points={points} className="stroke-ink-faint" fill="none" strokeWidth={1.5} />
          ))}
          <polyline
            ref={trailRef}
            points={fullPath}
            className="stroke-accent"
            fill="none"
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <line ref={arrowRef} className="stroke-signal" strokeWidth={1.5} />
          <g ref={headRef} transform={`translate(${round(head[0])} ${round(head[1])})`}>
            <circle r={11} className="fill-accent/20" />
            <circle r={4} className="fill-accent" />
          </g>
        </svg>
        <dl className="mono-label grid grid-cols-2 gap-x-4 gap-y-1 border-t border-line px-4 py-3 text-ink-faint sm:grid-cols-5">
          <div><dt>Step</dt><dd ref={stepRef} className="text-ink">{steps.length - 1}</dd></div>
          <div><dt>Loss</dt><dd ref={lossRef} className="text-ink">{settled ? formatSigned(settled.loss) : '—'}</dd></div>
          <div><dt>|grad|</dt><dd ref={gradRef} className="text-ink">{settled ? settled.gradient.toFixed(3) : '—'}</dd></div>
          <div><dt>θ</dt><dd ref={thetaRef} className="text-ink">{settled ? `${settled.x.toFixed(2)}, ${settled.y.toFixed(2)}` : '—'}</dd></div>
          <div><dt>Status</dt><dd ref={statusRef} className="text-ink">Settled</dd></div>
        </dl>
      </div>

      <form
        className="grid gap-4 p-4"
        onSubmit={(event) => {
          event.preventDefault();
          play();
        }}
      >
        <div className="flex flex-wrap gap-2">
          <button type="submit" className="mono-label rounded-sm bg-ink px-3 py-2 text-canvas">Play</button>
          <button type="button" onClick={stop} className="mono-label rounded-sm px-3 py-2 text-ink-muted hover:bg-raised hover:text-ink">Pause</button>
          <button type="button" onClick={() => { stop(); draw(cursor.current + 1); }} className="mono-label rounded-sm px-3 py-2 text-ink-muted hover:bg-raised hover:text-ink">Step</button>
          <button type="button" onClick={() => { stop(); draw(0); }} className="mono-label rounded-sm px-3 py-2 text-ink-muted hover:bg-raised hover:text-ink">Reset</button>
        </div>

        <label className="grid gap-1.5">
          <span className="mono-label text-ink-faint">Surface</span>
          <select
            value={config.surface}
            onChange={(event) => patch({ surface: event.currentTarget.value === 'bowl' ? 'bowl' : 'valleys' })}
            className="h-10 border border-line-strong bg-canvas px-2 text-sm text-ink"
          >
            <option value="valleys">Two valleys</option>
            <option value="bowl">Convex bowl</option>
          </select>
        </label>

        <label className="grid gap-1.5">
          <span className="mono-label text-ink-faint">Optimizer</span>
          <select
            value={config.optimizer}
            onChange={(event) => {
              const value = event.currentTarget.value;
              const optimizer: OptimizerId = value === 'adam' || value === 'sgd' ? value : 'momentum';
              patch({ optimizer });
            }}
            className="h-10 border border-line-strong bg-canvas px-2 text-sm text-ink"
          >
            <option value="sgd">SGD</option>
            <option value="momentum">Momentum</option>
            <option value="adam">Adam</option>
          </select>
        </label>

        <label className="grid gap-1.5">
          <span className="mono-label flex justify-between text-ink-faint">
            Learning rate <span className="text-ink">{config.learningRate.toFixed(3)}</span>
          </span>
          <input
            type="range"
            min={0.005}
            max={1.5}
            step={0.005}
            value={config.learningRate}
            onChange={(event) => patch({ learningRate: Number(event.currentTarget.value) })}
            style={{ accentColor: 'var(--accent)' }}
          />
        </label>

        <label className="grid gap-1.5">
          <span className="mono-label flex justify-between text-ink-faint">
            Momentum <span className="text-ink">{config.optimizer === 'momentum' ? config.momentum.toFixed(2) : 'unused'}</span>
          </span>
          <input
            type="range"
            min={0}
            max={0.95}
            step={0.01}
            value={config.momentum}
            disabled={config.optimizer !== 'momentum'}
            onChange={(event) => patch({ momentum: Number(event.currentTarget.value) })}
            style={{ accentColor: 'var(--accent)' }}
          />
        </label>

        <div className="grid gap-2">
          <span className="mono-label text-ink-faint">Presets</span>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => {
                  stop();
                  setConfig(preset.config);
                }}
                className="mono-label rounded-sm border border-line px-2 py-1.5 text-ink-muted hover:border-line-strong hover:text-ink"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={randomStart} className="mono-label rounded-sm px-3 py-2 text-ink-muted hover:bg-raised hover:text-ink">
            Random start
          </button>
          <button
            type="button"
            onClick={() => setCompared((current) => [fullPath, ...current].slice(0, 3))}
            className="mono-label rounded-sm px-3 py-2 text-ink-muted hover:bg-raised hover:text-ink"
          >
            Keep this trace
          </button>
        </div>
        <p className="text-sm leading-relaxed text-ink-muted">
          Click the surface to move the start. The arrow is the downhill direction at the current point. A kept trace stays while you change the settings.
        </p>
      </form>
    </div>
  );
}
