---
title: The loss chooses what is expensive
description: A loss is a number for one prediction. Training spends its effort on whatever that number treats as costly.
topic: machine-learning
maturity: budding
publishedAt: 2026-11-27
tags: [loss, training]
objectives:
  - Read a loss as a choice of which mistakes count.
  - Compare squared error and cross-entropy as different prices.
---

A loss turns one prediction and one target into a number. Training moves the parameters so that number, averaged over the rows, gets smaller. The shape of the number is the choice. Squared error charges the square of the distance, so a single far miss costs more than many small ones. Cross-entropy charges a confident wrong class more than a hesitant one. Those are different problems, even when the rows are the same.

A metric you report later is not the loss, unless you trained on it. Accuracy treats every row as equal and ignores how sure the model was. A search that minimises cross-entropy can raise accuracy, or fail to, depending on where the probability mass moved. Quoting the metric as if it were the objective hides the price the search actually paid.

## One prediction, then a mean

[Loss functions](/studio/loss-functions) draws the number for a single prediction. The training loss is that number averaged over a batch or a set. Averaging is a second choice: a rare class contributes little to the mean, so a search aimed at the mean can ignore it. Reweighting the rows is how you tell the mean that those mistakes are expensive after all.

[Gradient descent](/studio/gradient-descent) walks a surface built from a loss. Change the loss and you change the surface, even if the picture on that page stays a designed one.

## What this does not say

A clever loss does not repair a bad target. If the label is the wrong event, every loss on that label is a price on the wrong event. Choose the loss after you can say, in a sentence, which mistake you are willing to pay for.
