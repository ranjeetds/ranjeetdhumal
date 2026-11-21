---
title: Workflows and agents
description: A workflow is a path you wrote. An agent is a loop in which the model chooses the next step. Most tasks want the path.
field: agents
order: 22
publishedAt: 2026-11-21
useWhen: The number of steps depends on the input, and you can check the resulting state after each step.
avoidWhen: The task decomposes into a fixed sequence. Write the sequence. A loop that rediscovers it is an extra way to drift.
check: Name the steps you could have written down. If you can name them, the system you want is a workflow.
diagram: workflow
---

An agentic system is a model allowed to affect a state, inside a program that observes the result. Inside that description there is a split worth keeping. A workflow is a path through model calls and tools that your code chooses: first this, then that, and a check between them. An agent is a loop in which the model chooses the next call, including the choice to stop. The words get used for both. The cost is not the same.

Anthropic's essay on building effective agents draws this split from production work and recommends the simplest system that meets the need. The patterns they name are worth having as a menu, in this notebook's terms.

A chain is a fixed sequence of calls, each one an easier task than the whole, with a gate your code can reject. Routing classifies the input and sends it down one of several prepared paths. Parallel calls split independent pieces, or repeat one piece and combine the votes. An orchestrator lets a model invent the subtasks and then hires other calls to do them. An evaluator-optimizer pair writes, critiques, and revises, which pays when you can say what better means. An autonomous loop is the last of these, and it is the one that compounds cost and error.

## The move

List the task's steps as if you were writing a runbook. Where the list is stable, code the list. Use a model inside a step whose input is messy text and whose output you can check. Where the list genuinely depends on what the previous step found — a repair whose files you cannot name in advance, a search that must decide whether to continue — consider a loop, and give it a maximum number of steps, a tool list shorter than the task, and a state you can assert on.

The [agent essay](/knowledge/agentic-systems) is the loop itself: observe, propose, act, record. This guide is the decision that comes before building the loop. A fluent trace is not one of the checks. The state is.

## What this stops

A framework that invites every feature to be an autonomous agent. Frameworks remove boilerplate and hide the call. Prefer to see the call. Add a pattern from the menu when a measured failure, on a state you care about, requires it.
