---
title: Estimation
description: An estimate is a procedure applied to a sample. The procedure has a target, a bias, and a spread, and those are different facts.
field: statistics
order: 5
publishedAt: 2026-11-21
useWhen: You are publishing a rate, a mean, or a model score and someone will treat it as the true value.
avoidWhen: You are describing the file in front of you and making no claim beyond it.
check: Repeat the procedure on new draws. The estimates should scatter around the target, not sit on one side of it.
figure: sample-mean
---

Estimation is the act of computing a number from a sample in the hope that it is close to a number you cannot see: a mean in the population, a rate of failure, a difference between two systems. The hope is a property of the procedure, not of the single number it returned today.

A procedure is biased if, across repeated draws, its average does not land on the target. It is variable if those draws land far apart. A biased procedure can look stable. An unbiased one can jump around so much that one draw is useless. Reporting a single estimate without either fact invites a reader to treat noise as a finding.

## The move

Name the target in a sentence that does not mention your sample. Then name the procedure, including the rule that gathered the rows. Only then compute. If you chose the procedure after seeing which one looked best, the target has quietly changed, and the number is no longer an estimate of the sentence you started with.

For a mean, the spread across draws shrinks as the sample grows, and it shrinks slowly. Four times the data buys you about half the scatter, when the draws are independent and the variance exists. A small sample with a dramatic difference is often a wide estimate sitting on one side of zero.

## What this stops

Picking the metric, the window, or the subset after looking at the outcome is a different procedure from the one you will describe in the write-up. The described procedure looks unbiased. The procedure you actually ran searched for a large number. Those are not the same estimate.
