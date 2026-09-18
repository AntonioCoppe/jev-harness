---
title: "Cyber Alert Triage"
description: "Triage SOC/SIEM alerts: notify, queue for review, or suppress — with actionable + needs_human gates."
---

# Cyber Alert Triage

`cyber-alert-triage` · category [`confidence-front-door`](/recipes/#confidence-front-door)

Triage SOC/SIEM alerts: notify, queue for review, or suppress — with actionable + needs_human gates.

## Catalog

| Field | Value |
|---|---|
| **ID** | `cyber-alert-triage` |
| **Category** | [`confidence-front-door`](/recipes/#confidence-front-door) |
| **Module** | [`recipes/confidence-front-door/cyber-alert-triage.ts`](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/confidence-front-door/cyber-alert-triage.ts) |
| **Runner** | `runCyberAlertTriage` |
| **Default min confidence** | `0.55` |
| **On low confidence** | `review` |
| **Actions** | `notify`, `queue_review`, `suppress` |
| **Tags** | `alerts`, `security`, `soc`, `paging`, `on-call`, `triage` |

## Questions

| Name | Kind |
|---|---|
| `disposition` | `choice` |
| `severity` | `score` |
| `needs_human` | `noul` |
| `actionable` | `noul` |

## Import

```ts
import { runCyberAlertTriage } from "jev-harness/recipes";
```

See also: [Recipes index](/recipes/), [Taxonomy](/taxonomy), [source](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/confidence-front-door/cyber-alert-triage.ts).
