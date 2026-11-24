---
title: Separating a paper's claim from its evidence
description: One sentence that could be false, the comparison that is supposed to support it, and the observation that would have falsified it. Demonstrated on Vaswani et al.
tags: [reading, method]
draft: false
kind: note
stage: posted
publishedAt: 2026-11-24
authors: []
---

A summary glues three objects into one paragraph, and then none of them can be checked. The separation is a page each.

The claim is a sentence that could be false. For [Attention Is All You Need](/research#attention-is-all-you-need) the sentence is: a sequence model can drop recurrence and convolution and still translate, by comparing every position with every other in parallel.

The evidence is the comparison that is supposed to support that sentence. Name the data, the metric, the systems in the table, and what was held fixed. Here the data are WMT 2014 English–German and English–French. The metric is BLEU. The systems are whole models. The task and the metric are held fixed. The optimizer, the regularization, and the training budget are not. So the table supports “these systems did well at this task.” It does not support “attention, and only attention, produced the gain.”

The falsifier is an observation that would have made the claim fail, including one the paper did not collect. A recurrent system with the same training budget and the same regularization, beating the attention system on the same test set, would have falsified the practical claim. A gain that disappeared once those were matched would have falsified the attribution. The paper does not report that matched run. The absence belongs on this page, not in a footnote that pretends the attribution was shown.

The method stops there. It does not award the paper a moral score, and it does not require a new experiment before you are allowed to use the architecture. It requires that the sentence you repeat is the sentence the comparison can carry.
