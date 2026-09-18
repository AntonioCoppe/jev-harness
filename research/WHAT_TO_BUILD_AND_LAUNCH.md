# What to build and launch — jev-harness

**For:** Antonio Coppe  
**Date:** Thu Sep 17, 2026 (ET)  
**Synthesizes:** `product-surface.md` · `oss-launch-playbook.md` · `oss-harness-success-a.md` · `taxonomy.md`

**One-liner (lead with this):**  
> Not another LLM wrapper — an OSS harness for *deciding*: dynamic candidate pick, NL row filters, and confidence front-doors on TypeSafe Jev.

**Subtitle:** DecisionHarness for Jev — confidence-gated Choice/Score/Noul → policy → action, with shadow mode and evals.

---

## 1. What jev-harness IS

`jev-harness` is the **decision control plane** on TypeSafe Jev / System One: `state → questions → answers → policy → action`. Competitors own generate, stream, constrain, orchestrate, or prompt-eval; nobody owns **decide-with-confidence → policy → action** as a first-class OSS loop. Strangers get one noun (`DecisionHarness`), one verb (`run` + policy), shadow dry-runs, shape recipes, and `jev-eval` fixtures — not a typed SDK re-export, chat UI, or agent OS.

---

## 2. What we MUST offer (MVP checklist, ship order)

Each item must be copy-pasteable and visible in the README within ~30s of scroll.

1. **`DecisionHarness.run({ state, questions, policy, mode })`** — the product noun; document the loop.
2. **Policy as the product** — `minConfidence`, `onLowConfidence` (`review` / `escalate_llm` / `suppress` / `proceed`), `decide(ctx) → action`; helpers: `threshold`, `weightedScores`, `choiceOrEscalate`.
3. **Shadow mode + structured decision logs** — `mode: "shadow"` → always `shadow_noop`, preserve `intendedAction` + reason; JSONL strangers can `jq`.
4. **Two seed recipes (empirical shapes)** — `candidate-action-selection` (dynamic Choice + stop Noul); `row-judgment` (NL predicate over rows).
5. **One confidence-front-door recipe** — alert-gate or model-router (Choice + Score → route/suppress with bands).
6. **`jev-eval` CLI + JSONL fixtures** — offline policy unit tests (no API) + `--live`; assert on **action** (± confidence bands).
7. **Recipe catalog** — shape ID, when-to-use, primitives; `getRecipe` / `recipesByCategory`.
8. **Env contract** — `TYPESAFE_API_KEY`, `.env.example`, `npm run example:*` / `npm run eval`, default `jev-latest`.

*Defer:* live multi-judgment UI, Postgres UDF package, LangGraph/AI SDK adapters, calibration plots, Hub publish.

**Clone-to-wow ≤5 min:** offline eval exits 0 → live alert prints action → `SHADOW=1` shows `shadow_noop` + `intendedAction` → stranger writes **policy**, not prompts.

---

## 3. What we must NOT build

| Do not build | Why |
|---|---|
| Multi-provider chat / `useChat` | AI SDK owns it; Jev does not generate prose |
| General agent OS / durable graphs | LangGraph owns orchestration |
| Prompt optimizer / MIPRO-style compile | DSPy owns that layer |
| Full redteam / vuln scanner | Promptfoo; stay decision-policy eval |
| Validator Hub (PII/toxicity/regex) | Guardrails Hub; ship semantic gates as recipes only |
| Constrained decoding / grammars | Outlines / provider JSON mode |
| Embedding + RAG framework | Row-judgment is map+threshold, not retrieval |
| Vertical packs as taxonomy roots | Verticals are tags (`taxonomy.md`) |
| Re-implement `@typesafe-ai/sdk` | Re-export; wrap the decision loop only |
| LangChain-style abstraction tower | One class + recipes + eval CLI |
| Config-only / new DSL product | aiconfig / Guidance caution — keep idiomatic TS |

---

## 4. Empirical recipe categories (ranked)

Frequency-led from `taxonomy.md` (harness *shapes*, not departments):

| Rank | ID | Lead with? | Why |
|---:|---|---|---|
| 1 | **`candidate-action-selection`** *(ui-grounding)* | **Day-0 X + HN** | Strongest seed (milindlabs / Browser Use); visceral video |
| 2 | **`row-judgment`** *(structured-data-filter)* | **Day-0 X + HN** | iam_zachi SQL wow; hard $ / ms / negation |
| 3 | **`verify-gate`** | Week-1 demos | Coding-agent / PR / injection gates; production trust |
| 4 | **`confidence-front-door`** | MVP third recipe | Model-router / alert-gate; production story |
| 5 | **`composite-rubric`** | Later | Code-owned Score weights; delight (rubric mixer) |
| 6 | **`semantic-find`** | Later | Rank among known candidates |
| 7 | **`live-multi-judgment`** | Delight only | Typewriter UI bait |
| 8 | **`high-freq-reflex`** | Niche | Hot-loop throughput claim |

Reject as roots: agents, ops, guardrails, support, growth, commerce, rag, automation.

---

## 5. Launch plan for X + HN

### Timeline

| Day | Channel | Move |
|---|---|---|
| **−3** | Private | Soft-share recipes with 2–3 builders; collect quote-tweets with numbers |
| **0 AM** | **X** | Launch video + $ + ms (Post 1) |
| **0 midday** | **Show HN** | Title + first comment ready; stay in thread **4–6h** |
| **+1–3** | X | One recipe teaser/day; QT community forks |
| **+7** | HN *only if new* | Benchmark or “shadow in prod” — **not** a repeat Show HN |

