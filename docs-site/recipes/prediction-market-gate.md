---
title: "Prediction Market Gate"
description: "Arb / liquidity-vs-edge gate for prediction markets (post, cancel, hedge, or skip)."
---

# Prediction Market Gate

`prediction-market-gate` · category [`high-freq-reflex`](/recipes/#high-freq-reflex)

Arb / liquidity-vs-edge gate for prediction markets (post, cancel, hedge, or skip).

## Catalog

| Field | Value |
|---|---|
| **ID** | `prediction-market-gate` |
| **Category** | [`high-freq-reflex`](/recipes/#high-freq-reflex) |
| **Module** | [`recipes/prediction-market-gate/prediction-market-gate.ts`](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/prediction-market-gate/prediction-market-gate.ts) |
| **Runner** | `runPredictionMarketGate` |
| **Default min confidence** | `0.5` |
| **On low confidence** | `suppress` |
| **Actions** | `post_bid`, `cancel`, `hedge_other`, `skip` |
| **Tags** | `latency`, `polymarket`, `prediction-market`, `arb`, `liquidity`, `reflex` |

## Questions

| Name | Kind |
|---|---|
| `is_arb` | `noul` |
| `edge_after_costs` | `score` |
| `depth_ok` | `noul` |
| `fair_fresh` | `noul` |
| `tradeoff` | `score` |
| `action` | `choice` |

## Import

```ts
import { runPredictionMarketGate } from "jev-harness/recipes";
```

See also: [Recipes index](/recipes/), [Taxonomy](/taxonomy), [source](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/prediction-market-gate/prediction-market-gate.ts).
