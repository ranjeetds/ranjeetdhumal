/**
 * A dot product of two plane vectors, and the angle it implies.
 * A zero vector has no direction, so the angle is absent.
 */

export type Vec = readonly [number, number];

export function dot(a: Vec, b: Vec): number {
  return a[0] * b[0] + a[1] * b[1];
}

export function norm(v: Vec): number {
  return Math.hypot(v[0], v[1]);
}

/** Angle between the vectors, in degrees, or undefined if either has length 0. */
export function angleDegrees(a: Vec, b: Vec): number | undefined {
  const left = norm(a);
  const right = norm(b);
  if (left < 1e-9 || right < 1e-9) return undefined;
  const cosine = Math.min(1, Math.max(-1, dot(a, b) / (left * right)));
  return (Math.acos(cosine) * 180) / Math.PI;
}
