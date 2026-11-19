/**
 * A small non-convex "loss surface" and a momentum optimizer that walks down it.
 *
 * This is the model behind the gradient-descent figure. It is deliberately pure and
 * framework-free so the same maths can drive a React island, a build-time SVG, or a test.
 */

import type { Point } from './contours.ts';

/** Parameter-space bounds shown by the figure (θ₁ horizontal, θ₂ vertical). */
export const DOMAIN = { x: [-3, 3], y: [-2, 2] } as const;

/** Hyper-parameters. The Python listing on the homepage is rendered from these values. */
export const OPTIMIZER = { learningRate: 0.045, momentum: 0.88, maxSteps: 160 } as const;

interface Gaussian {
  x: number;
  y: number;
  /** Positive values dig a well, negative values raise a bump. */
  depth: number;
  width: number;
}

// Two wells of different depth separated by a ridge: where a run ends depends on where
// it starts, which is the whole point of the figure.
const FEATURES: readonly Gaussian[] = [
  { x: 1.25, y: -0.45, depth: 1.15, width: 0.95 },
  { x: -1.45, y: 0.65, depth: 0.8, width: 0.75 },
  { x: -0.05, y: 0.15, depth: -0.45, width: 0.4 },
];

/** A shallow bowl keeps every trajectory inside the frame. */
const BOWL = { x: 0.07, y: 0.11 } as const;

export function loss(x: number, y: number): number {
  let value = BOWL.x * x * x + BOWL.y * y * y;
  for (const f of FEATURES) {
    const dx = x - f.x;
    const dy = y - f.y;
    value -= f.depth * Math.exp(-(dx * dx + dy * dy) / f.width);
  }
  return value;
}

export function gradient(x: number, y: number): [dx: number, dy: number] {
  let gx = 2 * BOWL.x * x;
  let gy = 2 * BOWL.y * y;
  for (const f of FEATURES) {
    const dx = x - f.x;
    const dy = y - f.y;
    const slope = ((2 * f.depth) / f.width) * Math.exp(-(dx * dx + dy * dy) / f.width);
    gx += slope * dx;
    gy += slope * dy;
  }
  return [gx, gy];
}

export interface Trajectory {
  /** Position after each step, starting with the initial point. */
  points: Point[];
  /** Loss at each position; same length as `points`. */
  losses: number[];
}

/** Gradient descent with momentum from `start`, stopping early once it has settled. */
export function descend(start: Point): Trajectory {
  const { learningRate, momentum, maxSteps } = OPTIMIZER;
  let [x, y] = start;
  let vx = 0;
  let vy = 0;

  const points: Point[] = [[x, y]];
  const losses: number[] = [loss(x, y)];

  for (let step = 0; step < maxSteps; step++) {
    const [gx, gy] = gradient(x, y);
    vx = momentum * vx - learningRate * gx;
    vy = momentum * vy - learningRate * gy;
    x += vx;
    y += vy;
    points.push([x, y]);
    losses.push(loss(x, y));

    if (Math.hypot(vx, vy) < 5e-4 && Math.hypot(gx, gy) < 5e-3) break;
  }

  return { points, losses };
}
