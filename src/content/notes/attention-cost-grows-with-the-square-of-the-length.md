---
title: Attention cost grows with the square of the length
description: One attention head compares every position with every position. Double the sequence and the comparisons quadruple.
topic: python-cs
maturity: budding
publishedAt: 2026-11-27
tags: [attention, cost]
objectives:
  - Count the comparisons in one attention head.
  - Say what a longer context spends, before any claim about quality.
---

In the usual attention head, each position produces a query and a key. Scoring every query against every key is a comparison per pair. A sequence of length n has about n times n pairs, and each comparison is a dot product of the head's width. The values are then mixed with those weights, another pass of the same shape. Double the sequence and the pair-comparisons quadruple. The linear layers around the block do not. They grow with n, not with n times n. Past a moderate length, the quadratic term is the one you feel.

[Attention and transformers](/knowledge/attention-and-transformers) describes the weighted average. This note is only the bill for computing it. The average is well-defined at any length that fits. Fitting is the constraint. The scores alone are an n by n table per head, per layer, and the backward pass wants them or must recompute them.

## What people change

A window that attends only to nearby positions, or to a fixed set of landmarks, reduces the pairs. It also changes the function: a position outside the window is invisible, which is a modelling choice, not a free speedup. [Position has to be written down](/knowledge/position-has-to-be-written-down) still applies inside whatever window you kept. Dropping pairs drops information. Measure the task if you claim the cheaper function is good enough.

## What this does not say

The quadratic cost does not mean a long context is a long memory. The model can be given a long sequence and still depend on only a short slice of it. You pay for the pairs either way. Whether the extra tokens changed the continuation is a separate measurement, closer to [how to tell retrieval worked](/guides/how-to-tell-retrieval-worked) than to this count.
