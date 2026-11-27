---
title: The residual stream is what the block edits
description: A transformer block does not replace the token vector. It adds a mix, and a position-wise change, back onto it.
topic: generative-ai
maturity: budding
publishedAt: 2026-11-27
tags: [transformers, residual]
objectives:
  - Describe one block as two additions onto a stream.
  - Separate the stream from the attention weights.
---

Call the vector at each position the stream. A block reads the stream, computes an attention mix, and adds that mix back. It then computes a change at each position alone and adds that change back. The stream after the block is the stream before, plus two edits. [The transformer block](/studio/transformer-block) draws the additions on two designed tokens. [Attention and transformers](/knowledge/attention-and-transformers) is the longer account of the mix itself.

The addition is the same residual idea as elsewhere: the block can contribute nothing, and the stream still passes. Stacking blocks is stacking edits. A later block reads the edited stream, not the original token vector, unless every edit in between happened to be zero.

## What people point at instead

The attention weights are easier to draw than the stream, so they get treated as the contents of the model. The weights say how the mix was assembled for one head, at one layer, for one forward pass. They are not the stream, and they are not a trace of what the model "attended to" in the sense of a reason. [Attention patterns](/studio/attention-patterns) uses handwritten scores so that limit stays visible. A head in a trained model is a learned comparison. The figure is not that comparison.

## What this does not say

Describing the block as an edit does not say what the edit means. The added vector is a list of numbers. Interpreting one coordinate as a feature is a further claim, and it needs evidence that the coordinate tracks the feature when other things change. The architecture tells you the stream is the object being rewritten. It does not label the coordinates.
