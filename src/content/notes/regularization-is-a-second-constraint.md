---
title: Regularization is a second constraint
description: Regularization adds a penalty, or a stop, so the fit cannot use all of its capacity on the rows it sees.
topic: machine-learning
maturity: budding
publishedAt: 2026-11-27
tags: [regularization, capacity]
objectives:
  - Describe a penalty as a second term in the objective.
  - Distinguish a penalty from early stopping.
---

A flexible model can drive the training loss close to zero by fitting accidents in the rows. Regularization is a second constraint that makes some of those fits expensive. A penalty on the size of the weights prefers a smaller weighted sum. A limit on tree depth prefers a coarser partition. Stopping the descent before the training loss has finished falling prefers the fit you had earlier, when the steps were still moving the part of the function the next batch might share.

These are different constraints. A weight penalty is part of the objective, so every step sees it. Early stopping is a decision about when to halt, and it depends on a set you did not train on. Dropout, in a network, is a constraint on which units may adapt together. Calling all of them "regularization" is fine only if you can still say which constraint you added.

## What the constraint prefers

The constraint prefers the smaller, coarser, or earlier fit among those that fit the rows about as well. It does not know which pattern is real. If the signal itself needs a large weight or a deep cut, the constraint will dull the signal along with the noise. That is the bias you accepted in exchange for a fit that moves less when the rows change. [Bias and variance](/guides/bias-and-variance) is the trade. [Training dynamics](/knowledge/training-dynamics) is what the halt looks like on a surface.

## What this does not say

Adding a penalty does not replace a held-out check. The strength of the penalty is itself a choice, and a choice tuned on the test rows is another way for the split to have seen the answer. Pick it on data the final number will not use.
