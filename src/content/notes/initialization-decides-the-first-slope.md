---
title: Initialization decides the first slope
description: The first weights set the scale of the first forward pass and the first gradient. A bad scale wastes the steps that follow.
topic: deep-learning
maturity: budding
publishedAt: 2026-11-27
tags: [initialization, training]
objectives:
  - Treat the initial weights as a scale, not as a detail.
  - Say what goes wrong when that scale is far too large or far too small.
---

Before any step, the weights are a guess. The usual guess is small random numbers, with a scale chosen so that a weighted sum of many inputs does not explode and does not vanish. That scale is the initialization. It decides the size of the activations on the first pass and, through them, the size of the first gradient.

If the weights are far too large, a bend that saturates is already flat, and the first slope is nearly zero. If they are far too small, the network is a tiny perturbation of zero and the signal the loss can see is tiny too. In both cases the optimiser is not "slow to learn." It was handed a point where the local slope has little to say. [Training dynamics](/knowledge/training-dynamics) starts from that point. The surface it walks is shaped by where you stood at step zero.

## What the random part is for

The random part breaks symmetry. If every unit in a layer starts equal, and they see the same input, they receive the same gradient and they stay equal. Distinct initial values let them move apart. The values still have to share a scale. Randomness without a scale is just a different way to start in the wrong region.

[What keeps training stable](/guides/what-keeps-training-stable) lists initialization next to the bends and the normalizations that assume a sane incoming scale.

## What this does not say

A careful initialization does not choose the function you will end at. It chooses the neighbourhood of the first steps. Two runs from different seeds, at a good scale, can still finish in different places when the surface has more than one basin. The seed is part of the result. Report it when a comparison depends on it.
