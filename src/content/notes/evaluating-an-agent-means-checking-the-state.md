---
title: Evaluating an agent means checking the resulting state
description: An agent evaluation is a set of assertions about the system after the loop stops. A grade of the final message answers a different question.
topic: agentic-ai
maturity: budding
publishedAt: 2026-11-27
tags: [evaluation, agents]
objectives:
  - Write an agent test as assertions on state.
  - Keep a separate check for what the user was told.
---

To evaluate an agent, write down the state you want after the loop stops, run the loop from a known start, and check that state. The calendar has the event, or it does not. The draft is unsent, or it is not. The tool that should have been refused does not appear in the log. Those are assertions. A score on the final message is a different test: it measures what was said. Both can matter. They are not interchangeable, because a message can describe an action the log does not contain.

[What agent benchmarks miss](/research#what-agent-benchmarks-miss) is this split on one call in the studio. The research note grades commentary against state. This note is the practice that follows from it. Build the fixture so the start state is explicit, the tools are the real tools or a double that records effects, and the assertions do not read the model's prose. Then, if the prose matters, add a second assertion that reads the prose.

## What a single run is worth

One run is one sample from the decode policy and from any tool that is not deterministic. A failure found once is a real failure of that path. A pass found once is a pass of that path. If the product samples, look at several runs before you treat the assertion as stable. [A transcript can describe an action that did not happen](/knowledge/a-transcript-can-describe-an-action-that-did-not-happen) is why the assertion reads the log even when every run's prose looks fine.

## What this does not say

A suite of state assertions is not a measure of usefulness, taste, or whether a person liked the help. Those are separate observations, and they need their own record. The assertions answer a narrower question, which is the one a loop is in a position to get dangerously wrong: did the permitted actions leave the system in the state you named?
