---
title: Depth is composition
description: Depth is the number of operations a value passes through. It matters when each operation can build on the previous one.
topic: deep-learning
maturity: budding
publishedAt: 2026-11-27
tags: [depth, composition]
objectives:
  - Define depth as a count of composed operations.
  - Say when a deeper stack is the same function as a shallow one.
---

Depth is a count. A value that passes through one weighted sum and one bend has gone through two operations. A value that passes through twenty has gone through twenty. The count matters when the later operation sees something the earlier one created. A bend between the sums is what makes that possible. Without the bend, the composition of linear maps is one linear map, and the count was a way of writing a single matrix.

[How neural networks learn](/knowledge/how-neural-networks-learn) is this argument in full. The short form is enough to stop a common slide: adding layers is not adding "more intelligence." It is adding operations to a graph. If the new operations are linear, you added a longer name for the same family of functions. If they include a bend, you enlarged the family, and you also lengthened the product that backpropagation has to carry.

## What the extra operations cost

A longer product is a longer list of ways for the slope to vanish or to blow up. A residual path, a careful initial scale, and a normalization are ways to keep the extra operations trainable. They do not by themselves justify the extra operations. The justification is a pattern that a shallow family cannot express at a size you can afford: a hierarchy of local patterns, a function that needs several bends.

[A layer](/guides/a-layer) is one operation in that count. Stack them only when you can say what the next one is allowed to see that the previous one could not build.

## What this does not say

A deep network that fits the training rows has not thereby used its depth. It may be using one effective layer and leaving the rest near the identity, which a residual block explicitly allows. Depth in the diagram is an upper bound on the composition. The function you actually got can be simpler than the graph you wrote down.
