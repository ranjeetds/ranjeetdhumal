/**
 * One designed transformer block on two 3-dimensional tokens.
 * The attention weights are written by hand. The feed-forward writes into the
 * third coordinate when the first coordinate exceeds 1. Nothing is trained.
 */

export type TokenId = 'A' | 'B';

export type Vec3 = readonly [number, number, number];

export const BLOCK_TOKENS: Record<TokenId, Vec3> = {
  A: [1, 0, 0],
  B: [0, 1, 0],
};

const WEIGHTS: Record<TokenId, readonly [number, number]> = {
  A: [0.75, 0.25],
  B: [0.25, 0.75],
};

function mix(weights: readonly [number, number]): Vec3 {
  const [a, b] = weights;
  const left = BLOCK_TOKENS.A;
  const right = BLOCK_TOKENS.B;
  return [a * left[0] + b * right[0], a * left[1] + b * right[1], a * left[2] + b * right[2]];
}

function add(left: Vec3, right: Vec3): Vec3 {
  return [left[0] + right[0], left[1] + right[1], left[2] + right[2]];
}

/** Feed-forward: a threshold on the first coordinate, written into the third. */
export function feedForward(value: Vec3): Vec3 {
  return [0, 0, Math.max(0, value[0] - 1)];
}

export interface BlockStep {
  id: 'input' | 'attention' | 'residual' | 'feed-forward' | 'output';
  title: string;
  value: Vec3;
  /** The part added at this step, when the step is a residual add. */
  added?: Vec3;
}

export function blockSteps(token: TokenId): readonly BlockStep[] {
  const input = BLOCK_TOKENS[token];
  const attention = mix(WEIGHTS[token]);
  const residual = add(input, attention);
  const forward = feedForward(residual);
  const output = add(residual, forward);
  return [
    { id: 'input', title: 'Input', value: input },
    { id: 'attention', title: 'Attention mix', value: attention },
    { id: 'residual', title: 'Add the input', value: residual, added: attention },
    { id: 'feed-forward', title: 'Feed-forward', value: forward },
    { id: 'output', title: 'Add again', value: output, added: forward },
  ];
}

export function attentionWeights(token: TokenId): readonly [number, number] {
  return WEIGHTS[token];
}
