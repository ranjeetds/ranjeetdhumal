/**
 * Catalogue of every visualization, live or planned. The Visual Lab page renders this
 * list, and `Viz.astro` resolves live entries to their component.
 *
 * To add a figure: create the component in the folder for its engine, add an entry here
 * with `status: 'live'`, then register the component in `Viz.astro`.
 */

import type { TopicId } from '@/data/topics';

export type VizEngine = 'svg' | 'd3' | 'three';

export const engineLabels: Record<VizEngine, string> = {
  svg: 'SVG',
  d3: 'D3.js',
  three: 'Three.js',
};

export interface Visualization {
  id: string;
  title: string;
  /** One sentence for listings. */
  summary: string;
  /** Figure caption shown beneath a live figure; say what to look at and what to try. */
  caption?: string;
  /** What the figure is for. One sentence a learner can test themselves against. */
  objective: string;
  /** Pointer interactions the figure should offer. Each needs a keyboard equivalent. */
  interactions: readonly string[];
  engine: VizEngine;
  topic: TopicId;
  status: 'live' | 'planned';
}

export const visualizations = [
  {
    id: 'gradient-descent',
    title: 'Gradient descent on a loss surface',
    summary: 'Watch an optimizer with momentum roll downhill — and see where it gets stuck.',
    caption:
      'Gradient descent with momentum on a non-convex loss surface. Where a run starts decides which valley it settles in. Click anywhere on the surface to start a new descent.',
    objective: 'See that the start point, not the update rule, chooses the valley.',
    interactions: [
      'Click the surface, or use New descent, to start a run',
      'Watch step and loss for the newest trace',
      'Compare up to four traces at once',
    ],
    engine: 'svg',
    topic: 'mathematics',
    status: 'live',
  },
  {
    id: 'decision-boundaries',
    title: 'Decision boundaries',
    summary: 'See how a classifier carves up the plane as it trains.',
    objective: 'Connect a model class to the shapes of boundary it is able to draw.',
    interactions: [
      'Add and move labeled points',
      'Switch between a linear model, a tree, and a small network',
      'Scrub training epoch by epoch',
    ],
    engine: 'd3',
    topic: 'machine-learning',
    status: 'planned',
  },
  {
    id: 'backpropagation',
    title: 'Backpropagation, step by step',
    summary: 'Follow gradients as they flow backwards through a small network.',
    objective: 'Trace one scalar loss back to one weight, and see the chain rule as a path.',
    interactions: [
      'Step forward, then backward, one node at a time',
      'Change an input and watch only the affected gradients move',
      'Toggle a numeric readout on each edge',
    ],
    engine: 'svg',
    topic: 'deep-learning',
    status: 'planned',
  },
  {
    id: 'attention-patterns',
    title: 'Attention patterns',
    summary: 'Token-to-token attention weights as a heatmap you can read.',
    objective: 'See what a single head attends to, without a collage of every head at once.',
    interactions: [
      'Select one of two designed heads',
      'Select a query token',
      'Turn the causal mask on and off',
    ],
    engine: 'svg',
    topic: 'generative-ai',
    status: 'live',
    caption:
      'Two designed heads on “the cat sat on the mat”, not weights from a trained model. Pick a head and a query. Turn the causal mask on and watch the row renormalize.',
  },
  {
    id: 'transformer-block',
    title: 'One transformer block',
    summary: 'Residual stream, attention, and the feed-forward step, as three operations on one vector.',
    objective: 'Read a block as a sequence of operations, not as a logo.',
    interactions: [
      'Step through the block and stop on each operation',
      'Highlight the residual path against the sublayer',
      'Swap in a second token and see what changes',
    ],
    engine: 'svg',
    topic: 'generative-ai',
    status: 'planned',
  },
  {
    id: 'embedding-space',
    title: 'Embedding space',
    summary: 'A three-dimensional projection of vectors, with clusters you can turn around.',
    objective: 'Treat distance in the projection as a picture of similarity, and notice what the projection hides.',
    interactions: [
      'Drag to rotate the projection',
      'Search for a token and mark its neighbours',
      'Switch the projection and see which clusters survive',
    ],
    engine: 'three',
    topic: 'generative-ai',
    status: 'planned',
  },
  {
    id: 'next-token',
    title: 'Next-token distribution',
    summary: 'A small vocabulary, a context, and a temperature. The bar chart is the model’s entire output.',
    caption:
      'A designed distribution over six words, not a trained model. Change the context and the temperature. The tallest bar is the most likely next word, and selecting a word is a sample.',
    objective: 'See that a language model emits a distribution, and that temperature changes how peaked it is.',
    interactions: [
      'Choose a context',
      'Move the temperature',
      'Select a word as a sample from the bars',
    ],
    engine: 'svg',
    topic: 'generative-ai',
    status: 'live',
  },
  {
    id: 'tokenization',
    title: 'Tokenization',
    summary: 'A sentence cut into tokens, which are not the words you think you typed.',
    objective: 'See the units a model actually receives, including the splits that surprise you.',
    interactions: [
      'Type a sentence, including punctuation and a word the tokenizer will split',
      'Compare two tokenizers on the same text',
      'Show the token ids beside the pieces',
    ],
    engine: 'svg',
    topic: 'generative-ai',
    status: 'planned',
  },
  {
    id: 'agent-loop',
    title: 'An agent loop',
    summary: 'One decision cycle of a tool-using agent, paused on the state rather than the prose.',
    objective: 'Separate observation, decision, tool call, and result, and see a failed call.',
    interactions: [
      'Step the loop one stage at a time',
      'Inspect the state the model is given at each stage',
      'Fail a tool call and watch the next step',
    ],
    engine: 'svg',
    topic: 'agentic-ai',
    status: 'planned',
  },
] as const satisfies readonly Visualization[];

type Entry = (typeof visualizations)[number];
export type VisualizationId = Entry['id'];
export type LiveVisualizationId = Extract<Entry, { status: 'live' }>['id'];

export function getVisualization(id: VisualizationId): Visualization {
  const visualization = visualizations.find((candidate) => candidate.id === id);
  if (!visualization) throw new Error(`Unknown visualization: ${id}`);
  return visualization;
}
