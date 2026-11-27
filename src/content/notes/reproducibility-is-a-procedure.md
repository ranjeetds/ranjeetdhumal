---
title: Reproducibility is a procedure
description: A result is reproducible when someone else can run the procedure and see the same comparison. A seed without the procedure is a gesture.
topic: emerging-tech
maturity: budding
publishedAt: 2026-11-27
tags: [reproducibility, method]
objectives:
  - List what a procedure has to include.
  - Distinguish a repeated draw from a confirmed result.
---

Reproducibility means that a person who was not in the room can follow a procedure and obtain the comparison you reported. The procedure includes the data, the split, the code or a precise description of the model, the seed, the budget, and the metric. Miss one, and the other person is running a relative of your experiment. Agreement is then luck. Disagreement has no interpretation.

[A seed makes a draw repeatable](/knowledge/a-seed-makes-a-draw-repeatable) covers one item on that list. The seed lets someone see the same pseudo-random stream. It does not restore a split you did not publish, or a preprocessing step that lived in a notebook you did not keep. Those change the data, which changes the result before any seed matters.

## What a second run is for

Run the procedure twice yourself before you ask anyone else to. If the two runs disagree by more than you are willing to claim, the result is a distribution over runs, and a single number is a sample from it. Report the spread you saw, or report that you ran it once. [A held-out set is still a sample](/knowledge/a-held-out-set-is-still-a-sample) is the matching warning about the data. The procedure warning is about the computation.

## What this does not say

A reproducible result is not a true claim. You can reproduce a leaked split, a weak baseline, and a metric that ignores the class you care about. Reproducibility lets the next person inspect the comparison. It does not supply the sentence the comparison is allowed to support. That sentence is still your job, under [separate the claim from the evidence](/knowledge/separate-the-claim-from-the-evidence).
