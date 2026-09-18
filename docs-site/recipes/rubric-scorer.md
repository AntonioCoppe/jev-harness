---
title: "Rubric Scorer"
description: "Score a submission against an ordered multi-dimension rubric."
---

# Rubric Scorer

`rubric-scorer` · category [`composite-rubric`](/recipes/#composite-rubric)

Score a submission against an ordered multi-dimension rubric.

## Catalog

| Field | Value |
|---|---|
| **ID** | `rubric-scorer` |
| **Category** | [`composite-rubric`](/recipes/#composite-rubric) |
| **Module** | [`recipes/composite-rubric/rubric-scorer.ts`](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/composite-rubric/rubric-scorer.ts) |
| **Runner** | `runRubricScorer` |
| **Default min confidence** | `0.5` |
| **On low confidence** | `review` |
| **Actions** | `pass`, `revise`, `fail` |
| **Tags** | `rubric`, `scoring`, `multi-score` |

## Questions

| Name | Kind |
|---|---|
| `<dimension-id>` | `score` |

## Import

```ts
import { runRubricScorer } from "jev-harness/recipes";
```

See also: [Recipes index](/recipes/), [Taxonomy](/taxonomy), [source](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/composite-rubric/rubric-scorer.ts).
