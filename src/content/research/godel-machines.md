---
title: Gödel machines
description: Schmidhuber’s 2003 proposal. A system may rewrite itself only after a proof that the rewrite raises expected utility. The result is a theorem, not a measured run.
tags: [self-improvement, theory]
draft: false
kind: paper-note
stage: posted
publishedAt: 2026-11-25
authors: [Jürgen Schmidhuber]
source: https://arxiv.org/abs/cs/0309048
---

Jürgen Schmidhuber, “Gödel Machines: Self-Referential Universal Problem Solvers Making Provably Optimal Self-Improvements,” technical report IDSIA-19-03, arXiv:cs/0309048, first posted in 2003 and revised through 2006. The later book chapter is “Gödel Machines: Fully Self-Referential Optimal Universal Self-Improvers” (2007).

The claim is a proof, not an experiment. The initial program contains a problem solver and a proof searcher. The searcher looks for a proof that replacing the program with a particular rewrite would raise expected utility, given a utility function and axioms that describe the machine, the utility, and the code. Only then does the rewrite run. The rewrite may replace the proof searcher itself. Schmidhuber’s global-optimality argument is that the utility of leaving the program unchanged already counts the rewrites an unmodified searcher might find later, so an accepted rewrite is not a greedy local step. The argument is relative to the utility, the axioms, and Gödel’s limits on what can be proved.

The paper does not report a machine that ran this loop and recorded a gain. It does not show that useful rewrites are short enough to find. A later system that changes itself because a benchmark went up is a different object. The Gödel machine refuses the change unless the proof exists.
