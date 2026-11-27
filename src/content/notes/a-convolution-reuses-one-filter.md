---
title: A convolution reuses one filter
description: A convolution applies one small weighted sum at every position. The reuse is the assumption that the pattern can appear anywhere.
topic: deep-learning
maturity: budding
publishedAt: 2026-11-27
tags: [convolution]
objectives:
  - Describe a filter as a shared weighted sum.
  - Say what the sharing assumes about the input.
---

A convolution takes a small window of weights, the filter, and slides it across the input. At each position the filter computes the same weighted sum. The output is one number per position. Sharing the weights is the whole idea. A pattern the filter detects at the left is the pattern it detects at the right, because the weights did not change.

A fully connected layer on the same input would give every position its own weights. That layer can represent a convolution, and also a great many functions that treat the left edge as unrelated to the right edge. The convolution refuses those functions in advance. You use it when the refusal is justified: the same local pattern matters across the image, the audio, or the sequence.

## What the window cannot see

The window sees only the positions inside it. A relationship between two distant pixels is invisible to one layer of a small filter. Stacking layers, or downsampling between them, grows the region a later unit depends on. That growth is ordinary composition. It is not a new kind of memory. [Convolution](/studio/convolution) draws one filter on a small grid so the reuse is visible before the stack hides it.

[A layer](/guides/a-layer) puts the same weighted sum next to the dense version, where every input has its own weight.

## What this does not say

Using a convolution does not mean the input has translation structure. If the left edge and the right edge mean different things — a form where the date is always in the corner — sharing weights forces the model to treat them alike. The filter is an assumption. When the assumption is false, a dense layer on a shorter input can be the smaller lie.
