---
title: Separate the claim from the evidence
description: A claim is a sentence that could be false. The evidence is the comparison offered for it. They are different objects, and a summary often glues them together.
topic: emerging-tech
maturity: budding
publishedAt: 2026-11-27
tags: [reading, method]
objectives:
  - Write a claim as one sentence that could be false.
  - Point at the comparison that is supposed to support it.
---

A paper, a benchmark post, and a launch note tend to arrive as one paragraph. Inside it are three objects. The claim is a sentence that could be false. The evidence is the comparison that is supposed to support the sentence: the data, the metric, the systems in the table, and what was held fixed. The falsifier is an observation that would have made the claim fail, including one nobody collected. [Separating a paper's claim from its evidence](/research#claim-and-evidence) works this split on one real paper. The habit is the same for a number in a product update.

If you cannot find the sentence, you have a mood, not a claim. If you cannot find the comparison, you have a claim with no evidence yet. If the comparison held the task fixed and let the training budget move, the comparison supports "these systems scored this way," and it does not support "this one component produced the gain." The sentence you repeat should be the sentence the comparison can carry.

## What to write in the margin

Write the claim in one line. Under it, write the data and the metric. Under that, write one observation that would have falsified it. [What a table is allowed to say](/knowledge/what-a-table-is-allowed-to-say) is the limit on the middle line. [Evaluation and alignment](/knowledge/evaluation-and-alignment) is the same discipline when the number is a score you might train on, rather than a score you are only reading.

## What this does not say

Separating the claim from the evidence does not rank the authors, and it does not forbid you to use a method whose attribution is incomplete. It forbids you to repeat a stronger sentence than the comparison supports. Use the method under the sentence you can actually defend.
