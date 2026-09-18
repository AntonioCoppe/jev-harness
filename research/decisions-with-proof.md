# Decisions with proof — jev-harness proof bar

**Date:** Thu Sep 17, 2026 (ET / America/Toronto)  
**Proof bar:** one everyday decision + undeniable, screenshotable before→after.  
**Our bar:** every entry below leads with a scarce-resource equation people feel:

> **`<scarce resource>` = `<money>` + `<speed/latency>`**

No abstract “better decisions.” Only screenshotable before→after. Metrics labeled **measured** (repo/community cites) vs **illustrative** (fixture / design target). Grounded in `research/taxonomy.md`, `research/x-usecases-a.md`, `research/product-surface.md`, and docs.typesafe.ai pattern names cited in taxonomy.

**Caveat (2026-09-18):** probability keep/drop on agent transcripts is **out of scope** for this repo. Compaction is not a noise filter; it should run sparingly when context is too long, with enough thread state (and without casually dropping encrypted reasoning or busting prompt cache). Prefer Claude Code / Codex defaults for history compaction. See Theo: https://x.com/theo/status/2100762304862384257

---

## Catalog (9)

### 1. Model cost router (cheap-first tier)

- **Equation:** **tokens sent to frontier = $ + TTFT/latency**
- **Everyday pain:** every prompt hits GPT-class; FAQ and formatting burn frontier budget.
- **Exact questions:**  
  - `Choice tier` — cheap | mid | frontier  
  - `Score risk` — wrong-answer cost (low / medium / high)
- **Proof metric:** **illustrative fixture** `eval/fixtures/model-cost-router.jsonl` — **70% routed cheap** among tier actions (7/10), 2 mid, 1 frontier; vague → `escalate_llm`. Run: `npm run eval -- eval/fixtures/model-cost-router.jsonl` → `proof.pctRoutedCheap`.
- **Why LLM-agent/prompt-parse fails:** the router must be cheaper/faster than the models it selects; free-form “pick a model” essays have no confidence band and no offline action assert.
- **Recipe status:** **HAVE** — `recipes/confidence-front-door/model-cost-router.ts` (extends `model-router` with cheap-first bias).

### 2. Ship gate (suppress on low confidence)

- **Equation:** **bad ships to prod = incident $ + rollback latency**
- **Everyday pain:** “looks fine” outputs leak secrets, invent SLAs, or ship unsafe shell.
- **Exact questions:**  
  - `Choice verdict` — ship | revise | block  
  - `Noul grounded` — claims supported by evidence?  
  - `Noul unsafe` — injection / policy break?
- **Proof metric:** fixture asserts **`suppress` on low confidence** (`sg-low-suppress`); never ships when unsure. File: `eval/fixtures/ship-gate.jsonl`.
- **Why LLM-agent/prompt-parse fails:** a chat critic returns prose without a hard `onLowConfidence: suppress` policy you can `jev-eval`.
- **Recipe status:** **HAVE** — `recipes/verify-gate/ship-gate.ts` (hardens `llm-verifier` defaults).

### 3. Alert / page gate

- **Equation:** **pages to on-call = pager fatigue $ + wake latency (sleep)**
- **Everyday pain:** flaky alerts page at 3am; humans mute everything.
- **Exact questions:**  
  - `Choice disposition` — notify | queue_review | suppress  
  - `Score severity`  
  - `Noul needs_human`
- **Proof metric:** offline fixture `alert-gate.jsonl` — notify / suppress / queue_review / review-on-low. *(illustrative mix; live $ not claimed)* Demo: `demos/marketing/alert-gate.html`.
- **Why LLM-agent/prompt-parse fails:** pager policy needs discrete actions + confidence floor, not a paragraph of “maybe page.”
- **Recipe status:** **HAVE** — `alert-gate`, `oncall-page`.

### 4. NL row filter (semantic WHERE)

- **Equation:** **rows scanned without embeddings = $ + query latency**
- **Everyday pain:** spin up a vector index for “could work from home” over a people table.
- **Exact questions:**  
  - `Noul matches` — row matches predicate?  
  - `Score strength`
