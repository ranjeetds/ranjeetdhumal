---
title: Where momentum settles on this loss surface
description: A planned experiment on the surface drawn in the visual lab. Vary the start, the step size, and the momentum, and record which valley each run finds.
tags: [optimization, experiment]
draft: false
kind: experiment
stage: planned
publishedAt: 2026-11-19
authors: []
---

The live figure on this site descends a loss with two basins, using a fixed step size and a fixed momentum. It already shows that the starting point selects the valley. This experiment is the measurement that should sit beside that picture. The surface, the update rule, and the constants are the ones in the figure's source, so a result can be checked against the animation rather than against a function invented for the occasion.

The protocol is to sample starts across the domain, vary step size and momentum over a small grid, and record which basin each run reaches, how many steps it takes, and whether it oscillates before settling. No result is reported here. The entry exists so the protocol is fixed before the runs are looked at. A run that reaches the deeper basin is not, by itself, evidence that momentum solves non-convexity. It is evidence about this surface, at these settings, and the write-up will be held to that scope.
