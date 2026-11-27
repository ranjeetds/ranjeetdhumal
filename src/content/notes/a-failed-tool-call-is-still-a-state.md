---
title: A failed tool call is still a state
description: A failed call is the next observation. Replacing it with a plausible success continues the plan in a world that did not happen.
topic: agentic-ai
maturity: budding
publishedAt: 2026-11-27
tags: [tools, errors]
objectives:
  - Keep a failure visible to the next decision.
  - Refuse a narration that overwrites an error.
---

When a tool fails, the environment did not do the thing the call asked. The account was not found, the file was not written, the request timed out and you do not know which. That outcome is the next observation. The loop can retry, ask for a different argument, or stop. What it cannot honestly do is continue a plan whose later steps assume the call succeeded.

The failure mode is a narration layered on top. The tool result says unknown. The model's next message mentions the figure the plan expected. A reader of the message thinks the call worked. [The agent loop](/studio/agent-loop) shows this on purpose: the state and the commentary can disagree, and the disagreement is the bug. [The environment is what the action changes](/knowledge/the-environment-is-what-the-action-changes) is the same point one step earlier. The observation is the tool result, not the sentence that wished the result were better.

## What belongs in the observation

Put the error in the observation in the form the next decision can use: which call, which argument, which code, and whether a retry is safe. A raw page of logs hides the failure as thoroughly as a cheerful summary does. A single line that says the call failed, and that the plan's assumption is now false, is enough for the loop to stop spending further calls against a broken premise.

## What this does not say

Showing the error does not say what the recovery is. Some failures are permanent for this input. Some are worth one retry. The policy is yours. The note only insists that the policy see the failure, rather than a rewritten success.
