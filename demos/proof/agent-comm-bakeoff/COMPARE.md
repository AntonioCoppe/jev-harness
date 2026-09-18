# Agent-comm bakeoff: Arm A vs Arm B

**Fixed task:** Design a 3-agent Polymarket BTC 15m small-arb pipeline (roles, decision gates, kill criteria).  
**Agents:** Researcher · Critic · Synthesizer  
**Sources:** `arm-a/metrics.json`, `arm-b/metrics.json`, `arm-a/live-wakes.json` (ET, 2026-09-17).

## Comparison table

| Metric | Arm A (control) | Arm B (Jev who-speaks) |
|---|---|---|
| Mode | `free_for_all_all_wake` | `jev_who_speaks_gate` |
| Rounds | 6 (planned) / 3 live parent rounds | 6 |
| Agents | 3 | 3 |
| Planned wakes | **18** (3 × 6) | **6** (1 × 6) |
| Live / parent wakes fired | **9** (`live-wakes.json`: 3 rounds × 3) | **6** planned; parent relay on `WAKE` lines |
| Executor `actual_wakes_sent` | 0 (blocked) | 0 (parent protocol) |
| Wake reduction vs A | — | Planned **−12 (−66.7%)**; live free-for-all slice 9 → gated 6 |
| Selector ms | N/A (no gate) | **p50 216 ms** (samples: 596, 490, 193, 167, 216, 261) |
| Estimated waste (speakers) | **9 (50%)** floor on planned 18 | **0 (0%)** — one speaker/round |
| Excess wakes vs gated (model) | ≥6..12 across 6 rounds | — |
| Selection source | Always all agents | Live Jev (`jev_agent_picks`: 6, fallbacks: 0) |

## Qualitative notes

**Arm A — free-for-all**

- Always wake all 3 every round; no Jev / TypeSafe / who-speaks-next.
- Executor lacked `SendToAgent` (and channel post); coordinator metrics are the **planned** cost model. Parent later fired **9** 1:1 wakes for a 3-round live slice (`live-wakes.json`).
- Waste floor: ≥50% of wakes are agents with nothing new → `ceil(18 × 0.5) = 9`. Often higher once synthesizer stabilizes.
- `design.md` / claims artifacts keep the arm comparable even when in-process replies were not collected.

**Arm B — Jev who-speaks gate**

- Live TypeSafe Jev via `DecisionHarness` + `recipes/agent-comm-harness/who-speaks-next.ts`.
- One speaker per round → estimated redundant-speaker waste ≈ **0** vs free-for-all; residual risk is a wrong specialist once.
- Executor still cannot `SendToAgent`; parent fires from `WAKE <serverId> <role>` / `wake-queue.jsonl`.
- Selector overhead is sub-second (**p50 216 ms** in this metrics snapshot). All 6 picks were live Jev agent choices (0 fallbacks).
- `proxy_utterance` used for transcript continuity until live bot claims arrive.

## Bottom line

On the same design task, gated who-speaks cuts **planned** wakes by **two-thirds** (18 → 6) and estimated speaker waste from **~50% → ~0%**, at ~**216 ms** median selector cost. Live parent-fired free-for-all still paid **9** wakes in only 3 rounds vs a gated **6** across 6 rounds. Primary proof metric remains **wake count / waste**, not design prose quality.

## Artifacts

- `arm-a/` — PROTOCOL, metrics, wake-schedule, design, live-wakes
- `arm-b/` — metrics, rounds.jsonl, wake-queue, transcript, runner

## Design quality (side observation)

Both arms converged on Scout→Judge/Arbiter→Executor with fee/depth/time kills.

**Arm B distinctive:** explicitly splits **code-owned** book/limit checks from **Jev-owned** place-vs-skip confidence gate — matches jev-harness thesis (System One decides, code controls).

**Arm A distinctive:** stronger emphasis on independent CEX mid fair-value SLA (Researcher r2).
