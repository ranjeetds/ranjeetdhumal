/**
 * One block, two tokens, five stops. The server render is token A at the input.
 */

import { useId, useState } from 'react';
import { type TokenId, attentionWeights, blockSteps } from '@/lib/viz/transformer-block';

const SCALE = 2;

function format(value: number): string {
  return value.toFixed(2);
}

export default function TransformerBlock() {
  const titleId = useId();
  const [token, setToken] = useState<TokenId>('A');
  const [stepIndex, setStepIndex] = useState(0);
  const steps = blockSteps(token);
  const step = steps[stepIndex] ?? steps[0];
  const weights = attentionWeights(token);
  if (!step) return null;

  return (
    <div className="bg-surface">
      <svg viewBox="0 0 420 180" role="img" aria-labelledby={titleId} className="w-full">
        <title id={titleId}>
          Token {token}, {step.title}. Coordinates {step.value.map(format).join(', ')}.
        </title>
        {step.value.map((value, index) => {
          const width = (Math.abs(value) / SCALE) * 280;
          const y = 28 + index * 48;
          return (
            <g key={index}>
              <text x={16} y={y + 16} className="fill-ink-muted" fontSize={13}>
                {index + 1}
              </text>
              <rect x={48} y={y} width={280} height={18} className="fill-raised" />
              <rect x={48} y={y} width={width} height={18} fill={index === 2 ? 'var(--accent)' : 'currentColor'} />
              <text x={340} y={y + 14} className="fill-ink" fontSize={13}>
                {format(value)}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="flex flex-wrap gap-2 border-t border-line px-4 py-3">
        {(['A', 'B'] as const).map((item) => (
          <button
            key={item}
            type="button"
            aria-pressed={item === token}
            onClick={() => setToken(item)}
            className="mono-label rounded-sm px-3 py-2 text-ink-muted transition-colors duration-200 hover:bg-raised hover:text-ink aria-pressed:bg-raised aria-pressed:text-ink"
          >
            Token {item}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap gap-2 border-t border-line px-4 py-3">
        {steps.map((item, index) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={index === stepIndex}
            onClick={() => setStepIndex(index)}
            className="mono-label rounded-sm px-3 py-2 text-ink-muted transition-colors duration-200 hover:bg-raised hover:text-ink aria-pressed:bg-raised aria-pressed:text-ink"
          >
            {item.title}
          </button>
        ))}
      </div>
      <p className="border-t border-line px-4 py-3 text-sm leading-relaxed text-ink-muted">
        Token {token} puts weight {format(weights[0])} on A and {format(weights[1])} on B. {step.title}: ({step.value.map(format).join(', ')}). The third coordinate is the feed-forward write. It stays 0 unless the first coordinate of the residual is above 1.
      </p>
    </div>
  );
}
