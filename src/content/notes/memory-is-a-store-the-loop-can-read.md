---
title: Memory is a store the loop can read
description: Memory is state the program wrote down and may show to a later step. A long transcript is not that store.
topic: agentic-ai
maturity: budding
publishedAt: 2026-11-27
tags: [memory, state]
objectives:
  - Define memory as a store with a writer and a reader.
  - Say what a later message must not be allowed to rewrite.
---

Memory is a store. Something writes a fact because an event happened — a tool returned it, a person confirmed it, a row was read — and a later step can read it back. The writer should be the program, at a point where the fact is known. The reader is whatever builds the next observation. A scrollback of every message is a log. It becomes memory only where you decided that a line in it is still true.

[Agentic AI systems](/knowledge/agentic-systems) draws the line: memory is state your code wrote, and a later message must not silently rewrite it. The practical version is a list of fields. Which fields exist, who may write them, and which writer wins when they disagree. A user's correction of their own preference can overwrite a preference. A user's claim about a balance cannot overwrite the tool that just read the balance. Those are different fields.

## What gets shown

The store can be larger than the observation. Showing the whole store on every turn packs the window and mixes stale notes with the current row. Showing nothing forces the model to guess. The selection is the observation, and [the observation is not the state](/knowledge/the-observation-is-not-the-state) still applies: a note you forgot to include is not uncertain, it is absent.

## What this does not say

Adding a database does not give the loop a memory of "everything important." It gives the loop the fields you defined. A fact you never wrote down is not remembered, however long the transcript feels. If you cannot name the field, you do not have the memory yet.
