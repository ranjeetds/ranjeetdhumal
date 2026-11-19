---
title: Foundations of Machine Learning
description: From a definition of learning to an evaluation you can defend. Classical models, held in the order the ideas depend on each other.
tags: [machine-learning]
draft: false
level: foundational
topics: [machine-learning, mathematics]
overview: >
  This path builds the habit the rest of the notebook depends on: say what is being
  predicted, from what, under which penalty, and how you will know the result is not
  a memorisation of the sample. The models stay drawable on purpose. A line, a tree,
  a small ensemble. If those are clear, a network later is a richer function of the
  same kind, not a new subject. Each module hands the next one a distinction it needs.
  The linear model shows what a flat boundary cannot do. Generalization explains why
  fitting the training set is not the goal. The last module is the one that makes the
  earlier scores mean something.
outcome: Fit, diagnose, and compare classical models on a table of data, and say plainly what the metrics do not mean.
order: 1
modules:
  - title: What a learning problem is
    outcome: >
      You can write a task as inputs, outputs, a family of functions, and a loss,
      and you can say which part of that statement is a choice you made.
    concepts:
      - Input and target
      - A family of functions
      - A loss
    why: >
      Without this split, "train a model" is a button. The loss is the only part of
      the setup that says which mistakes count, and the family is the only part that
      says which functions you are even willing to consider. Change either one and
      you have a different problem, even if the spreadsheet did not change.
    next: >
      The next module takes the simplest family, linear functions, and shows the
      shapes of boundary that family cannot draw.
  - title: Linear models and their boundary
    outcome: >
      You can fit a linear classifier or regressor, read the weights, and recognise
      a dataset on which no choice of weights will succeed.
    concepts:
      - Weighted sums
      - A flat decision boundary
      - Features that bend the space
    why: >
      The linear model is the last model whose entire behaviour you can see in a
      handful of numbers. Its failure mode is equally visible. Classes that wrap
      around each other are not a tuning problem. Adding a feature is a deliberate
      change of coordinates, which is the same move a later hidden layer will make
      without asking you.
    next: >
      A model that fits the training points perfectly may still be useless. The next
      module is about that gap.
  - title: Generalization
    outcome: >
      You can explain a train-test gap as bias or as variance, and you can name one
      change that would address each.
    concepts:
      - The train-test gap
      - Bias and variance
      - Regularization
    why: >
      Reported accuracy is usually training accuracy wearing a nicer name. The gap
      is the actual object of study. A rigid model and an over-flexible one fail
      differently, and the remedies pull in opposite directions. Knowing which
      failure you have stops you from regularizing a model that was too simple.
    next: >
      Trees and ensembles are the flexible models people reach for on tables. They
      need the gap from this module or their depth is just memorisation.
  - title: Trees and ensembles
    outcome: >
      You can say what a split tests, why a deep tree memorizes, and what averaging
      or boosting changes about the errors.
    concepts:
      - Axis-aligned splits
      - Depth as capacity
      - Averaging and boosting
    why: >
      On tabular data a tree is often the right tool, and it is the right contrast
      with a linear model. It can represent interactions the linear model cannot,
      and it will happily cut the space into one cell per training row. Ensembles
      are a response to that instability, not a different philosophy.
    next: >
      None of the scores so far mean anything if the test set was involved in
      building the model. The last module is that discipline.
  - title: Evaluation you can defend
    outcome: >
      You can choose a metric that matches the cost of a mistake, build a split that
      the fitting procedure never sees, and name two common ways leakage happens.
    concepts:
      - Metrics as choices
      - A sealed test set
      - Leakage
    why: >
      This is the module that makes the previous four honest. A model comparison
      under a leaked feature, or under accuracy on a rare class, will pick the wrong
      model with confidence. The skill is deciding the comparison before looking,
      and being able to describe what the chosen number hides.
    next: >
      The path ends here. The network path starts from the same loss and the same
      split, and adds a graph you can no longer draw in one line.
---
