---
title: Stopping is part of the policy
description: A loop that cannot stop will spend another call. The decision to halt is an action, and it needs a condition.
topic: agentic-ai
maturity: budding
publishedAt: 2026-11-27
tags: [agents, stopping]
objectives:
  - Treat a halt as an action the policy can choose.
  - Give the halt a condition you can check.
---

A loop chooses an action, and one of the actions is to stop. Without that action, every step ends in another call, another model turn, or another retry. The budget runs out somewhere — a timeout, a bill, a person closing the tab — which is a stop the policy did not choose. Chosen stops are better because they can depend on the state: the row is updated, the tool failed in a way you will not retry, the same call has already been proposed twice, the user asked a question you cannot answer from the observation.

The condition should be checkable without the model's cooperation. "Stop when you are done" is a sentence in the prefix. The model can say it is done while a call is still outstanding, or keep going after the state already matches the goal. A condition on the state, or on a count of steps, fires even when the narration wants another turn.

## What the model may still propose

The model can propose a stop, and that proposal is useful. It is not the stop. The program stops when its condition holds, or when it accepts the proposal after checking the condition. [The model proposes; the product decides](/knowledge/the-model-proposes-the-product-decides) covers the authority. Here the authority is over the halt, which is easy to forget because a halt looks like the absence of an action.

## What this does not say

A tight stop condition is not an excuse for a loop that quits before the observation is in. Stopping on the first error may be right for an irreversible tool and wrong for a read that can be retried. Write the condition next to the tool it governs. A single global "maximum steps" is a backstop, not the policy.
