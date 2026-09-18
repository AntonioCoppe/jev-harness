---
title: "Order Allow Deny"
description: "Pre-trade allow/deny/cancel/hold gate with edge, risk, and news-conflict checks."
---

# Order Allow Deny

`order-allow-deny` · category [`high-freq-reflex`](/recipes/#high-freq-reflex)

Pre-trade allow/deny/cancel/hold gate with edge, risk, and news-conflict checks.

## Catalog

| Field | Value |
|---|---|
| **ID** | `order-allow-deny` |
| **Category** | [`high-freq-reflex`](/recipes/#high-freq-reflex) |
| **Module** | [`recipes/high-freq-reflex/order-allow-deny.ts`](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/high-freq-reflex/order-allow-deny.ts) |
| **Runner** | `runOrderAllowDeny` |
| **Default min confidence** | `0.5` |
| **On low confidence** | `suppress` |
| **Actions** | `allow`, `deny`, `cancel`, `hold` |
| **Tags** | `latency`, `trading`, `gate`, `risk`, `reflex` |

## Questions

| Name | Kind |
|---|---|
| `allow_order` | `noul` |
| `side_intent` | `choice` |
| `edge` | `score` |
| `risk` | `score` |
| `news_conflict` | `noul` |

## Import

```ts
import { runOrderAllowDeny } from "jev-harness/recipes";
```

See also: [Recipes index](/recipes/), [Taxonomy](/taxonomy), [source](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/high-freq-reflex/order-allow-deny.ts).
