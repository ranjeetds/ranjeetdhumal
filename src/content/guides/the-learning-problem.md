---
title: The learning problem
description: Learning is a search over a family of functions for one that scores well on data it did not use to choose itself.
field: machine-learning
order: 9
publishedAt: 2026-11-21
useWhen: You are about to replace a written rule with a procedure that estimates the rule from examples.
avoidWhen: The rule is short, stable, and already known. Estimating it from examples adds a way to be wrong.
check: Point at the family, the score, and the rows the score was not allowed to see.
figure: loss-functions
---

A learning problem has three parts. A family of functions you are willing to consider. A score that says how badly a function disagrees with examples. A procedure that searches the family for a good score. Features, regularizers, and splits exist to keep that search honest. If the procedure can see the answers it will later be judged on, the score is theatre.

Supervised learning is the case where each example arrives with the output you wish had been produced. Classification and regression are the same shape with a different disagreement: a wrong label, or a wrong number. The loss is the disagreement you have agreed to care about. Squared error treats one large miss as worse than several small ones. Cross-entropy treats a confident wrong answer as serious. Picking the loss is picking the mistakes you will tolerate.

## The move

Write the three parts down before you train, in that order, and add a fourth sentence: what the function is allowed to look at. A feature computed from the whole column, a duplicate that sits on both sides of a split, and a timestamp ignored are ways of letting the function see the future. The [learning problem](/knowledge/how-neural-networks-learn) in the hub is the same split, followed into networks. Classical models stay here because you can still draw the function the search returned.

Unsupervised learning drops the desired output and scores something else: a reconstruction, a cluster tightness, a density. The three parts remain. The temptation is to treat the score as if a person had labelled the structure it found. They did not.

## What this stops

A demo that reports the training score as the result has skipped the problem. The search is allowed to be good at the rows it searched on. The claim begins at the rows it did not.
