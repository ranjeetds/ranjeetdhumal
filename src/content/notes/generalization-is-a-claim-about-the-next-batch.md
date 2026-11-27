---
title: Generalization is a claim about the next batch
description: A model generalizes if the fit you made on one batch stays good on the next batch from the same process.
topic: machine-learning
maturity: budding
publishedAt: 2026-11-27
tags: [generalization, bias-variance]
objectives:
  - State generalization as a claim about unseen rows.
  - Separate a small training loss from that claim.
---

Generalization is a claim about rows you have not fit. You drew a batch, you chose a function, and you want the mistakes on the next batch — drawn the same way — to look like the mistakes on this one. A small training loss is evidence about the batch you fit. It becomes evidence about the next batch only when the family of functions was not flexible enough to memorise, or when you checked a batch it did not see.

The two ways to fail have names. Bias: the family cannot represent the pattern, so more rows of the same kind will not save you. Variance: the family can represent almost anything, so the particular rows you drew move the fit around, and the next batch lands somewhere else. [Bias and variance](/guides/bias-and-variance) is that split without the folklore that one of them is always the villain.

## What "the same process" is doing

The claim needs a process. The next batch has to be the same kind of row: the same features, the same target, a similar mix. A model that is excellent on last year's forms and lost on this year's is not a failure of the optimiser. The process changed, and the claim was never about the new process. Saying "it does not generalize" without saying to which rows is a shrug.

[Estimation](/guides/estimation) is the narrower version for a single number: a mean of a sample is a guess at a mean you did not compute.

## What this does not say

A good test score is not a guarantee for a batch drawn differently, and it is not a guarantee for a batch that is merely larger. It is a measurement on one held-out sample. Treat it as a measurement, with the sample size you actually had, not as a property the model now owns.
