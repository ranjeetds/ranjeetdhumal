---
title: Temperature changes the draw
description: Temperature divides the scores before the softmax. It changes which token the sampler is willing to pick, and it leaves the weights alone.
topic: generative-ai
maturity: budding
publishedAt: 2026-11-27
tags: [sampling, temperature]
objectives:
  - Describe temperature as a scale on the scores.
  - Separate that scale from the model's weights.
---

Temperature is a positive number you divide the scores by before the softmax. Divide by a number below one and the gaps between scores grow, so the largest score takes almost all the probability. Divide by a number above one and the gaps shrink, so tokens that were unlikely stay in the draw. The ordering of the scores does not change. The tallest bar stays the tallest bar. What changes is how much mass the shorter bars keep.

The weights are untouched. A temperature is a choice of the sampler, stored next to the model, not inside it. Two products with the same weights and different temperatures are sampling different distributions from the same scores. [Large language models](/knowledge/large-language-models) names this in passing. The point of isolating it is that a "more creative" setting and a "more accurate" setting are often the same model with a different divisor.

## What the draw can still do

A low temperature does not make the tallest token true. It makes the sample more likely to be the tallest token, including when that token is a fluent falsehood. A high temperature does not explore the model's knowledge. It draws from a flatter version of the same scores, so the sample wanders among continuations the model already considered dull. [Sampling is not knowledge](/guides/sampling-is-not-knowledge) is the guide. [Next-token distribution](/studio/next-token) is a small distribution you can flatten by hand.

## What this does not say

Temperature is not a measure of confidence you can quote to a user. The model was not asked how sure it is. You rescaled its scores. If you need a chance you can act on, you need a calibration check against outcomes, which is a different object from this divisor.
