---
title: Recursive self-improvement
description: The claim is that a system can improve the system that produces the next improvement. A closed loop of that kind is a research claim, not a product pattern, and it is not established.
field: improvement
order: 26
publishedAt: 2026-11-21
useWhen: You are reading a claim that a model improved itself, and you need to separate a measured gain from a story about an unbounded loop.
avoidWhen: You are building a product. A workflow with a check is the tool. An autonomous self-modifying loop is not a feature.
check: Name what changed, what was held fixed, what data judged the change, and what would have forced the change to be rejected.
diagram: improvement
---

Recursive self-improvement is a claim about a loop. A system produces a change to its own machinery — its weights, its training procedure, its tools, or the code that builds the next system — and the changed system is better at producing the following change. "Better" has to be a stated task, judged on data the change was not fit to. Without that, the loop is a description of activity.

People use the same words for very different loops. A human researcher uses a model to draft an experiment and then decides what to run. A training job proposes new hyperparameters and a fixed harness accepts or rejects them. A model edits its own weights or its own evaluator with no check that the evaluator still measures the task. The first two have a part that does not get rewritten by the proposal. The last one can move the target. Those are not one result.

Nothing in the public record establishes that a closed loop of self-modification yields reliable, compounding gains on a task the loop does not also get to redefine. Gains that do show up are usually of the first kinds: a person, or a frozen test, remains outside the thing being edited. Extrapolating from a helpful coding assistant to an autonomous explosion is a different sentence from the evidence.

## The move

When you meet the claim, write four lines. What object was allowed to change. What object was held fixed, especially the evaluation. Which data judged the change, and whether the proposer could see that data. What stop rule rejected a change that looked good and was not. If the proposer can edit the test, a rising score means the test moved. If there is no stop rule, the loop is not an experiment.

For a system you are actually building, keep the proposer and the change it may make on opposite sides of a schema, as in [the tool interface](/guides/the-tool-is-the-interface). Let it propose a patch, a hyperparameter, or a question. Let fixed code apply the patch on a branch, run a test that the proposal cannot rewrite, and throw the branch away when the test fails. That is an evaluator-optimizer workflow with a person or a harness as the optimizer's constraint. It is not a license to let a model rewrite the harness.

## What this stops

A product plan, or a fear, built from the slogan rather than from the four lines. Improvement is a comparison. Recursive improvement is a sequence of comparisons in which the comparator stays put. If you cannot point at the comparator, you do not have the phenomenon the words suggest. You have a system changing itself, which is easy, and a story about the direction, which is the part that has to be measured.
