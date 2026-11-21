---
title: Attention is a weighted average
description: Each position mixes the values of other positions. The weights come from how well a query matches each key. Nothing outside the sequence is retrieved.
field: generative
order: 17
publishedAt: 2026-11-21
useWhen: You are explaining a prediction that depends on an earlier token, or designing a block that has to move information across positions.
avoidWhen: The fact the model needs is not in the context. Attention cannot fetch it from a database you forgot to open.
check: For one query, list the positions with the largest weights and say what value was copied.
figure: attention-patterns
---

Attention, in a transformer, is a weighted average of value vectors. The weights are a softmax over the match between a query vector and each key vector. The output replaces, or is added to, the position that asked. That is the mechanism. It moves information that is already in the sequence from one position to another. It does not look up a document, and it does not contain a fact that no token brought in.

Several heads are several such averages, with different learned projections. A head can copy a name to the position that has to agree with it, or track a delimiter. Calling a head a "concept" is an extra claim, and it needs a pattern you can see on more than one example. A picture of every head at once hides the average you meant to read.

## The move

Pick one position and one head. Read the weights as a distribution over earlier positions, and read the output as the mixture of their values. The [attention patterns](/studio/attention-patterns) figure is a small designed case of that reading. A mask, when there is one, stops the average from using positions the model is not allowed to see, which is how a next-token model avoids reading the answer it is supposed to produce.

The rest of the block — the position-wise map, the residual stream, the normalization — gives that average a place to be written and a scale that can be trained. The prediction is a function of the final stream. One head's average is a contribution, not the model's belief.

## What this stops

Describing a model as "attending to the source" when the source was never placed in the context. If the weight on the relevant tokens is near zero, the model is using something else, and the fluent answer is not evidence that it read them.
