/**
 * Designed attention patterns for a single sentence. These are not weights from a
 * trained model. They exist so a row can be seen as a distribution, and so masking
 * can be seen to forbid a direction and renormalize what remains.
 */

import { softmax } from './softmax';

export const SENTENCE = ['the', 'cat', 'sat', 'on', 'the', 'mat'] as const;

const blocked = -1e9;

export interface AttentionHead {
  id: string;
  name: string;
  /** One sentence on what this designed pattern is for. */
  note: string;
  /** scores[query][key], before the softmax. */
  scores: readonly (readonly number[])[];
}

export const HEADS: readonly AttentionHead[] = [
  {
    id: 'subject',
    name: 'Who acted',
    note: 'The verb looks back at the noun that did the sitting. Other positions mostly look at themselves.',
    scores: [
      [2.2, 0.2, 0.0, 0.0, 0.0, 0.0],
      [0.4, 2.4, 0.1, 0.0, 0.0, 0.0],
      [0.2, 2.6, 0.8, 0.1, 0.0, 0.0],
      [0.1, 0.3, 2.2, 1.2, 0.2, 0.0],
      [0.2, 0.2, 0.3, 1.4, 2.0, 0.2],
      [0.1, 0.2, 0.2, 0.4, 1.6, 2.2],
    ],
  },
  {
    id: 'local',
    name: 'Nearby',
    note: 'Each position looks at its neighbours. Nothing here reaches across the sentence.',
    scores: [
      [2.4, 1.4, 0.1, 0.0, 0.0, 0.0],
      [1.3, 2.2, 1.3, 0.1, 0.0, 0.0],
      [0.1, 1.3, 2.2, 1.3, 0.1, 0.0],
      [0.0, 0.1, 1.3, 2.2, 1.3, 0.1],
      [0.0, 0.0, 0.1, 1.3, 2.2, 1.3],
      [0.0, 0.0, 0.0, 0.1, 1.4, 2.4],
    ],
  },
];

export function attentionWeights(head: AttentionHead, causal: boolean): number[][] {
  return head.scores.map((row, query) =>
    softmax(row.map((score, key) => (causal && key > query ? blocked : score))),
  );
}
