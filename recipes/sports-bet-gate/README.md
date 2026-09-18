# sports-bet-gate

**Taxonomy shape:** `high-freq-reflex` (line-move ms budget).

Sports **bet / no-bet** gate with **CLV filter** and optional book Choice over a shortlist of offerings.

| Recipe | Role |
|---|---|
| `sports-bet-gate` | `bet` Noul + `edge` Score + `meets_clv_filter` + liquidity → bet / no_bet / shop_elsewhere |

**Equation:** −EV and −CLV tickets = $ + line-move latency.

**Proof you’d screenshot:** % of placed bets with +CLV on close; suppress-on-low-conf rate; decision p50.

Default `onLowConfidence: suppress` — unsure never fires a ticket.
