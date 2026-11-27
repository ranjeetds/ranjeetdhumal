---
title: A tree cuts the space into boxes
description: A decision tree asks one question at a time and labels the box it ends in. The cut is axis-aligned.
topic: machine-learning
maturity: budding
publishedAt: 2026-11-27
tags: [trees]
objectives:
  - Describe a tree as a sequence of cuts.
  - Say what a deep tree will do with a noisy label.
---

A decision tree picks one feature and one threshold, splits the rows in two, and repeats on each side until it stops. A prediction for a new row is the label of the box the row falls into, often the mean or the majority of the training rows that landed there. Every cut is parallel to an axis. A diagonal boundary has to be approximated by a staircase of boxes.

The procedure is easy to read, which is its value. You can point at the question that sent a row left. You can see a box that contains three rows and a label that is just those three. That readability is also the warning. A tree that keeps cutting until every box is pure has fit the sample, including the labels that were noise.

## When to stop cutting

[Trees](/guides/trees) is the practical constraint: limit the depth, or refuse to cut a box that is already small, and check the untouched rows. A shallow tree is a coarse partition. It will miss a pattern that needs a diagonal or a product of features. A deep tree will draw a box around an accident. The depth is the capacity, in a form you can count.

Nearest neighbours, on [the neighbours figure](/studio/neighbors), also predicts from nearby rows, without cutting the space in advance. A tree commits to the boxes. A neighbour method commits to a distance and a count.

## What this does not say

A tree you can read is not a tree that is right. The first cut is the cut that most reduced the loss on the rows you had. A different sample can prefer a different first question. Read the tree as a partition of this sample, and ask whether the next sample falls into boxes that still mean what the labels said.
