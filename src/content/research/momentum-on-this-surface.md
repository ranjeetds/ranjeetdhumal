---
title: Where momentum settles on this loss surface
description: On the studio surface, 77 starts, and the step and momentum settings that do and do not move a start into the other valley.
tags: [optimization, experiment]
draft: false
kind: experiment
stage: posted
publishedAt: 2026-11-24
authors: []
---

The [gradient descent](/studio/gradient-descent) figure walks the two-valley surface in `src/lib/viz/loss-surface.ts`. The figure’s own settings are a step of 0.045, momentum 0.88, and at most 160 steps. This note runs that function on a grid. It does not add a surface.

The grid is 77 starts: the first coordinate from −2.5 to 2.5 and the second from −1.5 to 1.5, both in steps of 0.5. A run is counted in the deeper valley if it ends within 0.9 of (1.25, −0.45), and in the shallower valley if it ends within 0.9 of (−1.45, 0.65). Every run on this grid ended in one of those two neighbourhoods. The deeper well’s ends sat near (1.19, −0.42), with loss about −1.02. The shallower well’s ends sat near (−1.37, 0.59), with loss about −0.62.

At the figure’s settings, 42 starts reach the deeper valley and 35 reach the shallower one. Turning momentum off, and keeping the step at 0.045, moves none of the 77 starts to the other valley. It shortens the walk. The start at (−2, 1) still ends in the shallower valley, in 102 steps with momentum and 75 steps without it. The start at (0, 0) still ends in the deeper valley, in 131 steps with momentum and 79 without it. Raising the step from 0.045 to 0.2, with momentum 0.88, also moves none of the 77.

Raising momentum from 0.88 to 0.97, step still 0.045, moves one start. (−2.5, 1.5) ends in the shallower valley at 0.88 and in the deeper valley at 0.97.

So, on this surface and this grid, the start chooses the valley. The step sizes and the momentum values tried here mostly change how long the walk is. One corner start is movable by a large momentum. That is a fact about this function. It is not evidence that momentum solves a non-convex loss in general, and it is not a measurement of a network.
