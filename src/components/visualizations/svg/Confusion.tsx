/**
 * Precision, recall, and accuracy from four counts. The server render is
 * 8 true positives, 2 false positives, 3 false negatives, and 7 true negatives.
 */

import { useId, useState } from 'react';
import { confusionRates, type ConfusionCounts } from '@/lib/viz/confusion';

const INITIAL: ConfusionCounts = {
  truePositive: 8,
  falsePositive: 2,
  falseNegative: 3,
  trueNegative: 7,
};

function formatRate(value: number | undefined): string {
  return value === undefined ? 'undefined' : value.toFixed(2);
}

export default function Confusion() {
  const titleId = useId();
  const [counts, setCounts] = useState<ConfusionCounts>(INITIAL);
  const rates = confusionRates(counts);
  const cells: { key: keyof ConfusionCounts; label: string }[] = [
    { key: 'truePositive', label: 'True positive' },
    { key: 'falsePositive', label: 'False positive' },
    { key: 'falseNegative', label: 'False negative' },
    { key: 'trueNegative', label: 'True negative' },
  ];

  return (
    <div className="bg-surface">
      <svg viewBox="0 0 720 120" role="img" aria-labelledby={titleId} className="w-full">
        <title id={titleId}>
          Precision {formatRate(rates.precision)}, recall {formatRate(rates.recall)}
        </title>
        <text x={36} y={48} fontSize={16} className="fill-ink">
          Precision {formatRate(rates.precision)} · recall {formatRate(rates.recall)} · F1 {formatRate(rates.f1)}
        </text>
        <text x={36} y={84} fontSize={16} className="fill-ink-muted">
          Accuracy {formatRate(rates.accuracy)}
        </text>
      </svg>
      <div className="grid grid-cols-2 gap-px border-t border-line bg-line">
        {cells.map((cell) => (
          <div key={cell.key} className="bg-surface px-4 py-4">
            <p className="mono-label text-ink-faint">{cell.label}</p>
            <p className="mt-2 font-serif text-title text-ink">{counts[cell.key]}</p>
          </div>
        ))}
      </div>
      {cells.map((cell) => (
        <label key={cell.key} className="flex items-center gap-4 border-t border-line px-4 py-3 text-sm text-ink-muted">
          <span className="mono-label w-36 shrink-0">{cell.label}</span>
          <input
            type="range"
            min={0}
            max={20}
            step={1}
            value={counts[cell.key]}
            aria-valuetext={String(counts[cell.key])}
            onChange={(event) => setCounts((current) => ({ ...current, [cell.key]: Number(event.currentTarget.value) }))}
            className="w-full"
            style={{ accentColor: 'var(--accent)' }}
          />
          <span className="mono-label w-8 text-right text-ink">{counts[cell.key]}</span>
        </label>
      ))}
    </div>
  );
}
