---
title: "Sports Bet Gate"
description: "Bet / no-bet / shop-elsewhere gate with edge score and CLV filter."
---

# Sports Bet Gate

`sports-bet-gate` · category [`high-freq-reflex`](/recipes/#high-freq-reflex)

Bet / no-bet / shop-elsewhere gate with edge score and CLV filter.

## Catalog

| Field | Value |
|---|---|
| **ID** | `sports-bet-gate` |
| **Category** | [`high-freq-reflex`](/recipes/#high-freq-reflex) |
| **Module** | [`recipes/sports-bet-gate/sports-bet-gate.ts`](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/sports-bet-gate/sports-bet-gate.ts) |
| **Runner** | `runSportsBetGate` |
| **Default min confidence** | `0.55` |
| **On low confidence** | `suppress` |
| **Actions** | `bet`, `no_bet`, `shop_elsewhere` |
| **Tags** | `sports-bet`, `clv`, `reflex`, `latency` |

## Questions

| Name | Kind |
|---|---|
| `bet` | `noul` |
| `book` | `choice` |
| `edge` | `score` |
| `meets_clv_filter` | `noul` |
| `liquidity_ok` | `score` |

## Import

```ts
import { runSportsBetGate } from "jev-harness/recipes";
```

See also: [Recipes index](/recipes/), [Taxonomy](/taxonomy), [source](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/sports-bet-gate/sports-bet-gate.ts).
