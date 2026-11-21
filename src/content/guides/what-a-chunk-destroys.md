---
title: What a chunk destroys
description: A chunk is a cut. It can separate a definition from its exception, and the embedding will then retrieve half a rule.
field: rag
order: 20
publishedAt: 2026-11-21
useWhen: You are choosing how to split documents before they enter a store.
avoidWhen: The documents are already the size of a useful answer, and splitting them would only multiply near-duplicates.
check: Find a rule that has an exception in the next paragraph. Confirm both land in a context the model can see together.
diagram: chunk
---

An embedding retrieves passages that sit near the query in some learned geometry. The geometry does not know where you cut. A cut through the middle of a definition, a table broken from its header, and a warning that lives in the following paragraph all produce a passage that is nearby and incomplete. The model then answers from the half it was shown, fluently.

Overlapping windows reduce some of these cuts and duplicate others. A large chunk preserves context and crowds the prompt with neighbours the query did not need. There is no universal length. There is the unit a reader would need in order to apply the passage without the page around it.

## The move

Choose the cut at a boundary a person already uses: a section, a heading, a clause that a policy numbers, a row of a table kept with its header. Store the title and the parent heading with the passage, because the words "this limit" are useless without the name of the thing limited. After indexing, query for ten real questions and read the retrieved passages yourself, before any model writes a sentence.

If the right passage is missing, the failure is in the cut or the embedding, and rewriting the prompt will not fetch it. If the right passage is present and the answer ignores it, the failure is in how the context is read, which is the next guide.

## What this stops

Judging a retrieval system by the paragraph it emits. The paragraph can be true, or plausible, while the chunk that should have constrained it never entered the prompt. Read the chunks.
