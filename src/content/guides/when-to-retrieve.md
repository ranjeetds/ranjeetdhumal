---
title: When to retrieve
description: Retrieve when the answer depends on a document the model does not contain. Do not retrieve to decorate a question the model can already answer.
field: rag
order: 19
publishedAt: 2026-11-21
useWhen: The correct text changes often, is private to the user, or was never in the training mixture, and the model must quote or follow it.
avoidWhen: A single well-specified model call, with the facts already in the prompt, produces a checkable answer.
check: Remove the retriever. If the answer is unchanged, the documents were not doing the work.
diagram: retrieve
---

A model can use what is in its parameters or what is in the context you hand it. Retrieval is how a specific passage gets into the context at the moment it is needed. You embed a query, find nearby passages in a store you built, and place those passages where the model will read them. The model is not searching. Your program searched, and then asked the model to read.

That is worth doing when the passage is the authority: a policy that changed last week, a contract, a ticket, a page the model was never trained on. It is a cost and a new way to be wrong when the model already had a stable answer and the retrieved passage is boilerplate that merely looks related.

## The move

Start from the question the product must answer, and write the smallest context that contains the answer. If that context is a fixed paragraph, put the paragraph in the prompt and stop. If it must be selected from a changing store, retrieve, and then test the selection separately from the prose. The [retrieval-augmented starter](/projects#rag-starter-kit) is one such loop, useful because the pieces can be inspected.

Add a way to say "the store does not contain this." A system that must always produce a paragraph will treat a near miss as a source. The near miss is the failure mode retrieval adds, and it is invisible if you only read the final sentence.

## What this stops

A pipeline of chunk, embed, and generate assembled because that is what a retrieval demo looks like. The Anthropic essay on agents makes the same recommendation one level up: begin with the simplest call that works, and add machinery when a measured failure requires it. Retrieval is machinery.
