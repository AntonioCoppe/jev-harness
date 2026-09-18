# Agent-comm bakeoff COMPARE

Same task: Polymarket BTC 15m small-arb pipeline design
Agents/arm: Researcher · Critic · Synthesizer

| Metric | Arm A free-for-all | Arm B Jev who-speaks |
|--------|--------------------|----------------------|
| Rounds | 3 live | 6 selector |
| Agent wakes | **9** (3×3) | **0** |
| Low-conf suppressed | 0 | **2** |
| Wake reduction | — | **100.0%** |
| Selector latency | n/a | p50 **250.5 ms** |

## Arm B speaker sequence
- round 1: `none` (conf 0.450, 556ms)
- round 2: `user` (conf 0.535, 375ms)
- round 3: `user` (conf 0.550, 161ms)
- round 4: `user` (conf 0.573, 262ms)
- round 5: `user` (conf 0.557, 170ms)
- round 6: `user` (conf 0.443, 239ms)

## Takeaway
Free-for-all pays **3× speakers every round**. Jev gate pays **~1 wake when confident**, and **skips** when conf < 0.5 — that's the harness win for intra-agent communication.
