# Bakeoff Arm B — Jev who-speaks-next gate

**Arm:** B  
**Mode:** `jev_who_speaks_gate`  
**Harness:** TypeSafe Jev via `DecisionHarness` + `recipes/agent-comm-harness/who-speaks-next.ts`  
**Channel:** Bakeoff B — Jev harness (`serverId` 3967016)

## Intent

Arm B is the **treatment** condition. Each round the coordinator builds state (task, transcript, who spoke last, open questions), runs **live Jev** `who-speaks-next`, and wakes **ONLY** the selected speaker (`wake_count=1`). Goal: fewer wakes / less wasted speech vs Arm A free-for-all on the **same fixed task**.

## Agents

| Role | Name | serverId | UUID |
|---|---|---|---|
| Researcher | Harness Researcher | 3966998 | `f5732640-a55c-4edc-94ef-4254e4837634` |
| Critic | Harness Critic | 3967000 | `c4b09365-a392-41d3-b130-db1e4435a5d1` |
| Synthesizer | Harness Synthesizer | 3967001 | `f455e857-22fa-4f2b-8ea1-91caf8069263` |

## Fixed task (identical to Arm A)

> Design a 3-agent pipeline that monitors Polymarket BTC 15m markets and decides whether to place a small arb. Output: roles, decision gates, kill criteria. Keep it concrete.

## Protocol (rounds 1..6)

1. Build state: `goal`, `agents[{id,description}]`, `transcript` tail, `current_speaker`, open context.
2. Run `runWhoSpeaksNext(harness, state, { mode: "live" })` — live TypeSafe API (`TYPESAFE_API_KEY`).
3. Wake **only** the chosen agent: emit `WAKE <serverId> <role>` for parent `SendToAgent` (priority true). Executor subagent has no SendToAgent tool surface.
4. Log to `rounds.jsonl`: round, chosen, confidence, `wall_ms` of Jev call, `wake_count=1`, selection_source.
5. Append proxy utterance for transcript continuity until live agent claims return; next round feeds updated transcript to Jev.

**Cost model (TREATMENT):**
- Planned wakes ≈ `1 speaker × 6 rounds = 6` (vs Arm A `18`)
- Wake reduction vs Arm A: **12 absolute / 66.7%**
- Selector latency: measured `jev_selector_ms_p50` in `metrics.json`

## Explicit non-goals for Arm B

- Do **not** wake all three agents in a round.
- Do **not** expand the fixed task scope.
- Do **not** invent selector timings — use measured `wall_ms`.

## Outputs in this directory

| File | Purpose |
|---|---|
| `PROTOCOL.md` | This document |
| `metrics.json` | Arm B gated metrics + vs Arm A reduction |
| `rounds.jsonl` | Per-round Jev decisions + timings |
| `wake-queue.jsonl` / `wake-lines.txt` | Parent SendToAgent queue |
| `transcript.md` | Round trail (proxy until live replies) |
| `design.md` | Concrete pipeline design |
| `blocker.json` | Messaging tool availability |
| `run-arm-b.mts` | Reproducible live runner |

## Comparison hook

Arm A: always wake 3 → `planned_wakes=18`, ≥50% waste estimate.  
Arm B: Jev gate → `planned_wakes=6`, `wasted_speaker_estimate≈0` redundant wakes.
