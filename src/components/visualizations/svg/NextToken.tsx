/**
 * A toy next-token distribution over a six-word vocabulary.
 *
 * Logits are hand-written for four contexts. Changing the context moves probability
 * onto a different word. Raising the temperature flattens the same scores. The
 * figure is explicit that it is not a trained model: the lesson is the shape of
 * the output, not a claim about any particular network.
 */

import { useId, useState } from 'react';
import { CONTEXTS, VOCAB, tokenDistribution } from '@/lib/viz/next-token';

const percent = (value: number) => `${Math.round(value * 100)}%`;

export default function NextToken() {
  const titleId = useId();
  const [contextId, setContextId] = useState('the-cat');
  const [temperature, setTemperature] = useState(1);
  const [chosen, setChosen] = useState<number | null>(null);

  const context = CONTEXTS.find((candidate) => candidate.id === contextId) ?? CONTEXTS[0];
  if (!context) throw new Error('Next-token contexts are missing.');
  const probabilities = tokenDistribution(context.logits, temperature);
  const top = probabilities.reduce(
    (best, probability, index) => (probability > best.probability ? { index, probability } : best),
    { index: 0, probability: -1 },
  );

  return (
    <div>
      <p id={titleId} className="sr-only">
        A designed next-token distribution. Choose the words already written, then change the
        temperature. Each bar is the probability of the next word.
      </p>

      <div className="flex flex-wrap gap-2 border-b border-line px-4 py-3" role="group" aria-label="Context">
        {CONTEXTS.map((candidate) => (
          <button
            key={candidate.id}
            type="button"
            aria-pressed={candidate.id === context.id}
            onClick={() => {
              setContextId(candidate.id);
              setChosen(null);
            }}
            className="mono-label rounded-sm px-3 py-2 text-ink-muted transition-colors duration-200 hover:bg-raised hover:text-ink aria-pressed:bg-raised aria-pressed:text-ink"
          >
            {candidate.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-4 px-4 py-3">
        <label htmlFor={`${titleId}-temperature`} className="mono-label text-ink-faint">
          Temperature {temperature.toFixed(1)}
        </label>
        <input
          id={`${titleId}-temperature`}
          type="range"
          min={0.4}
          max={2}
          step={0.1}
          value={temperature}
          onChange={(event) => setTemperature(Number(event.currentTarget.value))}
          style={{ accentColor: 'var(--accent)' }}
          className="w-40"
        />
      </div>

      <ul className="space-y-2 px-4 pb-4" aria-labelledby={titleId}>
        {VOCAB.map((token, index) => {
          const probability = probabilities[index] ?? 0;
          return (
            <li key={token}>
              <button
                type="button"
                aria-pressed={chosen === index}
                onClick={() => setChosen(index)}
                className="grid w-full grid-cols-[4.5rem_1fr_3rem] items-center gap-3 rounded-sm px-1 py-1 text-left transition-colors duration-200 hover:bg-raised aria-pressed:bg-raised"
              >
                <span className="font-serif text-ink">{token}</span>
                <span className="h-2 overflow-hidden rounded-full bg-line">
                  <span
                    className="block h-full bg-accent"
                    style={{ width: percent(probability) }}
                  />
                </span>
                <span className="text-right font-mono text-[0.6875rem] text-ink-muted tabular-nums">
                  {percent(probability)}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      <p className="border-t border-line px-4 py-3 text-sm leading-relaxed text-ink-muted">
        After “{context.label}”, the tallest bar is “{VOCAB[top.index] ?? ''}”.
        {temperature < 0.7
          ? ' At a low temperature almost all of the probability sits on that one word.'
          : temperature > 1.4
            ? ' At a high temperature the other words remain plausible, including the dull ones.'
            : ' At temperature 1 the scores are used as written.'}
        {chosen !== null && ` Selecting “${VOCAB[chosen] ?? ''}” is a sample. It is a draw from the bar, not a lookup of the right continuation.`}
      </p>
    </div>
  );
}
