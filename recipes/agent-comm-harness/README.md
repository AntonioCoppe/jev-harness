# agent-comm-harness

Intra- / multi-agent communication gates ([`research/crazy-fast-decisions.md`](../../research/crazy-fast-decisions.md) §1): replace LLM selectors and critics with Jev Choice / Score / Noul.

**Product pack** (not a taxonomy root). Categories stay `candidate-action-selection` / `verify-gate` / `confidence-front-door`. Swarm debate judge canonical path: [`recipes/composite-rubric/swarm-consensus.ts`](../composite-rubric/swarm-consensus.ts) (re-exported here).

| Recipe | Role | Catalog category |
|---|---|---|
| `who-speaks-next` | Next speaker / user / none | `candidate-action-selection` |
| `tool-gate` / `tool-exec-gate` | Tool allow/deny + handoff | `verify-gate` |
| `message-route` | Inter-agent bus route | `confidence-front-door` |
| `swarm-consensus` | Debate judge (re-export) | `composite-rubric` |

**Equation:** wasted speaker turns / tool mishaps / misroutes = **$ + wallclock**.

Tags: `agent-comm`, `agent-comm-harness`. Measure YOUR selector latency — do not invent timings.
