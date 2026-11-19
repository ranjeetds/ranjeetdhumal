/**
 * Two designed tokenizers for the same string.
 *
 * Words keep a letter-run together. Pieces use a small hand-written vocabulary and
 * a greedy longest match, so a rare word falls apart. Neither is a production
 * tokenizer. The ids are indexes into this vocabulary, not a model's.
 */

export type TokenizerId = 'words' | 'pieces';

export interface TokenPiece {
  text: string;
  id: number;
  start: number;
  end: number;
}

const FRAGMENTS = ['the', 'ing', 'able', 'tion', 'cat', 'sat', 'un', 'on', 'mat', 'pre'] as const;
const LETTERS = 'abcdefghijklmnopqrstuvwxyz0123456789'.split('');
const MARKS = [' ', '.', ',', '!', '?', "'", '-', '\n'] as const;

const VOCAB = [...FRAGMENTS, ...LETTERS, ...MARKS].sort((a, b) => b.length - a.length);
const ID_BY_PIECE = new Map(VOCAB.map((piece, index) => [piece, index + 1]));

function idFor(piece: string): number {
  const known = ID_BY_PIECE.get(piece);
  if (known !== undefined) return known;
  let hash = 0;
  for (const char of piece) hash = (hash * 33 + char.charCodeAt(0)) >>> 0;
  return 1000 + (hash % 9000);
}

export function tokenize(text: string, mode: TokenizerId): TokenPiece[] {
  return mode === 'words' ? wordPieces(text) : fragmentPieces(text);
}

function wordPieces(text: string): TokenPiece[] {
  const pieces: TokenPiece[] = [];
  const pattern = /\s+|[A-Za-z]+|[0-9]+|[^A-Za-z0-9\s]/g;
  for (const match of text.matchAll(pattern)) {
    const value = match[0];
    const start = match.index ?? 0;
    const key = /^\s+$/.test(value) ? ' ' : value.toLowerCase();
    pieces.push({ text: value, id: idFor(key), start, end: start + value.length });
  }
  return pieces;
}

function fragmentPieces(text: string): TokenPiece[] {
  const pieces: TokenPiece[] = [];
  let index = 0;
  while (index < text.length) {
    const rest = text.slice(index).toLowerCase();
    const piece = VOCAB.find((candidate) => rest.startsWith(candidate));
    const length = piece?.length ?? 1;
    const textPiece = text.slice(index, index + length);
    const key = piece ?? textPiece.toLowerCase();
    pieces.push({ text: textPiece, id: idFor(key), start: index, end: index + length });
    index += length;
  }
  return pieces;
}
