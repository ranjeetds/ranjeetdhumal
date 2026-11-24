/**
 * Eight tokens placed by hand in two planes.
 * "Usage" keeps a pair together. "Spelling" keeps a different pair together.
 * Neither plane is a projection of a trained model.
 */

export interface EmbeddedToken {
  id: string;
  label: string;
  usage: readonly [number, number];
  spelling: readonly [number, number];
}

export const EMBEDDED_TOKENS: readonly EmbeddedToken[] = [
  { id: 'king', label: 'king', usage: [0.15, 0.85], spelling: [0.2, 0.15] },
  { id: 'queen', label: 'queen', usage: [0.4, 0.7], spelling: [0.85, 0.55] },
  { id: 'man', label: 'man', usage: [-0.25, 0.75], spelling: [0.05, -0.05] },
  { id: 'woman', label: 'woman', usage: [-0.05, 0.55], spelling: [0.45, -0.7] },
  { id: 'cat', label: 'cat', usage: [0.9, -0.45], spelling: [0.6, -0.5] },
  { id: 'dog', label: 'dog', usage: [0.7, -0.7], spelling: [-0.8, 0.2] },
  { id: 'paris', label: 'paris', usage: [-0.85, -0.15], spelling: [-0.55, 0.45] },
  { id: 'london', label: 'london', usage: [-0.6, -0.4], spelling: [0.75, 0.8] },
];

export type EmbeddingPlane = 'usage' | 'spelling';

export function tokenPosition(token: EmbeddedToken, plane: EmbeddingPlane): readonly [number, number] {
  return plane === 'usage' ? token.usage : token.spelling;
}

export function nearestTokens(id: string, plane: EmbeddingPlane, k = 2): EmbeddedToken[] {
  const selected = EMBEDDED_TOKENS.find((token) => token.id === id);
  if (!selected) return [];
  const [x, y] = tokenPosition(selected, plane);
  return EMBEDDED_TOKENS.filter((token) => token.id !== id)
    .map((token) => {
      const [tx, ty] = tokenPosition(token, plane);
      return { token, distance: Math.hypot(tx - x, ty - y) };
    })
    .sort((left, right) => left.distance - right.distance || left.token.id.localeCompare(right.token.id))
    .slice(0, k)
    .map((item) => item.token);
}
