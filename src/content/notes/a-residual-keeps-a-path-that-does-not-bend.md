---
title: A residual keeps a path that does not bend
description: A residual connection adds the block's input to the block's output, so the input can pass through even when the block is small.
topic: deep-learning
maturity: budding
publishedAt: 2026-11-27
tags: [residual, architecture]
objectives:
  - Write a residual step as input plus a change.
  - Say what the skip path preserves for the gradient.
---

A residual block computes a change and adds it to its input. The output is the input plus whatever the block produced. If the block produces nothing, the output is the input, and the stack has not erased the representation it was handed. That is a different graph from a stack that must rebuild the whole representation at every layer.

The addition is also a path for the slope. The derivative of "input plus change" with respect to the input includes a one, from the skip, plus the slope through the block. A one in that sum keeps a path that a flat bend cannot zero out. Deep stacks without that path have to carry the slope through every bend. One flat bend blocks them. [What keeps training stable](/guides/what-keeps-training-stable) puts this next to the other choices — initialization, normalization — that keep early steps from being noise.

## What the block is then for

The block is for the change, not for the whole function. That is a useful bias when the right function is close to the identity and the interesting part is a small edit: a transformer block that mixes a token and adds the mix back, a layer that adjusts a feature rather than replacing it. [The transformer block](/studio/transformer-block) is that add, on two designed tokens.

## What this does not say

A skip connection does not make a deep network correct, and it does not make depth free. The block can still add a change that ruins the representation. The skip makes "do nothing" an available setting. Whether training finds a useful change is a fact about the loss and the data, not a fact about the plus sign.
