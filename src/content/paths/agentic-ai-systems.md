---
title: Agentic AI Systems
description: An agent is a loop with permission to act. This path separates the model from the state, the tools, and the test.
tags: [agents]
draft: false
level: advanced
topics: [agentic-ai, generative-ai]
overview: >
  This path assumes you can already read a language model as a next-token
  distribution. It does not teach that again. It teaches the program around the
  model: the state the model is shown, the actions it is allowed to request, and
  the test that looks at what changed. The order is forced. A tool without a loop
  is a function call. A memory without a distinction from the transcript will be
  whatever the last message wanted. Evaluation comes last because the earlier
  modules define the state the test has to inspect. An agent that only sounds
  right has not been tested.
outcome: Design a small tool-using agent, name its failure modes, and test it on tasks where a wrong action is visible.
order: 3
modules:
  - title: The loop
    outcome: >
      You can draw one cycle as observe, decide, act, and read the result, and
      you can point at which of those steps is the model.
    concepts:
      - State and observation
      - A proposed action
      - The result fed back
    why: >
      The model is not the agent. It proposes the decision inside a cycle your
      program owns. Once that is drawn, context-window tricks stop looking like
      memory and start looking like a choice of what to put in the next
      observation. Most production failures are a bad observation, not a weak
      prose style.
    next: >
      The action in the cycle has to be a real operation. The next module makes
      that operation a tool with a schema and a refusal path.
  - title: Tools and the boundary of permission
    outcome: >
      You can specify a tool as a schema, separate the model's request from your
      code's execution, and name one action the schema must be able to reject.
    concepts:
      - Schemas as contracts
      - Execution outside the model
      - Refusal
    why: >
      A tool that can change the world will be asked to change it incorrectly.
      The schema is the only contract the model can be held to, and your code is
      the only place a refusal can actually happen. A prompt that says "be
      careful" is not a boundary. Two overlapping tools are a second, quieter
      failure, because the choice between them is then invisible.
    next: >
      Across cycles, facts have to live somewhere that is not the growing
      transcript. That is the next module.
  - title: Memory as state
    outcome: >
      You can distinguish the context window from stored state, and you can say
      who is allowed to write each fact the agent will later rely on.
    concepts:
      - The window is an observation
      - Stored state
      - Write permissions
    why: >
      Calling the transcript "memory" means a fact disappears when it scrolls
      out, and a fact can be rewritten by the next user message. State written
      by your code, from tool results, stays tied to something that happened.
      The difference is auditability. If you cannot point at the record, the
      agent does not remember.
    next: >
      Not every step should be a fresh reaction. The next module is when a plan
      helps and when it is overhead.
  - title: Planning and reacting
    outcome: >
      You can tell a task that needs a plan from a task that needs one careful
      action, and you can see how a stale plan becomes a liability.
    concepts:
      - A plan as provisional state
      - Replanning on new evidence
      - Overhead
    why: >
      A plan is useful when the actions interfere with each other and the cost
      of a wrong order is high. It is a liability when the world changes and the
      agent keeps executing steps whose premise has expired. Reacting is not the
      naive version of planning. For a single tool call with an obvious check,
      a plan is extra state to get wrong.
    next: >
      Every module so far defined a state. The last one scores that state,
      rather than the message the model wrote about it.
  - title: Tests on the resulting state
    outcome: >
      You can write a check that fails when the right sentence was produced and
      the wrong action was taken, and you can name what a message-level score
      cannot see.
    concepts:
      - State assertions
      - Hostile small tasks
      - What a transcript hides
    why: >
      Leaderboards that grade the final answer reward a description of the right
      action. An agent that deletes a file and then apologises will pass one of
      those and fail the only test that matters. The checks are small on purpose.
      The file is still there. The tool was called once. An error stopped the
      loop instead of being papered over.
    next: >
      The path ends when you can build one loop, restrict it, and catch it. A
      larger system is that loop with more state, not a different idea.
---
