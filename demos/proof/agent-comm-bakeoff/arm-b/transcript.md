# Arm B transcript

- coordinator: Arm B start. Fixed task — need roles, decision gates, kill criteria.
- researcher [wake_requested serverId=3966998; proxy_until_live]: BTC 15m Polymarket is a short-window binary. Arb = buy YES+NO when ask sum < 1−fees−buffer, or sell when bid sum > 1+fees+buffer. Need live book + spot + fee schedule; latency and window-end risk dominate. claim: scout emits yes/no asks+bids + t_rem + fees every few seconds.
- researcher [wake_requested serverId=3966998; proxy_until_live]: Size stays small ($5–$25); depth must cover both legs at 1.5×. Hard cap $50/window. claim: depth ≥1.5× size both legs; hard cap $50.
- critic [wake_requested serverId=3967000; proxy_until_live]: Pair-cost < 1 is insufficient — ignores slippage, partial fills, last-45s resolution risk. claim: edge must be net of fees+slip; forbid late-window entries (t_rem≥60s).
- critic [wake_requested serverId=3967000; proxy_until_live]: Missing kills for feed stale and daily loss. claim: add stale>10s and −$75/day kills.
- synthesizer [wake_requested serverId=3967001; proxy_until_live]: Roles: Market Scout / Arb Analyst / Risk Governor; Governor alone places. claim: three roles; Governor alone places. done: no
- synthesizer [wake_requested serverId=3967001; proxy_until_live]: Gates draft G1–G4: fresh / window / edge / size. claim: fresh/window/edge/size gates. done: no
