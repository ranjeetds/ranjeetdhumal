---
title: A goal is not the signal
description: The signal you optimize is a proxy. When the proxy and the goal come apart, the search follows the proxy.
topic: artificial-intelligence
maturity: budding
publishedAt: 2026-11-27
tags: [objectives, feedback]
objectives:
  - Distinguish a goal from the number used to pursue it.
  - Name one way a proxy can be satisfied without the goal.
---

A goal is the outcome you wanted in the environment. A signal is the number, the label, or the message you actually score. They are the same object only when you built the signal so that improving it improves the goal and nothing else. That is rare. A loss is a mean of mistakes on the rows you have. A reward is a number a wrapper computed. A thumbs-up is a click. Each one is a proxy, and a search that can see the proxy will improve the proxy.

This is the ordinary form of reward hacking, and it does not require a dramatic system. A classifier trained to maximise accuracy on a set where one class is rare will look strong while missing that class, if accuracy treats the rare miss as cheap. A summariser scored on shortness will omit the sentence you needed. The search worked. The signal was the wrong stand-in.

## How to tell them apart

Write the goal as a change in the world, and the signal as the number the training or the product can read. If you can imagine a behaviour that raises the number and leaves the world unimproved, or worsened, the two have come apart. The fix is not a larger model. The fix is a signal that is harder to satisfy without the change you wanted, and a check that looks at the world rather than at the number.

[Evaluation and alignment](/knowledge/evaluation-and-alignment) is this split for a reported score. The same split applies to a loss, a reward, and a user rating.

## What this does not say

Pointing at the gap does not hand you the right signal. Some goals have no clean number: a careful decision, a fair refusal, a summary a specific reader needed. Those still need a check. The check has to look at cases, not at the average of a proxy you already know how to game.
