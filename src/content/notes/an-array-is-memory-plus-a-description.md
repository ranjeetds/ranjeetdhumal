---
title: An array is memory plus a description
description: "An array is a block of memory and a small description of how to read it: the type, the shape, and the strides."
topic: python-cs
maturity: budding
publishedAt: 2026-11-27
tags: [arrays, memory]
objectives:
  - Separate the bytes from the shape that interprets them.
  - Say what the shape does not store.
---

An array is not a list of lists, even when it prints as one. It is a contiguous block of values of one type, plus a description: how many dimensions, how long each is, and how many steps to move to the next element along each axis. The description is small. The block is the data. A library that hands you an array is handing you both, and most bugs that "look like math" are disagreements about the description.

The shape says which index means which axis. A tensor of images might be (batch, height, width, channels) or (batch, channels, height, width). The same bytes, read with the wrong convention, are a different array. The arithmetic will not complain. It will multiply the wrong pairs. Print the shape at the boundary where an array enters your code and where it leaves, which is the habit in [print the shape at the boundary](/knowledge/print-the-shape-at-the-boundary).

## What the description leaves implicit

The description does not say what the axes mean, only how long they are. A length of 768 might be an embedding dimension or a sequence padded to 768. The name in your head is not in the array. Write it next to the shape when the array crosses a function boundary. [A vector is an agreed direction](/knowledge/a-vector-is-an-agreed-direction) is the mathematical version of the same agreement.

## What this does not say

Knowing the layout does not make the operation fast. It tells you which operation you are running. A loop that walks the block in the wrong order can be the right math and a bad use of memory. Correctness comes first. The layout is what makes the correctness checkable.
