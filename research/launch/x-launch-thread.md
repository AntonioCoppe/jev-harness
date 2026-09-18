# X launch thread — paste draft (do not API-post)

**Voice:** Antonio Coppe — concrete, builder, no corporate.  
**Repo:** https://github.com/AntonioCoppe/jev-harness  
**Media:** attach `docs/assets/marketing/social-preview.png` (and/or terminal proof PNGs).  
**Numbers rule:** only our measured bakeoff **48.9s → 1.3s**. Do **not** paste CompleteSkeptic / TypeSafe marketing multipliers as if we measured them.

---

## Quote of CompleteSkeptic (post first or as T0)

**Quote URL:** https://x.com/CompleteSkeptic/status/2099925682726002904

```
Jev decides. Production still needs a harness.

We OSS’d jev-harness:
• policy → action
• confidence gate
• shadow mode
• recipes + action-level evals

Same 24-row NL filter on our machine:
Claude Code CLI 48.9s → Jev+harness 1.3s
(measured terminal bakeoff — card attached)

https://github.com/AntonioCoppe/jev-harness
```

Attach: `social-preview.png`

---

## 4-tweet thread (standalone if quote already posted)

### T1 — Hook + our number

```
48.9s → 1.3s on the same job.

24 people rows × one NL predicate (“could reasonably work from home…”):
• Claude Code CLI (`claude -p`, tools off): 48.9s
• TypeSafe Jev + jev-harness (live API, c=8): 1.3s

Not an agent framework. The decide layer when options are already structured.

https://github.com/AntonioCoppe/jev-harness
```

Attach: social-preview.png

### T2 — What the harness adds (negation stack)

```
Jev returns Choice / Score / Noul + confidence.

What we wrap around it (OSS):
• policy maps answers → notify / suppress / place / skip / …
• minConfidence + onLowConfidence (review instead of guessing)
• shadow mode — log the action, never act
• recipes: NL row filter, candidate→action UI loops, alert gates
• eval CLI — assert on the action, not free text

no embeddings · no prompt soup · no “vision agent” tax when labels exist
```

### T3 — Pasteable surface

```
npm i jev-harness
export TYPESAFE_API_KEY=tsk_...

DecisionHarness.run({ state, questions, policy, mode })
→ { action, confidence, reason }

Shadow: mode: "shadow" → intended action logged, live behavior unchanged.
Recipes live under /recipes. Terminal bakeoff under docs/assets/marketing/proof/terminal/
```

### T4 — Ask + boundary

```
Not affiliated with TypeSafe — bring your own key.

If you’re wiring Jev next to alerts, Postgres-shaped filters, or a DOM candidate list:
tell us which policy broke first. We’ll harden the recipe.

Repo again: https://github.com/AntonioCoppe/jev-harness
```

---

## Optional shorter alt (if 4 tweets feel long)

Merge T2+T3 into one; keep T1 number + T4 ask. Prefer full 4 if attaching media to T1.

## Hashtags

None. Optional single @typesafeai only if they commonly amplify builders — never stack #AI #LLM.
