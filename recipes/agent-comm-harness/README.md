# agent-comm-harness

Intra- / multi-agent communication gates (research §1): replace LLM selectors and critics with Jev Choice / Score / Noul.

| Recipe | Role | Catalog category |
|---|---|---|
| `who-speaks-next` | Next speaker / user / none | `candidate-action-selection` |
| `tool-gate` | Tool allow/deny + handoff | `verify-gate` |
| `message-route` | Inter-agent bus route | `confidence-front-door` |

**Equation:** wasted speaker turns / tool mishaps / misroutes = **$ + wallclock**.

Tags: `agent-comm-harness`. See `research/crazy-fast-decisions.md` §1.
