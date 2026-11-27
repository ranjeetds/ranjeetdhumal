---
title: A matrix sends vectors to vectors
description: A matrix is a linear map. Its columns are where the basis vectors go, and every other vector goes to the same combination of those columns.
topic: mathematics
maturity: budding
publishedAt: 2026-11-27
tags: [matrices, linear-maps]
objectives:
  - Read a matrix as a map, not as a grid of unrelated numbers.
  - Predict one output from the columns.
---

A matrix takes a vector in and returns a vector out, and it does so linearly: the image of a sum is the sum of the images, and the image of a scaled vector is the scaled image. The columns are the images of the basis vectors. A vector with coordinates (x, y) goes to x times the first column plus y times the second. You do not need a separate story for each input. The columns are the whole map.

[A matrix is a map](/guides/a-matrix-is-a-map) writes this down. [Linear map](/studio/linear-map) draws it in the plane: the ink arrows are the columns, the grey circle is the unit circle, and the amber curve is where the circle went. Stretch, rotate, shear, and a map that drops one axis are different columns, not different kinds of object.

## What linearity forbids

A linear map sends the origin to the origin, and it cannot bend. A boundary that curves, or a function that must respond differently in two regions, is outside this family until you add a bias or a bend. [A linear model is a weighted sum](/knowledge/a-linear-model-is-a-weighted-sum) is the same family used as a predictor. [How neural networks learn](/knowledge/how-neural-networks-learn) is what the bend is for: without it, a stack of matrices is one matrix.

## What this does not say

Seeing the columns does not tell you which map you ought to use. It tells you which map you have. A layer in a network is one of these maps, plus a bias, with numbers that training will change. The picture on the studio page is a fixed map, so you can see the geometry before those numbers start moving.
