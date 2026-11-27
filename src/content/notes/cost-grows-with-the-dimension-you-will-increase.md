---
title: Cost grows with the dimension you will increase
description: The cost of a step is set by the dimension you expect to grow. A method that is fine at today's size can be the wrong method at the size you are aiming at.
topic: python-cs
maturity: budding
publishedAt: 2026-11-27
tags: [cost, scaling]
objectives:
  - Name the dimension a cost depends on.
  - Compare two methods by how that cost grows, not by one timing.
---

Every step in a training or inference loop has a cost in arithmetic and in memory. The cost is a function of a few lengths: the batch, the sequence, the width, the number of parameters. A method is cheap or expensive only relative to the length you will actually increase. Timing one run at today's length hides the function.

A dense layer costs arithmetic proportional to the product of its input width and its output width, times the batch. Double the width and you have about four times the products, if both sides grew. A convolution reuses a small filter, so its cost follows the filter and the number of positions, not a full matrix between positions. [Attention cost grows with the square of the length](/knowledge/attention-cost-grows-with-the-square-of-the-length) is the case people feel first, because the sequence is the length they keep extending.

## Memory is a second bill

Arithmetic you can wait for. Memory you can run out of. An activation saved for the backward pass occupies space proportional to the batch and the sequence and the width, for every layer you save. A view does not add a bill. A copy does. [A view is not a copy](/knowledge/a-view-is-not-a-copy) is the distinction. Before adopting a cleaner implementation, ask which length it multiplies.

## What this does not say

A favourable cost is not a reason to use an algorithm whose answer is the wrong answer. The growth rate helps you choose among methods that compute the thing you asked for, or among approximations whose error you have measured. It does not replace that measurement.
