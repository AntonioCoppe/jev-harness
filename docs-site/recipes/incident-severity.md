---
title: "Incident Severity"
description: "Classify incident severity from signals, blast radius, and customer impact."
---

# Incident Severity

`incident-severity` · category [`confidence-front-door`](/recipes/#confidence-front-door)

Classify incident severity from signals, blast radius, and customer impact.

## Catalog

| Field | Value |
|---|---|
| **ID** | `incident-severity` |
| **Category** | [`confidence-front-door`](/recipes/#confidence-front-door) |
| **Module** | [`recipes/confidence-front-door/incident-severity.ts`](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/confidence-front-door/incident-severity.ts) |
| **Runner** | `runIncidentSeverity` |
| **Default min confidence** | `0.55` |
| **On low confidence** | `review` |
| **Actions** | `sev1`, `sev2`, `sev3`, `sev4` |
| **Tags** | `incident`, `severity`, `routing` |

## Questions

| Name | Kind |
|---|---|
| `severity` | `choice` |
| `blast_radius` | `score` |
| `customer_facing` | `noul` |

## Import

```ts
import { runIncidentSeverity } from "jev-harness/recipes";
```

See also: [Recipes index](/recipes/), [Taxonomy](/taxonomy), [source](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/confidence-front-door/incident-severity.ts).
