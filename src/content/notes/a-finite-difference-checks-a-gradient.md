---
title: A finite difference checks a gradient
description: Nudge one input, see how the output moves, and compare that ratio with the gradient you computed. A mismatch is a bug in the gradient.
topic: python-cs
maturity: budding
publishedAt: 2026-11-27
tags: [gradients, checks]
objectives:
  - Check one partial derivative with a two-point nudge.
  - Know what a passing check does not certify.
---

The derivative is a limit of a ratio: the change in the function, divided by a small nudge in one input. You can estimate it without any calculus. Evaluate the function at the point plus a small nudge and at the point minus the same nudge, subtract, and divide by twice the nudge. Compare that number with the partial derivative your backpropagation produced. If they disagree beyond a tolerance, the analytic gradient is wrong, or you nudged a different input than the one you differentiated.

This is a check, not a way to train. It costs two forward passes per parameter, so you run it on a tiny model, or on one parameter of a large one. [The chain rule multiplies slopes](/knowledge/the-chain-rule-multiplies-slopes) is what the analytic path is supposed to compute. The finite difference does not care about your graph. That is why it can referee the graph.

## How to avoid a fake pass

Use a nudge that is small but not so small that subtraction of nearly equal floating-point numbers eats the change. Check a point where the function is smooth. A nudge that crosses the corner of a ReLU is a ratio the local slope was not obliged to match. Check the loss you actually train, including the reduction axis. A gradient of the mean will not match a finite difference of the sum.

## What this does not say

A gradient that matches a finite difference is not a model that learns. It is a gradient that matches the function you evaluated. If the function is the wrong loss, both sides will agree and both will be the wrong slope. The check is about the implementation of the derivative. The loss itself needs its own test, on a single row you can compute by hand.
