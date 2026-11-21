---
title: The tool is the interface
description: A tool is an action with a schema. The model proposes a call. Your code performs it or refuses it. The schema is the part worth designing.
field: agents
order: 23
publishedAt: 2026-11-21
useWhen: A model must cause something outside the conversation, and you can name the action precisely.
avoidWhen: The model only needs to read text you already placed in the prompt. A tool that returns that text is ceremony.
check: Hand the schema to a person who has not seen the prompt. They should be able to call the tool correctly, and unable to express the action you forbid.
diagram: tool
---

The model does not run a tool. It emits a structured request. Your program checks the request against a schema, runs it, and puts the result back into the next observation. A sentence in the prompt that says "be careful" is not part of that chain. The schema is. If an argument is optional in the schema and required in practice, the model will omit it. If two tools overlap, the choice between them is invisible and a test that checks "a tool was called" will pass either way.

Anthropic's note on tool design makes a practical observation: some formats are much harder for a model to write than others. A diff header that must count lines, or source code escaped inside JSON, spends attention on bookkeeping. A format close to ordinary text, with room to think before committing, fails less often. Absolute paths fail less often than relative paths once the working directory can change. These are interface facts. They are found by reading failed calls, not by adding adjectives to the prompt.

## The move

Give each tool one action, a name that states it, arguments that cannot express the neighbouring action, and a result small enough to read. Include an example of a valid call and of a refusal. Then run a handful of inputs and look at the calls, including the ones that were almost right. Change the schema when the mistake is systematic. A required absolute path is a better fix than a warning.

Log the proposal, the refusal or the result, and the state afterwards. The [agent loop](/knowledge/agentic-systems) is this record. Without it you have a transcript of intentions.

## What this stops

A single tool called "handle" whose arguments are a free-form instruction. That tool is the original model call, with extra steps, and it cannot be refused in any precise way.
