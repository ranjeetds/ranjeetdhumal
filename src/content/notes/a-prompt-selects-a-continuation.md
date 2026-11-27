---
title: A prompt selects a continuation
description: A prompt is a prefix. The model continues it. The prefix selects among continuations the weights already make likely.
topic: generative-ai
maturity: budding
publishedAt: 2026-11-27
tags: [prompts, inference]
objectives:
  - Treat a prompt as a prefix of the sequence.
  - Say what a prefix can and cannot add.
---

A prompt is the prefix of the sequence. The model returns a distribution for the next token given that prefix, a sampler appends one, and the prefix grows. Wording, order, and examples in the prefix change the distribution because they change the sequence. They do not reach into the weights. A prefix can make a continuation likely only if the weights already assign it some mass once that prefix is seen.

An example in the prefix is a pattern the next tokens can imitate. A role in the prefix is more text the distribution conditions on. Both are real levers, and both fail in the same way: if the desired continuation was never a likely one for any prefix of this kind, no rearrangement of the prefix will create it. The alternative is to change the weights, which is a different operation and needs examples of its own.

## What to check when the continuation is wrong

Look at the prefix the function actually received, after templating, after the tool text, after the tokens that fell out of the window. The prefix you wrote in a box and the prefix that was scored are often different strings. [Context is the only input](/knowledge/context-is-the-only-input) is that gap. [Tokens are a choice](/guides/tokens-are-a-choice) is the further gap between the string and the ids.

## What this does not say

A careful prefix is not a specification the model is obliged to follow. Nothing in the sampler checks the continuation against the instruction. If the product needs a constraint — a format, a refusal, a tool that must not be called — the check belongs in the program around the model. The prefix is a way to shift probability. It is not an enforcement mechanism.
