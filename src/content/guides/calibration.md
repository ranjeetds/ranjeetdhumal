---
title: Calibration
description: A model that says 80 percent is calibrated if the event happens about eight times in ten of those cases. Confidence is not that check.
field: statistics
order: 8
publishedAt: 2026-11-21
useWhen: A score will be treated as a probability, a threshold, or a reason to abstain.
avoidWhen: The number is only a rank, and nothing downstream reads it as a chance.
check: Bin the predictions by the stated probability and plot the frequency of the event in each bin.
diagram: calibration
---

Many models emit a number between zero and one. Softmax, a logistic regression, and a human's "I'm sure" all produce such numbers. Calling the number a probability is a claim that it matches the frequency of the event. Calibration is that claim, checked.

A model can rank cases perfectly and still be miscalibrated. It can put every positive case above every negative case and still say 0.99 on events that happen half the time. Decisions that treat 0.99 as "almost certain" will then be wrong in a systematic direction. Ranking metrics will not notice.

## The move

Collect predictions and outcomes. Group the predictions into bins of similar stated probability. In each bin, compare the average stated probability with the fraction of outcomes that occurred. A calibrated model sits near the diagonal. A model that is consistently too sure sits below it. One that is consistently too shy sits above it.

Temperature, a held-out scale on the logits, and isotonic maps are ways of moving a score onto that diagonal after the model is trained. They do not add information. They spend a calibration set to fix the costume. If the costume is refit on the same rows you will brag about, the diagonal is guaranteed and the check is void.

## What this stops

A threshold chosen because the number "looked like" a probability will fire at the wrong rate. Set the threshold from the cost of a false alarm and a miss, on a set that did not choose the threshold. The stated probability is an input to that choice only after the plot has been looked at.
