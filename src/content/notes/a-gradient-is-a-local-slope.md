---
title: A gradient is a local slope
description: A gradient is the direction of steepest increase at one point. It says nothing, by itself, about the slope a step away.
topic: mathematics
maturity: budding
publishedAt: 2026-11-27
tags: [gradients, derivatives]
objectives:
  - Read a gradient as a local linear approximation.
  - Say why a large step can leave the region the gradient described.
---

For a function of one input, the derivative at a point is the slope of the best straight approximation there. For a function of several inputs, the gradient is the vector of those partial slopes. It points in the direction the function increases fastest, and its length is that rate. Step a tiny distance against it and the function goes down, by about the length of the gradient times the distance.

The word that carries the load is "tiny." The gradient is a local fact. [A derivative is a local slope](/guides/a-derivative-is-a-local-slope) is the one-dimensional version. [Training dynamics](/knowledge/training-dynamics) is what happens when you follow that local fact repeatedly across a surface. [Gradient descent](/studio/gradient-descent) draws a designed surface so you can watch a step size that was reasonable in one region overshoot the next.

## What a zero gradient does and does not mean

A zero gradient means the local slope is flat. You might be at a minimum, at a maximum, or on a ledge. The gradient does not classify which. Looking at the function value nearby does. A training run that stops because the gradient is small has found a flat point of the loss it computed. [A flat slope stops the step](/knowledge/a-flat-slope-stops-the-step) separates that geometry from a bend that is flat for a local reason inside a network.

## What this does not say

A gradient you computed correctly is not a reason to take a large step. The linear approximation gets worse as you move away from the point where you computed it. The learning rate is a bet that the step stays inside the region the bet was about. The gradient cannot make that bet for you.
