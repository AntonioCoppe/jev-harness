---
title: "Model Cost Router"
description: "Route prompts to cheap/mid/frontier with a cheap-first bias; escalate on low confidence."
---

# Model Cost Router

`model-cost-router` · category [`confidence-front-door`](/recipes/#confidence-front-door)

Route prompts to cheap/mid/frontier with a cheap-first bias; escalate on low confidence.

## Catalog

| Field | Value |
|---|---|
| **ID** | `model-cost-router` |
| **Category** | [`confidence-front-door`](/recipes/#confidence-front-door) |
| **Module** | [`recipes/confidence-front-door/model-cost-router.ts`](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/confidence-front-door/model-cost-router.ts) |
| **Runner** | `runModelCostRouter` |
| **Default min confidence** | `0.5` |
| **On low confidence** | `escalate_llm` |
| **Actions** | `cheap`, `mid`, `frontier` |
| **Tags** | `routing`, `cost`, `llm`, `proof` |

## Questions

| Name | Kind |
|---|---|
| `tier` | `choice` |
| `risk` | `score` |

## Import

```ts
import { runModelCostRouter } from "jev-harness/recipes";
```

See also: [Recipes index](/recipes/), [Taxonomy](/taxonomy), [source](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/confidence-front-door/model-cost-router.ts).
