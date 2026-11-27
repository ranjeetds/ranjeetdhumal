/**
 * Learning Studio catalogue.
 *
 * A live module has a page and a figure. A planned module is named in a sequence
 * and is not a page. Lessons live in `src/content/studio`; this file is the map
 * those lessons point at.
 */

export const studioDomainIds = [
  'mathematics',
  'machine-learning',
  'deep-learning',
  'transformers',
  'generative',
  'agents',
] as const;

export type StudioDomainId = (typeof studioDomainIds)[number];

export const liveVisualizationIds = [
  'sample-mean',
  'dot-product',
  'linear-map',
  'loss-functions',
  'gradient-descent',
  'neuron',
  'activations',
  'backpropagation',
  'attention-patterns',
  'tokenization',
  'next-token',
  'entropy',
  'normalization',
  'confusion',
  'neighbors',
  'convolution',
  'positional-encoding',
  'decision-boundaries',
  'transformer-block',
  'embedding-space',
  'agent-loop',
] as const;

export type LiveVisualizationId = (typeof liveVisualizationIds)[number];

export type StudioStatus = 'live' | 'planned';

export interface StudioModule {
  id: string;
  title: string;
  subtitle: string;
  domainId: StudioDomainId;
  status: StudioStatus;
}

export interface StudioGroup {
  title: string;
  /** One sentence on what the group is for. */
  lede: string;
  modules: readonly string[];
}

export interface StudioReading {
  href: string;
  title: string;
}

export interface StudioDomain {
  id: StudioDomainId;
  /** Knowledge Hub field this domain is listed under. */
  topic: 'mathematics' | 'machine-learning' | 'deep-learning' | 'generative-ai' | 'agentic-ai';
  title: string;
  description: string;
  /** Why the domain is worth a learner's time. */
  why: string;
  /** What to know before the sequence. Plain language, not a module id. */
  prerequisites: string;
  related: readonly StudioDomainId[];
  /** Recommended order, including modules that are not built. */
  sequence: readonly string[];
  groups: readonly StudioGroup[];
  reading?: readonly StudioReading[];
}

export interface StudioPath {
  id: string;
  title: string;
  description: string;
  steps: readonly string[];
  reading?: readonly StudioReading[];
}

export const studioModules = [
  {
    id: 'sample-mean',
    title: 'A sample and its mean',
    subtitle: 'Draw from a fixed population and watch the mean move.',
    domainId: 'mathematics',
    status: 'live',
  },
  {
    id: 'dot-product',
    title: 'Dot product',
    subtitle: 'Two arrows, their product, and the angle between them.',
    domainId: 'mathematics',
    status: 'live',
  },
  {
    id: 'linear-map',
    title: 'A matrix as a map',
    subtitle: 'Where a 2×2 matrix sends the basis, the unit circle, and one vector you choose.',
    domainId: 'mathematics',
    status: 'live',
  },
  {
    id: 'loss-functions',
    title: 'Loss functions',
    subtitle: 'Squared error and cross-entropy for one prediction and one target.',
    domainId: 'machine-learning',
    status: 'live',
  },
  {
    id: 'gradient-descent',
    title: 'Gradient descent',
    subtitle: 'Move an optimizer across a loss surface by changing the step it is allowed to take.',
    domainId: 'machine-learning',
    status: 'live',
  },
  {
    id: 'neuron',
    title: 'A neuron',
    subtitle: 'Two inputs, two weights, a bias, and one activation.',
    domainId: 'deep-learning',
    status: 'live',
  },
  {
    id: 'activations',
    title: 'Activations',
    subtitle: 'Sigmoid, tanh, and ReLU, and the slope at the input you choose.',
    domainId: 'deep-learning',
    status: 'live',
  },
  {
    id: 'backpropagation',
    title: 'Backpropagation',
    subtitle: 'The chain rule on one ReLU and one linear output, and a single step.',
    domainId: 'deep-learning',
    status: 'live',
  },
  {
    id: 'transformer-block',
    title: 'One transformer block',
    subtitle: 'Input, a handwritten mix, a residual, and a feed-forward that writes one coordinate.',
    domainId: 'transformers',
    status: 'live',
  },
  {
    id: 'attention-patterns',
    title: 'Attention patterns',
    subtitle: 'A designed pair of heads. The weights are written by hand, not taken from a trained model.',
    domainId: 'transformers',
    status: 'live',
  },
  {
    id: 'tokenization',
    title: 'Tokenization',
    subtitle: 'Cut one string two ways. The vocabulary is designed for this figure, not taken from a model.',
    domainId: 'transformers',
    status: 'live',
  },
  {
    id: 'next-token',
    title: 'Next-token distribution',
    subtitle: 'A toy distribution over six words. The scores are written by hand.',
    domainId: 'transformers',
    status: 'live',
  },
  {
    id: 'entropy',
    title: 'Binary entropy',
    subtitle: 'How many bits a coin with probability p still leaves undecided.',
    domainId: 'mathematics',
    status: 'live',
  },
  {
    id: 'normalization',
    title: 'A centered vector',
    subtitle: 'Six numbers, recentered, in units of their own spread.',
    domainId: 'mathematics',
    status: 'live',
  },
  {
    id: 'confusion',
    title: 'Precision and recall',
    subtitle: 'Four counts, and the rates a classifier is usually quoted by.',
    domainId: 'machine-learning',
    status: 'live',
  },
  {
    id: 'neighbors',
    title: 'Nearest neighbours',
    subtitle: 'A query, and a vote among the k closest labeled points.',
    domainId: 'machine-learning',
    status: 'live',
  },
  {
    id: 'convolution',
    title: 'A convolution',
    subtitle: 'One 3×3 kernel on a fixed 5×5 image.',
    domainId: 'deep-learning',
    status: 'live',
  },
  {
    id: 'positional-encoding',
    title: 'Positional encoding',
    subtitle: 'A position written as sines and cosines.',
    domainId: 'transformers',
    status: 'live',
  },
  {
    id: 'decision-boundaries',
    title: 'Decision boundaries',
    subtitle: 'A linear cut, a tree, and a small network on the same points.',
    domainId: 'machine-learning',
    status: 'live',
  },
  {
    id: 'embedding-space',
    title: 'Embedding space',
    subtitle: 'Neighbours in a projection, and what the projection hides.',
    domainId: 'transformers',
    status: 'live',
  },
  {
    id: 'agent-loop',
    title: 'Agent loop',
    subtitle: 'Observe, decide, act, and the failure of a tool.',
    domainId: 'agents',
    status: 'live',
  },
] as const satisfies readonly StudioModule[];

