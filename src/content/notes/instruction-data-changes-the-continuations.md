---
title: Instruction data changes which continuations are likely
description: Training on instructions changes the weights, so a prefix that used to continue as prose now continues as an answer.
topic: generative-ai
maturity: budding
publishedAt: 2026-11-27
tags: [instruction-tuning, fine-tuning]
objectives:
  - Separate a weight update from a prefix.
  - Say what instruction data does not install.
---

A model trained to continue text will continue an instruction as if it were more text. Instruction data is a set of prefixes paired with the continuations you wanted: a question with an answer, a request with a refusal, a task with a formatted result. Training shifts the weights so those continuations become more likely for prefixes of that shape. Afterward, a short request can elicit an answer without the answer being spelled out in the prefix.

That is a change to the weights, which is why it persists when the prefix is new, and why it cannot be undone by deleting a paragraph. It is the opposite lever from [a prompt](/knowledge/a-prompt-selects-a-continuation). The prompt spends the distribution you have. The update spends examples to change it.

## What the examples cover

The shift follows the examples. If the examples answer in a certain form, that form becomes likely, including on requests where the form is wrong. If a fact appears in the examples, the weights may reproduce it, and they may also reproduce it once it is stale. A fact that changes belongs in the context, as [large language models](/knowledge/large-language-models) puts it, when you can put it there. Instruction data is for behaviour you want even when no document is attached.

## What this does not say

Instruction data does not give the model a new ability to check itself, and it does not make the continuations true. It makes a kind of continuation more probable. A polished answer to a question the examples never constrained is still a sample. The check that the answer meets the request sits outside the weight update.
