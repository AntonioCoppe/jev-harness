# high-freq-reflex

Empirical category from `research/taxonomy.md` (cluster **H**).

**Shape:** Hot loop ≤ few hundred ms; Jev returns a typed branch; deterministic code executes. Separated from `candidate-action-selection` when **throughput/budget** is the primary claim (not UI grounding).

| Recipe | Role |
|---|---|
| `mm-buy-sell` | Block-time buy / sell / hold from a compact book snapshot. |
| `hot-path-allow` | Sub-100ms allow / deny on a compact event. |
| `order-allow-deny` | Trading order allow / deny / cancel / hold + news conflict. |
| `fraud-score-gate` | Payment / login fraud score gate. |
| `rtb-bid-gate` | Ads RTB brand-safety / bid-or-pass. |

Related crazy-fast packs (own folders, same shape ID):

| Pack | Path |
|---|---|
| `prediction-market-gate` | [`recipes/prediction-market-gate/`](../prediction-market-gate/) |
| `sports-bet-gate` | [`recipes/sports-bet-gate/`](../sports-bet-gate/) |
| `rtb-bid-gate` alias | [`recipes/rtb-bid-gate/`](../rtb-bid-gate/) |

Map: [`research/crazy-fast-decisions.md`](../../research/crazy-fast-decisions.md).

Soak in `shadow` before live; keep state tiny and `minConfidence` tight. **Do not invent measured timings.**
