---
title: "Row Semantic Match"
description: "Judge whether one JSON/DB row matches a natural-language predicate."
---

# Row Semantic Match

`row-semantic-match` · category [`row-judgment`](/recipes/#row-judgment)

Judge whether one JSON/DB row matches a natural-language predicate.

## Catalog

| Field | Value |
|---|---|
| **ID** | `row-semantic-match` |
| **Category** | [`row-judgment`](/recipes/#row-judgment) |
| **Module** | [`recipes/row-judgment/row-semantic-match.ts`](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/row-judgment/row-semantic-match.ts) |
| **Runner** | `runRowSemanticMatch` |
| **Default min confidence** | `0.5` |
| **On low confidence** | `review` |
| **Actions** | `include`, `exclude`, `review` |
| **Tags** | `structured-data-filter`, `semantic-where`, `data` |

## Questions

| Name | Kind |
|---|---|
| `matches` | `noul` |
| `strength` | `score` |

## Import

```ts
import { runRowSemanticMatch } from "jev-harness/recipes";
```

See also: [Recipes index](/recipes/), [Taxonomy](/taxonomy), [source](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/row-judgment/row-semantic-match.ts).
