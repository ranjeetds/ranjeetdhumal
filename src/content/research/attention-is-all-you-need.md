---
title: A close reading of Attention Is All You Need
description: A planned note on Vaswani et al. The job is to separate the architectural claim from the evidence offered for it, and to mark what the paper does not establish.
tags: [transformers, papers]
draft: false
kind: paper-note
stage: planned
publishedAt: 2026-11-19
authors: [Ashish Vaswani et al.]
source: https://arxiv.org/abs/1706.03762
---

Vaswani and colleagues, in 2017, replaced recurrence with attention and reported strong translation results. The note this entry will become is not a restatement of that result. It has three jobs. State the architectural claim precisely: a sequence can be processed by comparing every position with every other, in parallel, with recurrence removed rather than approximated. Separate that claim from the evidence. The tables compare full systems, so an improvement cannot be assigned to attention alone without asking what else changed — the optimizer, the regularization, the training budget, the tokenization.

Then list what the paper does not establish. It does not show that attention is a memory, that a head corresponds to a linguistic relation, or that the same block is the right inductive bias outside the tasks it measured. Those are later interpretations. Until the note is written, this entry is the reading plan. It is not a finding, and it does not add evidence the paper does not contain.
