# Core done — exported API surface

Package: `jev-harness` (decision harness for TypeSafe Jev System One).

## Loop

`state → questions → answers → policy → action`

with `minConfidence`, `onLowConfidence` (`review` | `escalate_llm` | `suppress` | `proceed`), shadow mode, and structured JSON decision logs.

## Public exports (`src/index.ts`)

Required surface:

| Export | Kind |
|--------|------|
| `DecisionHarness` | class — `run(request) → DecisionResult` |
| `choice`, `score`, `noul` | helpers (re-exported from `@typesafe-ai/sdk`) |
| `TypeSafeClient` | class (re-exported from `@typesafe-ai/sdk`) |
| `catalog` | machine-readable recipe catalog |

Additional exports: `ConsoleDecisionLogger`, `MemoryDecisionLogger`, `aggregateConfidence`, `answerConfidence`, `getRecipe`, `recipesByCategory`, `resolvePolicy`, `isChoiceAnswer`, `isNoulAnswer`, `isScoreAnswer`, plus types (`DecisionRequest`, `DecisionResult`, `DecisionPolicy`, `LowConfidenceStrategy`, `RunMode`, …).

## Primary call

```ts
const harness = new DecisionHarness(); // TYPESAFE_API_KEY, model jev-latest
const result = await harness.run({
  state,
  questions,
  policy: { minConfidence: 0.55, onLowConfidence: "review", decide },
  mode: "live", // or "shadow" → action is always "shadow_noop"
});
```

## Source layout

- `src/types.ts` — request/result/policy types
- `src/confidence.ts` — per-answer + aggregate confidence
- `src/policy.ts` — `resolvePolicy` (minConfidence / onLowConfidence)
- `src/logger.ts` — structured JSON decision logs
- `src/harness.ts` — `DecisionHarness.run`
- `src/index.ts` — public barrel

## Reference recipes (canonical paths)

- `recipes/ops/alert-gate.ts` — disposition + severity + needs_human
- `recipes/agents/model-router.ts` — tier + risk → cheap/mid/frontier
- `recipes/guardrails/llm-verifier.ts` — verdict + grounded + jailbreak

Taxonomy folders (`confidence-front-door/`, `verify-gate/`, …) keep thin re-exports / additional recipes; catalog `module` for the three above points at the canonical paths.

## Tooling

- Examples: `examples/alert-gate.ts`, `examples/model-router.ts`
- Eval: `eval/cli.ts` + `eval/fixtures/alert-gate.jsonl` (offline 4/4 pass)
- Env: `TYPESAFE_API_KEY` (see `.env.example`); default model `jev-latest`
- License: MIT

## Status

- `npm install && npm run build` passes
- Offline eval fixture: 4/4 passed
- Remote set (`https://github.com/AntonioCoppe/jev-harness`); **not pushed** — ready for commit
