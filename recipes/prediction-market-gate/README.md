# prediction-market-gate

**Taxonomy shape:** `high-freq-reflex` (throughput / episode half-life, not UI grounding).

Polymarket / prediction-market **arb** and **liquidity-vs-edge** gate. Extends `mm-buy-sell` patterns: typed Choice / Score / Noul in the maker loop — not an LLM planner in the cancel/post path.

| Recipe | Role |
|---|---|
| `prediction-market-gate` | `is_arb` + `edge_after_costs` + depth/fair freshness + tradeoff → post / cancel / hedge / skip |

**Equation:** missed arbs + toxic fills = $ + episode half-life (~3–5s).

**Proof you’d screenshot:** arb episode capture rate; naked-leg kill / cancel-before-toxic count; edge-after-gas histogram.

Soak in `shadow`; fail closed on stale fair (`fair_fresh`) and thin books.
