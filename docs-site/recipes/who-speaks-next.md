---
title: "Who Speaks Next"
description: "Pick the next multi-agent speaker (agent id / user / none) with handoff + user-turn gates."
---

# Who Speaks Next

`who-speaks-next` · category [`candidate-action-selection`](/recipes/#candidate-action-selection)

Pick the next multi-agent speaker (agent id / user / none) with handoff + user-turn gates.

## Catalog

| Field | Value |
|---|---|
| **ID** | `who-speaks-next` |
| **Category** | [`candidate-action-selection`](/recipes/#candidate-action-selection) |
| **Module** | [`recipes/agent-comm-harness/who-speaks-next.ts`](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/agent-comm-harness/who-speaks-next.ts) |
| **Runner** | `runWhoSpeaksNext` |
| **Default min confidence** | `0.5` |
| **On low confidence** | `review` |
| **Actions** | `<agent-id>`, `user`, `none` |
| **Tags** | `agent-comm-harness`, `multi-agent`, `handoff`, `selector`, `candidates` |

## Questions

| Name | Kind |
|---|---|
| `next_speaker` | `choice` |
| `progress` | `score` |
| `needs_handoff` | `noul` |
| `user_turn` | `noul` |

## Import

```ts
import { runWhoSpeaksNext } from "jev-harness/recipes";
```

See also: [Recipes index](/recipes/), [Taxonomy](/taxonomy), [source](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/agent-comm-harness/who-speaks-next.ts).
