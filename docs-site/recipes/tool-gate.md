---
title: "Tool Gate"
description: "Gate a proposed tool call by risk class, policy, blast radius, then handoff disposition."
---

# Tool Gate

`tool-gate` · category [`verify-gate`](/recipes/#verify-gate)

Gate a proposed tool call by risk class, policy, blast radius, then handoff disposition.

## Catalog

| Field | Value |
|---|---|
| **ID** | `tool-gate` |
| **Category** | [`verify-gate`](/recipes/#verify-gate) |
| **Module** | [`recipes/agent-comm-harness/tool-gate.ts`](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/agent-comm-harness/tool-gate.ts) |
| **Runner** | `runToolGate` |
| **Default min confidence** | `0.6` |
| **On low confidence** | `suppress` |
| **Actions** | `continue`, `ask_user`, `escalate_specialist`, `abort` |
| **Tags** | `agent-comm`, `agent-comm-harness`, `tools`, `gate` |

## Questions

| Name | Kind |
|---|---|
| `risk_class` | `choice` |
| `policy_ok` | `noul` |
| `irreversible` | `noul` |
| `blast_radius` | `score` |
| `handoff` | `choice` |

## Import

```ts
import { runToolGate } from "jev-harness/recipes";
```

See also: [Recipes index](/recipes/), [Taxonomy](/taxonomy), [source](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/agent-comm-harness/tool-gate.ts).