export type StudioModuleId = (typeof studioModules)[number]['id'];

export const studioDomains = [
  {
    id: 'mathematics',
    topic: 'mathematics',
    title: 'Mathematics & Statistics',
    description: 'The quantities later lessons treat as given: a sample, a mean, a score between two vectors, and a matrix acting as a map.',
    why: 'A loss is an average of mistakes. A similarity is a dot product. A layer\'s linear part is a map, and a direction it sends to zero is gone.',
    prerequisites: 'None. This is a starting point. The derivative a descent needs is taught inside the gradient descent lesson.',
    related: ['machine-learning'],
    sequence: ['sample-mean', 'entropy', 'normalization', 'dot-product', 'linear-map', 'gradient-descent'],
    groups: [
      {
        title: 'Estimation',
        lede: 'One population, many draws, and a mean that moves less as the draw grows.',
        modules: ['sample-mean'],
      },
      {
        title: 'Spread and uncertainty',
        lede: 'A vector recentered by its own spread, and the bits left in a coin flip.',
        modules: ['entropy', 'normalization'],
      },
      {
        title: 'Scores',
        lede: 'The product of two vectors, which is the score attention will use later.',
        modules: ['dot-product'],
      },
      {
        title: 'Linear algebra',
        lede: 'A matrix as a map of the plane: the directions it stretches, and the direction it sends to zero.',
        modules: ['linear-map'],
      },
    ],
    reading: [
      { href: '/knowledge/a-sample-and-its-mean', title: 'A sample and its mean' },
      { href: '/guides/a-matrix-is-a-map', title: 'A matrix is a map' },
    ],
  },
  {
    id: 'machine-learning',
    topic: 'machine-learning',
    title: 'Machine Learning',
    description: 'A model is a function with adjustable numbers. Training is how those numbers move.',
    why: 'Almost every trained system is a search for parameters that make a loss smaller. The search is the thing worth seeing.',
    prerequisites: 'A mean, from the mathematics domain. The slope itself is defined in the lesson.',
    related: ['mathematics', 'deep-learning'],
    sequence: ['loss-functions', 'confusion', 'neighbors', 'gradient-descent', 'decision-boundaries'],
    groups: [
      {
        title: 'A prediction and its score',
        lede: 'A loss for one number, the counts behind precision and recall, and a vote among neighbours.',
        modules: ['loss-functions', 'confusion', 'neighbors'],
      },
      {
        title: 'Optimization',
        lede: 'A walk that makes a loss smaller.',
        modules: ['gradient-descent'],
      },
      {
        title: 'Decisions',
        lede: 'A straight cut, a tree, and a bent score on the same exclusive-or.',
        modules: ['decision-boundaries'],
      },
    ],
    reading: [{ href: '/knowledge/training-dynamics', title: 'Training Dynamics and Optimization' }],
  },
  {
    id: 'deep-learning',
    topic: 'deep-learning',
    title: 'Deep Learning',
    description: 'A stack of weighted sums and a bend, trained by the same kind of step as a single surface.',
    why: 'Depth is composition. The update is still a step along a gradient. Seeing the step first makes the stack legible.',
    prerequisites: 'Gradient descent. A network does not introduce a new kind of learning. It introduces a function the learning is applied to.',
    related: ['machine-learning', 'transformers'],
    sequence: ['neuron', 'activations', 'convolution', 'backpropagation'],
    groups: [
      {
        title: 'Foundations',
        lede: 'One unit, then the bend it applies.',
        modules: ['neuron', 'activations', 'convolution'],
      },
      {
        title: 'Learning',
        lede: 'The chain rule through that unit, and one step of the weights.',
        modules: ['backpropagation'],
      },
    ],
    reading: [
      { href: '/knowledge/how-neural-networks-learn', title: 'How Neural Networks Learn' },
      { href: '/videos#but-what-is-a-neural-network', title: 'But what is a neural network?' },
      {
        href: '/videos#building-micrograd',
        title: 'The spelled-out intro to neural networks and backpropagation',
      },
    ],
  },
  {
    id: 'transformers',
    topic: 'generative-ai',
    title: 'Transformers & LLMs',
    description: 'How a sequence is cut into pieces, mixed, and continued. These figures use designed numbers, not a trained model.',
    why: 'The public object is a chatbot. The mechanism is a distribution over pieces, conditioned on other pieces.',
    prerequisites: 'A vector as a list of numbers, and a dot product as a score. The lessons define both before they use them.',
    related: ['deep-learning', 'generative'],
    sequence: ['dot-product', 'positional-encoding', 'tokenization', 'attention-patterns', 'transformer-block', 'next-token', 'embedding-space'],
    groups: [
      {
        title: 'Where a position goes',
        lede: 'A position written as sines and cosines, before the pieces are mixed.',
        modules: ['positional-encoding'],
      },
      {
        title: 'The pieces a model sees',
        lede: 'A word on the page is not the unit the model receives.',
        modules: ['tokenization'],
      },
      {
        title: 'Mixing positions',
        lede: 'Attention turns scores between positions into a weighted average, then a block adds that mix back.',
        modules: ['attention-patterns', 'transformer-block'],
      },
      {
        title: 'Choosing a continuation',
        lede: 'The model returns a distribution. Temperature changes how peaked it is.',
        modules: ['next-token'],
      },
      {
        title: 'Where the pieces live',
        lede: 'Two hand-placed planes. A neighbour in one is not a neighbour in the other.',
        modules: ['embedding-space'],
      },
    ],
    reading: [
      { href: '/knowledge/attention-and-transformers', title: 'Attention Mechanisms and Transformers' },
      { href: '/videos#attention-in-transformers', title: 'Attention in transformers, step by step' },
    ],
  },
  {
    id: 'generative',
    topic: 'generative-ai',
    title: 'Generative AI & RAG',
    description: 'A model continues a sequence. Retrieval puts source text in front of that continuation.',
    why: 'Generation without a source invents. Retrieval does not make the model honest, but it changes what the model is allowed to see.',
    prerequisites: 'Tokenization and a next-token distribution. Retrieval is a step in front of that distribution, not a replacement for it.',
    related: ['transformers', 'agents'],
    sequence: ['tokenization', 'next-token'],
    groups: [
      {
        title: 'What is live',
        lede: 'The continuation itself. A retrieval experiment is not built.',
        modules: ['tokenization', 'next-token'],
      },
    ],
    reading: [
      { href: '/knowledge/large-language-models', title: 'Large Language Models' },
      { href: '/projects#rag-starter-kit', title: 'RAG starter kit' },
    ],
  },
  {
    id: 'agents',
    topic: 'agentic-ai',
    title: 'Agentic AI',
    description: 'A loop that looks at a state, chooses an action, and has to survive a tool that fails.',
    why: 'An agent is not a smarter chat window. It is a policy with side effects, and the failure that matters is a bad action, not a bad sentence.',
    prerequisites: 'A next-token distribution, because the decision is often still a sample from one. The loop around that sample is the new part.',
    related: ['generative', 'transformers'],
    sequence: ['agent-loop'],
    groups: [
      {
        title: 'The loop',
        lede: 'Observe, decide, act, and a tool that can fail.',
        modules: ['agent-loop'],
      },
    ],
    reading: [{ href: '/knowledge/agentic-systems', title: 'Agentic AI Systems' }],
  },
] as const satisfies readonly StudioDomain[];

