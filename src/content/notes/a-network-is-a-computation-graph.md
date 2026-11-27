---
title: A network is a computation graph
description: A network is a graph of small operations from inputs to a loss. The weights are the numbers on that graph that training may change.
topic: deep-learning
maturity: budding
publishedAt: 2026-11-27
tags: [networks, computation]
objectives:
  - Read a layer as nodes in a graph, not as a metaphor.
  - Point at which numbers training is allowed to change.
---

A network is a graph. The leaves are the inputs and the weights. Each inner node is a small operation: a product, a sum, a bend applied to one number. The root you train against is the loss. Forward evaluation walks from the leaves to the loss. There is no extra object called a "layer" once the graph is written down. A layer is a repeated block of those operations, given a name so you can count it.

[How neural networks learn](/knowledge/how-neural-networks-learn) describes one block: a weighted sum, a bias, and a bend. The graph is what you get when that block is repeated and the loss is attached. [A neuron](/studio/neuron) is the smallest block drawn on its own, with two inputs you can move.

## What the graph fixes

The graph fixes the order of the operations before any training starts. Training does not add nodes. It changes the weight leaves so the loss, on the rows you have, gets smaller. If a bend is missing between two sums, the graph really is one sum, however many names you gave the middle nodes. If a connection is not in the graph, no amount of data will create it.

[Activations](/studio/activations) is the bend by itself. The bend is a node with one input. Everything downstream sees the bent value, not the sum that went in.

## What this does not say

Drawing the graph does not say the network will fit, or that a particular width is enough. It says which function you are searching inside. Two graphs with the same picture and different widths are different families. Write the width down when you claim what the family can represent.
