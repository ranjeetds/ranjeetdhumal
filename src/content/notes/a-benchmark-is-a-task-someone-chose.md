---
title: A benchmark is a task someone chose
description: A benchmark is a fixed set of inputs, a way to score outputs, and a choice about what counts as success. The choice is part of the result.
topic: emerging-tech
maturity: budding
publishedAt: 2026-11-27
tags: [benchmarks, evaluation]
objectives:
  - Describe a benchmark as a chosen task, not as the job itself.
  - Ask which behaviour the score cannot see.
---

A benchmark is a task someone assembled: inputs, reference outputs or a checker, and a metric. It is useful because it is fixed. Two systems can be compared. It is dangerous because the fixed task stands in for a job that is larger, messier, and not fixed. A system can be excellent at the benchmark and fail the job, if the job depends on a behaviour the metric does not charge for.

[A metric can rise while the behaviour gets worse](/knowledge/a-metric-can-rise-while-the-behaviour-gets-worse) is the same compression inside one table of labels. A benchmark adds a public audience and a training incentive. Once people train on the benchmark, or on data that looks like it, the score stops being a surprise sample and becomes a target. [A goal is not the signal](/knowledge/a-goal-is-not-the-signal) is that shift. The benchmark did not become invalid on the day it was published. It becomes a weaker stand-in as soon as the system is optimized for it.

## What to ask before quoting it

Ask what the inputs are, what the checker accepts, and which failures cost nothing. An agent benchmark that grades the final message does not grade the state the tools left behind. [What agent benchmarks miss](/research#what-agent-benchmarks-miss) is that specific gap. The general form is: the score is about the checker you have, not about the checker you wish the authors had written.

## What this does not say

Distrusting a benchmark is not a reason to trust an anecdote instead. A fixed task is still the right instrument when you say what it measures. Quote the score as a score on that task. Build a separate check for the behaviour the task leaves out, rather than asking the leaderboard to be the whole evaluation.
