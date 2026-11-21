---
title: A vector and a dot product
description: A dot product is a length times a length times the cosine of the angle between them. Nearness in a list of numbers is that angle.
field: mathematics
order: 2
publishedAt: 2026-11-21
useWhen: You are comparing two embeddings, two weight rows, or any pair of coordinates and calling one pair closer.
avoidWhen: The coordinates are categories, and closeness would be an invention of the encoding.
check: Take two unit vectors. Their dot product is the cosine of the angle, and nothing else.
figure: dot-product
---

A vector is an ordered list of numbers that you have agreed to treat as a position or a direction. The agreement is the part people skip. The same list can be a point in a feature space, a column of a matrix, or a bag of counts. What you are allowed to do with it depends on which of those it is.

The dot product of two vectors multiplies them coordinate by coordinate and adds. If both vectors have length one, the result is the cosine of the angle between them. One means the same direction. Zero means a right angle. Negative means opposing. That is the entire geometry behind "these two embeddings are similar."

## The move

Before you rank neighbours, divide each vector by its length, or say out loud that you are not going to. A long vector dotted with anything is large because it is long, not because it points the same way. Cosine similarity removes that. The raw dot product keeps it. They answer different questions, and a retrieval system that switches between them without saying so has changed the question.

The [dot product](/studio/dot-product) figure is the picture: two arrows, the angle, and the number. Stay with a pair you can still draw. A vector of hundreds of coordinates is the same operation with most of the arrows hidden.

## What this stops

Clusters in a flat plot are a second choice, a projection, laid on top of this one. Two tokens can be neighbours in the drawing and far apart in the real angle, and the reverse. Trust the angle you computed. Treat the picture as a view of it.
