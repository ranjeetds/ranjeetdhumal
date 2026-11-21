---
title: Task vectors and merging
description: A fine-tune minus its base is a direction in weight space. Adding and removing those directions edits behaviour only when the directions do not fight.
field: weight-space
order: 25
publishedAt: 2026-11-21
useWhen: You have several fine-tunes of one base and want a model that carries more than one of those edits, without retraining from the mixture.
avoidWhen: You need a guarantee on a behaviour. A merged point can drop a task the endpoints passed.
check: Evaluate each task at the endpoints and at the merged point. Report a task the merge lost, if it lost one.
diagram: task-vector
---

Take a base model and a model fine-tuned from it on one task. Their difference is a vector in weight space, sometimes called a task vector. Adding a scaled copy of that vector to the base moves the base toward the fine-tune. Subtracting it moves away. Adding two such vectors is an attempt to apply both edits at once. This is task arithmetic: the claim, which has to be checked, is that the edits are close enough to linear that addition corresponds to combining the behaviours.

Merging methods exist because the claim is only partly true. A plain average, a "soup" of fine-tunes, helps when the fine-tunes are nearby and the tasks agree. When they disagree, coordinates that one task increased and another decreased cancel, and both behaviours dull. Methods such as TIES and DARE try to reduce that interference by keeping the large coordinates and thinning the rest. They are heuristics for choosing a point. They are not a proof that the tasks compose.

## The move

Build the vector as fine-tune minus base, for each task, from the same base. Apply one vector first and confirm that the edited model moves the intended task and leaves a control task alone. Then apply two, at a scale you chose on held-out examples, and measure both tasks plus the control. A gain on the training tasks of the endpoints is not the measurement. The measurement is the merged point, on examples that did not pick the scale.

If the control moves, the direction was not specific to the task. If one task collapses, the directions interfered, and no amount of calling the result a merged model repairs the evaluation.

## What this stops

Treating a merged checkpoint as the sum of the capabilities named in the fine-tunes. Capabilities are scores on tasks. The merge is a point. The scores have to be rerun.
