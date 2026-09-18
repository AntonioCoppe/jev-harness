---
title: "LLM Verifier"
description: "Verify an LLM or tool output before it ships."
---

# LLM Verifier

`llm-verifier` · category [`verify-gate`](/recipes/#verify-gate)

Verify an LLM or tool output before it ships.

## Catalog

| Field | Value |
|---|---|
| **ID** | `llm-verifier` |
| **Category** | [`verify-gate`](/recipes/#verify-gate) |
| **Module** | [`recipes/verify-gate/llm-verifier.ts`](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/verify-gate/llm-verifier.ts) |
| **Runner** | `runLlmVerifier` |
| **Default min confidence** | `0.6` |
| **On low confidence** | `review` |
| **Actions** | `allow`, `revise`, `block` |
| **Tags** | `safety`, `verification`, `gate` |

## Questions

| Name | Kind |
|---|---|
| `verdict` | `choice` |
| `grounded` | `noul` |
| `jailbreak` | `noul` |

## Import

```ts
import { runLlmVerifier } from "jev-harness/recipes";
```

See also: [Recipes index](/recipes/), [Taxonomy](/taxonomy), [source](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/verify-gate/llm-verifier.ts).
