# Storm C — Product surface: what an OSS *decision* harness must own

**Audience:** jev-harness (wraps TypeSafe **Jev** / System One)  
**Question:** What should this OSS offer to be *wanted* — not another thin SDK wrapper?  
**Method:** Teardown successful harnesses' *product surfaces* (what strangers screenshot, copy, and put in CI), then map gaps against Jev's unique primitives.  
**Date:** Thu Sep 17, 2026 (America/Toronto / ET)  
**Sibling research:** `taxonomy.md`, `seeds.md`, `x-usecases-a.md`, `core-done.md`

---

## Sources (concrete URLs)

| Product | Primary surface docs / READMEs |
|---|---|
| **TypeSafe / Jev** | https://docs.typesafe.ai/primitives.md · https://docs.typesafe.ai/llms.txt · https://typesafe.ai/blog/introducing-system-one-models-and-jev · https://evals.typesafe.ai/ · https://typesafe.ai/manifesto · https://console.typesafe.ai/ |
| **DSPy** | https://github.com/stanfordnlp/dspy · https://dspy.ai/ |
| **AI SDK (Vercel)** | https://github.com/vercel/ai · https://ai-sdk.dev/docs · https://ai-sdk.dev/docs/ai-sdk-ui/chatbot |
| **Promptfoo** | https://github.com/promptfoo/promptfoo · https://www.promptfoo.dev/docs/getting-started/ · https://www.promptfoo.dev/docs/red-team/ |
| **Guardrails** | https://github.com/guardrails-ai/guardrails · https://guardrailsai.com/hub/ · https://www.guardrailsai.com/docs |
| **Outlines** | https://github.com/dottxt-ai/outlines · https://dottxt-ai.github.io/outlines/latest/ |
| **LangGraph** | https://github.com/langchain-ai/langgraph · https://docs.langchain.com/oss/python/langgraph/overview · https://docs.langchain.com/oss/python/langgraph/durable-execution |
| **Empirical seeds** | https://x.com/milindlabs/status/2100631847155994852 · https://x.com/iam_zachi/status/2100679300756435135 · https://github.com/browser-use/jev-ultrafast · https://vercel.com/changelog/typesafe-ai-jev-now-available-on-ai-gateway |

---

## Competitor product surfaces (what strangers actually *use*)

Successful harnesses sell **one noun + one verb** that shows up in every demo:

| Product | Signature noun(s) | Signature verb / ritual | Screenshot / wow |
|---|---|---|---|
| **DSPy** | `Signature`, `Module`, `Optimizer`, `trainset` | `compile(program, trainset, metric)` | Before/after F1 after GEPA/MIPRO |
| **AI SDK** | `useChat`, `streamText`, providers | Drop hook → messages stream | Chat UI updating token-by-token |
| **Promptfoo** | `promptfooconfig.yaml`, asserts, providers | `promptfoo eval` → `promptfoo view` | Eval matrix + redteam dashboard |
| **Guardrails** | `Guard`, Hub validators, `OnFailAction` | `guard.validate(...)` / rails around I/O | Hub GIF of stacking validators |
| **Outlines** | `output_type` / JSON Schema / CFG | `model(prompt, schema)` guaranteed decode | Always-valid Pydantic object, no retries |
| **LangGraph** | Graph, checkpointer, interrupt | Durable resume / HITL / time-travel | Graph viz + checkpoint timeline |

**Pattern:** None of these win by "wrapping an API." They win by owning a **loop artifact** (compiled program, streaming UI state, YAML eval run, validator chain, constrained decode, durable graph) that is hard to recreate ad hoc.

---

## 1. Capability table

