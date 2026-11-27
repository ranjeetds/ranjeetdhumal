---
title: Multi-step plans compound errors
description: Each step can be slightly wrong. A plan that commits to every later step before seeing the result multiplies those errors.
topic: agentic-ai
maturity: budding
publishedAt: 2026-11-27
tags: [planning, errors]
objectives:
  - Say how an early error reaches a later step.
  - Prefer a plan that is revised when the result contradicts it.
---

A plan is a list of intended calls, written before those calls have returned. The first call can fail, return an unexpected row, or succeed at something adjacent to what the plan assumed. Every later call that uses the assumption inherits the error. Two steps that are each usually right do not make a two-step plan usually right, because the second step only sees the cases where the first step's output is the input it expected. The other cases are a different problem, and the original plan does not solve them.

The remedy is to treat the plan as state you are willing to throw away. [Agentic AI systems](/knowledge/agentic-systems) says that in a sentence. The mechanism is a read after each effectful call, and a rule that a mismatch stops the list. A loop that prints the whole plan and then runs it has chosen not to use the observations it is about to receive.

## Where a long plan is still reasonable

A long plan fits a workflow whose steps do not depend on surprising returns: rename, then move, then record, with each step checked and the sequence fixed in code. There the plan is a program, and the model is not choosing the later steps. The compounding risk returns as soon as a later argument is filled in from an earlier return that nobody checked.

## What this does not say

Shortening the plan to one step does not remove error. It removes the unexamined dependence between steps. A single unchecked call can still be the wrong call. The gain is that you can see it before a second call builds on it.
