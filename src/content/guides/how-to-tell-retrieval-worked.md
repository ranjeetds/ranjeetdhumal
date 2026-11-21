---
title: How to tell retrieval worked
description: Score the passages and the answer separately. A correct sentence built from the wrong passage is a failure of the system you built.
field: rag
order: 21
publishedAt: 2026-11-21
useWhen: You are changing a chunker, an embedding, a reranker, or a prompt and want to know which change mattered.
avoidWhen: You have no questions whose supporting passage you can point at. Without those, you can only read anecdotes.
check: On a fixed set of questions, mark whether the supporting passage was in the top results, and whether the answer stayed inside it.
diagram: retrieval-score
---

A retrieval system is a chain: query, candidates, optional rerank, context, answer. A single score on the answer confounds every stage. The answer can be right because the model knew it and ignored the passages. The answer can be wrong because the right passage was fifth and you only kept three. Those are different bugs, and a leaderboard of final sentences treats them as one.

Keep a small set of questions written from the documents, each with the passage that should have been retrieved and a note on what an answer is not allowed to add. Run the chain. Record two marks. Did the passage appear in the kept set? Did the answer assert something the passage does not support? Change one stage at a time.

## The move

Read the failures in those two piles. Missing passages are a cut, an embedding, or a query that does not resemble the document's wording. You can try a second query, a reranker, or a different cut, and the first mark will tell you if it worked. Present passages and a wandering answer are a reading problem: too many passages, a prompt that does not require quotation, or a question the passage only half answers. Fix the pile you measured.

The same set has to stay fixed while you compare. A new set of questions chosen after you saw the errors is a search for a flattering score, which [a test](/guides/what-a-test-is-allowed-to-say) already forbids.

## What this stops

Shipping a rewrite of the prompt because the demo looked better on three examples. The two marks, on a set you did not edit afterwards, are the comparison.
