# Crazy-fast decisions — where Jev (System One) beats LLM agents

**Date:** Thu Sep 17, 2026 (ET / America/Toronto)  
**Thesis:** When the scarce resource is **latency budget**, **decision count**, or **confidence-gated automation**, a decision-only model (Choice / Score / Noul + calibrated confidence in ~70–500ms) beats LLM-agent loops that generate tokens, invent types, and burn seconds + $.

**Jev facts (vendor + docs):** `POST /v1/systemone`, model `jev-latest`; typed answers only (no string generation); parallel questions; ~70–500ms E2E; ~$0.042/MTok input, output free; patterns: speculative fan-out, confidence-gated routing, composite scoring, intent routing ([docs.typesafe.ai](https://docs.typesafe.ai), [launch post](https://typesafe.ai/blog/introducing-system-one-models-and-jev)).

**Source notes:** docs.typesafe.ai patterns + use-case map; existing `research/taxonomy.md` / `x-usecases-a.md` / recipes; OpenAI Swarm / AutoGen / CrewAI handoff literature; Polymarket arb / RTB / fraud latency literature. **X MCP** hit monthly spend-cap (403) this run — Jev community cites reuse prior harvest (`api.fxtwitter.com` seeds in taxonomy).

**Ranking method:** `signal = wildness × realism × (latency_scarcity + $ density)`, with a bias toward **new or extendable jev-harness recipes** and screenshotable proof metrics.

---

## Ranked top 10

| # | Use case | Equation (one-liner) | Wild | Real | Recipe fit | Proof you’d screenshot |
|---|---|---|---:|---:|---|---|
| 1 | **Multi-agent who-speaks-next + tool allow/deny** | agent RTT / tool mishap = $ + wallclock | 8 | 9 | **NEW** `agent-comm-harness` (extend tool-picker + stop-or-continue + tool-call-allowlist) | p50 handoff **&lt;150ms**; −40% wasted speaker turns; tool deny FP drop |
| 2 | **Trading order allow/deny + risk throttle** | adverse fills / oversize = $ + ms to cancel | 7 | 9 | **EXTEND** `high-freq-reflex/mm-buy-sell` + `hot-path-allow` | gate p99 **&lt;200ms**; shadow↔live agreement; throttle cut max drawdown |
| 3 | **Polymarket arb / liquidity-vs-edge gate** | stale fill residual = $ + arb half-life (≈3–5s) | 9 | 8 | **NEW** `prediction-market-gate` (extend mm-buy-sell) | arb episode capture rate; naked-leg kill count; edge-after-gas |
| 4 | **Sports betting bet/no-bet + CLV filter** | −CLV bets = $ + line-move ms | 8 | 8 | **NEW** `sports-bet-gate` | % bets with +CLV; live micro-decision p50; suppress on low conf |
| 5 | **Cybersecurity alert triage** | pages / analyst hours = $ + MTTR | 6 | 10 | **EXTEND** `alert-gate` / `oncall-page` / `incident-severity` | −50–70% pages; FP drop; p50 triage ms |
| 6 | **Ads RTB brand-safety / bid-or-pass** | bad impressions / missed auctions = $ + &lt;100ms budget | 8 | 7 | **NEW** `rtb-bid-gate` (extend hot-path-allow) | bid decision p99; IVT block rate; brand-safety FP |
| 7 | **Payment / login fraud score gate** | chargebacks + false declines = $ + checkout ms | 7 | 9 | **EXTEND** `hot-path-allow` + composite-rubric | score p50 **&lt;50ms** path; FP decline ↓; review queue rate |
| 8 | **Content mod at the edge** | toxic ships / overblocks = $ + stream lag | 7 | 8 | **EXTEND** `ship-gate` / `llm-verifier` | mute latency; auto-action vs review band; FP mute ↓ |
| 9 | **Esports / game reflex next-action** | frames lost to planning = $ (rank) + ms/tick | 9 | 7 | **EXTEND** `candidate-action-selection` (Doom/Mario evidence) | ms/decision (~90–150); winrate vs LLM planner |
|10 | **Swarm debate judge / consensus gate** | endless debate tokens = $ + time-to-consensus | 8 | 7 | **NEW** `swarm-consensus` (extend stop-or-continue + rubric) | rounds until terminate; judge conf histogram; cost/task |

*Honorable mentions (below): robotics reflex, dating/matching gate, news→trade gate, copy-trade filter, resolve-claim confidence.*

---

## How to read each card

For every use case:

1. **Equation** — scarce resource = money + speed  
2. **Why LLM-agent loops fail** — latency / cost / nondeterminism  
3. **Exact Jev question shapes** — Choice / Score / Noul  
4. **Proof metric** — something you can screenshot  
5. **Recipe fit** — new vs extend  
6. **Wildness / realism** — 1–10  

---

# 1. Intra-agent / multi-agent communication harness

## 1a. Who speaks next (selector replacement)

- **Equation:** `wasted speaker turns = $ (tokens) + wallclock to goal`
- **Why LLM agents fail:** OpenAI Swarm / AutoGen SelectorGroupChat / CrewAI hierarchical managers typically ask an **LLM** to choose the next agent. That adds a full generation RTT (seconds), nondeterministic speaker thrash, and parallel-tool-call race conditions (AutoGen docs warn about multiple simultaneous handoffs). The selector itself must be cheaper/faster than the specialists it routes to.
- **Jev shapes:**
  - `Choice next_speaker` — options = agent ids (+ `none` / `user`)
  - `Score progress` — ordered: stuck / slow / on_track / near_done
  - `Noul needs_handoff` — “Should control leave the current speaker?”
  - `Noul user_turn` — “Is a human answer required before any agent continues?”
- **Proof metric:** p50/p99 **selector latency &lt;150ms**; −30–50% redundant turns vs LLM selector on the same fixture transcript; cost/task drop.
- **Recipe:** **NEW** `recipes/agent-comm-harness/who-speaks-next.ts` — extends `stop-or-continue` + `tool-picker` patterns; category still `candidate-action-selection` + `confidence-front-door`.
- **Wildness 8 / Realism 9** — maps 1:1 to Swarm/AutoGen handoff literature; TypeSafe already ships skill_suggestion / function_calling cookbooks with the same closed-set Choice shape.

## 1b. Tool allow / deny + confidence-gated handoff

- **Equation:** `irreversible tool mishaps = incident $ + recovery latency`
- **Why LLM agents fail:** Agents emit tool calls in free-form JSON; schema mismatch and “almost right” args are common. A second LLM critic is slow and overconfident. Coding-agent field notes (Flavio / pi-warden / bicameral) already show Jev as a shadow gate before `rm`-class actions.
- **Jev shapes:**
  - `Choice risk_class` — read_only | reversible | irreversible | forbidden
  - `Noul policy_ok` — args match policy / allowlist intent
  - `Noul irreversible` — side effect cannot be undone cheaply
  - `Score blast_radius` — local / project / prod / external_money
  - `Choice handoff` — continue | ask_user | escalate_specialist | abort
- **Proof metric:** deny/allow confusion matrix on fixture tool traces; **0 ships when conf &lt; threshold** (`onLowConfidence: suppress`); screenshot of shadow log with `intendedAction` vs human label.
- **Recipe:** **EXTEND** `verify-gate/tool-call-allowlist` + `ship-gate`; package as `agent-comm-harness/tool-gate`.
- **Wildness 7 / Realism 10** — already in recipes + community harnesses.

## 1c. Debate judge / swarm consensus gate

- **Equation:** `debate tokens until consensus = $ + time-to-ship`
- **Why LLM agents fail:** Multi-agent debates (proposer/critic/refiner) recurse until a chat model “feels done.” Termination is prose, not a calibrated stop. Round-robin Autogen chats burn budget with ceremonial agreement.
- **Jev shapes:**
  - `Noul consensus_reached` — claims agree enough to act
  - `Choice winner` — proposal ids (+ `none`)
  - `Score evidence_quality` — weak / mixed / strong
  - `Noul fatal_objection` — unresolved blocker remains
  - `Choice disposition` — adopt | another_round | escalate_human | abort
- **Proof metric:** median rounds-to-terminate; $ / task vs unconstrained debate; judge confidence histogram (screenshot).
- **Recipe:** **NEW** `swarm-consensus` under `composite-rubric` or `live-multi-judgment`.
- **Wildness 8 / Realism 7** — high leverage for agent frameworks; needs good fixtures.

## 1d. Message routing / escalate-or-not between agents

- **Equation:** `misrouted inter-agent messages = $ + rework latency`
- **Why LLM agents fail:** Passing full chat history to a router LLM every hop; nondeterministic routing; no second axis for “I’m unsure → escalate.”
- **Jev shapes:**
  - `Choice route` — specialist ids + `broadcast` + `drop`
  - `Score urgency`
  - `Noul contains_secrets` — strip before broadcast
  - `Noul escalate` — needs human / higher tier
- **Proof metric:** route accuracy on labeled bus events; p50 route ms; secret-leak false-negative = 0 on fixture.
- **Recipe:** **EXTEND** `inbox-triage` / `model-router` → `agent-bus-route`.
- **Wildness 6 / Realism 9**

---

# 2. Trading (decision gates, not full pricing)

> Scope: **gates** around an existing signal / book / risk engine — not replacing a pricing model.

## 2a. Order allow / deny (pre-trade gate)

- **Equation:** `adverse or policy-breaking fills = $ + ms-to-cancel`
- **Why LLM agents fail:** An agent that “reasons about the trade” in tokens cannot sit in a hot path; latency is seconds; outputs vary; schema breaks kill the loop. Deterministic risk checks miss semantic anomalies (news text, odd order notes, fat-finger narrative).
- **Jev shapes:**
  - `Noul allow_order` — “Should this order hit the wire given policy + context?”
  - `Choice side_intent` — buy | sell | cancel | hold *(match existing mm-buy-sell)*
  - `Score edge` — noise / modest / strong
  - `Score risk` — within_limits / elevated / breach
  - `Noul news_conflict` — recent headline contradicts the trade thesis
- **Proof metric:** gate E2E **p50 &lt;150ms / p99 &lt;300ms**; shadow mode agreement % vs trader labels; denied-would-have-lost $ on replay.
- **Recipe:** **EXTEND** `high-freq-reflex/mm-buy-sell.ts` + `hot-path-allow.ts` → `order-allow-deny`.
- **Wildness 7 / Realism 9** — recipe already exists; TypeSafe function_calling cookbook uses trading as the demo domain.

## 2b. Regime detect (gate, not model)

- **Equation:** `wrong-regime strategy size = $ + time in drawdown`
- **Why LLM agents fail:** Regime labels every few seconds from chat are too slow and unstable; you need a peaked distribution + confidence to size down, not an essay.
- **Jev shapes:**
  - `Choice regime` — trend | mean_revert | high_vol | event_driven | unknown
  - `Score regime_clarity`
  - `Noul size_down` — “Should we cut gross exposure now?”
- **Proof metric:** regime switch lead time vs realized vol spike; size-down true-positive rate; screenshot of conf-gated throttle.
- **Recipe:** **NEW** extend `mm-buy-sell` with regime Choice; or `confidence-front-door` style router into strategy packs.
- **Wildness 7 / Realism 8**

## 2c. News → trade gate

- **Equation:** `acting on junk headlines = $ + opportunity cost of delayed real news`
- **Why LLM agents fail:** Full summarizer+trader agent is slow; hallucinated “materiality”; no calibrated “ignore” probability.
- **Jev shapes:**
  - `Noul material` — market-moving for watched universe?
  - `Choice action` — ignore | alert | flatten | open_bias_long | open_bias_short
  - `Score urgency`
  - `Noul already_priced` — headline likely in the tape already
- **Proof metric:** precision@k on labeled news days; decision latency vs human desk; suppress rate on low conf.
- **Recipe:** **NEW** `news-trade-gate` (verify-gate × high-freq-reflex).
- **Wildness 8 / Realism 7**

## 2d. Risk throttle

- **Equation:** `limit breaches &amp; kill-switch lag = $ + ms of uncontrolled exposure`
- **Why LLM agents fail:** Risk officers don’t want a chatty agent mid-crash; they want allow/throttle/flatten with confidence.
- **Jev shapes:**
  - `Choice throttle` — normal | reduce_50 | flatten | halt_new
  - `Score stress`
  - `Noul kill_switch`
- **Proof metric:** time-to-flatten on replay stress days; false halt rate.
- **Recipe:** **EXTEND** `hot-path-allow` + `oncall-page` disposition shape.
- **Wildness 6 / Realism 9**

---

# 3. Sports betting

## 3a. Line shop / bet–no-bet gate

- **Equation:** `−EV and −CLV tickets = $ + line-move latency`
- **Why LLM agents fail:** Live books move in hundreds of ms to seconds; an LLM “should I bet?” essay loses the number; nondeterminism means two identical cards can disagree.
- **Jev shapes:**
  - `Noul bet` — take this price vs fair?
  - `Choice book` — which offered line (dynamic Choice over shops)
  - `Score edge` — none / thin / solid / fat
  - `Noul meets_clv_filter` — expected closing line value positive?
  - `Score liquidity_ok` — can we get the size without moving the market?
- **Proof metric:** % of placed bets with **+CLV** on close; suppress-on-low-conf rate; decision p50.
- **Recipe:** **NEW** `sports-bet-gate` (high-freq-reflex + row-judgment over books).
- **Wildness 8 / Realism 8**

## 3b. Live in-play micro-decisions

- **Equation:** `stale in-play tickets = $ + possession/clock ms`
- **Why LLM agents fail:** Play-state changes every few seconds; generation loops miss windows; typed state (score, clock, possession, injury flag) wants Choice/Noul, not prose.
- **Jev shapes:**
  - `Choice disposition` — hold | cash_out_bias | hedge | press | no_action
  - `Noul state_changed_materially`
  - `Score win_prob_delta_bucket` — down / flat / up *(buckets you define; code owns actual model)*
- **Proof metric:** decisions/min sustained; p99 &lt;300ms; PnL attribution on held vs acted windows (illustrative until live soak).
- **Recipe:** **EXTEND** `mm-buy-sell` with sports state schema.
- **Wildness 9 / Realism 7** — wild UX; realism gated by data feeds + jurisdiction.

## 3c. CLV / sharp-vs-soft filter

- **Equation:** `soft-book juice paid = $ + research time`
- **Why LLM agents fail:** Comparing many books × markets is a map-reduce; per-market LLM calls dominate cost.
- **Jev shapes:**
  - map over offerings: `Noul is_soft` / `Score value_vs_sharp`
  - `Choice best_ticket` over shortlisted +EV cards
- **Proof metric:** community-style: ms/$ per 1k market judgments (cf. iam_zachi row filter economics).
- **Recipe:** **EXTEND** `row-judgment` batch helpers.
- **Wildness 6 / Realism 8**

---

# 4. Polymarket / prediction markets

## 4a. Arb opportunity gate

- **Equation:** `missed arbs + toxic fills = $ + episode half-life (~3.6s median NBA arb windows in recent CLOB studies)`
- **Why LLM agents fail:** Polling + reasoning agents lose multi-second dislocations; LLM cannot be in the cancel/post loop. Polymarket ≈250ms taker delay favors **fast maker gates**, not chat planners. Stale fair-value is the killer (public postmortems: +EV legs still lose to adverse selection).
- **Jev shapes:**
  - `Noul is_arb` — after fees/gas, pair cost &lt; $1 with executable depth?
  - `Score edge_after_costs`
  - `Noul depth_ok` — top-of-book size supports min size
  - `Noul fair_fresh` — sharp/odds source not stale
  - `Choice action` — post_bid | cancel | hedge_other | skip
- **Proof metric:** capture rate of labeled arb episodes; cancel-before-toxic count; **edge-after-gas** distribution screenshot.
- **Recipe:** **NEW** `prediction-market-gate` extending `mm-buy-sell`.
- **Wildness 9 / Realism 8**

## 4b. Resolve / claim confidence

- **Equation:** `wrong early claims + delayed correct claims = $ + dispute latency`
- **Why LLM agents fail:** Resolution UIs need a peaked Choice + conf to auto-claim vs escalate; chatty agents invent sources.
- **Jev shapes:**
  - `Choice outcome` — Yes | No | Unknown/Ambiguous
  - `Noul sources_agree`
  - `Score claim_readiness`
  - `Noul escalate_dispute`
- **Proof metric:** auto-claim precision; human-escalation rate; time-to-claim.
- **Recipe:** **EXTEND** `ship-gate` / citation_check cookbook shape.
- **Wildness 7 / Realism 8**

## 4c. Copy-trade filter

- **Equation:** `blind whale copies = $ + adverse selection`
- **Why LLM agents fail:** Ranking wallets every fill with an LLM is too slow/expensive; need Noul/Score over compact trade+wallet features.
- **Jev shapes:**
  - `Noul copy` — mirror this fill?
  - `Score wallet_edge_proxy` — cold / mixed / hot *(features from your analytics, not vibes)*
  - `Noul size_ok` / `Noul correlation_risk`
- **Proof metric:** copied-trade +EV rate vs baseline; suppress rate.
- **Recipe:** **NEW** thin wrapper on `hot-path-allow`.
- **Wildness 8 / Realism 7**

## 4d. Liquidity vs edge

- **Equation:** `unexecutable ‘edge’ = $ illusion + wasted maker rebates`
- **Why LLM agents fail:** Semantic judgment over thin books needs calibrated “don’t bother”; agents overtrade narratives.
- **Jev shapes:**
  - `Score tradeoff` — no_edge | edge_no_liq | liq_no_edge | both
  - `Noul post_maker`
  - `Choice size_bucket` — skip | min | mid | max_policy
- **Proof metric:** % posts canceled for vanishing edge (Polymm-style monitor); fill quality.
- **Recipe:** fold into `prediction-market-gate`.
- **Wildness 7 / Realism 8**

---

# 5. Other crazy high-speed domains

## 5a. Ads bidding (RTB) — brand-safety / bid-or-pass

- **Equation:** `invalid or unsafe impressions = $ + &lt;100ms auction budget`
- **Why LLM agents fail:** RTB windows are ~80–120ms end-to-end; fraud/context services often get **&lt;10–30ms**. An LLM agent cannot bid. Even “structured output” LLMs lose the auction.
- **Jev shapes:**
  - `Noul bid` — bid on this request?
  - `Choice brand_safety` — safe | sensitive | block
  - `Score ivt_risk` — clean / suspicious / likely_invalid
  - `Noul creative_page_align`
- **Proof metric:** decision budget fit (p99); IVT block rate; brand-safety FP; $ saved on blocked IVT.
- **Caveat:** raw Jev 70–500ms may need **edge cache / speculative precompute** of state; Jev still wins vs any generative agent. Fit as **pre-bid filter** on contextual text where classical models are brittle.
- **Recipe:** **NEW** `rtb-bid-gate` extending `hot-path-allow`.
- **Wildness 8 / Realism 7**

## 5b. Fraud (payments / login)

- **Equation:** `chargebacks + false declines = $ + checkout friction ms`
- **Why LLM agents fail:** Scoring must be tens of ms; agents add seconds and nondeterminism users feel as checkout jank.
- **Jev shapes:**
  - `Score fraud_risk`
  - `Choice disposition` — allow | step_up | deny | review
  - `Noul device_anomaly` / `Noul velocity_anomaly` *(semantic over narratives + structured flags)*
- **Proof metric:** FP decline ↓; review queue rate; p50 gate ms (illustrative target &lt;50–100ms with tiny state).
- **Recipe:** **EXTEND** `hot-path-allow` + `composite-rubric`.
- **Wildness 7 / Realism 9** — docs use-case map already lists financial crime prioritization.

## 5c. Games / esports reflex

- **Equation:** `planning lag per tick = rank $ + ms/frame`
- **Why LLM agents fail:** Doom/Mario/wikiracing demos exist precisely because LLMs are too slow; TypeSafe Doom demo ~10 QPS; milindlabs ~90ms UI loop.
- **Jev shapes:**
  - `Choice legal_action` over engine-emitted candidates
  - `Score urgency`
  - `Noul done` / `Noul regroup`
- **Proof metric:** ms/decision; score/winrate vs LLM planner; $ / hour (Doom ~$7/hr anecdote at 10 QPS — vendor launch).
- **Recipe:** **EXTEND** `candidate-action-selection`.
- **Wildness 9 / Realism 7**

## 5d. Robotics reflex (symbolic state)

- **Equation:** `slow semantic branch = collision $ + control-loop ms`
- **Why LLM agents fail:** Vision-language agents in the inner loop violate real-time control budgets; Jev fits **outer semantic reflex** on structured scene graphs (see community `jev-drone`).
- **Jev shapes:**
  - `Choice tactic` — proceed | slow | stop | replan_local
  - `Noul human_nearby` / `Noul path_clear_semantic`
  - `Score hazard`
- **Proof metric:** intervention rate; stop FP; loop Hz with Jev outside of PID.
- **Recipe:** **NEW** thin `robot-reflex` on candidate-action-selection.
- **Wildness 9 / Realism 6** — needs careful safety case; keep deterministic controllers in charge.

## 5e. Cybersecurity alert triage

- **Equation:** `false pages + missed true positives = analyst $ + MTTR`
- **Why LLM agents fail:** SOAR “AI analysts” that chat per alert are slow/expensive; paging policy needs discrete disposition + confidence (already core jev-harness story).
- **Jev shapes:** *(existing alert-gate)*
  - `Choice disposition` — notify | queue_review | suppress
  - `Score severity`
  - `Noul needs_human` / `Noul actionable`
- **Proof metric:** −50%+ pages (illustrative target); fixture `alert-gate.jsonl`; on-call sleep hours.
- **Recipe:** **HAVE / EXTEND** `alert-gate`, `oncall-page`, `incident-severity`.
- **Wildness 6 / Realism 10**

## 5f. Dating / matching gate

- **Equation:** `bad intros + missed mutuals = $ + swipe latency / retention`
- **Why LLM agents fail:** Per-pair LLM essays don’t scale; need Score/Noul over profile pairs with conf → auto-intro vs hold.
- **Jev shapes:**
  - `Score mutual_fit`
  - `Noul intro_now`
  - `Choice icebreaker_bucket` *(optional; text still generated elsewhere)*
  - `Noul safety_flag`
- **Proof metric:** mutual reply rate lift; auto-intro precision; ms/pair.
- **Recipe:** **NEW** `match-gate` (composite-rubric + row-judgment over candidates).
- **Wildness 7 / Realism 6**

## 5g. Content moderation at the edge

- **Equation:** `toxic ships / overblocks = trust $ + stream lag`
- **Why LLM agents fail:** Live pipelines need 30–150ms decision+action bands; generative mods invent policy; confidence bands (auto / review / allow) are the product ([docs guardrails](https://docs.typesafe.ai/cookbooks/llm_guardrails.md)).
- **Jev shapes:**
  - `Choice verdict` — allow | warn | review | block
  - `Score severity`
  - `Noul hate` / `Noul sexual` / `Noul self_harm` / `Noul spam` *(fan-out)*
- **Proof metric:** mute/action latency; FP mute ↓; % auto vs review.
- **Recipe:** **EXTEND** `ship-gate` / `llm-verifier`.
- **Wildness 7 / Realism 8**

## 5h. Quick extras worth one line each

| Domain | Equation | Best primitive | Recipe |
|---|---|---|---|
| Voice banking intent (docs pattern) | wrong transfer = $ + confirm latency | Choice intent + conf gates | confidence-front-door |
| Insurance FNOL fraud hint | leakage + adjuster hours | Score complexity + Noul fraudish | composite-rubric |
| Marketplace listing nuke | prohibited listing $ + review lag | Choice disposition + Nouls | verify-gate |
| Lead ICP gate | SDR time = $ + speed-to-lead | Score fit + Noul chase | confidence-front-door |

---

# Cross-cutting: why System One wins these races

| Failure mode of LLM agents | Jev property that kills it |
|---|---|
| Seconds–minutes of token generation | Parallel sampler, ~70–500ms E2E |
| JSON/schema / type errors | Typed Choice/Score/Noul by construction |
| Overconfident prose “I’m sure” | Calibrated confidence + `onLowConfidence` policies |
| One fat prompt hiding 8 judgments | Speculative fan-out; compose in code |
| Selector/handoff as another agent | Closed-set Choice over agent/tool ids |
| Cost scales with output tokens | Output free; decision-shaped workloads |

**Harness engineering note (TypeSafe use-case map):** “Use Jev queries to make your harness smarter — model routing, semantic context retrieval, LLM error detection and guardrails…” — the multi-agent section above is exactly that, applied to Swarm/AutoGen/CrewAI control planes.

---

# Suggested jev-harness build order

1. **`agent-comm-harness`** (who-speaks-next + tool-gate + consensus) — highest platform leverage; composes existing recipes.  
2. **Harden `high-freq-reflex`** — order-allow-deny, risk throttle, sports/prediction variants sharing one policy/eval harness.  
3. **`prediction-market-gate` + `sports-bet-gate`** — marketing-wild, screenshotable $, clear shadow mode.  
4. **`rtb-bid-gate` / fraud** — only after proving p99 budgets with tiny state + caching.  
5. Keep **cyber alert** as the “boring money” proof sibling (fixtures already exist).

### New recipe stubs (catalog-ready)

```
recipes/agent-comm-harness/
  who-speaks-next.ts      # Choice speakers + Noul needs_handoff + Score progress
  tool-exec-gate.ts       # wrap tool-call-allowlist + blast Score
  swarm-consensus.ts      # Noul consensus + Choice winner + Noul fatal_objection

recipes/high-freq-reflex/
  order-allow-deny.ts     # Noul allow + Score risk + Noul news_conflict
  sports-bet-gate.ts      # Noul bet + Score edge + Noul clv_ok
  prediction-market-gate.ts
  rtb-bid-gate.ts         # optional; document latency caveat
```

Eval fixtures should assert: `suppressOnLowConf`, p50 latency budgets, and action histograms — same proof bar as `decisions-with-proof.md`.

---

# Sources (selected)

**TypeSafe / Jev**

- [Introducing System One Models & Jev](https://typesafe.ai/blog/introducing-system-one-models-and-jev) — latency, pricing, Doom/Wikiracing, RLCD  
- [docs.typesafe.ai](https://docs.typesafe.ai) — primitives, confidence routing, fan-out, use-case map, guardrails / function_calling / skill_suggestion cookbooks  
- [Developers Digest Jev guide](https://www.developersdigest.tech/blog/typesafe-jev-system-one-models-release-guide-2026)  
- [The Register / InfoWorld coverage](https://www.theregister.com/ai-and-ml/2026/09/16/typesafe-ai-debuts-model-for-machines-that-plays-doom/5296711) — machine-oriented decisions, 70–500ms claims  

**Agent harness patterns**

- [OpenAI Swarm README](https://github.com/openai/swarm) — Agents + handoffs  
- [Orchestrating Agents: Routines and Handoffs](https://developers.openai.com/cookbook/examples/orchestrating_agents)  
- [AutoGen Swarm](https://microsoft.github.io/autogen/stable/user-guide/agentchat-user-guide/swarm.html) — HandoffMessage speaker selection  
- CrewAI hierarchical delegation / `allow_delegation` patterns (secondary summaries)

**Markets / speed domains**

- Polymarket NBA arb duration/liquidity (CLOB studies; ~3.6s median episode scale)  
- Polymarket ~250ms taker delay / maker-friendly microstructure (industry papers)  
- Polymm / public arb bot postmortems — stale fair value → adverse selection  
- RTB sub-100ms budgets; contextual/IVT sub-10–30ms service budgets  
- Fraud scoring median ~tens of ms with edge distillation  
- Live moderation decision bands ~30–150ms  

**Internal**

- `research/taxonomy.md`, `research/x-usecases-a.md`, `research/decisions-with-proof.md`  
- Recipes: `high-freq-reflex/*`, `confidence-front-door/*`, `verify-gate/*`, `candidate-action-selection/*`

---

*End. Next action if building: land `who-speaks-next` + `order-allow-deny` with shadow fixtures and marketing proof cards.*