| Capability | Who already owns it | Gap Jev uniquely fills |
|---|---|---|
| Typed I/O schemas / signatures | DSPy Signatures; AI SDK `Output.object` + Zod; Outlines JSON Schema | **Not schema extraction** — **calibrated Choice/Score/Noul** with distributions + confidence, no string generation |
| Prompt / weight optimizers | DSPy GEPA, MIPROv2, BetterTogether | Leave alone. Jev policies are **code-owned weights + thresholds**, not prompt compile |
| Datasets + offline compile | DSPy trainsets; Promptfoo YAML tests | Own **decision fixtures** (JSONL of state → expected *action*), not LM demos |
| Chat UI + streaming | AI SDK `useChat` / `streamText` | Do not compete. Optional: stream **many live judgments** (stevekrouse typewriter) as a *delight*, not core |
| Provider abstraction | AI SDK providers; Promptfoo providers; Outlines backends | Thin re-export of `@typesafe-ai/sdk` is fine; **do not** become another multi-provider chat SDK |
| CI eval / redteam | Promptfoo eval + redteam; LangSmith | Own **decision-policy eval** (action match, confidence calibration, shadow-vs-live drift) — not prompt redteam |
| I/O validators / rails | Guardrails Hub validators | Overlap only on *gate shape*; Jev fills **semantic verify/gate with confidence** (injection/risk/irreversibility as Noul/Choice), not regex/toxicity catalogs |
| Constrained decoding | Outlines; provider JSON mode | Orthogonal: Jev *cannot invent outside criteria*; harness owns **policy → action**, not token masks |
| Durable agent graphs / checkpoints | LangGraph checkpointers, interrupts, stores | Stay *inside* a node: **cheap judgment step**. Do not own orchestration durability |
| Confidence-gated automation | Partial (Guardrails on-fail; HITL in LangGraph) | **Core gap:** first-class `minConfidence` + `onLowConfidence` (`review` / `escalate_llm` / `suppress` / `proceed`) + shadow mode |
| Dynamic candidate Choice loops | Ad-hoc agent tool pickers | **`candidate-action-selection`**: perception → text labels → Choice distribution → act → loop (milindlabs / Browser Use) |
| Map NL predicate over rows | Embeddings + RAG + LLM judge stacks | **`row-judgment`**: batched Noul/Score per row, SQL-shaped mental model, cache (iam_zachi) |
| Speculative multi-question fan-out | Rare / expensive with LLMs | Parallel questions in one System One call; code ignores unused answers |
| Composite rubric (code weights) | Prompt mush; DSPy metrics | Many Scores → weighted sum **in code**; retune without re-prompting |
| Shadow / dry-run decisions | Ops tooling; some feature flags | First-class `mode: "shadow"` with `intendedAction` vs `shadow_noop` + structured logs |
| Recipe catalog by *harness shape* | Vertical demo apps | Catalog keyed by empirical shapes (`candidate-action-selection`, `row-judgment`, `confidence-front-door`, `verify-gate`, …) not "agents/ops" folders |

**One-line synthesis:** Competitors own *generate*, *stream*, *constrain*, *orchestrate*, or *eval prompts*. Nobody owns **decide-with-confidence → policy → action** as a first-class OSS product surface on System One primitives.

---

## 2. Must-have MVP surface (ordered)

Ship in this order. Each item should be *copy-pasteable* and appear in README within 30 seconds of scrolling.

1. **`DecisionHarness.run({ state, questions, policy, mode })`**  
   The single call. Loop: `state → questions → answers → policy → action`. Already in `src/harness.ts`. Document as the product noun.

2. **Policy object as the product**  
   `minConfidence`, `onLowConfidence`, `decide(ctx) → action`. Make policy feel as iconic as DSPy's Signature or Promptfoo's YAML asserts. Export helpers: `threshold`, `weightedScores`, `choiceOrEscalate`.

3. **Shadow mode + structured decision logs**  
   `mode: "shadow"` always returns `shadow_noop` while preserving `intendedAction` + reason. JSON lines strangers can `jq`. This is the "safe to try in prod" wedge Promptfoo/Guardrails users expect.

4. **Two seed recipes (empirical shapes, not verticals)**  
   - `recipes/emergent/candidate-action-select.ts` — dynamic Choice + stop Noul  
   - `recipes/emergent/row-semantic-match.ts` — NL predicate over rows  
   Rename/promote into taxonomy IDs once folders reorganize (`candidate-action-selection`, `row-judgment`).

5. **One confidence-front-door recipe**  
   Keep `model-router` or `alert-gate` as the third wow: Choice + Score → route/suppress with confidence bands.

6. **`jev-eval` CLI + JSONL fixtures**  
   Offline policy unit tests (no API) + `--live` against Jev. Assert on **action** and optionally confidence bands. Mirror Promptfoo's `eval` ritual without becoming Promptfoo.

7. **Recipe catalog export**  
   Machine-readable `catalog` with shape ID, when-to-use, primitives used. `getRecipe` / `recipesByCategory`. Enables "browse shapes" demos and agent skills.

