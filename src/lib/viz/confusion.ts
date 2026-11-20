/**
 * Counts in a two-class confusion matrix, and the rates they define.
 * A rate whose denominator is zero is absent.
 */

export interface ConfusionCounts {
  truePositive: number;
  falsePositive: number;
  falseNegative: number;
  trueNegative: number;
}

export interface ConfusionRates {
  precision: number | undefined;
  recall: number | undefined;
  accuracy: number | undefined;
  f1: number | undefined;
}

export function confusionRates(counts: ConfusionCounts): ConfusionRates {
  const predictedPositive = counts.truePositive + counts.falsePositive;
  const actualPositive = counts.truePositive + counts.falseNegative;
  const total = predictedPositive + counts.falseNegative + counts.trueNegative;
  const precision = predictedPositive === 0 ? undefined : counts.truePositive / predictedPositive;
  const recall = actualPositive === 0 ? undefined : counts.truePositive / actualPositive;
  const accuracy = total === 0 ? undefined : (counts.truePositive + counts.trueNegative) / total;
  const f1 =
    precision === undefined || recall === undefined || precision + recall === 0
      ? undefined
      : (2 * precision * recall) / (precision + recall);
  return { precision, recall, accuracy, f1 };
}
