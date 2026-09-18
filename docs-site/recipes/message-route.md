---
title: "Message Route"
description: "Route an inter-agent message to a specialist, broadcast, drop, or escalate (secret-aware)."
---

# Message Route

`message-route` · category [`confidence-front-door`](/recipes/#confidence-front-door)

Route an inter-agent message to a specialist, broadcast, drop, or escalate (secret-aware).

## Catalog

| Field | Value |
|---|---|
| **ID** | `message-route` |
| **Category** | [`confidence-front-door`](/recipes/#confidence-front-door) |
| **Module** | [`recipes/agent-comm-harness/message-route.ts`](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/agent-comm-harness/message-route.ts) |
| **Runner** | `runMessageRoute` |
| **Default min confidence** | `0.55` |
| **On low confidence** | `review` |
| **Actions** | `<specialist-id>`, `broadcast`, `drop`, `escalate` |
| **Tags** | `agent-comm-harness`, `routing`, `multi-agent`, `bus`, `secrets` |

## Questions

| Name | Kind |
|---|---|
| `route` | `choice` |
| `urgency` | `score` |
| `contains_secrets` | `noul` |
| `escalate` | `noul` |

## Import

```ts
import { runMessageRoute } from "jev-harness/recipes";
```

See also: [Recipes index](/recipes/), [Taxonomy](/taxonomy), [source](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/agent-comm-harness/message-route.ts).
