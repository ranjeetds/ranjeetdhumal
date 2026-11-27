---
title: The environment is what the action changes
description: The environment is not the prompt. It is the part of the world an action can alter, including the next thing the agent sees.
topic: artificial-intelligence
maturity: budding
publishedAt: 2026-11-27
tags: [agents, environment]
objectives:
  - Name what an action is allowed to change.
  - Tell a change of text from a change of state.
---

The environment is the thing the action affects. In a game it is the board. In a file tool it is the filesystem. In a chat window that only displays text, the environment is the conversation, and the only action is to append more text. Those are different environments, and a system that is competent in one is not thereby competent in the other.

Most of the confusion around "agents" comes from sliding between these. A model that writes "I have deleted the file" has changed the conversation. It has deleted the file only if some other program took that sentence as an instruction and ran it. The environment of the model and the environment of the product are not the same object.

## What the next observation contains

After an action, the environment returns the next observation. That return is the only news the agent gets. If the tool says the file is gone, the observation is that message, not the disk. If the tool lies, or returns an error the loop ignores, the agent is now acting on a description that has come apart from the state.

This is why a failed call still matters. The failure is the next observation. A loop that replaces it with a plausible success has changed the environment the rest of the plan will see, without changing the world.

## What this does not say

Drawing a box labelled "environment" does not specify the interface. You still have to say which actions exist, which of them are reversible, and which facts come back in the observation. A product that hides those three is asking you to trust a map you have not been shown.
