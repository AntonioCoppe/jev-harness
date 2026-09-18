# Agent-comm bakeoff COMPARE

**Task (identical):** Design a 3-agent pipeline for Polymarket BTC 15m small-arb (roles, gates, kills).  
**Agents/arm:** Researcher · Critic · Synthesizer

## Live wake accounting (what we actually fired)

| Arm | Mode | Rounds | Wakes fired | How |
|-----|------|--------|-------------|-----|
| **A** | Free-for-all | 3 | **9** | Every round woke all 3 bots via `SendToAgent` |
| **B** | Jev `who-speaks-next` | 6 selector calls | **4** | Only woke the chosen speaker (or skipped on low conf) |

**Wake reduction: 9 → 4 (−56%)** for the same design task.

### Arm B selector log (live TypeSafe Jev)

| Round | Decision | Conf | Selector ms | Wake? |
|------:|----------|-----:|------------:|-------|
| 1 | `researcher` | 0.655 | 445 | ✅ Harness Researcher |
| 2 | `review` (suppress) | 0.415 | 526 | ❌ no wake |
| 3 | `review` (suppress) | 0.423 | 494 | ❌ no wake |
| 4 | `critic` | 0.738 | 630 | ✅ Harness Critic |
| 5 | `synthesizer` | 0.695 | 584 | ✅ Harness Synthesizer |
| 6 | `synthesizer` | 0.625 | 531 | ✅ Harness Synthesizer |

Selector p50 ≈ **500–530 ms** (live `jev-1.13.0`).

## Equation

`wasted speaker turns = $ (tokens) + wallclock`

Free-for-all pays **3× tokens every round** whether or not that specialist is needed.  
Jev gate pays **one specialist** when confident, and **pays nothing** when conf < 0.5.

## Artifacts

- `arm-a/` — free-for-all protocol + planned 18-wake schedule + live 9 wakes
- `arm-b/` — `rounds.jsonl`, `metrics.json`, who-speaks runner
- Bots: Baseline 3966990/92/94 · Harness 3966998/7000/7001
- Rooms: `Bakeoff A — Free-for-all` · `Bakeoff B — Jev harness`

## Caveats

- Arm A coordinator could not call `SendToAgent` (tool missing in executor); parent fired wakes.
- Channel posts require membership; 1:1 wakes used instead.
- Bot replies are async — design quality is secondary; **wake count** is the primary proof metric.
