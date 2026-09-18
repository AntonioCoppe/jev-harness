# high-freq-reflex

Empirical category from `research/taxonomy.md` (cluster **H**).

**Shape:** Hot loop ≤ few hundred ms; Jev returns a typed branch; deterministic code executes. Separated from `candidate-action-selection` when **throughput/budget** is the primary claim (not UI grounding).

| Recipe | Role |
|---|---|
| `mm-buy-sell` | Block-time buy / sell / hold from a compact book snapshot. |
| `hot-path-allow` | Sub-100ms allow / deny on a compact event. |

Soak in `shadow` before live; keep state tiny and `minConfidence` tight.
