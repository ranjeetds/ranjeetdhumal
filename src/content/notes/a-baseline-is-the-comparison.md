---
title: A baseline is the comparison
description: A result is a difference from a baseline. Without the baseline, and without what it was allowed to use, the number has nothing to sit next to.
topic: emerging-tech
maturity: budding
publishedAt: 2026-11-27
tags: [baselines, evaluation]
objectives:
  - Read a reported gain as a difference from a named baseline.
  - Ask what the baseline was denied.
---

A number on its own is a measurement of one system. A gain is a difference, and the difference needs a baseline: the other system, on the same data, under a comparison you can describe. "Better than the previous approach" is not a baseline until the previous approach is named, its score is the score you would have measured, and the budget, the data, and the decode policy are either matched or openly unmatched.

A weak baseline makes every gain look large. A baseline denied the feature under test is the right baseline for "does this feature help," and the wrong baseline for "is this the best system." Those are different claims. [Separate the claim from the evidence](/knowledge/separate-the-claim-from-the-evidence) asks which one the table was built to answer. A table that answers the first and is narrated as the second has not been misread by accident.

## What to match

Match the data, the metric, and the information the systems could see. A model with a retrieved document is not comparable to a model without it, if the claim is about the architecture. A model trained for longer is not comparable to one trained until Tuesday, if the claim is about the loss. [The setup is part of the result](/knowledge/the-setup-is-part-of-the-result) is the list of things that were different. Put the unmatched items in the same sentence as the gain, or the gain will be quoted without them.

## What this does not say

A fair baseline does not make the winning system good. It makes the difference interpretable. Both systems can be bad at the task you actually have. The baseline answers "better than what." It does not answer "good enough to use."
