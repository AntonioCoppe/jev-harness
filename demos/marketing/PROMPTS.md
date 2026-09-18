# Paste-into-your-agent prompts

Bar: **proof = OUR demo-run wall time + $** (screenshots of these pages). Never paste third-party demo numbers as if they were ours.

Equation on every card:

```text
<painful resource> = <money savings> + <speed>
```

Demo meter: `calls × $0.000007` labeled DEMO (not a vendor price quote). Re-measure on your traffic with a real `TYPESAFE_API_KEY` before publishing production claims.

---

## 1. Which tool results still matter?

**Equation:** Context tokens = $ savings + TTFT/speed  
**Shape:** `Choice(keep|drop) — never rewrite spans`  
**Card (self-measures on open):** `demos/marketing/cards/tool-retain.html`

```
Use DecisionHarness Choice keep|drop over tool-result spans before compacting history. Never summarize/rewrite. For Claude Code /compact UX, see complementary specialist fast-jev-compaction; use jev-harness when keep/drop must live in your loop with shadow + eval.
```

---

## 2. Stop paying frontier for FAQ

**Equation:** Always-frontier $ = waste; smart route = $ + latency  
**Shape:** `Choice(cheap|mid|frontier) + Score(risk)`  
**Card (self-measures on open):** `demos/marketing/cards/model-router.html`

```
Wire recipes/confidence-front-door/model-router.ts. Policy: risk≥1.5 → frontier else tier. Shadow soak; compare your $ and p50 to always-frontier on YOUR traffic.
```

---

## 3. Ship gate before the incident

**Equation:** Ungated ship = incident $; gate = fewer bad deploys + faster catch  
**Shape:** `Choice(allow|revise|block) + Noul×2`  
**Card (self-measures on open):** `demos/marketing/cards/ship-gate.html`

```
Use recipes/verify-gate/llm-verifier.ts on customer-facing or deploy-bound outputs. Block on jailbreak/verdict; revise if ungrounded. Shadow first.
```

---

## 4. Pager burn → sleep

**Equation:** Alert flood = pager burn; gate = eng-hours $ + sleep  
**Shape:** `Choice + Score + Noul → notify|queue|suppress`  
**Card (self-measures on open):** `demos/marketing/cards/alert-fp.html`

```
Run recipes/confidence-front-door/alert-gate.ts per alert. Shadow first; promote when fixtures match on-call labels.
```

---

## 5. Semantic WHERE without embeddings

**Equation:** LLM-per-row = $ + wallclock; Jev batch demo = ¢ + ms  
**Shape:** `Noul(matches) + Score(strength) per row`  
**Card (self-measures on open):** `demos/marketing/cards/row-filter.html`

```
Use recipes/row-judgment/row-semantic-match.ts. Include/exclude/review from Noul+confidence. Measure YOUR rows — do not cite others' posts as proof.
```

---

## 6. Click without a vision agent

**Equation:** Vision-agent loop = $ + seconds; candidate Choice = ms + ¢  
**Shape:** `Choice(dynamic candidates) + Noul(done)`  
**Card (self-measures on open):** `demos/marketing/cards/ui-action.html`

```
Perceive DOM/OCR locally. recipes/candidate-action-selection — Choice over ids + done Noul. Never send pixels to Jev. Measure YOUR loop.
```

---


## 7. Multi-agent who-speaks-next + tool gate

**Equation:** agent RTT / tool mishap = $ + wallclock  
**Shape:** `Choice(next_speaker) + Score(progress) + Noul(needs_handoff)`; tool path = risk Choice + policy Nouls  
**Research:** `research/crazy-fast-decisions.md` · pack `recipes/agent-comm-harness/`  
**Proof:** YOUR shadow handoff log + tool deny confusion matrix — do not invent ms.

```
Wire recipes/agent-comm-harness/who-speaks-next.ts as the Swarm/AutoGen/CrewAI selector: Choice over agent ids (+ none|user), Score progress, Noul needs_handoff. Pair with recipes/agent-comm-harness/tool-exec-gate.ts (or verify-gate/tool-call-allowlist) before irreversible tools. mode=shadow first; onLowConfidence → review/suppress. Log intendedAction vs human labels. Measure YOUR selector p50 — never paste invented timings.
```

---

## 8. Polymarket / prediction-market edge gate

**Equation:** stale fill residual = $ + arb half-life  
**Shape:** `Choice(take|kill_leg|pass) + Score(edge) + Noul(stale)`  
**Recipe:** `recipes/prediction-market-gate/prediction-market-gate.ts` (extends mm-buy-sell)  
**Proof:** YOUR arb episode capture / naked-leg kills in shadow — no invented fill rates.

```
Use recipes/prediction-market-gate/prediction-market-gate.ts on each Polymarket (or similar) arb/edge episode. Compact book_snapshot + proposed_legs only. Policy: stale → kill_leg; thin edge → pass; else take. SHADOW=1 soak; suppress on low conf. Compare intendedAction to a labeled fixture JSONL before live. Do not claim arb capture % you did not measure.
```

---

## 9. Sports bet / no-bet + CLV filter

**Equation:** −CLV bets = $ + line-move ms  
**Shape:** `Noul(bet) + Score(edge) + Noul(clv_ok)`  
**Recipe:** `recipes/sports-bet-gate/sports-bet-gate.ts`  
**Proof:** YOUR % +CLV on a labeled book — measure live; suppress on low conf.

```
Run recipes/sports-bet-gate/sports-bet-gate.ts per candidate wager with a compact line_snapshot. Bet only when Noul bet + clv_ok clear and edge Score strong; else no_bet. onLowConfidence → suppress. Shadow against CLV labels before promoting. Log YOUR micro-decision wall time — do not invent p50s.
```

---

## 10. Trading order allow/deny + risk throttle

**Equation:** adverse fills / oversize = $ + ms to cancel  
**Shape:** `Noul(allow) + Score(risk) + Noul(news_conflict)` (or mm-buy-sell Choice side + edge)  
**Recipes:** `recipes/high-freq-reflex/order-allow-deny.ts`, `mm-buy-sell.ts`, `hot-path-allow.ts`  
**Proof:** YOUR shadow↔live agreement + throttle effect on drawdown — no invented gate p99.

```
Gate every order with recipes/high-freq-reflex/order-allow-deny.ts (allow|throttle|deny). Tiny risk_snapshot state; news_conflict → deny; elevated risk → throttle. Optionally compose mm-buy-sell for side/edge. Shadow mode for a week; promote only when intendedAction matches desk labels. Measure YOUR gate latency on the hot path — never invent ms.
```

---
