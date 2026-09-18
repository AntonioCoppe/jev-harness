# Compaction-level use case — find & pick

> **Caveat (2026-09-18):** The filename is historical. This note picked a *marketing bar* twin (scarce resource = $ + speed), not a product commitment to agent-transcript keep/drop. Probability keep/drop compaction is **out of scope** for jev-harness; prefer lab `/compact` defaults (Theo: https://x.com/theo/status/2100762304862384257). Winner below remains the row-filter equation.


**Date:** Thu Sep 17, 2026 (ET / America/Toronto)  
**Bar:** [tamaratran/fast-jev-compaction](https://github.com/tamaratran/fast-jev-compaction) — everyday pain, crystal equation, undeniable proof, not abstract harness.  
**Equation template:** `<scarce resource people feel> = <money> + <speed>`

---

## Ranked shortlist (3)

| Rank | Use case | Equation | Proof | Source |
|---:|---|---|---|---|
| **1 — WINNER** | Postgres / NL row filter (`WHERE jev(...)`) | **semantic WHERE (no embeddings/index) = money + speed** | 129 rows ≈ **1s** / **$0.0009**; cache hit **6ms** | [@iam_zachi](https://x.com/iam_zachi/status/2100679300756435135) · recipe `row-judgment` / `row-semantic-match` |
| 2 | On-device UI candidate click | **labels → Choice → click = no vision tax** | ~**90ms**/decision; pixels stay on-device | [@milindlabs](https://x.com/milindlabs/status/2100631847155994852) |
| 3 | Browser Use indexed DOM booker | **DOM candidates → one Choice = flight booked without vision agent** | Zürich→London **7.1s** / **$0.0039** (1× demo) | [@gregpr07](https://x.com/gregpr07/status/2100411066966749359) · [browser-use/jev-ultrafast](https://github.com/browser-use/jev-ultrafast) |

Rejected for this bar: alert gates, taxonomy shapes, “harness” framing, model routers without a screenshot-grade before/after, abstract verify-gates.

---

## THE winner

### Postgres `jev()` — natural-language row judgment

**One-line equation:**

> **semantic WHERE (no embeddings / no vector index) = money + speed**

Twin of compaction’s:

> **context window = money + speed**

Everyone who has ever wanted `WHERE “could work from home”` over a table feels this. Compaction kills tokens in the agent loop; this kills the embedding/index tax on structured data.

### Proof numbers

| Claim | Label | Value |
|---|---|---|
| 129 row-judgments wall time | **measured** (iam_zachi public demo) | ≈ **1s** |
| Cost for that pass | **measured** | **$0.0009** |
| Cache hit latency | **measured** | **6ms** |
| Predicate example | demo copy | `'could work from home'` |
| Shape in jev-harness | recipe | `row-judgment` → `recipes/emergent/row-semantic-match.ts` |

No invented metrics. Screenshot target: SQL/`WHERE jev(people, '…')` + cost/latency overlay.

### Why it’s as good as compaction

| Compaction | This |
|---|---|
| Everyday Claude Code `/compact` pain | Everyday “I want a semantic WHERE” pain |
| context window = $ + speed | semantic WHERE = $ + speed |
| Keep/drop tool calls w/ animated demo | Map Noul/Score over rows; cache lights up |
| One decision people screenshot | One SQL-shaped line people screenshot |
| Complementary: shrinks agent context | Complementary: filters structured data before any LLM sees it |

Same marketing altitude: one scarce resource, one equality, hard numbers, copy-paste mental model — **not** “we built a decision harness.”

---

## Draft X post (Antonio voice)

```
compaction nailed it: context window = money + speed.

same altitude, different scarce resource:

  WHERE jev(people, 'could work from home')

129 rows ≈ 1s / $0.0009 · cache hit 6ms
no embeddings. no vector index. just a typed yes/no per row.

that's the twin equation — semantic WHERE = money + speed.

we ship it as the row-judgment recipe in jev-harness
(DecisionHarness + confidence + shadow so you can dry-run before you trust it):

https://github.com/AntonioCoppe/jev-harness

(nod to @tamaratran / fast-jev-compaction for setting the bar on the context→$ equation)
```

Optional shorter alt (if char-tight):

```
context window = $ + speed  →  compaction
semantic WHERE = $ + speed  →  this

WHERE jev(people, 'could work from home')
129 rows ≈ 1s / $0.0009 · cache 6ms
no embeddings. no index.

recipe in https://github.com/AntonioCoppe/jev-harness
(bar set by tamaratran/fast-jev-compaction)
```

---

## Paste-into-agent prompt

```
Build a jev-harness row-judgment demo that matches the compaction marketing bar.

Equation to lead with:
  semantic WHERE (no embeddings / no vector index) = money + speed

Proof to overlay (cite as measured community demo, do not invent):
  129 rows ≈ 1s / $0.0009 · cache hit 6ms
  predicate: "could work from home"
  source: https://x.com/iam_zachi/status/2100679300756435135

Requirements:
1. Use DecisionHarness from https://github.com/AntonioCoppe/jev-harness
2. Follow recipes/emergent/row-semantic-match.ts (taxonomy: row-judgment)
3. State = small JSON array of people/rows; questions = batched Noul (or Score) per row against the NL predicate
4. Policy: include if noul >= threshold AND confidence >= minConfidence; else exclude or review
5. Support mode: "shadow" first (intendedAction logged, no side effects)
6. Print a before/after table: naive "send every row to an LLM" vs Jev map — show $ and ms
7. One-line README blurb: twin of context-window=money+speed
8. Do NOT pitch "harness taxonomy"; pitch the equation + numbers

Env: TYPESAFE_API_KEY. Model default jev-latest.
```

---

## Runners (why #2 / #3 lose the crown)

- **milindlabs (~90ms UI):** Visceral video, same altitude — but the equation is “no vision tax,” which is slightly more niche than “semantic WHERE” (every data person feels SQL). Still day-0 demo bait.
- **Browser Use flights (7.1s / $0.0039):** Hardest $ proof of the three for *computer use*, but reads as a product demo of Browser Use, not a universal scarce-resource equation strangers can paste into their own stack tomorrow.

Winner stays **iam_zachi row filter** — clearest twin to compaction’s context→$ line.

---

*Sources: `research/seeds.md`, `research/x-usecases-a.md`, `research/marketing-why-us.md`, `research/WHAT_TO_BUILD_AND_LAUNCH.md`, docs.typesafe.ai patterns (filter cost < tokens saved).*
