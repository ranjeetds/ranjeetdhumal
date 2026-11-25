---
title: Recursive self-improvement
description: Four published articles, and what each one actually changes. A proof, a research programme, a frozen model rewriting its scaffold, and a population of coding agents scored on benchmarks the authors chose.
field: improvement
order: 26
publishedAt: 2026-11-25
useWhen: You are reading a claim that a system improved itself, and you need the paper that the claim is borrowing from.
avoidWhen: You want a design for a product. None of these papers is a product pattern. The Gödel machine was not run. The later systems leave the model weights fixed.
check: Name the paper, the object it rewrote, the object it left fixed, and the number or theorem it reports. If you cannot name them, you are not reading the article.
diagram: improvement
---

The phrase covers four different articles. They do not report one phenomenon.

[Gödel machines](/research#godel-machines) (Schmidhuber, arXiv:cs/0309048, 2003) are a proof. The program may rewrite any part of itself, including the proof searcher, only after it has proved that the rewrite raises expected utility. The optimality claim is relative to that utility, those axioms, and the limits of proof. The paper does not contain a measured run.

[AI-generating algorithms](/research#ai-generating-algorithms) (Clune, arXiv:1905.10985, 2019) are a proposal. Learn the architecture, learn the learning rule, and generate the environments. No system in the paper does all three. The article’s job is to say which research was missing.

[Self-Taught Optimizer](/research#self-taught-optimizer) (Zelikman, Lorch, Mackey, and Kalai, arXiv:2310.02304, COLM 2024) is an experiment with a frozen model. GPT-4 rewrites the program that calls it. On a small set of algorithmic tasks the rewritten program scores higher than the seed. The authors write that this is not full recursive self-improvement, because the weights never change. In a check of 10,000 proposed rewrites, 0.42 percent of the GPT-4 proposals contained a string that would leave the sandbox.

[The Darwin Gödel Machine](/research#darwin-godel-machine) (Zhang, Hu, Lu, Lange, and Clune, arXiv:2505.22954, 2025) drops the proof and keeps an archive. Coding agents rewrite their own scaffolding. A frozen pretrained model stays frozen. The authors report SWE-bench moving from 20.0 percent to 50.0 percent, and the full Polyglot benchmark from 14.2 percent to 30.7 percent. Removing the archive drops the SWE-bench figure to 23.0 percent. The benchmark, the sandbox, and the decision to stop at 80 iterations are outside the code the agent rewrites.

I. J. Good’s “Speculations Concerning the First Ultraintelligent Machine” (Advances in Computers, 1966) is the essay the STOP paper cites for the older idea of a machine that improves the machine that builds the next one. It is a speculation. It is not one of the measurements above.

## The move

Read the article for four objects, in its words. What was rewritten: a proof-bearing program, a scaffold, or an agent’s tools. What was not rewritten: the utility function, the model weights, or the benchmark. What the article counts as success: a theorem, or a percentage on a named test. What the article itself says the result is not. Schmidhuber does not report a run. STOP says the model is unchanged. The Darwin Gödel Machine says it did not train a new foundation model.

A rising score on a test the proposer can edit is not the result any of these papers claim. STOP keeps the model fixed and reports how often a proposal tried to leave the sandbox. The Darwin Gödel Machine keeps the model fixed, scores agents on benchmarks the authors chose, and says the edits it inspected stayed on those benchmarks.

## What this stops

Using “recursive self-improvement” as one result. A proof that a rewrite is globally optimal relative to a utility is not a 30-point gain on a coding benchmark, and that gain is not an update of the model’s weights. Quote the article you mean. The other three will not support the sentence.
