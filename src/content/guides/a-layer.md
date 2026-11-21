---
title: A layer
description: A layer computes new coordinates from the previous ones. Depth is a stack of those computations, and the shape of each tensor is part of the meaning.
field: deep-learning
order: 13
publishedAt: 2026-11-21
useWhen: You are adding a layer and need to say what its axes mean and what function it computes.
avoidWhen: A linear model on explicit features already answers the question, and the stack would only hide the weights.
check: Write the shape of the tensor entering and leaving the layer, with a name for each axis.
figure: neuron
---

A layer is a function with parameters, applied to a tensor. A linear layer multiplies by a matrix and adds a vector. An activation bends each coordinate. A stack of those is a network. The depth matters because a composition can represent functions that no single flat cut can, at the cost of a surface that is no longer convex and a bug that hides inside a shape.

The axes are the model as much as the weights are. One axis is the batch, one is a position, one is a feature. A silent transpose swaps those meanings and the loss may still decrease, fitting a different function from the one you think you wrote. Printing shapes with the names attached is the cheapest test in this subject.

## The move

Draw one example as it crosses one layer. Input coordinates, the weighted sum, the bend, the output coordinates. The [neuron](/studio/neuron) and the [activations](/studio/activations) are that drawing for a single unit. If you cannot say what one output coordinate is a coordinate of, do not stack another layer on top of it.

A residual connection adds the layer's update to its input instead of replacing the input. The layer then only has to produce a correction. That is an architectural claim, not a trick: the function you want is close to the identity, and you would like the gradient to have a path that does not pass through every bend.

## What this stops

Frameworks will broadcast, permute, and squeeze until a shape happens to multiply. The guide is to refuse that. Name the axis, then allow the multiplication. A network you cannot draw for one example is a network you cannot debug when the loss is NaN.
