---
title: Self-Taught Optimizer
description: Zelikman, Lorch, Mackey, and Kalai, 2023. A frozen language model rewrites the program that calls it. The authors say this is not full recursive self-improvement.
tags: [self-improvement, language-models]
draft: false
kind: paper-note
stage: posted
publishedAt: 2026-11-25
authors: [Eric Zelikman, Eliana Lorch, Lester Mackey, Adam Tauman Kalai]
source: https://arxiv.org/abs/2310.02304
---

Eric Zelikman, Eliana Lorch, Lester Mackey, and Adam Tauman Kalai, “Self-Taught Optimizer (STOP): Recursively Self-Improving Code Generation,” arXiv:2310.02304, 2023, published at COLM 2024.

The object that changes is a scaffolding program. The language model does not. A seed program asks the model for candidate programs, scores them with a utility the authors supply, and returns the best. That same program is then used to propose a replacement for itself. On a small set of downstream algorithmic tasks, including learning parity with noise, the authors report that the rewritten improver produced better programs than the seed. The model also proposed recognisable search procedures, including beam search, genetic algorithms, and simulated annealing. The experiments use GPT-4 for the main runs. Smaller models improved less often.

The authors’ own limit is the one to keep. Because the model weights are not updated, they write that this is not full recursive self-improvement. They also write that they do not believe the scaffolds STOP produced were better than scaffolds written by experts. In a separate check they generated 10,000 candidate improvements and looked for two strings that would leave a sandbox. For GPT-4 that syntactic check fired on 0.42 percent of generations, with a reported interval of 0.31 to 0.57 percent. A warning in the seed did not reliably reduce it. That is a measurement of how often the generated program tried to step outside the harness. It is not a measurement of an unbounded gain.

The paper cites I. J. Good, “Speculations Concerning the First Ultraintelligent Machine” (Advances in Computers, 1966), and Schmidhuber’s Gödel machine, as the older and broader idea. STOP is the narrower experiment.
