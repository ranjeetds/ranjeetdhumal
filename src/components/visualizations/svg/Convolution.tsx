/**
 * A 3×3 kernel on a fixed 5×5 image. The server render is the vertical-edge
 * kernel at the top-left output cell, which equals −1.
 */

import { useState } from 'react';
import { IMAGE, KERNELS, kernelIds, outputGrid, windowAt, type KernelId } from '@/lib/viz/convolution';

function format(value: number): string {
  return value.toFixed(2);
}

export default function Convolution() {
  const [kernel, setKernel] = useState<KernelId>('edge');
  const [row, setRow] = useState(0);
  const [column, setColumn] = useState(0);
  const window = windowAt(kernel, row, column);
  const outputs = outputGrid(kernel);
  const spec = KERNELS[kernel];

  return (
    <div className="bg-surface">
      <div className="grid gap-6 px-4 py-5 sm:grid-cols-2">
        <div>
          <p className="mono-label text-ink-faint">Image</p>
          <div className="mt-2 grid grid-cols-5 gap-1">
            {IMAGE.map((line, imageRow) =>
              line.map((pixel, imageColumn) => {
                const inside = imageRow >= row && imageRow < row + 3 && imageColumn >= column && imageColumn < column + 3;
                return (
                  <span
                    key={`${imageRow}-${imageColumn}`}
                    className={`flex h-10 items-center justify-center border text-sm ${inside ? 'border-line-strong bg-raised text-ink' : 'border-line text-ink-muted'}`}
                  >
                    {pixel}
                  </span>
                );
              }),
            )}
          </div>
        </div>
        <div>
          <p className="mono-label text-ink-faint">Output</p>
          <div className="mt-2 grid max-w-48 grid-cols-3 gap-1">
            {outputs.map((line, outputRow) =>
              line.map((value, outputColumn) => (
                <button
                  key={`${outputRow}-${outputColumn}`}
                  type="button"
                  aria-pressed={outputRow === row && outputColumn === column}
                  onClick={() => {
                    setRow(outputRow);
                    setColumn(outputColumn);
                  }}
                  className="h-10 border border-line text-sm text-ink-muted aria-pressed:border-line-strong aria-pressed:bg-raised aria-pressed:text-ink"
                >
                  {format(value)}
                </button>
              )),
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-2 border-t border-line px-4 py-3">
        {kernelIds.map((id) => (
          <button
            key={id}
            type="button"
            aria-pressed={id === kernel}
            onClick={() => setKernel(id)}
            className="mono-label rounded-sm px-3 py-2 text-ink-muted transition-colors duration-200 hover:bg-raised hover:text-ink aria-pressed:bg-raised aria-pressed:text-ink"
          >
            {KERNELS[id].name}
          </button>
        ))}
      </div>
      <p className="border-t border-line px-4 py-3 text-sm leading-relaxed text-ink-muted">
        {spec.name}, output row {row + 1}, column {column + 1}. The raw sum of products is {format(window.raw)}.
        {kernel === 'blur' ? ' Box blur divides that sum by 9.' : ' This kernel does not rescale.'} The cell is {format(window.value)}. The shaded image cells are the window.
      </p>
    </div>
  );
}
