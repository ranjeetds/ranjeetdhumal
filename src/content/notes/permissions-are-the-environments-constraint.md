---
title: Permissions are the environment's constraint
description: A permission is a limit on which calls exist. A call the environment will not run is an action the agent does not have.
topic: agentic-ai
maturity: budding
publishedAt: 2026-11-27
tags: [permissions, tools]
objectives:
  - Put a hard limit in the set of available calls.
  - Treat a prompt instruction as weaker than a missing tool.
---

The environment defines the actions. If the program does not expose a delete tool, the agent cannot delete, however the proposal is worded. If the program exposes a shell, the agent has every action the shell has, and a sentence in the prompt is not a fence around it. Permissions are this boundary stated as a constraint the environment enforces: which calls exist, which arguments are in range, which users may trigger them.

[Rules still solve the small case](/knowledge/rules-still-solve-the-small-case) is the general preference for a written constraint over a learned one. A permission is that preference applied to tools. The check runs in the program, on the call, before the effect. A refusal written by the model is a continuation. It does not bind the next continuation.

## What to narrow

Narrow the tool to the case, not the model to the tool. A deployment that needs to read one table should be given a tool that reads that table, not a tool that accepts a query. The schema then cannot express the action you wanted to forbid, which is a stronger state than a policy that hopes the model will not ask. [Workflows and agents](/guides/workflows-and-agents) separates a fixed workflow, where the calls are chosen in advance, from a loop that chooses them. Permissions are what remain when you do let the loop choose.

## What this does not say

A narrow tool can still be called at the wrong time, with a permitted argument that happens to be the wrong row. The permission removes actions. It does not choose among the actions that remain. That choice still needs the observation, the stop condition, and a check on the resulting state.
