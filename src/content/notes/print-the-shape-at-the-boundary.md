---
title: Print the shape at the boundary
description: At every function boundary, the shape of each array is part of the contract. Print it until the contract is obvious, then assert it.
topic: python-cs
maturity: budding
publishedAt: 2026-11-27
tags: [shapes, debugging]
objectives:
  - Treat shapes as part of a function's contract.
  - Turn a print that saved you into an assertion that stays.
---

Most tensor bugs are shape bugs. A function received (batch, time, width) and read the last axis as time. A reduction dropped the batch. A broadcast stretched a vector across the wrong dimension and returned a shape that looked plausible. The values are then wrong in a way no loss curve will explain cleanly. The shape would have explained it at the door.

Print the shape where an array enters a function and where a result leaves it, with a name. Do it for the batch that misbehaves, not for a diagram of the network. When the printed shape matches the contract, replace the print with an assertion so the next change fails at the boundary instead of ten layers later. [Broadcasting is a shape rule](/knowledge/broadcasting-is-a-shape-rule) and [the axis you reduce is the claim](/knowledge/the-axis-you-reduce-is-the-claim) are the two contracts worth asserting first.

## What else to print once

Print the dtype and whether the array is a view, if a later in-place write is possible. [A view is not a copy](/knowledge/a-view-is-not-a-copy) is why a correct-looking shape can still share memory with a tensor you meant to freeze. One line that says shape, dtype, and "this is a view" is enough. A full dump of the values is how the signal gets lost.

## What this does not say

A shape that matches is not a value that is right. The assertion catches the axis errors. It does not catch a wrong weight, a leaked column, or a label that was shifted by one. Keep a single-row numerical check beside the shape check. They fail differently, and you want both failures loud.
