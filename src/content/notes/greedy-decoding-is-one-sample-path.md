---
title: Greedy decoding is one sample path
description: Greedy decoding always appends the token with the highest score. The path can lock in an early choice that a different policy would have left behind.
topic: generative-ai
maturity: budding
publishedAt: 2026-11-27
tags: [decoding, sampling]
objectives:
  - Define greedy decoding as one policy on a distribution.
  - Say what an early choice commits the rest of the sequence to.
---

At each step the model offers a distribution over the next token. Greedy decoding appends the token with the highest score and continues. The path is a single sequence. There is no second candidate, and there is no way back, because the next distribution is conditioned on the token you already appended.

That policy is cheap and repeatable. It is also brittle in a specific way. The token that was best at step three can force a corner by step six, where every continuation is bad, even though a slightly worse token at step three would have left a better corner. The model did not "change its mind." The distribution at step six is a different function, of a different prefix. Greedy never scored the prefix it did not take.

## Other policies, same scores

A random sample draws instead of taking the max. A beam keeps several prefixes and extends those. Both spend more, and both can still prefer a fluent dead end if the score they rank by is the model's own score. The policy is not a new model. [Large language models](/knowledge/large-language-models) separates the distribution from the policy in one paragraph. Use this note when a comparison of "the model" is actually a comparison of two ways of walking the same scores.

[Search spends look-ahead](/knowledge/search-spends-look-ahead) is the general version: beam search is look-ahead with the model's score as the test.

## What this does not say

Greedy decoding is not the model's preferred answer in any deeper sense. It is the first token, repeated. A product that shows only that path is hiding the rest of the distribution. If the second token was close, the path you showed was one sample from a nearly tied pair, and another run of a sampler would have diverged.
