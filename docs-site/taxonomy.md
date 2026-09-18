# Empirical taxonomy of Jev / System One use cases

**Method (bottom-up):** start from concrete observed experiments, cluster by *harness shape* (what the call does to candidates/state), then name the cluster after the shape. Do **not** start from product verticals or recipe-folder labels.

**Must-shape seeds** (verified via `api.fxtwitter.com`, 2026-09-17 ET):

| Seed | Observation | Emergent category IDs |
|---|---|---|
| [@milindlabs/2100631847155994852](https://x.com/milindlabs/status/2100631847155994852) | CoreML segments UI → on-device OCR → Jev distribution over element labels → click → loop; ~90ms; no pixels leave device | **`ui-grounding`** / **`candidate-action-selection`** |
| [@iam_zachi/2100679300756435135](https://x.com/iam_zachi/status/2100679300756435135) | Postgres `WHERE jev(people, 'could work from home')`; 129 row-judgments ~1s / $0.0009; cache 6ms; no index/embeddings | **`row-judgment`** / **`structured-data-filter`** |

**Data limits:** user-X MCP hit spend-cap (403) after JoshARosen harvest. Seeds + supporting posts via `api.fxtwitter.com`; secondary: TypeSafe docs (`use-case-map`, `llms.txt` cookbooks/patterns), DEV launch roundup, JackZeng/Jev_apps catalog (2026-09-18). Re-run MCP when the cap lifts.

**Wave C:** docs harvest merged as *evidence under existing shape IDs* — no parallel taxonomy. Official industry labels (support, recruiting, insurance…) stay rejected-as-roots / payload tags.

---

## Rejected pre-baked names

These looked convenient as top-level folders/buckets but **failed** the bottom-up test: they name a department, product surface, or marketing umbrella rather than a harness shape. Keep them as *tags* on evidence if useful; do not use them as taxonomy roots.

| Rejected name | Why rejected |
|---|---|
| `agents` | Too broad; milindlabs is **not** “an agent” — it is candidate-action selection over OCR’d UI. Splits into `candidate-action-selection`, confidence routing, and verify/gate. |
| `ops` | Alert/inbox/on-call recipes are instances of confidence front-door or verify/gate, not a shape. |
| `guardrails` | Subsumed by verify/gate-another-artifact; not a separate root. |
| `support` | Vertical payload (tickets) inside routing / row-filter / rubric clusters. |
| `growth` | Vertical payload (leads, ICP); not a harness shape. |
| `commerce` / `e-commerce` | Vertical payload; listings blast is `structured-data-filter`. |
| `trust-safety` / `moderation` | Policy criteria inside verify/gate or multi-score rubrics. |
| `rag` | Retrieval stacks are `structured-data-filter` + `semantic-find`, not a root. |
| `education` | Vertical only. |
| `automation` / `AI automation` | Marketing umbrella covering every cluster. |
| `real-time applications` | Latency claim, not a shape (appears inside ui-grounding / live multi-judgment / high-freq reflexes). |
| `harness engineering` | Meta-label for several clusters (routing, gates, tool pick). |
| `other` | Dumping ground; evidence either earns a shape or stays uncategorized. |
| Recipe folders `recipes/agents/`, `recipes/ops/`, `recipes/guardrails/` | Created **before** this taxonomy; provisional only — see `recipes/PENDING.md`. |

---

## Category catalog (stable IDs)

Primary IDs are kebab-case. Aliases are acceptable synonyms in tags/docs. Clusters ordered by how strongly seeds + launch-week evidence earn them.

### 1. `candidate-action-selection` *(alias: `ui-grounding`)*

**Seed:** milindlabs computer-use.

**Shape:** Classical/local perception (or DOM scrape, game rules, CV→symbols) emits a **dynamic option set**. Jev returns a distribution over that set. Code acts; re-perceive; loop until a stop judgment.

**Not:** “agents”, “computer-use as LLM vision”, or free-form planning.

| Evidence | Built |
|---|---|
| [milindlabs](https://x.com/milindlabs/status/2100631847155994852) | OCR labels only → Choice over UI elements; ~90ms |
| [gregpr07 / Browser Use](https://x.com/gregpr07/status/2100411066966749359) · [browser-use/jev-ultrafast](https://github.com/browser-use/jev-ultrafast) | Indexed DOM action space; flights 7.1s / $0.0039 |
| [awlevin/typesafe-computer-use](https://github.com/awlevin/typesafe-computer-use) | OCR screen → next action; ~$0.0002/step |
| TypeSafe Wikiracing (launch) | Choice among wiki links; no invented URLs |
| [fhshaik/typesafe-mario](https://github.com/fhshaik/typesafe-mario), Doom bots, [phyous/tsai-sc](https://github.com/phyous/tsai-sc) | Legal action Choice from structured state |
| [RomanSlack/jev-drone](https://github.com/RomanSlack/jev-drone) | Symbolic scene → tactical Choice; code owns control loop |
| [Friedjof/jev-mobile](https://github.com/Friedjof/jev-mobile) | Android: Choice over prevalidated UI actions |
| [kylejeong / Stagehand](https://x.com/kylejeong/status/2100622054945095934) | a11y tree → Jev next action → Stagehand execute (JackZeng catalog) |
| [trycua / jev-use](https://x.com/trycua/status/2100649543079502213) | Constrained action-ID menu; verify after exec |
| Docs: [function_calling](https://docs.typesafe.ai/cookbooks/function_calling.md) | Closed-set tool+arg Choice (trading demo) — catalog pick |
| Docs: [skill_suggestion](https://docs.typesafe.ai/cookbooks/skill_suggestion.md) | Rank 182 skills → shortlist → reject-or-load |
| Crazy-fast: **agent-comm** who-speaks-next | Stub `recipes/agent-comm-harness/who-speaks-next.ts` — Swarm/AutoGen selector replacement |

**Primitives:** `Choice(dynamic_candidates)` ± `Noul(done)` ± `Score(risk)`.

**Recipe:** `recipes/emergent/candidate-action-select.ts`.

---

### 2. `row-judgment` *(alias: `structured-data-filter`)*

**Seed:** iam_zachi Postgres `jev()`.

**Shape:** Map the **same** NL predicate over many rows/items (DB tuples, papers, functions, listings). Per-item Noul/Score/Choice; threshold + cache. No embeddings/index required.

**Not:** “data/analytics vertical”, RAG product, or “SQL replacement” as a category name.

| Evidence | Built |
|---|---|
| [iam_zachi](https://x.com/iam_zachi/status/2100679300756435135) | Postgres `WHERE jev(people, 'could work from home')`; 129 rows ~1s / $0.0009; cache 6ms ([fxtwitter](https://api.fxtwitter.com/iam_zachi/status/2100679300756435135)) |
| [hamiltonulmer](https://x.com/hamiltonulmer/status/2100370557405667768) | DuckDB ext: classify rows in CSV/parquet/table; ~10s / 1k rows |
| Hassan El Mghari / 1kpapers ([DEV](https://dev.to/valyuai/how-to-use-jev-a-practical-guide-to-typesafes-system-one-model-g5e)) | 1,018 papers → topic Choice; classify $0.08 vs summarize $3.99 |
| Early listing blast (same writeup) | ~98k listing classifications ~10 min |
| [sufianetaouil/every](https://github.com/sufianetaouil/every) | Noul per function for semantic code search |
| Docs: [classifying_rag_passages](https://docs.typesafe.ai/cookbooks/classifying_rag_passages.md), [hierarchical_classification](https://docs.typesafe.ai/cookbooks/hierarchical_classification.md), [autoresearch_feature_discovery](https://docs.typesafe.ai/cookbooks/autoresearch_feature_discovery.md) | Shared criteria / features over corpora |
| Docs use-case map: scientific discovery, e-commerce listings, demand-signal extract | Vertical *payloads* of the same map-over-items shape |

**Primitives:** `map(items → Noul|Score|Choice(shared_criteria))` + threshold/cache.

**Recipe:** `recipes/emergent/row-semantic-match.ts`.

---

### 3. `live-multi-judgment`

**Shape:** As state changes (keystrokes, stream), fan out many independent Scores/Nouls on the same state; UI updates in <~200ms.

| Evidence | Built |
|---|---|
| [stevekrouse](https://x.com/stevekrouse/status/2100287368221659289) · [typesafe-demo.val.run](https://typesafe-demo.val.run/) | Typewriter: many typed judgments live |
| Flavio Copes editor notes | Tone / urgency / “AI-written” on pause |
| Docs: [parallel_questions](https://docs.typesafe.ai/cookbooks/parallel_questions.md) · pattern [fan-out](https://docs.typesafe.ai/patterns/fan-out.md) | 13-Q briefing 12.2× cheaper / 10× faster batched |
| JackZeng: live-viral post analyzer | Debounced edit → multi Score/Choice live |

**Primitives:** speculative fan-out of Scores/Nouls; no cascade.

---

### 4. `confidence-front-door`

**Shape:** Cheap typed call(s) classify intent/difficulty/risk; code routes to lookup, cheap LLM, frontier LLM, or human by **confidence bands**.

| Evidence | Built |
|---|---|
| Docs / playground: helpdesk + model routing | Intent Choice + complexity Score |
| Docs: [intent-routing](https://docs.typesafe.ai/patterns/intent-routing.md), [confidence-routing](https://docs.typesafe.ai/patterns/confidence-routing.md) | Official architectural patterns |
| Docs use-case map: model routing, customer support classify/route, recruiting escalate | Same front-door shape; verticals are payloads |
| [identityTorn](https://x.com/identityTorn/status/2100475121324728615) | Internal classifier: zero-shot near fine-tune; ~$70/mo volume |
| Cascade pattern (DEV) | order_status→code; product→LLM; complaint→human |
| [JoshARosen](https://x.com/JoshARosen/status/2100721784186163465) | Route between models/tools/workers; escalate/retry/human |
| Sponsor-form / inbox ideas | Noul+Choice+Score with explicit exits |
| JackZeng: Eve/Ephraim routers, Firstmate dispatch | Criteria → model/worker Choice |

**Primitives:** `Choice(intent)` + `Score(stakes)` + confidence thresholds in code.

*Note:* provisional recipes under `recipes/ops/` and `recipes/agents/model-router` mostly belong here once folders are renamed.

---

### 5. `verify-gate`

**Shape:** State = (request, model output, tool call, fetched content, PR diff). Verdict questions: allow/revise/block, grounded?, injection?, irreversible?, claim supported?

| Evidence | Built |
|---|---|
| Coding-agent shell gate (early field notes) | read-only / reversible / irreversible + confidence |
| [devagrawal09/jev-review](https://github.com/devagrawal09/jev-review) | Staged PR risk → severity routing |
| [AbdelStark/bicameral](https://github.com/AbdelStark/bicameral), [DevMortimer/pi-warden](https://github.com/DevMortimer/pi-warden), [shiftynick/jev-axi](https://github.com/shiftynick/jev-axi) | Policy / injection / risky-diff gates |
| Docs: [llm_guardrails](https://docs.typesafe.ai/cookbooks/llm_guardrails.md), [citation_check](https://docs.typesafe.ai/cookbooks/citation_check.md), [consistency_noul](https://docs.typesafe.ai/cookbooks/consistency_noul_cookbook.md) | Jailbreak/severity; claim support; uncertain→review |
| Docs use-case map: Universal Verification, LLM guardrails, moderation T&S | Same verify/gate shape (marketing names ≠ roots) |
| [JoshARosen / Foreman](https://x.com/JoshARosen/status/2100573432089866717) · [thruwire/foreman](https://github.com/thruwire/foreman) | Progress/completeness/tests/drift/stuck; intervene |
| [JoshARosen](https://x.com/JoshARosen/status/2100721784186163465) | Filter context; evaluate tool calls before exec; trigger review |

**Primitives:** `Choice(verdict)` + failure-mode `Noul`s + confidence gate.

*Note:* provisional `recipes/guardrails/` maps here.

---

### 6. `composite-rubric`

**Shape:** Decompose a fuzzy judgment into independent Scores; combine with **code-owned** weights; retune without re-prompting.

| Evidence | Built |
|---|---|
| Resume / hiring demos | Fit Score(s) vs rubric |
| Ticket priority composites | severity × frustration × quality |
| Startup-idea judge demos | ~10 parallel questions → kill/fix/ship |
| [Crowdcheck](https://crowdcheck-ai.vercel.app/) | Batched persona reaction probs |
| Docs: [composite-scoring](https://docs.typesafe.ai/patterns/composite-scoring.md) | Official pattern: atomic Scores + code weights |
| Docs: [entity_alignment](https://docs.typesafe.ai/cookbooks/entity_alignment.md) | Score(merge/leave/curate) over candidate pairs |

**Primitives:** many `Score`s → weighted sum / matrix in code.

---

### 7. `semantic-find`

**Shape:** Candidate list already in hand (files, notes, BM25 shortlist). Choice (or per-item Score) for best match to an NL query; optional Noul “any answer exists?”

| Evidence | Built |
|---|---|
| [jev-mcp `jev_find`](https://glama.ai/mcp/servers/jkudish/jev-mcp) · [semantic_find](https://docs.typesafe.ai/cookbooks/semantic_find.md) | Rank ≤250 lines + exists Noul |
| Docs: [rerank_typesafe](https://docs.typesafe.ai/cookbooks/rerank_typesafe.md) | BM25 shortlist → per-pair TypeSafe Score (CLERC) |
| [anessbelbati/jev-rerank-bench](https://github.com/anessbelbati/jev-rerank-bench) | Rerank bench |
| Docs: [pre_parsed_value_extraction](https://docs.typesafe.ai/cookbooks/pre_parsed_value_extraction_cookbook.md), [date_extraction](https://docs.typesafe.ai/cookbooks/date_extraction_cookbook.md), [sde_cascade](https://docs.typesafe.ai/cookbooks/sde_cascade.md) | Regex/mini candidates → Choice pick / verify cascade |
| ZipLyne / schema-relevance ideas | Score tables for SQL context |

**Primitives:** `Choice(candidate_ids)` + `Noul(exists)` or map of relevance Scores.

**Relation to `row-judgment`:** find/rank selects *among* candidates for one query; row-judgment *filters a corpus* with a shared predicate. Overlap is real; keep both when the product story differs (rank UI vs SQL WHERE).

---

### 8. `high-freq-reflex`

**Shape:** Hot loop ≤ few hundred ms; Jev answers buy/sell or manoeuvre; deterministic code executes. Separated from `candidate-action-selection` when **throughput/budget** is the primary claim (not UI grounding).

| Evidence | Built |
|---|---|
| [jarrodwatts/jev-trader](https://github.com/jarrodwatts/jev-trader) | ~300ms block; ~81ms model; buy/sell |
| Doom @ ~10 q/s | Structured state → action |
| Docs “real-time applications” claim | Latency budget tag — not a separate root (see Rejected) |
| Crazy-fast map: prediction-market / sports-bet / rtb / order-allow-deny | Stubs under `recipes/high-freq-reflex/` — see `crazy-fast-decisions.md` |

---


---

## Crazy-fast decision recipes (latency / decision-count scarcity)

Research map: [`research/crazy-fast-decisions.md`](crazy-fast-decisions.md). These are **product packs / tags**, not new taxonomy roots — they sit on existing shape IDs.

| Pack / tag | Primary shape ID(s) | Recipe path | Equation (one-liner) |
|---|---|---|---|
| **agent-comm** | `candidate-action-selection`, `verify-gate` | `recipes/agent-comm-harness/` (`who-speaks-next`, `tool-exec-gate`) | agent RTT / tool mishap = $ + wallclock |
| **swarm-consensus** | `composite-rubric` | `recipes/composite-rubric/swarm-consensus.ts` (+ agent-comm re-export) | endless debate tokens = $ + time-to-consensus |
| **prediction-market** | `high-freq-reflex` | `recipes/prediction-market-gate/` | stale fill residual = $ + arb half-life |
| **sports-bet** | `high-freq-reflex` | `recipes/sports-bet-gate/` | −CLV bets = $ + line-move ms |
| **rtb** | `high-freq-reflex` | `recipes/high-freq-reflex/rtb-bid-gate.ts` (+ `recipes/rtb-bid-gate/` alias) | bad impressions / missed auctions = $ + auction budget |
| trading order gate | `high-freq-reflex` | `recipes/high-freq-reflex/order-allow-deny.ts` (+ `mm-buy-sell`, `hot-path-allow`) | adverse fills / oversize = $ + ms to cancel |

Also covered by existing recipes in the same research ranking: cyber alert (`confidence-front-door` / `alert-gate`), fraud (`hot-path-allow`), content mod (`verify-gate` / `ship-gate`), esports reflex (`candidate-action-selection`).

**Proof discipline:** do not invent measured timings. Screenshot YOUR shadow logs / eval fixtures; research lists *targets*, not harness-measured p50s.

## Frequency (this evidence set)

| ID | Approx. distinct experiments | Dominant primitive |
|---|---|---|
| `candidate-action-selection` / `ui-grounding` | 8+ | Choice(dynamic) |
| `row-judgment` / `structured-data-filter` | 6+ | Noul/Choice per item |
| `verify-gate` | 6+ | Choice+Noul |
| `confidence-front-door` | 5+ | Choice+Score+conf |
| `composite-rubric` | 4+ | multi Score |
| `semantic-find` | 3+ | Choice(+Noul) |
| `live-multi-judgment` | 2+ | fan-out Score/Noul |
| `high-freq-reflex` | 2+ | Choice in hot loop |

**Top by frequency:** candidate-action-selection, row-judgment, verify-gate, confidence-front-door.

---

## Recipe-folder mapping (post-taxonomy)

| Current provisional folder | Target category IDs |
|---|---|
| `recipes/emergent/candidate-action-select*` | `candidate-action-selection` |
| `recipes/emergent/row-semantic-match*` | `row-judgment` |
| `recipes/agents/browser-next-action`, `tool-picker`, `stop-or-continue` | mostly `candidate-action-selection` (+ stop Noul) |
| `recipes/agents/model-router` | `confidence-front-door` |
| `recipes/ops/*` | `confidence-front-door` and/or `verify-gate` |
| `recipes/guardrails/*` | `verify-gate` |

Rename/move only after callers and `catalog.ts` are updated together.


---

## Docs → shape ID map (Wave C harvest)

Official TypeSafe materials name **decision shapes** and **industry examples**. Those are *not* new taxonomy roots. Mapping:

| Official label / cookbook | Maps to shape ID | Why |
|---|---|---|
| Classification / Detection / Scoring / Routing (use-case-map task table) | primitives inside several IDs | Atomic question types, not harness loops |
| Search / Retrieval / Ranking; `semantic_find`, `rerank_typesafe` | `semantic-find` | Candidates already shortlisted; pick/rank |
| Verification; `llm_guardrails`, `citation_check`, `classifying_rag_passages` (inject/contradict) | `verify-gate` | Artifact under policy/failure modes |
| Model routing; Intent routing; Confidence-gated routing | `confidence-front-door` | Cheap classify → code path |
| Composite scoring pattern | `composite-rubric` | Multi-Score + code weights |
| Speculative fan-out; `parallel_questions` | `live-multi-judgment` (and any fan-out) | Many Qs / one state / one RTT |
| AI Map Reduce / feature extract / hierarchical class / papers / listings | `row-judgment` | Same predicate over many items |
| Harness Engineering (docs meta), Foreman stuck/drift/progress | `verify-gate` + `confidence-front-door` | Supervision = gate traces + route recovery |
| Real-time applications (docs latency claim) | `candidate-action-selection` / `high-freq-reflex` | Latency is a constraint, not a category |
| Function calling / skill_suggestion | `candidate-action-selection` (+ shortlist like `semantic-find`) | Closed/dynamic catalog Choice; code executes |
| SDE / date / pre-parsed extraction | `semantic-find` | Candidates from regex/mini → Choice |
| Entity alignment | `composite-rubric` or pairwise `row-judgment` | Ordered Score over merge actions / pairs |
| Universal Verification (docs category) | `verify-gate` | Same shape; marketing name rejected as root |

Sources: [use-case-map](https://docs.typesafe.ai/concepts/use-case-map.md), [llms.txt](https://docs.typesafe.ai/llms.txt), [patterns](https://docs.typesafe.ai/patterns.md).

---

## Recipe stubs (builder storm)

Five stubs per shape. Schema: `{ id, title, questions, state_fields, action_enum }`. Questions use `Choice|Score|Noul`. Implement under `recipes/emergent/` first; remap provisional folders later.

### `candidate-action-selection`

1. `{ id: "ui-click-pick", title: "OCR/DOM candidate click", questions: [Choice(candidate_ids), Noul(goal_done), Score(risk_if_wrong)], state_fields: [goal, candidates[{id,label}], history[]], action_enum: [CLICK_id, STOP, REVIEW] }` — milindlabs / Browser Use
2. `{ id: "browser-op-target", title: "Op × target fan-out", questions: [Choice(ops), Choice(click_targets), Choice(type_targets), Noul(blocked)], state_fields: [url, element_table, goal], action_enum: [CLICK, TYPE_TEXT, SELECT, SCROLL, WAIT, DONE, BLOCKED] }`
3. `{ id: "skill-roster-pick", title: "Skill suggestion shortlist", questions: [Choice(all_skills), Noul(needs_skill), Noul(fits_top)], state_fields: [user_turn, skill_index[]], action_enum: [SUGGEST_name, SUGGEST_NONE] }` — skill_suggestion cookbook
4. `{ id: "tool-arg-dispatch", title: "Closed-set function call", questions: [Choice(tools), Choice(arg_*)…, Noul(arg_stated_*)], state_fields: [utterance, tool_specs], action_enum: [CALL_tool, ASK_CLARIFY, REJECT] }` — function_calling cookbook
5. `{ id: "game-legal-move", title: "Legal action from structured state", questions: [Choice(legal_moves), Score(urgency)], state_fields: [board_or_ram_json], action_enum: [MOVE_id, NOOP] }`

### `row-judgment`

1. `{ id: "sql-semantic-where", title: "NL predicate over rows", questions: [Noul(matches_predicate)], state_fields: [row, predicate], action_enum: [INCLUDE, EXCLUDE, REVIEW] }` — iam_zachi jev()
2. `{ id: "duckdb-row-label", title: "Batch row Choice label", questions: [Choice(label_set)], state_fields: [row_text, label_criteria], action_enum: [LABEL_k, REVIEW] }` — hamiltonulmer
3. `{ id: "corpus-topic-tag", title: "Paper/listing topic map", questions: [Choice(topics+other)], state_fields: [title, summary_or_body], action_enum: [TAG, OTHER, REVIEW] }`
4. `{ id: "passage-keep-drop", title: "RAG passage filter map", questions: [Noul(relevant), Noul(contradicts), Noul(has_injection)], state_fields: [query, passage], action_enum: [KEEP, KEEP_FLAG, DROP] }` — classifying_rag_passages
5. `{ id: "code-noul-search", title: "Every-function semantic hit", questions: [Noul(matches_query)], state_fields: [fn_signature, fn_body_excerpt, query], action_enum: [HIT, MISS] }`

### `live-multi-judgment`

1. `{ id: "typewriter-panel", title: "Live multi-score editor", questions: [Score(tone), Score(clarity), Noul(urgent), Noul(ai_written), Choice(intent)], state_fields: [draft_text], action_enum: [UPDATE_UI] }`
2. `{ id: "ticket-fanout", title: "Speculative ticket briefing", questions: [Choice(category), Score(severity), Noul(refund), Noul(has_repro), Score(frustration)], state_fields: [ticket], action_enum: [ROUTE_BUCKET] }` — fan-out pattern
3. `{ id: "viral-post-live", title: "Debounced post analyzer", questions: [Choice(content_type), Score(virality), Noul(policy_risk)], state_fields: [draft], action_enum: [UPDATE_UI] }`
4. `{ id: "support-dual-noul", title: "Parallel yes/no probes", questions: [Noul(wants_human), Noul(repeat_contact)], state_fields: [message, locale], action_enum: [UPDATE_UI, ESCALATE] }`
5. `{ id: "briefing-batch", title: "Doc multi-Q one RTT", questions: [Noul(q1)…Noul(qn)], state_fields: [document], action_enum: [REPORT] }` — parallel_questions

### `confidence-front-door`

1. `{ id: "model-tier-router", title: "Cheap/mid/frontier router", questions: [Choice(tier), Score(wrong_answer_cost)], state_fields: [prompt], action_enum: [CHEAP, MID, FRONTIER, REVIEW] }` — existing recipe
2. `{ id: "intent-cascade", title: "Intent → code|LLM|human", questions: [Choice(intent), Score(complexity)], state_fields: [message], action_enum: [LOOKUP, SPECIALIST_LLM, HUMAN] }`
3. `{ id: "inbox-bucket", title: "Inbox triage front door", questions: [Choice(bucket), Score(urgency), Noul(is_customer)], state_fields: [from, subject, body], action_enum: [BUCKET_*, SPAM, REVIEW] }`
4. `{ id: "alert-disposition", title: "Alert gate", questions: [Choice(disposition), Score(severity), Noul(needs_human)], state_fields: [source, summary, signals], action_enum: [NOTIFY, QUEUE_REVIEW, SUPPRESS] }`
5. `{ id: "worker-dispatch", title: "Factory worker pick", questions: [Choice(worker), Score(effort), Noul(needs_verify)], state_fields: [task, prefs], action_enum: [DISPATCH, ESCALATE] }` — JoshARosen / Firstmate

### `verify-gate`

1. `{ id: "llm-io-guard", title: "LLM I/O hazard screen", questions: [Choice(verdict), Noul(jailbreak), Score(harm_if_comply), Noul(grounded)], state_fields: [user_msg, model_out, policy], action_enum: [ALLOW, REVIEW, BLOCK] }` — llm_guardrails
2. `{ id: "citation-support", title: "Claim vs source", questions: [Choice(supports|partial|unsupported), Noul(quote_present)], state_fields: [claim, source_excerpt], action_enum: [ACCEPT, FLAG, REJECT] }`
3. `{ id: "tool-call-precheck", title: "Tool call before exec", questions: [Choice(risk_class), Noul(irreversible), Noul(policy_ok)], state_fields: [tool_name, args, policy], action_enum: [EXEC, ASK_HUMAN, DENY] }`
4. `{ id: "agent-stuck-drift", title: "Foreman stuck/drift", questions: [Noul(stuck), Noul(drifted), Score(progress), Noul(tests_pass)], state_fields: [goal, trace_tail, test_summary], action_enum: [CONTINUE, NUDGE, RECOVER, STOP_REVIEW] }` — Foreman
5. `{ id: "pr-risk-gate", title: "PR/diff severity gate", questions: [Score(risk), Choice(severity), Noul(secrets)], state_fields: [diff, description], action_enum: [MERGE_OK, REQUEST_CHANGES, BLOCK] }`

### `composite-rubric`

1. `{ id: "resume-fit", title: "Multi-dim resume score", questions: [Score(skill_i)…], state_fields: [resume, job], action_enum: [PASS, REVISE, FAIL] }`
2. `{ id: "ticket-priority", title: "Severity×frustration matrix", questions: [Score(severity), Score(frustration), Score(quality)], state_fields: [ticket], action_enum: [P1, P2, P3, REVIEW] }`
3. `{ id: "entity-pair-merge", title: "Entity alignment Score", questions: [Score(merge|leave|curate)], state_fields: [left_record, right_record], action_enum: [MERGE, LEAVE, CURATE] }` — entity_alignment
4. `{ id: "ad-creative-rubric", title: "Brand-safety + quality", questions: [Score(brand_safety), Score(creative_quality), Noul(claim_ok)], state_fields: [creative, landing, policy], action_enum: [APPROVE, EDIT, REJECT] }`
5. `{ id: "idea-kill-fund", title: "Startup idea panel", questions: [Score(dim_i)…, Noul(fatal_flaw)], state_fields: [pitch], action_enum: [KILL, FUND, SHIP_PROBE] }`

### `semantic-find`

1. `{ id: "line-semantic-find", title: "Doc line pick", questions: [Choice(line_ids), Noul(answer_exists)], state_fields: [query, lines[{id,text}]], action_enum: [PICK, NONE] }` — semantic_find
2. `{ id: "bm25-rerank", title: "Shortlist rerank", questions: [Score(relevance) per cand], state_fields: [query, candidates[]], action_enum: [ORDERED_IDS] }` — rerank_typesafe
3. `{ id: "span-pick", title: "Pre-parsed value pick", questions: [Choice(candidate_spans), Noul(none_fit)], state_fields: [request, spans[]], action_enum: [TAKE_span, NONE] }` — pre_parsed_value_extraction
4. `{ id: "schema-table-pick", title: "SQL context tables", questions: [Score(relevance) per table], state_fields: [nl_query, tables[{name,cols}]], action_enum: [INCLUDE_set] }`
5. `{ id: "evidence-select", title: "Evidence for claim", questions: [Choice(passage_ids), Noul(sufficient)], state_fields: [claim, passages[]], action_enum: [SELECT, NEED_MORE] }`

### `high-freq-reflex`

1. `{ id: "mm-buy-sell", title: "Block-time book reflex", questions: [Choice(buy|sell|hold), Score(edge)], state_fields: [book_snapshot], action_enum: [BUY, SELL, HOLD] }` — jev-trader
2. `{ id: "drone-manoeuvre", title: "Tactical Choice @ ~2.5Hz", questions: [Choice(manoeuvres), Score(risk), Noul(target_lost)], state_fields: [sectors, bearing], action_enum: [MANOEUVRE_*, HOLD] }`
3. `{ id: "game-tick-action", title: "Emulator tick Choice", questions: [Choice(buttons)], state_fields: [ram_objects], action_enum: [PRESS_set] }`
4. `{ id: "hot-path-allow", title: "Sub-100ms allow/deny", questions: [Noul(allow), Score(severity)], state_fields: [event], action_enum: [ALLOW, DENY] }`
5. `{ id: "voice-browser-snap", title: "Voice→browser op", questions: [Choice(browser_ops)], state_fields: [transcript], action_enum: [OP_*] }` — JackZeng voice-browser

---

## Implementation priority (OSS `jev-harness`)

Ordered for recipe storm: seed coverage first, then harness differentiation, then breadth.

| Priority | Shape ID | Why now | First stubs to code |
|---|---|---|---|
| P0 | `candidate-action-selection` | Seed #1; already `recipes/emergent/candidate-action-select.ts` | Extend: `browser-op-target`, `skill-roster-pick` |
| P0 | `row-judgment` | Seed #2; already `row-semantic-match.ts` | Extend: `sql-semantic-where` batch helper, `passage-keep-drop` |
| P1 | `confidence-front-door` | Existing model-router / inbox / alert recipes; docs patterns | Stabilize + remap from `ops/`/`agents/` |
| P1 | `verify-gate` | Existing llm-verifier; Foreman/docs guardrails are the OSS story | `agent-stuck-drift`, `tool-call-precheck`, `citation-support` |
| P2 | `semantic-find` | Official cookbooks; complements row-judgment | `line-semantic-find`, `bm25-rerank`, `span-pick` |
| P2 | `composite-rubric` | Existing rubric-scorer | `entity-pair-merge`, weighted ticket priority |
| P3 | `live-multi-judgment` | Demo-friendly; fan-out is core SDK pattern | `typewriter-panel`, `ticket-fanout` examples |
| P3 | `high-freq-reflex` | Niche; share Choice loop with P0 but different SLO story | Optional example only unless latency harness lands |

**Do not** open new top-level folders named after rejected verticals. Prefer `recipes/emergent/<stub-id>.ts` keyed by shape ID until catalog rename.
