/**
 * A population z-score. The standard deviation divides by the count, not by
 * count minus one. A constant vector has standard deviation 0, and every
 * z-score is then 0.
 */

export interface Centered {
  mean: number;
  /** Population standard deviation. */
  deviation: number;
  z: number[];
}

export function center(values: readonly number[]): Centered {
  const count = values.length;
  const mean = values.reduce((sum, value) => sum + value, 0) / count;
  const variance = values.reduce((sum, value) => sum + (value - mean) ** 2, 0) / count;
  const deviation = Math.sqrt(variance);
  return {
    mean,
    deviation,
    z: values.map((value) => (deviation === 0 ? 0 : (value - mean) / deviation)),
  };
}
