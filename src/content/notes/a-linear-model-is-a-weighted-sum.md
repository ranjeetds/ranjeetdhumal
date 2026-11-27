---
title: A linear model is a weighted sum
description: A linear model predicts with a weight per feature, added up. The boundary it can draw is flat.
topic: machine-learning
maturity: budding
publishedAt: 2026-11-27
tags: [linear-models]
objectives:
  - Write a linear prediction as a weighted sum plus a bias.
  - Say what shape of boundary that family cannot make.
---

A linear model takes each feature, multiplies it by a weight, and adds the products, plus a bias. The prediction is that sum, or a fixed function of that sum if you need a probability or a class. There is one weight per feature. The weight is the change in the sum when that feature moves by one and the others stay put.

That is the whole family. It is small, which is why it is the right first model and often the right last one. You can read a weight. You can say which feature the fit used. You can notice a weight that only makes sense if a column was scaled in a way you did not intend. A larger model can hide the same mistake inside a shape you cannot read.

## What the sum cannot bend around

Because the sum is linear, a level set of it is flat. In a plane, the boundary between two classes is a line. [Decision boundaries](/studio/decision-boundaries) draws that line against a cloud of points. If the classes wrap around each other, no setting of the weights will separate them. The failure is the family, not the optimiser. Adding a bend between weighted sums is how a network leaves this family, which is the point of [how neural networks learn](/knowledge/how-neural-networks-learn).

[Linear models](/guides/linear-models) is the checklist for when the sum is enough.

## What this does not say

A linear model is not a claim that the world is linear. It is a claim that, on these features, a weighted sum is a good enough guess. Change the features — a product, a bin, a distance — and the same sum can express a boundary that looks curved in the original coordinates. The linearity is in the weights, not in the story you tell about the raw columns.
