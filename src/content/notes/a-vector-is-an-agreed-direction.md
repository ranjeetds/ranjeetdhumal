---
title: A vector is an agreed direction
description: A vector is a list of numbers with an agreed meaning for each position. The list is useless until the positions mean the same thing to every step that reads it.
topic: mathematics
maturity: budding
publishedAt: 2026-11-27
tags: [vectors, linear-algebra]
objectives:
  - Treat a vector as coordinates against a chosen basis.
  - Say what breaks when two lists do not share that basis.
---

A vector is an arrow, or it is a list of numbers. The list is the arrow written in a coordinate system you agreed on. The first number is how far along the first axis, the second along the second, and so on. Add two vectors and you add those numbers position by position. Scale a vector and you scale every number. None of that is meaningful if the reader and the writer disagree about which position is which axis.

In a model the axes are features, pixels, or hidden units. A dot product scores two vectors by multiplying matching positions and adding. The score depends on the agreement. [A vector and a dot product](/guides/a-vector-and-a-dot-product) is the operation. [Dot product](/studio/dot-product) lets you drag the two arrows and watch the score. If you permute the coordinates of only one vector, you have changed the arrow, not "the same arrow written differently."

## Length and direction

The length is the square root of the vector's dot product with itself. The direction is what remains once length is set aside. Two vectors can point the same way and differ in length, and a later step that normalizes them will treat them as the same direction. [Normalization](/studio/normalization) recenters and rescales a cloud. It is a choice about which differences you are willing to throw away.

## What this does not say

Calling a list a vector does not give the positions a meaning. An embedding is a vector only relative to the space it was trained in. Comparing it with a vector from another model, coordinate by coordinate, compares two unrelated coordinate systems. The arithmetic will run. The score will not be a similarity.
