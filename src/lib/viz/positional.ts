/**
 * Sinusoidal positional encoding from Vaswani et al., Attention Is All You Need.
 * Even indices are sines and odd indices are cosines. The model width here is 8,
 * small enough to read; the paper's transformer uses 512.
 */

export const POSITION_WIDTH = 8;

export function positionalComponent(position: number, index: number): number {
  const pair = Math.floor(index / 2);
  const denominator = 10000 ** ((2 * pair) / POSITION_WIDTH);
  const angle = position / denominator;
  return index % 2 === 0 ? Math.sin(angle) : Math.cos(angle);
}

export function positionalColumn(position: number): number[] {
  return Array.from({ length: POSITION_WIDTH }, (_, index) => positionalComponent(position, index));
}
