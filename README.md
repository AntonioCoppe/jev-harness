# jev-harness

**TypeSafe Jev decision harness** — confidence-gated System One decisions with recipes, shadow mode, and evals.

[![npm](https://img.shields.io/badge/npm-jev--harness-blue?style=flat-square)](https://www.npmjs.com/package/jev-harness)
[![Node](https://img.shields.io/badge/node-%3E%3D20-brightgreen?style=flat-square)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](./LICENSE)
[![TypeSafe](https://img.shields.io/badge/requires-TypeSafe%20API-111827?style=flat-square)](https://typesafe.ai)

> LLMs generate. **Jev decides.** This harness owns **policy**, **confidence**, and **shadow**.

**Docs site** (VitePress): run locally with `npm run docs:dev`, or browse [taxonomy](research/taxonomy.md) and the [recipe catalog](recipes/catalog.ts). Source lives under [`docs-site/`](docs-site/).


---

## Why

TypeSafe [Jev](https://docs.typesafe.ai) (System One) returns typed answers — `Choice`, `Score`, `Noul` — with calibrated confidence, at sub-second cost. That is a **decision engine**, not a chat model.

Production systems still need a thin, opinionated layer around it:

| Concern | Who owns it |
|---|---|
| Propose options / draft text / perceive UI | Your code, OCR, tools, LLMs |
| Answer structured questions over state | **Jev** (`systemOne`) |
| Map answers → domain action | **Harness policy** (`decide`) |
| Refuse to act when unsure | **Harness confidence gate** |
| Observe without side effects | **Shadow mode** |
| Regression-test policies | **Eval CLI + fixtures** |

`jev-harness` is that layer: `state → questions → answers → policy → action`, with logs you can ship to any sink.

---

## Quick start

```bash
npm i jev-harness
# Get a key at https://typesafe.ai
export TYPESAFE_API_KEY=tsk_...
```

```ts
import { DecisionHarness, choice, noul, score } from "jev-harness";

const harness = new DecisionHarness(); // reads TYPESAFE_API_KEY, model jev-latest

const result = await harness.run({
  id: "ticket-42",
  state: { subject: "Can't check out", body: "Payment hangs on submit" },
  questions: {
    bucket: choice("Which queue should own this?", {
      support: "Existing customer problem",
      billing: "Payment / invoice",
      spam: "Irrelevant",
    }),
    urgency: score("How soon must we reply?", [
      "Can wait a day",
      "Same business day",
      "Within a few hours",
    ]),
    is_customer: noul("Is this from a real customer?"),
  },
  policy: {
    minConfidence: 0.55,
    onLowConfidence: "review", // or escalate_llm | suppress | proceed
    decide: ({ answers }) => {
      if (answers.bucket.choice === "spam" || answers.is_customer.noul < 0.35) {
        return "spam";
      }
      return answers.bucket.choice;
    },
  },
});

console.log(result.action, result.confidence, result.reason);
```

Or use a packaged recipe:

```bash
TYPESAFE_API_KEY=tsk_... npx tsx examples/alert-gate.ts
# Shadow (log intended action, never act):
SHADOW=1 TYPESAFE_API_KEY=tsk_... npx tsx examples/alert-gate.ts
```

---

## Concepts

| Term | Meaning |
|---|---|
| **State** | Application snapshot passed to Jev (string, object, or array). |
| **Questions** | Typed `choice` / `score` / `noul` builders from `@typesafe-ai/sdk`. |
| **Answers** | Typed responses + per-answer confidence (Noul uses distance from 0.5). |
| **Aggregate confidence** | Mean of answer confidences (`aggregateConfidence`). |
| **Policy** | `decide(ctx) → action` plus `minConfidence` / `onLowConfidence`. |
| **Intended action** | What policy selected before low-confidence / shadow overrides. |
| **Action** | What you should execute (`review`, `escalate_llm`, `suppress`, `shadow_noop`, or domain action). |
| **Live / shadow** | `mode: "live"` executes policy; `"shadow"` always returns `shadow_noop` and logs what would have happened. |
| **Recipe** | Opinionated questions + policy for a recurring harness shape. |
| **Catalog** | Machine-readable index of recipes (`catalog`, `getRecipe`, `recipesByCategory`). |

---

## Use cases

Bottom-up categories from public builds (`research/taxonomy.md`). **IDs are harness shapes**, not departments — vertical labels like support / growth / commerce / agents / ops / guardrails / rag are rejected as TOC roots (they are tags or provisional recipe folders only).

Recipe names below come from `recipes/catalog.ts`. Lead order = evidence frequency.

**Must-cite seeds** (inspiration only, not affiliation):

| Seed | Emergent IDs |
|---|---|
| [@milindlabs](https://x.com/milindlabs/status/2100631847155994852) — OCR UI candidates → Jev Choice → click (~90 ms; pixels stay on-device) | `candidate-action-selection` *(alias: `ui-grounding`)* |
| [@iam_zachi](https://x.com/iam_zachi/status/2100679300756435135) — Postgres `WHERE jev(people, 'could work from home')` (129 rows ~1 s; no embeddings) | `row-judgment` *(alias: `structured-data-filter`)* |

### Contents (frequency order)

1. [`candidate-action-selection`](#1-candidate-action-selection--alias-ui-grounding) *(alias: `ui-grounding`)* — top
2. [`row-judgment`](#2-row-judgment--alias-structured-data-filter) *(alias: `structured-data-filter`)* — top
3. [`verify-gate`](#3-verify-gate) — top
4. [`confidence-front-door`](#4-confidence-front-door) — top
5. [`composite-rubric`](#5-composite-rubric)
6. [`semantic-find`](#6-semantic-find)
7. [`live-multi-judgment`](#7-live-multi-judgment)
8. [`high-freq-reflex`](#8-high-freq-reflex)

### 1. `candidate-action-selection` *(alias: `ui-grounding`)*

**Seed:** [@milindlabs](https://x.com/milindlabs/status/2100631847155994852).

**Shape:** Local perception / DOM / game rules emit a **dynamic** option set → Jev returns a distribution → code acts → re-perceive until a stop judgment.

| Catalog recipe | Role |
|---|---|
| [`candidate-action-select`](recipes/candidate-action-selection/candidate-action-select.ts) | Generic Choice over candidate ids + optional `done` Noul. |
| [`browser-next-action`](recipes/candidate-action-selection/browser-next-action.ts) | Computer-use / wiki-race next click. |
| [`tool-picker`](recipes/candidate-action-selection/tool-picker.ts) | Choose next tool from a catalog, or decline. |
| [`stop-or-continue`](recipes/candidate-action-selection/stop-or-continue.ts) | Loop control: continue / stop / ask_user (stop Noul adjacent). |

**Primitives:** `Choice(dynamic_candidates)` ± `Noul(done)` ± `Score(risk)`.

### 2. `row-judgment` *(alias: `structured-data-filter`)*

**Seed:** [@iam_zachi](https://x.com/iam_zachi/status/2100679300756435135) Postgres `jev()` — viral NL semantic `WHERE` over rows (inspiration for this recipe, **not** an affiliation of jev-harness).

**Shape:** Map the **same** NL predicate over many rows/items; per-item Noul/Score/Choice; threshold + cache. No embeddings required.

| Catalog recipe | Role |
|---|---|
| [`row-semantic-match`](recipes/row-judgment/row-semantic-match.ts) | Does this JSON/DB row match the predicate? → `include` / `exclude` / `review`. |

**Primitives:** `map(items → Noul|Score|Choice(shared_criteria))` + threshold/cache.

### 3. `verify-gate`

**Shape:** State = (request, model/tool output, diff, untrusted input). Verdict Choice + failure-mode Nouls + confidence hold before side effects.

| Catalog recipe | Role |
|---|---|
| [`llm-verifier`](recipes/verify-gate/llm-verifier.ts) | Allow / revise / block with grounding + jailbreak checks. |
| [`injection-check`](recipes/verify-gate/injection-check.ts) | Pass / sanitize / block untrusted input. |
| [`tool-call-allowlist`](recipes/verify-gate/tool-call-allowlist.ts) | Allow / deny / require_confirm a proposed tool call. |
| [`alert-gate`](recipes/confidence-front-door/alert-gate.ts) | Also a gate: notify / queue_review / suppress noisy alerts. |

**Primitives:** `Choice(verdict)` + failure-mode `Noul`s + confidence gate.

### 4. `confidence-front-door`

**Shape:** Cheap typed classify of intent / difficulty / risk; route to lookup, cheap LLM, frontier LLM, or human by **confidence bands**.

| Catalog recipe | Role |
|---|---|
| [`model-router`](recipes/confidence-front-door/model-router.ts) | `cheap` / `mid` / `frontier` by difficulty + risk. |
| [`inbox-triage`](recipes/confidence-front-door/inbox-triage.ts) | Bucket inbound messages (bookings, orders, support, spam, …). |
| [`incident-severity`](recipes/confidence-front-door/incident-severity.ts) | Assign sev1–sev4 from blast radius / impact. |
| [`oncall-page`](recipes/confidence-front-door/oncall-page.ts) | Page now / Slack / defer / ignore. |

**Primitives:** `Choice(intent)` + `Score(stakes)` + confidence thresholds in code.

### 5. `composite-rubric`

**Shape:** Many independent Scores; **code-owned** weights combine them; retune without re-prompting.

| Catalog recipe | Role |
|---|---|
| [`rubric-scorer`](recipes/composite-rubric/rubric-scorer.ts) | Multi-dimension Score → `pass` / `revise` / `fail` + weighted score. |

### 6. `semantic-find`

**Shape:** Candidate list already in hand; Choice (or per-item Score) for best match to one NL query; optional `exists` Noul.

| Catalog recipe | Role |
|---|---|
| [`line-semantic-find`](recipes/semantic-find/line-semantic-find.ts) | Best doc line for a query, or `NONE`. |
| [`span-pick`](recipes/semantic-find/span-pick.ts) | Pre-parsed value/span pick, or `NONE`. |

See `research/taxonomy.md` for relation to `row-judgment` (rank-among vs corpus filter).

### 7. `live-multi-judgment`

**Shape:** As text/state changes, fan out many independent Scores/Nouls; UI updates in <~200 ms.

| Catalog recipe | Role |
|---|---|
| [`typewriter-panel`](recipes/live-multi-judgment/typewriter-panel.ts) | Live tone / clarity / urgency / AI-written / intent on a draft. |
| [`ticket-fanout`](recipes/live-multi-judgment/ticket-fanout.ts) | Speculative multi-Q ticket briefing → route or escalate. |

### 8. `high-freq-reflex`

**Shape:** Hot loop ≤ few hundred ms; Jev returns a typed branch; deterministic code executes. Split from `candidate-action-selection` when **throughput/budget** (not UI grounding) is the claim.

| Catalog recipe | Role |
|---|---|
| [`mm-buy-sell`](recipes/high-freq-reflex/mm-buy-sell.ts) | Block-time buy / sell / hold from a compact book snapshot. |
| [`hot-path-allow`](recipes/high-freq-reflex/hot-path-allow.ts) | Sub-100ms allow / deny on a compact event. |

Soak in shadow with tight `minConfidence` before live.


## Shadow mode + eval CLI

### Shadow

```ts
await harness.run({
  mode: "shadow",
  state,
  questions,
  policy,
});
// result.action === "shadow_noop"
// result.intendedAction === <what policy wanted>
// result.reason starts with "shadow: would …"
```

Run recipes in shadow against production traffic (or replay) until intended-action histograms look sane, then flip to `live`.

### Eval CLI

Offline fixtures (pre-baked answers) exercise policy + confidence without API spend:

```bash
npx tsx eval/cli.ts eval/fixtures/alert-gate.jsonl
# or after build:
npx jev-eval eval/fixtures/alert-gate.jsonl
```

Live mode calls Jev (requires `TYPESAFE_API_KEY`) and ignores fixture answers:

```bash
npx tsx eval/cli.ts --live eval/fixtures/alert-gate.jsonl
```

Fixtures are JSONL: `id`, `recipe`, `state`, optional `answers`, `expectedAction`, optional `minConfidence` / `onLowConfidence` / `mode`.

---

## Catalog / recipes layout

```
recipes/
  catalog.ts          # machine-readable index (exported as `catalog`)
  index.ts            # re-exports runners + catalog
  candidate-action-selection/  # candidate-action-select, browser-next-action, tool-picker, stop-or-continue
  row-judgment/                # row-semantic-match
  confidence-front-door/       # model-router, alert-gate, inbox-triage, …
  verify-gate/                 # llm-verifier, injection-check, tool-call-allowlist
  composite-rubric/            # rubric-scorer
  live-multi-judgment/         # typewriter-panel, ticket-fanout
  semantic-find/               # line-semantic-find, span-pick
  high-freq-reflex/            # mm-buy-sell, hot-path-allow
```

```ts
import { catalog, getRecipe, recipesByCategory, defineRecipe } from "jev-harness";

catalog.filter((r) => r.tags.includes("computer-use"));
getRecipe("alert-gate");
recipesByCategory("live-multi-judgment");
```

Each catalog entry lists `id`, `module`, `runner`, question kinds, actions, default confidence policy, and tags.

### `defineRecipe`

Typed helper in `src/define-recipe.ts` that pairs catalog metadata with `buildQuestions` + `decide` and a `run(harness, state, opts)` wrapper around `DecisionHarness.run`. Migrated examples: [`model-router`](recipes/confidence-front-door/model-router.ts), [`alert-gate`](recipes/confidence-front-door/alert-gate.ts) (export `*Recipe.catalogEntry`).

```ts
import { defineRecipe, choice, DecisionHarness } from "jev-harness";

const recipe = defineRecipe({
  id: "my-recipe",
  name: "My Recipe",
  category: "confidence-front-door",
  description: "…",
  module: "recipes/…/my-recipe.ts",
  runner: "runMyRecipe",
  questions: [{ name: "tier", kind: "choice" }],
  actions: ["cheap", "mid"],
  defaultMinConfidence: 0.5,
  tags: ["example"],
  buildQuestions: () => ({
    tier: choice("Which tier?", { cheap: "…", mid: "…" }),
  }),
  decide: ({ answers }) => answers.tier.choice,
});

await recipe.run(new DecisionHarness(), { prompt: "…" });
// recipe.catalogEntry → RecipeCatalogEntry
```


Research notes that drive the use-case TOC live under `research/` (`seeds.md`, `taxonomy.md`).

---

## Advanced

### Pluggable decision log sinks

`DecisionHarness` accepts `loggers: DecisionLogger[]` (or the legacy single `logger`). Built-in sinks:

| Sink | Notes |
|---|---|
| `ConsoleDecisionLogger` | Default — one JSON object per decision on stdout |
| `MemoryDecisionLogger` | In-process buffer (tests / evals) |
| `FileDecisionLogger` | Append JSONL to a path |
| `OtelDecisionLogger` | Soft-loads optional peer `@opentelemetry/api`; no-op if missing |
| `PostHogDecisionLogger` | HTTP capture; reads `POSTHOG_API_KEY` (optional `POSTHOG_HOST`) |

```ts
import {
  DecisionHarness,
  FileDecisionLogger,
  OtelDecisionLogger,
  PostHogDecisionLogger,
} from "jev-harness";

const harness = new DecisionHarness({
  loggers: [
    new FileDecisionLogger("logs/decisions.jsonl"),
    new OtelDecisionLogger(),
    new PostHogDecisionLogger(), // no-op without POSTHOG_API_KEY
  ],
});
```

Implement `DecisionLogger.logDecision(result)` for custom sinks.

### Batch row map / filter

For `row-judgment`, use concurrency-pooled helpers with an in-memory cache keyed by `hash(row)+predicate`:

```ts
import { DecisionHarness, batchFilterRows, mapRows } from "jev-harness";
// or: import { batchFilterRows, mapRows } from "jev-harness/recipes";

const cache = new Map();
const included = await batchFilterRows(harness, rows, "could work from home", {
  concurrency: 8,
  cache,
});
const mapped = await mapRows(harness, rows, "senior IC", { concurrency: 8, cache });
```


## Docs

Static site under [`docs-site/`](docs-site/) (VitePress):

| Command | Purpose |
|---|---|
| `npm run docs:dev` | Generate pages from catalog + serve locally |
| `npm run docs:build` | Generate + build static output |

Pages: home, [taxonomy](research/taxonomy.md) mirror, recipes index grouped by taxonomy ID, one page per catalog recipe.

---

## Roadmap

- [ ] Expand eval fixtures to every catalog recipe
- [x] More catalog entries for clusters C / G / H (`live-multi-judgment`, `semantic-find`, `high-freq-reflex`)
- [x] Pluggable decision log sinks (OpenTelemetry, PostHog, file)
- [x] Typed recipe SDK helpers (`defineRecipe`) shared by runners + catalog
- [x] Batch helpers for semantic row/filter maps with concurrency + cache
- [x] Docs site mirroring cookbook recipes ↔ taxonomy clusters (`docs-site/`, `npm run docs:dev`)

---

## Disclaimer

**Not affiliated with [TypeSafe](https://typesafe.ai).** This is an independent open-source harness. It **requires** a TypeSafe API key and the [`@typesafe-ai/sdk`](https://www.npmjs.com/package/@typesafe-ai/sdk) client. Community patterns cited above (including [@milindlabs](https://x.com/milindlabs) UI selection and [@iam_zachi](https://x.com/iam_zachi) Postgres `jev()`) are inspirations only — not product affiliations.

- Docs: [https://docs.typesafe.ai](https://docs.typesafe.ai)
- Product: [https://typesafe.ai](https://typesafe.ai)

---

## License

[MIT](./LICENSE) © [Antonio Coppe](https://github.com/AntonioCoppe)
