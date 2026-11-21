---
title: A derivative is a local slope
description: A gradient points uphill at the current point. It says nothing about the valley over the next ridge.
field: mathematics
order: 4
publishedAt: 2026-11-21
useWhen: You are changing a weight, a step size, or a prompt parameter because a slope said to.
avoidWhen: The function is discrete, and there is no local slope to follow.
check: Nudge one input by a small amount and see whether the output moves by about slope times nudge.
figure: gradient-descent
---

The derivative of a function of one variable is the slope of the tangent at a point. The gradient is the same fact for many variables: a vector whose direction is steepest ascent and whose length is the slope in that direction. Descent walks the other way. That walk is training, once the function is a loss and the variables are weights.

The slope is local. A step that is large compared with the bend of the surface leaves the region where the slope was a fair description. This is why a learning rate is not a detail. Too small, and the walk takes forever on a gentle slope. Too large, and the walk uses a slope that no longer applies and can climb.

## The move

When a training step surprises you, check the slope before you change the optimizer. Finite differences do it without believing the code: add a tiny nudge to one weight, recompute the loss, and divide the change in loss by the nudge. If that quotient disagrees with the gradient your program stored, the bug is in the derivative. If they agree and the loss still misbehaves, the surface is the problem, and a different step size or a different point is the relevant change.

The chain rule is why a network can have a gradient at all. If the loss depends on a prediction and the prediction depends on a weight, the slope with respect to the weight is the product of the two slopes. [Gradient descent](/studio/gradient-descent) is the walk. [Backpropagation](/studio/backpropagation) is the product, arranged so each factor is computed once.

## What this stops

A gradient is not an explanation of importance across the whole dataset. It is a local slope at one point, on the batch you just used. A feature can have a near-zero gradient at this point and matter everywhere else. Read the number as a direction to try, and check the loss after the step.
