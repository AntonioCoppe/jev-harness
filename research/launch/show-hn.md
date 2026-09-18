# Show HN — paste draft

**When:** post in ET morning peak (roughly 8–11am America/Toronto), not overnight dump.  
**Form:** https://news.ycombinator.com/submit  
**Type:** Show HN

---

## Title (pick one; prefer A)

**A (recommended):**  
`Show HN: jev-harness – policy + confidence gate around TypeSafe Jev (48.9s → 1.3s bakeoff)`

**B (category reframe):**  
`Show HN: Production harness for Jev decisions – not another agent framework`

**C (guarantee-ish / metric):**  
`Show HN: Same NL row filter – Claude CLI 48.9s vs Jev harness 1.3s`

---

## Body

```
jev-harness is a small TypeScript library that turns TypeSafe Jev answers
(choice / score / noul + confidence) into shippable actions.

Calling Jev once is easy. Production usually needs:
  • policy (map answers → notify / suppress / place / skip / …)
  • confidence gate (review / escalate when confidence is low)
  • shadow mode (log intended action, never act)
  • recipes (alerts, NL row filter, candidate→action UI loops, …)
  • offline eval CLI (assert on the action, not free text)

Not affiliated with TypeSafe. You need a TypeSafe API key.

Measured bakeoff on our machine (same 24 people rows, same NL predicate
“could reasonably work from home most of the week”):
  • Claude Code CLI (`claude -p`, tools off): 48.9s
  • Jev + this harness (live API, concurrency 8): 1.3s (~$0.00045)

Repo: https://github.com/AntonioCoppe/jev-harness
npm:  npm i jev-harness

Happy to answer: how this differs from agent frameworks / embedding search,
when not to use Jev, and how shadow+eval fit a real alert pipeline.
```

---

## First comment (post immediately)

```
Author here — quick FAQ so the thread doesn’t re-derive it:

What this is
  DecisionHarness: state → Choice/Score/Noul → policy → action (or shadow_noop).
  Jev decides among structured options; the harness is the production wrapper
  (policy, minConfidence, onLowConfidence, shadow, recipes, eval).

What this is not
  Not an agent framework, not a chat SDK, not affiliated with TypeSafe.

Bakeoff honesty
  Numbers are wall-clock on our machine for one fixed job (24-row NL filter).
  Claude path: signed-in `claude -p` with tools off. Jev path: live TypeSafe API.
  Terminal screenshots + social card are in docs/assets/marketing/.

vs embeddings / RAG row filter
  Recipe is map one NL predicate over rows (row-semantic-match), not vector search.
  Confidence gate + review bucket matter when the model is unsure.

vs “just call the API”
  You can. The harness exists for the parts people re-implement: policy,
  low-confidence behavior, shadow rollout, and action-level evals.

Happy to take concrete “does this fit X?” questions.
```

---

## Reply cheatsheet (keep open while thread is hot)

| Challenge | Short answer |
| --- | --- |
| “Another LangChain?” | No chain/agent graph — one decision surface + policy. |
| “Just prompt Claude?” | Bakeoff is that baseline; structured Choice + confidence is the point. |
| “Vendor lock-in?” | Thin wrapper around TypeSafe Jev; MIT; bring your own key. |
| “Toy demo?” | Recipes + eval fixtures assert on actions; shadow mode for dry-run. |
| “Stars / marketing?” | Point at measured terminal files under `docs/assets/marketing/proof/terminal/`. |
