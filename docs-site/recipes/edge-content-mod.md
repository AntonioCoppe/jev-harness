---
title: "Edge Content Mod"
description: "Edge moderation: allow / warn / review / block with hate/sexual/self-harm/spam fan-out."
---

# Edge Content Mod

`edge-content-mod` · category [`verify-gate`](/recipes/#verify-gate)

Edge moderation: allow / warn / review / block with hate/sexual/self-harm/spam fan-out.

## Catalog

| Field | Value |
|---|---|
| **ID** | `edge-content-mod` |
| **Category** | [`verify-gate`](/recipes/#verify-gate) |
| **Module** | [`recipes/verify-gate/edge-content-mod.ts`](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/verify-gate/edge-content-mod.ts) |
| **Runner** | `runEdgeContentMod` |
| **Default min confidence** | `0.6` |
| **On low confidence** | `review` |
| **Actions** | `allow`, `warn`, `review`, `block` |
| **Tags** | `moderation`, `safety`, `edge`, `live`, `guardrails` |

## Questions

| Name | Kind |
|---|---|
| `verdict` | `choice` |
| `severity` | `score` |
| `hate` | `noul` |
| `sexual` | `noul` |
| `self_harm` | `noul` |
| `spam` | `noul` |

## Import

```ts
import { runEdgeContentMod } from "jev-harness/recipes";
```

See also: [Recipes index](/recipes/), [Taxonomy](/taxonomy), [source](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/verify-gate/edge-content-mod.ts).
