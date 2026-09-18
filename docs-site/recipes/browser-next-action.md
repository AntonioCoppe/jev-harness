---
title: "Browser Next Action"
description: "Pick the next click/candidate in computer-use or wiki-race flows."
---

# Browser Next Action

`browser-next-action` · category [`candidate-action-selection`](/recipes/#candidate-action-selection)

Pick the next click/candidate in computer-use or wiki-race flows.

## Catalog

| Field | Value |
|---|---|
| **ID** | `browser-next-action` |
| **Category** | [`candidate-action-selection`](/recipes/#candidate-action-selection) |
| **Module** | [`recipes/candidate-action-selection/browser-next-action.ts`](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/candidate-action-selection/browser-next-action.ts) |
| **Runner** | `runBrowserNextAction` |
| **Default min confidence** | `0.45` |
| **On low confidence** | `review` |
| **Actions** | `<candidate-id>`, `STOP` |
| **Tags** | `ui-grounding`, `browser`, `computer-use` |

## Questions

| Name | Kind |
|---|---|
| `next` | `choice` |
| `done` | `noul` |

## Import

```ts
import { runBrowserNextAction } from "jev-harness/recipes";
```

See also: [Recipes index](/recipes/), [Taxonomy](/taxonomy), [source](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/candidate-action-selection/browser-next-action.ts).
