/**
 * Marching-squares contour extraction for scalar fields sampled on a regular grid.
 *
 * Dependency-free on purpose: figures that only need iso-lines should not ship D3.
 * Reach for `d3-contour` once a figure needs filled bands or geographic projections.
 */

export type Point = readonly [x: number, y: number];

export interface ScalarGrid {
  /** Row-major samples; `values[row * cols + col]`. */
  values: Float64Array;
  cols: number;
  rows: number;
}

/** Samples `fn` on a `cols` × `rows` lattice spanning the given ranges (inclusive). */
export function sampleGrid(
  fn: (x: number, y: number) => number,
  xRange: readonly [number, number],
  yRange: readonly [number, number],
  cols: number,
  rows: number,
): ScalarGrid {
  const values = new Float64Array(cols * rows);
  for (let row = 0; row < rows; row++) {
    const y = yRange[0] + ((yRange[1] - yRange[0]) * row) / (rows - 1);
    for (let col = 0; col < cols; col++) {
      const x = xRange[0] + ((xRange[1] - xRange[0]) * col) / (cols - 1);
      values[row * cols + col] = fn(x, y);
    }
  }
  return { values, cols, rows };
}

export function extent(grid: ScalarGrid): [min: number, max: number] {
  let min = Infinity;
  let max = -Infinity;
  for (const value of grid.values) {
    if (value < min) min = value;
    if (value > max) max = value;
  }
  return [min, max];
}

// Cell edges: 0 top, 1 right, 2 bottom, 3 left. Indexed by the 4-bit corner mask
// (top-left = 8, top-right = 4, bottom-right = 2, bottom-left = 1; bit set when above the level).
// Masks 5 and 10 are saddles and are resolved against the cell centre below.
type EdgePair = readonly [number, number];
const SEGMENTS: readonly (readonly EdgePair[])[] = [
  [],
  [[3, 2]],
  [[2, 1]],
  [[3, 1]],
  [[0, 1]],
  [],
  [[0, 2]],
  [[0, 3]],
  [[0, 3]],
  [[0, 2]],
  [],
  [[0, 1]],
  [[3, 1]],
  [[2, 1]],
  [[3, 2]],
  [],
];
const SADDLE_JOINED: readonly EdgePair[] = [
  [0, 3],
  [1, 2],
];
const SADDLE_SPLIT: readonly EdgePair[] = [
  [0, 1],
  [3, 2],
];

/**
 * Returns the iso-lines of `grid` at `level` as polylines in grid coordinates
 * (`x` in `[0, cols - 1]`, `y` in `[0, rows - 1]`). Closed loops repeat their first point.
 */
