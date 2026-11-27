---
title: A flat slope stops the step
description: Where the gradient is near zero, a step that follows the gradient does not move. The cause can be the bend, the weights, or the loss.
topic: deep-learning
maturity: budding
publishedAt: 2026-11-27
tags: [gradients, optimization]
objectives:
  - Name a flat slope as a fact about the local gradient.
  - Separate a saturated unit from a finished minimization.
---

A step that follows the gradient moves in proportion to the slope. Where the slope is about zero, the step is about zero. Training looks stuck. Sometimes it is stuck because the loss really is at a minimum in that neighbourhood. Sometimes the slope is zero for a local reason that has nothing to do with the minimum: a unit is in the flat part of its bend, a product in the chain rule includes a zero, or the weights have grown so the bend is saturated for every row in the batch.

Those are different stops, and they ask for different responses. A genuine minimum on the training loss might still be a bad fit for the next batch, but more learning rate will not find a slope that is not there. A saturated bend can start responding again if the incoming sum is brought back into the region where the bend has a slope. The picture in [gradient descent](/studio/gradient-descent) is a designed surface with ridges. A flat region on that picture is the same geometry, drawn so you can see the step shrink.

## Read the units, not the slogan

"Vanishing gradient" is a slogan for a product of many slopes smaller than one. The check is concrete. Look at the activations. If they sit in the flat part of the bend for most rows, the slope was never going to arrive upstream. [Activations](/studio/activations) is that bend, so you can see which side is flat before you blame the depth.

## What this does not say

A non-zero slope does not mean the step is useful. A huge slope is the opposite failure: one step leaves the region the slope described. The local slope is a permit to take a small step. The size of the step is a separate choice, and a slope that is merely non-zero does not set it.
