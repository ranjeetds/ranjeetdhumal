---
title: Sampling is not knowledge
description: A language model offers a distribution over the next token. The sentence in a product is one draw, or a chain of draws. Fluency is a property of the draw.
field: generative
order: 18
publishedAt: 2026-11-21
useWhen: You are choosing a temperature, a decoder, or a way to judge a paragraph the model just produced.
avoidWhen: You need a calculation with a checkable result, and a sample is the wrong object to check.
check: Draw several continuations at the same prompt. If they disagree on a fact, the distribution had more than one answer.
figure: next-token
---

Given the tokens so far, the model assigns a probability to every token that could come next. A decoder turns that distribution into one token, appends it, and repeats. Greedy decoding takes the top token every time. A higher temperature flattens the distribution so less likely tokens are drawn more often. A nucleus or top-k rule throws away the tail and renormalizes. Each of these is a choice about which sample you are willing to show. None of them adds a fact the distribution did not have.

A confident sentence can be a low-temperature sample from a peaked distribution, including a peaked distribution over a false continuation. The peak is a property of the model and the prompt. Agreement with the world is a different property, checked elsewhere.

## The move

Separate the distribution from the draw in anything you evaluate. If you care which answer the model prefers, look at the probabilities, or at the ranking of a fixed set of candidates. If you care what a user will see, sample the way the product samples, more than once, and report the spread. The [next token](/studio/next-token) figure is a designed distribution so you can watch temperature move the bars without confusing it with a trained model.

Instruction tuning and preference training change which distributions you get. They do not replace the loop. The product sentence is still a sample from whatever distribution those procedures left behind.

## What this stops

A single fluent answer used as evidence that the model "knows." Ask for the draw again. Disagreement is information about the distribution. Agreement is still not a citation.
