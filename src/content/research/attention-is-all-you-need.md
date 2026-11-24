---
title: A close reading of Attention Is All You Need
description: The architectural claim in Vaswani et al., the evidence the tables can support, and three things the paper does not establish.
tags: [transformers, papers]
draft: false
kind: paper-note
stage: posted
publishedAt: 2026-11-24
authors: [Ashish Vaswani et al.]
source: https://arxiv.org/abs/1706.03762
---

The claim, in one sentence that could be false: a sequence model can drop recurrence and convolution and still translate, by letting every position compare itself with every other position in parallel.

The architecture that carries the claim is a stack of the same block. Each block attends, adds that result back onto its input, runs a feed-forward, and adds again. Several heads are several of those comparisons. A positional encoding, sines and cosines of the position, is added because the attention itself has no order. The [positional encoding](/studio/positional-encoding) figure is that encoding at width 8. The [block](/studio/transformer-block) figure is the add-mix-add shape on two designed tokens, not the matrices from the paper.

The evidence is a comparison of full translation systems on WMT 2014 English–German and English–French. The paper reports that its systems match or beat the recurrent and convolutional systems it cites, and that they train with more parallelism. That is evidence about those systems on those tasks, under BLEU. It is not a measurement that isolates attention from the optimizer, the regularization, the training budget, or the tokenization. The tables change several of those at once. An improvement in the table cannot be assigned to attention alone.

Three things the paper does not establish. Attention is not shown to be a memory. A head is not shown to be a linguistic relation; the [attention patterns](/studio/attention-patterns) on this site are handwritten scores, and the paper’s heads are learned weights, which is a different object. The block is not shown to be the right inductive bias for a task the paper did not measure.

The reading that follows from the paper is narrower than the slogan. Recurrence is not required for the translation results they report. Everything else is a later interpretation.
