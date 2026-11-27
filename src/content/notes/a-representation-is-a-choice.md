---
title: A representation is a choice
description: A representation is what you decide to write down. It makes some operations cheap and erases some distinctions.
topic: artificial-intelligence
maturity: budding
publishedAt: 2026-11-27
tags: [representation]
objectives:
  - Treat a tokenizer, a feature, and an embedding as the same kind of decision.
  - Ask which distinction the representation deleted.
---

A representation is a choice of what to write down. The same chess position can be a list of piece coordinates, a bitmap, or a paragraph. Those are not equally useful. A useful representation makes the operation you care about cheap and keeps the distinctions the task depends on. A poor one forces every later step to rediscover structure you could have handed it, or makes that structure unrecoverable.

This is the quiet half of feature engineering, of tokenizers, and of embeddings. Each one decides which objects the rest of the system will treat as atomic. A word cut and a subword cut of the same string are different representations. A one-hot feature and a learned direction are different representations. The arithmetic downstream cannot see the choice. It can only use what survived it.

## What gets erased

When a model fails on a task that looks easy to a person, the first question is whether the representation erased the distinction the task needs. A bag of word counts cannot carry order. A fixed-length vector of a long document cannot carry every sentence. An image resized past recognition cannot carry the mark you wanted read. The failure looks like a reasoning failure. It is often an earlier decision about what was worth writing down.

[Embeddings and representation learning](/knowledge/embeddings-and-representation) is this choice once the objects are directions. The [tokenization](/studio/tokenization) figure is the same choice on one string, cut two ways.

## What this does not say

A richer representation is not automatically a better one. Extra detail costs memory, and it can hand the model a shortcut that will not be there later. The question is which distinctions the task needs, and whether those distinctions are still in the object the model receives.
