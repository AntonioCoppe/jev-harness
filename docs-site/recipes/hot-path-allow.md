---
title: "Hot Path Allow"
description: "Sub-100ms allow/deny reflex on a compact hot-path event."
---

# Hot Path Allow

`hot-path-allow` · category [`high-freq-reflex`](/recipes/#high-freq-reflex)

Sub-100ms allow/deny reflex on a compact hot-path event.

## Catalog

| Field | Value |
|---|---|
| **ID** | `hot-path-allow` |
| **Category** | [`high-freq-reflex`](/recipes/#high-freq-reflex) |
| **Module** | [`recipes/high-freq-reflex/hot-path-allow.ts`](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/high-freq-reflex/hot-path-allow.ts) |
| **Runner** | `runHotPathAllow` |
| **Default min confidence** | `0.5` |
| **On low confidence** | `review` |
| **Actions** | `allow`, `deny` |
| **Tags** | `latency`, `gate`, `reflex` |

## Questions

| Name | Kind |
|---|---|
| `allow` | `noul` |
| `severity` | `score` |

## Import

```ts
import { runHotPathAllow } from "jev-harness/recipes";
```

See also: [Recipes index](/recipes/), [Taxonomy](/taxonomy), [source](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/high-freq-reflex/hot-path-allow.ts).
