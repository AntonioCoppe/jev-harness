---
title: "Fraud Score Gate"
description: "Score payment/login fraud risk and dispose: allow, step-up, deny, or review."
---

# Fraud Score Gate

`fraud-score-gate` · category [`high-freq-reflex`](/recipes/#high-freq-reflex)

Score payment/login fraud risk and dispose: allow, step-up, deny, or review.

## Catalog

| Field | Value |
|---|---|
| **ID** | `fraud-score-gate` |
| **Category** | [`high-freq-reflex`](/recipes/#high-freq-reflex) |
| **Module** | [`recipes/high-freq-reflex/fraud-score-gate.ts`](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/high-freq-reflex/fraud-score-gate.ts) |
| **Runner** | `runFraudScoreGate` |
| **Default min confidence** | `0.55` |
| **On low confidence** | `review` |
| **Actions** | `allow`, `step_up`, `deny`, `review` |
| **Tags** | `fraud`, `payments`, `login`, `risk`, `latency`, `reflex` |

## Questions

| Name | Kind |
|---|---|
| `fraud_risk` | `score` |
| `disposition` | `choice` |
| `device_anomaly` | `noul` |
| `velocity_anomaly` | `noul` |

## Import

```ts
import { runFraudScoreGate } from "jev-harness/recipes";
```

See also: [Recipes index](/recipes/), [Taxonomy](/taxonomy), [source](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/high-freq-reflex/fraud-score-gate.ts).
