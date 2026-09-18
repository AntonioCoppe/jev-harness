---
title: "Typewriter Panel"
description: "Live multi-score editor panel: tone, clarity, urgency, AI-written, intent on a draft."
---

# Typewriter Panel

`typewriter-panel` · category [`live-multi-judgment`](/recipes/#live-multi-judgment)

Live multi-score editor panel: tone, clarity, urgency, AI-written, intent on a draft.

## Catalog

| Field | Value |
|---|---|
| **ID** | `typewriter-panel` |
| **Category** | [`live-multi-judgment`](/recipes/#live-multi-judgment) |
| **Module** | [`recipes/live-multi-judgment/typewriter-panel.ts`](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/live-multi-judgment/typewriter-panel.ts) |
| **Runner** | `runTypewriterPanel` |
| **Default min confidence** | `0.4` |
| **On low confidence** | `proceed` |
| **Actions** | `update_ui` |
| **Tags** | `live`, `fan-out`, `editor`, `typewriter` |

## Questions

| Name | Kind |
|---|---|
| `tone` | `score` |
| `clarity` | `score` |
| `urgent` | `noul` |
| `ai_written` | `noul` |
| `intent` | `choice` |

## Import

```ts
import { runTypewriterPanel } from "jev-harness/recipes";
```

See also: [Recipes index](/recipes/), [Taxonomy](/taxonomy), [source](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/live-multi-judgment/typewriter-panel.ts).
