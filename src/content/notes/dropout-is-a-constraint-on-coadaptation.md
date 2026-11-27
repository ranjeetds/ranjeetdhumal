---
title: Dropout is a constraint on co-adaptation
description: Dropout hides a random subset of units during a step, so the remaining units cannot rely on a partner that may be absent.
topic: deep-learning
maturity: budding
publishedAt: 2026-11-27
tags: [dropout, regularization]
objectives:
  - Describe dropout as a random mask on units.
  - Say what changes at prediction time.
---

Dropout, during a training step, multiplies a random subset of units by zero and scales the rest so the expected sum stays put. The next layer sees a network with holes. A unit that had learned to depend on one specific partner will be wrong on the steps where that partner is hidden. The pressure is toward features that still work in several subsets. That is a constraint on co-adaptation, which is a form of regularization: a second preference, beside the loss, about which fits are acceptable.

The mask changes every step. The gradient on that step is the gradient of the masked network, not of the full one. Over many steps the weights see many subsets. This is closer to training a family of thinner networks that share weights than to adding noise to the input. The noise is in which units participate.

## What you do when you predict

At prediction time the mask is off. Every unit is present, and the scaling that kept the sum honest during training has to be accounted for, either by scaling at training time or by scaling at the end. Forgetting that correction changes the scale of the layer and can look like a mysterious drop in quality. The weights did not forget. The graph at prediction is not the graph you trained, unless you put the correction in.

[Regularization is a second constraint](/knowledge/regularization-is-a-second-constraint) is the general version. Dropout is one constraint, available only because the model has units you can hide.

## What this does not say

Dropout does not fix a leaked feature, a bad split, or a loss that prices the wrong mistake. A feature that is present in every row is useful in every subset, so the mask will not discourage it. The constraint bites on dependence between units. It does not bite on dependence between the prediction and a column that should not have been there.
