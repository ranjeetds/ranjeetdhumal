---
title: Negative results are part of the map
description: A run that did not improve the comparison is a result about that setup. Dropping it from the record leaves a map of the attempts that happened to work.
topic: emerging-tech
maturity: budding
publishedAt: 2026-11-27
tags: [method, reporting]
objectives:
  - Record a failed comparison with the same care as a successful one.
  - Shrink the claim to the setups you actually ran.
---

A negative result is a comparison that did not go the way the claim hoped. The feature did not help. The second seed was worse. The baseline matched the new system once the budget was equal. Those outcomes bound the claim. Without them, a reader sees the runs that worked and infers a generality the runs you did not show would have contradicted.

This is not a request to publish every crash. It is a request to keep the comparisons that were real attempts: same task, a pre-stated metric, a setup you might have reported had it won. A bug that never produced a number is an engineering note. A finished run with a smaller gain than you wanted is evidence. [An ablation removes one piece](/knowledge/an-ablation-removes-one-piece) is often where these runs live, and where they get edited out of the story.

## How the map gets biased

If only the favourable setup is written down, the next person will spend the same months. They will also cite you for a broader sentence than your favourable setup supports. [Separate the claim from the evidence](/knowledge/separate-the-claim-from-the-evidence) is easier to do honestly when the unfavourable comparison is on the page. The falsifier you already collected should not have to be rediscovered by a stranger.

## What this does not say

A negative result on one setup does not retire a method. It retires the sentence "it helps," unmodified, for the setup you ran. A later setup can differ in the way that matters. The record should make that later attempt possible, by saying what you held fixed when the difference failed to appear.
