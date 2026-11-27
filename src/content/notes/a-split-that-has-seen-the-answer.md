---
title: A split that has seen the answer
description: A test set is a claim about rows the fit did not use. Leakage is any path by which those rows, or their answers, shaped the fit.
topic: machine-learning
maturity: budding
publishedAt: 2026-11-27
tags: [evaluation, leakage]
objectives:
  - Say what a held-out row is for.
  - Name two ways an answer leaks into the fit.
---

A split is a promise. The training rows may shape the fit. The test rows may not. The number you quote on the test rows is a claim about performance on data the procedure did not use. The promise is broken whenever information from the test rows, including their labels, changes a choice you then evaluate on those same rows.

The obvious break is training on the test set. The quieter ones do the same job. You scale every column using the mean of the whole table, then split. You pick the model that looked best on the test set, then report that test set. You put two rows from the same patient on opposite sides of the split, and the patient's signature is in both. In each case the fit, or the choice of fit, has seen something it was supposed to meet for the first time.

## What to lock before you look

[Leakage and the split](/guides/leakage-and-the-split) is the practical version: decide the split before any statistic that will be reused, and keep anything that identifies a unit on one side only. [What a test is allowed to say](/guides/what-a-test-is-allowed-to-say) is the matching limit on the number. A low error on a leaked split is a fact about that procedure. It is not a fact about the next batch.

## What this does not say

A clean split is not a large split. Fifty untouched rows can still be a lucky fifty. The split answers "did this number use the answers." It does not answer "is fifty rows enough to trust." That second question is about the sample, and it stays open after the leakage is gone.
