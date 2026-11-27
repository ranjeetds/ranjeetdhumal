---
title: A tool is a function with side effects
description: A tool has arguments, a return value, and an effect on something outside the transcript. The effect is the part a sentence cannot undo.
topic: agentic-ai
maturity: budding
publishedAt: 2026-11-27
tags: [tools, side-effects]
objectives:
  - Separate a tool's return value from its effect.
  - Prefer a tool that can be run twice when the effect allows it.
---

A tool is a function the loop may call: a name, arguments checked against a schema, a return value, and sometimes an effect on a system outside the conversation. The return value is what the next observation can quote. The effect is what changed. They come apart. A function can return "ok" and have written the wrong row, or return an error after the write has already landed.

[The tool is the interface](/guides/the-tool-is-the-interface) treats the schema as the contract. Add the effect to the contract. Say, for each tool, whether calling it twice is the same as calling it once. A read can be repeated. A payment, a send, or a delete often cannot. The loop should not retry an effect it cannot identify. An idempotency key, or a read-back of the row, is how you tell a retry from a second action.

## What the model is allowed to supply

The model supplies arguments inside the schema. It does not supply the effect. A proposal to call `send` with a given body becomes a sent message only when the program runs it. Two tools that perform overlapping effects make that run ambiguous: a test that checks "a tool ran" cannot tell which effect landed. [Agentic AI systems](/knowledge/agentic-systems) flags the overlap. The fix is a schema that can express only one of them.

## What this does not say

A strict schema does not make the arguments correct. The types can match while the recipient, the amount, or the path is wrong. The schema limits the shape of the call. A check on the values, against data the program trusts, is a separate line of code.
