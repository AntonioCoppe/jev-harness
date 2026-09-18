---
title: "Esports Reflex"
description: "Pick the next legal game action from engine candidates; stop or regroup on Noul."
---

# Esports Reflex

`esports-reflex` · category [`candidate-action-selection`](/recipes/#candidate-action-selection)

Pick the next legal game action from engine candidates; stop or regroup on Noul.

## Catalog

| Field | Value |
|---|---|
| **ID** | `esports-reflex` |
| **Category** | [`candidate-action-selection`](/recipes/#candidate-action-selection) |
| **Module** | [`recipes/candidate-action-selection/esports-reflex.ts`](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/candidate-action-selection/esports-reflex.ts) |
| **Runner** | `runEsportsReflex` |
| **Default min confidence** | `0.45` |
| **On low confidence** | `review` |
| **Actions** | `<candidate-id>`, `STOP`, `REGROUP` |
| **Tags** | `games`, `esports`, `reflex`, `candidates`, `latency` |

## Questions

| Name | Kind |
|---|---|
| `legal_action` | `choice` |
| `urgency` | `score` |
| `done` | `noul` |
| `regroup` | `noul` |

## Import

```ts
import { runEsportsReflex } from "jev-harness/recipes";
```

See also: [Recipes index](/recipes/), [Taxonomy](/taxonomy), [source](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/candidate-action-selection/esports-reflex.ts).
