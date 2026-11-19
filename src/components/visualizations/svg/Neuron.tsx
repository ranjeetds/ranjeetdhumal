/**
 * One neuron with two inputs. The server render is ReLU of 0.4·1 + (−0.2)·0.5 + 0.1.
 */

import { useId, useState } from 'react';
import { activationIds, type ActivationId } from '@/lib/viz/activations';
import { neuronForward } from '@/lib/viz/neuron';

const NAMES: Record<ActivationId, string> = {
  sigmoid: 'Sigmoid',
  tanh: 'Tanh',
  relu: 'ReLU',
};

function format(value: number): string {
  return value.toFixed(2);
}

export default function Neuron() {
  const titleId = useId();
  const [activation, setActivation] = useState<ActivationId>('relu');
  const [x1, setX1] = useState(1);
  const [x2, setX2] = useState(0.5);
  const [w1, setW1] = useState(0.4);
  const [w2, setW2] = useState(-0.2);
  const [bias, setBias] = useState(0.1);
  const { pre, output } = neuronForward({ x1, x2, w1, w2, bias, activation });

  const controls: { id: string; label: string; value: number; set: (value: number) => void }[] = [
    { id: 'x1', label: 'x1', value: x1, set: setX1 },
    { id: 'x2', label: 'x2', value: x2, set: setX2 },
    { id: 'w1', label: 'w1', value: w1, set: setW1 },
    { id: 'w2', label: 'w2', value: w2, set: setW2 },
    { id: 'bias', label: 'bias', value: bias, set: setBias },
  ];

  return (
    <div className="bg-surface">
      <svg viewBox="0 0 720 180" role="img" aria-labelledby={titleId} className="w-full">
        <title id={titleId}>
          Pre-activation {format(pre)}, {NAMES[activation]} output {format(output)}
        </title>
        <text x={36} y={48} fontSize={14} className="fill-ink">
          {format(w1)} × {format(x1)} + {format(w2)} × {format(x2)} + {format(bias)}
        </text>
        <text x={36} y={88} fontSize={14} className="fill-ink-muted">
          weighted sum {format(pre)}
        </text>
        <text x={36} y={132} fontSize={20} fill="var(--accent)">
          {NAMES[activation]} {format(output)}
        </text>
      </svg>

      <div className="flex flex-wrap gap-2 border-t border-line px-4 py-3">
        {activationIds.map((candidate) => (
          <button
            key={candidate}
            type="button"
            aria-pressed={candidate === activation}
            onClick={() => setActivation(candidate)}
            className="mono-label rounded-sm px-3 py-2 text-ink-muted transition-colors duration-200 hover:bg-raised hover:text-ink aria-pressed:bg-raised aria-pressed:text-ink"
          >
            {NAMES[candidate]}
          </button>
        ))}
      </div>
      {controls.map((control) => (
        <label
          key={control.id}
          className="flex items-center gap-4 border-t border-line px-4 py-3 text-sm text-ink-muted"
        >
          <span className="mono-label w-16 shrink-0">{control.label}</span>
          <input
            type="range"
            min={-2}
            max={2}
            step={0.05}
            value={control.value}
            aria-valuetext={format(control.value)}
            onChange={(event) => control.set(Number(event.currentTarget.value))}
            className="w-full"
            style={{ accentColor: 'var(--accent)' }}
          />
          <span className="mono-label w-14 text-right text-ink">{format(control.value)}</span>
        </label>
      ))}
    </div>
  );
}
