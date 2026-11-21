---
title: Linear models
description: A linear model is a weighted sum, sometimes bent by a sigmoid. The weights are readable, and the boundary they draw is flat.
field: machine-learning
order: 10
publishedAt: 2026-11-21
useWhen: The first model on a new table, or any time you need to say which inputs moved the prediction.
avoidWhen: You already know the classes are intertwined and no flat cut will separate them.
check: Read the largest weights against the units of the inputs. A large weight on an unscaled feature may be a unit, not a cause.
diagram: linear
---

A linear model predicts a weighted sum of its inputs, plus a constant. Logistic regression passes that sum through a sigmoid and treats the result as a probability of a label. Softmax does the same for several labels. In every case the weights are the model. You can list them, argue with them, and notice when one of them is a leak.

The geometry is a flat cut. In two dimensions it is a line. In more, a plane. If the classes spiral around each other, no choice of weights will separate them. The honest next step is often new coordinates — a product of two features, a bin, a distance — in which a flat cut works. A hidden layer is a learned version of that move. Understanding the flat cut first tells you what the hidden layer is being asked to build.

## The move

Standardize continuous inputs before you compare weights, or refuse to compare them. Then fit the linear model and the dumb baselines: predict the majority class, predict the mean. If the linear model does not beat those on held-out rows, the features are not carrying a flat signal, and a more flexible model should be asked to show that it is using something else.

Keep the sign of each weight attached to a sentence. "This coefficient is the change in the sum when this input moves by one unit and the others stay put." If the inputs move together, that sentence is still true of the model and false of the world. The coefficient is not a cause. It is a partial slope in the fit.

## What this stops

Skipping the linear model because "the problem is nonlinear" skips the baseline that tells you how much of the problem was linear after all. Many tables are. The ones that are not become visible when the linear model fails in a way you can describe.
