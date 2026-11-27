---
title: A seed makes a draw repeatable
description: A seed fixes the sequence of pseudo-random numbers a run will see. It makes a draw repeatable. It does not make the result independent of the draw.
topic: python-cs
maturity: budding
publishedAt: 2026-11-27
tags: [randomness, reproducibility]
objectives:
  - Say what a seed controls.
  - Report the seed when a comparison could be a different draw.
---

A generator turns a seed into a stream of numbers that look unordered but are fixed once the seed is fixed. The same seed, the same library, and the same sequence of draws produce the same numbers. Initialization, dropout masks, shuffled rows, and a sampled token all read from some stream. Set the seed, and those choices can be repeated. Change the number of draws — an extra logging call that pulls a random number, a different batch size — and the later draws move, even though the seed did not.

Repeatability is not stability. Two seeds are two starts. [Initialization decides the first slope](/knowledge/initialization-decides-the-first-slope) and [convex means a local minimum is the minimum](/knowledge/convex-means-a-local-minimum-is-the-minimum) explain why two starts can finish apart when the loss is not convex. If you report one seed's metric as the result, you have reported one draw. A comparison between two methods that used different seeds is a comparison of methods and of draws, tangled.

## What to record

Record the seed, the library, and the point in the program where the generator is created. A global generator that other code also reads is a shared stream, and a change in an unrelated function can change your draws. A generator passed in explicitly keeps the stream local. [Reproducibility is a procedure](/knowledge/reproducibility-is-a-procedure) is the wider version of the same record-keeping.

## What this does not say

Publishing a seed does not make a result true, and it does not replace a second seed. It lets someone else see the same draw you saw. Whether the claim survives a different draw is a question you answer by running one.
