/**
 * A fixed, skewed population and samples drawn from it without replacement.
 *
 * The population is generated once from a seed, so the server render and the
 * browser agree. A larger sample on the same draw keeps the smaller sample and
 * adds to it: the shuffle is a prefix.
 */

function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function buildPopulation(count: number, seed: number): number[] {
  const random = mulberry32(seed);
  const values: number[] = [];
  for (let index = 0; index < count; index += 1) {
    const tail = random() < 0.22;
    const value = tail ? 9 + random() * 9 : 2 + random() * 5;
    values.push(Math.round(value * 10) / 10);
  }
  return values;
}

export const POPULATION: readonly number[] = buildPopulation(240, 7);
export const SAMPLE_SIZES = [8, 30, 120] as const;
export type SampleSize = (typeof SAMPLE_SIZES)[number];
export const BIN_COUNT = 12;

const POPULATION_MIN = Math.min(...POPULATION);
const POPULATION_MAX = Math.max(...POPULATION);

export const populationExtent = { min: POPULATION_MIN, max: POPULATION_MAX };

export function mean(values: readonly number[]): number {
  if (values.length === 0) throw new Error('Mean of an empty set.');
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

/** Root mean square distance from the mean of these values. */
export function spread(values: readonly number[]): number {
  const center = mean(values);
  const square = values.reduce((total, value) => total + (value - center) ** 2, 0) / values.length;
  return Math.sqrt(square);
}

export const POPULATION_MEAN = mean(POPULATION);

/**
 * The first `size` items of one shuffle. The same seed and a larger size
 * return a sample that contains the smaller one.
 */
export function drawSample(seed: number, size: SampleSize): number[] {
  const random = mulberry32(seed);
  const pool = [...POPULATION];
  for (let index = 0; index < size; index += 1) {
    const swap = index + Math.floor(random() * (pool.length - index));
    const current = pool[index];
    const next = pool[swap];
    if (current === undefined || next === undefined) throw new Error('Sample index out of range.');
    pool[index] = next;
    pool[swap] = current;
  }
  return pool.slice(0, size);
}

export function histogram(values: readonly number[], bins: number): number[] {
  const counts = Array.from({ length: bins }, () => 0);
  const span = POPULATION_MAX - POPULATION_MIN || 1;
  for (const value of values) {
    const slot = Math.min(bins - 1, Math.max(0, Math.floor(((value - POPULATION_MIN) / span) * bins)));
    const count = counts[slot];
    if (count === undefined) throw new Error('Histogram bin is missing.');
    counts[slot] = count + 1;
  }
  return counts;
}
