/**
 * One tool call, paused on the state. The server render is the observation, with the tool succeeding.
 */

import { useId, useState } from 'react';
import { agentStages } from '@/lib/viz/agent-loop';

export default function AgentLoop() {
  const titleId = useId();
  const [index, setIndex] = useState(0);
  const [failed, setFailed] = useState(false);
  const stages = agentStages(failed);
  const stage = stages[index] ?? stages[0];
  if (!stage) return null;

  return (
    <div className="bg-surface">
      <svg viewBox="0 0 640 168" role="img" aria-labelledby={titleId} className="w-full">
        <title id={titleId}>
          {stage.title}. {stage.state}
        </title>
        {stages.map((item, itemIndex) => {
          const x = 24 + itemIndex * 156;
          const active = itemIndex === index;
          return (
            <g key={item.id}>
              <rect
                x={x}
                y={36}
                width={140}
                height={64}
                rx={6}
                fill="var(--surface)"
                stroke={active ? 'var(--accent)' : 'var(--line-strong)'}
                strokeWidth={active ? 2 : 1}
              />
              <text x={x + 16} y={74} className="fill-ink" fontSize={15}>
                {item.title}
              </text>
              {itemIndex < stages.length - 1 ? (
                <line x1={x + 140} y1={68} x2={x + 156} y2={68} className="stroke-line-strong" />
              ) : null}
            </g>
          );
        })}
      </svg>
      <div className="flex flex-wrap gap-2 border-t border-line px-4 py-3">
        <button
          type="button"
          onClick={() => setIndex((value) => Math.max(0, value - 1))}
          className="mono-label rounded-sm px-3 py-2 text-ink-muted transition-colors duration-200 hover:bg-raised hover:text-ink"
        >
          Back
        </button>
        <button
          type="button"
          onClick={() => setIndex((value) => Math.min(stages.length - 1, value + 1))}
          className="mono-label rounded-sm px-3 py-2 text-ink-muted transition-colors duration-200 hover:bg-raised hover:text-ink"
        >
          Next
        </button>
        <button
          type="button"
          aria-pressed={failed}
          onClick={() => setFailed((value) => !value)}
          className="mono-label rounded-sm px-3 py-2 text-ink-muted transition-colors duration-200 hover:bg-raised hover:text-ink aria-pressed:bg-raised aria-pressed:text-ink"
        >
          {failed ? 'Tool failed' : 'Fail the tool'}
        </button>
      </div>
      <p className="border-t border-line px-4 py-3 text-sm leading-relaxed text-ink-muted">
        <span className="text-ink">{stage.title}. </span>
        {stage.state}
      </p>
      <p className="border-t border-line px-4 py-3 text-sm leading-relaxed text-ink-muted">
        A transcript at this stage can say: {stage.commentary} The state above is the record. The two agree when the tool succeeds. They come apart when it fails and the commentary still mentions 40.
      </p>
    </div>
  );
}
