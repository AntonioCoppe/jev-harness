# X amplify drafts — Diogo / Jev System One → jev-harness

> **Caveat (2026-09-18):** Do not QT or endorse Jev keep/drop as a `/compact` strategy. Transcript probability filtering is out of scope for this repo; prefer lab defaults (Theo: https://x.com/theo/status/2100762304862384257). Historical references to fast-jev-compaction as a "bar" are marketing-equation notes only.


**Author voice:** Antonio Coppe (CTO) — builder, concrete, crisp. Not corporate.  
**Source:** [@CompleteSkeptic](https://x.com/CompleteSkeptic/status/2099925682726002904) — Jev launch (20–200× faster, 40–400× cheaper, decisions not chat)  
**Repo:** https://github.com/AntonioCoppe/jev-harness  
**Hooks from:** `research/oss-launch-playbook.md`, `research/x-usecases-a.md`  
**Constraint:** paste-ready only — do **not** post via API.

Drafted: Thu Sep 17, 2026 (ET)

---

## 1. Quote-tweet (reply-with-quote on Diogo’s launch)

Paste as quote of https://x.com/CompleteSkeptic/status/2099925682726002904

```
Jev is the decision engine. Production still needs a harness around it.

We open-sourced jev-harness:
• DecisionHarness — state → Choice/Score/Noul → policy → action
• confidence gate (minConfidence / onLowConfidence)
• shadow mode — log intended action, never act
• recipes for the two shapes that keep winning:
  – candidate-action (UI/DOM labels → Choice → click loop)
  – row-judgment (same NL predicate over rows, no embeddings)

Not another agent framework. The decide layer when options are already structured.

https://github.com/AntonioCoppe/jev-harness
```

**Why this adds value (not hype):** names the product surface Diogo’s launch implies (policy + confidence + shadow), cites the two empirical recipes from the playbook, and links a cloneable repo.

---

## 2. Standalone posts (launch + repo)

### Standalone A — negation + hard numbers

```
Jev System One: 20–200× faster, 40–400× cheaper, built for decisions — not chat.

What we shipped around it: jev-harness

no embeddings · no prompt soup · no screenshots to a frontier model
candidates in → Choice/Score/Noul → confidence → action (or shadow_noop)

UI loop ~tens of ms/decision · NL row filter shape: 129 rows ≈ 1s / $0.0009

https://github.com/AntonioCoppe/jev-harness
```

### Standalone B — metric-first recipe wedge

```
Diogo just shipped Jev (System One). We’re shipping the OSS harness on top.

Browser-shaped loop (DOM → numbered actions → one Choice):
Zürich→London booked in 7.1s for $0.0039 (1× demos in the wild)

SQL-shaped loop:
WHERE jev(row, 'could work from home')
— no index, no embeddings

DecisionHarness + confidence + shadow + those recipes:
https://github.com/AntonioCoppe/jev-harness
```

---

## 3. Thread outline (3 tweets) — for later

**T1 — Hook (launch + category reframe)**  
Jev is out: 20–200× faster, 40–400× cheaper, decisions not chat (@CompleteSkeptic). Chat models generate. System One *decides*. We open-sourced the production wrapper: jev-harness — DecisionHarness, confidence gate, shadow mode. Repo in T3.

**T2 — Two recipes + hard numbers / negations**  
Two shapes we keep seeing (and ship as recipes):  
(1) `candidate-action-selection` — local OCR/DOM labels → Choice → act → loop (~90 ms-class decisions; pixels stay on-device).  
(2) `row-judgment` — map one NL predicate over rows; 129 ≈ 1s / $0.0009; cache ~6 ms.  
No embeddings. No prompt templates. No “vision agent” tax when the option set is already structured.

**T3 — Clone path + ask**  
`npm i jev-harness` → `DecisionHarness.run({ state, questions, policy, mode })`  
Recipes: candidate-action-select · row-semantic-match · shadow=1 for dry-run.  
https://github.com/AntonioCoppe/jev-harness  
If you’re wiring Jev next to Browser Use / Postgres / a tool picker — tell us what policy broke first; we’ll harden the recipe.

---

## 4. Hashtags

**Recommendation: none.**

Playbook (`oss-launch-playbook.md`): winning X posts led with latency/$ + negation + 1× video / pasteable artifact — not tag spam. HN/X pattern library treats hashtags as noise in this category.

**Optional (light, at most one, only if platform UI pushes tags):** omit, or a single `@typesafeai` mention — not `#AI` / `#LLM` / `#agents` stacks.

---

## Paste checklist

- [ ] Quote-tweet Diogo’s post (§1) first — highest leverage while launch is hot  
- [ ] Standalone A or B later same day / +1 (don’t double-post identical hooks)  
- [ ] Thread (§3) when you have a 15–25s 1× recipe video to attach to T2  
- [ ] No API write — manual paste only  
