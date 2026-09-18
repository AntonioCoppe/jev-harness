---
title: "Ticket Fanout"
description: "Speculative multi-question ticket briefing in one RTT; route or escalate."
---

# Ticket Fanout

`ticket-fanout` · category [`live-multi-judgment`](/recipes/#live-multi-judgment)

Speculative multi-question ticket briefing in one RTT; route or escalate.

## Catalog

| Field | Value |
|---|---|
| **ID** | `ticket-fanout` |
| **Category** | [`live-multi-judgment`](/recipes/#live-multi-judgment) |
| **Module** | [`recipes/live-multi-judgment/ticket-fanout.ts`](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/live-multi-judgment/ticket-fanout.ts) |
| **Runner** | `runTicketFanout` |
| **Default min confidence** | `0.5` |
| **On low confidence** | `review` |
| **Actions** | `billing`, `bug`, `how_to`, `account`, `other`, `escalate` |
| **Tags** | `live`, `fan-out`, `support`, `ticket` |

## Questions

| Name | Kind |
|---|---|
| `category` | `choice` |
| `severity` | `score` |
| `refund` | `noul` |
| `has_repro` | `noul` |
| `frustration` | `score` |

## Import

```ts
import { runTicketFanout } from "jev-harness/recipes";
```

See also: [Recipes index](/recipes/), [Taxonomy](/taxonomy), [source](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/live-multi-judgment/ticket-fanout.ts).
