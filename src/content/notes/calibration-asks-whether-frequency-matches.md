---
title: Calibration asks whether the frequency matches
description: A stated chance is calibrated when the event occurs about that often among the cases given that chance.
topic: mathematics
maturity: budding
publishedAt: 2026-11-27
tags: [calibration, probability]
objectives:
  - Define calibration as a comparison of stated chance and frequency.
  - Separate a sharp score from a calibrated one.
---

Take every case where a system said the chance was about 0.8. If the event happened in about eight of every ten of those cases, the statement was calibrated at 0.8. Do that for each stated chance. Calibration is that comparison, across the range. It is not a property of one prediction. One prediction either happens or not. The comparison needs a pile of predictions that carried a similar number.

[Calibration](/guides/calibration) is the guide, with the picture of grouping predictions into bins and plotting frequency against the stated chance. A sharp model, one that says 0.99 often, can be badly calibrated: the event may happen far less than ninety-nine times in a hundred. A hesitant model can be well calibrated and still be a poor decision rule, because it rarely commits. Sharpness and calibration are different axes.

## What you need in order to check

You need outcomes. A language model's token probability has an outcome only if you can say which event it was a probability of, and then wait to see the event. A probability that the next token is a particular id is checkable against the next token. A probability that an answer is "correct" is checkable only if correctness was defined and recorded. [Evaluation and alignment](/knowledge/evaluation-and-alignment) is what happens when the recorded event is not the behaviour you meant.

## What this does not say

A calibrated chance is not a true sentence. A calibrated 0.8 is an event that fails one time in five, on purpose, in the record. Treating it as a certainty throws away the quantity you just measured. The use of a calibrated chance is to act differently at 0.8 than at 0.99, and to say so.
