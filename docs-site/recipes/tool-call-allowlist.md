---
title: "Tool Call Allowlist"
description: "Gate a proposed tool call against policy / allowlist before execution."
---

# Tool Call Allowlist

`tool-call-allowlist` · category [`verify-gate`](/recipes/#verify-gate)

Gate a proposed tool call against policy / allowlist before execution.

## Catalog

| Field | Value |
|---|---|
| **ID** | `tool-call-allowlist` |
| **Category** | [`verify-gate`](/recipes/#verify-gate) |
| **Module** | [`recipes/verify-gate/tool-call-allowlist.ts`](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/verify-gate/tool-call-allowlist.ts) |
| **Runner** | `runToolCallAllowlist` |
| **Default min confidence** | `0.6` |
| **On low confidence** | `review` |
| **Actions** | `allow`, `deny`, `require_confirm` |
| **Tags** | `tools`, `allowlist`, `gate` |

## Questions

| Name | Kind |
|---|---|
| `verdict` | `choice` |
| `args_safe` | `noul` |
| `intent_aligned` | `noul` |

## Import

```ts
import { runToolCallAllowlist } from "jev-harness/recipes";
```

See also: [Recipes index](/recipes/), [Taxonomy](/taxonomy), [source](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/verify-gate/tool-call-allowlist.ts).
