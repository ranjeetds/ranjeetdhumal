---
title: A model is a point
description: A trained network is one point in the space of its weights. A behaviour is a property of that point, evaluated on data, and the point is not an explanation of the behaviour.
field: weight-space
order: 24
publishedAt: 2026-11-21
useWhen: You want to compare, average, or move between models that share an architecture and a corresponding parameterization.
avoidWhen: The models do not share coordinates. Averaging unrelated weight tensors is an arithmetic accident.
check: Confirm two checkpoints have the same architecture and that each tensor you compare occupies the same role.
diagram: weight-point
---

Once the architecture is fixed, a setting of every weight is a point in a high-dimensional space. Training is a walk in that space, driven by local slopes of a loss. Two runs are two walks. They can end in different points that score similarly on the same data and still compute different functions on the next example. Sameness of loss is not sameness of point, and sameness of point is not an account of why a particular input produces a particular output.

Weight-space work takes the point seriously as an object you can move. Linear mode connectivity is the empirical observation that two points trained from the same initialization, or later permuted into correspondence, can often be joined by a straight line along which the loss stays low. Where that is true, the two solutions are not separated by a barrier, and a point halfway between them is a model rather than a wreck. Where it is false, the midpoint is a warning that the coordinates did not match.

## The move

Before any arithmetic on weights, line up the coordinates. Same architecture, same tensor names, and a permutation of hidden units if the units were free to swap without changing the function. Then evaluate the endpoints and the midpoint on data neither endpoint was selected with. A low loss at the midpoint supports connectivity for this pair. A spike says the straight line left the region where either solution worked.

The point is still not a mechanism. Knowing you are at a particular coordinate does not name the feature a hidden unit detects. Weight space is the wrong tool for that question, and a probe or a direct intervention on activations is the right neighbouring tool. Keep the two apart.

## What this stops

Averaging checkpoints because their scores matched. The average is a new point. It deserves its own evaluation, and it is only meaningful when the coordinates refer to the same directions.
