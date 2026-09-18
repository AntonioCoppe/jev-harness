---
title: "RTB Bid Gate"
description: "Pre-bid filter: bid, pass, or block on brand-safety + IVT risk for RTB auctions."
---

# RTB Bid Gate

`rtb-bid-gate` · category [`high-freq-reflex`](/recipes/#high-freq-reflex)

Pre-bid filter: bid, pass, or block on brand-safety + IVT risk for RTB auctions.

## Catalog

| Field | Value |
|---|---|
| **ID** | `rtb-bid-gate` |
| **Category** | [`high-freq-reflex`](/recipes/#high-freq-reflex) |
| **Module** | [`recipes/high-freq-reflex/rtb-bid-gate.ts`](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/high-freq-reflex/rtb-bid-gate.ts) |
| **Runner** | `runRtbBidGate` |
| **Default min confidence** | `0.5` |
| **On low confidence** | `suppress` |
| **Actions** | `bid`, `pass`, `block` |
| **Tags** | `ads`, `rtb`, `brand-safety`, `ivt`, `latency`, `reflex` |

## Questions

| Name | Kind |
|---|---|
| `bid` | `noul` |
| `brand_safety` | `choice` |
| `ivt_risk` | `score` |
| `creative_page_align` | `noul` |

## Import

```ts
import { runRtbBidGate } from "jev-harness/recipes";
```

See also: [Recipes index](/recipes/), [Taxonomy](/taxonomy), [source](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/high-freq-reflex/rtb-bid-gate.ts).
