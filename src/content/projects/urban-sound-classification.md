---
title: Urban sound classification
description: Classifying urban sounds with deep learning.
tags: [sound, deep-learning]
draft: false
status: archived
year: 2017
stack: [Python, TensorFlow, Librosa]
problem: >
  Urban sound is a classification problem with a public dataset and a clear
  input transform: a clip becomes a spectrogram, and the spectrogram becomes
  the input to a network. It is a useful first place to see that transform,
  and a poor place to invent a result.
approach: >
  The repository is a study archive of notebooks in the line of the public
  UrbanSound8K write-ups. Librosa builds the features. Three models are
  exercised on those features: a feed-forward network, a convolutional
  network, and a recurrent network. The dataset is UrbanSound8K.
outcome: >
  An archived reference for that pipeline, kept so the steps can be reread.
  This page does not report an accuracy. The notebooks are a study, not a
  result being claimed.
repository: https://github.com/ranjeetds/Urban-Sound-Classification
---
