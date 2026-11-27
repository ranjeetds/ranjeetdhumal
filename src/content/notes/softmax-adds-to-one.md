---
title: A softmax adds to one
description: A softmax turns a list of scores into weights that add to one. Adding to one does not make the weights calibrated chances.
topic: generative-ai
maturity: budding
publishedAt: 2026-11-27
tags: [softmax, calibration]
objectives:
  - State what a softmax guarantees.
  - State the check it does not perform.
---

A softmax takes a list of scores, exponentiates them, and divides by the total. The results are positive and add to one. That is the guarantee. It is why a row of attention weights can be read as a weighted average, and why a vector of next-token scores can be read as a distribution to sample from. The function does not look at the world. Any list of scores, including a nonsense list, comes out adding to one.

[Attention and transformers](/knowledge/attention-and-transformers) uses the row that adds to one as the weights on values. [Next-token distribution](/studio/next-token) uses it over a toy vocabulary. The same function, two different sets of alternatives. Sharing the function does not make a weight over positions into a probability that a token is true.

## The check that is still missing

A weight of 0.9 is a chance you may act on only if, among the cases where the model said about 0.9, the event happens about nine times in ten. That is calibration, and it is a comparison against outcomes. [Calibration](/guides/calibration) is the comparison. [Binary entropy](/studio/entropy) is how much uncertainty a single stated chance still leaves, which is a different question from whether the statement was honest.

A larger score gap makes the softmax peakier. It does not consult the outcomes either. Temperature changes the gap before this function runs. Neither one is a calibration.

## What this does not say

Refusing to call the output a probability does not mean you should ignore it. The weights are the right object for sampling and for a weighted average. They are the wrong object to quote as a rate of correctness, until someone has counted.
