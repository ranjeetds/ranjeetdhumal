---
title: Bias and variance
description: A rigid model misses structure that is there. A flexible model chases structure that was only in this sample. The gap you care about is their sum.
field: statistics
order: 6
publishedAt: 2026-11-21
useWhen: A model is excellent on the training rows and worse on the next batch, or the reverse, and you need to say which failure it is.
avoidWhen: You have not yet separated training rows from the rows you will be judged on.
check: Fit a very rigid model and a very flexible one on the same split. The first should underfit both sides. The second should fit the training side and slip on the other.
diagram: bias-variance
---

Bias, here, is error that stays even if you had unlimited data from the same distribution, because the family of functions cannot represent the target. Variance is error that comes from the particular sample: a different draw would have produced a different function. The error you meet on new data has both, plus noise that no function of the inputs can remove.

A line on a curved relationship is mostly bias. A tree that has grown a leaf for every training row is mostly variance. Regularization, more data, and a smaller family are responses to variance. A richer family is a response to bias. Using the response for the wrong failure makes the other failure worse.

## The move

Keep a training score and a held-out score, and read them as a pair. Both bad: the family is missing the structure, or the features never contained it. Training good and held-out bad: the procedure is fitting this sample, and the next lever is less flexibility or more rows, not a more elaborate model of the same kind. Both good: you have earned a cautious claim about this distribution, not a claim about a shifted one.

The pair is a diagnostic, not a moral ranking of algorithms. A flexible model with a large sample can have less of both. A rigid model on a problem that really is a flat cut can beat it with less data.

## What this stops

"The model is overfitting" is often said when the training score was never compared with anything. Compute the pair before you name the disease. A model can also fail because the test distribution is not the training distribution. That is a third problem, and neither more data from the old distribution nor a stiffer penalty will fix it.
