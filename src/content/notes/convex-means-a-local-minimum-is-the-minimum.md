---
title: Convex means a local minimum is the minimum
description: On a convex function, a point where the slope is zero is a global minimum. Most training losses are not convex.
topic: mathematics
maturity: budding
publishedAt: 2026-11-27
tags: [optimization, convexity]
objectives:
  - State what convexity gives you at a flat point.
  - Refuse the implication when the function bends the wrong way.
---

A function is convex when the segment between any two points on its graph sits above the graph. Bowls are convex. A ridge between two valleys is not. On a convex function, any local minimum is the minimum: if the slope is zero, you are done, and a different start cannot finish lower. That is the property optimizers would like to have. It is the property a squared error on a linear model often does have, and the property a neural network loss generally does not.

[Gradient descent](/studio/gradient-descent) uses a designed surface with more than one valley so the missing property is visible. Two runs can settle in different places. Both followed the local slope correctly. [Training dynamics](/knowledge/training-dynamics) says the same thing in prose. Convexity is the condition under which that story would have ended at a single best point.

## What people borrow anyway

Algorithms designed for convex problems are still used on losses that are not convex, because a local step needs only a local slope. The guarantee does not come with them. "The optimizer converged" means the local slope got small or the step budget ended. It does not mean the parameters are the best in the family. A second start, or a look at the training loss of a different seed, is how you notice another valley.

## What this does not say

Convexity is not a reason to prefer a worse family of models, and non-convexity is not a reason to distrust every deep network. A non-convex loss can still reach a point whose predictions are good on the next batch. The point is that you cannot certify that from the slope alone. The certification, if you need one, is a comparison on data the fit did not see.
