---
title: Some actions cannot be undone
description: An irreversible action spends an option. A system that treats every call as reversible will spend options it cannot buy back.
topic: artificial-intelligence
maturity: budding
publishedAt: 2026-11-27
tags: [actions, safety]
objectives:
  - Classify an action as reversible or not before it runs.
  - Say why a transcript is a poor record of an irreversible step.
---

Some actions can be undone. You move a piece and you can move it back. You draft a sentence and you can delete it. Some actions cannot. You send the message, pay the invoice, delete the file, overwrite the branch, or tell a person something you cannot unsay. The difference is not a mood about caution. It is a fact about the environment: after the action, is the previous state still reachable?

A system that does not mark this difference will spend irreversible actions at the same threshold it uses for drafts. The cost of being wrong is not in the loss. The cost is in the environment, and it arrives after the call. Looking ahead helps only if the look-ahead includes the actions you cannot take back, and only if the loop is willing to stop instead of taking them.

## What the record shows

A transcript written after the fact can describe an irreversible action that did not happen, and it can omit one that did. The record that matters is the state: the sent message, the empty directory, the charge. [Agentic AI systems](/knowledge/agentic-systems) makes this the evaluation question. A polite summary is not evidence that the dangerous call was skipped, and it is not evidence that the required call was made.

## What this does not say

Marking an action irreversible does not forbid it. It changes the condition under which it may run. A person confirms it, a rule matches an exact case, or the environment itself refuses it. The mistake is to let a fluent proposal cross that line because the proposal sounded sure.
