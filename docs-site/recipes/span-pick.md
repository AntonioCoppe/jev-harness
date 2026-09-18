---
title: "Span Pick"
description: "Pick a pre-parsed value/span that satisfies a request, or NONE."
---

# Span Pick

`span-pick` · category [`semantic-find`](/recipes/#semantic-find)

Pick a pre-parsed value/span that satisfies a request, or NONE.

## Catalog

| Field | Value |
|---|---|
| **ID** | `span-pick` |
| **Category** | [`semantic-find`](/recipes/#semantic-find) |
| **Module** | [`recipes/semantic-find/span-pick.ts`](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/semantic-find/span-pick.ts) |
| **Runner** | `runSpanPick` |
| **Default min confidence** | `0.5` |
| **On low confidence** | `review` |
| **Actions** | `<span-id>`, `NONE` |
| **Tags** | `extraction`, `spans`, `candidates` |

## Questions

| Name | Kind |
|---|---|
| `span` | `choice` |
| `none_fit` | `noul` |

## Import

```ts
import { runSpanPick } from "jev-harness/recipes";
```

See also: [Recipes index](/recipes/), [Taxonomy](/taxonomy), [source](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/semantic-find/span-pick.ts).
