/**
 * Three activations and their derivatives. ReLU's derivative at exactly zero is
 * undefined; this figure uses 0 there and says so.
 */

export const activationIds = ['sigmoid', 'tanh', 'relu'] as const;
export type ActivationId = (typeof activationIds)[number];

export const ACTIVATION_DOMAIN = { min: -4, max: 4 } as const;

export function activation(id: ActivationId, x: number): number {
  if (id === 'relu') return x > 0 ? x : 0;
  if (id === 'tanh') return Math.tanh(x);
  return sigmoid(x);
}

/** Slope of the activation. At a ReLU kink this returns 0. */
export function activationDerivative(id: ActivationId, x: number): number {
  if (id === 'relu') return x > 0 ? 1 : 0;
  if (id === 'tanh') {
    const t = Math.tanh(x);
    return 1 - t * t;
  }
  const s = sigmoid(x);
  return s * (1 - s);
}

export function activationRange(id: ActivationId): { min: number; max: number } {
  if (id === 'relu') return { min: -0.4, max: 4 };
  if (id === 'tanh') return { min: -1.25, max: 1.25 };
  return { min: -0.15, max: 1.15 };
}

export interface ActivationSample {
  x: number;
  y: number;
}

export function activationCurve(id: ActivationId, count = 81): ActivationSample[] {
  const span = ACTIVATION_DOMAIN.max - ACTIVATION_DOMAIN.min;
  return Array.from({ length: count }, (_, index) => {
    const x = ACTIVATION_DOMAIN.min + (span * index) / (count - 1);
    return { x, y: activation(id, x) };
  });
}

function sigmoid(x: number): number {
  if (x >= 0) {
    const z = Math.exp(-x);
    return 1 / (1 + z);
  }
  const z = Math.exp(x);
  return z / (1 + z);
}
