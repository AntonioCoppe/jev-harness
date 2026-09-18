---
title: "Alert Gate"
description: "Gate noisy automated alerts before they page a human."
---

# Alert Gate

`alert-gate` · category [`confidence-front-door`](/recipes/#confidence-front-door)

Gate noisy automated alerts before they page a human.

## Catalog

| Field | Value |
|---|---|
| **ID** | `alert-gate` |
| **Category** | [`confidence-front-door`](/recipes/#confidence-front-door) |
| **Module** | [`recipes/confidence-front-door/alert-gate.ts`](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/confidence-front-door/alert-gate.ts) |
| **Runner** | `runAlertGate` |
| **Default min confidence** | `0.55` |
| **On low confidence** | `review` |
| **Actions** | `notify`, `queue_review`, `suppress` |
| **Tags** | `alerts`, `paging`, `on-call`, `routing` |

## Questions

| Name | Kind |
|---|---|
| `disposition` | `choice` |
| `severity` | `score` |
| `needs_human` | `noul` |

## Import

```ts
import { runAlertGate } from "jev-harness/recipes";
```

See also: [Recipes index](/recipes/), [Taxonomy](/taxonomy), [source](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/confidence-front-door/alert-gate.ts).
