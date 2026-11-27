---
title: A held-out set is still a sample
description: A test set that the fit never saw is still a finite sample. Its score is a measurement with a size, not a property of the model.
topic: emerging-tech
maturity: budding
publishedAt: 2026-11-27
tags: [evaluation, sampling]
objectives:
  - Treat a test score as a measurement on a particular set.
  - Say what a second split could do to a close comparison.
---

Holding out a set protects you from one failure: fitting the rows you then brag about. It does not turn those rows into the population. The score is a mean over a finite sample. A different draw of the same size can move the mean, especially when the set is small or the metric is dominated by a few rows. Two models whose scores differ by less than that movement are not ordered, however firmly a table sorts them.

[A sample and its mean](/knowledge/a-sample-and-its-mean) is the underlying fact. [A split that has seen the answer](/knowledge/a-split-that-has-seen-the-answer) is the failure mode the holdout was meant to stop. Both can be in good shape and the number can still be a noisy mean. Look at the size. Look at the rows the metric depends on. If a handful of items account for the gap between two systems, the gap is a fact about those items.

## What "the same distribution" is hiding

The holdout estimates performance on rows drawn like the holdout. Production rows are another sample, often from another process: different lengths, different languages, different mistakes by the people upstream. A strong holdout score is then a true statement about the holdout. [Generalization is a claim about the next batch](/knowledge/generalization-is-a-claim-about-the-next-batch) asks you to name the batch. "The test set" is not a name for production.

## What this does not say

Noise in a small test set is not a reason to peek at it while you tune. Peeking spends the sample. If you need a quieter measurement, collect more untouched rows, or say that the comparison is too close to call on the rows you have. Do not spend the holdout to make the table look decisive.
