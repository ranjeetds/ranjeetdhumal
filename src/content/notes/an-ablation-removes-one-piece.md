---
title: An ablation removes one piece
description: An ablation is a rerun with one piece removed or replaced. The change in the result is evidence about that piece only if the rest really stayed put.
topic: emerging-tech
maturity: budding
publishedAt: 2026-11-27
tags: [ablation, method]
objectives:
  - Define an ablation as one deliberate removal.
  - Notice when the removal dragged other choices with it.
---

An ablation runs the same system twice, with one piece removed or swapped, and attributes the difference to that piece. The logic is sound when the piece is the only thing that changed. It fails when the removal forces other changes: a different learning rate, a different number of parameters, a training run that was retuned only for the full system, a decode policy that was chosen after looking at the full system's outputs.

The honest ablation reports the difference and the things that could not be held fixed. "We removed the retrieval step and the score dropped" is evidence about retrieval only if the rest of the pipeline saw the same questions and was not quietly retuned. Otherwise it is evidence about a different pipeline that happens to lack retrieval.

## One piece means one piece

Removing a whole module removes every idea inside it. You have not learned which idea mattered. A second ablation, inside the module, is a different experiment. [A baseline is the comparison](/knowledge/a-baseline-is-the-comparison) is the coarser version: the full system against something simpler. An ablation is a baseline that tries to differ in exactly one place. When you cannot make the difference that small, say so, and shrink the claim to match.

## What this does not say

A flat ablation — no change when the piece is removed — does not prove the piece is useless in general. It proves it was not pulling its weight in this setup, at this size, on this data. A piece can matter only once the rest of the system is strong enough to use it. The result is about the run you did.
