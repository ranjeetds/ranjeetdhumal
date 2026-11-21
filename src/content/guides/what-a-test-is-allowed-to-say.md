---
title: What a test is allowed to say
description: A significance test is a procedure that sometimes raises an alarm when a stated model of the data is true. The alarm is not the probability that the model is false.
field: statistics
order: 7
publishedAt: 2026-11-21
useWhen: You have a predeclared comparison and want a check against a specific story of pure chance.
avoidWhen: You looked at many comparisons and want the smallest alarm to stand for the discovery.
check: State the claim in a sentence that does not contain the p-value. If the sentence is stronger than the comparison, delete the extra.
diagram: test
---

A test starts from a story in which nothing of the kind you hope for is going on: no difference, no association, a model that already explains the rows. It then asks how often a summary at least as extreme as yours would appear if that story were true. A small p-value says "rarely." It does not say how likely the story is, and it does not say how large the effect is.

The size of the effect and the amount of data move the p-value together. A tiny difference becomes "significant" in a huge sample. A large difference stays quiet in a small one. Reading the p-value as the importance of the finding swaps those two facts.

## The move

Write the comparison down before you compute it: which groups, which summary, what would count as extreme. Compute the summary itself — the difference, the interval around it — and put that number in the sentence a reader will remember. Use the test as a check on the pure-chance story, beside the interval, not instead of it.

If you ran twenty comparisons, the pure-chance story says one of them will look rare even when nothing is there. Selecting the rare one and reporting it as the test you meant is a different procedure, with a much higher false-alarm rate than the one printed next to it.

## What this stops

A paper, a dashboard, and an ablation table are full of quiet invitations to pick the comparison that alarmed. The guide is a refusal. The comparison was either declared, or it was a search. Say which one it was, and match the sentence to that choice.
