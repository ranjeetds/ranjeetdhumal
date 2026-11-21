---
title: Tokens are a choice
description: The model sees integers from a fixed vocabulary. A word can be one integer or several, and the split is part of the model.
field: generative
order: 16
publishedAt: 2026-11-21
useWhen: A language model mishandles spelling, numbers, or a phrase that looks obvious in the string you typed.
avoidWhen: You are working with a model whose inputs are already pixels, audio frames, or a fixed set of symbols you defined.
check: Print the token ids of the failing string, including spaces and the newline.
figure: tokenization
---

A tokenizer is a function from text to a sequence of integers, fit to a corpus so that frequent strings stay short. The model never receives the characters you see. It receives those integers, and its first layer looks up a vector for each one. Two spellings, a leading space, and a word broken into pieces are different sequences, and the model has no rule that they must mean the same thing.

Arithmetic that works for a small numeral and fails for a larger one is often this split. A name that is one token is a single lookup. A name that is five tokens has to be assembled by attention. A prompt that changes meaning when you add a blank line has changed the sequence, not merely the formatting.

## The move

When a failure depends on the surface form, tokenize the input and look. The [tokenization](/studio/tokenization) figure is that look, slowed down. Count the pieces of the number, the word, and the punctuation separately. If the bug disappears when you force a different split — a space, a hyphen, a digit grouping — you have located the failure in the vocabulary rather than in the "reasoning" people will want to attribute to the model.

Treat the vocabulary as a modelling choice with consequences. Adding a domain term as a single token is a claim that the term should be atomic. Leaving it to be smashed into pieces is a claim that the pieces, plus context, are enough. Either claim can be wrong, and you can only see which by looking at the ids.

## What this stops

Debugging the prompt's wording for an hour when the string the model received is a different object from the string on the screen. The ids are the input. The screen is a rendering.
