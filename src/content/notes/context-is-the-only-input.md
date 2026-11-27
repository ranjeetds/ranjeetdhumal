---
title: Context is the only input
description: At inference the weights are fixed. The sequence in the window is the only thing you can still change.
topic: generative-ai
maturity: budding
publishedAt: 2026-11-27
tags: [context, inference]
objectives:
  - Locate the controllable input at inference time.
  - Say what a finite window drops.
---

Once the weights are frozen, a call to the model is a function of the token sequence you pass in. There is no side channel for "what you meant" or for a document you did not include. If a fact is not in the weights and not in the sequence, it is not an input to this call. Retrieval works, when it works, by putting a passage into the sequence so the next distribution can depend on it. The search happened outside the model.

[Large language models](/knowledge/large-language-models) makes that the lever opposite fine-tuning. The piece to add is the window. The sequence has a maximum length. Tokens that fall off the front are not faded. They are absent. A long chat that "forgets" an instruction has often done something simpler: the instruction is no longer in the sequence the function received. A summary your program wrote and pinned at the front is a new input. It is not the dropped tokens.

## What you put in the window

The order and the wording are part of the input, because the distribution conditions on the whole sequence. A retrieved chunk that contradicts an earlier line gives the model both, and the continuation can follow either. [When to retrieve](/guides/when-to-retrieve) and [what a chunk destroys](/guides/what-a-chunk-destroys) are about that choice. [How to tell retrieval worked](/guides/how-to-tell-retrieval-worked) is the check: the continuation actually used the passage, rather than a fluent answer that would have appeared without it.

## What this does not say

Filling the window does not install a memory and does not make the continuation true. A wrong passage moves the distribution for the wrong reason. A correct passage can still be ignored if the scores favour a more common continuation. The window is the input. It is not a guarantee about which part of the input the next token depends on.
