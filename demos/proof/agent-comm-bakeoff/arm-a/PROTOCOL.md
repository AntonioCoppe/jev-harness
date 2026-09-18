# Bakeoff Arm A — Free-for-all (CONTROL)

**Arm:** A  
**Mode:** `free_for_all_all_wake`  
**Harness:** NONE (no TypeSafe / no Jev / no who-speaks-next gate)  
**Channel:** Bakeoff A — Free-for-all (`serverId` 3967006)

## Intent

Arm A is the **control** condition for the agent-comm bakeoff. Every round the coordinator wakes **all three** specialists in parallel, regardless of whether they have new signal. This models the default multi-agent chat pattern: broadcast wake → everyone speaks → coordinator merges.

Arm B (elsewhere) gates who speaks. Arm A does not.

## Agents

| Role | Name | serverId | UUID |
|---|---|---|---|
| Researcher | Baseline Researcher | 3966990 | `7555eefe-5acc-40e7-b806-99935d2d7418` |
| Critic | Baseline Critic | 3966992 | `2c783043-af03-4f82-8996-1923412c592c` |
| Synthesizer | Baseline Synthesizer | 3966994 | `d1602eba-efa9-4813-bb2a-525f6decbcee` |

## Fixed task (same as Arm B)

> Design a 3-agent pipeline that monitors Polymarket BTC 15m markets and decides whether to place a small arb. Output: roles, decision gates, kill criteria. Keep it concrete.

## Protocol (rounds 1..6)

1. Coordinator builds a short **last claims summary** (empty on round 1).
2. Coordinator wakes **ALL THREE** agents in parallel (`SendToAgent` priority true), each with:
   - the fixed task
   - the last claims summary
   - instruction: one short contribution (≤5 sentences), end with `claim:`
3. Wall clock starts at first wake of the round; ends when 3 replies are collected (or timeout).
4. Coordinator appends claims → next round summary.
5. Repeat for 6 rounds.

**Cost model (CONTROL):**
- Planned wakes = `3 agents × 6 rounds = 18`
- Free-for-all waste: agents woken with nothing new. Assume **≥50%** wasted speaker turns.
- Equation (research): wasted speaker turns = **$ + wallclock**

## Explicit non-goals for Arm A

- Do **not** use TypeSafe / Jev / DecisionHarness / who-speaks-next.
- Do **not** selectively mute agents mid-round.
- Do **not** expand the fixed task scope.

## Outputs in this directory

| File | Purpose |
|---|---|
| `PROTOCOL.md` | This document |
| `metrics.json` | Arm A cost/waste metrics |
| `wake-schedule.json` | Planned 18 wakes (round × agent) |
| `blocker.json` | Messaging tool availability / blockers |
| `claims-log.md` | Round-by-round claims (simulated if wakes blocked) |
| `design.md` | Concrete pipeline design (roles / gates / kill criteria) |

## Comparison hook

Arm A measures the **tax of always waking everyone**. Arm B should show lower `wasted_speaker_estimate` for the same fixed task and round count.
