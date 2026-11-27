---
title: Uncertainty is weight on alternatives
description: A probability is weight you assign before the outcome, over alternatives that add to one. Preference is not that weight.
topic: artificial-intelligence
maturity: budding
publishedAt: 2026-11-27
tags: [probability, uncertainty]
objectives:
  - Separate a preferred answer from a probability.
  - Say what has to be true before a score is a chance.
---

Most environments do not return one next state. Sensors are noisy, other people are unpredictable, and the data you trained on is a sample. Probability is the language for that. It is weight assigned to alternatives, with the rule that the weights over a complete set add to one. A system that cannot say how unsure it is will take the same action on a clear case and on a guess.

A model that emits a number between zero and one has not yet made that assignment. A softmax adds to one because of the way it is computed. Adding to one is necessary and not sufficient. The number is a probability you should act on only if, among the cases scored near that number, the event happens about that often. That check is calibration. Without it, the number is a score in a costume.

## Preference and chance

"The model prefers this answer" and "the world is likely to agree" are different sentences. The first is a fact about the distribution the model just produced. The second is a fact about outcomes you have not seen. Temperature, top-k, and a confident phrase change the first. They do not create the second. [Binary entropy](/studio/entropy) is how much a single coin with a stated chance still leaves undecided. [Calibration](/guides/calibration) is the check that the stated chance matches the frequency.

## What this does not say

Demanding a probability does not mean every answer should be hedged. Some questions have a value you can compute, and the honest output is the value. Uncertainty is for the cases where more than one outcome is still open. Inventing a percentage for a fact you could have looked up is the same error as inventing the fact.
