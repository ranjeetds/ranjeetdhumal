---
title: Unsupervised learning has no target
description: Without a target, a method groups or compresses the rows. The groups are a property of the method and the features.
topic: machine-learning
maturity: budding
publishedAt: 2026-11-27
tags: [unsupervised]
objectives:
  - Say what a method can return when no label is given.
  - Refuse to treat a cluster as a discovered class.
---

Unsupervised learning is the set of methods you run when you do not have a target, or you are not willing to use one yet. Clustering puts nearby rows in a group. A projection keeps a few directions and drops the rest. A density model says which rows look typical. None of these is told what the groups are for. The output is a structure in the features you handed over.

That structure depends on the features and on the distance. Scale one column by a thousand and a distance that uses raw numbers will follow that column. Choose a different number of groups and the same rows split differently. The method did what you asked. The asking was a choice of representation, which is the same choice as in [a representation is a choice](/knowledge/a-representation-is-a-choice), made before any label exists.

## What you may not conclude

A cluster is not a class you found in nature. It is a region the algorithm marked. It becomes useful when a person can say what the rows in it share, and when that sharing survives a change of scale or a change of the number of groups. If the grouping disappears when you rescale a column, it was a property of the scaling.

[Embeddings and representation learning](/knowledge/embeddings-and-representation) is the version of this in which the directions themselves are learned from co-occurrence, still without a task label.

## What this does not say

Having no labels does not make the method neutral, and it does not make it safe to skip a check. You still chose the features, the distance, and the number of groups. Write those down. A picture of the groups without those choices is a drawing, not a finding.
