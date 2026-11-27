---
title: An agent maps observations to actions
description: An agent is anything that turns what it can see into something it does. The mechanism is a separate question.
topic: artificial-intelligence
maturity: budding
publishedAt: 2026-11-27
tags: [agents, actions]
objectives:
  - Say what an agent is without naming a model.
  - Separate the role from the procedure that fills it.
---

An agent is a map from observations to actions. The environment is whatever those actions change, including the next observation. A thermostat qualifies. A chess program qualifies. A language model that only returns text qualifies only for the part of the world that text can change.

The thinness is the point. Once the definition requires a transformer, or a plan, or a memory, every simpler system falls out of the subject and the word "agent" becomes a product name. The interesting differences are in what can be observed, what an action is allowed to touch, and how the next observation is produced.

## The role and the procedure

Search, a table of rules, and a learned function are three procedures for the same role. Each one, given a situation, picks an action. Learning is the procedure you reach for when the situations are too varied to write down. It does not change the role. A learned policy can still be a bad map from the observations it receives to the actions the environment will actually accept.

The [agent loop](/studio/agent-loop) is this map slowed down: a state, a decision, a tool call, and the state that comes back. The sentence in a transcript is not the action. The action is the call that changed something, or the decision to stop.

## What this does not say

Calling a system an agent does not say that it has a goal you would recognise, or that it checks its own work. It says that something in the system chooses an action from an observation. If you cannot name the observation and the action, you do not yet have an agent. You have a function whose inputs and outputs have not been specified.
