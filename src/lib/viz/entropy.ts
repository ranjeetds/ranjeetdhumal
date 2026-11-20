/**
 * Binary entropy, in bits. The log is base 2. Endpoints are excluded so the
 * log stays defined; a probability of exactly 0 or 1 has entropy 0.
 */

export function binaryEntropy(probability: number): number {
  const p = Math.min(0.999, Math.max(0.001, probability));
  return -p * Math.log2(p) - (1 - p) * Math.log2(1 - p);
}

export function entropyCurve(count = 99): { probability: number; entropy: number }[] {
  return Array.from({ length: count }, (_, index) => {
    const probability = 0.01 + (0.98 * index) / (count - 1);
    return { probability, entropy: binaryEntropy(probability) };
  });
}
