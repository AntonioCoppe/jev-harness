---
title: "Tool Picker"
description: "Pick which tool to invoke next from a declared catalog, or decline."
---

# Tool Picker

`tool-picker` · category [`candidate-action-selection`](/recipes/#candidate-action-selection)

Pick which tool to invoke next from a declared catalog, or decline.

## Catalog

| Field | Value |
|---|---|
| **ID** | `tool-picker` |
| **Category** | [`candidate-action-selection`](/recipes/#candidate-action-selection) |
| **Module** | [`recipes/candidate-action-selection/tool-picker.ts`](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/candidate-action-selection/tool-picker.ts) |
| **Runner** | `runToolPicker` |
| **Default min confidence** | `0.5` |
| **On low confidence** | `review` |
| **Actions** | `<tool-id>`, `none` |
| **Tags** | `tools`, `planning`, `candidates` |

## Questions

| Name | Kind |
|---|---|
| `tool` | `choice` |
| `necessary` | `noul` |

## Import

```ts
import { runToolPicker } from "jev-harness/recipes";
```

See also: [Recipes index](/recipes/), [Taxonomy](/taxonomy), [source](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/candidate-action-selection/tool-picker.ts).
