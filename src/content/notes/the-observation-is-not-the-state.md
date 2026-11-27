---
title: The observation is not the state
description: What the agent is shown is a view of the state. Hidden facts are still in the environment, and the agent does not have them.
topic: artificial-intelligence
maturity: budding
publishedAt: 2026-11-27
tags: [state, observation]
objectives:
  - Separate the state from the observation.
  - Say what a partial view forbids the agent to know.
---

The state is the environment's full description. The observation is the part of that description the agent is given. They coincide only in the small problems where you decided to hand everything over: the whole board, the whole file, the whole conversation. Most systems are not like that. A sensor is noisy. A tool returns a summary. A document was chunked. The agent acts on the view, and the world updates the state.

Treating the observation as the state is how a system becomes sure of something it was never shown. The missing page is not in the retrieved chunk. The error code was in the tool result and then dropped. The user's file is not in the prompt. From inside the observation, those facts are not uncertain. They are absent. A probability over the visible tokens does not restore them.

## What a partial view forces

A partial view forces the action to be chosen without the hidden part. Sometimes that is fine: the hidden part does not change the right action. Sometimes it is the whole task. A diagnosis from a lab result you do not have, a citation from a paper that was not retrieved, a file edit based on a path you have not listed. The honest output in those cases is a request for the missing observation, or a refusal. A fluent completion is a guess wearing the form of a report.

## What this does not say

More context is not the same as the full state. A longer prompt can still omit the fact that matters, and it can include a fact that is stale. The question to ask of any system is which parts of the state are in the observation, and which decisions are unsafe when they are not.