8. **Env contract**  
   `TYPESAFE_API_KEY` + `.env.example` + one-liner scripts (`npm run example:alert`, `npm run eval`). Zero-config default model `jev-latest`.

*Deferred until after MVP (still valuable, not day-0):* live multi-judgment UI kit, Postgres UDF helper package, LangGraph/AI SDK adapter packages, calibration plots, Hub-style recipe publish.

---

## 3. Delight features (screenshot / video bait for X & HN)

These create **visual proof** that this is not `@typesafe-ai/sdk` with a bow:

| Delight | Why it screenshots | Seed / analogue |
|---|---|---|
| **Candidate picker TUI/demo** | OCR/DOM labels → probability bars → click/STOP loop; ~ms ticks | milindlabs; Browser Use `jev-ultrafast` |
| **`WHERE jev(row, '…')` table filter** | Spreadsheet/CLI: rows light up include/exclude/review by Noul + confidence | iam_zachi Postgres UDF |
| **Shadow vs live diff strip** | Same alerts: intended action vs what would fire; confidence histogram | Ops shadow deploy |
| **Live typewriter judgments** | 10–16 Score/Noul meters updating as you type | stevekrouse Val Town demo |
| **Rubric mixer** | Sliders for Score weights → kill/fix/ship flips without re-asking Jev | Composite rubric demos |
| **Confidence waterfall** | Auto / review / escalate_llm bands on a real inbox dump | Helpdesk cascade pattern |
| **Cost/latency ticker** | Side-by-side "LLM judge vs Jev" on 100 rows | iamMrDuncan benchmark; Valyu 1kpapers |
| **`jev-eval` matrix HTML** | Promptfoo-ish table but columns = *actions* × *confidence* | Own eval viewer |

**Video script (60s):** perception proposes 8 UI labels → harness Choice distribution animates → low-confidence → `review` → tweak `minConfidence` → green auto-click → overlay "$0.000x / 90ms".

---

## 4. What NOT to build (commoditized / wrong layer)

| Do not build | Why |
|---|---|
| Multi-provider chat / `useChat` clone | AI SDK owns this; Jev does not generate assistant prose |
| General agent framework / durable graphs | LangGraph (and Deep Agents) own orchestration + checkpoints |
| Prompt optimizer / MIPRO-style compile | DSPy owns compile-against-metric; Jev policies are code thresholds |
| Full redteam / vulnerability scanner | Promptfoo owns CI redteam; stay decision-policy eval |
| Validator Hub for PII/toxicity/regex | Guardrails Hub; only ship *semantic* gates as recipes |
| Constrained decoding / grammar compiler | Outlines / provider JSON mode |
| Embedding index + RAG framework | Wrong shape; row-judgment is map+threshold, not retrieval product |
| "Support / growth / commerce" vertical packs as taxonomy roots | Rejected in `taxonomy.md` — verticals are tags, not surfaces |
| Re-implement `@typesafe-ai/sdk` | Re-export; wrap the *decision loop* only |
| Another LangChain-style abstraction tower | Keep one class + recipes + eval CLI |

---

## 5. Positioning one-liners (3 options → recommend 1)

1. **"DecisionHarness for Jev — confidence-gated Choice/Score/Noul → policy → action, with shadow mode and evals."**  
2. **"The missing layer between System One judgments and production code: policies, shadow runs, and decision fixtures."**  
3. **"Not another LLM wrapper — an OSS harness for *deciding*: dynamic candidate pick, NL row filters, and confidence front-doors on TypeSafe Jev."**

### Recommendation: **#3**

**Why:** #1 is accurate but reads like an API changelog. #2 is precise for practitioners who already know System One. **#3** does the HN/X job: negates the wrapper fear, names the category (*deciding*), and lists the two empirical wow shapes strangers already saw on X. Lead README with #3; use #1 as the subtitle under the fold.

---

## 6. Clone-to-wow path (stranger → dopamine in ≤5 minutes)

**Prereq:** Node ≥20, a TypeSafe key (`TYPESAFE_API_KEY`).

```bash
git clone https://github.com/AntonioCoppe/jev-harness.git
cd jev-harness
npm install
cp .env.example .env   # paste TYPESAFE_API_KEY=tsk_...
npm run build
```

### Exact files to run (in order)

