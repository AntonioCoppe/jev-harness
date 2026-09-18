---
title: "MM Buy Sell"
description: "Block-time buy/sell/hold reflex from a compact book snapshot."
---

# MM Buy Sell

`mm-buy-sell` · category [`high-freq-reflex`](/recipes/#high-freq-reflex)

Block-time buy/sell/hold reflex from a compact book snapshot.

## Catalog

| Field | Value |
|---|---|
| **ID** | `mm-buy-sell` |
| **Category** | [`high-freq-reflex`](/recipes/#high-freq-reflex) |
| **Module** | [`recipes/high-freq-reflex/mm-buy-sell.ts`](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/high-freq-reflex/mm-buy-sell.ts) |
| **Runner** | `runMmBuySell` |
| **Default min confidence** | `0.45` |
| **On low confidence** | `suppress` |
| **Actions** | `buy`, `sell`, `hold` |
| **Tags** | `latency`, `trading`, `reflex` |

## Questions

| Name | Kind |
|---|---|
| `side` | `choice` |
| `edge` | `score` |

## Import

```ts
import { runMmBuySell } from "jev-harness/recipes";
```

See also: [Recipes index](/recipes/), [Taxonomy](/taxonomy), [source](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/high-freq-reflex/mm-buy-sell.ts).
