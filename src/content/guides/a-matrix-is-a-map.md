---
title: A matrix is a map
description: A matrix takes a vector in and returns a vector out. A layer's linear part is that map, and the directions it collapses are gone.
field: mathematics
order: 3
publishedAt: 2026-11-21
useWhen: You are reading a weight matrix, a projection, or a low-rank factor and need to say what it does to a direction.
avoidWhen: The table of numbers is a record of counts, and nobody is multiplying it by a vector.
check: Apply the matrix to the standard basis. The columns are where those directions went.
figure: linear-map
---

A matrix is a function from vectors to vectors that respects addition and scaling. That is the definition used by every linear layer. The numbers in the matrix are the coordinates of that function in a basis you chose. Change the basis and the numbers change. The map does not.

Some directions are stretched, some are shrunk, and some are sent to zero. A direction sent to zero cannot be recovered by anything downstream. That is what a low-rank map does on purpose: it throws away the directions it has decided do not matter. An embedding projection, a bottleneck, and a factorised weight are the same decision at different sizes.

## The move

Read a matrix by its action, not by its heatmap. Pick a direction you understand — a one-hot feature, a difference between two examples — and multiply. The output is what the layer believes that direction is worth. The columns are the images of the basis vectors, which is why a column of zeros is a feature the layer ignores.

The [linear map](/studio/linear-map) figure draws the same fact in the plane. The ink arrows are the columns. Drop the vertical sends one of them to the origin, and the rank reads 1.

Singular vectors are the directions the map treats cleanly: a rotation, a scaling, a rotation back. You do not need the decomposition on every matrix you meet. You need the sentence it licenses. Keeping the largest scales and dropping the rest is a claim that the small scales were noise or unused capacity.

## What this stops

A weight with a large magnitude is not yet an important feature. Importance is the change in the output when that direction moves, which depends on the input as well as the weight. The map tells you the sensitivity. The magnitude alone tells you the coordinate system you happened to store.