export const studioPaths = [
  {
    id: 'neural-networks',
    title: 'Understand Neural Networks',
    description: 'A step on a surface, one neuron, the bend, and the chain rule through that neuron.',
    steps: ['gradient-descent', 'neuron', 'activations', 'convolution', 'backpropagation'],
    reading: [
      { href: '/knowledge/how-neural-networks-learn', title: 'How Neural Networks Learn' },
      { href: '/videos#building-micrograd', title: 'The spelled-out intro to neural networks and backpropagation' },
    ],
  },
  {
    id: 'descent-to-deep',
    title: 'From Gradient Descent to Deep Learning',
    description: 'A mean, a loss, a step, a neuron, and the chain rule that trains it.',
    steps: ['sample-mean', 'loss-functions', 'gradient-descent', 'neuron', 'activations', 'backpropagation'],
  },
  {
    id: 'transformers',
    title: 'How Transformers Work',
    description: 'Cut a string, mix the pieces, and read the distribution the next piece is drawn from.',
    steps: ['dot-product', 'positional-encoding', 'tokenization', 'attention-patterns', 'transformer-block', 'next-token', 'embedding-space'],
    reading: [{ href: '/knowledge/attention-and-transformers', title: 'Attention Mechanisms and Transformers' }],
  },
  {
    id: 'rag',
    title: 'Build an Understanding of RAG',
    description: 'Retrieval in front of a continuation. The studio experiment is not built. The repository is real.',
    steps: ['tokenization', 'next-token'],
    reading: [
      { href: '/projects#rag-starter-kit', title: 'RAG starter kit' },
      { href: '/knowledge/large-language-models', title: 'Large Language Models' },
    ],
  },
  {
    id: 'agents',
    title: 'Explore Agentic Systems',
    description: 'One call, paused on the state the tool returned, including the call that fails.',
    steps: ['agent-loop'],
    reading: [{ href: '/knowledge/agentic-systems', title: 'Agentic AI Systems' }],
  },
] as const satisfies readonly StudioPath[];

