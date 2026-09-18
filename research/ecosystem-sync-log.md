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

