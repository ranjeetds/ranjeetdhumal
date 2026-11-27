---
title: Batch noise is part of the gradient
description: A gradient on a batch is a gradient on a sample of rows. A different batch is a different slope.
topic: deep-learning
maturity: budding
publishedAt: 2026-11-27
tags: [batches, stochastic-gradient]
objectives:
  - Treat a minibatch gradient as a noisy estimate.
  - Say what a smaller batch changes about the step.
---

The loss you care about is usually a mean over a large set. The gradient of that mean is the mean of the per-row gradients. A minibatch replaces the large mean with the mean of a handful of rows. The step follows that smaller mean. Draw a different handful and the slope points somewhere else. The noise is not a bug in the implementation. It is the difference between a sample and the set.

A smaller batch is a noisier slope and a cheaper step. A batch of one follows the loss of a single row, which can point away from the mean loss even when the computation is exact. A batch of the whole set follows the mean and costs a pass over every row before one update. Most training sits between those, and the learning rate has to match the noise. A rate that was stable on a large batch can kick a small batch out of the basin.

## What the noise is not

The noise is not a substitute for a held-out set, and it is not regularization by itself. It changes which steps you take. It does not change the loss. If every batch contains the same leaked feature, every noisy slope still points along the leak. [A sample and its mean](/knowledge/a-sample-and-its-mean) is the identical distinction, one level down: the mean of the rows in hand is not the mean of the process.

[Training dynamics](/knowledge/training-dynamics) watches a walk that, on its designed surface, has no batch noise. Real training adds this second wobble on top of the shape of the surface.

## What this does not say

Averaging more rows into the batch does not make the gradient "the truth." It makes it the gradient of a larger sample. The sample can still be the wrong population. Fix the rows you are willing to learn from before you spend money making the slope quieter.
