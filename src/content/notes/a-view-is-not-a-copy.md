---
title: A view is not a copy
description: A slice of an array often shares the original memory. Writing into the slice writes into the array you thought you had kept.
topic: python-cs
maturity: budding
publishedAt: 2026-11-27
tags: [arrays, copies]
objectives:
  - Tell a view from a copy.
  - Know when an in-place update will surprise a later reader.
---

A slice, a transpose, and a reshape often return a view: a new description of the same block of memory. Change an element through the view and the original array changes, because there was never a second block. That is a feature when you meant to edit in place, and a bug when you thought the slice was a private notebook.

A copy allocates a new block and leaves the old one alone. It costs memory and time proportional to the data. The safe habit at a boundary — a function that must not disturb its caller, a batch you will normalize, a target you will compare against later — is to copy on purpose and to know you copied. The unsafe habit is to assume a slice copied because it printed as its own array.

## How to tell

Check whether the result owns its memory, or whether it shares a base with the array it came from. The exact call depends on the library. The question does not. If two names report the same base, they are the same data. [An array is memory plus a description](/knowledge/an-array-is-memory-plus-a-description) is why this can happen: the description changed, and the block did not.

## What this does not say

Copying everything is not the repair. Copies hide aliasing by spending memory, and they can make a pipeline look correct while a view-based one was also correct and cheaper. The repair is to decide, at the point of the slice, whether later writes should be shared. Decide in the code, not after a result has already moved.
