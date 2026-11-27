---
title: Rank is how many directions survive
description: The rank of a map is the dimension of its image. A direction that lands on zero has been lost, and no later linear step can recover it.
topic: mathematics
maturity: budding
publishedAt: 2026-11-27
tags: [rank, linear-algebra]
objectives:
  - Read rank as the number of surviving directions.
  - Connect a zero determinant, in the plane, to a lost direction.
---

Apply a linear map and some arrows get shorter, some turn, and some land on the same point. The rank counts how many independent directions are still distinct after the map. In the plane, rank 2 means the image still covers the plane. Rank 1 means every input lands on a single line. Rank 0 means every input lands on the origin.

A square map in the plane has rank 2 exactly when its determinant is not zero. A determinant of zero means the columns lie on the same line, or one of them is zero, so a whole direction was collapsed. [Linear map](/studio/linear-map) has a preset that does this: drop the vertical axis, and the rank reads 1. The collapsed direction is not hiding in the output. It is gone. A later linear map, seeing only the image, cannot tell two inputs apart if this map already sent them to the same point.

## What you can still tell apart

Two inputs that differ by a vector in the collapsed direction become the same output. Any feature that lived only in that direction is invisible downstream. This is the linear version of a representation deleting a distinction, from [a representation is a choice](/knowledge/a-representation-is-a-choice). The deletion here is geometric and total.

## What this does not say

Full rank does not mean the map is a good model of anything. It means the map is invertible: in principle the input can be recovered from the output. A nearly collapsed map, with a tiny determinant, is invertible and still useless in practice, because recovering the lost direction multiplies noise. Rank tells you what survived. It does not tell you whether the survivor was the direction you needed.
