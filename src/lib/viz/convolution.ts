/**
 * One 3×3 kernel on a fixed 5×5 grid. The output cell is the sum of the
 * element-wise products, multiplied by the kernel's scale.
 */

export const IMAGE: readonly (readonly number[])[] = [
  [1, 0, 2, 1, 0],
  [0, 1, 0, 2, 1],
  [2, 1, 0, 1, 2],
  [1, 2, 1, 0, 1],
  [0, 1, 2, 1, 0],
];

export const kernelIds = ['edge', 'blur', 'sharpen'] as const;
export type KernelId = (typeof kernelIds)[number];

export const KERNELS: Record<KernelId, { name: string; scale: number; weights: readonly (readonly number[])[] }> = {
  edge: {
    name: 'Vertical edge',
    scale: 1,
    weights: [
      [-1, 0, 1],
      [-1, 0, 1],
      [-1, 0, 1],
    ],
  },
  blur: {
    name: 'Box blur',
    scale: 1 / 9,
    weights: [
      [1, 1, 1],
      [1, 1, 1],
      [1, 1, 1],
    ],
  },
  sharpen: {
    name: 'Sharpen',
    scale: 1,
    weights: [
      [0, -1, 0],
      [-1, 5, -1],
      [0, -1, 0],
    ],
  },
};

export interface WindowSum {
  /** Element-wise products, before the scale. */
  products: number[][];
  raw: number;
  value: number;
}

export function windowAt(id: KernelId, row: number, column: number): WindowSum {
  const kernel = KERNELS[id];
  let raw = 0;
  const products = kernel.weights.map((weights, offsetRow) =>
    weights.map((weight, offsetColumn) => {
      const pixel = IMAGE[row + offsetRow]?.[column + offsetColumn] ?? 0;
      const product = weight * pixel;
      raw += product;
      return product;
    }),
  );
  return { products, raw, value: raw * kernel.scale };
}

export function outputGrid(id: KernelId): number[][] {
  return [0, 1, 2].map((row) => [0, 1, 2].map((column) => windowAt(id, row, column).value));
}
