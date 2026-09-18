---
title: "Tool Exec Gate"
description: "Allow/deny tool execution with risk class, policy Noul, and blast-radius Score."
---

# Tool Exec Gate

`tool-exec-gate` · category [`verify-gate`](/recipes/#verify-gate)

Allow/deny tool execution with risk class, policy Noul, and blast-radius Score.

## Catalog

| Field | Value |
|---|---|
| **ID** | `tool-exec-gate` |
| **Category** | [`verify-gate`](/recipes/#verify-gate) |
| **Module** | [`recipes/agent-comm-harness/tool-exec-gate.ts`](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/agent-comm-harness/tool-exec-gate.ts) |
| **Runner** | `runToolExecGate` |
| **Default min confidence** | `0.55` |
| **On low confidence** | `suppress` |
| **Actions** | `exec`, `ask_user`, `escalate`, `deny` |
| **Tags** | `agent-comm`, `agent-comm-harness`, `tools`, `allowlist`, `gate` |

## Questions

| Name | Kind |
|---|---|
| `risk_class` | `choice` |
| `policy_ok` | `noul` |
| `irreversible` | `noul` |
| `blast_radius` | `score` |

## Import

```ts
import { runToolExecGate } from "jev-harness/recipes";
```

See also: [Recipes index](/recipes/), [Taxonomy](/taxonomy), [source](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/agent-comm-harness/tool-exec-gate.ts).
