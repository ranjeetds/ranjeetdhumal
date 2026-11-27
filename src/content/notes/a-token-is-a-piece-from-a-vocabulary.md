---
title: A token is a piece from a vocabulary
description: A token is one entry in a fixed vocabulary. The model sees the entry's id, not the letters you think the word has.
topic: generative-ai
maturity: budding
publishedAt: 2026-11-27
tags: [tokens, vocabulary]
objectives:
  - Treat a token as an id from a fixed list.
  - Say what a different cut of the same string changes.
---

A token is a piece the vocabulary lists, and the vocabulary is fixed before any prompt arrives. The model does not receive the characters you typed. It receives a sequence of ids. A common word may be one id. A rare word, a name, or a string of digits may be several. The cut is a property of the vocabulary, not of the spelling.

[Large language models](/knowledge/large-language-models) starts from this fact and then moves to the distribution over the next id. The piece worth isolating is the cut itself. Two prompts that look the same to a reader can be different sequences if a space, a capital, or a hyphen falls on a different boundary. The distribution is a function of the sequence. A theory of why the model "misread" the word is premature until you have looked at the ids.

## What the vocabulary decided

The vocabulary was built to keep sequences short and to cover the training text. It was not built to match stems, syllables, or the units a task considers atomic. A number split into digits is a different object from a number kept whole: the model has to assemble the value from pieces, and a comparison or a sum can fail at the joint. [Tokenization](/studio/tokenization) shows one string cut two ways, on a designed vocabulary, so the joint is visible. [Tokens are a choice](/guides/tokens-are-a-choice) is the same decision written as a guide.

## What this does not say

Knowing the cut does not tell you which continuation is likely. It tells you which object the rest of the network was given. If a failure survives a retokenization that keeps the same characters in one id, the cut was not the cause. If the failure appears only when the word is split, start there, before inventing a gap in the model's knowledge.
