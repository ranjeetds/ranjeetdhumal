---
title: Supervised learning starts with pairs
description: A supervised problem is a list of inputs paired with the output you wanted. The model is a function fit to those pairs.
topic: machine-learning
maturity: budding
publishedAt: 2026-11-27
tags: [supervised-learning, data]
objectives:
  - State a supervised problem as pairs.
  - Say what the fit is allowed to claim.
---

Supervised learning starts with pairs. Each pair is an input and the output you wanted for it: a row and a label, a sentence and a class, a measurement and a number. The model is a family of functions. Training picks the member of that family whose outputs sit close to the wanted ones, where "close" is a loss you chose.

Nothing in that procedure supplies the meaning of the label. If the label is the wrong quantity, the fit will chase the wrong quantity with whatever capacity you gave it. If two rows share an input and disagree on the output, the loss has to compromise, and the compromise is a property of the pairs, not a discovery about the world.

## What the pairs leave out

The pairs are a sample. [A sample and its mean](/knowledge/a-sample-and-its-mean) is the small version of the same warning: a summary of the rows you drew is not a summary of the rows you did not draw. A fit that matches every training pair can still be a bad guess for the next one, and a fit that matches them badly can be the honest answer when the labels are noisy.

The [learning problem](/guides/the-learning-problem) is this setup written as a checklist: the input, the target, the loss, and the set the claim is about. Skip one of those and the word "trained" has nothing to attach to.

## What this does not say

Having pairs does not make the problem supervised in a useful sense if the target was built from the input by a rule you could have written down. The model will look accurate because the rule is still in the features. That accuracy is a report about the pairs. It is not a report about a prediction you could not have made by hand.
