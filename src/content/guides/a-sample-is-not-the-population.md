---
title: A sample is not the population
description: A mean is a fact about the rows you have. It becomes a fact about the rows you do not have only under conditions you can name.
field: mathematics
order: 1
publishedAt: 2026-11-21
useWhen: You are about to report one number as if it described every case the system will meet.
avoidWhen: You already have the whole population, and the number is only a summary of it.
check: Draw a small sample from a skewed pile and watch the mean sit away from the pile.
figure: sample-mean
---

A dataset is a sample. The population is the larger set the sample was drawn from, including the cases you have not seen and will be judged on. The mean is the average of the values you do have. That sentence is the whole guide. Everything later that reports an average, including a loss, inherits it.

Shape is what the mean throws away. A pile on the left with a long tail on the right has a mean sitting where few of the values live. Reporting that mean and nothing else describes a point the data do not occupy. Two samples from the same population can have means far apart when the samples are small or the draw systematically misses a region.

## The move

Write down three objects before you quote a number. The population you claim to speak about. The rule that produced the rows you have. The summary you computed. If you cannot name the rule, you do not know which part of the population is missing, and the summary is a description of a file.

The [sample and its mean](/studio/sample-mean) is this picture on a designed population, so you can redraw the sample and watch the mean move while the population stays put. The [note](/knowledge/a-sample-and-its-mean) keeps the same distinction in prose.

## What this stops

A leaderboard score, a training loss, and a customer average are the same kind of object. Each is a fact about the rows that entered the calculation. Treating any of them as a fact about the next batch is an extra claim, and it needs the sampling rule. When that rule favours easy cases, the number will look better than the system.
