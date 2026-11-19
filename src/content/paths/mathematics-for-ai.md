---
title: Mathematics for AI
description: The mathematics that papers and code assume, in the order a model actually uses it. Every object is given a picture before a proof.
tags: [mathematics]
draft: false
level: foundational
topics: [mathematics, machine-learning]
overview: >
  The order follows the objects a training run actually touches. A dataset is a
  sample, so the mean and the shape it hides come first. A layer is a linear map,
  so linear algebra comes next. Training
  follows a slope, so derivatives come after the maps, and they use them.
  A model that emits probabilities is making a claim the probability module
  gives you the language to check. Optimization comes last because it
  is what you are doing with all of the above, under constraints you may not
  have noticed you set. Each module is a picture precise enough that a symbol
  in a paper refers to an object you have already seen.
outcome: Follow the notation in a paper or a codebase, and connect each symbol to a picture rather than treat it as decoration.
order: 4
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
      Every number a training run prints is computed on the rows in front of it.
      Those rows are a sample. A mean of a small or lopsided sample is a fact
      about that sample. The shape, including a tail that pulls the mean away
      from the pile, is not in the average.
    next: >
      The values in that sample are vectors once a model takes more than one
      number per example. The next module is the map a layer applies to them.
    article: /knowledge/a-sample-and-its-mean
    figure: sample-mean
    experiment: >
      Draw eight points and read the mean. Stay on that draw, raise the sample
      to 120, and watch the mean move toward the population.
  - title: Vectors and linear maps
    outcome: >
      You can describe a matrix as a transformation of space, and you can say
      which directions it preserves, stretches, or collapses.
    concepts:
      - Vectors as points and as arrows
      - Matrices as maps
      - Eigenvectors and rank
    why: >
      Every linear layer is this object. If a matrix is only a grid of numbers,
      the next layer's shape is bookkeeping. If it is a map, you can ask which
      information survived it. Low-rank structure, embeddings compared by angle,
      and a collapsed dimension are the same picture at different sizes.
    next: >
      The map is the forward pass. Changing a weight to reduce a loss requires
      a slope. That is the next module.
  - title: Derivatives and the chain rule
    outcome: >
      You can compute a gradient for a small composed function and explain why
      it is a local fact, not a global ranking of importance.
    concepts:
      - Slope in one variable
      - The gradient vector
      - The chain rule
    why: >
      Backpropagation is this module applied to a graph. People who treat the
      gradient as "which feature matters" will misread a saliency map and a
      training run alike. The gradient is the steepest local increase of one
      function at one point. It can point into a wall. Knowing that keeps the
      optimizer from becoming a superstition.
    next: >
      Many of those functions are probabilities. The next module says what has
      to be true of a number before it deserves the name.
  - title: Probability as a commitment
    outcome: >
      You can update a belief with Bayes' rule on a small example, and you can
      state what calibration would demand of a model's reported confidence.
    concepts:
      - Probability as weight on alternatives
      - Conditional probability
      - Calibration
    why: >
      A softmax emits numbers that add to one. That is necessary and not
      sufficient for them to be probabilities you should act on. Calibration is
      the missing test. Of the cases scored at 80 percent, the event should
      occur about 80 percent of the time. Decisions that skip the test inherit
      whatever bias the score has.
    next: >
      Training is the search for parameters that make a loss small. The last
      module is that search, including the constraints hiding inside it.
  - title: Walking downhill, with constraints
    outcome: >
      You can contrast a convex problem with a non-convex one, and you can name
      two constraints that a training setup imposes besides the loss.
    concepts:
      - Local and global minima
      - Step size and momentum
      - Penalties and normalization as constraints
    why: >
      The loss is not the whole problem. A weight penalty, a finite step, and a
      normalization layer all restrict the functions you can reach. Two runs
      with the same loss can learn different functions because they walked
      different constrained paths. "Lower training loss" is then not evidence
      of a better model until the constraints are part of the comparison.
    next: >
      The path ends when the symbols in a methods section refer to pictures.
      The machine-learning path uses those pictures on data.
---
