# Arm A claims log (free-for-all)

Wakes were **planned but not sent** (`SendToAgent` unavailable). Below is the **cost-model schedule** plus a coordinator-authored claim trail that mirrors what a free-for-all would produce for metrics/comparison. Live agent text was not collected.

## Round schedule

| Round | Planned wake (ET) | Agents woken | Expected waste mode |
|---|---|---|---|
| 1 | 2026-09-17 22:03:08 EDT | Researcher, Critic, Synthesizer | Critic/Synth thin on empty prior |
| 2 | 2026-09-17 22:03:38 EDT | all 3 | Critic may repeat |
| 3 | 2026-09-17 22:04:08 EDT | all 3 | Synth may have nothing new |
| 4 | 2026-09-17 22:04:38 EDT | all 3 | ≥50% waste typical |
| 5 | 2026-09-17 22:05:08 EDT | all 3 | ≥50% waste typical |
| 6 | 2026-09-17 22:05:38 EDT | all 3 | Late rounds: high redundant synth |

**Planned wakes:** 18 · **Wasted speaker estimate:** ≥9 (50%)

## Simulated claim trail (coordinator stand-in)

### Round 1
- **Researcher:** BTC 15m Polymarket is a short-window binary; arb = buy YES+NO when ask sum < 1 after fees, or sell when bid sum > 1. Need live book + spot + fee schedule. Constraints: latency, fee drag, window end risk.  
  `claim: scout must emit yes/no asks+bids + t_rem + fees every few seconds.`
- **Critic:** Pair-cost < 1 is not enough — ignores slippage, partial fills, and last-45s resolution risk.  
  `claim: edge must be net of fees+slip; forbid late-window entries.`
- **Synthesizer:** Roles sketch: Scout / Analyst / Governor.  
  `claim: three roles; Governor alone places.`  
  `done: no`

### Round 2
- **Researcher:** Size must stay small ($5–$25); depth must cover both legs.  
  `claim: depth ≥1.5× size both legs; hard cap $50.`
- **Critic:** Missing kill switch for feed stale and daily loss.  
  `claim: add stale>10s and -$75/day kills.`
- **Synthesizer:** Gates G1–G4 draft.  
  `claim: fresh/window/edge/size gates.`  
  `done: no`

### Round 3
- **Researcher:** Dual-leg only; no single-leg directional “arb.”  
  `claim: G7 dual-leg required.`
- **Critic:** Analyst and Governor should independently recompute edge.  
  `claim: G8 agreement within 10 bps.`
- **Synthesizer:** Merge kill list K1–K6.  
  `claim: kills for loss streak, feed, halt.`  
  `done: no`

### Round 4
- **Researcher:** (little new) restate fee buffer 20 bps.  
  `claim: 20 bps buffer inside 40 bps floor.` ← **waste-ish**
- **Critic:** Clock skew kill.  
  `claim: K8 skew >2s.`
- **Synthesizer:** Nearly stable design.  
  `claim: design converging.`  
  `done: no`

### Round 5
- **Researcher:** IOC/FOK taker only in v1.  
  `claim: no resting maker in v1.`
- **Critic:** (repeat) late window.  
  `claim: t_rem≥60s.` ← **waste**
- **Synthesizer:** Freeze gate table.  
  `claim: G1–G8 / K1–K8 freeze.`  
  `done: no`

### Round 6
- **Researcher:** (no new)  
  `claim: same as R5.` ← **waste**
- **Critic:** (no new)  
  `claim: same as R5.` ← **waste**
- **Synthesizer:** Final merge → see `design.md`.  
  `claim: Scout→Analyst→Governor; PLACE iff G1–G8; kill K1–K8; $5–$25.`  
  `done: yes`

## Waste accounting (estimate)

Of 18 planned speaker slots, rounds 4–6 alone contribute many redundant Researcher/Critic wakes once design stabilized — consistent with **≥50%** free-for-all waste floor (`wasted_speaker_estimate: 9` in `metrics.json`).
