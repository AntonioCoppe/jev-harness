---
title: "Ship Gate"
description: "Allow / revise / block a candidate output before ship; suppress on low confidence."
---

# Ship Gate

`ship-gate` · category [`verify-gate`](/recipes/#verify-gate)

Allow / revise / block a candidate output before ship; suppress on low confidence.

## Catalog

| Field | Value |
|---|---|
| **ID** | `ship-gate` |
| **Category** | [`verify-gate`](/recipes/#verify-gate) |
| **Module** | [`recipes/verify-gate/ship-gate.ts`](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/verify-gate/ship-gate.ts) |
| **Runner** | `runShipGate` |
| **Default min confidence** | `0.65` |
| **On low confidence** | `suppress` |
| **Actions** | `ship`, `revise`, `block` |
| **Tags** | `safety`, `verification`, `ship`, `proof` |

## Questions

| Name | Kind |
|---|---|
| `verdict` | `choice` |
| `grounded` | `noul` |
| `unsafe` | `noul` |

## Import

```ts
import { runShipGate } from "jev-harness/recipes";
```

See also: [Recipes index](/recipes/), [Taxonomy](/taxonomy), [source](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/verify-gate/ship-gate.ts).
