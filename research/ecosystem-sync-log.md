# Ecosystem sync log

Standing routine: scan taxonomy + catalog + latest X/use-case research, pick ≤1 high-value recipe gap with public demos + DecisionHarness fit, ship or explain skip.

Hard rules: no invented APIs/numbers; not `/compact`; community metrics ≠ ours.

---

## 2026-09-18 ET — sync #1 (first run)

**Time:** Fri Sep 18, 2026 ~10:45 ET (America/Toronto)

### Inputs read
- `research/taxonomy.md`
- `recipes/catalog.ts`
- `research/x-usecases-LATEST.md` (~10:15 ET same day)
- `research/excitement-themes-LATEST.md`

### Quick web scan (newer than docs?)
- [awesomejev.com](https://awesomejev.com/) still stamped **Refreshed 2026-09-17** (410 entries / 10,093★ snapshot) — no newer catalog day than the LATEST docs.
- Confirmed public Foreman evidence via fxtwitter: [@JoshARosen/2100573432089866717](https://x.com/JoshARosen/status/2100573432089866717) (likes/bookmarks/views as of fetch; **community metrics ≠ ours**).
- GitHub [thruwire/foreman](https://github.com/thruwire/foreman) still the primary OSS supervisor demo.
- Adjacent agent-tooling (pi-warden stuck loops, pi-agent-foreman, harnessjudge, limpet) reinforces the same **verify-gate supervisor** shape — not new taxonomy roots.
- Skipped for this sync: SQL UDF packaging, Crowdcheck persona blast, HA/IoT, voice turn-end, Workers AI binding, high-freq Polymarket/sports/RTB/fraud (stubs; measured public demos still thin), compaction (out of scope).

### Gap chosen (1)
**`agent-stuck-drift`** (`verify-gate`) — Foreman-shaped pack: `stuck` + `drifted` + `progress` + `tests_pass` + disposition → `continue` / `nudge` / `recover` / `stop_review` with `goal` + `trace_tail` + `test_summary` state.

**Why this over others**
- Explicit gap in `x-usecases-LATEST.md` §4 (“Agent factory supervisor (Foreman)”).
- Taxonomy P1 stub `agent-stuck-drift` already named; public demo exists.
- **Not** covered by `shell-command-gate` / `keystroke-launcher` (shipped earlier today for weekend proofs).
- Distinct from thinner `stop-or-continue` (loop control only — no drift/tests/intervene pack).

### Shipped
- Recipe: `recipes/verify-gate/agent-stuck-drift.ts`
- Fixture: `eval/fixtures/agent-stuck-drift.jsonl`
- Wired: `recipes/catalog.ts`, `recipes/index.ts`, `eval/cli.ts`, verify-gate README, `recipes/PENDING.md`
- `npm run build` + offline eval of that fixture (see commit message / CI notes)

### Not shipped (deferred)
- Postgres/DuckDB UDF contract (packaging, not DecisionHarness core)
- Persona/Crowdcheck multi-Score blast
- Chess/Gomoku tactical prefilter template (shape already in candidate-action)
- Live Polymarket / sports CLV / RTB measured demos (evidence still thin)


---

## 2026-09-18 ET — sync #2

**Time:** Fri Sep 18, 2026 ~12:45 ET (America/Toronto)

### Inputs read
- `research/ecosystem-sync-log.md` (sync #1)
- `recipes/catalog.ts`
- `research/x-usecases-LATEST.md` (~10:15 ET same day)
- `research/taxonomy.md` (verify-gate stub `pr-risk-gate`)

### Quick web scan (newer than sync #1?)
- [awesomejev.com](https://awesomejev.com/) now stamped **Refreshed 2026-09-18** — **485 entries / 21,175★** (was 410 / 10,093★ on 09-17 snapshot in LATEST docs). Catalog growth, not our metrics.
- Confirmed public PR-review evidence: [devagrawal09/jev-review](https://github.com/devagrawal09/jev-review) README documents staged workflow `Noul risk matrix → Choice/Score file profiles → evidence → mechanism → Score severity → conditional Choice reviewer routing`; screens correctness / security / reliability / compatibility / test coverage. GitHub ★~247 at fetch (community ≠ ours).
- Adjacent: NiazMorshed2007/jev-review MCP, raihankhan-rk/diffjury (“PR risk router”), check-risk CLI — same verify-gate PR/diff shape.
- Crowdcheck live site still persona blast demo (no new measured packaging for a recipe this sync).
- Skipped: SQL/DuckDB UDF contract (packaging ≠ DecisionHarness core); email triage at scale (inbox-triage already shipped; Ryan Vogel still secondary cite only); prediction-market / sports / RTB live measured demos still thin; compaction (out of scope); persona Score blast (Crowdcheck exists but multi-persona pack not clearly a DecisionHarness gap over composite-rubric).

### Gap chosen (1)
**`pr-risk-gate`** (`verify-gate`) — taxonomy P1 stub + jev-review deepening: `risk` + `severity` + `secrets` + `security_issue` + `test_gap` + `correctness` + `disposition` → `merge_ok` / `request_changes` / `block`.

**Why this over others**
- Explicit taxonomy stub + gap callout in `x-usecases-LATEST.md` §4 (jev-review / PR risk).
- Public OSS demo with documented staged judgments (not invented).
- **Not** covered by `ship-gate` / `llm-verifier` (output strings) or `agent-stuck-drift` (agent supervisor) or `shell-command-gate` (CLI allow/deny).

### Shipped
- Recipe: `recipes/verify-gate/pr-risk-gate.ts`
- Fixture: `eval/fixtures/pr-risk-gate.jsonl`
- Wired: `recipes/catalog.ts`, `recipes/index.ts`, `eval/cli.ts`, verify-gate README, `recipes/PENDING.md`
- `npm run build` + offline eval of that fixture (see commit)

### Not shipped (deferred)
- Postgres/DuckDB UDF contract note (still packaging)
- Persona/Crowdcheck multi-Score blast
- Email thread/webhook scale demo beyond `inbox-triage`
- Live Polymarket / Kalshi measured fixtures


---

## 2026-09-18 ET — sync #3

**Time:** Fri Sep 18, 2026 ~2:46 ET (America/Toronto)

### Inputs read
- `research/ecosystem-sync-log.md` (sync #1 + #2)
- `recipes/catalog.ts`
- `research/taxonomy.md` (P0 stub `skill-roster-pick`; P1 `citation-support`)
- `recipes/PENDING.md`

### Quick web scan (newer than sync #2?)
- [awesomejev.com](https://awesomejev.com/) stamped **Refreshed 2026-09-18** — **488 entries / 21,644★** (was 485 / 21,175★ at sync #2 ~12:45 ET). Catalog growth, not our metrics.
- Confirmed public skill-routing evidence: [Dicklesworthstone/skillranker](https://github.com/Dicklesworthstone/skillranker) README documents Jev-backed next-step skill ranking (needs_skill gate + Choice over roster + fit / abstain; builds on TypeSafe skill_suggestion cookbook). GitHub ★~43 at fetch (community ≠ ours).
- Adjacent (same shape, not new roots): jev-skill-gate, typesafe-skill-router / typesafe-mod, skill-router listings on awesomejev § Agent tooling.
- Fresh GitHub noise since sync #2 mostly thin 0★ packaging (sqlite-jev, bouncer, noulgate, job matchers) — overlaps existing row-judgment / tool-gate / model-router rather than new DecisionHarness gaps.
- Skipped: compaction (`fast-jev-compaction` / winnow / yoshi — out of scope); SQL/Postgres/SQLite UDF packaging; Crowdcheck persona Score blast; citation-support (taxonomy P1 + cookbook, but weaker priority than P0 skill-roster this run); high-freq Polymarket/sports/RTB live measured demos still thin; HA/IoT / voice turn-end.

### Gap chosen (1)
**`skill-roster-pick`** (`candidate-action-selection`) — taxonomy P0 stub + skill_suggestion / SkillRanker deepening: Choice over skill roster + `needs_skill` + `fits_top` → `<skill-id>` / `none`.

**Why this over others**
- Explicit taxonomy P0 stub (`skill-roster-pick`) + official skill_suggestion cookbook cite.
- Public OSS demo with documented need/fit/abstain workflow (not invented).
- **Not** covered by `tool-picker` (tools ≠ SKILL.md procedures) or `who-speaks-next` / `stop-or-continue`.
- Higher priority than deferred `citation-support` this sync.

### Shipped
- Recipe: `recipes/candidate-action-selection/skill-roster-pick.ts`
- Fixture: `eval/fixtures/skill-roster-pick.jsonl`
- Wired: `recipes/catalog.ts`, `recipes/index.ts`, `eval/cli.ts`, candidate-action-selection README, `recipes/PENDING.md`
- `npm run build` + offline eval of that fixture (see commit)

### Not shipped (deferred)
- citation-support (verify-gate P1 stub; keep for a later sync)
- Postgres/DuckDB/SQLite UDF contract (packaging ≠ DecisionHarness core)
- Persona/Crowdcheck multi-Score blast
- Compaction / context-sieve plugins (out of scope)
- Live Polymarket / Kalshi / RTB measured fixtures

### Proof note
- `skill-roster-pick` has offline fixtures only — **no** live measured wall under `demos/proof/multi/` yet. Next proof candidate when a TypeSafe API key + recording pass is available (do not invent timings).
- Existing multi-use-case proof pack still measuring: NL row filter, shell gate, keystroke launcher, alert gate, model cost router (our numbers only).


---

## 2026-09-25 ET — sync #4 (multi-gap)

**Requested scope:** find latest public Jev use cases (web, X, Reddit) and add the uncovered ones to the harness.

### Access note
- This run's network policy blocked awesomejev.com, docs.typesafe.ai, x.com / fxtwitter, reddit.com, and most blogs (MindStudio, AY Automate, Substack, MarkTechPost). Evidence below comes from web-search snippets plus GitHub READMEs (reachable). X/Reddit threads were **not** read directly.

### Sources scanned
- [Anil-matcha/awesome-jev-by-typesafe](https://github.com/Anil-matcha/awesome-jev-by-typesafe) — 31 official use-case patterns + ~70 community builds.
- [AbdelStark/awesome-typesafe-jev](https://github.com/AbdelStark/awesome-typesafe-jev) — source-backed community list.
- Web search: MarkTechPost launch coverage (2026-09-19), Firecrawl / LangChain / Beam / flaviocopes explainers, X trending pages.

### Gaps chosen (4)
| Recipe | Category | Public evidence |
|---|---|---|
| `done-claim-check` | verify-gate | [valentynkit/jev-belay](https://github.com/valentynkit/jev-belay) (Claude Code Stop hook, 4-question call), [qkal/Canny](https://github.com/qkal/Canny) |
| `citation-support` | verify-gate | taxonomy P1 stub (deferred at syncs #1–#3); TypeSafe citation_check cookbook; [MarissaFamularo/citation-verifier](https://github.com/MarissaFamularo/citation-verifier) |
| `invoice-match-gate` | verify-gate | TypeSafe “Invoice matching and payment controls” use case ([evals.typesafe.ai/invoice_processing](https://evals.typesafe.ai/invoice_processing)) |
| `passage-keep-drop` | row-judgment | taxonomy P0 stub; classifying_rag_passages cookbook; [WiktorB2004/llama-index-jev](https://github.com/WiktorB2004/llama-index-jev) |

### Shipped
- Recipes + offline fixtures (4 cases each), wired into `recipes/catalog.ts`, `recipes/index.ts`, `eval/cli.ts`, category READMEs, `recipes/PENDING.md`.
- `npm run build` clean; full offline eval 171/171 passing.
- No live timings added (no API key run).

### Seen but not shipped (already covered or thin)
- Commit-message vs diff check (jev-commit), pre-push secret scan (Jev-Git) — close to `pr-risk-gate`.
- Tool-call deny/ask/allow (Jev-Guard, r2r-Jev) — covered by `tool-exec-gate` / `tool-call-allowlist`.
- Model/reasoning routers (JevRouter, Switchboard, Jevonian, Jev Auto Router) — covered by `model-router` / `model-cost-router`.
- Semantic grep/find/SQL (nlgrep, jgrep, jfind, JevQL, Pg-Jev, DuckDB-Jev) — covered by `row-semantic-match` / `line-semantic-find`.
- Feed slop / spoiler / sponsor filters (Jev-Slop-Guard, PlotVeil, Jev-Skip) — near `edge-content-mod`; possible future `feed-item-filter`.
- Expense-claim approval, insurance claims triage, agent-trace observability, entity alignment — official use cases; candidates for a later sync.
- Game/robotics control (Pokemon Red, Jev-Drone, Snake, Chess) — covered by `esports-reflex` / `candidate-action-select`.
