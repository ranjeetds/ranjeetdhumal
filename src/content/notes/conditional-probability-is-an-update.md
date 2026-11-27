---
title: Conditional probability is an update
description: A conditional probability is the weight you assign after restricting to the cases where something else is true.
topic: mathematics
maturity: budding
publishedAt: 2026-11-27
tags: [probability, conditioning]
objectives:
  - Read a conditional probability as a restriction of the sample.
  - Say what the restriction silently assumes.
---

The probability of A given B is the weight on A among the cases where B holds, not among all cases. In a table of rows it is the share of the B rows that are also A. Conditioning is an update: you throw away the rows where B is false, and you renormalize what remains so the weights add to one again. If B is rare, you have thrown away most of the table, and the share that remains is a small-sample fact wearing the same notation as a large one.

A model that outputs a distribution given a prefix is a conditional distribution. The prefix is B. The next token is A. Change the prefix and you have conditioned on a different B, which is why [context is the only input](/knowledge/context-is-the-only-input) moves the distribution without touching the weights. The notation P(A given B) does not say the model looked up a cause. It says the weights are over the cases compatible with B.

## What people swap

"The probability of the data given the hypothesis" and "the probability of the hypothesis given the data" are different restrictions. One restricts to a world where the hypothesis is true and asks about the data. The other restricts to the data you saw and asks about hypotheses. Swapping them is how a likely observation under a theory gets reported as a likely theory. The arithmetic of Bayes connects them, and it needs the weight of the hypothesis before the data. That weight is an input, not a result.

## What this does not say

Conditioning on B does not make B a cause of A. It makes B the slice you kept. Two events can be dependent because a third event drives both. The conditional probability is silent about that. It is a ratio of weights in a table you defined.
