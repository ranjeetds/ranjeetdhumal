---
title: An ensemble averages several cuts
description: An ensemble makes several imperfect predictions and combines them. The gain is real when the mistakes are not the same mistake.
topic: machine-learning
maturity: budding
publishedAt: 2026-11-27
tags: [ensembles]
objectives:
  - Say what an average of models can cancel.
  - Say what it cannot cancel.
---

An ensemble fits more than one model and combines the predictions, by a vote or by an average. A forest grows many trees on different draws of the rows and the features. Boosting fits the next model to the mistakes of the ones it already has. Bagging and boosting are different ways of spending the same idea: one partition of the sample is jumpy, and a combination of partitions moves less.

The combination helps when the members are wrong in different places. If every tree misses the same rows, the vote misses them too. The average does not invent a pattern that none of the members could represent. It damps the part of the prediction that depended on which rows happened to be drawn.

## What you give up

You give up the single readable tree. A forest's prediction is a count across trees, and the reason for one row is no longer one path. That can be the right trade when the decision is a score and the cost of a jumpy tree is high. It is the wrong trade when someone has to audit the question that fired. In that case a shallow tree, or a weighted sum, remains the model, and the ensemble is a check rather than the product.

The variance side of [bias and variance](/guides/bias-and-variance) is what the average is trying to shrink. The bias side is untouched if every member shares it.

## What this does not say

An ensemble is not a cure for leakage, a shifted process, or a target that was built from the features. Averaging fifty fits of a leaked column produces a confident use of the leak. The procedure is more stable. It is stable about whatever the members were shown.