| Step | Command | File(s) touched / shown | Expected wow |
|---|---|---|---|
| 1. Offline policy sanity (no API) | `npm run eval -- eval/fixtures/alert-gate.jsonl` | `eval/cli.ts`, `eval/fixtures/alert-gate.jsonl`, `src/policy.ts` | Actions match fixtures; proves policy is unit-testable |
| 2. Live gate | `npm run example:alert` | `examples/alert-gate.ts` → `recipes/ops/alert-gate.ts` → `src/harness.ts` | JSON: `action`, `confidence`, `answers` (Choice/Score/Noul) |
| 3. Shadow dry-run | `SHADOW=1 npm run example:alert` | same | `action: "shadow_noop"`, `intendedAction` preserved |
| 4. Router | `npm run example:router` | `examples/model-router.ts`, `recipes/agents/model-router.ts` | Tier Choice + risk Score → `frontier` / mid / cheap |
| 5. Seed shape A (edit & run) | `npx tsx -e '…'` *or* add `examples/candidate-action.ts` calling | `recipes/emergent/candidate-action-select.ts` | Dynamic UI labels → next action / STOP |
| 6. Seed shape B | same pattern | `recipes/emergent/row-semantic-match.ts` | NL predicate over a tiny JSON array of people/rows |

**Minimal "hello decision" (paste into a scratch file):**

```ts
// examples/hello-decision.ts  (suggested; mirrors core-done.md)
import { DecisionHarness, choice, noul, score } from "../src/index.js";

const harness = new DecisionHarness();
const result = await harness.run({
  state: { message: "p99 latency 12x on checkout; customers can't pay" },
  questions: {
    page: noul("Is this a customer-impacting production incident?"),
    severity: score("How severe?", ["noise", "degraded", "outage"]),
    route: choice("Who should own this?", {
      oncall: "Page the primary on-call",
      team_chat: "Post to team channel only",
      ignore: "Suppress",
    }),
  },
  policy: {
    minConfidence: 0.55,
    onLowConfidence: "review",
    decide: ({ answers }) =>
      answers.page.noul > 0.7 && answers.severity.score >= 1.5
        ? answers.route.choice
        : "ignore",
  },
  mode: "live", // flip to "shadow" for dry-run
});
console.log(result.action, result.confidence, result.reason);
```

**Files a stranger should open (toured):**

1. `src/harness.ts` — the product  
2. `src/types.ts` — `DecisionPolicy` / `DecisionResult`  
3. `recipes/emergent/candidate-action-select.ts` — seed shape A  
4. `recipes/emergent/row-semantic-match.ts` — seed shape B  
5. `examples/alert-gate.ts` — runnable demo  
6. `eval/cli.ts` + `eval/fixtures/alert-gate.jsonl` — CI ritual  
7. `recipes/catalog.ts` — browse shapes  
8. `.env.example` — key contract  

**5-minute success criteria:** offline eval exits 0; live alert example prints an action ≠ empty; shadow mode shows `shadow_noop` with a non-empty `intendedAction`; stranger understands they write **policy**, not prompts.

---

## Appendix — Mapping famous surfaces → jev-harness analogues

| Famous surface | jev-harness analogue (build this, not a clone) |
|---|---|
| DSPy `Signature` | `questions` + typed answers (owned by TypeSafe); harness adds **policy signature** |
| DSPy `optimizer.compile` | `jev-eval` + threshold/weight search over fixtures (optional later) |
| AI SDK `useChat` | optional live-judgment React hook (delight only) |
| Promptfoo YAML | JSONL decision fixtures + `jev-eval` |
| Guardrails `Guard.use(...)` | `verify-gate` recipes + `onLowConfidence` |
| Outlines `model(prompt, schema)` | Jev criteria already constrain; harness maps answers → **actions** |
| LangGraph checkpointer | stay embeddable *inside* a graph node; export `DecisionResult` as node output |

---

## Bottom line

**Wanted product:** an OSS **decision harness** — policy, confidence, shadow, shape recipes, decision evals — on top of Jev's Choice/Score/Noul.  

**Unwanted product:** a typed client wrapper, a chat SDK, an agent OS, or a vertical demo zoo.

Ship the loop artifact strangers can name in one breath: **`DecisionHarness` + policy + shadow + `jev-eval`**, proven by the two X-native shapes (UI candidate pick, NL row filter).
