---
title: The chain rule multiplies slopes
description: The slope of a composition is the product of the slopes. A single factor near zero shrinks the whole product.
topic: mathematics
maturity: budding
publishedAt: 2026-11-27
tags: [chain-rule, derivatives]
objectives:
  - Compute a composed slope as a product.
  - See a vanishing product as one small factor, not as a deep mystery.
---

If y depends on u and u depends on x, the slope of y with respect to x is the slope of y with respect to u, times the slope of u with respect to x. Each extra function in the chain adds one more factor. The rule is the whole content of backpropagation. [Backpropagation is the chain rule, organized](/knowledge/backpropagation-is-the-chain-rule-organized) is that product walked backward through a graph. [Backpropagation](/studio/backpropagation) is one product through a single ReLU.

The product explains two failures that look like optimisation folklore. If every factor is a little smaller than one, a long chain multiplies them into something tiny, and a step in x barely moves y. If one factor is zero, the product is zero, and nothing upstream of that factor receives a slope. If a factor is large, the product grows, and a modest step in x throws y a long way.

## Where to look

Look at the factors, not at the depth as a mood. A saturated bend contributes a flat factor. A weight initialization that keeps early sums small or huge changes the factors before any training. [Initialization decides the first slope](/knowledge/initialization-decides-the-first-slope) is that starting scale. The chain rule will faithfully multiply whatever scale you handed it.

## What this does not say

A healthy product of slopes is not a small loss. It means the local slope arrived at the parameter you wanted to move. The parameter then moves by a rule you still have to choose, and the loss changes only as much as the surface, at that point, allows.
