# Recipe remap done (provisional → empirical taxonomy IDs)

**Date:** 2026-09-17 ET  
**Source of truth:** `research/taxonomy.md`  
**Status:** Remapped; `recipes/PENDING.md` updated; `npm run build` green.

Provisional folders `agents/`, `ops/`, `guardrails/`, `emergent/` removed. New folders use taxonomy stable IDs.

## Before → after

| Before | After | Category ID |
|---|---|---|
| `recipes/emergent/candidate-action-select.ts` | `recipes/candidate-action-selection/candidate-action-select.ts` | `candidate-action-selection` |
| `recipes/agents/browser-next-action.ts` | `recipes/candidate-action-selection/browser-next-action.ts` | `candidate-action-selection` |
| `recipes/agents/tool-picker.ts` | `recipes/candidate-action-selection/tool-picker.ts` | `candidate-action-selection` |
| `recipes/agents/stop-or-continue.ts` | `recipes/candidate-action-selection/stop-or-continue.ts` | `candidate-action-selection` |
| `recipes/emergent/row-semantic-match.ts` | `recipes/row-judgment/row-semantic-match.ts` | `row-judgment` |
| `recipes/agents/model-router.ts` | `recipes/confidence-front-door/model-router.ts` | `confidence-front-door` |
| `recipes/ops/alert-gate.ts` | `recipes/confidence-front-door/alert-gate.ts` | `confidence-front-door` |
| `recipes/ops/inbox-triage.ts` | `recipes/confidence-front-door/inbox-triage.ts` | `confidence-front-door` |
| `recipes/ops/incident-severity.ts` | `recipes/confidence-front-door/incident-severity.ts` | `confidence-front-door` |
| `recipes/ops/oncall-page.ts` | `recipes/confidence-front-door/oncall-page.ts` | `confidence-front-door` |
| `recipes/guardrails/llm-verifier.ts` | `recipes/verify-gate/llm-verifier.ts` | `verify-gate` |
| `recipes/guardrails/injection-check.ts` | `recipes/verify-gate/injection-check.ts` | `verify-gate` |
| `recipes/guardrails/tool-call-allowlist.ts` | `recipes/verify-gate/tool-call-allowlist.ts` | `verify-gate` |
| `recipes/guardrails/rubric-scorer.ts` | `recipes/composite-rubric/rubric-scorer.ts` | `composite-rubric` |

## Stubs (no recipes moved)

| Path | Notes |
|---|---|
| `recipes/live-multi-judgment/README.md` | Taxonomy category stub |
| `recipes/high-freq-reflex/README.md` | Taxonomy category stub |

## Not created

| ID | Reason |
|---|---|
| `semantic-find/` | No existing recipe mapped cleanly (rank-among-candidates vs row-filter overlap); create when a find/rerank recipe lands |

## Callers updated

- `recipes/catalog.ts` — `RecipeCategory` + `module` paths use empirical IDs
- `recipes/index.ts` — re-exports from new paths
- `examples/alert-gate.ts`, `examples/model-router.ts`
- `eval/cli.ts`
- `recipes/PENDING.md` — marked remapped
- `README.md` — path links / tree aligned

## Removed directories

`recipes/agents/`, `recipes/ops/`, `recipes/guardrails/`, `recipes/emergent/` (including old READMEs).
