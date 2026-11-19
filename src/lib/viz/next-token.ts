/**
 * A toy next-token distribution. The logits are written by hand for four contexts
 * so that temperature and context can be seen to change the same vocabulary.
 * This is not the output of a trained model.
 */

import { softmax } from './softmax';

export const VOCAB = ['the', 'cat', 'sat', 'on', 'mat', '.'] as const;

export interface ToyContext {
  id: string;
  /** The tokens already chosen. */
  label: string;
  /** One unnormalized score per entry of VOCAB, in that order. */
  logits: readonly number[];
}

export const CONTEXTS: readonly ToyContext[] = [
  {
    id: 'the',
    label: 'the',
    logits: [0.2, 2.4, -0.6, -0.8, 1.6, -1.4],
  },
  {
    id: 'the-cat',
    label: 'the cat',
    logits: [-0.4, -1.2, 2.6, 0.4, -0.8, -0.6],
  },
  {
    id: 'sat',
    label: 'the cat sat',
    logits: [-0.2, -1.4, -1.0, 2.8, -0.6, 0.6],
  },
  {
    id: 'on-the',
    label: 'the cat sat on the',
    logits: [-0.6, 0.8, -1.2, -0.8, 2.7, 0.3],
  },
];

export function tokenDistribution(logits: readonly number[], temperature: number): number[] {
  const scale = Math.max(temperature, 0.05);
  return softmax(logits.map((logit) => logit / scale));
}
