---
title: Recipes
description: Catalog recipes grouped by taxonomy shape ID
---

# Recipes

Machine-readable entries from `recipes/catalog.ts`, grouped by taxonomy ID (`research/taxonomy.md`).

35 recipes in catalog.

## `candidate-action-selection` {#candidate-action-selection}

Candidate action selection. See [taxonomy](/taxonomy).

| Recipe | Description |
|---|---|
| [`candidate-action-select`](/recipes/candidate-action-select) — **Candidate Action Select** | Choice over a dynamic candidate set (+ optional stop Noul) for perception→act loops. |
| [`browser-next-action`](/recipes/browser-next-action) — **Browser Next Action** | Pick the next click/candidate in computer-use or wiki-race flows. |
| [`tool-picker`](/recipes/tool-picker) — **Tool Picker** | Pick which tool to invoke next from a declared catalog, or decline. |
| [`stop-or-continue`](/recipes/stop-or-continue) — **Stop or Continue** | Decide whether an agent loop should keep going, stop, or ask the user. |
| [`who-speaks-next`](/recipes/who-speaks-next) — **Who Speaks Next** | Pick the next multi-agent speaker (agent id / user / none) with handoff + user-turn gates. |
| [`esports-reflex`](/recipes/esports-reflex) — **Esports Reflex** | Pick the next legal game action from engine candidates; stop or regroup on Noul. |

## `row-judgment` {#row-judgment}

Row judgment. See [taxonomy](/taxonomy).

| Recipe | Description |
|---|---|
| [`row-semantic-match`](/recipes/row-semantic-match) — **Row Semantic Match** | Judge whether one JSON/DB row matches a natural-language predicate. |

## `verify-gate` {#verify-gate}

Verify gate. See [taxonomy](/taxonomy).

| Recipe | Description |
|---|---|
| [`llm-verifier`](/recipes/llm-verifier) — **LLM Verifier** | Verify an LLM or tool output before it ships. |
| [`ship-gate`](/recipes/ship-gate) — **Ship Gate** | Allow / revise / block a candidate output before ship; suppress on low confidence. |
| [`injection-check`](/recipes/injection-check) — **Injection Check** | Detect prompt injection / jailbreak attempts in untrusted input. |
| [`tool-call-allowlist`](/recipes/tool-call-allowlist) — **Tool Call Allowlist** | Gate a proposed tool call against policy / allowlist before execution. |
| [`tool-gate`](/recipes/tool-gate) — **Tool Gate** | Gate a proposed tool call by risk class, policy, blast radius, then handoff disposition. |
| [`edge-content-mod`](/recipes/edge-content-mod) — **Edge Content Mod** | Edge moderation: allow / warn / review / block with hate/sexual/self-harm/spam fan-out. |
| [`tool-exec-gate`](/recipes/tool-exec-gate) — **Tool Exec Gate** | Allow/deny tool execution with risk class, policy Noul, and blast-radius Score. |

## `confidence-front-door` {#confidence-front-door}

Confidence front door. See [taxonomy](/taxonomy).

| Recipe | Description |
|---|---|
| [`model-router`](/recipes/model-router) — **Model Router** | Route a user prompt to cheap / mid / frontier tiers by difficulty and risk. |
| [`model-cost-router`](/recipes/model-cost-router) — **Model Cost Router** | Route prompts to cheap/mid/frontier with a cheap-first bias; escalate on low confidence. |
| [`alert-gate`](/recipes/alert-gate) — **Alert Gate** | Gate noisy automated alerts before they page a human. |
| [`inbox-triage`](/recipes/inbox-triage) — **Inbox Triage** | Route inbound messages into bookings, orders, support, spam, or other. |
| [`incident-severity`](/recipes/incident-severity) — **Incident Severity** | Classify incident severity from signals, blast radius, and customer impact. |
| [`oncall-page`](/recipes/oncall-page) — **On-call Page** | Decide whether an event should page on-call, soft-notify, defer, or be ignored. |
| [`message-route`](/recipes/message-route) — **Message Route** | Route an inter-agent message to a specialist, broadcast, drop, or escalate (secret-aware). |
| [`cyber-alert-triage`](/recipes/cyber-alert-triage) — **Cyber Alert Triage** | Triage SOC/SIEM alerts: notify, queue for review, or suppress — with actionable + needs_human gates. |

## `composite-rubric` {#composite-rubric}

Composite rubric. See [taxonomy](/taxonomy).

| Recipe | Description |
|---|---|
| [`rubric-scorer`](/recipes/rubric-scorer) — **Rubric Scorer** | Score a submission against an ordered multi-dimension rubric. |
| [`swarm-consensus`](/recipes/swarm-consensus) — **Swarm Consensus** | Judge multi-agent debate: consensus?, winner, evidence quality, fatal objection → disposition. |

## `semantic-find` {#semantic-find}

Semantic find. See [taxonomy](/taxonomy).

| Recipe | Description |
|---|---|
| [`line-semantic-find`](/recipes/line-semantic-find) — **Line Semantic Find** | Pick the best doc line for an NL query, or NONE if nothing fits. |
| [`span-pick`](/recipes/span-pick) — **Span Pick** | Pick a pre-parsed value/span that satisfies a request, or NONE. |

## `live-multi-judgment` {#live-multi-judgment}

Live multi-judgment. See [taxonomy](/taxonomy).

| Recipe | Description |
|---|---|
| [`typewriter-panel`](/recipes/typewriter-panel) — **Typewriter Panel** | Live multi-score editor panel: tone, clarity, urgency, AI-written, intent on a draft. |
| [`ticket-fanout`](/recipes/ticket-fanout) — **Ticket Fanout** | Speculative multi-question ticket briefing in one RTT; route or escalate. |

## `high-freq-reflex` {#high-freq-reflex}

High-freq reflex. See [taxonomy](/taxonomy).

| Recipe | Description |
|---|---|
| [`mm-buy-sell`](/recipes/mm-buy-sell) — **MM Buy Sell** | Block-time buy/sell/hold reflex from a compact book snapshot. |
| [`hot-path-allow`](/recipes/hot-path-allow) — **Hot Path Allow** | Sub-100ms allow/deny reflex on a compact hot-path event. |
| [`prediction-market-gate`](/recipes/prediction-market-gate) — **Prediction Market Gate** | Arb / liquidity-vs-edge gate for prediction markets (post, cancel, hedge, or skip). |
| [`sports-bet-gate`](/recipes/sports-bet-gate) — **Sports Bet Gate** | Bet / no-bet / shop-elsewhere gate with edge score and CLV filter. |
| [`order-allow-deny`](/recipes/order-allow-deny) — **Order Allow Deny** | Pre-trade allow/deny/cancel/hold gate with edge, risk, and news-conflict checks. |
| [`fraud-score-gate`](/recipes/fraud-score-gate) — **Fraud Score Gate** | Score payment/login fraud risk and dispose: allow, step-up, deny, or review. |
| [`rtb-bid-gate`](/recipes/rtb-bid-gate) — **RTB Bid Gate** | Pre-bid filter: bid, pass, or block on brand-safety + IVT risk for RTB auctions. |

