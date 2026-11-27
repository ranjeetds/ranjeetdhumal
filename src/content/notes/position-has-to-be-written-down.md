---
title: Position has to be written down
description: Attention by itself has no order. A positional signal is how the sequence tells the model which piece came first.
topic: generative-ai
maturity: budding
publishedAt: 2026-11-27
tags: [position, transformers]
objectives:
  - Say why a bag of token vectors has no order.
  - Point at a positional encoding as that missing order, written as numbers.
---

A set of token vectors, with no extra signal, is a bag. Attention compares them and returns a weighted average. Nothing in that comparison knows which vector was on the left. Swap two positions and, if you swap their vectors with them and add nothing else, the averages come out swapped in the same way. Order has to be written into the vectors, or into the comparison, or the model cannot represent "the subject came before the verb."

The usual way is to add a positional encoding: a vector that depends on the index, added to the token vector before the stack runs. Sines and cosines of the index are one such family. A learned vector per index is another. [Positional encoding](/studio/positional-encoding) draws the sine-and-cosine version at a small width. The drawing is the encoding, not a claim about what a particular model learned to do with it.

## What the encoding does not carry

The encoding marks where a piece sits. It does not mark what the piece means, and it does not let the model see past the window. A position that fell off the front is not encoded as "long ago." It is gone. Relative schemes change which pair of indexes the comparison can see. They still cannot see an index that was not in the sequence.

[Attention and transformers](/knowledge/attention-and-transformers) is the average that this signal feeds. [Attention is a weighted average](/guides/attention-is-a-weighted-average) is the guide.

## What this does not say

Adding positions does not give the model a clock, a memory of earlier conversations, or an understanding of narrative time. It distinguishes index 3 from index 4 in this sequence. A story about the model "knowing what happened earlier" still has to point at tokens that are actually in the window.
