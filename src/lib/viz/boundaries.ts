/**
 * Three designed decision rules on the same eight points.
 * The points are an exclusive-or: opposite corners share a label.
 * A straight cut cannot label them all. An axis-aligned tree can, and so can
 * a score that uses the product of the coordinates. The fit slider walks from
 * a useless rule to that designed rule. It is not a training run.
 */

export interface BoundaryPoint {
  x: number;
  y: number;
  label: 0 | 1;
}

export const BOUNDARY_POINTS: readonly BoundaryPoint[] = [
  { x: -1.1, y: -0.9, label: 0 },
  { x: -0.7, y: -1.2, label: 0 },
  { x: 0.9, y: 0.8, label: 0 },
  { x: 1.2, y: 1.15, label: 0 },
  { x: -1.05, y: 0.95, label: 1 },
  { x: -0.7, y: 1.25, label: 1 },
  { x: 1.0, y: -0.85, label: 1 },
  { x: 1.25, y: -1.15, label: 1 },
];

export type BoundaryModel = 'linear' | 'tree' | 'network';

export const BOUNDARY_MODELS: readonly BoundaryModel[] = ['linear', 'tree', 'network'];

function lerp(from: number, to: number, t: number): number {
  return from + (to - from) * t;
}

/** Class predicted by the selected rule at fit t, in [0, 1]. */
export function boundaryLabel(model: BoundaryModel, x: number, y: number, fit: number): 0 | 1 {
  const t = Math.min(1, Math.max(0, fit));
  if (model === 'linear') {
    const angle = lerp(0, Math.PI / 5, t);
    const offset = lerp(0.15, 0, t);
    const score = Math.cos(angle) * x + Math.sin(angle) * y + offset;
    return score >= 0 ? 1 : 0;
  }
  if (model === 'tree') {
    const tx = lerp(2.4, 0, t);
    const ty = lerp(2.4, 0, t);
    const left = x < tx;
    const below = y < ty;
    return left === below ? 0 : 1;
  }
  const line = x;
  const product = -x * y;
  const score = lerp(line, product, t);
  return score >= 0 ? 1 : 0;
}

export function boundaryMistakes(model: BoundaryModel, fit: number): number {
  return BOUNDARY_POINTS.filter((point) => boundaryLabel(model, point.x, point.y, fit) !== point.label).length;
}

/** Thresholds the tree draws. Off-screen at fit 0, on the axes at fit 1. */
export function treeCuts(fit: number): { x: number; y: number } {
  const t = Math.min(1, Math.max(0, fit));
  return { x: lerp(2.4, 0, t), y: lerp(2.4, 0, t) };
}

/** Two points on the linear zero-contour, in data coordinates. */
export function linearCut(fit: number): { x1: number; y1: number; x2: number; y2: number } {
  const t = Math.min(1, Math.max(0, fit));
  const angle = lerp(0, Math.PI / 5, t);
  const offset = lerp(0.15, 0, t);
  const nx = Math.cos(angle);
  const ny = Math.sin(angle);
  const px = -offset * nx;
  const py = -offset * ny;
  const tx = -ny;
  const ty = nx;
  return { x1: px - tx * 3, y1: py - ty * 3, x2: px + tx * 3, y2: py + ty * 3 };
}
