# agent-comm-harness

Intra- / multi-agent communication gates ([`research/crazy-fast-decisions.md`](../../research/crazy-fast-decisions.md) §1): replace LLM selectors and critics with Jev Choice / Score / Noul.

**Product pack** (not a taxonomy root). Categories stay `candidate-action-selection` / `verify-gate`. Swarm debate judge lives at [`recipes/composite-rubric/swarm-consensus.ts`](../composite-rubric/swarm-consensus.ts).

| Recipe | Role | Catalog category |
|---|---|---|
| `who-speaks-next` | Next speaker / user / none | `candidate-action-selection` |
| `tool-exec-gate` | Tool allow/deny + handoff | `verify-gate` |

**Equation:** wasted speaker turns / tool mishaps = **$ + wallclock**.

Tags: `agent-comm`, `agent-comm-harness`. Measure YOUR selector latency — do not invent timings.
