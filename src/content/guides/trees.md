---
title: Trees, when the boundary is not flat
description: A tree cuts one feature at a time. An ensemble of trees is many such cuts, averaged. The cuts are readable until the forest hides them.
field: machine-learning
order: 11
publishedAt: 2026-11-21
useWhen: Interactions and thresholds matter, and you would rather read a split than invent coordinates for a linear model.
avoidWhen: The signal really is a smooth weighted sum, and a tree will approximate it with a staircase.
check: Look at the first split. It should be a feature a domain reader recognizes, on a threshold they can interpret.
figure: decision-boundaries
---

A decision tree asks one yes-or-no question about one feature, then another, and puts a prediction in each leaf. The boundary it draws is a stack of axis-aligned cuts. That is a different family from a weighted sum. A relationship that depends on "this feature is high only when that one is low" is natural for a tree and awkward for a line.

A single tree that is allowed to grow until every leaf is pure will memorise the sample. The usual controls are a minimum leaf size, a maximum depth, and a requirement that a split improve the score by enough to matter. A forest or a boosted ensemble averages or adds many restricted trees. The average is harder to read and often more accurate. The trade is the one in [bias and variance](/guides/bias-and-variance).

## The move

Fit one shallow tree before the ensemble, and show the first few splits to someone who knows the rows. If the splits are nonsense — an identifier, a column that leaked the label, a threshold on a feature that was constant — the ensemble will build a more confident version of the same nonsense. Only after the shallow tree is boring in the right way is the forest worth training.

Score the ensemble on rows it did not grow on. Trees are excellent at fitting idiosyncrasies, including the order of a categorical code that has no order. A target encoding fit on the full column is a common way to hand the tree the answer.

## What this stops

Feature-importance bars from a forest are a summary of how often a column was used, not a causal ranking. Use them to find a leak and to start a conversation. Use a shallow tree when you need a sentence.
