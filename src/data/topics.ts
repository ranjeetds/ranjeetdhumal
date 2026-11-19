/**
 * The fields of study that organize the Knowledge Hub. Topic ids are part of the
 * content schema (`topic` in note frontmatter), so renaming one is a content migration.
 *
 * `introduction` and `entries` are the map itself: why the field matters, and a
 * working explanation of the ideas a note will later take apart with a figure.
 * An entry is not a published note until a file exists for it.
 */

export interface TopicEntry {
  title: string;
  paragraphs: readonly string[];
}

export interface Topic {
  id: string;
  title: string;
  /** One sentence, used where a field is only being pointed at. */
  description: string;
  introduction: readonly string[];
  entries: readonly TopicEntry[];
}

export const topics = [
  {
    id: 'artificial-intelligence',
    title: 'AI Fundamentals',
    description: 'What an intelligent system is, before any particular model.',
    introduction: [
      'Every later topic in this notebook is a way of producing behaviour. The fundamentals are the vocabulary for saying what the behaviour is, what it is allowed to see, and what counts as success. Without that vocabulary, a neural network and a chess engine look like different subjects. They are not. Both are agents in an environment, and the interesting differences are in how the action is chosen.',
      'The split is worth keeping even when the system is a chatbot. The model proposes; the product decides what that proposal is allowed to change. Search, logical rules, and learned functions are three different procedures for the same job: given a situation, pick an action. Modern practice leans on learning because the situations are too varied to write down. The older ideas still tell you what the learned system is failing to represent, and they are the right tool when the problem is small enough to solve exactly.',
    ],
    entries: [
      {
        title: 'Agents and environments',
        paragraphs: [
          'An agent is anything that maps observations to actions. The environment is whatever those actions affect, including the next observation. The definition is deliberately thin. A thermostat qualifies, and so does a trading system. The thinness is the point: it stops you from confusing the mechanism (a transformer, a tree, a pile of if-statements) with the role.',
          'Once the split is explicit, design questions get sharper. What can the agent observe, and what is hidden? Are actions reversible? Does the environment change while the agent is thinking? Most failures called "hallucinations" or "reward hacking" are mismatches at this boundary: the agent optimised a signal that was not the thing the environment actually cared about.',
        ],
      },
      {
        title: 'Search',
        paragraphs: [
          'Search is what you do when the right action can be found by looking ahead. You have a state, a set of moves, and a test for a goal. Breadth-first, depth-first, and A* differ in the order they spend that look-ahead, not in the kind of problem they solve. The cost is branching: each extra ply multiplies the states you might have to visit.',
          'Learning did not retire search. A language model samples token by token; decoding strategies are search over that sequence. A planner around a model searches over tool calls. Knowing the classical algorithms matters because it tells you which part of a modern system is enumerating possibilities and which part is scoring them.',
        ],
      },
      {
        title: 'Representation',
        paragraphs: [
          'A representation is a choice of what to write down. The same chess position can be a list of piece coordinates, a bitmap, or a paragraph. Those are not equally useful. A good representation makes the operation you care about cheap and the distinctions you care about visible. A bad one forces the model to rediscover structure that you could have handed it.',
          'This is the quiet half of feature engineering, embeddings, and tokenizers. Each is a decision about the objects the rest of the system will treat as atomic. When a model fails on a task that looks easy to a person, the first question is often whether the representation erased the distinction the task depends on.',
        ],
      },
      {
        title: 'Reasoning under uncertainty',
        paragraphs: [
          'Most environments do not return a single next state. Sensors are noisy, other agents are unpredictable, and the data you trained on is a sample. Probability is the language for that, not a late-stage elective. A system that cannot say how unsure it is will take the same action on a clear case and on a guess.',
          'The practical forms show up everywhere downstream: a classifier\'s confidence, a Bayesian update when new evidence arrives, a confidence interval on a metric, a decoder\'s temperature. The fundamental skill is separating "the model prefers this answer" from "the world is likely to agree." Those are different statements, and only one of them is a probability.',
        ],
      },
    ],
  },
  {
    id: 'machine-learning',
    title: 'Machine Learning',
    description: 'Learning from data when the model is still something you can draw.',
    introduction: [
      'Machine learning is the move from writing the rule to estimating it. You choose a family of functions, a way to score them against data, and a procedure that searches the family for a good score. Everything else — features, regularizers, train and test splits — is there to make that search honest. If the procedure can see the answers it will later be judged on, the score is theatre.',
      'Classical models earn their place because you can still draw them. A linear boundary, a tree, a small ensemble: the failure mode is visible. That visibility is the preparation for deep learning, where the function is no longer something you can sketch and the same questions — capacity, generalization, leakage — are harder to see. The path that starts here stays with those drawable models until evaluation is a habit. A leaked feature or a flattering metric will pick the wrong model at any scale, and a person who cannot explain a logistic regression will not be saved by a larger network.',
    ],
    entries: [
      {
        title: 'Supervised learning',
        paragraphs: [
          'Supervised learning assumes pairs: an input, and the output you wish the model had produced. The model is a function from one to the other. Training adjusts the function so that, on the pairs you have, the disagreement is small. The hope, which has to be earned, is that the disagreement stays small on pairs you have not seen.',
          'Classification and regression are the same idea with a different disagreement. One penalises a wrong label, the other a wrong number. The choice of penalty is part of the model. Squared error treats a miss of ten as much worse than two misses of five; cross-entropy treats a confident wrong answer as a serious error. Picking the loss is picking what you are willing to be wrong about.',
        ],
      },
      {
        title: 'Generalization',
        paragraphs: [
          'A model generalizes when its performance on new data is close to its performance on the data it was fit to. The gap between the two is the thing to watch. A model can be perfect on the training set by memorising it. Memorisation is not learning, and it is the default outcome when the family of functions is rich and the data is small.',
          'Bias and variance are the two ways the gap opens. A rigid model misses structure that is really there. A flexible model chases structure that was only in this sample. Regularization, more data, and a simpler family are different responses to the second failure. None of them is free: each gives up some ability to fit the training set in exchange for a smaller gap.',
        ],
      },
      {
        title: 'Linear models',
        paragraphs: [
          'A linear model predicts a weighted sum of its inputs, sometimes passed through a sigmoid or a softmax. The weights are the whole model. That is why it is the right first model: you can read which inputs it used, the fit is a convex problem with a reliable solution, and the boundary it draws is a flat cut through the space.',
          'The limitation is the flat cut. If the classes are intertwined, no set of weights will separate them. Adding features — products, bins, distances — is how you bend the cut without leaving the linear family. Understanding that trick matters later, because a hidden layer in a network is a learned version of the same move: build new coordinates in which a simple rule works.',
        ],
      },
      {
        title: 'Evaluation',
        paragraphs: [
          'A metric is a summary, and summaries hide things. Accuracy hides a rare class. A single loss hides whether the errors are concentrated on one slice of the data. The discipline is to decide, before looking at the score, which mistakes are expensive, and to report those directly.',
          'The other half of evaluation is the split. A test set that influenced any choice — which features, which model, when to stop — is no longer a test. Leakage is usually mundane: a feature computed with the full column, a duplicate row on both sides of the split, a timestamp ignored. Most impressive numbers that do not survive contact with new data failed here, not in the choice of algorithm.',
        ],
      },
    ],
  },
  {
    id: 'deep-learning',
    title: 'Deep Learning',
    description: 'Networks as computation graphs: how a loss becomes a change in a weight.',
    introduction: [
      'A deep network is a composition of simple functions, trained by gradient descent on a loss. The depth is not mysticism. Each layer computes new coordinates from the previous ones, and the composition can represent functions that no single layer could. The cost of that flexibility is that the loss surface is no longer convex, the number of weights is large, and a bug in the graph is invisible unless you can trace a gradient.',
      'The useful mental model is the computation graph, not the metaphor of neurons. Forward, the graph turns an input into a prediction and a loss. Backward, it turns the loss into a partial derivative for every weight, by the chain rule. Training is the repeated application of that pair. Architectures — convolutions, residual connections, attention — are constraints on the graph that encode something you believe about the data, so the model does not have to learn it from scratch.',
    ],
    entries: [
      {
        title: 'Computation graphs',
        paragraphs: [
          'Write the prediction as a diagram of operations, each with inputs and a single output. A linear layer is a matrix multiply and an add. A nonlinearity is a bend applied elementwise. The loss is the last node. This diagram is the model. Code that does not correspond to a diagram you could draw is code you cannot debug.',
          'The graph also explains shapes. A tensor\'s dimensions are not bookkeeping; they say which axis is a batch, which is a position, which is a feature. Most implementation errors are a dimension that silently meant the wrong thing. Naming the axes, and refusing to multiply two of them until you can say what the product is, prevents a class of mistakes that tests rarely catch.',
        ],
      },
      {
        title: 'Backpropagation',
        paragraphs: [
          'Backpropagation is the chain rule, applied once per edge of the graph, from the loss back to the inputs. At each node you ask: if my output had been slightly larger, how would the loss have changed, and how does that pass to each of my inputs? The answer at a weight is the direction to nudge it.',
          'The insight that makes the algorithm obvious is locality. No node needs to understand the whole network. It needs its own derivative and the derivative arriving from downstream. That is why automatic differentiation works, and why a hand-derived gradient for a new layer only has to be correct for that layer. When training does something strange, the first check is whether those local derivatives have the sign and the scale you expect.',
        ],
      },
      {
        title: 'Convolution',
        paragraphs: [
          'A convolution reuses one small filter across every position. The assumption built into the architecture is that a pattern means the same thing wherever it appears: an edge in a photograph, a motif in a spectrogram. Sharing the weights means the model has far fewer parameters than a fully connected layer on the same input, and that it cannot memorise a pattern at one location only.',
          'Pooling and stride throw away position on purpose. That is a bet that exact coordinates matter less than the presence of the pattern. The bet is right for many images and wrong for anything where "where" is the question. Knowing you made the bet is what lets you decide whether a convolutional stack is the right graph or whether you have just erased the signal.',
        ],
      },
      {
        title: 'What makes training stable',
        paragraphs: [
          'A deep graph multiplies many derivatives together. If each is a little smaller than one, the gradient at the early layers vanishes. If each is a little larger, it explodes. Initialization, normalization, and residual connections are three different ways of keeping that product near a usable scale. They are not decorations on top of an architecture. They are what lets the architecture train at all.',
          'The practical symptom is a loss that is NaN, or a loss that sits still. The diagnosis is almost never "needs a different optimizer" first. Look at the scale of activations layer by layer, and at whether a residual path lets the gradient skip the layers that are shrinking it. Residual connections matter because they give the gradient a road that does not pass through every multiplication.',
        ],
      },
    ],
  },
  {
    id: 'generative-ai',
    title: 'Generative AI & LLMs',
    description: 'Tokenization, attention, and the mechanics of large language models.',
    introduction: [
      'A language model is a conditional distribution over the next token. That sentence is the whole mechanism. Given the tokens so far, it assigns a probability to every token that could come next, a sample is drawn, and the sample is appended. Fluency, tool use, and apparent reasoning are consequences of that loop plus the data it was fit to. They are not a separate faculty sitting behind the sampler.',
      'The transformer is the graph that made this practical at scale. Attention lets each position look at the others, with weights computed from the positions themselves. The rest of the block — residual stream, feed-forward layer, normalization — exists to make that look-up trainable and to give the model a place to store what it computed. Understanding generation means understanding tokens, attention, and the distribution you are sampling from. The product behaviour people argue about sits on top of those three.',
    ],
    entries: [
      {
        title: 'Tokens are not words',
        paragraphs: [
          'The model never sees "words." It sees integers from a fixed vocabulary, produced by a tokenizer that was fit to a corpus to keep frequent strings short. A word can be one token or five. A trailing space can be its own token. Two spellings of the same name can land far apart in the vocabulary, which means the model has no built-in reason to treat them as related.',
          'This shows up as mysterious failures: a model that can spell a word and still mishandle it when the tokenizer splits it oddly, arithmetic that works for small numerals and fails when a number is broken into pieces, prompts that change meaning because of a newline. Looking at the token ids, rather than the string you typed, is the first debugging step and the one most interfaces hide.',
        ],
      },
      {
        title: 'Attention',
        paragraphs: [
          'Attention is a weighted average. Each position builds a query, every position offers a key and a value, and the weights are a softmax over how well the query matches each key. The output is the corresponding mixture of values. Nothing in that sentence retrieves a fact from outside the sequence. Attention moves information that is already in the context from one position to another.',
          'Multiple heads are multiple such averages, with different learned projections. They are not "concepts." A head might copy a name to the position that has to agree with it, or track the token that opened a bracket. The way to learn this is to look at one head and one query at a time. A heatmap of every head at once is a picture of the mechanism drowning in itself.',
        ],
      },
      {
        title: 'The transformer block',
        paragraphs: [
          'A block reads a sequence of vectors, the residual stream, and writes an update back onto it. Attention mixes information across positions. The feed-forward layer then transforms each position on its own, which is where most of the block\'s parameters sit and where a lot of the stored association seems to live. A residual connection adds the update to the stream instead of replacing it, so each block only has to contribute a correction.',
          'Stacking blocks is stacking these corrections. Later blocks see a stream that earlier blocks have already rewritten. That is why "early" and "late" layers are not interchangeable, and why probing one layer and calling it the model\'s belief is a partial view. The prediction is a function of the final stream, not of any single block.',
        ],
      },
      {
        title: 'Retrieval',
        paragraphs: [
          'A model can only use what is in its parameters or in the context you hand it. Retrieval is how you put a specific document into the context at the moment it is needed. You embed the query, find nearby chunks in a store, and place those chunks where the model will attend to them. The model is not "looking up" anything. You looked it up, and then you asked the model to read.',
          'The failures are ordinary and worth naming. The chunking cuts a definition in half. The embedding thinks two passages are close because they share boilerplate. The model attends to the wrong chunk, or to the question instead of the evidence. A retrieval system is a pipeline of those choices, and evaluating it means checking each one, not only the final sentence.',
        ],
      },
    ],
  },
  {
    id: 'agentic-ai',
    title: 'Agentic AI',
    description: 'Systems that act: tools, memory, planning, and how to tell if they worked.',
    introduction: [
      'An agent, in the current sense, is a language model inside a loop that can take actions with consequences. The model proposes a next step. The program around it decides whether that step is allowed, executes it, and returns the result as the next observation. Take away the loop and you have a chatbot. The loop is the product.',
      'The hard part is not the prose the model produces. It is the state. What does the agent know at this step, what is it permitted to change, and how will you notice if it changed the wrong thing? Tools, memory, and plans are three ways of managing that state. Evaluation has to score the state, not the paragraph. A fluent trace of a wrong action is a failure, and most demos are built to hide exactly that. This field keeps the model, the permission boundary, and the test as three different objects, so a failure can be located in one of them rather than blamed on "the agent."',
    ],
    entries: [
      {
        title: 'The agent loop',
        paragraphs: [
          'One cycle is four moves. Observe the current state. Decide on an action. Take it. Read what happened. Then the cycle runs again, with the result included in the next observation. Writing it this way makes the model a component that proposes the decision, not the system. The system is the state and the rules for changing it.',
          'Most of the design is in what gets put into the observation. Too little, and the model repeats an action it already took. Too much, and the relevant fact is buried under a transcript. A good loop is boring to watch: a small state, a single action, a result that is either the next state or an error you can read.',
        ],
      },
      {
        title: 'Tools',
        paragraphs: [
          'A tool is an action with a schema. The schema says the name, the arguments, and the type of the result. The model does not execute the tool. It emits a structured request, and your code executes it or refuses it. The refusal path matters as much as the success path, because a tool that can send email or write a file will eventually be asked to do so at the wrong time.',
          'Treat the schema as the contract, not the prompt. If an argument is optional in the schema and required in practice, the model will omit it. If two tools overlap, the model will pick one for a reason you cannot see. Narrow tools with results that fit back into the observation are easier to test than one tool that "handles the task."',
        ],
      },
      {
        title: 'Memory',
        paragraphs: [
          'The context window is not memory. It is the observation for this step, and it is forgotten when it scrolls out. Memory is state you chose to keep: a record written by a tool, a summary you recomputed, a database row. If you cannot point at where a fact is stored, the agent does not remember it. It is hoping the fact is still in the transcript.',
          'The design choice is what is worth storing and who is allowed to write it. A memory the model can overwrite freely will be overwritten to agree with the latest message. A memory written only by your code, from tool results, stays tied to something that happened. Those are different systems, and only the second one is auditable.',
        ],
      },
      {
        title: 'Evaluating actions',
        paragraphs: [
          'A benchmark that scores the final message will reward an agent that describes the right action and does not take it, and it will forgive an agent that takes three destructive actions on the way to a polite summary. The score has to be a function of the resulting state, checked against a state you set up yourself.',
          'Useful tests are small and hostile. The file should not have been deleted. The tool should have been called once, with these arguments. The agent should have stopped when the tool returned an error, rather than inventing a result. A handful of those checks, run on every change, tells you more than a leaderboard average over tasks you have not read.',
        ],
      },
    ],
  },
  {
    id: 'mathematics',
    title: 'Mathematics for AI',
    description: 'Linear algebra, calculus, probability, and optimization, kept visual.',
    introduction: [
      'The mathematics in this notebook is the mathematics the code is already doing. A layer is a linear map followed by a bend. Training follows a gradient. A probability is the thing a softmax claims to be. None of this requires treating the subject as a separate course to survive before you are allowed to train a model. It does require being able to point at a symbol and say what object it is.',
      'Each area earns its place by unlocking a picture. Linear algebra is the picture of a space being rotated, stretched, and flattened. Calculus is the picture of a small step on a surface. Probability is the picture of updating a belief when evidence arrives. Optimization is the picture of walking downhill under constraints. The notes and figures exist to make those pictures precise enough that the notation in a paper becomes a reference, not an obstacle.',
    ],
    entries: [
      {
        title: 'Linear maps',
        paragraphs: [
          'A matrix takes a vector and returns another vector. That is the entire definition of the linear part of a layer. What the matrix does geometrically depends on its action on the space: some directions are stretched, some are shrunk, some are collapsed to nothing. The directions that survive are the ones the rest of the network can still use.',
          'Eigenvectors are the directions the matrix does not rotate, only scales. Decompositions such as the SVD write a matrix as a rotation, a scaling, and another rotation. This is not a trick for exams. It is why a low-rank approximation can throw away dimensions and keep most of the map, and why two embeddings can be compared by the angles between them.',
        ],
      },
      {
        title: 'Gradients',
        paragraphs: [
          'The derivative of a function of one variable says how the output changes when the input changes a little. The gradient is the same fact for many variables: a vector pointing in the direction of steepest increase, with a length equal to the slope in that direction. Descent walks the opposite way.',
          'The chain rule is why this is computable in a network. If the loss depends on a prediction and the prediction depends on a weight, the dependence of the loss on the weight is the product of the two sensitivities. Backpropagation is that product, organized so each one is computed once. A gradient is not a metaphor for "importance." It is a local slope, valid near the current point, and it can point somewhere useless if the surface bends sharply.',
        ],
      },
      {
        title: 'Probability as an update',
        paragraphs: [
          'A probability is a number you assign to a proposition before you see the outcome, with the rule that the numbers over a complete set of alternatives add to one. Conditional probability is that assignment after you have learned something. Bayes\' rule is the arithmetic for reversing a conditional: from "how likely is this evidence if the hypothesis is true" to "how likely is the hypothesis now that I have seen the evidence."',
          'Models that emit a distribution are making this kind of assignment, whether or not the training justified it. Calibration is the check. Of the times the model said 80 percent, did the event happen about 80 percent of the time? If not, the number is a score wearing the costume of a probability, and decisions that treat it as a probability will be wrong in a systematic direction.',
        ],
      },
      {
        title: 'Optimization',
        paragraphs: [
          'Optimization is the search for an input that makes a function small, often subject to a constraint. Convex problems have the courtesy that a local minimum is the minimum. Neural training does not. The surface has valleys, ridges, and flat regions, and the procedure you use — step size, momentum, adaptive scales — decides which valley you fall into and whether you fall at all.',
          'Constraints are part of the problem, not an afterthought. A weight penalty is a constraint saying large weights are expensive. A normalization layer constrains the scale of activations. Looking at training as constrained optimization explains why two runs with the same loss can learn different functions, and why "lower training loss" is not the same sentence as "better model."',
        ],
      },
    ],
  },
  {
    id: 'python-cs',
    title: 'Python & Computer Science',
    description: 'The engineering underneath a working model: data, cost, and tests.',
    introduction: [
      'A model that only runs in a notebook, on data that fitted in memory once, is not yet a system. The computer-science half of this notebook is about the cost of the operations the mathematics assumes are free, and about the habits that keep a numerical program from lying. Arrays, complexity, and tests are not a separate career path. They are how you find out whether the idea survived implementation.',
      'Python is the language because it is the one the libraries speak. That is also its trap. A loop over rows, written in the obvious way, can be a thousand times slower than the same operation expressed as array arithmetic, and the slow version will still produce the right answer on a toy input. The skill is reading a piece of numerical code and knowing which axis is being scanned, what is being copied, and which number would change if a single input changed.',
    ],
    entries: [
      {
        title: 'Arrays',
        paragraphs: [
          'A NumPy array is a block of memory plus a description of how to index it: shape, stride, dtype. Two arrays can share the memory. A slice often does. A function that "just transposes" may return a view, so a later write changes the caller\'s data. This is the source of a long list of bugs that look like model bugs.',
          'Broadcasting is the rule for combining arrays whose shapes differ. It is powerful and quiet. A shape of (n,) and a shape of (n, 1) do not mean the same thing, and subtracting them does not subtract row by row. Printing shapes at the boundary of every function, with the meaning of each axis written down, is worth more than another abstraction layer.',
        ],
      },
      {
        title: 'Cost',
        paragraphs: [
          'Big-O notation is a claim about how the work grows, not a trophy. Multiplying two n-by-n matrices is not free because a library does it. Attention over a sequence of length n compares every position with every other, so the work grows with n squared, which is why context length is a budget and not a setting to max out.',
          'The useful habit is a back-of-the-envelope count before writing the code. How many examples, how many features, how many bytes per value, does it fit in memory, and which step dominates? A procedure that is elegant and quadratic in the dimension you expect to grow will not be saved by cleaner syntax. Measure the step you think dominates. The surprise is usually a copy you did not know you were making.',
        ],
      },
      {
        title: 'Vectorization',
        paragraphs: [
          'Vectorization means expressing the operation as array arithmetic so the inner loop runs in compiled code, not as a Python for-loop that happens to call NumPy once per row. The result should be the same. When it is not, the bug is almost always a reduction over the wrong axis or a broadcast that aligned two arrays by the trailing dimension instead of the one you meant.',
          'It is also a test of understanding. If you cannot write the batched version, you do not yet know which axis is the batch. Start from the one-example formula, name the new axis, and only then add it. Code that was vectorized by stacking operations until the shape happened to work is code that will break on the next input size.',
        ],
      },
      {
        title: 'Testing numerical code',
        paragraphs: [
          'A numerical function needs tests that would fail if the mathematics were wrong, not only if it threw an exception. Finite differences check a gradient: nudge one input, see how the output moves, and compare with the analytic derivative. A fixed random seed and a tiny hand-computed example catch a reduction over the wrong axis. Property tests catch the rest: a distance is symmetric, a probability vector sums to one, a normalized vector keeps its length.',
          'The tests belong next to the function, on inputs small enough to inspect. A test that only checks "it runs on the real dataset" will pass while the function is off by a transpose. When a training run misbehaves, the gradient check is the first instrument, because it distinguishes a wrong derivative from a merely difficult surface.',
        ],
      },
    ],
  },
  {
    id: 'emerging-tech',
    title: 'Research',
    description: 'How to read a paper, test a claim, and keep the open problems honest.',
    introduction: [
      'Research, on this site, means a particular kind of reading and a particular kind of test. A paper makes a claim and offers evidence. Those are separate objects. The claim can be important and the evidence weak, or the evidence solid and the claim narrower than the abstract suggests. The work of a note is to pull them apart and to say what would have counted against the claim.',
      'Experiments here are small on purpose. A question that needs a cluster before it can be asked is a question you cannot iterate on. The standard is that someone else could rerun the comparison from the note and the code, and that a negative result is published with the same care as a positive one. Emerging directions are stated as questions with a way to make progress, not as predictions about the field. A direction that cannot say what evidence would move it is a slogan, and this is where those slogans get rewritten as questions with a comparison attached.',
    ],
    entries: [
      {
        title: 'Claim and evidence',
        paragraphs: [
          'Read the abstract last. Start from the experiment: what was compared, on what data, against which baseline, and what number moved. Then read the sentence the authors believe that number supports. The gap between the sentence and the number is the paper. Often the number supports a narrower sentence than the one in the title.',
          'Write both down, in that order, before forming an opinion about whether the idea is "promising." A promising idea with an experiment that does not test it is a proposal. A modest idea with a clean comparison is a result. The notebook\'s paper notes exist to keep those categories from collapsing into each other.',
        ],
      },
      {
        title: 'Reproducibility',
        paragraphs: [
          'A result is reproducible when someone else, following the description, gets a compatible answer. That requires the data, the code, the seeds, and the exact comparison — including the failures of the baseline. A paper that reports a new method against a baseline it did not tune is not yet a comparison.',
          'For your own experiments the bar is the same and easier to meet, because you still have the files. Pin the versions. Save the config next to the metrics. Prefer a comparison you can rerun in an afternoon over a result that existed once on a machine you have since rebuilt. A finding you cannot regenerate is an anecdote.',
        ],
      },
      {
        title: 'Benchmarks',
        paragraphs: [
          'A benchmark is a frozen set of tasks plus a rule for scoring them. It is useful because it makes two systems comparable. It is dangerous because systems are then built to move the score, including by routes that ignore the capability the score was meant to stand for. When a dataset leaks into training, the score measures memory.',
          'Read a leaderboard as a list of comparisons under one rule, not as a ranking of understanding. Ask what the rule cannot see. Agent benchmarks that score the final message cannot see the actions taken along the way. Language benchmarks that score a single answer cannot see calibration. A number without the rule that produced it is not evidence.',
        ],
      },
      {
        title: 'Writing an experiment',
        paragraphs: [
          'State the question in a form a result could answer. "Is method A better?" is not a question until you say better at what, against which alternative, on which data, and by how much you would care. Decide the comparison and the sample size before you look at the outcome. Looking first and then choosing the metric is how noise becomes a finding.',
          'Report the setup in enough detail to rerun, the result including the runs that did not help, and the conclusion at the strength the result supports. A note that does this is more useful than a note that is certain. The research log on this site is held to that shape: question, setup, result, and a sentence about what was not shown.',
        ],
      },
    ],
  },
] as const satisfies readonly Topic[];

export type TopicId = (typeof topics)[number]['id'];

/** Non-empty tuple of ids, in the shape `z.enum()` expects. */
export const topicIds = topics.map((topic) => topic.id) as [TopicId, ...TopicId[]];

export function getTopic(id: TopicId) {
  const topic = topics.find((candidate) => candidate.id === id);
  if (!topic) throw new Error(`Unknown topic: ${id}`);
  return topic;
}
