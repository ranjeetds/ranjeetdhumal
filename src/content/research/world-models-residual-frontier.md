---
title: "From Pattern Completion to Counterfactual Simulation: World Models as a Residual Frontier"
description: A survey of world models by the capabilities that remain after language, vision, and generative media models are accounted for. The public companion is a map of systems, benchmarks, and datasets.
tags: [world-models, survey]
draft: false
kind: paper-note
stage: posted
publishedAt: 2026-08-18
authors: [Ranjeet Dhumal, Koen Aerts]
source: https://github.com/ranjeetds/World-Models-Residual-Map
---

A language model completes patterns in text. Vision models and generative media models do the same for images and sound. A world model, in the sense used here, is whatever is still missing once those capabilities are granted: actions that change a state, a state that persists, physical constraint, counterfactual questions, uncertainty, planning, the gap between a simulation and the system it stands in for, spatial consistency, and the coupling of social facts with physical ones. The survey compares published systems by those residual capabilities rather than by architecture family.

The public artifact is a repository that maps systems, implementations, benchmarks, and datasets against that list. A DOI has not been issued, so the repository is the citable version until one exists. The claim is methodological. A leaderboard score hides which of these residuals a system never attempted, and two systems with similar scores can be failing at entirely different parts of the list. The map is there so that difference stays visible.
