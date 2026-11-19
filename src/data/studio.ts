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
  'loss-functions',
  'gradient-descent',
  'neuron',
  'activations',
  'backpropagation',
  'attention-patterns',
  'tokenization',
  'next-token',
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
    id: 'decision-boundaries',
    title: 'Decision boundaries',
    subtitle: 'A linear cut, a tree, and a small network on the same points.',
    domainId: 'machine-learning',
    status: 'planned',
  },
  {
    id: 'embedding-space',
    title: 'Embedding space',
    subtitle: 'Neighbours in a projection, and what the projection hides.',
    domainId: 'transformers',
    status: 'planned',
  },
  {
    id: 'agent-loop',
    title: 'Agent loop',
    subtitle: 'Observe, decide, act, and the failure of a tool.',
    domainId: 'agents',
    status: 'planned',
  },
] as const satisfies readonly StudioModule[];

export type StudioModuleId = (typeof studioModules)[number]['id'];

export const studioDomains = [
  {
    id: 'mathematics',
    title: 'Mathematics & Statistics',
    description: 'The quantities later lessons treat as given: a sample, a mean, and a score between two vectors.',
    why: 'A loss is an average of mistakes. A similarity is a dot product. Both are pictures before they are slogans.',
    prerequisites: 'None. This is a starting point. The derivative a descent needs is taught inside the gradient descent lesson.',
    related: ['machine-learning'],
    sequence: ['sample-mean', 'dot-product', 'gradient-descent'],
    groups: [
      {
        title: 'Estimation',
        lede: 'One population, many draws, and a mean that moves less as the draw grows.',
        modules: ['sample-mean'],
      },
      {
        title: 'Scores',
        lede: 'The product of two vectors, which is the score attention will use later.',
        modules: ['dot-product'],
      },
    ],
    reading: [{ href: '/knowledge/a-sample-and-its-mean', title: 'A sample and its mean' }],
  },
  {
    id: 'machine-learning',
    title: 'Machine Learning',
    description: 'A model is a function with adjustable numbers. Training is how those numbers move.',
    why: 'Almost every trained system is a search for parameters that make a loss smaller. The search is the thing worth seeing.',
    prerequisites: 'A mean, from the mathematics domain. The slope itself is defined in the lesson.',
    related: ['mathematics', 'deep-learning'],
    sequence: ['loss-functions', 'gradient-descent', 'decision-boundaries'],
    groups: [
      {
        title: 'Optimization',
        lede: 'A number for how wrong a prediction is, then a walk that makes that number smaller.',
        modules: ['loss-functions', 'gradient-descent'],
      },
      {
        title: 'Decisions',
        lede: 'How a fitted model cuts a space of examples. The instrument is not built.',
        modules: ['decision-boundaries'],
      },
    ],
    reading: [{ href: '/knowledge/training-dynamics', title: 'Training Dynamics and Optimization' }],
  },
  {
    id: 'deep-learning',
    title: 'Deep Learning',
    description: 'A stack of weighted sums and a bend, trained by the same kind of step as a single surface.',
    why: 'Depth is composition. The update is still a step along a gradient. Seeing the step first makes the stack legible.',
    prerequisites: 'Gradient descent. A network does not introduce a new kind of learning. It introduces a function the learning is applied to.',
    related: ['machine-learning', 'transformers'],
    sequence: ['neuron', 'activations', 'backpropagation'],
    groups: [
      {
        title: 'Foundations',
        lede: 'One unit, then the bend it applies.',
        modules: ['neuron', 'activations'],
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
    title: 'Transformers & LLMs',
    description: 'How a sequence is cut into pieces, mixed, and continued. These figures use designed numbers, not a trained model.',
    why: 'The public object is a chatbot. The mechanism is a distribution over pieces, conditioned on other pieces.',
    prerequisites: 'A vector as a list of numbers, and a dot product as a score. The lessons define both before they use them.',
    related: ['deep-learning', 'generative'],
    sequence: ['dot-product', 'tokenization', 'attention-patterns', 'next-token', 'embedding-space'],
    groups: [
      {
        title: 'The pieces a model sees',
        lede: 'A word on the page is not the unit the model receives.',
        modules: ['tokenization'],
      },
      {
        title: 'Mixing positions',
        lede: 'Attention turns scores between positions into a weighted average.',
        modules: ['attention-patterns'],
      },
      {
        title: 'Choosing a continuation',
        lede: 'The model returns a distribution. Temperature changes how peaked it is.',
        modules: ['next-token'],
      },
      {
        title: 'Where the pieces live',
        lede: 'An embedding is a position in a learned space. The projection is not built.',
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
    title: 'Agentic AI',
    description: 'A loop that looks at a state, chooses an action, and has to survive a tool that fails.',
    why: 'An agent is not a smarter chat window. It is a policy with side effects, and the failure that matters is a bad action, not a bad sentence.',
    prerequisites: 'A next-token distribution, because the decision is often still a sample from one. The loop around that sample is the new part.',
    related: ['generative', 'transformers'],
    sequence: ['agent-loop'],
    groups: [
      {
        title: 'The loop',
        lede: 'Observe, decide, act. The instrument is not built.',
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
    steps: ['gradient-descent', 'neuron', 'activations', 'backpropagation'],
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
    steps: ['dot-product', 'tokenization', 'attention-patterns', 'next-token', 'embedding-space'],
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
    description: 'The loop is named. The experiment is not built. The note is the written account.',
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