export function contourLines(grid: ScalarGrid, level: number): Point[][] {
  const { values, cols, rows } = grid;
  const at = (col: number, row: number) => values[row * cols + col] as number;

  // Every crossing lives on a lattice edge, which gives it a stable id shared by both
  // neighbouring cells — that shared id is what lets segments be stitched into polylines.
  const horizontalEdge = (col: number, row: number) => 2 * (row * cols + col);
  const verticalEdge = (col: number, row: number) => 2 * (row * cols + col) + 1;

  const crossings = new Map<number, Point>();
  const links = new Map<number, number[]>();

  const link = (a: number, b: number) => {
    const fromA = links.get(a);
    if (fromA) fromA.push(b);
    else links.set(a, [b]);
    const fromB = links.get(b);
    if (fromB) fromB.push(a);
    else links.set(b, [a]);
  };

  const lerp = (from: number, to: number) => (level - from) / (to - from);

  for (let row = 0; row < rows - 1; row++) {
    for (let col = 0; col < cols - 1; col++) {
      const tl = at(col, row);
      const tr = at(col + 1, row);
      const br = at(col + 1, row + 1);
      const bl = at(col, row + 1);

      const mask =
        (tl > level ? 8 : 0) | (tr > level ? 4 : 0) | (br > level ? 2 : 0) | (bl > level ? 1 : 0);
      if (mask === 0 || mask === 15) continue;

      let segments = SEGMENTS[mask] as readonly EdgePair[];
      if (mask === 5 || mask === 10) {
        const centreAbove = (tl + tr + br + bl) / 4 > level;
        segments = (mask === 5) === centreAbove ? SADDLE_JOINED : SADDLE_SPLIT;
      }

      const edgeIds = [
        horizontalEdge(col, row),
        verticalEdge(col + 1, row),
        horizontalEdge(col, row + 1),
        verticalEdge(col, row),
      ] as const;

      const crossing = (edge: number): number => {
        const id = edgeIds[edge] as number;
        if (!crossings.has(id)) {
          if (edge === 0) crossings.set(id, [col + lerp(tl, tr), row]);
          else if (edge === 1) crossings.set(id, [col + 1, row + lerp(tr, br)]);
          else if (edge === 2) crossings.set(id, [col + lerp(bl, br), row + 1]);
          else crossings.set(id, [col, row + lerp(tl, bl)]);
        }
        return id;
      };

      for (const [from, to] of segments) link(crossing(from), crossing(to));
    }
  }

  // Consume one unused segment leaving `id`, returning the crossing at its other end.
  const step = (id: number): number | undefined => {
    const next = links.get(id)?.pop();
    if (next === undefined) return undefined;
    const back = links.get(next) as number[];
    back.splice(back.indexOf(id), 1);
    return next;
  };

  const trace = (start: number): Point[] => {
    const line: Point[] = [crossings.get(start) as Point];
    let next = step(start);
    while (next !== undefined) {
      line.push(crossings.get(next) as Point);
      next = step(next);
    }
    return line;
  };

  const lines: Point[][] = [];
  // Open lines start on the domain boundary (a crossing with a single segment); trace those
  // first so they are not split in two by starting mid-line. What remains are closed loops.
  for (const [id, neighbours] of links) if (neighbours.length === 1) lines.push(trace(id));
  for (const [id, neighbours] of links) if (neighbours.length > 0) lines.push(trace(id));
  return lines;
}

/** Ramer–Douglas–Peucker simplification; drops points closer than `tolerance` to the line. */
export function simplify(line: readonly Point[], tolerance: number): Point[] {
  if (line.length <= 2) return [...line];

  const keep = new Uint8Array(line.length);
  keep[0] = 1;
  keep[line.length - 1] = 1;

  const stack: [number, number][] = [[0, line.length - 1]];
  while (stack.length > 0) {
    const [first, last] = stack.pop() as [number, number];
    const [ax, ay] = line[first] as Point;
    const [bx, by] = line[last] as Point;
    const dx = bx - ax;
    const dy = by - ay;
    const length = Math.hypot(dx, dy);

    let farthest = -1;
    let maxDistance = tolerance;
    for (let i = first + 1; i < last; i++) {
      const [px, py] = line[i] as Point;
      const distance =
        length === 0
          ? Math.hypot(px - ax, py - ay)
          : Math.abs(dy * (px - ax) - dx * (py - ay)) / length;
      if (distance > maxDistance) {
        maxDistance = distance;
        farthest = i;
      }
    }

    if (farthest !== -1) {
      keep[farthest] = 1;
      stack.push([first, farthest], [farthest, last]);
    }
  }

  return line.filter((_, i) => keep[i] === 1);
}

/** Serialises polylines as a compact SVG path `d` string. */
export function toPathData(lines: readonly (readonly Point[])[], precision = 1): string {
  const format = (value: number) => Number(value.toFixed(precision)).toString();
  let d = '';
  for (const line of lines) {
    if (line.length < 2) continue;
    line.forEach(([x, y], i) => {
      d += `${i === 0 ? 'M' : 'L'}${format(x)} ${format(y)}`;
    });
  }
  return d;
}
