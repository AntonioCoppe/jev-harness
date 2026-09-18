---
title: "Swarm Consensus"
description: "Judge multi-agent debate: consensus?, winner, evidence quality, fatal objection → disposition."
---

# Swarm Consensus

`swarm-consensus` · category [`composite-rubric`](/recipes/#composite-rubric)

Judge multi-agent debate: consensus?, winner, evidence quality, fatal objection → disposition.

## Catalog

| Field | Value |
|---|---|
| **ID** | `swarm-consensus` |
| **Category** | [`composite-rubric`](/recipes/#composite-rubric) |
| **Module** | [`recipes/agent-comm-harness/swarm-consensus.ts`](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/agent-comm-harness/swarm-consensus.ts) |
| **Runner** | `runSwarmConsensus` |
| **Default min confidence** | `0.55` |
| **On low confidence** | `review` |
| **Actions** | `adopt`, `another_round`, `escalate_human`, `abort` |
| **Tags** | `swarm`, `debate`, `consensus`, `multi-agent`, `judge`, `agent-comm-harness` |

## Questions

| Name | Kind |
|---|---|
| `consensus_reached` | `noul` |
| `winner` | `choice` |
| `evidence_quality` | `score` |
| `fatal_objection` | `noul` |
| `disposition` | `choice` |

## Import

```ts
import { runSwarmConsensus } from "jev-harness/recipes";
```

See also: [Recipes index](/recipes/), [Taxonomy](/taxonomy), [source](https://github.com/AntonioCoppe/jev-harness/blob/main/recipes/agent-comm-harness/swarm-consensus.ts).
