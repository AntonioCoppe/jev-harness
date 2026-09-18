---
title: "On-call Page"
description: "Decide whether an event should page on-call, soft-notify, defer, or be ignored."
---

# On-call Page

`oncall-page` · category [`confidence-front-door`](/recipes/#confidence-front-door)

Decide whether an event should page on-call, soft-notify, defer, or be ignored.

## Catalog

| Field | Value |
|---|---|
| **ID** | `oncall-page` |
| **Category** | [`confidence-front-door`](/recipes/#confidence-front-door) |
| **Module** | [`recipes/confidence-front-door/oncall-page.ts`](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/confidence-front-door/oncall-page.ts) |
| **Runner** | `runOncallPage` |
| **Default min confidence** | `0.55` |
| **On low confidence** | `review` |
| **Actions** | `page_now`, `notify_slack`, `defer`, `ignore` |
| **Tags** | `on-call`, `paging`, `routing` |

## Questions

| Name | Kind |
|---|---|
| `action` | `choice` |
| `urgency` | `score` |
| `actionable` | `noul` |

## Import

```ts
import { runOncallPage } from "jev-harness/recipes";
```

See also: [Recipes index](/recipes/), [Taxonomy](/taxonomy), [source](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/confidence-front-door/oncall-page.ts).
