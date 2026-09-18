---
title: "Line Semantic Find"
description: "Pick the best doc line for an NL query, or NONE if nothing fits."
---

# Line Semantic Find

`line-semantic-find` · category [`semantic-find`](/recipes/#semantic-find)

Pick the best doc line for an NL query, or NONE if nothing fits.

## Catalog

| Field | Value |
|---|---|
| **ID** | `line-semantic-find` |
| **Category** | [`semantic-find`](/recipes/#semantic-find) |
| **Module** | [`recipes/semantic-find/line-semantic-find.ts`](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/semantic-find/line-semantic-find.ts) |
| **Runner** | `runLineSemanticFind` |
| **Default min confidence** | `0.5` |
| **On low confidence** | `review` |
| **Actions** | `<line-id>`, `NONE` |
| **Tags** | `search`, `rank`, `lines`, `rag` |

## Questions

| Name | Kind |
|---|---|
| `best` | `choice` |
| `answer_exists` | `noul` |

## Import

```ts
import { runLineSemanticFind } from "jev-harness/recipes";
```

See also: [Recipes index](/recipes/), [Taxonomy](/taxonomy), [source](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/semantic-find/line-semantic-find.ts).
