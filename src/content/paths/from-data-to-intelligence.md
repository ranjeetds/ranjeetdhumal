---
title: From Data to Intelligence
description: The story of a modern system, told in the order the mechanisms depend on each other. One path, from a table of examples to an agent that is allowed to act.
tags: [path]
draft: false
level: foundational
primary: true
topics: [machine-learning, deep-learning, generative-ai, agentic-ai]
notes:
  - a-sample-and-its-mean
  - how-neural-networks-learn
  - training-dynamics
  - embeddings-and-representation
  - attention-and-transformers
  - large-language-models
  - evaluation-and-alignment
  - agentic-systems
overview: >
  A modern AI system is a short list of mechanisms wearing a product, and the product
  is trained on a sample. The path begins with that sample: its mean, its spread, and
  the shape the mean does not show. Then something is
  predicted from something observed. A function with adjustable parts makes the
  prediction. A search moves those parts to make a loss smaller. The function learns
  to represent its inputs as vectors. Attention moves information between positions
  in that representation. A language model is that machinery pointed at the next
  token. Evaluation asks whether the number you are looking at is the thing you
  care about. An agent is the same model placed in a loop that can change a state.
  This path walks that list in order. The other paths on this page are branches:
  take one when a chapter is moving too fast, then come back.
outcome: Follow a modern system from the sample it is trained on to the action it is allowed to take, and say which mechanism is doing the work at each step.
order: 0
modules:
  - title: A sample and its mean
    outcome: >
      You can tell a sample from the population it was drawn from, and you can
      say what the mean reports and what it leaves out.
    concepts:
      - A sample is not the population
      - The mean
      - Shape and a tail
    why: >
      Every later number in this notebook is computed on a sample. A loss is an
      average over the rows you have. If those rows are a small or lopsided
      draw, the average is a fact about the draw. Treating it as a fact about
      the world is the first way a result lies.
    next: >
      The next chapter takes the sample as given and asks what you are trying
      to predict from it. That question has three parts: the inputs, the family
      of functions, and the loss.
    article: /knowledge/a-sample-and-its-mean
    figure: sample-mean
    experiment: >
      Draw a sample of 8 and note the mean. Stay on the same draw and raise the
      sample to 120. The first eight points are still in the picture. Watch
      which way the mean moves.
  - title: A learning problem
    outcome: >
      You can state a task as inputs, a family of functions, and a loss, and you
      can say which of those three you chose.
    concepts:
      - Inputs and targets
      - A family of functions
      - A loss
    why: >
      Everything later is a richer version of this statement. A network is a family.
      Training is a search for a member of that family with a small loss. If the
      loss does not measure the mistake you care about, a successful search still
      solves the wrong problem.
    next: >
      The next chapter takes the simplest interesting family, a stack of weighted
      sums with a bend, and shows what that family can represent.
    article: /knowledge/how-neural-networks-learn
    experiment: >
      Write one task you know as the three choices. Change only the loss, and
      notice that the task changed even though the spreadsheet did not.
  - title: How a network computes
    outcome: >
      You can describe a layer as a weighted sum, a bias, and a nonlinearity, and
      you can say what a network without the bend cannot separate.
    concepts:
      - Affine maps
      - A nonlinearity
      - Composition
    why: >
      Depth is composition, not a metaphor for thought. A linear stack collapses
      into one linear map. The bend is what lets a later layer see combinations
      the earlier layer made. Once that is ordinary, an architecture is a choice
      of which compositions to allow.
    next: >
      A network that can represent a function still has to be found. The next
      chapter is the search.
    article: /knowledge/how-neural-networks-learn
    figure: gradient-descent
    reading: /videos#but-what-is-a-neural-network
  - title: How training moves
    outcome: >
      You can explain a gradient as a local slope, and you can say why two correct
      runs on the same surface can settle in different places.
    concepts:
      - The chain rule
      - Step size and momentum
      - Local minima
    why: >
      Training is not a guarantee of the best function in the family. It is a walk
      downhill from where you started, with a step size, on a surface that can have
      more than one valley. Reading a lower loss as "the model understood" skips
      the only fact the walk establishes.
    next: >
      The walk changes the function. What it changes, in the values flowing through
      the network, is a representation. That is the next chapter.
    article: /knowledge/training-dynamics
    figure: gradient-descent
    experiment: >
      On the loss-surface figure, start a descent in the upper left and again in
      the lower right. Same step, same momentum, different valley.
    reading: /videos#building-micrograd
  - title: Representations
    outcome: >
      You can explain an embedding as a vector whose direction is the thing later
      layers can use, and you can say what a picture of those vectors is not.
    concepts:
      - Vectors as coordinates
      - Similarity as angle
      - A projection is a choice
    why: >
      A network does not store words or pixels. It stores directions. Attention,
      in the next chapter, is a way of mixing those directions. If similarity is
      only something you saw in a flat plot, you will trust clusters that were
      made by the plot.
    next: >
      Directions that never meet cannot share what they know. Attention is the
      operation that lets one position read another.
    article: /knowledge/embeddings-and-representation
  - title: Attention
    outcome: >
      You can describe one head as a weighted average of values, and you can say
      what a causal mask removes.
    concepts:
      - Queries, keys, and values
      - A row that sums to one
      - Masking
    why: >
      Attention is how information moves between positions. It is not a memory of
      the outside world and it is not a linguistic theory. A head that looks at
      the subject of a verb, and a head that looks at its neighbours, are different
      patterns of the same operation. The mask decides which direction is allowed.
    next: >
      Stack that operation with a position-wise transformation and a residual path,
      and point the result at the next token. That stack is a language model.
    article: /knowledge/attention-and-transformers
    figure: attention-patterns
    experiment: >
      In the attention figure, select the verb and switch heads. Then turn the
      mask on and check that the row still sums to one.
    reading: /videos#attention-in-transformers
  - title: A language model
    outcome: >
      You can say that the model’s output is a distribution over tokens, and that
      a product’s sentence is one sample from it.
    concepts:
      - Next-token prediction
      - Temperature
      - Context as the input
    why: >
      The surprising behaviour of a language model is mostly this distribution
      plus a sampling rule, repeated. Temperature does not make the model smarter.
      It changes how peaked the draw is. A retrieved document changes the
      distribution only by changing the context the model is shown.
    next: >
      A fluent sample can be wrong, and a confident one can be miscalibrated.
      The next chapter is how to tell.
    article: /knowledge/large-language-models
    figure: next-token
    experiment: >
      On the next-token figure, lower the temperature until one word dominates,
      then raise it until the dull words return. The vocabulary did not change.
    reading: /videos#intro-to-large-language-models
  - title: Evaluation and alignment
    outcome: >
      You can separate a claim about behaviour from the evidence offered for it,
      and you can name a score that would look good while the behaviour you care
      about got worse.
    concepts:
      - A metric is a choice
      - Calibration
      - A training signal is not a goal
    why: >
      The earlier chapters produce a system that optimises whatever signal it is
      given. Alignment, in the narrow sense used here, is the problem of that
      signal not being the thing you wanted. A leaderboard that grades the wrong
      object will prefer the wrong system, confidently.
    next: >
      When the system is allowed to act, the object that has to be scored is the
      state it changed. That is the last chapter.
    article: /knowledge/evaluation-and-alignment
  - title: An agent
    outcome: >
      You can draw one cycle as observation, proposed action, action taken, and
      result, and you can point at which of those the model is.
    concepts:
      - The loop
      - Tools as a boundary
      - State, not the transcript
    why: >
      An agent is not a model with a longer prompt. The model proposes. The
      program decides what may happen, does it, and puts the result where the
      next proposal can see it. A sentence that describes the right action, while
      the action was not taken, is a failed cycle.
    next: >
      The path ends here. A larger system is this loop with more state. The
      agentic path takes the same loop apart more slowly.
    article: /knowledge/agentic-systems
    figure: agent-loop
    reading: /videos#lets-build-gpt
---
