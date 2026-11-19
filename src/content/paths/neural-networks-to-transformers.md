---
title: From Neural Networks to Transformers
description: A network as a computation graph, then the specific graph that replaced recurrence. Each module is there because the next one uses it.
tags: [deep-learning, transformers]
draft: false
level: intermediate
topics: [deep-learning, generative-ai, mathematics]
overview: >
  This path treats architectures as graphs you could draw, not as brand names.
  It starts from a single unit and does not reach attention until the chain rule,
  convolution, and the idea of a reusable operation are already in hand. The
  transformer block then appears as one particular graph: a residual stream,
  a mixing across positions, and a position-wise transformation. The last module
  is about why that graph trains at all. Skip it and the earlier diagrams are
  pictures of a model you cannot fit.
outcome: Read a modern architecture as a sequence of operations, and trace a gradient from the loss back to a single weight.
order: 2
modules:
  - title: A unit, a layer, a graph
    outcome: >
      You can draw a small network as operations on tensors, name every axis, and
      compute the forward pass by hand for a two-layer example.
    concepts:
      - Affine maps
      - Elementwise nonlinearities
      - Named tensor axes
    why: >
      A layer is not a metaphor for a neuron. It is a matrix, a bias, and a bend.
      Once that is ordinary, depth is just composition, and a bug is a shape or a
      missing bend rather than a mysterious failure to learn. Naming axes is what
      keeps the composition from being a pile of numbers.
    next: >
      The forward pass produces a loss. The next module carries that loss back to
      the weights.
  - title: Backpropagation on a network you can draw
    outcome: >
      You can compute one weight's gradient with the chain rule on a tiny graph,
      and check it against a finite difference.
    concepts:
      - Local derivatives
      - The chain rule along an edge
      - Finite-difference checks
    why: >
      Automatic differentiation hides the arithmetic and leaves the responsibility.
      If you have never pushed one scalar loss back to one weight yourself, you
      cannot tell a wrong gradient from a difficult loss. The check against a
      nudged input is the instrument you will reuse whenever a new layer is added.
    next: >
      With the chain rule in hand, convolution is the first architecture that
      encodes a belief about the data instead of connecting everything to everything.
  - title: Convolution
    outcome: >
      You can explain weight sharing, say what a filter detects, and name a task
      for which throwing away position would be the wrong bet.
    concepts:
      - A filter applied everywhere
      - Weight sharing
      - Translation structure
    why: >
      Convolution is the cleanest example of an architectural assumption. The
      pattern means the same thing at every position, so the weights are reused.
      That assumption is a gift on images and spectrograms and a mistake when
      location is the content. Seeing the assumption is the preparation for
      attention, which makes a different bet about what should be shared.
    next: >
      Convolution looks at a neighbourhood. The next module looks at a whole
      sequence, and replaces the fixed neighbourhood with a computed one.
  - title: Attention and one block
    outcome: >
      You can describe a single head as a weighted average of values, and place
      attention and the feed-forward layer on the residual stream of one block.
    concepts:
      - Queries, keys, and values
      - A softmax over positions
      - The residual stream
    why: >
      Attention is how a position reads the rest of the sequence. It does not
      fetch outside knowledge. The block around it matters just as much. The
      feed-forward layer transforms each position alone, and the residual path
      means the block writes a correction rather than a replacement. A transformer
      is a stack of those corrections.
    next: >
      The graph is now complete enough to fail in a specific way. Deep stacks
      lose their gradients unless the scale is looked after.
  - title: Keeping a deep stack trainable
    outcome: >
      You can recognise a vanishing or exploding gradient from the scale of
      activations, and say what residual connections and normalization change.
    concepts:
      - Products of derivatives
      - Initialization scale
      - Residual paths
    why: >
      A correct graph that cannot be trained is not yet a model. Depth multiplies
      derivatives, and the product drifts away from a usable scale. The fixes are
      part of the architecture. Treating them as optional tuning is how people
      end up swapping optimizers while the gradient is zero.
    next: >
      The path ends at a block you can read. The language-model path uses that
      block as a component and asks what happens when you sample from it.
---
