---
title: "Model Router"
description: "Route a user prompt to cheap / mid / frontier tiers by difficulty and risk."
---

# Model Router

`model-router` · category [`confidence-front-door`](/recipes/#confidence-front-door)

Route a user prompt to cheap / mid / frontier tiers by difficulty and risk.

## Catalog

| Field | Value |
|---|---|
| **ID** | `model-router` |
| **Category** | [`confidence-front-door`](/recipes/#confidence-front-door) |
| **Module** | [`recipes/confidence-front-door/model-router.ts`](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/confidence-front-door/model-router.ts) |
| **Runner** | `runModelRouter` |
| **Default min confidence** | `0.5` |
| **On low confidence** | `escalate_llm` |
| **Actions** | `cheap`, `mid`, `frontier` |
| **Tags** | `routing`, `cost`, `llm` |

## Questions

| Name | Kind |
|---|---|
| `tier` | `choice` |
| `risk` | `score` |

## Import

```ts
import { runModelRouter } from "jev-harness/recipes";
```

See also: [Recipes index](/recipes/), [Taxonomy](/taxonomy), [source](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/confidence-front-door/model-router.ts).
