---
title: What keeps training stable
description: A deep stack multiplies many slopes. Initialization, normalization, and residual paths keep that product near a usable scale.
field: deep-learning
order: 15
publishedAt: 2026-11-21
useWhen: A loss is NaN, or it sits still from the first step, and the graph is deeper than a few layers.
avoidWhen: A shallow model trains and the failure is on held-out data. That is generalization, and a new initializer will not touch it.
check: Log the scale of activations at a few depths. They should not collapse to zero or run away within the first steps.
figure: normalization
---

If each local slope along a path is a little smaller than one, the product at the early layers vanishes and those layers stop learning. If each is a little larger, the product explodes and the step destroys the weights. Depth makes this ordinary rather than exotic. The devices that made deep networks trainable are, mostly, devices that keep the product near a scale a step can use.

Initialization sets the starting scale of the weights so the first forward pass does not saturate. Normalization rescales activations so a layer sees inputs of a familiar size. A residual path gives the gradient a road that skips the multiplications. They are substitutes only in the loose sense that each protects the product. A particular architecture may need one of them and be hurt by another.

## The move

When the loss is NaN, reduce the step size once to see if the surface is merely steep. If a tiny step also fails, inspect the forward pass: an overflow, a division by a standard deviation of zero, a logarithm of a probability that underflowed to zero. When the loss is finite and flat, inspect the gradient norm at the first layer and the last. A last layer with a gradient and a first layer without one is a vanishing product, and the relevant change is the path, not a fancier optimizer.

The [normalization](/studio/normalization) figure is the rescaling in isolation, so you can see what it does to a cloud of points before you bury it in a block. Pair it with the residual idea from [a layer](/guides/a-layer).

## What this stops

Searching a catalogue of optimizers while the activations are already infinite. Stability is a property of the forward scales and the backward product. The optimizer chooses steps on whatever surface those produced.
