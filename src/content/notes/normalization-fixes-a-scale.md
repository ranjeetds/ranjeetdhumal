---
title: Normalization fixes a scale
description: Normalization rewrites a batch or a feature so its scale stays in a range the next operation can use.
topic: deep-learning
maturity: budding
publishedAt: 2026-11-27
tags: [normalization, scale]
objectives:
  - Describe normalization as a change of scale.
  - Separate a normalized activation from a normalized input column.
---

A weighted sum is sensitive to scale. Multiply a feature by ten and, unless the weight shrinks by ten, the sum moves by ten. Normalization is a rewrite that puts the scale back. Subtract a mean, divide by a spread, sometimes then multiply by a learned scale and add a learned shift. The next operation sees numbers in a range you chose, instead of whatever range the previous layer happened to emit.

There are two places people do this, and they answer different problems. Normalizing an input column, before any training, stops one feature from dominating a distance or a sum because of its units. Normalizing an activation inside the network stops a layer's output from drifting, across steps, into a range where the next bend is flat. [Normalization](/studio/normalization) draws the first of these: a cloud of points, recentered and rescaled. The internal version is the same arithmetic applied to a batch of activations rather than to the raw columns.

## What the rewrite uses

The mean and the spread are statistics of some set: the training column, the current batch, or a running estimate. A statistic computed on the whole table, including rows you will call the test set, is a leak. A statistic computed on a batch of one is noise. [Leakage and the split](/guides/leakage-and-the-split) covers the first mistake. The second is why batch normalization depends on the batch being large enough to have a spread worth dividing by.

## What this does not say

A normalized input is not a better target, and a normalized activation is not a trained network. The rewrite removes a unit. It does not remove a spurious feature, a bad label, or a bend that was the wrong bend. After normalizing, look at which feature still moves the prediction. The scale is no longer an excuse.
