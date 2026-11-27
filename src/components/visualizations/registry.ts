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
    summary: 'A straight cut, a tree, and a product score on one exclusive-or.',
    objective: 'Connect a model class to the shapes of boundary it is able to draw.',
    interactions: [
      'Switch among a linear cut, a tree, and a small network',
      'Move Fit from the starting rule to the designed rule',
      'Move the probe and read which class the rule calls it',
    ],
    caption:
      'Eight fixed points in opposite corners. Switch the rule, then move Fit from 0 to 1. The path is designed. It is not a training run. A dashed ring is a point the rule gets wrong.',
    engine: 'svg',
    topic: 'machine-learning',
    status: 'live',
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
    summary: 'Five stops on one designed block: input, mix, add, feed-forward, add.',
    objective: 'Read a block as a sequence of operations on a vector, and see a coordinate that one token writes and the other does not.',
    interactions: [
      'Step through the five stops',
      'Switch from token A to token B',
      'Read the third coordinate at the last stop',
    ],
    caption:
      'Two tokens, three coordinates, five stops. The weights are written by hand. The third coordinate changes only when the residual’s first coordinate is above 1.',
    engine: 'svg',
    topic: 'generative-ai',
    status: 'live',
  },
  {
    id: 'embedding-space',
    title: 'Embedding space',
    summary: 'Eight tokens in two hand-placed planes, and the neighbours that change with the plane.',
    objective: 'Treat distance in the projection as a picture of similarity, and notice what the projection hides.',
    caption:
      'Eight tokens placed by hand in two planes. Usage keeps king near queen. Spelling does not. Select a token, then switch planes.',
    interactions: [
      'Select a token and read its two nearest neighbours',
      'Switch between the usage plane and the spelling plane',
      'Notice which pair survives the switch',
    ],
    engine: 'svg',
    topic: 'generative-ai',
    status: 'live',
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
    id: 'linear-map',
    title: 'A matrix as a map',
    summary: 'A 2×2 matrix sending the basis, the unit circle, and one chosen vector to new places.',
    caption:
      'Five designed maps of the plane. The ink arrows are the columns. The amber curve is the unit circle after the map. A dashed line is a direction that stays on itself.',
    objective: 'Say which directions a matrix stretches, and which it sends to zero.',
    interactions: [
      'Switch among stretch, rotation, shear, and the two rank-1 maps',
      'Move the input vector and read where it goes',
      'Compare the columns with the rank',
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
    id: 'entropy',
    title: 'Binary entropy',
    summary: 'How many bits a coin with probability p still leaves undecided.',
    caption:
      'One slider, the probability of heads. The curve is binary entropy in bits, using log base 2. It peaks at one bit when the coin is fair.',
    objective: 'See that uncertainty is highest at an even chance and falls as the outcome becomes lopsided.',
    interactions: [
      'Move the probability from near 0 to near 1',
      'Stop at 0.5 and read one bit',
      'Compare 0.2 with 0.8',
    ],
    engine: 'svg',
    topic: 'mathematics',
    status: 'live',
  },
  {
    id: 'normalization',
    title: 'A centered vector',
    summary: 'Six numbers, their mean, and each value in units of the population standard deviation.',
    caption:
      'The bars are z-scores. The deviation divides by the count of the six numbers, not by five. A constant vector has deviation 0, and every z-score is then 0.',
    objective: 'See that changing one number moves the mean and every other score.',
    interactions: [
      'Select a number and move it',
      'Make all six numbers equal and read a deviation of 0',
      'Reset to 1, 2, 3, 4, 5, 9',
    ],
    engine: 'svg',
    topic: 'mathematics',
    status: 'live',
  },
  {
    id: 'confusion',
    title: 'Precision and recall',
    summary: 'Four counts, and the rates they define.',
    caption:
      'True positives, false positives, false negatives, and true negatives. Precision is true positives over predicted positives. Recall is true positives over actual positives. A rate with a zero denominator is left undefined.',
    objective: 'See that a high accuracy can hide a miss, and that precision and recall answer different questions.',
    interactions: [
      'Move each of the four counts',
      'Set predicted positives to zero and read that precision is undefined',
      'Raise false negatives and watch recall fall while precision stays',
    ],
    engine: 'svg',
    topic: 'machine-learning',
    status: 'live',
  },
  {
    id: 'neighbors',
    title: 'Nearest neighbours',
    summary: 'A query point and a vote among the k closest labeled points.',
    caption:
      'Eight fixed points, four in each class. Distance is Euclidean. The lines are the neighbours in the vote. An equal distance keeps the earlier point in the list. An equal vote is a tie.',
    objective: 'See the label change with k, without any training step.',
    interactions: [
      'Move the query',
      'Switch k among 1, 3, and 5',
      'From the origin, compare k = 3 with k = 5',
    ],
    engine: 'svg',
    topic: 'machine-learning',
    status: 'live',
  },
  {
    id: 'convolution',
    title: 'A convolution',
    summary: 'One 3×3 kernel slid across a fixed 5×5 image.',
    caption:
      'Pick an output cell. The shaded window is what that cell sees. The value is the sum of element-wise products. Box blur then divides by 9. The image does not change.',
    objective: 'Read a convolution as a local sum of products, not as a layer diagram.',
    interactions: [
      'Select an output cell',
      'Switch among a vertical edge, a box blur, and a sharpen kernel',
      'Read the raw sum beside the scaled value',
    ],
    engine: 'svg',
    topic: 'deep-learning',
    status: 'live',
  },
  {
    id: 'positional-encoding',
    title: 'Positional encoding',
    summary: 'Sine and cosine of a position, at eight frequencies.',
    caption:
      'The formula is the one in Vaswani et al. Even columns are sines, odd columns are cosines. The width is 8 so the column fits on the page. At position 0 every sine is 0 and every cosine is 1.',
    objective: 'See a position become a vector, and see nearby positions stay similar on the slow frequencies.',
    interactions: [
      'Move the position from 0 to 32',
      'Read the eight components',
      'Watch the first sine complete a wave while the last components barely move',
    ],
    engine: 'svg',
    topic: 'generative-ai',
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
      'Fail the tool and read the result state',
    ],
    caption:
      'One question, one accepted call, and a tool that returns either a balance or an error. Step through the state. Fail the tool and compare that state with the sentence a transcript could still say.',
    engine: 'svg',
    topic: 'agentic-ai',
    status: 'live',
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
