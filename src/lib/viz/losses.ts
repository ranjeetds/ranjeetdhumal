/**
 * Two losses of one prediction. Mean squared error is a squared distance.
 * Binary cross-entropy is the negative log probability of a 0/1 label.
 * The cross-entropy clamps the prediction away from 0 and 1 so the log is defined.
 */

export type LossId = 'mse' | 'bce';

const BCE_EDGE = 1e-4;

export function meanSquaredError(prediction: number, target: number): number {
  const gap = prediction - target;
  return gap * gap;
}

export function binaryCrossEntropy(prediction: number, target: 0 | 1): number {
  const p = Math.min(1 - BCE_EDGE, Math.max(BCE_EDGE, prediction));
  return -(target * Math.log(p) + (1 - target) * Math.log(1 - p));
}

export function lossValue(id: LossId, prediction: number, target: number): number {
  if (id === 'mse') return meanSquaredError(prediction, target);
  const label: 0 | 1 = target >= 0.5 ? 1 : 0;
  return binaryCrossEntropy(prediction, label);
}

export interface LossSample {
  prediction: number;
  loss: number;
}

/** Loss against a fixed target, for a prediction swept from 0 to 1. */
export function lossCurve(id: LossId, target: number, count = 61): LossSample[] {
  return Array.from({ length: count }, (_, index) => {
    const prediction = index / (count - 1);
    return { prediction, loss: lossValue(id, prediction, target) };
  });
}
