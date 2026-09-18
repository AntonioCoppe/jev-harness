---
title: "Inbox Triage"
description: "Route inbound messages into bookings, orders, support, spam, or other."
---

# Inbox Triage

`inbox-triage` · category [`confidence-front-door`](/recipes/#confidence-front-door)

Route inbound messages into bookings, orders, support, spam, or other.

## Catalog

| Field | Value |
|---|---|
| **ID** | `inbox-triage` |
| **Category** | [`confidence-front-door`](/recipes/#confidence-front-door) |
| **Module** | [`recipes/confidence-front-door/inbox-triage.ts`](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/confidence-front-door/inbox-triage.ts) |
| **Runner** | `runInboxTriage` |
| **Default min confidence** | `0.55` |
| **On low confidence** | `review` |
| **Actions** | `bookings`, `orders`, `support`, `spam`, `other` |
| **Tags** | `email`, `inbox`, `triage`, `routing` |

## Questions

| Name | Kind |
|---|---|
| `bucket` | `choice` |
| `urgency` | `score` |
| `is_customer` | `noul` |

## Import

```ts
import { runInboxTriage } from "jev-harness/recipes";
```

See also: [Recipes index](/recipes/), [Taxonomy](/taxonomy), [source](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/confidence-front-door/inbox-triage.ts).
