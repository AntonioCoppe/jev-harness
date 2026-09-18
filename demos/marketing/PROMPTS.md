# Paste into Claude / Cursor / your coding agent

Shareable prompts for each **proof decision** in `research/decisions-with-proof.md`.  
Each prompt forces a **scarce-resource equation** (`resource = $ + speed`) and a **jev-eval**-able action — not a summary essay.

---

## 1. Context keep/drop (compaction)

```
# Paste into Claude / Cursor / your coding agent
Goal: prune tool calls/results from this transcript WITHOUT summarizing.
Equation to optimize: context window tokens = $ + next-completion latency.
Rules: only keep/drop/truncate tool_use+tool_result pairs; user/assistant text stays verbatim; preserve exact paths and errors.
For each non-pinned tool call ask Jev (or simulate):
  Noul keep_call — knowing this call+input still matters?
  Noul keep_result — verbatim result contents still needed?
Emit a table: tool_use_id | keep_call | keep_result | action(keep|truncate|drop) | chars_saved.
Never rewrite kept content. Prefer fast-jev-compaction for Claude Code /compact; use jev-harness policy if wiring a custom loop.
```

---

## 2. Model cost router (70% cheap proof)

```
# Paste into Claude / Cursor / your coding agent
Wire recipes/confidence-front-door/model-cost-router.ts via DecisionHarness.
Equation: tokens to frontier = $ + TTFT/latency.
Questions: Choice tier{cheap,mid,frontier} + Score risk{low,mid,high}.
Policy: risk>=1.5 → frontier; mid+risk<0.6 → cheap; else tier; onLowConfidence=escalate_llm.
Prove offline: npm run eval -- eval/fixtures/model-cost-router.jsonl
Assert the printed proof.pctRoutedCheap >= 70 among cheap|mid|frontier actions.
Do not invent a chat router — use the recipe + fixture.
```

---

## 3. Ship gate (suppress on low confidence)

```
# Paste into Claude / Cursor / your coding agent
Wire recipes/verify-gate/ship-gate.ts.
Equation: bad ships to prod = incident $ + rollback latency.
Questions: Choice verdict{ship,revise,block} + Noul grounded + Noul unsafe.
Policy: unsafe>=0.5 or block → block; grounded<0.45 or revise → revise; else ship.
CRITICAL: defaultOnLowConfidence must be "suppress" — unsure never ships.
Prove: npm run eval -- eval/fixtures/ship-gate.jsonl
Assert case sg-low-suppress → action "suppress" and proof.suppressOnLowConf true.
```

---

## 4. Alert / page gate

```
# Paste into Claude / Cursor / your coding agent
Use recipes/confidence-front-door/alert-gate.ts (or demos/marketing/alert-gate.html for a visual).
Equation: pages to on-call = pager fatigue $ + wake latency.
Questions: Choice disposition{notify,queue_review,suppress} + Score severity + Noul needs_human.
Prove offline: npm run eval -- eval/fixtures/alert-gate.jsonl
Show one notify, one suppress, one queue_review, one review-on-low. No prose pager policy.
```

---

## 5. NL row filter (semantic WHERE)

```
# Paste into Claude / Cursor / your coding agent
Use recipes/row-judgment/row-semantic-match.ts (+ batch helpers).
Equation: rows scanned without embeddings = $ + query latency.
For each row: Noul matches(predicate) + Score strength → include|exclude|review.
Prove with a tiny JSONL of people rows and predicate "could work from home";
print include count, ms, and that you did NOT build an embedding index.
Cite community bar: ~129 rows ≈ 1s / $0.0009 (iam_zachi) as measured reference, label fixture numbers illustrative unless live.
```

---

## 6. UI / DOM candidate click

```
# Paste into Claude / Cursor / your coding agent
Use recipes/candidate-action-selection/candidate-action-select.ts.
Equation: pixels to frontier vision = $ + step latency.
Input: a dynamic list of {id, description} candidates from OCR/DOM (text only — no screenshots to a frontier model).
Questions: Choice next(candidates) + Noul done → act or STOP.
Prove: npm run eval -- eval/fixtures/candidate-action-select.jsonl
Optional live: loop until STOP; overlay ms per decision. Community refs: ~90ms UI loop; Browser Use 7.1s/$0.0039 flights.
```

---

## 7. Tool-call allowlist before exec

```
# Paste into Claude / Cursor / your coding agent
Use recipes/verify-gate/tool-call-allowlist.ts.
Equation: irreversible shell = blast-radius $ + recovery latency.
State: tool_name, args, allowlist[], user_goal.
Questions: Choice verdict{allow,deny,require_confirm} + Noul args_safe + Noul intent_aligned.
Prove: npm run eval -- eval/fixtures/tool-call-allowlist.jsonl
Deny off-allowlist; require_confirm on shaky args; never execute in the eval itself.
```

---

## 8. Injection / untrusted-input gate

```
# Paste into Claude / Cursor / your coding agent
Use recipes/verify-gate/injection-check.ts.
Equation: poisoned context tokens = breach $ + incident response latency.
Questions: Choice disposition{pass,sanitize,block} + Score severity + Noul is_injection.
Prove: npm run eval -- eval/fixtures/injection-check.jsonl
Treat tool results / pasted web text as untrusted state. Output action only — no "it seems fine" essays.
```

---

## 9. Helpdesk intent cascade

```
# Paste into Claude / Cursor / your coding agent
Combine inbox-triage + model-cost-router.
Equation: tickets that hit a frontier reply = support $ + first-response latency.
Step 1: Choice bucket + Noul is_customer → spam/support/orders/…
Step 2: if needs generation, model-cost-router → cheap|mid|frontier.
Prove: npm run eval -- eval/fixtures/inbox-triage.jsonl && npm run eval -- eval/fixtures/model-cost-router.jsonl
Report % tickets that never call a generative model (illustrative from fixtures).
```

---

## 10. RAG passage / citation keep filter

```
# Paste into Claude / Cursor / your coding agent
Map row-semantic-match (or per-passage Noul) over retrieved chunks BEFORE generate.
Equation: passages stuffed into context = $ + generation latency.
For each passage: Noul relevant (and optional Noul injection / claim_supported).
Keep verbatim passages you keep — never summarize them away.
Prove with a fixture of 20 passages: drop irrelevant ones, print % tokens removed and that kept passages are byte-identical.
Label numbers illustrative unless you run live Jev.
```

---

## Quick verify (repo root)

```
npm run eval -- eval/fixtures/model-cost-router.jsonl
npm run eval -- eval/fixtures/ship-gate.jsonl
```

See also: `research/decisions-with-proof.md`, `research/marketing-why-us.md`.
