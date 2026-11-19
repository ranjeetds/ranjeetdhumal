/**
 * The journeys a reader can ask for. `open` links a path that has written modules.
 * `domain` links the Explore page. It is not a course.
 */

export interface Journey {
  title: string;
  audience: string;
  href: string;
  status: 'open' | 'domain';
}

export const journeys = [
  {
    title: 'From data to intelligence',
    audience: 'The journey to follow first, from a sample to an agent.',
    href: '/learning-paths#from-data-to-intelligence',
    status: 'open',
  },
  {
    title: 'Python from beginner to advanced',
    audience: 'Readers who need the language before the mathematics.',
    href: '/explore/python',
    status: 'domain',
  },
  {
    title: 'Mathematics for machine learning',
    audience: 'Readers who want a symbol to name an object.',
    href: '/learning-paths#mathematics-for-ai',
    status: 'open',
  },
  {
    title: 'Machine learning foundations',
    audience: 'A task as inputs, a family of functions, and a loss.',
    href: '/learning-paths#foundations-of-machine-learning',
    status: 'open',
  },
  {
    title: 'Deep learning from first principles',
    audience: 'A network as a graph, then the graph that replaced recurrence.',
    href: '/learning-paths#neural-networks-to-transformers',
    status: 'open',
  },
  {
    title: 'Natural language processing',
    audience: 'Text as pieces, then the operations that mix them.',
    href: '/explore/nlp',
    status: 'domain',
  },
  {
    title: 'Generative AI and large language models',
    audience: 'Using a model as a component, including the decision not to train.',
    href: '/learning-paths#building-with-modern-llms',
    status: 'open',
  },
  {
    title: 'Understanding transformers',
    audience: 'The same sequence as deep learning, read for the block.',
    href: '/learning-paths#neural-networks-to-transformers',
    status: 'open',
  },
  {
    title: 'Retrieval augmented generation',
    audience: 'Search, then a continuation. Not its own course yet.',
    href: '/explore/rag',
    status: 'domain',
  },
  {
    title: 'Building agentic AI systems',
    audience: 'The loop, the tools, and the test of the resulting state.',
    href: '/learning-paths#agentic-ai-systems',
    status: 'open',
  },
  {
    title: 'Computer vision foundations',
    audience: 'Images as arrays. No lesson sequence yet.',
    href: '/explore/computer-vision',
    status: 'domain',
  },
  {
    title: 'MLOps and production AI systems',
    audience: 'What has to be true after the notebook. No lesson sequence yet.',
    href: '/explore/mlops',
    status: 'domain',
  },
  {
    title: 'Computer science foundations',
    audience: 'Cost and arrays. The field essay exists; a separate path does not.',
    href: '/explore/computer-science',
    status: 'domain',
  },
] as const satisfies readonly Journey[];
