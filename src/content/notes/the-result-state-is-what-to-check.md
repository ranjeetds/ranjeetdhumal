---
title: The result state is what to check
description: "After a call, three records exist: the arguments, the return value, and the state of the system. The third one is the result."
topic: agentic-ai
maturity: budding
publishedAt: 2026-11-27
tags: [evaluation, state]
objectives:
  - Name the three records a call leaves behind.
  - Grade the state, not the narration of the state.
---

A call leaves three different records. The arguments are what the loop asked for. The return value is what the tool said back. The result state is the system afterward: the row, the file, the calendar, the unsent draft. Grading the first record checks that the proposal was well formed. Grading the second checks that the tool answered. Grading the third checks that the action happened.

[Agentic AI systems](/knowledge/agentic-systems) puts the test on the state. The distinction worth adding is that the return value can be a story about the state. A tool that answers with a summary has already compressed the result. If the summary is wrong, or partial, a grader that reads the summary is grading the tool's prose. Read the system. If the system is far away, read a second call whose only job is to fetch the row you meant to change.

## A small assertion

The assertion is a sentence about the system, written before the run: this row's status is paid, this file still exists, this message was not sent. The [agent loop](/studio/agent-loop) makes one version of the gap obvious, because the commentary and the state are on the same screen. The same gap exists when the state is a database you did not open.

## What this does not say

Checking the state does not tell you the call was the best available call. It tells you whether the call you allowed had the effect you think it had. A correct effect from a reckless call is still a reckless call. The permission sits in front of the check, not inside it.
