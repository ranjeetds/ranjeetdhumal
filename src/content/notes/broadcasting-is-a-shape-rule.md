---
title: Broadcasting is a shape rule
description: Broadcasting stretches a missing axis so two arrays can share an operation. The stretch is a rule about shapes, not a guess about meaning.
topic: python-cs
maturity: budding
publishedAt: 2026-11-27
tags: [broadcasting, arrays]
objectives:
  - Apply the shape rule before trusting an elementwise result.
  - Catch a stretch that aligned the wrong axes.
---

Broadcasting lets you add a vector to a matrix, or scale a batch by a per-channel weight, without writing a loop. The rule is mechanical. Starting from the last axis, the lengths must match, or one of them must be 1, or one array must lack the axis. An axis of length 1 is repeated. A missing axis is treated as length 1. The operation then runs as if both arrays had the stretched shape.

The rule does not know which axis is the batch and which is the feature. A weight vector of the right length, lined up on the wrong side, will stretch across the batch or across the sequence and produce a result of a plausible shape. The numbers will be the wrong pairs. This is the ordinary silent bug in a training step.

## Line the axes up on purpose

Write the shapes in a comment at the operation, including a 1 for any axis you intend to stretch. Permute or reshape so the axis of length 1 sits where the rule will repeat it. [The axis you reduce is the claim](/knowledge/the-axis-you-reduce-is-the-claim) is the sibling habit for means and sums: name the axis, because the default is a convention, not a reading of your problem.

## What this does not say

A successful broadcast is not evidence the operation matches the formula you wrote on paper. It is evidence the shapes were compatible under the rule. Compare one element against a hand calculation when the ranks differ. The rule is too willing to succeed.
