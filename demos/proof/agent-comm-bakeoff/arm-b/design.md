# Polymarket BTC 15m arb — 3-agent pipeline (Arm B synthesis)

Concrete design for the fixed bakeoff task. Speaker turns gated by Jev `who-speaks-next`.

## Roles

### 1. Market Scout (ingest + normalize)
- Poll Polymarket CLOB / Gamma for the **active BTC 15-minute** yes/no market each window.
- Emit a structured tick every ≤5s while window open: `{market_id, window_end, yes_ask, yes_bid, no_ask, no_bid, mid, spread_bps, btc_spot, ts, fees}`.
- Pull reference BTC spot (exchange mid) for the same second.
- **Does not trade.** Output is ticks + staleness flag.

### 2. Arb Analyst (edge math)
- Input: latest Scout tick + inventory + fee schedule.
- Compute:
  - `pair_cost = yes_ask + no_ask` (buy-both if `< 1 - fees - buffer`)
  - `pair_proceeds = yes_bid + no_bid` (sell-both if `> 1 + fees + buffer`)
  - `edge_bps` after fees + estimated slippage for size `S`
  - `t_rem`; degrade / HOLD if `t_rem < 60s`
- Emit: `{action: BUY_PAIR|SELL_PAIR|HOLD, edge_bps, size_usd, reasons[]}`

### 3. Risk Governor (decision + kill)
- Sole agent allowed to say **PLACE** or **ABORT**.
- Applies decision gates and kill criteria below.
- Small orders only: default `size_usd ∈ [5, 25]`, hard cap `$50` notional per window.
- Logs every decision with gate trace.

## Decision gates (all must pass for PLACE)

| # | Gate | Pass condition |
|---|---|---|
| G1 | Fresh data | Scout tick age ≤ 3s; no API error streak ≥ 2 |
| G2 | Window open | `t_rem ≥ 60s` at decision time (else HOLD) |
| G3 | Economic edge | `edge_bps ≥ 40` after fees+slippage (20 bps buffer baked in) |
| G4 | Size clamp | Requested size ≤ min(bankroll×0.5%, $25); ≥ $5 |
| G5 | Inventory | Net exposure after fill ≤ $50 absolute across open 15m BTC markets |
| G6 | Book depth | Top-of-book size ≥ 1.5× order size on both legs |
| G7 | Dual-leg feasibility | Both legs quoteable; no single-leg “hope” arb |
| G8 | Governor quorum | Analyst ≠ HOLD **and** Governor recompute agrees within 10 bps |

If any gate fails → **HOLD**.

## Kill criteria (immediate ABORT / disable)

| # | Kill | Trigger |
|---|---|---|
| K1 | Daily loss | Realized + MTM loss ≥ $75 in rolling 24h |
| K2 | Window streak | 3 consecutive losing windows |
| K3 | Feed break | Scout stale > 10s **or** 5 consecutive HTTP/WS failures |
| K4 | Edge mirage | Simulated fill slippage > 2× modeled slip on last fill |
| K5 | Resolution mismatch | Settled outcome ≠ expected binary close logic → kill until cleared |
| K6 | Operator halt | `HALT=1` env/flag present |
| K7 | Size breach | Any fill > $50 notional (bug) → kill + alert |
| K8 | Clock skew | Local vs exchange timestamp delta > 2s |

On kill: cancel open orders, observe-only Scout, require human clear.

## Pipeline sequence

```
Scout tick ──► Analyst edge ──► Risk Governor gates
                                   │
                          PASS G1–G8 ──► place both legs (IOC/FOK), size S
                          else HOLD
                          any K* ──► ABORT + pause
```

## Concrete defaults

- Markets: Polymarket BTC 15m binary (live window slug).
- Poll: 2–5s; decide on each fresh tick while `t_rem ≥ 60s`.
- Edge floor: 40 bps net; no leverage; taker-only v1.

## claim

`claim: Scout→Analyst→Governor; PLACE iff G1–G8; kill K1–K8; size $5–$25 cap $50; Jev-gated speaker selection (Arm B). done: yes`
