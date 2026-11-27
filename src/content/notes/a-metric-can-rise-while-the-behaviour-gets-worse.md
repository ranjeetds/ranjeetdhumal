---
title: A metric can rise while the behaviour gets worse
description: A single score compresses a table of outcomes. The behaviour you care about can move the wrong way inside a rising score.
topic: machine-learning
maturity: budding
publishedAt: 2026-11-27
tags: [metrics, evaluation]
objectives:
  - Read accuracy as one compression of a confusion table.
  - Name a change that improves the score and worsens a class.
---

A metric is a compression. Accuracy counts the rows you got right and divides by the number of rows. Precision, recall, and a mean of squared errors each throw away a different part of the table. Once the table is a single number, two models with the same number can fail in opposite ways, and a model can improve the number by changing a cell you did not mean to change.

The ordinary case is an uneven class. If most rows are the common class, predicting that class every time scores well on accuracy and never finds the rare one. A change that catches a few rare rows and upsets many common ones can lower accuracy while doing the thing you built the model for. The score rose or fell. The behaviour is in the cells.

## Look at the table

[Confusion](/studio/confusion) is the table before the compression: for each true class, the counts of what the model said. Read the row you cannot afford to miss before you read the average. [What a test is allowed to say](/guides/what-a-test-is-allowed-to-say) is the matching rule for the number you eventually quote. Quote it with the class mix it was computed on.

[Evaluation and alignment](/knowledge/evaluation-and-alignment) is the same compression one level up, when the score is a benchmark rather than a column of labels.

## What this does not say

Throwing the metric away does not help. You need a number so that a change can be compared. The discipline is to keep the table next to the number, and to decide in advance which cell is allowed to get worse. A rising score without that decision is not yet a reason to ship the change.
