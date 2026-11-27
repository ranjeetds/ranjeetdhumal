---
title: An agent observes, then decides, then acts
description: The order is the mechanism. A decision made on a stale observation is a decision about the wrong state.
topic: agentic-ai
maturity: budding
publishedAt: 2026-11-27
tags: [agents, loops]
objectives:
  - Keep observation, decision, and action in that order.
  - Say what goes wrong when the action uses an observation that has since changed.
---

The useful order is strict. The loop reads an observation, then chooses an action, then performs it, then reads again. [Agentic AI systems](/knowledge/agentic-systems) names the four stages and puts the model in the second. The order is doing work the names do not: the action is only justified by the observation that preceded it. If the world moves between the read and the act, the justification has expired.

A loop that acts on a plan written three steps ago, without reading the state those steps produced, has collapsed the order. The plan was a decision about an old observation. The file may already be gone. The row may already be updated. The next call is then a guess that happens to be written in the imperative.

## Where loops skip a read

The skip is tempting because the model just said what it would do next, and calling the tool feels like following through. Following through is correct only when nothing relevant could have changed, or when the call itself re-reads. A tool that returns the current row is a read. A tool that writes, based on a value remembered from earlier in the transcript, is a write against a memory. [The agent loop](/studio/agent-loop) pauses between those so you can see which one you are about to run.

## What this does not say

Insisting on the order does not make the observation complete. A fresh read of the wrong fields is still the wrong observation, which is the subject of [the observation is not the state](/knowledge/the-observation-is-not-the-state). The order stops one failure: acting as if a decision were still about the world in front of you.
