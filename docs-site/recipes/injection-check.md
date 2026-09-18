---
title: "Injection Check"
description: "Detect prompt injection / jailbreak attempts in untrusted input."
---

# Injection Check

`injection-check` · category [`verify-gate`](/recipes/#verify-gate)

Detect prompt injection / jailbreak attempts in untrusted input.

## Catalog

| Field | Value |
|---|---|
| **ID** | `injection-check` |
| **Category** | [`verify-gate`](/recipes/#verify-gate) |
| **Module** | [`recipes/verify-gate/injection-check.ts`](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/verify-gate/injection-check.ts) |
| **Runner** | `runInjectionCheck` |
| **Default min confidence** | `0.55` |
| **On low confidence** | `review` |
| **Actions** | `pass`, `sanitize`, `block` |
| **Tags** | `injection`, `security`, `gate` |

## Questions

| Name | Kind |
|---|---|
| `disposition` | `choice` |
| `severity` | `score` |
| `is_injection` | `noul` |

## Import

```ts
import { runInjectionCheck } from "jev-harness/recipes";
```

See also: [Recipes index](/recipes/), [Taxonomy](/taxonomy), [source](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/verify-gate/injection-check.ts).
