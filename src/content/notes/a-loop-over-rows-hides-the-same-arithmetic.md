---
title: A loop over rows hides the same arithmetic
description: A Python loop over rows and a batched array operation can compute the same numbers. They do not spend the same time, and they do not make the same mistakes.
topic: python-cs
maturity: budding
publishedAt: 2026-11-27
tags: [batches, loops]
objectives:
  - See a row loop and a batched kernel as two spellings of one update.
  - Know which spelling makes the axis obvious.
---

A training step is arithmetic on rows. You can write it as a loop: take one row, compute the loss, add into a gradient. You can write it as an array operation on a batch. When both are correct they produce the same sums, up to the order of floating-point additions. The loop makes the per-row story obvious and spends most of its time in the interpreter. The batched operation spends its time on the arithmetic and makes the axis easy to get wrong.

Prefer the batched spelling for the step you will run, and keep a tiny loop as the check. Compute one row with the loop, compute the same row with the batch of size one, and compare. [A finite difference checks a gradient](/knowledge/a-finite-difference-checks-a-gradient) is the same instinct applied to derivatives. A mismatch is a bug in an axis, a view, or a reduction, and it is cheaper to find on one row than in a training curve.

## What batching changes besides speed

A batch changes statistics that are defined on the batch. Batch normalization, a mean computed for a layer, a dropout mask drawn per batch: these are not the row loop with the interpreter removed. [Batch noise is part of the gradient](/knowledge/batch-noise-is-part-of-the-gradient) is the optimisation side. The programming side is that a "vectorized" rewrite can change the result when it silently reduces a different set.

## What this does not say

A faster spelling is not a simpler model. The model is the function. If the batched code and the loop disagree, you have two functions, and the faster one is not the authority. The loop on one row, compared with a hand calculation, is the authority. The batch should match it.