export const featuredStudioIds = ['gradient-descent', 'attention-patterns', 'tokenization'] as const;

export function getStudioModule(id: string): StudioModule | undefined {
  return studioModules.find((module) => module.id === id);
}

export function liveStudioModules(): StudioModule[] {
  return studioModules.filter((module) => module.status === 'live');
}

export function getStudioDomain(id: string): StudioDomain | undefined {
  return studioDomains.find((domain) => domain.id === id);
}

export function getStudioPath(id: string): StudioPath | undefined {
  return studioPaths.find((path) => path.id === id);
}

export interface ResolvedStep {
  id: string;
  title: string;
  subtitle: string;
  status: StudioStatus;
  /** Set only for a live module. */
  href?: string;
}

/** A catalogue id, resolved for a sequence. Unknown ids are a build error. */
export function resolveStep(id: string, pathId?: string): ResolvedStep {
  const module = getStudioModule(id);
  if (!module) throw new Error(`Unknown studio module “${id}”.`);
  const href = module.status === 'live' ? `/studio/${module.id}${pathId ? `?path=${pathId}` : ''}` : undefined;
  return { id: module.id, title: module.title, subtitle: module.subtitle, status: module.status, href };
}

function assertCatalogue(): void {
  const ids = new Set(studioModules.map((module) => module.id));
  const live = new Set<string>(liveVisualizationIds);
  for (const module of studioModules) {
    if (module.status === 'live' && !live.has(module.id)) {
      throw new Error(`Live studio module “${module.id}” is missing from liveVisualizationIds.`);
    }
  }
  for (const id of liveVisualizationIds) {
    const module = getStudioModule(id);
    if (!module || module.status !== 'live') {
      throw new Error(`Visualization “${id}” is not a live studio module.`);
    }
  }
  for (const domain of studioDomains) {
    if (!getStudioDomain(domain.id)) throw new Error(`Domain “${domain.id}” is missing.`);
    for (const related of domain.related) {
      if (!getStudioDomain(related)) throw new Error(`Domain “${domain.id}” relates to unknown “${related}”.`);
    }
    for (const id of domain.sequence) {
      if (!ids.has(id)) throw new Error(`Domain “${domain.id}” lists unknown module “${id}”.`);
    }
    for (const group of domain.groups) {
      for (const id of group.modules) {
        if (!ids.has(id)) throw new Error(`Group “${group.title}” lists unknown module “${id}”.`);
      }
    }
  }
  for (const path of studioPaths) {
    for (const id of path.steps) {
      if (!ids.has(id)) throw new Error(`Path “${path.id}” lists unknown module “${id}”.`);
    }
  }
}

assertCatalogue();
