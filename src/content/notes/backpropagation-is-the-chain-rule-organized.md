---
title: Backpropagation is the chain rule, organized
description: Backpropagation computes the slope of the loss with respect to every weight by walking the graph backward.
topic: deep-learning
maturity: budding
publishedAt: 2026-11-27
tags: [backpropagation, gradients]
objectives:
  - State backpropagation as the chain rule on a graph.
  - Separate the gradient from the step that uses it.
---

Backpropagation is a way to compute a gradient. The loss is a function of the weights through the graph. The chain rule says the slope through a sequence of operations is the product of the slopes of each operation. Walking backward from the loss, you multiply those local slopes and arrive at a partial derivative for every weight. That number is how the loss changes if you nudge that weight and hold the others still.

The procedure does not decide the step. A gradient is a direction. Gradient descent, momentum, and Adam are rules for how far to move once you have the direction. [Backpropagation](/studio/backpropagation) shows one step of the chain rule through a single ReLU. [The guide of the same name](/guides/backpropagation) writes the product out. Confusing the product with the optimiser makes it sound as if "backprop" chose the learning rate. It did not.

## Where the product breaks

The chain rule needs a slope at the point where you evaluate. A ReLU is flat on one side and has a corner at zero. Implementations pick a slope at the corner and move on. A flat region contributes a zero, and a zero in the product wipes out the slope for everything upstream of it. That is a property of the bend, visible in the product, not a mystery about the optimiser.

[A derivative is a local slope](/guides/a-derivative-is-a-local-slope) is the same fact with one function and no graph.

## What this does not say

A correct gradient is not a small loss. It is the slope where you stand. If the surface is rough, the slope at this point can point away from the region you wanted. The chain rule was right about the point. The point was a bad place to ask.