**Win formula:** falsifiable claim + 1× video + founder replies + Diff FAQ vs LangChain / Outlines / Browser Use / DSPy. Soft Show HNs without a wow claim flop (Promptfoo 14 pts).

### Paste-ready — Show HN

**Title:**  
`Show HN: jev-harness – typed Choice/Score decisions for UI clicks and NL row filters`

**Alt:**  
`Show HN: System One decisions – pick among real candidates with confidence, not another agent framework`

**First comment:**

> Hi HN — we built **jev-harness** around TypeSafe **Jev / System One**: instead of asking an LLM to “figure it out,” you give it a **typed decision** over candidates your code already knows.
>
> Primitives:
> - **Choice(options)** → distribution over a dynamic set (UI elements, DOM ids, wiki links, tool names)
> - **Score / Noul** → graded or boolean judgments (row filters, gates)
> - **confidence + shadow mode** → ship the harness before you trust it in prod
>
> Two recipes we keep seeing in the wild (and ship as copy-paste):
> 1. **UI candidate-click** — local OCR/DOM → labels only → Choice → click → loop (~tens of ms/decision; no pixels to a frontier model). Shape: `candidate-action-selection`
> 2. **NL row filter** — map the same predicate over rows without embeddings/index. Shape: `row-judgment`
>
> This is **not** LangChain/Crew (orchestration), **not** Outlines (token grammars), and **not** “computer use via screenshots.” It’s the decision layer when the option set is already structured.
>
> Repo: *[link]* · 60s path: `npm i … && node examples/…`
>
> Happy to dig into confidence calibration, shadow diffs, or how people wire this next to Browser Use / Postgres.

### Paste-ready — X posts

**1) Launch**

> we open-sourced **jev-harness** — TypeSafe System One for agents that must *decide*, not essay.
>
> Choice / Score / Noul + confidence + shadow mode  
> recipes: UI candidate-click · NL row filter
>
> no embeddings. no prompt soup. candidates in → decision out.
>
> [video: 15-line Choice demo]  
> github: *[link]*

**2) Demo (metric-first, 1×)**

> Browser step: DOM → numbered actions → one Jev Choice  
> (typing falls back to a small LLM)
>
> Zürich→London booked in **7.1s** for **$0.0039**  
> (video is **1×**)
>
> harness shape = candidate-action-selection, not “vision agent”
>
> [video] recipe: `candidate-action-select` · [repo]

**3) Recipe teaser (SQL / negation)**

> Postgres without a vector index:
>
> ```sql
> WHERE jev(people, 'could work from home')
> ```
>
> 129 row-judgments ≈ **1s** / **$0.0009** · cache **6ms**  
> no embeddings. just Noul/Score over rows.
>
> [video] · `row-semantic-match` in jev-harness

**Negation stack to reuse:** “No embeddings. No prompt templates. No screenshots to a frontier model.”

---

## 6. README / demo gaps to close before push

*Core README/CONTRIBUTING/architecture already drafted (`readme-done.md`). Close these before public push:*

| Gap | Action |
|---|---|
| **Hero positioning** | Lead with one-liner #3; slogan “LLMs generate. Jev decides.” already OK |
| **Live vs shadow + fail path** | First screenful: low-confidence → `review` *and* `SHADOW=1` → `shadow_noop` |
| **Runnable seed examples** | Add `examples/candidate-action.ts` + `examples/row-semantic-match.ts` (today only alert-gate + model-router) |
| **npm scripts** | `example:candidate`, `example:rows` wired like `example:alert` |
| **60s video A** (≤25s, **1×**) | UI candidate-click: labels → probability bars → act/STOP; overlay ms/$ |
| **60s video B** (≤20s, **1×**) | NL row filter / `WHERE jev(…)` with $ and ms on screen |
| **GIF/asciinema in README top** | Alert-gate or triage before/after (live vs shadow) |
| **Diff FAQ** | vs LangChain/Crew · Outlines/Guidance · Browser Use vision · DSPy compile |
| **Offline eval path in Quick start** | `npm run eval -- eval/fixtures/alert-gate.jsonl` before live key |
| **Verify clone path** | Node ≥20 → `npm i` → `.env` → build → eval 0 → live example |
| **Public repo URL** | Fill *[link]* in drafts; MIT LICENSE visible |
| **Do not** | Push without videos + seed examples; do not lead with vertical folders |

---

## 7. Success metrics — week 1

| Metric | Target (week 1) | Signal |
|---|---|---|
| Clone → first success | Stranger hits wow in **≤5 min** (offline eval + one live example) | Support / Discord questions drop after Quick start |
| X launch post | **Hard numbers** + 1× video; aim for engagement in milindlabs / iam_zachi class (hundreds of likes), not text-only | Quote-tweets with forks |
| Show HN | Founder replies same day; thread asks “diff vs LangChain?” and gets FAQ paste | Pts secondary to quality of technical engagement |
| GitHub | Stars secondary; track **clones, example runs, recipe PRs** | 1+ external PR or recipe fork |
| Product proof | ≥1 person runs **shadow mode** on real traffic / inbox dump | Intended vs live mismatch stories |
| Eval adoption | Someone adds a **JSONL fixture** for their policy | CI exit-code usage |
| Category clarity | Outsiders say “decision harness” / cite shapes by ID | Not “another agent framework” |

**North star:** strangers can name the loop in one breath — **`DecisionHarness` + policy + shadow + `jev-eval`** — proven by the two X-native shapes.

---

*Sources: research notes dated 2026-09-17 ET. Re-run user-X when spend-cap lifts for fresher engagement numbers.*
