---
title: The Darwin Gödel Machine
description: Zhang, Hu, Lu, Lange, and Clune, 2025. Coding agents rewrite their own scaffolding, keep an archive, and are scored on frozen benchmarks. The foundation model is not trained.
tags: [self-improvement, agents, open-endedness]
draft: false
kind: paper-note
stage: posted
publishedAt: 2026-11-25
authors: [Jenny Zhang, Shengran Hu, Cong Lu, Robert Lange, Jeff Clune]
source: https://arxiv.org/abs/2505.22954
---

Jenny Zhang, Shengran Hu, Cong Lu, Robert Lange, and Jeff Clune, “Darwin Gödel Machine: Open-Ended Evolution of Self-Improving Agents,” arXiv:2505.22954, 2025.

The paper starts from Schmidhuber’s Gödel machine and drops the proof. A change is kept when a coding benchmark says the new agent is better, not when a proof says so. The search also keeps an archive of earlier agents and samples parents from that archive, which the authors take from open-ended evolutionary search rather than from always continuing the single latest agent. The agent that is rewritten is a coding agent around a frozen pretrained model. The paper says the framework could in principle rewrite a training script for a new foundation model, and then says they do not do that. The experiments change the coding agent’s own code, which the authors describe as its tool use and its workflows.

On the runs they report, performance on SWE-bench moves from 20.0 percent to 50.0 percent, and on the full Polyglot benchmark from 14.2 percent to 30.7 percent, over 80 iterations. Two ablations are part of the result. Without the archive, SWE-bench reaches 23.0 percent. Without self-improvement, using the original agent to write new agents, it reaches 39.0 percent. The archive condition is the one that reaches 50.0 percent. Agents were run in sandboxes, with time limits, and the authors say the self-modifications they inspected were about the coding benchmarks.

What the numbers do not say: the model’s weights were not the object being improved, and the benchmarks were chosen by the authors. A gain on SWE-bench is a gain on SWE-bench. The paper compares the best discovered agent with hand-written coding agents and treats that comparison as evidence about this search, not as a proof that a closed loop improves without bound.
