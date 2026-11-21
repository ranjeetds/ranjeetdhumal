---
title: Leakage and the split
description: A test set that influenced any choice is no longer a test. Leakage is usually a feature, a duplicate, or a date, and it flatters the score.
field: machine-learning
order: 12
publishedAt: 2026-11-21
useWhen: You are about to believe a held-out number, including your own.
avoidWhen: The number is a training loss, and you are only using it to see whether the optimizer moved.
check: Name one column that would not exist at the moment of prediction. Confirm it is absent from the features.
diagram: split
---

The split is the device that keeps the search honest. Training rows may influence the function. Test rows may not influence anything: not the features, not the family, not the decision to stop, not the choice of threshold. A validation row sits between them and may influence those choices, which means it too is spent, and a final look needs rows that influenced nothing.

Leakage is any path by which the answer, or a stand-in for the answer, enters the inputs. A feature computed with the full column's mean. A duplicate customer on both sides. A "days until the event" column. A preprocessing step fit on every row and then applied to the test set. The model is not cheating in a moral sense. The procedure handed it a shortcut, and the score measured the shortcut.

## The move

Draw the timeline of a single prediction. At that moment, which fields exist? Build features from only those, fit every statistic on the training side only, and join duplicates into one side of the split before you shuffle. For time-ordered data, split by time. A random split of a series lets the model see tomorrow's neighbour while predicting today.

When a score looks too good, look for the shortcut before you look for a better algorithm. Remove the suspect column and rerun. A collapse is a finding. It is the finding the original number was hiding.

## What this stops

Most impressive numbers that do not survive new data failed here. The algorithm was never the interesting part. The guide is a habit of asking, of each column, "would I have this at decision time?"
