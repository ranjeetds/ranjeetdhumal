---
title: Backpropagation
description: Backpropagation is the chain rule, applied once per edge from the loss back to the weights. Each node needs only its own slope and the slope arriving from downstream.
field: deep-learning
order: 14
publishedAt: 2026-11-21
useWhen: You are implementing a layer, checking a gradient, or deciding whether a dead unit is a slope problem.
avoidWhen: The quantity you care about is not a differentiable function of the weights, and you are pretending a slope exists.
check: Compare the stored gradient of one weight with a finite-difference nudge of that weight.
figure: backpropagation
---

Forward, the graph turns an input into a prediction and a loss. Backward, it turns the loss into a partial derivative for every weight. The algorithm is local. At each node you ask how the loss would change if this node's output were slightly larger, and how that change passes to each input of the node. No node needs a picture of the whole network. Automatic differentiation is this bookkeeping, done by the program that built the graph.

A dead ReLU, a saturating sigmoid, and a zeroed mask are places where the local slope is zero, so the upstream signal stops. The weight does not move because the graph has said that moving it would not change the loss, at this point, on this batch. That can be true and unfortunate. The fix is a change to the bend, the initialization, or the input, after you have confirmed the slope really is zero and not merely wrong.

## The move

For a new layer, write the local derivative on paper for one coordinate, and check it with a nudge. The [backpropagation](/studio/backpropagation) figure follows one path of that product. A gradient that is wrong in sign will train confidently in the wrong direction. A gradient that is wrong in scale will look like a learning-rate problem and waste a day.

Keep the loss scalar. If you reduce over an axis you did not mean, every upstream slope is a slope of a different objective. The finite-difference check catches this, because the nudge and the stored gradient then disagree.

## What this stops

Blaming the optimizer for a graph that computes the wrong function. First the forward value on a tiny input you can calculate by hand. Then the slope against a nudge. Then the step.
