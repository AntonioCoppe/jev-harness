# Architecture

One-page map of **jev-harness**: a thin decision layer around TypeSafe Jev (System One).

## Loop

```
state ──► questions ──► TypeSafe systemOne (Jev)
                              │
                              ▼
                         answers + usage
                              │
                              ▼
                    aggregateConfidence()
                              │
                              ▼
                 policy.decide(ctx) → intendedAction
                              │
              confidence < minConfidence?
                     │              │
                    yes             no
                     │              │
              onLowConfidence    intendedAction
              (review | escalate_llm |
               suppress | proceed)
                     │
                     ▼
              mode === "shadow"?
                     │
            yes → action = shadow_noop
            no  → action = resolution
                     │
                     ▼
              DecisionLogger.logDecision
                     │
                     ▼
              DecisionResult (caller acts)
```

## Modules

| Path | Responsibility |
|---|---|
| `src/harness.ts` | `DecisionHarness` — client wiring, `run()`, shadow override, `loggers[]` |
| `src/types.ts` | `DecisionRequest` / `DecisionResult` / `DecisionPolicy` / modes |
| `src/confidence.ts` | Per-answer + mean confidence (`Noul` → \|n−0.5\|×2) |
| `src/policy.ts` | `resolvePolicy` — confidence gate over `decide` |
| `src/logger.ts` + `src/loggers/` | `DecisionLogger` sinks: console, memory, file, OTEL (optional), PostHog |
| `src/index.ts` | Public exports + re-exports SDK helpers / catalog |
| `recipes/catalog.ts` | Machine-readable recipe index |
| `recipes/{ops,agents,guardrails,emergent}/` | Opinionated question+policy packs (folders provisional) |
| `eval/cli.ts` | Offline / `--live` JSONL policy regression |
| `research/taxonomy.md` | Empirical use-case IDs (shape clusters, not verticals) |

## Ownership split

| Layer | Owns |
|---|---|
| Your app / OCR / LLM | Propose candidates, draft text, perceive, execute side effects |
| **Jev** (`@typesafe-ai/sdk`) | Typed answers (`choice` / `score` / `noul`) + model confidence |
| **Harness** | Policy mapping, confidence threshold, shadow, structured logs, recipes, evals |

## Shadow vs live

- **Live:** `action` is the policy (or low-confidence) resolution; caller should execute it.
- **Shadow:** `action` is always `shadow_noop`; `intendedAction` + `reason` record what would have run. Use for soak tests against production traffic.

## Recipes vs taxonomy

Catalog entries currently group under provisional folders (`ops`, `agents`, `guardrails`, `emergent`). The **stable vocabulary** for docs and new designs is the taxonomy ID set: `candidate-action-selection`, `row-judgment`, `verify-gate`, `confidence-front-door`, `composite-rubric`, `semantic-find`, `live-multi-judgment`, `high-freq-reflex`. See mapping table in `research/taxonomy.md`.

## Dependencies

- Runtime: `@typesafe-ai/sdk` + `TYPESAFE_API_KEY` ([typesafe.ai](https://typesafe.ai); docs: [docs.typesafe.ai](https://docs.typesafe.ai)).
- This package is **not affiliated** with TypeSafe; it is an independent MIT harness (© Antonio Coppe).
