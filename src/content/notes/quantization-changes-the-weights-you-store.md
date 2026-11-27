---
title: Quantization changes the weights you store
description: Quantization stores each weight on a coarser grid. The network that runs is the coarser one, and it can differ from the network you trained.
topic: generative-ai
maturity: budding
publishedAt: 2026-11-27
tags: [quantization, inference]
objectives:
  - Describe quantization as a coarser storage of the same weights.
  - Require a comparison on the task before treating the two networks as one.
---

A trained weight is a number with a fine grid, typically a floating-point value. Quantization replaces it with a value from a coarser grid, so the number takes less memory and the arithmetic can be cheaper. The network you then run is the network of the coarse values. It is not the network you trained, rounded only in the story. Every product and sum downstream sees the coarse value.

How much the outputs move depends on the grid, on which weights you coarsened, and on the activations those weights meet. There is no general permission to assume the move is small. The comparison is empirical and local to the task: the same prompts, the same decode policy, and a check on the continuations you care about. A demonstration that one paragraph still looks fluent is a check of that paragraph.

## What you are allowed to claim

You may claim that the stored network is smaller, if you measured the memory. You may claim that the task still behaves, if you measured the task. You may not carry a number from someone else's task onto yours, and this note will not invent one. [Evaluation and alignment](/knowledge/evaluation-and-alignment) is the reason: a score on a convenient set is not the behaviour. Quantization is one more way the system you measured and the system you shipped can be different systems.

## What this does not say

Coarser weights are not "the same model, approximately," as a slogan. They are an approximation whose error you have or have not measured. If you have not measured it on the calls your product makes, you have a smaller network and an open question.
