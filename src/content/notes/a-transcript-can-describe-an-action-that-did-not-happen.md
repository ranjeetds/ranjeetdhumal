---
title: A transcript can describe an action that did not happen
description: The transcript is text. An action is a call that changed something. The text can assert either without the call.
topic: agentic-ai
maturity: budding
publishedAt: 2026-11-27
tags: [transcripts, evaluation]
objectives:
  - Separate the transcript from the call log.
  - Grade the log when the question is what happened.
---

A transcript is the text the people and the model exchanged, plus whatever tool text you chose to splice in. It can include the sentence "I have sent the invoice" whether or not a send occurred. It can omit a call that did occur, if your program logged the call somewhere else and never copied it into the thread. Reading the transcript as a record of actions confuses a narration with a log.

The log is the list of calls: name, arguments, time, return value, and, where you have it, the state afterward. [The result state is what to check](/knowledge/the-result-state-is-what-to-check) is the third of those. This note is about the first gap, which appears earlier: a reviewer who only has the transcript cannot see the gap at all. Build the review so the log is on the same page as the prose. The [agent loop](/studio/agent-loop) is that page for one invented call.

## What the prose is still good for

The prose is the right record of what a person was told. A harmful or misleading sentence is a real outcome even when no tool ran. Grade that outcome against the transcript. Grade the side effect against the log. Using one record for both questions will clear a system that said the right thing and did the wrong one, or the reverse.

## What this does not say

Keeping a log does not make the log complete. A call made by a library you did not instrument will be missing, and the transcript will not confess it. The log is complete only for the calls you wrapped. An action outside those wrappers is invisible to both records, which is a reason to keep the wrappers on the path that actually runs.
