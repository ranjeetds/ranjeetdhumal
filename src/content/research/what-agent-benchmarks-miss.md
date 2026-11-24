---
title: What agent benchmarks fail to measure
description: A transcript can praise an action the state does not contain. The open problem is a check that reads the state, including the action that should not have been taken.
tags: [agents, evaluation]
draft: false
kind: open-question
stage: posted
publishedAt: 2026-11-24
authors: []
---

An agent benchmark usually scores the text at the end of a task. That score is easy to collect. It is weakly related to what an agent is. An agent observes, proposes an action, and changes a state. The state is the object that should be scored: whether the record changed, whether the tool was called once, whether an error stopped the loop or was described away.

The [agent loop](/studio/agent-loop) is that split on one call. The question asks for the balance of account 14. The schema accepts `get_balance`. If the tool fails, the state says the account is unknown. The commentary can still mention the number 40. A grader that reads the commentary passes. A grader that reads the state fails. They are not disagreeing about quality. They are grading different systems.

The open question is how to build those state checks so they are cheap enough to run on every change and strict enough that a system cannot satisfy them by narrating the right action. This note does not propose a leaderboard and does not report a comparison of agents. It argues that a score which never inspects the resulting state is measuring a chatbot that was allowed to talk about tools, which is a different system from the one that was deployed.
