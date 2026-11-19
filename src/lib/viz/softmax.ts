/** Numerically stable softmax. Shared by the attention and next-token figures. */

export function softmax(scores: readonly number[]): number[] {
  const max = Math.max(...scores);
  const shifted = scores.map((score) => Math.exp(score - max));
  const total = shifted.reduce((sum, value) => sum + value, 0);
  return shifted.map((value) => value / total);
}
