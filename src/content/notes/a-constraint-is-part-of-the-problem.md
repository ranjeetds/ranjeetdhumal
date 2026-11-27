---
title: A constraint is part of the problem
description: A constraint restricts the answers you are willing to accept. An unconstrained minimum can sit outside that set.
topic: mathematics
maturity: budding
publishedAt: 2026-11-27
tags: [optimization, constraints]
objectives:
  - Write a constraint as part of the problem, beside the objective.
  - Distinguish a penalty from a constraint that actually binds.
---

An objective says what you want smaller. A constraint says which answers are allowed. "Minimize the loss, using weights of any size" is a different problem from "minimize the loss, using weights whose squares sum to at most one." The second problem can have a higher loss. That is not a worse solution. It is the solution of the problem you stated. The unconstrained minimum is the solution of a problem you did not state.

[Regularization is a second constraint](/knowledge/regularization-is-a-second-constraint) is the statistical version: a penalty adds a cost, and a hard limit refuses a region. A penalty is softer. A large enough weight can still buy its way through, if the loss drop pays the penalty. A constraint that rejects infeasible points cannot be bought through. When the requirement is a requirement — a probability that adds to one, a permission the tool does not have, a budget — a penalty is the wrong shape.

## What the optimum moves toward

At the solution of a constrained problem, the objective's slope and the constraint's slope line up. You cannot decrease the loss without stepping outside the allowed set. If your answer sits in the interior and the slope is not zero, you have not finished. If it sits on the boundary, the binding constraint is part of the reason the loss is what it is. Report the constraint with the number, or the number reads as the best the model could do, rather than the best inside the set you allowed.

## What this does not say

Writing a constraint down does not make it the right constraint. A budget, a weight limit, and a permission are judgements. The mathematics only insists that the judgement appear in the problem. An objective that hides the judgement inside a convenient penalty will solve the convenient problem.
