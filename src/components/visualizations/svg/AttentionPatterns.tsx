/**
 * One sentence, two designed attention heads, and an optional causal mask.
 *
 * The weights are not from a trained model. They are arranged so that switching
 * heads and turning the mask on changes a belief: a head is a pattern of looking,
 * and a mask forbids a direction without leaving the row unnormalized.
 *
 * The server render is the default head, query, and mask. Choosing another is a
 * discrete update, not a per-frame animation, so React re-renders on purpose.
 */

import { useId, useState } from 'react';
import { HEADS, SENTENCE, attentionWeights } from '@/lib/viz/attention';

const percent = (value: number) => `${Math.round(value * 100)}%`;

export default function AttentionPatterns() {
  const titleId = useId();
  const [headId, setHeadId] = useState('subject');
  const [query, setQuery] = useState(2);
  const [causal, setCausal] = useState(true);

  const head = HEADS.find((candidate) => candidate.id === headId) ?? HEADS[0];
  if (!head) throw new Error('Attention heads are missing.');
  const matrix = attentionWeights(head, causal);
  const row = matrix[query] ?? [];

  return (
    <div>
      <p id={titleId} className="sr-only">
        Designed attention on the sentence “the cat sat on the mat”. Select a head and a query
        token. The highlighted row is a distribution over the sentence.
      </p>

      <div className="flex flex-wrap gap-2 border-b border-line px-4 py-3" role="group" aria-label="Head">
        {HEADS.map((candidate) => (
          <button
            key={candidate.id}
            type="button"
            aria-pressed={candidate.id === head.id}
            onClick={() => setHeadId(candidate.id)}
            className="mono-label rounded-sm px-3 py-2 text-ink-muted transition-colors duration-200 hover:bg-raised hover:text-ink aria-pressed:bg-raised aria-pressed:text-ink"
          >
            {candidate.name}
          </button>
        ))}
        <button
          type="button"
          aria-pressed={causal}
          onClick={() => setCausal((current) => !current)}
          className="mono-label rounded-sm px-3 py-2 text-ink-muted transition-colors duration-200 hover:bg-raised hover:text-ink aria-pressed:bg-raised aria-pressed:text-ink"
        >
          Causal mask
        </button>
      </div>

      <p className="px-4 py-3 text-sm leading-relaxed text-ink-muted">{head.note}</p>

      <div className="overflow-x-auto px-4 pb-4">
        <table className="w-full min-w-[28rem] border-collapse text-center text-sm" aria-labelledby={titleId}>
          <caption className="sr-only">
            Attention weights. Rows are queries, columns are keys. The selected row is the one
            being read.
          </caption>
          <thead>
            <tr>
              <th className="p-1" />
              {SENTENCE.map((token, key) => (
                <th key={`key-${key}`} scope="col" className="mono-label p-1 font-normal text-ink-faint">
                  {token}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {SENTENCE.map((token, queryIndex) => (
              <tr key={`row-${queryIndex}`}>
                <th scope="row" className="p-1 text-left">
                  <button
                    type="button"
                    aria-pressed={queryIndex === query}
                    onClick={() => setQuery(queryIndex)}
                    className="mono-label w-full rounded-sm px-2 py-1.5 text-left text-ink-muted transition-colors duration-200 hover:bg-raised hover:text-ink aria-pressed:text-ink"
                  >
                    {token}
                  </button>
                </th>
                {(matrix[queryIndex] ?? []).map((weight, key) => (
                  <td key={`cell-${queryIndex}-${key}`} className="p-1">
                    <span
                      className="flex h-9 items-center justify-center rounded-xs border border-line font-mono text-[0.6875rem] text-ink tabular-nums"
                      style={{
                        background: `color-mix(in oklab, var(--accent) ${Math.round(weight * 85)}%, transparent)`,
                        opacity: queryIndex === query ? 1 : 0.55,
                      }}
                    >
                      {percent(weight)}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="border-t border-line px-4 py-3 text-sm leading-relaxed text-ink-muted">
        <span className="text-ink">{SENTENCE[query] ?? ''} </span>
        puts {row.map((weight, index) => `${percent(weight)} on “${SENTENCE[index] ?? ''}”`).join(', ')}.
        {causal ? ' Positions after the query are closed, and the row still sums to one.' : ' The mask is off, so a position may look forward.'}
      </p>
    </div>
  );
}
