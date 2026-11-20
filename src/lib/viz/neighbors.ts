/**
 * k nearest neighbours on a fixed set of labeled points. Distance is Euclidean.
 * An equal distance keeps the earlier point in the list. An equal vote is a tie.
 */

export interface NeighborPoint {
  x: number;
  y: number;
  label: 0 | 1;
}

export const NEIGHBOR_POINTS: readonly NeighborPoint[] = [
  { x: -1.5, y: 1.2, label: 0 },
  { x: -1.2, y: 0.4, label: 0 },
  { x: -0.6, y: 1.4, label: 0 },
  { x: -0.8, y: -0.2, label: 0 },
  { x: 1.2, y: -1, label: 1 },
  { x: 0.8, y: -0.4, label: 1 },
  { x: 1.5, y: 0.2, label: 1 },
  { x: 0.4, y: -1.3, label: 1 },
];

export interface NeighborVote {
  index: number;
  distance: number;
  label: 0 | 1;
}

export function nearest(x: number, y: number, k: number): { neighbors: NeighborVote[]; label: 0 | 1 | undefined } {
  const ranked = NEIGHBOR_POINTS.map((point, index) => ({
    index,
    label: point.label,
    distance: Math.hypot(point.x - x, point.y - y),
  })).sort((left, right) => left.distance - right.distance || left.index - right.index);
  const neighbors = ranked.slice(0, k);
  const votes = neighbors.reduce((sum, neighbor) => sum + (neighbor.label === 1 ? 1 : -1), 0);
  return { neighbors, label: votes === 0 ? undefined : votes > 0 ? 1 : 0 };
}
