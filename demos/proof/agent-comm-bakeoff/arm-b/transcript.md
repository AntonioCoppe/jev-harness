# Arm B transcript

- coordinator: Arm B start. Fixed task — need roles, decision gates, kill criteria. Prefer researcher first.
- researcher [wake_requested 3966998; proxy_until_live]: BTC 15m Polymarket is a short-window binary. Arb = buy YES+NO when ask sum < 1−fees−buffer, or sell when bid sum > 1+fees+buffer. Need live book + spot + fee schedule; latency and window-end risk dominate. claim: scout emits yes/no asks+bids + t_rem + fees every few seconds.
- critic [wake_requested 3967000; proxy_until_live]: Pair-cost < 1 is insufficient — ignores slippage, partial fills, last-45s resolution risk. claim: edge must be net of fees+slip; forbid late-window entries (t_rem≥60s).
- synthesizer [wake_requested 3967001; proxy_until_live]: Roles: Market Scout / Arb Analyst / Risk Governor; Governor alone places. claim: three roles; Governor alone places. done: no
- synthesizer [wake_requested 3967001; proxy_until_live]: Gates draft G1–G4: fresh / window / edge / size. claim: fresh/window/edge/size gates. done: no
- synthesizer [wake_requested 3967001; proxy_until_live]: Merge kills K1–K6 + dual-leg G7. claim: kills for loss streak, feed, halt; G7 dual-leg. done: no
- synthesizer [wake_requested 3967001; proxy_until_live]: Near-stable: G1–G8 / K1–K8. claim: design converging. done: no
