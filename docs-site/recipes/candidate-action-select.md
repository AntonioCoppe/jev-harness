---
title: "Candidate Action Select"
description: "Choice over a dynamic candidate set (+ optional stop Noul) for perception→act loops."
---

# Candidate Action Select

`candidate-action-select` · category [`candidate-action-selection`](/recipes/#candidate-action-selection)

Choice over a dynamic candidate set (+ optional stop Noul) for perception→act loops.

## Catalog

| Field | Value |
|---|---|
| **ID** | `candidate-action-select` |
| **Category** | [`candidate-action-selection`](/recipes/#candidate-action-selection) |
| **Module** | [`recipes/candidate-action-selection/candidate-action-select.ts`](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/candidate-action-selection/candidate-action-select.ts) |
| **Runner** | `runCandidateActionSelect` |
| **Default min confidence** | `0.45` |
| **On low confidence** | `review` |
| **Actions** | `<candidate-id>`, `STOP` |
| **Tags** | `ui-grounding`, `candidates`, `computer-use` |

## Questions

| Name | Kind |
|---|---|
| `next` | `choice` |
| `done` | `noul` |

## Import

```ts
import { runCandidateActionSelect } from "jev-harness/recipes";
```

See also: [Recipes index](/recipes/), [Taxonomy](/taxonomy), [source](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/candidate-action-selection/candidate-action-select.ts).
