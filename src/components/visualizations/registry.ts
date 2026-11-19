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
    id: 'sample-mean',
    title: 'A sample and its mean',
    summary: 'A skewed population, one draw from it, and the mean that draw reports.',
    caption:
      'A designed population, not a real dataset. Grey bars are everyone. Coloured bars are this draw. Raise n on the same draw, then draw again at n = 8.',
    objective: 'See that a mean is a fact about a sample, and that a small sample’s mean moves.',
    interactions: [
      'Choose a sample size',
      'Draw again',
      'Compare the sample mean with the population mean',
    ],
    engine: 'svg',
    topic: 'mathematics',
    status: 'live',
  },
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
    caption:
      'Two designed cuts of the same string, not a production tokenizer. Words keep a run of letters together. Pieces take the longest match from a small vocabulary, so a rare word falls apart. The number under a piece is its id in that vocabulary.',
    objective: 'See that a model receives pieces, and that a different vocabulary is a different problem.',
    interactions: [
      'Type a sentence, including a trailing space and a rare word',
      'Switch between words and pieces',
      'Select a piece and read its character span and id',
    ],
    engine: 'svg',
    topic: 'generative-ai',
    status: 'live',
  },
  {
    id: 'dot-product',
    title: 'Dot product',
    summary: 'Two arrows in the plane, the product of their components, and the angle between them.',
    caption:
      'Drag the four components. The product is a1·b1 + a2·b2. The angle is missing when either arrow has length zero.',
    objective: 'See a dot product as both a number and an angle, before attention uses it as a score.',
    interactions: [
      'Move each component of the two vectors',
      'Line the arrows up, set them at a right angle, and point them opposite ways',
      'Zero one vector and read that the angle is undefined',
    ],
    engine: 'svg',
    topic: 'mathematics',
    status: 'live',
  },
  {
    id: 'loss-functions',
    title: 'Loss functions',
    summary: 'Squared error and binary cross-entropy for one prediction.',
    caption:
      'One prediction and one target. Squared error is a parabola with its bottom at the target. Cross-entropy uses a 0 or 1 label and climbs as the prediction moves away from that label.',
    objective: 'See what a loss is before a training loop tries to make it smaller.',
    interactions: [
      'Switch between squared error and cross-entropy',
      'Move the prediction',
      'Move the squared-error target, or switch the cross-entropy label',
    ],
    engine: 'svg',
    topic: 'machine-learning',
    status: 'live',
  },
  {
    id: 'neuron',
    title: 'A neuron',
    summary: 'A weighted sum of two inputs, a bias, and one activation.',
    caption:
      'The output is the activation of w1·x1 + w2·x2 + bias. Nothing here is trained. The sliders are the parameters.',
    objective: 'Read a neuron as arithmetic plus a bend, not as a picture of a brain cell.',
    interactions: [
      'Move the inputs, the weights, and the bias',
      'Drive the weighted sum below zero and watch ReLU output 0',
      'Switch the activation and keep the same sum',
    ],
    engine: 'svg',
    topic: 'deep-learning',
    status: 'live',
  },
  {
    id: 'activations',
    title: 'Activations',
    summary: 'Sigmoid, tanh, and ReLU, with the tangent at a chosen input.',
    caption:
      'The curve is the activation. The short line is its tangent. ReLU’s slope at exactly zero is undefined; the figure draws 0 there.',
    objective: 'See the bend a neuron applies, and the slope backpropagation will multiply by.',
    interactions: [
      'Switch among sigmoid, tanh, and ReLU',
      'Move the input and read the output and the slope',
      'Sit ReLU on zero and read the caption about the kink',
    ],
    engine: 'svg',
    topic: 'deep-learning',
    status: 'live',
  },
  {
    id: 'backpropagation',
    title: 'Backpropagation',
    summary: 'Forward values and exact gradients on a one-unit network, then one gradient step.',
    caption:
      'One input, a ReLU, a linear output, and a squared error. The table is the chain rule. One step subtracts 0.2 times each parameter gradient. The ReLU gate is 0 at a negative pre-activation, and also at exactly zero.',
    objective: 'See a gradient arrive at each weight, and see it stop when the ReLU is closed.',
    interactions: [
      'Read the forward numbers and the gradients',
      'Close the ReLU and watch the first-layer gradients become zero',
      'Take one step, then reset',
    ],
    engine: 'svg',
    topic: 'deep-learning',
    status: 'live',
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
