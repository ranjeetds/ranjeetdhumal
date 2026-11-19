---
title: What agent benchmarks fail to measure
description: A planned question. Most agent scores reward a fluent trace. The open problem is how to score an action that changed something, including the actions that should not have been taken.
tags: [agents, evaluation]
draft: false
kind: open-question
stage: planned
publishedAt: 2026-11-19
authors: []
---

An agent benchmark usually scores the text a system produced at the end of a task. That score is easy to collect and weakly related to what an agent is. An agent is a loop that observes, proposes an action, and changes a state. The state is the object that should be scored: whether the file changed, whether the tool was called and called once, whether an error stopped the loop or was described away. A fluent apology after a destructive action will pass a transcript grader and fail a state assertion.

The open question is how to build those assertions so they are cheap enough to run on every change and strict enough that a system cannot satisfy them by narrating the right action. This entry does not propose a leaderboard and does not report a comparison. It argues that a score which never inspects the resulting state is measuring a different system from the one that was deployed, and that the difference is large enough to make the score the wrong instrument.