- **Proof metric:** **measured (community):** 129 row-judgments ≈ **1s / $0.0009**, cache **6ms** ([iam_zachi](https://x.com/iam_zachi/status/2100679300756435135) via `research/seeds.md`). Listing blast ~98k / ~10 min (DEV roundup; community self-report).
- **Why LLM-agent/prompt-parse fails:** per-row LLM chat dominates cost/latency; embeddings add index ops tax.
- **Recipe status:** **HAVE** — `row-semantic-match` + batch helpers.

### 5. UI / DOM candidate click

- **Equation:** **pixels to frontier vision = $ + step latency**
- **Everyday pain:** computer-use sends screenshots every step; booking a flight takes forever and $$.
- **Exact questions:**  
  - `Choice next` over dynamic candidate ids  
  - `Noul done` — stop?
- **Proof metric:** **measured (community):** UI OCR→Choice ~**90ms**/decision ([milindlabs](https://x.com/milindlabs/status/2100631847155994852)); Browser Use flights **7.1s / $0.0039** ([gregpr07](https://x.com/gregpr07/status/2100411066966749359)); OCR Mac ~**$0.0002**/step (awlevin).
- **Why LLM-agent/prompt-parse fails:** vision+plan invents clicks; closed candidate set + distribution is the product.
- **Recipe status:** **HAVE** — `candidate-action-select`, `browser-next-action`.

### 6. Tool-call allowlist before exec

- **Equation:** **irreversible shell = blast-radius $ + recovery latency**
- **Everyday pain:** agent runs `rm -rf` / wire-money tool with a confident wrong parse.
- **Exact questions:**  
  - `Choice verdict` — allow | deny | require_confirm  
  - `Noul args_safe`  
  - `Noul intent_aligned`
- **Proof metric:** fixture deny/confirm paths in `tool-call-allowlist.jsonl`; field note: shadow `rm -rf` @ low confidence (Flavio / taxonomy). *(illustrative harness asserts; live incident $ not claimed)*
- **Why LLM-agent/prompt-parse fails:** regex allowlists miss intent; LLM “be careful” has no calibrated hold.
- **Recipe status:** **HAVE** — `tool-call-allowlist`.

### 7. Injection / untrusted-input gate

- **Equation:** **poisoned context tokens = breach $ + incident response latency**
- **Everyday pain:** tool results / web pages say “ignore previous instructions.”
- **Exact questions:**  
  - `Choice disposition` — pass | sanitize | block  
  - `Score severity`  
  - `Noul is_injection`
- **Proof metric:** fixture `injection-check.jsonl` block/sanitize/pass. *(illustrative)*
- **Why LLM-agent/prompt-parse fails:** string filters miss paraphrases; need typed Noul + action policy.
- **Recipe status:** **HAVE** — `injection-check`.

### 8. Helpdesk intent → cascade (lookup vs LLM vs human)

- **Equation:** **tickets that hit a frontier reply = support $ + first-response latency**
- **Everyday pain:** every ticket opens a long LLM thread; order-status never needed generation.
- **Exact questions:**  
  - `Choice intent` / bucket  
  - `Score complexity` / urgency  
  - optional `Noul is_customer`
- **Proof metric:** docs pattern confidence-routing / intent-routing (taxonomy); **illustrative** cascade: order_status→code, product→LLM, complaint→human. Inbox fixture `inbox-triage.jsonl`.
- **Why LLM-agent/prompt-parse fails:** agents always generate; front-door must refuse or route with confidence.
- **Recipe status:** **HAVE** — `inbox-triage` (+ model-cost-router for model half).

### 9. RAG passage / citation keep filter

- **Equation:** **passages stuffed into context = $ + generation latency**
- **Everyday pain:** retrieve-wide dumps 40 chunks; model slows and hallucinates citations.
- **Exact questions:**  
  - per passage `Noul relevant` (± `Noul injection`)  
  - optional `Noul claim_supported` (citation_check cookbook)
- **Proof metric:** filter cost << tokens saved (docs use-case map / cookbooks in taxonomy). **Illustrative** harness target: drop ≥50% irrelevant passages before generate. Paper classify: 1,018 topics for **$0.08** vs summarize **$3.99** (DEV; generate vs label split).
- **Why LLM-agent/prompt-parse fails:** “summarize the retrieval set” loses citation strings; keep/drop Noul preserves verbatim passages you keep.
- **Recipe status:** **Partial** — row-judgment / semantic-find cover the map; dedicated citation recipe optional later.

---

## Proof fixtures landed this pass

| Recipe | Fixture | Screenshotable claim |
|---|---|---|
| `model-cost-router` | `eval/fixtures/model-cost-router.jsonl` | **70% routed cheap** (`proof.pctRoutedCheap`) |
| `ship-gate` | `eval/fixtures/ship-gate.jsonl` | **suppress on low confidence** (`sg-low-suppress`) |

## How to re-verify offline

```sh
npm run eval -- eval/fixtures/model-cost-router.jsonl
npm run eval -- eval/fixtures/ship-gate.jsonl
# each file ends with {"proof":{...}}
```

## Sources

- `research/taxonomy.md`, `research/seeds.md`, `research/x-usecases-a.md`, `research/product-surface.md`, `research/marketing-why-us.md`
- docs.typesafe.ai patterns cited in taxonomy: intent-routing, confidence-routing, llm_guardrails, citation_check, semantic_find, composite-scoring
- Out of scope: agent-transcript keep/drop compaction (prefer lab `/compact`; see caveat above)
