---
title: "Stop or Continue"
description: "Decide whether an agent loop should keep going, stop, or ask the user."
---

# Stop or Continue

`stop-or-continue` · category [`candidate-action-selection`](/recipes/#candidate-action-selection)

Decide whether an agent loop should keep going, stop, or ask the user.

## Catalog

| Field | Value |
|---|---|
| **ID** | `stop-or-continue` |
| **Category** | [`candidate-action-selection`](/recipes/#candidate-action-selection) |
| **Module** | [`recipes/candidate-action-selection/stop-or-continue.ts`](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/candidate-action-selection/stop-or-continue.ts) |
| **Runner** | `runStopOrContinue` |
| **Default min confidence** | `0.5` |
| **On low confidence** | `review` |
| **Actions** | `continue`, `stop`, `ask_user` |
| **Tags** | `loops`, `control`, `stop-noul` |

## Questions

| Name | Kind |
|---|---|
| `disposition` | `choice` |
| `progress` | `score` |
| `stuck` | `noul` |

## Import

```ts
import { runStopOrContinue } from "jev-harness/recipes";
```

See also: [Recipes index](/recipes/), [Taxonomy](/taxonomy), [source](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/candidate-action-selection/stop-or-continue.ts).
