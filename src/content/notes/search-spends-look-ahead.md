---
title: Search spends look-ahead
description: Search finds an action by trying moves ahead of time. The algorithms differ in the order they spend that budget.
topic: artificial-intelligence
maturity: budding
publishedAt: 2026-11-27
tags: [search, planning]
objectives:
  - Say what a search problem is made of.
  - Tell the order of the search from the kind of problem.
---

Search is what you do when the right action can be found by looking ahead. You have a state, a set of moves, and a test for a goal or a score. Breadth-first, depth-first, and A* differ in the order they spend that look-ahead. They do not differ in the kind of question they answer. Each extra step multiplies the states you might have to visit, which is why the branching of the moves is the budget.

A procedure that looks one move ahead and a procedure that looks ten are solving the same problem at different prices. The cheap one misses goals that sit deeper than its horizon. The expensive one can be correct and still too slow to use. "Optimal" is a claim about the order and the test, not a claim that the search finished.

## Where search still is

Learning did not retire this. A language model produces one piece at a time. Choosing the next piece greedily, or drawing from the distribution, or keeping several candidates, is a search over the sequence, with the model as the score. A planner around a tool-using system searches over calls. The model scores. The search enumerates. Mixing those two jobs up makes it sound as if the model itself looked ahead, when a separate procedure did the looking.

## What this does not say

Search does not create a goal. It spends effort against a test you already wrote. If the test is the wrong test — a short reply, a flattering metric, a tool that returns success for the wrong reason — the search will find an action that passes it. The look-ahead was real. The target was the mistake.
