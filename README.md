# jev-harness

**Typed decisions with proof — confidence, shadow, and policies you can eval.**

[![npm](https://img.shields.io/badge/npm-jev--harness-blue?style=flat-square)](https://www.npmjs.com/package/jev-harness)
[![Node](https://img.shields.io/badge/node-%3E%3D20-brightgreen?style=flat-square)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](./LICENSE)
[![TypeSafe](https://img.shields.io/badge/requires-TypeSafe%20API-111827?style=flat-square)](https://typesafe.ai)

TypeSafe [Jev](https://docs.typesafe.ai) answers `Choice` / `Score` / `Noul` with calibrated confidence. **This harness** turns answers into **shipable actions**: policy, confidence gates, shadow mode, recipes, evals.

> Compaction’s magic equation: **context window = money + speed.**  
> Here are the **next** equations — with $ / ms attached.

[fast-jev-compaction](https://github.com/tamaratran/fast-jev-compaction) owns that context→$ decision for Claude Code `/compact`. **jev-harness** is the pack for the rest: alerts, routing, verify, row filters, UI clicks — reusable DecisionHarness control plane (shadow + eval), not the `/compact` plugin.

**Docs:** `npm run docs:dev` · [demos](demos/marketing/) · [paste prompts](demos/marketing/PROMPTS.md) · [proof catalog](research/decisions-with-proof.md) · [positioning](research/marketing-why-us.md)

---

## Decisions with proof

Each card: **equation → big numbers → screenshot → paste into your agent.**  
Numbers labeled **DEMO** are synthetic share scenarios — re-measure on your traffic. **SEED** cites public community demos (inspiration only).

> **TODO:** If PNGs are missing, run the shot script in [`demos/marketing/README.md`](demos/marketing/README.md) — paths below match that layout.

### 1. Context tokens = money + speed

**Which tool results still matter?** · `Choice(keep|drop)` · never rewrite

| | Before (summarize) | After (keep/drop) |
|---|---|---|
| **DEMO** | 3 paths dead · TTFT 4.8s · ~$0.084/turn | 41 kept verbatim · TTFT 2.8s · ~$0.032/turn |
| **Headline** | **−62% tokens** · **−41% TTFT** | complementary to fast-jev-compaction |

![Tool retain — keep/drop, never summarize](docs/assets/marketing/card-tool-retain.png)

```text
Paste: Use jev-harness Choice keep|drop over tool-result spans before compact. Never summarize. Point Claude Code /compact UX at fast-jev-compaction; use DecisionHarness when the same keep/drop shape must live in your agent loop with shadow + eval.
```

---

### 2. Always-frontier routing = $ waste; smart route = $ + latency

**Stop paying frontier for FAQ** · `Choice(cheap|mid|frontier) + Score(risk)`

| | Before | After |
|---|---|---|
| **DEMO** | $184/day · 100% frontier · p50 2.1s | **$59/day** · 72/21/7% mix · p50 **0.95s** |
| **Headline** | **−68% $** · **−55% p50** | recipe: `model-cost-router` (proof: ≥70% cheap offline) |

![Model router — confidence bands pick the tier](docs/assets/marketing/card-model-router.png)

```text
Paste: Wire recipes/confidence-front-door/model-cost-router.ts — Choice cheap|mid|frontier + Score risk (cheap-first). Prove: npm run eval -- eval/fixtures/model-cost-router.jsonl → proof.pctRoutedCheap ≥ 70.
```

---

### 3. Ship without gate = incident $; confidence gate = fewer bad deploys + faster catch

**Ship gate before the incident** · `Choice(allow|revise|block) + Noul(grounded) + Noul(jailbreak)`

| | Before | After |
|---|---|---|
| **DEMO** | 2 sev-2s/mo · spot review · MTTD 41m | **0 ungated sev-2** · 1,111/91/38 allow/revise/block |
| **Headline** | **−$12k** avoided incident class · **38 blocked** before prod | recipe: `ship-gate` (suppress on low conf) |

![Ship gate — allow / revise / block](docs/assets/marketing/card-ship-gate.png)

```text
Paste: Use recipes/verify-gate/ship-gate.ts on every customer-facing or deploy-bound output. onLowConfidence=suppress. Prove: npm run eval -- eval/fixtures/ship-gate.jsonl → sg-low-suppress.
```

---

### 4. Alert flood = pager burn; gate = eng hours + sleep

**Pager burn → sleep** · `Choice(disposition) + Score(severity) + Noul(needs_human)`

| | Before | After |
|---|---|---|
| **DEMO** | 847 alerts · 312 pages · ~87% FP | **41 notifies** · 698 suppress · FP among pages ~6% |
| **Headline** | **−9.4h/wk** on-call · **94% FP↓** | recipe: `alert-gate` · `examples/alert-gate.ts` |

![Alert gate — false pages killed](docs/assets/marketing/card-alert-fp.png)

```text
Paste: Run recipes/confidence-front-door/alert-gate.ts on each alert event. Shadow mode first. Promote to live only when intendedAction matches senior on-call labels on a fixture JSONL.
```

---

### 5. LLM-per-row filter = $ + wallclock; Jev batch = cents + seconds

**Semantic WHERE without embeddings** · `Noul(matches) + Score(strength)` per row

| | Before (class) | After (**SEED**) |
|---|---|---|
| **129 rows** | ~$8–25 · minutes · often needs embeddings | **$0.0009** · **~1s** · cache **~6ms** · no index |
| **Source** | illustrative contrast | [@iam_zachi](https://x.com/iam_zachi/status/2100679300756435135) |

![NL row filter — 129 · ~1s · $0.0009](docs/assets/marketing/card-row-filter.png)

```text
Paste: Use recipes/row-judgment/row-semantic-match.ts (batch helper in batch.ts). Predicate like 'could work from home'. Include if Noul≥threshold & conf ok; else review. Cite seed metrics; label your own traffic as measured.
```

---

### 6. Vision-agent click loop = $ + seconds; candidate Choice = ms + cents

**Click without a vision agent** · `Choice(dynamic candidates) + Noul(done)`

| | Before (class) | After (**SEED**) |
|---|---|---|
| **Per decision** | screenshots → VLM · seconds/step | **~90ms** · labels only · pixels stay on-device |
| **Source** | illustrative contrast | [@milindlabs](https://x.com/milindlabs/status/2100631847155994852) |
| **Also** | Browser Use–class booking demos | Zürich→London **7.1s / $0.0039** ([@gregpr07](https://x.com/gregpr07/status/2100411066966749359)) |

![UI action — candidates → Choice → click](docs/assets/marketing/card-ui-action.png)

```text
Paste: Perceive DOM/a11y/OCR locally into labeled candidates. recipes/candidate-action-selection/candidate-action-select.ts — Choice over ids + Noul done. Execute best id in code; never send pixels to Jev.
```

Full prompt pack: [`demos/marketing/PROMPTS.md`](demos/marketing/PROMPTS.md). Interactive mocks: [`demos/marketing/`](demos/marketing/).

---

## Install / quick start

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

```bash
TYPESAFE_API_KEY=tsk_... npx tsx examples/alert-gate.ts
SHADOW=1 TYPESAFE_API_KEY=tsk_... npx tsx examples/alert-gate.ts
npx tsx eval/cli.ts eval/fixtures/alert-gate.jsonl   # offline, no API
```

---

## Concepts

| Term | Meaning |
|---|---|
| **State** | Application snapshot passed to Jev. |
| **Questions** | Typed `choice` / `score` / `noul` from `@typesafe-ai/sdk`. |
| **Policy** | `decide(ctx) → action` + `minConfidence` / `onLowConfidence`. |
| **Shadow** | `mode: "shadow"` → `shadow_noop`, logs `intendedAction`. |
| **Recipe / catalog** | Opinionated shapes; `getRecipe` / `recipesByCategory`. |

---

## Shadow + eval

```ts
await harness.run({ mode: "shadow", state, questions, policy });
```

```bash
npx tsx eval/cli.ts eval/fixtures/alert-gate.jsonl
npx tsx eval/cli.ts --live eval/fixtures/alert-gate.jsonl
```

---

## Catalog / recipe shapes

| Shape | Lead recipes |
|---|---|
| `candidate-action-selection` | `candidate-action-select`, `browser-next-action`, `tool-picker`, `stop-or-continue` |
| `row-judgment` | `row-semantic-match` |
| `verify-gate` | `llm-verifier`, `ship-gate`, `injection-check`, `tool-call-allowlist` |
| `confidence-front-door` | `alert-gate`, `model-router`, `model-cost-router`, `inbox-triage`, `incident-severity`, `oncall-page` |
| `composite-rubric` | `rubric-scorer` |
| `semantic-find` | `line-semantic-find`, `span-pick` |
| `live-multi-judgment` | `typewriter-panel`, `ticket-fanout` |
| `high-freq-reflex` | `mm-buy-sell`, `hot-path-allow` |

```ts
import { catalog, getRecipe, defineRecipe } from "jev-harness";
getRecipe("alert-gate");
```

---

## Advanced

**Log sinks:** `ConsoleDecisionLogger` · `MemoryDecisionLogger` · `FileDecisionLogger` · `OtelDecisionLogger` · `PostHogDecisionLogger`

```ts
import { DecisionHarness, FileDecisionLogger, batchFilterRows } from "jev-harness";

const harness = new DecisionHarness({
  loggers: [new FileDecisionLogger("logs/decisions.jsonl")],
});

const included = await batchFilterRows(harness, rows, "could work from home", {
  concurrency: 8,
  cache: new Map(),
});
```

**Docs site:** `npm run docs:dev` / `npm run docs:build` under [`docs-site/`](docs-site/).

---

## Roadmap

- [x] Eval fixtures · catalog clusters · log sinks · `defineRecipe` · batch helpers · docs site
- [x] Marketing demos + equation cards (`demos/marketing/`)
- [ ] Checked-in PNGs under `docs/assets/marketing/` (shot script in demos README)

---

## Disclaimer

**Not affiliated with [TypeSafe](https://typesafe.ai).** Independent MIT harness; requires a TypeSafe API key and [`@typesafe-ai/sdk`](https://www.npmjs.com/package/@typesafe-ai/sdk). Community seeds and [fast-jev-compaction](https://github.com/tamaratran/fast-jev-compaction) are **inspiration / complementary** — they own Claude Code `/compact` (context→$); we own the reusable decision control plane.

- Docs: [https://docs.typesafe.ai](https://docs.typesafe.ai) · Product: [https://typesafe.ai](https://typesafe.ai)

## License

[MIT](./LICENSE) © [Antonio Coppe](https://github.com/AntonioCoppe)
