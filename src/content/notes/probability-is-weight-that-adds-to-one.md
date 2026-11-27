---
title: Probability is weight that adds to one
description: A probability assigns weight to outcomes so that the weights over a complete set add to one. A score is not yet that assignment.
topic: mathematics
maturity: budding
publishedAt: 2026-11-27
tags: [probability]
objectives:
  - State the two properties a probability needs.
  - Refuse a score that has not been tied to outcomes.
---

A probability is weight on outcomes. The weights are never negative. Over a set of outcomes you have agreed is complete — one of them will happen, and not two — the weights add to one. The mean of a quantity, under that assignment, is the sum of each value times its weight. That is the whole calculus this notebook needs. Everything else is a question about whether a particular number deserves the name.

A frequency in a sample is one way to set the weights: the share of rows in which the event occurred. [A sample and its mean](/knowledge/a-sample-and-its-mean) warns that the share is about the rows. A model's score, passed through a softmax, adds to one by arithmetic. [A softmax adds to one](/knowledge/softmax-adds-to-one) separates that arithmetic from the frequency check.

## What the weights let you do

Once the weights are honest, you can compare actions by the mean outcome they imply, and you can say how much uncertainty a distribution still holds. [Binary entropy](/studio/entropy) is that remainder for a single yes-or-no event. Entropy does not tell you the probability. You bring the probability. It tells you how undecided that probability still is.

## What this does not say

Forcing a number to lie between zero and one does not create a probability. A ranking, a logit, and a similarity are useful scores. They become probabilities when you have said which complete set they cover and checked them against how often the outcomes occur. Until then, call them scores.
