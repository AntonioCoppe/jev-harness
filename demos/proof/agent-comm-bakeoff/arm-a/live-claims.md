# Arm A — live claims (free-for-all)

## Researcher
Roles Scout/Gate/Executor; gates = edge>fees+slippage AND fresh book AND depth; kill = stale/API fail/size cap/near-expiry thin book.

## Critic (r1)
Without staleness SLAs, fee-aware two-leg fill gates, and hard size/time kill switches, a 3-agent BTC-15m arb pipeline is a latency tax, not an edge.

## Critic (r3)
Killing on Yes+No mid > $1.02 alone is a false-positive that pauses the pipeline on quote noise, not real risk.

## Synthesizer (converged, done: yes)
v0 gates frozen:
1. |YES_mid+NO_mid−1| > fees+slippage_buffer
2. both books depth ≥ order size at limit
3. time_to_resolve ≥ 2× expected RTT
4. size ≤ inventory and daily-loss headroom
5. expected net PnL > min_edge
Kill: one-leg fill, book wipe, API lag, stop-loss.
Roles: Scout→Arbiter→Executor; dual-limit simultaneous legs only.

**Wakes to reach this:** 9 (3 rounds × 3 agents)

## Researcher (r2)
Require fresh CEX BTC mid as fair-value feed; kill if CEX or cross-feed lag exceeds SLA.

## Researcher (r3)
Kill if <60s to resolution AND book depth at target price below min USDC — no size-down, no chase.
