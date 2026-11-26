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
  const scrubCountRef = useRef<HTMLElement>(null);
  const lossRef = useRef<HTMLElement>(null);
  const gradRef = useRef<HTMLElement>(null);
  const thetaRef = useRef<HTMLElement>(null);
  const statusRef = useRef<HTMLElement>(null);
  const scrubRef = useRef<HTMLInputElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const playAfter = useRef(false);
  const [plot, setPlot] = useState<{ width: number; height: number } | null>(null);

  const describe = (index: number, running: boolean) => {
    const current = steps[index];
    if (!current || !statusRef.current) return;
    const outside =
      current.x < DOMAIN.x[0] || current.x > DOMAIN.x[1] || current.y < DOMAIN.y[0] || current.y > DOMAIN.y[1];
    if (outside) statusRef.current.textContent = 'Left the frame';
    else if (running) statusRef.current.textContent = 'Walking';
    else if (index <= 0) statusRef.current.textContent = 'Ready';
    else if (index === steps.length - 1 && current.gradient < 0.02) statusRef.current.textContent = 'Settled';
    else if (index === steps.length - 1) statusRef.current.textContent = 'Step cap';
    else statusRef.current.textContent = 'Paused';
  };

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
    if (scrubCountRef.current) scrubCountRef.current.textContent = String(clamped);
    if (scrubRef.current) {
      scrubRef.current.value = String(clamped);
      scrubRef.current.setAttribute('aria-valuetext', `Step ${clamped} of ${steps.length - 1}`);
    }
    if (lossRef.current) lossRef.current.textContent = formatSigned(current.loss);
    if (gradRef.current) gradRef.current.textContent = current.gradient.toFixed(3);
    if (thetaRef.current) thetaRef.current.textContent = `${current.x.toFixed(2)}, ${current.y.toFixed(2)}`;
    describe(clamped, playing.current !== 0);
  };

  const stop = () => {
    window.clearInterval(playing.current);
    playing.current = 0;
    describe(cursor.current, false);
  };

  useEffect(() => {
    const node = frameRef.current;
    if (!node) return;
    const measure = () => {
      const rect = node.getBoundingClientRect();
      const width = Math.max(0, Math.min(rect.width, rect.height * 1.5));
      const height = width / 1.5;
      setPlot((current) =>
        current && Math.abs(current.width - width) < 0.5 && Math.abs(current.height - height) < 0.5
          ? current
          : { width, height },
      );
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    draw(steps.length - 1);
    if (playAfter.current) {
      playAfter.current = false;
      if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) play();
    }
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
      playAfter.current = true;
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
    window.clearInterval(playing.current);
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      playing.current = 0;
      draw(steps.length - 1);
      return;
    }
    playing.current = -1;
    if (cursor.current >= steps.length - 1) draw(0);
    else describe(cursor.current, true);
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
    playAfter.current = true;
    patch({
      start: [
        Math.round((DOMAIN.x[0] + 0.12 * X_SPAN + u * 0.76 * X_SPAN) * 100) / 100,
        Math.round((DOMAIN.y[0] + 0.12 * Y_SPAN + v * 0.76 * Y_SPAN) * 100) / 100,
      ],
    });
  };

  const onSurfaceClick = (event: MouseEvent<SVGSVGElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    if (bounds.width === 0 || bounds.height === 0) return;
    playAfter.current = true;
    patch({
      start: [
        Math.round((DOMAIN.x[0] + ((event.clientX - bounds.left) / bounds.width) * X_SPAN) * 100) / 100,
        Math.round((DOMAIN.y[1] - ((event.clientY - bounds.top) / bounds.height) * Y_SPAN) * 100) / 100,
      ],
    });
  };

  useEffect(() => {
    const typing = (target: EventTarget | null) => {
      if (!(target instanceof HTMLElement)) return false;
      const tag = target.tagName;
      return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable;
    };
    const onKey = (event: KeyboardEvent) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      if (typing(target) || event.metaKey || event.ctrlKey || event.altKey) return;
      if (document.querySelector('dialog[open]')) return;
      const tag = target.tagName;
      const inLesson = Boolean(target.closest('#lesson-panel'));
      if (event.key === ' ') {
        if (tag === 'BUTTON' || tag === 'A' || tag === 'LABEL' || tag === 'SUMMARY') return;
        event.preventDefault();
        if (playing.current) stop();
        else play();
      } else if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
        if (inLesson) return;
        event.preventDefault();
        stop();
        draw(cursor.current + (event.key === 'ArrowRight' ? 1 : -1));
      } else if (event.key === 'r' || event.key === 'R') {
        event.preventDefault();
        stop();
        draw(0);
      } else if (event.key === 'k' || event.key === 'K') {
        event.preventDefault();
        setCompared((current) => [pathOf(steps, steps.length), ...current].slice(0, 3));
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const settled = steps.at(-1);
  const fullPath = pathOf(steps, steps.length);
  const head = settled ? toSvg(settled.x, settled.y) : toSvg(INITIAL.start[0], INITIAL.start[1]);
  const matches = (preset: Config) =>
    preset.surface === config.surface &&
    preset.optimizer === config.optimizer &&
    preset.learningRate === config.learningRate &&
    preset.momentum === config.momentum &&
    preset.maxSteps === config.maxSteps &&
    preset.start[0] === config.start[0] &&
    preset.start[1] === config.start[1];

  const choice =
    'h-9 border border-line px-2 text-sm text-ink-muted hover:text-ink aria-pressed:border-line-strong aria-pressed:bg-raised aria-pressed:text-ink';

  return (
    <div className="flex h-full min-h-0 flex-col lg:flex-row">
      <div className="@container order-1 flex min-h-0 min-w-0 flex-1 flex-col lg:order-2">
        <dl className="grid grid-cols-2 gap-px bg-line @min-[42rem]:grid-cols-5">
          <div className="bg-canvas px-3 py-2.5">
            <dt className="mono-label text-ink-faint">Step</dt>
            <dd className="num whitespace-nowrap text-ink">
              <span ref={stepRef}>{steps.length - 1}</span>
              <span className="text-ink-faint"> / {steps.length - 1}</span>
            </dd>
          </div>
          <div className="bg-canvas px-3 py-2.5">
            <dt className="mono-label text-ink-faint">Loss</dt>
            <dd ref={lossRef} className="num whitespace-nowrap text-ink">{settled ? formatSigned(settled.loss) : '—'}</dd>
          </div>
          <div className="bg-canvas px-3 py-2.5">
            <dt className="mono-label text-ink-faint">|grad|</dt>
            <dd ref={gradRef} className="num whitespace-nowrap text-ink">{settled ? settled.gradient.toFixed(3) : '—'}</dd>
          </div>
          <div className="bg-canvas px-3 py-2.5">
            <dt className="mono-label text-ink-faint">θ</dt>
            <dd ref={thetaRef} className="num whitespace-nowrap text-ink">{settled ? `${settled.x.toFixed(2)}, ${settled.y.toFixed(2)}` : '—'}</dd>
          </div>
          <div className="col-span-2 bg-canvas px-3 py-2.5 @min-[42rem]:col-span-1">
            <dt className="mono-label text-ink-faint">Status</dt>
            <dd ref={statusRef} className="whitespace-nowrap text-sm text-ink">Settled</dd>
          </div>
        </dl>
        <div ref={frameRef} className="flex min-h-[16rem] flex-1 items-center justify-center">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          role="img"
          aria-labelledby={titleId}
          onClick={onSurfaceClick}
          className="block cursor-crosshair touch-manipulation"
          style={plot && plot.width > 0 ? { width: plot.width, height: plot.height } : { width: '100%', height: 'auto' }}
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
        </div>
        <label className="flex items-center gap-3 border-t border-line px-4 py-2.5">
          <span className="mono-label shrink-0 text-ink-faint">Scrub</span>
          <input
            ref={scrubRef}
            type="range"
            min={0}
            max={Math.max(steps.length - 1, 1)}
            defaultValue={steps.length - 1}
            aria-label="Step"
            onChange={(event) => {
              stop();
              draw(Number(event.currentTarget.value));
            }}
            style={{ accentColor: 'var(--accent)' }}
            className="h-1 w-full"
          />
          <span className="num w-16 shrink-0 text-right text-xs text-ink-muted">
            <span ref={scrubCountRef}>{steps.length - 1}</span>/{steps.length - 1}
          </span>
        </label>
        <p className="border-t border-line px-4 py-3 text-sm leading-relaxed text-ink-muted">
          The surface is designed. It is not the loss of a trained model. Click the surface to move the start. The arrow points downhill; its length is only a visual scale.
        </p>
      </div>

      <form
        className="order-2 grid content-start gap-5 overflow-y-auto border-t border-line p-4 lg:order-1 lg:w-[17.5rem] lg:shrink-0 lg:border-t-0 lg:border-r"
        onSubmit={(event) => {
          event.preventDefault();
          play();
        }}
      >
        <div>
          <p className="mono-label text-ink-faint">Run</p>
          <div className="mt-2 grid grid-cols-4 gap-1">
            <button type="submit" className="h-9 rounded-sm bg-accent text-sm font-medium text-accent-ink">
              Play
            </button>
            <button type="button" onClick={stop} className="h-9 rounded-sm text-sm text-ink-muted hover:bg-raised hover:text-ink">
              Pause
            </button>
            <button type="button" onClick={() => { stop(); draw(cursor.current + 1); }} className="h-9 rounded-sm text-sm text-ink-muted hover:bg-raised hover:text-ink">
              Step
            </button>
            <button type="button" onClick={() => { stop(); draw(0); }} className="h-9 rounded-sm text-sm text-ink-muted hover:bg-raised hover:text-ink">
              Reset
            </button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            <button type="button" onClick={randomStart} className="text-sm text-ink-muted hover:text-ink">
              Random start
            </button>
            <button
              type="button"
              onClick={() => setCompared((current) => [fullPath, ...current].slice(0, 3))}
              className="text-sm text-ink-muted hover:text-ink"
            >
              Keep trace
            </button>
          </div>
        </div>

        <div>
          <p className="mono-label text-ink-faint">Surface</p>
          <div className="mt-2 grid grid-cols-2" role="group" aria-label="Surface">
            <button type="button" aria-pressed={config.surface === 'valleys'} onClick={() => patch({ surface: 'valleys' })} className={choice}>
              Two valleys
            </button>
            <button type="button" aria-pressed={config.surface === 'bowl'} onClick={() => patch({ surface: 'bowl' })} className={choice}>
              Convex bowl
            </button>
          </div>
        </div>

        <div>
          <p className="mono-label text-ink-faint">Optimizer</p>
          <div className="mt-2 grid grid-cols-3" role="group" aria-label="Optimizer">
            {(['sgd', 'momentum', 'adam'] as const).map((optimizer) => (
              <button
                key={optimizer}
                type="button"
                aria-pressed={config.optimizer === optimizer}
                onClick={() => patch({ optimizer })}
                className={choice}
              >
                {optimizer === 'sgd' ? 'SGD' : optimizer === 'adam' ? 'Adam' : 'Momentum'}
              </button>
            ))}
          </div>
        </div>

        <label className="grid gap-1.5">
          <span className="mono-label flex justify-between text-ink-faint">
            Learning rate <span className="num normal-case tracking-normal text-ink">{config.learningRate.toFixed(3)}</span>
          </span>
          <input
            type="range"
            min={0.005}
            max={1.5}
            step={0.005}
            value={config.learningRate}
            aria-valuetext={config.learningRate.toFixed(3)}
            onChange={(event) => patch({ learningRate: Number(event.currentTarget.value) })}
            style={{ accentColor: 'var(--accent)' }}
          />
        </label>

        <label className="grid gap-1.5">
          <span className="mono-label flex justify-between text-ink-faint">
            Momentum{' '}
            <span className="num normal-case tracking-normal text-ink">
              {config.optimizer === 'momentum' ? config.momentum.toFixed(2) : 'unused'}
            </span>
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
            className="disabled:opacity-40"
          />
        </label>

        <div>
          <p className="mono-label text-ink-faint">Presets</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                aria-pressed={matches(preset.config)}
                onClick={() => {
                  if (matches(preset.config)) {
                    play();
                    return;
                  }
                  playAfter.current = true;
                  stop();
                  setConfig(preset.config);
                }}
                className="rounded-sm border border-line px-2 py-2 text-left text-sm text-ink-muted hover:border-line-strong hover:text-ink aria-pressed:border-accent aria-pressed:text-ink"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
        <p className="mono-label flex flex-wrap gap-x-3 gap-y-1 text-ink-faint">
          <span>Space play</span>
          <span>Arrows step</span>
          <span>R reset</span>
          <span>K keep</span>
        </p>
      </form>
    </div>
  );
}
