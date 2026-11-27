---
title: Rules still solve the small case
description: When the cases are few and the rule is exact, writing it down beats estimating it.
topic: artificial-intelligence
maturity: budding
publishedAt: 2026-11-27
tags: [rules, learning]
objectives:
  - Say when a written rule is the right procedure.
  - Refuse a learned model for a constraint that must hold.
---

A written rule is a procedure you can read. If the input is one of a small set, and the correct action is a function you can state, the rule solves the problem. It does not need a sample, a loss, or a hope about the next batch. A validator that rejects a malformed date, a parser that accepts a grammar, a permission check that refuses a path outside a directory: these are rules. Replacing them with a model adds a way to be wrong that the rule did not have.

Learning is the move you make when the rule is real but you cannot write it, because the cases are too many or the boundary is not a shape you can name. That is a large class of problems. It is not all of them. A system that learns the parts a person should have written will be graded on those parts as if they were judgement, and it will fail them in ways a unit test would have caught.

## Where the rule sits

In a product the rule usually sits around the model, not inside it. The model proposes a call. The rule decides whether the call is in the set of allowed calls. The model proposes a number. The rule checks the range. Putting the constraint in the prompt asks the model to remember it. Putting it in code makes the constraint true of the action that runs.

The [agent loop](/studio/agent-loop) is easier to read once you can see which step is a proposal and which step is a rule. The proposal can be fluent and still be the wrong call. The rule is what stops the call.

## What this does not say

A rule is not a theory of the domain. It is as good as the cases it names. A permission check that forgets one path is a hole. The advantage is that the hole is a missing line, which you can find, rather than a region of a learned function, which you have to sample.
