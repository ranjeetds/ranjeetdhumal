/**
 * The same string cut two ways: letter-runs, or a greedy match against a small vocabulary.
 *
 * The server render is “The cat sat.” cut into words. Typing and switching tokenizers
 * replace that cut. There is no animation.
 */

import { useId, useState } from 'react';
import { type TokenizerId, tokenize } from '@/lib/viz/tokenize';

const MODES: readonly { id: TokenizerId; label: string }[] = [
  { id: 'words', label: 'Words' },
  { id: 'pieces', label: 'Pieces' },
];

const DEFAULT_TEXT = 'The cat sat.';

export default function Tokenization() {
  const titleId = useId();
  const [text, setText] = useState(DEFAULT_TEXT);
  const [mode, setMode] = useState<TokenizerId>('words');
  const [selected, setSelected] = useState(0);
  const pieces = tokenize(text, mode);
  const current = pieces[selected] ?? pieces[0];

  return (
    <div>
      <p id={titleId} className="sr-only">
        A designed tokenizer. Type a sentence, then switch between keeping words whole and
        cutting them into a small vocabulary. Each piece shows its id.
      </p>

      <div className="flex flex-wrap items-end gap-3 border-b border-line px-4 py-3">
        <label className="min-w-0 flex-1">
          <span className="mono-label text-ink-faint">Text</span>
          <input
            type="text"
            value={text}
            onChange={(event) => {
              setText(event.currentTarget.value);
              setSelected(0);
            }}
            className="mt-2 h-11 w-full border border-line-strong bg-canvas px-3 text-ink outline-none focus:border-ink"
          />
        </label>
        <div role="group" aria-label="Tokenizer" className="flex gap-2">
          {MODES.map((candidate) => (
            <button
              key={candidate.id}
              type="button"
              aria-pressed={candidate.id === mode}
              onClick={() => {
                setMode(candidate.id);
                setSelected(0);
              }}
              className="mono-label rounded-sm px-3 py-2 text-ink-muted transition-colors duration-200 hover:bg-raised hover:text-ink aria-pressed:bg-raised aria-pressed:text-ink"
            >
              {candidate.label}
            </button>
          ))}
        </div>
      </div>

      <ul aria-labelledby={titleId} className="flex flex-wrap gap-2 px-4 py-4">
        {pieces.length === 0 && <li className="text-sm text-ink-muted">Nothing to cut.</li>}
        {pieces.map((piece, index) => (
          <li key={`${piece.start}-${piece.text}`}>
            <button
              type="button"
              aria-pressed={index === selected}
              onClick={() => setSelected(index)}
              className="rounded-sm border border-line px-2 py-1.5 text-left hover:border-line-strong aria-pressed:border-ink aria-pressed:bg-raised"
            >
              <span className="block font-serif text-ink">
                {piece.text === ' ' ? '␠' : piece.text.replace(/\n/g, '↵')}
              </span>
              <span className="mono-label text-ink-faint">{piece.id}</span>
            </button>
          </li>
        ))}
      </ul>

      <p className="border-t border-line px-4 py-3 text-sm leading-relaxed text-ink-muted">
        {mode === 'words'
          ? 'Words keep a run of letters together. A space is its own piece.'
          : 'Pieces use a small designed vocabulary and take the longest match. A word that is not in it falls into fragments.'}{' '}
        {pieces.length} {pieces.length === 1 ? 'piece' : 'pieces'}.
        {current && ` The selected piece is characters ${current.start}–${current.end}, id ${current.id}.`}
        {' This vocabulary is not a model’s.'}
      </p>
    </div>
  );
}
