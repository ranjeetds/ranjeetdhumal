/**
 * The Explore map. A domain is a place to start, not a pile of empty lesson pages.
 * Topics name what the domain is responsible for. A lesson appears only when a note
 * exists, matched by `topicId` or listed in `lessons`.
 */

import type { TopicId } from '@/data/topics';

export interface DomainTopic {
  title: string;
  /** One or two sentences. This is the map, not a lesson. */
  summary: string;
}

export interface DomainGroup {
  title: string;
  topics: readonly DomainTopic[];
}

export interface Domain {
  id: string;
  title: string;
  /** One sentence for cards and search. */
  description: string;
  /** Who the domain is for, in one sentence. */
  audience: string;
  /** Knowledge Hub field this domain continues, when one exists. */
  topicId?: TopicId;
  /** Notes to show even when their topic field points elsewhere. */
  lessons?: readonly string[];
  /** Project tag that should surface repositories on this domain. */
  projectTag?: string;
  overview: readonly string[];
  groups: readonly DomainGroup[];
}

export const domains = [
  {
    id: 'python',
    title: 'Python and programming',
    description: 'The language the libraries speak, and the habits that keep numerical code honest.',
    audience: 'Beginners who need to read and write the code the later domains assume.',
    overview: [
      'Python is here because NumPy, PyTorch, and the notebooks people learn from speak it. The language itself is the smaller part. The larger part is knowing which axis a calculation runs along, which array is a view of another, and which test would fail if the mathematics were wrong.',
      'No Python lesson is published yet. The computer-science essays on the Knowledge Hub cover arrays, cost, vectorization, and numerical tests, which is the part of programming this notebook treats as part of learning a model rather than as a separate course.',
    ],
    groups: [
      {
        title: 'The language',
        topics: [
          { title: 'Fundamentals', summary: 'Names, control flow, functions, and the difference between a value and a name bound to it.' },
          { title: 'Data structures', summary: 'Lists, dicts, and sets, and which one makes a later lookup cheap.' },
          { title: 'Objects', summary: 'A class as a bundle of state and operations, used when a function argument list has become a protocol.' },
        ],
      },
      {
        title: 'Numerical Python',
        topics: [
          { title: 'NumPy', summary: 'Shape, stride, and dtype. Most model bugs that are not mathematical are one of those three.' },
          { title: 'Pandas', summary: 'A table with labels. Useful for inspection, and a poor place to hide a training loop.' },
          { title: 'Tests', summary: 'A gradient check, a fixed seed, and a hand-computed example small enough to inspect.' },
        ],
      },
    ],
  },
  {
    id: 'mathematics',
    title: 'Mathematics for AI',
    description: 'Samples, linear maps, derivatives, probability, and optimization, kept as pictures.',
    audience: 'Readers who want a symbol in a paper to refer to an object they have already seen.',
    topicId: 'mathematics',
    overview: [
      'The mathematics on this site is the mathematics the code is already doing. A dataset is a sample. A layer is a linear map. Training follows a slope. A softmax emits numbers that add to one, which is not yet a reason to trust them.',
      'Start with the sample and its mean. The tail of a distribution moves that mean to a place few of the values occupy. Everything later that reports an average, including a loss, inherits that limit.',
    ],
    groups: [
      {
        title: 'Before a model',
        topics: [
          { title: 'Statistics', summary: 'A sample is not the population. The mean is one number. Shape is what it throws away.' },
          { title: 'Probability', summary: 'Weight on alternatives, conditional probability, and the calibration check a confidence score still has to pass.' },
          { title: 'Information', summary: 'How much a distribution surprises you. Used later as a loss, not as a metaphor for meaning.' },
        ],
      },
      {
        title: 'Inside a training step',
        topics: [
          { title: 'Linear algebra', summary: 'Vectors, matrices as maps, and the directions a map keeps or collapses.' },
          { title: 'Calculus', summary: 'A derivative is a local slope. The chain rule is why a network can be trained.' },
          { title: 'Optimization', summary: 'Walking downhill under constraints, including the ones a training setup imposes besides the loss.' },
        ],
      },
    ],
  },
  {
    id: 'machine-learning',
    title: 'Machine learning',
    description: 'A task stated as inputs, a family of functions, and a loss, then the ways that family can be too weak or too flexible.',
    audience: 'Engineers who can train a model and want to say which part of the setup did the work.',
    topicId: 'machine-learning',
    overview: [
      'A learning problem is three choices: what the model is allowed to see, which functions it is allowed to be, and which mistakes the loss treats as expensive. Change only the loss and the task has changed, even if the spreadsheet has not.',
      'The published path begins at a sample and a network rather than at a catalogue of algorithms. Decision trees, boosting, and clustering are part of this domain and do not yet have their own essays. The Knowledge Hub field says what those families are for.',
    ],
    groups: [
      {
        title: 'The setup',
        topics: [
          { title: 'Supervised learning', summary: 'Inputs, targets, and a loss computed on the rows you have.' },
          { title: 'Evaluation', summary: 'A metric is a choice. A score can improve while the behaviour you care about gets worse.' },
          { title: 'Generalization', summary: 'A function that fits the sample and fails on the next batch was flexible enough to remember the rows.' },
        ],
      },
      {
        title: 'Families',
        topics: [
          { title: 'Linear models', summary: 'A weighted sum. The right first model because the weights can be read and the fit is convex.' },
          { title: 'Trees and ensembles', summary: 'Axis-aligned cuts, then averages of those cuts. Not yet a separate essay.' },
          { title: 'Unsupervised learning', summary: 'Structure found without targets. Clustering and dimensionality reduction live here, and are not yet written up.' },
        ],
      },
    ],
  },
  {
    id: 'deep-learning',
    title: 'Deep learning',
    description: 'Networks as composition: a linear map, a bend, and a search for the weights that make a loss small.',
    audience: 'Readers who want depth to mean composition, not a metaphor for thought.',
    topicId: 'deep-learning',
    overview: [
      'A layer is a weighted sum, a bias, and a nonlinearity. Stack linear maps with nothing between them and the stack collapses into one map. The bend is what makes the next layer see combinations the previous one could not have made alone.',
      'Training does not look at the meaning of the data. It follows the slope of one function at one point. Two correct walks on the same surface can settle in different valleys. That is the figure on the homepage.',
    ],
    groups: [
      {
        title: 'The function',
        topics: [
          { title: 'Networks', summary: 'Affine maps, a nonlinearity, and composition. Published as How Neural Networks Learn.' },
          { title: 'Representations', summary: 'The values flowing through the network, as directions later layers can use.' },
          { title: 'Convolution', summary: 'One filter reused across positions. Specified, not yet a figure or an essay.' },
        ],
      },
      {
        title: 'The search',
        topics: [
          { title: 'Loss', summary: 'One number that says how wrong a prediction was. It defines the task.' },
          { title: 'Backpropagation', summary: 'The chain rule along the graph. Specified as a figure, not yet built.' },
          { title: 'Regularization', summary: 'A constraint besides the loss: a penalty, a finite step, a normalization.' },
        ],
      },
    ],
  },
  {
    id: 'nlp',
    title: 'Natural language processing',
    description: 'Text as a sequence of pieces, and the operations that mix those pieces.',
    audience: 'Readers coming from classical NLP who want the pieces a language model actually receives.',
    lessons: ['embeddings-and-representation', 'attention-and-transformers', 'large-language-models'],
    overview: [
      'Classical NLP and a language model meet at the same fact: the model does not receive words. It receives pieces from a vocabulary that was fit for length, not for linguistic sense. Embeddings turn those pieces into directions. Attention mixes the directions.',
      'Preprocessing, sequence labelling, and parsing are not written up here. The published essays start where those pipelines now usually end: a vector, a head, and a distribution over the next piece.',
    ],
    groups: [
      {
        title: 'Text as input',
        topics: [
          { title: 'Tokenization', summary: 'The cut a model actually sees. The figure compares a word cut with a small designed vocabulary.' },
          { title: 'Embeddings', summary: 'A piece stored as a direction. Similarity is an angle, and a flat plot is a choice of projection.' },
          { title: 'Sequence models', summary: 'Recurrence, then attention as the operation that replaced the recurrence for long contexts.' },
        ],
      },
      {
        title: 'Using the sequence',
        topics: [
          { title: 'Attention', summary: 'A weighted average of values. Published with a two-head figure.' },
          { title: 'Language models', summary: 'The same machinery pointed at the next piece. Published with a next-token figure.' },
        ],
      },
    ],
  },
  {
    id: 'generative-ai',
    title: 'Generative AI and LLMs',
    description: 'A distribution over tokens, a sampling rule, and the training signals that shape that distribution.',
    audience: 'Engineers who use language models and want the output to stay a distribution rather than a personality.',
    topicId: 'generative-ai',
    projectTag: 'generative-ai',
    overview: [
      'The output of this kind of model is not a sentence. It is a distribution over the next token, and the sentence in a product is one sample, or a chain of samples. Temperature changes how peaked the draw is. It does not add knowledge.',
      'Pretraining, instruction tuning, LoRA, and quantization are named here because they are the levers people reach for. They do not yet have their own essays. The published chapters stop at the distribution, the block that produces it, and the question of whether a confident number is calibrated.',
    ],
    groups: [
      {
        title: 'The model',
        topics: [
          { title: 'Transformers', summary: 'Attention, a position-wise map, and a residual stream. The block is specified; the essay covers attention and the distribution.' },
          { title: 'Decoding', summary: 'Greedy, sampling, and temperature. The next-token figure is the small version.' },
          { title: 'Context', summary: 'What the model is shown. Retrieval changes the distribution only by changing this.' },
        ],
      },
      {
        title: 'Changing the model',
        topics: [
          { title: 'Adaptation', summary: 'Fine-tuning, including low-rank updates. Not yet an essay. It does not install a database.' },
          { title: 'Evaluation', summary: 'A fluent sample can be false. Calibration is the check. Published under Evaluation and Alignment.' },
        ],
      },
    ],
  },
  {
    id: 'rag',
    title: 'Retrieval augmented generation',
    description: 'Search, then a continuation. The model does not search your documents.',
    audience: 'Engineers wiring documents to a language model.',
    lessons: ['large-language-models'],
    projectTag: 'generative-ai',
    overview: [
      'A retrieved paragraph changes what a model says only by becoming part of the context attention can read. If the chunk is the wrong chunk, the distribution moves for the wrong reason. Blaming the model skips the retrieval.',
      'Chunking, vector stores, hybrid search, and reranking are the engineering of that context. They are not separate intelligences. No essay here is only about RAG yet. The language-model chapter states the boundary, and the public RAG starter kit is the code.',
    ],
    groups: [
      {
        title: 'The pipeline',
        topics: [
          { title: 'Chunking', summary: 'How a document is cut before it is embedded. The cut decides what can be retrieved.' },
          { title: 'Retrieval', summary: 'Nearest neighbours in an embedding space, sometimes mixed with lexical search.' },
          { title: 'Reranking', summary: 'A second pass over a short list. It does not repair a corpus that never contained the fact.' },
        ],
      },
      {
        title: 'Whether it worked',
        topics: [
          { title: 'Context', summary: 'The tokens the model actually receives after retrieval. This is the input, not a citation.' },
          { title: 'Evaluation', summary: 'Did the retrieved text support the claim, and would a wrong chunk have been visible?' },
        ],
      },
    ],
  },
  {
    id: 'agentic-ai',
    title: 'Agentic AI',
    description: 'A model that proposes, and a program that decides what may happen.',
    audience: 'Engineers building loops that call tools, and readers who have been shown agents as a longer prompt.',
    topicId: 'agentic-ai',
    overview: [
      'An agent is not a model with a longer prompt. The model proposes a next action from the observation it is given. The program decides what is allowed, does it, and puts the result where the next proposal can see it. A sentence that describes the right action, while the action was not taken, is a failed cycle.',
      'Planning, memory, and multi-agent arrangements are this loop with more state. The published essay is the loop. The figure that steps through it is specified and not yet built.',
    ],
    groups: [
      {
        title: 'One cycle',
        topics: [
          { title: 'The loop', summary: 'Observation, proposal, action, result. Published as Agentic Systems.' },
          { title: 'Tools', summary: 'A boundary. The model requests. The program runs or refuses.' },
          { title: 'State', summary: 'What the next observation contains. The transcript is not a substitute for it.' },
        ],
      },
      {
        title: 'Larger arrangements',
        topics: [
          { title: 'Memory and plans', summary: 'State you wrote down and might have to throw away when the result contradicts it.' },
          { title: 'Evaluation', summary: 'Score the resulting state, including the actions taken on the way. A polite final message is not the score.' },
        ],
      },
    ],
  },
  {
    id: 'computer-vision',
    title: 'Computer vision',
    description: 'Images as arrays, filters reused across positions, and the tasks those features are asked to serve.',
    audience: 'Readers who want vision models as computation on arrays, not as cameras that understand.',
    projectTag: 'computer-vision',
    overview: [
      'A photograph in this setting is an array. A convolution reuses one small filter at every position, on the assumption that a pattern means the same thing wherever it appears. That assumption is the architecture. It is not a claim that the filter has found an object.',
      'Detection, segmentation, and vision transformers are not written up yet. Gestify, in the project library, is a public vision repository. The urban-sound project is audio rather than images, and lives with deep learning.',
    ],
    groups: [
      {
        title: 'The array',
        topics: [
          { title: 'Images', summary: 'Height, width, channels, and the dtype. A bug here looks like a model bug.' },
          { title: 'Convolutions', summary: 'One filter, many positions, shared weights. Not yet an essay or a figure.' },
          { title: 'Architectures', summary: 'Stacks of those filters, residual paths, and later, attention over patches.' },
        ],
      },
      {
        title: 'Tasks',
        topics: [
          { title: 'Classification', summary: 'One label for the array. The easiest task, and the one a demo usually shows.' },
          { title: 'Detection and segmentation', summary: 'Where, or which pixels. A different output head, not a different philosophy.' },
        ],
      },
    ],
  },
  {
    id: 'mlops',
    title: 'MLOps and LLMOps',
    description: 'What has to be true of a model after the notebook: data, versions, evaluation, and the cost of a prediction.',
    audience: 'Engineers taking a model out of a notebook.',
    overview: [
      'A result you cannot regenerate is an anecdote. The habits that prevent that are dull and load-bearing: the data snapshot, the config next to the metrics, the seed, and a comparison you can rerun. Monitoring is the same habit after deployment. The score in production is still a choice of what to measure.',
      'Nothing in this domain is a published lesson yet. The research notes on reproducibility and benchmarks are the nearest writing. They are about evidence, which is the part of operations that fails first.',
    ],
    groups: [
      {
        title: 'Before serving',
        topics: [
          { title: 'Experiments', summary: 'Config, data, and metrics stored so the comparison can be rerun.' },
          { title: 'Evaluation pipelines', summary: 'The same held-out check, run on every change, including the checks a leaderboard cannot see.' },
        ],
      },
      {
        title: 'After serving',
        topics: [
          { title: 'Drift', summary: 'The inputs moved, or the relationship between inputs and the thing you cared about moved. Those are different failures.' },
          { title: 'Inference cost', summary: 'Latency, batching, and quantization as constraints on the function you are allowed to ship.' },
        ],
      },
    ],
  },
  {
    id: 'computer-science',
    title: 'Computer science',
    description: 'Arrays, cost, and the rest of the machine the mathematics treats as free.',
    audience: 'Readers who can follow an algorithm on a whiteboard and want the cost of running it.',
    topicId: 'python-cs',
    overview: [
      'A model that only runs once, on data that fitted in memory, is not yet a system. Attention over a sequence of length n compares every position with every other, so the work grows with n squared. That is why context length is a budget.',
      'Operating systems, databases, and networking are not separate essays here. The published field is the part that shows up inside numerical code: arrays, complexity, vectorization, and tests.',
    ],
    groups: [
      {
        title: 'Inside the notebook',
        topics: [
          { title: 'Arrays', summary: 'Memory plus a description of how to index it. A slice is often a view.' },
          { title: 'Cost', summary: 'How the work grows. A claim about the step you think dominates, checked by measuring it.' },
          { title: 'Vectorization', summary: 'The operation expressed so the inner loop is not a Python loop over rows.' },
        ],
      },
      {
        title: 'Around the notebook',
        topics: [
          { title: 'Systems', summary: 'Processes, storage, and networks. Not yet written as lessons. The cost of attention is the example this site uses.' },
          { title: 'System design', summary: 'Which component is allowed to fail, and which number you would notice first.' },
        ],
      },
    ],
  },
  {
    id: 'emerging-research',
    title: 'Emerging research',
    description: 'How to separate a claim from the evidence, and the questions this notebook has not closed.',
    audience: 'Readers who want a paper to stay a claim plus an experiment, not a slogan.',
    topicId: 'emerging-tech',
    lessons: ['evaluation-and-alignment'],
    overview: [
      'Research here means a kind of reading and a kind of test. The claim and the evidence are separate objects. A promising idea with an experiment that does not test it is a proposal. A modest idea with a clean comparison is a result.',
      'World models, reasoning models, and test-time compute are directions, not findings of this site. The research log marks planned entries as a queue. Evaluation and alignment is the published essay closest to the question of whether the number you are watching is the thing you care about.',
    ],
    groups: [
      {
        title: 'How to read',
        topics: [
          { title: 'Claim and evidence', summary: 'Read the experiment before the abstract. Write both sentences down.' },
          { title: 'Benchmarks', summary: 'A frozen set of tasks plus a scoring rule. The rule decides what the leaderboard cannot see.' },
        ],
      },
      {
        title: 'Open directions',
        topics: [
          { title: 'Efficiency and test-time compute', summary: 'Spending more computation at inference. A direction, not a result published here.' },
          { title: 'Safety and evaluation', summary: 'The published essay on metrics, calibration, and a training signal that is not the goal.' },
        ],
      },
    ],
  },
] as const satisfies readonly Domain[];

export type DomainId = (typeof domains)[number]['id'];

export function getDomain(id: string) {
  return domains.find((domain) => domain.id === id);
}
