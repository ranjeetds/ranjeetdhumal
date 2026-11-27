---
title: The model proposes; the product decides
description: A model returns a proposal. The product is the program that decides whether that proposal may change anything.
topic: artificial-intelligence
maturity: budding
publishedAt: 2026-11-27
tags: [products, models]
objectives:
  - Locate the decision in the product, not in the model.
  - Name what a proposal is allowed to change.
---

A model returns a proposal. In a chatbot the proposal is the next piece of text, or a chain of them. In a tool-using system the proposal is a call: a name, arguments, and sometimes a request to stop. The product is the program around that proposal. It decides what the proposal is allowed to change, which tools exist, what is shown to a person, and what is logged.

Sliding these together is how a demo becomes an incident. The model "decided" to send the email only if the product executed a send. If the product executes every well-formed call, the decision was the product's, made in advance, by having no decision left. The model filled in arguments. The authority was elsewhere.

## What belongs in the product

The product owns the set of tools, the arguments it will accept, the confirmation an irreversible call requires, and the observation that comes back. It also owns the refusal. A model can be asked to refuse in words. The product refuses by not running the call. Those survive different failures. A prompt can be talked out of a refusal. An absent tool cannot be called.

[Workflows and agents](/guides/workflows-and-agents) and [the tool is the interface](/guides/the-tool-is-the-interface) are the same split written as practice. The [agent loop](/studio/agent-loop) is the picture, including the call that fails.

## What this does not say

Putting the decision in the product does not make the proposal harmless. A proposal shown to a person can still mislead them. A proposal that fills a form can still be wrong in a field the product does not check. The split tells you where to put the check. It does not write the check for you.
