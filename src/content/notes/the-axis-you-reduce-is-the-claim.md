---
title: The axis you reduce is the claim
description: A mean or a sum along an axis says that axis is the one you are willing to collapse. The wrong axis is a different claim.
topic: python-cs
maturity: budding
publishedAt: 2026-11-27
tags: [reductions, arrays]
objectives:
  - Name the axis a reduction removes.
  - Match the remaining shape to the claim you meant.
---

A reduction replaces one axis with a summary. The mean of a batch of losses along the batch axis is one number per remaining axis, and it claims "average over examples." The mean along the feature axis claims "average over features," which is rarely the loss you meant. Both calls look like `mean`. The axis is the claim.

Libraries disagree about the default. Some reduce every axis and return a scalar. Some reduce the last axis. Code that omits the axis is code that accepted a default. When the rank of the tensor changes — a sequence axis appears, a channel axis moves — the default silently becomes a different claim. Pass the axis. Then check that the shape that remains is the shape of the quantity you wanted to log or to differentiate.

## What the summary throws away

[A sample and its mean](/knowledge/a-sample-and-its-mean) is the statistical version: the mean drops the shape of the values. The programming version adds a way to drop the wrong values entirely, by collapsing the wrong axis, and still produce a number you might plot. A loss curve that looks calm can be a mean over the feature axis of one example.

## What this does not say

Naming the axis does not make the reduction the right statistic. A sum and a mean differ by the length of the axis. A softmax along the vocabulary axis and a softmax along the sequence axis are different distributions. The axis picks the set. The reduction picks the summary. State both.
