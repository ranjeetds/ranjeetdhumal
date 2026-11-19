/**
 * Learning Studio catalogue. A live module has a figure. A planned module is named
 * in the navigation and is not a page.
 */

export type StudioStatus = 'live' | 'planned';

export interface StudioEquation {
  /** Plain-language form. The studio does not load a math typesetting library. */
  formula: string;
  caption: string;
}

export interface StudioModule {
  id: string;
  title: string;
  subtitle: string;
  domain: string;
  status: StudioStatus;
  level?: string;
  prerequisites?: readonly string[];
  why?: string;
  usedIn?: string;
  observe?: readonly string[];
  challenges?: readonly string[];
  equations?: readonly StudioEquation[];
  /** Another live module id. */
  next?: string;
}

export const studioModules = [
  {
    id: 'sample-mean',
    title: 'A sample and its mean',
    subtitle: 'Draw from a fixed population and watch the mean move.',
    domain: 'Mathematics & statistics',
    status: 'live',
    level: 'Foundational',
    prerequisites: [],
    why: 'A mean is a fact about the rows you have. A loss and an accuracy are means of that kind.',
    usedIn: 'Every training loss that averages a mistake over a batch.',
    observe: [
      'Grey bars are the whole designed population. Coloured bars are one draw.',
      'At n = 8 the solid line jumps when you draw again. At n = 120 it stays near the dashed line.',
      'The dashed line does not sit on the tallest bar. The tail pulls it.',
    ],
    challenges: [
      'Draw again at n = 8 until the sample mean is more than 1 away from the population mean.',
      'Raise n on that same draw and watch the coloured shape approach the grey one.',
    ],
    next: 'gradient-descent',
  },
  {
    id: 'gradient-descent',
    title: 'Gradient descent',
    subtitle: 'Move an optimizer across a loss surface by changing the step it is allowed to take.',
    domain: 'Mathematics & statistics',
    status: 'live',
    level: 'Foundational',
    prerequisites: ['A sample and its mean'],
    why: 'Training is this walk. The weights change by a step along the slope of the loss.',
    usedIn: 'The update inside nearly every trained model, including a linear model and a transformer.',
    observe: [
      'The contour lines are the loss. The cross marks a minimum.',
      'The trace is the sequence of positions. It is not a drawing of the gradient field.',
      'On the two-valley surface, the start decides which cross the walk reaches.',
    ],
    equations: [
      {
        formula: 'θ ← θ − η ∇L(θ)',
        caption: 'SGD. η is the learning rate. ∇L is the slope at the current point.',
      },
      {
        formula: 'v ← μ v − η ∇L(θ),   θ ← θ + v',
        caption: 'Momentum. μ keeps a fraction of the previous step. SGD is this rule with μ = 0.',
      },
    ],
    challenges: [
      'On the two valleys, start on the left of the ridge and again on the right. Name which minimum each run reaches.',
      'Set momentum to 0 and raise the learning rate until the walk leaves the frame.',
      'Switch to the convex bowl. The same steep rate should still settle, because that surface has one well.',
      'Run momentum and Adam from the same start and compare the traces.',
    ],
    next: 'attention-patterns',
  },
  {
    id: 'attention-patterns',
    title: 'Attention patterns',
    subtitle: 'A designed pair of heads. The weights are written by hand, not taken from a trained model.',
    domain: 'Transformers & LLMs',
    status: 'live',
    level: 'Intermediate',
    prerequisites: ['A dot product as a score'],
    why: 'One head is a weighted average of values. The pattern is the weights.',
    usedIn: 'Every transformer block that mixes positions.',
    observe: [
      'Each row is a query. The cells are how much that query takes from each key.',
      'A causal mask zeros the future and the remaining row still sums to one.',
    ],
    challenges: [
      'Turn the mask on and off and watch which cells disappear.',
      'Switch heads and see that the same sentence can be mixed two different ways.',
    ],
    next: 'tokenization',
  },
  {
    id: 'tokenization',
    title: 'Tokenization',
    subtitle: 'Cut one string two ways. The vocabulary is designed for this figure, not taken from a model.',
    domain: 'Transformers & LLMs',
    status: 'live',
    level: 'Foundational',
    prerequisites: [],
    why: 'A model receives ids. A word you see as one unit may be several ids.',
    usedIn: 'The front of every language model, before any attention.',
    observe: [
      'Words mode keeps a run of letters together.',
      'Pieces mode takes the longest match from a small vocabulary. “unbelievable” falls apart.',
    ],
    challenges: [
      'Type unbelievable in both modes and count the pieces.',
      'Add a trailing space and see it become its own piece.',
    ],
    next: 'next-token',
  },
  {
    id: 'next-token',
    title: 'Next-token distribution',
    subtitle: 'A toy distribution over six words. The scores are written by hand.',
    domain: 'Transformers & LLMs',
    status: 'live',
    level: 'Intermediate',
    prerequisites: ['Tokenization'],
    why: 'The model returns a distribution. A sentence is a sample from it, repeated.',
    usedIn: 'Decoding: greedy, sampled, and temperature are policies on this distribution.',
    observe: [
      'The bars are probabilities. They sum to one.',
      'Lowering the temperature makes the tallest bar taller. It does not change which words exist.',
    ],
    challenges: [
      'Set a low temperature and a high one on the same prefix.',
      'Change the prefix and see the tallest bar move.',
    ],
  },
  {
    id: 'decision-boundaries',
    title: 'Decision boundaries',
    subtitle: 'Drag points and compare a linear cut, a tree, and a small network.',
    domain: 'Machine learning',
    status: 'planned',
  },
  {
    id: 'neural-playground',
    title: 'Neural network playground',
    subtitle: 'Change the layers and watch a forward pass.',
    domain: 'Deep learning',
    status: 'planned',
  },
  {
    id: 'backpropagation',
    title: 'Backpropagation',
    subtitle: 'Step the chain rule through a small network.',
    domain: 'Deep learning',
    status: 'planned',
  },
  {
    id: 'embedding-space',
    title: 'Embedding space',
    subtitle: 'Neighbours in a projection, and what the projection hides.',
    domain: 'Transformers & LLMs',
    status: 'planned',
  },
  {
    id: 'agent-loop',
    title: 'Agent loop',
    subtitle: 'Step observe, decide, act, and the failure of a tool.',
    domain: 'Agentic AI',
    status: 'planned',
  },
] as const satisfies readonly StudioModule[];

export type StudioModuleId = (typeof studioModules)[number]['id'];

export function getStudioModule(id: string): StudioModule | undefined {
  return studioModules.find((module) => module.id === id);
}

export function liveStudioModules(): StudioModule[] {
  return studioModules.filter((module) => module.status === 'live');
}
