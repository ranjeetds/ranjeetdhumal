/**
 * A 2×2 matrix as a map of the plane.
 * The matrix is stored by rows: (x, y) goes to (a x + b y, c x + d y).
 * The columns are the images of (1, 0) and (0, 1).
 */

import type { Vec } from '@/lib/viz/dot';

export type Mat = readonly [readonly [number, number], readonly [number, number]];

export interface MapPreset {
  id: 'stretch' | 'rotate' | 'shear' | 'drop' | 'diagonal';
  label: string;
  matrix: Mat;
}

export const MAP_PRESETS: readonly MapPreset[] = [
  { id: 'stretch', label: 'Stretch', matrix: [[2, 0], [0, 0.5]] },
  { id: 'rotate', label: 'Rotate 90°', matrix: [[0, -1], [1, 0]] },
  { id: 'shear', label: 'Shear', matrix: [[1, 1], [0, 1]] },
  { id: 'drop', label: 'Drop the vertical', matrix: [[1, 0], [0, 0]] },
  { id: 'diagonal', label: 'Onto the diagonal', matrix: [[0.5, 0.5], [0.5, 0.5]] },
];

export const DEFAULT_INPUT: Vec = [1, 0.5];

export function apply(matrix: Mat, v: Vec): Vec {
  return [
    matrix[0][0] * v[0] + matrix[0][1] * v[1],
    matrix[1][0] * v[0] + matrix[1][1] * v[1],
  ];
}

export function determinant(matrix: Mat): number {
  return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
}

/** 2 when both columns survive, 1 when they are parallel, 0 when both are zero. */
export function rank(matrix: Mat): 0 | 1 | 2 {
  const first = Math.hypot(matrix[0][0], matrix[1][0]);
  const second = Math.hypot(matrix[0][1], matrix[1][1]);
  if (first < 1e-9 && second < 1e-9) return 0;
  if (Math.abs(determinant(matrix)) < 1e-9) return 1;
  return 2;
}

export interface FixedLine {
  lambda: number;
  direction: Vec;
}

export type FixedLines =
  | { kind: 'none' }
  | { kind: 'plane'; lambda: number }
  | { kind: 'lines'; values: readonly FixedLine[] };

function kernelDirection(matrix: Mat, lambda: number): Vec {
  const a = matrix[0][0] - lambda;
  const b = matrix[0][1];
  const c = matrix[1][0];
  const d = matrix[1][1] - lambda;
  const rows: readonly Vec[] = [
    [a, b],
    [c, d],
  ];
  for (const row of rows) {
    if (Math.hypot(row[0], row[1]) > 1e-8) return [-row[1], row[0]];
  }
  return [1, 0];
}

function parallel(a: Vec, b: Vec): boolean {
  return Math.abs(a[0] * b[1] - a[1] * b[0]) <= 1e-8 * Math.hypot(a[0], a[1]) * Math.hypot(b[0], b[1]);
}

/** Real directions the map sends along themselves, and the scale on each. */
export function fixedLines(matrix: Mat): FixedLines {
  const trace = matrix[0][0] + matrix[1][1];
  const det = determinant(matrix);
  const discriminant = trace * trace - 4 * det;
  if (discriminant < -1e-8) return { kind: 'none' };
  const root = Math.sqrt(Math.max(0, discriminant));
  const lambdas = discriminant < 1e-8 ? [trace / 2] : [(trace + root) / 2, (trace - root) / 2];
  if (lambdas.length === 1) {
    const lambda = lambdas[0] ?? 0;
    const a = matrix[0][0] - lambda;
    const b = matrix[0][1];
    const c = matrix[1][0];
    const d = matrix[1][1] - lambda;
    if (Math.hypot(a, b, c, d) < 1e-8) return { kind: 'plane', lambda };
  }
  const values: FixedLine[] = [];
  for (const lambda of lambdas) {
    const direction = kernelDirection(matrix, lambda);
    if (values.some((item) => parallel(item.direction, direction))) continue;
    values.push({ lambda, direction });
  }
  return { kind: 'lines', values };
}

export function formatCoord(value: number): string {
  const text = (Math.round(value * 100) / 100).toFixed(2);
  return text.startsWith('-') ? `\u2212${text.slice(1)}` : text;
}

export function formatPair(v: Vec): string {
  return `(${formatCoord(v[0])}, ${formatCoord(v[1])})`;
}

export function fixedLineSentence(lines: FixedLines): string {
  if (lines.kind === 'none') return 'No real direction stays on its own line.';
  if (lines.kind === 'plane') {
    return `Every direction stays on its line, with scale ${formatCoord(lines.lambda)}.`;
  }
  const scales = lines.values.map((line) => formatCoord(line.lambda)).join(' and ');
  return lines.values.length === 1
    ? `One direction stays on its line, with scale ${scales}.`
    : `Two directions stay on their lines, with scales ${scales}.`;
}
