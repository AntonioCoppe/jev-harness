# Path to 200 stars — jev-harness (24–48h playbook)

**Author:** Antonio Coppe launch kit  
**Written:** Thu Sep 17, 2026 ~11:00 PM ET (America/Toronto)  
**Repo:** https://github.com/AntonioCoppe/jev-harness  
**Method:** GitHub `gh` baselines + fxtwitter metrics + official Show HN guidelines + prior internal research (`oss-launch-playbook.md`, `compaction-level-find.md`, `x-amplify-drafts.md`, `WHAT_TO_BUILD_AND_LAUNCH.md`).  
**X MCP:** spend-cap 403 at write time — live reply targeting must use timeline search manually.

---

## 0. Current baseline

| Metric | Value | Notes |
|---|---|---|
| **CURRENT_STARS** | **CURRENT_STARS** *(placeholder — refresh with `gh api repos/AntonioCoppe/jev-harness --jq .stargazers_count`)* | Observed **0** at 2026-09-17 10:58 PM ET |
| Forks | 0 | — |
| Created | 2026-09-17 9:09 PM ET (`2026-09-18T01:09:44Z`) | ~2h old at research time |
| npm | **not published** | README says `npm install jev-harness` — publish before launch or change README to `git clone` / `npx tsx` path |
| Description | Set (good) | Includes measured `48.9s → 1.3s` |
| Topics | 10 set | `jev`, `typesafe`, `system-one`, `harness`, … |
| Social preview | **NOT wired** | `docs/assets/marketing/social-preview.png` exists but OG still uses default GitHub opengraph |
| Antonio X | [@Antoniocoppe](https://x.com/Antoniocoppe) · **~151 followers** | Distribution bottleneck |
| Wave age | **~57h** since Diogo Jev launch | Still hot; peak attention decaying |

### Peer breakouts (same Jev wave)

| Repo | Stars | Age at sample | Stars/hour (rough) | Distribution engine |
|---|---:|---:|---:|---|
| [browser-use/jev-ultrafast](https://github.com/browser-use/jev-ultrafast) | **2503** | ~29.5h | **~85/h** | Browser Use brand + [@gregpr07](https://x.com/gregpr07/status/2100411066966749359) (**~7.3k likes**, 1× video, $0.0039 / 7s) |
| [tamaratran/fast-jev-compaction](https://github.com/tamaratran/fast-jev-compaction) | **663** | ~21h | **~32/h** | Crystal equation (`context window = money + speed`) + Claude Code `/compact` everyday pain + Jev wave; **no topics**, small personal account |
| HN: *Jev Ultrafast…* | **86 pts** | ~1 day | — | Stars came from **X**, not HN. Soft HN still helps legitimacy. |
| Diogo launch | — | Sep 15 2:17 PM ET | — | [@CompleteSkeptic](https://x.com/CompleteSkeptic/status/2099925682726002904): **~66k likes / 31M views / 102k followers** |
| @typesafeai | — | — | — | **~74k followers** — highest owned amplifier after Diogo |

**Implication:** 200 stars in 24h is **not** organic-from-151-followers math. It is **wave-riding + one equation + one amp** math. Compaction proves a small account can clear 600+ *if* the equation is screenshot-grade and the Jev timeline is still hungry. Ultrafast proves a mid-size brand + one video can clear 2k+.

---

## 1. What the breakouts actually did (pattern extract)

### 1.1 fast-jev-compaction (the bar for *us*)

| Lever | What they shipped |
|---|---|
| **Scarce-resource equation** | `context window = money + speed` — one line strangers repeat |
| **Everyday pain** | Claude Code `/compact` is lossy summarization; everyone who burns context feels it |
| **Mechanism, not hype** | Keep/drop/truncate tool calls via Jev `noul`; **never rewrite** text — README is engineering-dense |
| **Clone path** | `npm i fast-jev-compaction` + `TYPESAFE_API_KEY` + 15-line snippet |
| **Complementary framing** | Rides Diogo’s “decisions not chat” without competing with TypeSafe |
| **What they did *not* need** | HN smash, topics, polished social card, big personal following |

### 1.2 jev-ultrafast / Browser Use

| Lever | What they shipped |
|---|---|
| **Hard $ + latency in line 1–2** | “flights took **7s** and cost only **$0.0039**” |
| **1× video labeled** | Trust signal; speed-ramp without disclosure gets dunked |
| **Tiny OSS companion CTA** | “Built a tiny open source … try it below ↓” |
| **Brand flywheel** | browser-use already has massive star gravity |
| **HN** | Helped a little (86 pts); **X did the star work** |

### 1.3 Community twin demos (amplifiers, not competitors)

| Post | Metric hook | Likes (fxtwitter) | Shape |
|---|---|---:|---|
| [@iam_zachi](https://x.com/iam_zachi/status/2100679300756435135) | `WHERE jev(...)` · 129 rows ≈1s / $0.0009 · cache 6ms | ~809 | row-judgment |
| [@milindlabs](https://x.com/milindlabs/status/2100631847155994852) | ~90ms/decision · no pixels leave Mac | ~799 | candidate-action |
| [@gregpr07](https://x.com/gregpr07/status/2100411066966749359) | 7s / $0.0039 · 1× video | ~7269 | DOM Choice |

**Our measured claim (OWN — use this, not theirs):** Claude CLI **48.9s → Jev harness 1.3s** on 24-row NL filter (`docs/assets/marketing/proof/measured.json`). Cite community numbers only as *category examples*, never as our product proof.

---

## 2. Best practices — Show HN (2026)

From [official Show HN guidelines](https://news.ycombinator.com/showhn.html) + observed winners (Outlines 854, Browser Use Launch 259, DSPy 141/189) vs flops (Promptfoo 14, PydanticAI 5):

### Title rules
- Starts with `Show HN:`
- Plain, specific, understated — **no** “revolutionary / AI-powered / game-changing / !”
- Prefer **falsifiable claim** or **crisp mechanism** over category noun (“agent framework”)
- ≤ ~80 chars after `Show HN:`

### First comment rules (post **immediately**)
1. Why you built it (concrete itch, not vision deck)
2. How it works (1 short mechanism paragraph)
3. What’s unfinished / limitations (**name them first**)
4. One **specific** feedback ask
5. Clone path without signup wall if possible
6. **Do not** ask friends to upvote — HN bans this; coordinated voting gets flagged/killed

### Staffing
- Be in the thread **3–6 hours** after submit. Availability beats “optimal hour” charts.
- Best ET window for *you*: weekday **8–11 AM ET** if you can staff; otherwise post when you can sit the thread.
- Diff FAQ ready: vs LangChain/Crew · vs Outlines · vs Browser Use vision · vs DSPy · vs “just call the TypeSafe SDK”

### For jev-harness specifically
- Link must be **tryable**: `SHADOW=1` example + offline `npm run eval` without API is gold for HN skeptics.
- Lead with **measured 48.9s → 1.3s** and/or the equation — not “decision harness taxonomy.”
- Expect skepticism about TypeSafe marketing (HN already has “dishonest presentation” threads). Answer with **mechanism + your measured bakeoff + shadow mode**, not company slogans.

---

## 3. X sequences that convert

### Winning anatomy (empirical)
1. **Hard numbers first** (seconds, dollars, ×) — not “blazing fast”
2. **One equation** strangers can screenshot (`semantic WHERE = money + speed` twin of compaction)
3. **Negation stack** — no embeddings / no prompt soup / no screenshots to frontier
4. **1× demo video or terminal proof PNGs** attached to the *first* post
5. **Repo link once**, clean URL, no link shorteners
6. **Founder replies for 2–4h** — every earnest technical reply; ignore pure hype
7. **No hashtag spam**; optional single `@typesafeai` if natural

### Sequence shape (3–5 posts over ~18h, not a dump)
| # | Timing | Job |
|---|---|---|
| T1 | H0 | Launch: equation + own proof + repo + media |
| T2 | H0+20–40m | Thread expand: Choice/Score/Noul + confidence + shadow (mechanism) |
| T3 | H0+1–2h | Recipe card: row-filter terminal PNGs (48.9s → 1.3s) |
| T4 | H6–12 | Reply-QT a *live* Jev experiment thread with a useful harness tip + soft link |
| T5 | H18–30 | Second angle (UI candidate-click *or* shadow-in-prod) — only if T1 got oxygen |

### Reply posture (non-spam)
- Add a **missing piece** the OP didn’t ship (confidence gate, shadow, eval fixture, policy shape).
- Max **1 soft repo link** per conversation; never copy-paste the same blurb into 10 threads.
- If the thread is about TypeSafe product claims, defend **engineering clarity**, not the brand.

---

## 4. TypeSafe / Jev amplifier map

| Amplifier | Why they matter | Ask / move (non-spam) |
|---|---|---|
| **@CompleteSkeptic (Diogo)** · ~102k | Owns the category narrative | Soft DM / reply with *complement*: “Jev decides; we open-sourced the production wrapper (confidence + shadow + recipes).” Do **not** demand a RT. |
| **@typesafeai** · ~74k | Official amp | Tag only when the post is a clean OSS companion; one mention max on T1 |
| **@gregpr07 / Browser Use** | Already shipped jev-ultrafast; 7k-like video | “General DecisionHarness for the Choice loop you demoed” — complementary, not fork spam |
| **@iam_zachi** | Semantic WHERE viral | “We packaged row-judgment + confidence/shadow/eval so people can dry-run before Postgres UDF” |
| **@milindlabs** | 90ms UI loop viral | “candidate-action-selection recipe mirrors your OCR→Choice loop” |
| **Builders in `x-engager-seen.json`** | Already warm threads (vinicius2prg, VacekvVita/Gomoku, madhu_sd16, …) | Continue *useful* replies; convert curious replies into stars by linking only when they ask “where’s the code?” |
| **@dabit3 / Syntax-adjacent** | High reach, praise threads | Don’t spam launch into praise posts; wait for a technical hook |

**Reality check:** one RT from Diogo or typesafeai is worth more than 50 self-replies. Prioritize **being cite-worthy** (equation + proof PNGs + clone path) over volume.

---

## 5. Anti-patterns (flagged / don’t convert)

| Anti-pattern | Why it fails |
|---|---|
| Coordinated HN upvote rings / “pls upvote” DMs | Against Show HN rules; mods kill / shadowban |
| “Check out my repo” under every Jev tweet | Looks like bot spam; burns amp goodwill |
| Claiming community $ figures as yours | Credibility death on HN + X; use **own** measured.json |
| Star-count screenshots / “help us hit 200” | Begging; converts poorly in this crowd |
| Hashtag stacks `#AI #LLM #agents` | Noise; winners don’t |
| Speed-ramped video without “1×” label | Trust hit (Browser Use explicitly labeled 1×) |
| Second Show HN repeating the first | DeepEval pattern: 79 → 18 |
| “Yet another agent framework” framing | Soft titles die (Promptfoo 14, PydanticAI 5) |
| Launch before `npm i` / clone path works | Dead demos on HN (“Doesn't work” comments killed ultrafast energy) |
| Affilating as TypeSafe / hiding “not affiliated” | README already correct — keep that honesty |
| Dumping 8 tweets in 20 minutes | Algorithm + humans treat as spam; use wave spacing |

---

## 6. Hour-by-hour / wave plan (next 24h)

Assume **launch night = Night of Thu Sep 17 → Fri Sep 18 ET**. Adjust H0 to when hygiene checklist is green.

Times below are **ET**. Staff the high-reply windows yourself.

### Wave A — Prep (H−2 → H0) — **do not skip**

| Time | Action |
|---|---|
| H−2:00 | Green checklist (§8). Publish npm **or** rewrite install to clone path. Wire custom social preview in GitHub Settings. |
| H−1:30 | Export 15–25s **1×** screen recording: terminal bakeoff 48.9s vs 1.3s **or** animated row-filter cards. Still PNGs ready as fallback. |
| H−1:00 | Paste drafts into notes; open Diogo + gregpr07 + iam_zachi + milindlabs tabs for later QT/reply. |
| H−0:15 | Warm: reply *usefully* (no link) on 1–2 live Jev threads so your handle isn’t cold. |

### Wave B — X launch (H0 → H4)

| Time | Action | Target outcome |
|---|---|---|
| **H0** | Post **T1** (launch thread root) with media + equation + repo | First 50–200 impressions from followers + For You |
| H0+5m | Self-reply **T2** (mechanism: DecisionHarness + confidence + shadow) | Thread completeness |
| H0+25m | Self-reply **T3** (terminal proof PNGs / measured table) | Screenshot shares |
| H0–H3 | Reply to every earnest question on your thread | Conversion + algo boost |
| H1–H3 | One **value-add** reply on a viral Jev experiment (§9 templates) — link only if natural | Amp adjacency |
| H2 | Soft-notify 2–3 builder friends **privately** (not “upvote”) — “curious if the shadow mode API reads right” | Organic QTs |
| H3–H4 | If T1 is dead (< few likes): do **not** spam; tighten media and wait for morning HN | Avoid death spiral |

### Wave C — Show HN (H8 → H14) — **morning staff window**

| Time | Action |
|---|---|
| **Fri ~8:30–9:30 AM ET** | Submit Show HN (§7). Immediately post first comment. |
| +0–4h | Live in thread. Paste Diff FAQ answers. Fix any “doesn’t work” within 30m. |
| +1h | Cross-link HN URL as a quiet X reply to your own T1 (“also on HN if you prefer long-form”). Don’t farm. |

### Wave D — Afternoon amp (H14 → H24)

| Time | Action |
|---|---|
| H14 | **T4**: QT compaction *or* row-filter viral with twin-equation framing (nod, don’t leach) |
| H16–H20 | Engage Diogo/typesafeai mentions if any; thank amplifiers with substance |
| H20–H24 | **T5** only if cumulative stars ≥ ~40 and conversation exists; else sleep and prep day-2 recipe clip |
| Overnight | Don’t post empty; let HN + X compound. Check stars at wake. |

### Day-2 contingency (H24–H48) if <100 stars
1. Ship one tighter **video** (row filter or UI click) — media quality is usually the miss.
2. Publish a short technical note (“shadow mode for System One”) as a *regular* HN story only if Show HN stalled.
3. One public recipe PR from a stranger → QT hard.
4. Do **not** re-Show-HN the same pitch.

---

## 7. Exact drafts — Show HN

### Title (primary)

```
Show HN: jev-harness – Claude 48.9s vs Jev 1.3s on the same NL row filter
```

### Title (alts)

```
Show HN: DecisionHarness for TypeSafe Jev – confidence, shadow mode, recipes
```

```
Show HN: typed Choice/Score decisions with a confidence gate (not another agent framework)
```

Use **primary** if the bakeoff PNGs are in the README (they are). Use alt-2 if HN mood is anti-benchmark that day.

### Submission URL
`https://github.com/AntonioCoppe/jev-harness`

### First comment (paste immediately)

```
Hi HN — I built jev-harness around TypeSafe Jev / System One.

Calling Jev once is easy. Shipping it usually isn’t: you need a policy that
maps Choice/Score/Noul answers to an action, a confidence gate for “I’m not
sure,” and a way to dry-run before you trust it.

What it is:
- DecisionHarness.run({ state, questions, policy, mode })
- minConfidence / onLowConfidence → review | suppress | escalate
- mode: "shadow" → always shadow_noop, keeps intendedAction + reason
- recipes for shapes we keep seeing: NL row filter, UI candidate-click,
  alert/model gates, verify-before-ship
- jev-eval CLI that asserts on the *action*, not free text

Measured on my machine (same 24-row NL predicate):
- Claude Code CLI (claude -p, tools off): 48.9s
- Jev + this harness (live API, concurrency 8): 1.3s

This is not LangChain/Crew (orchestration), not Outlines (token grammars),
and not “computer use via screenshots.” It’s the decide layer when your code
already has candidates or rows.

Not affiliated with TypeSafe — you need their API key.

Limitations (real): needs TYPESAFE_API_KEY for live calls; npm package is
brand new; calibration of confidence bands is on you; I’m one person and the
recipe catalog is early.

Try path:
  git clone https://github.com/AntonioCoppe/jev-harness
  npm i && npm run build
  npm run eval -- eval/fixtures/alert-gate.jsonl          # offline
  SHADOW=1 TYPESAFE_API_KEY=… npx tsx examples/alert-gate.ts

Curious where this breaks first for you — Postgres-shaped filters, alert
gates, or wiring next to Browser Use / Claude Code?
```

*(Update the “npm package is brand new” line to “published on npm” once `npm publish` lands.)*

---

## 8. Exact drafts — X launch thread (3–5 posts)

Voice: Antonio — concrete, builder, no corporate. Attach media to T1.

### T1 — Launch (root)

```
compaction set the bar: context window = money + speed.

twin equation we measured:

  NL row filter = money + speed

same 24-row predicate on my machine:
Claude Code CLI  48.9s
Jev + jev-harness 1.3s

no embeddings. no prompt soup. Choice/Score/Noul → policy → action
(+ confidence gate + shadow mode so you can dry-run first)

https://github.com/AntonioCoppe/jev-harness

(not affiliated with TypeSafe — brings your own key)
```

**Media:** terminal proof PNGs side-by-side OR 1× screen recording. Label 1× if video.

### T2 — Mechanism

```
what “harness” means here (one loop):

state → questions (Choice | Score | Noul)
     → answers + confidence
     → policy.decide → action
     → or shadow_noop with intendedAction logged

production pieces people bolt on anyway:
• minConfidence / onLowConfidence
• shadow mode
• recipes + jev-eval fixtures that assert on the action

Jev decides. This is the control plane around it.
```

### T3 — Proof / recipe

```
proof artifact (ours, not a quote-tweet number):

24 people rows · predicate "could work fully remote…"
Claude CLI path: 48.9s
DecisionHarness + row-judgment: 1.3s · ~$0.00045

README has the terminal shots.
recipe: recipes/row-judgment
eval: npm run eval -- eval/fixtures/…

if you’re already playing with WHERE jev(row, '…') —
this is the dry-run / policy / confidence layer before you trust it.
```

### T4 — Amp reply / QT (use on a live thread, not as empty self-post)

See §9. Prefer QT of compaction or a builder demo with the twin-equation nod.

### T5 — Second angle (only if oxygen)

```
second shape shipping in the same repo:

DOM / OCR labels → Choice over candidates → click → loop
(pixels stay local; Jev only sees text options)

same DecisionHarness · same confidence + shadow

if you’re wiring Browser Use / on-device computer use to Jev,
the candidate-action-selection recipe is the glue.
```

---

## 9. Exact drafts — reply templates (Jev threads, non-spammy)

**Rules:** customize 1 detail from the OP; never paste identical text twice; link ≤ once; lead with help.

### 9A — Someone demos a Jev experiment (builder)

```
sick build — the missing piece I kept hitting in prod was “what if confidence
is garbage?”

we open-sourced a tiny DecisionHarness around Jev: policy + minConfidence +
shadow mode (logs intendedAction, never acts) + eval fixtures on the action.

if useful: https://github.com/AntonioCoppe/jev-harness
curious how you’re gating low-conf answers today
```

### 9B — Compaction / context-window thread

```
compaction nailed context window = money + speed.

we’ve been on the twin problem: NL filters / gates without embeddings —
measured Claude CLI 48.9s → Jev harness 1.3s on the same 24-row job, with
shadow mode so you can dry-run the policy first.

https://github.com/AntonioCoppe/jev-harness
(bar credit to fast-jev-compaction for the equation altitude)
```

### 9C — “Is Jev just a classifier / switch statement?” (skeptic)

```
fair steelman — a lot of the value is “typed decision over candidates your
code already knows,” not free-form chat.

where a harness still matters: dynamic option sets, confidence thresholds,
shadow deploys, and evals that assert on the *action*. that’s the boring
production layer we packaged:

https://github.com/AntonioCoppe/jev-harness
```

### 9D — Browser Use / computer-use thread

```
love the indexed action space pattern (DOM candidates → one Choice).

we extracted the general loop as DecisionHarness + a candidate-action
recipe (confidence + shadow so you can log before you click-for-real):

https://github.com/AntonioCoppe/jev-harness

happy to align recipe APIs if useful upstream
```

### 9E — Someone asks “where do I start with Jev?”

```
docs.typesafe.ai for the model.

if you want a production-shaped wrapper (policy, confidence gate, shadow,
recipes, offline eval): https://github.com/AntonioCoppe/jev-harness

60s: SHADOW=1 + examples/alert-gate.ts, or npm run eval offline
```

### 9F — Diogo / @typesafeai launch adjacency (highest care)

```
Jev is the decision engine — this is the OSS control plane we needed around
it for shipping: DecisionHarness → confidence → shadow → action, plus
recipes + evals.

measured row-filter bakeoff in the README (48.9s → 1.3s).

https://github.com/AntonioCoppe/jev-harness
```

---

## 10. Repo hygiene checklist (before launch)

- [ ] **CURRENT_STARS** noted; star watch ready (`gh api … stargazers_count`)
- [ ] **npm:** `npm publish` **or** README install rewritten to clone/`npx tsx` (today: package **404** on registry — **blocking**)
- [ ] `npm i && npm run build && npm run eval -- eval/fixtures/alert-gate.jsonl` exits 0 offline
- [ ] Live example works with a real `TYPESAFE_API_KEY` (`SHADOW=1` path documented)
- [ ] README hero: measured table + terminal PNGs load (no broken images)
- [ ] “Not affiliated with TypeSafe” line present
- [ ] Description set (done) — keep the `48.9s → 1.3s` hook
- [ ] Topics set (done) — optional add: `claude-code`, `browser-use`, `shadow-mode`
- [ ] **Social preview:** upload `docs/assets/marketing/social-preview.png` in GitHub → Settings → Social preview (currently still default OG)
- [ ] LICENSE MIT + CONTRIBUTING visible
- [ ] Pin a single “Launch” discussion or leave Issues clean (no TODO spam)
- [ ] Remove/hide unfinished recipe folders that 404 from README links
- [ ] Demo video or PNG pair exported at 1×; file size tweet-friendly
- [ ] Diff FAQ notes ready for HN (LangChain / Outlines / Browser Use / DSPy / raw SDK)
- [ ] Calendar block **3–6h** for HN staffing Friday morning ET

---

## 11. Realistic odds — what “wake up to 200” requires

### Base rates (this wave)
| Path | Plausible 24h stars | Probability if executed well |
|---|---:|---|
| X-only, no amp, 151 followers, good media | **15–60** | High |
| X + Show HN front-ish (40–100 pts) + good replies | **60–150** | Medium |
| X + **one** mid amp (gregpr07 / iam_zachi / milindlabs QT) | **100–300** | Medium-low |
| X + **Diogo or @typesafeai** RT/QT | **300–1000+** | Low (out of your control) but decisive |
| Compaction-class equation hit without celebrity amp | **200–700** | Medium-low — *this is the realistic “ASAP 200” path* |

### What “wake up to 200” specifically requires
All of the following, not one:

1. **Hygiene green** (especially working install path) before first public link  
2. **Screenshot-grade equation** + **own** 48.9→1.3 proof in T1 media  
3. **Staffed replies** on X 2–4h and HN 3–6h (dead threads don’t convert)  
4. **At least one** of:
   - organic QT from a Jev-wave builder with ≥5k impressions, **or**
   - Show HN reaching ~Show page / ~50+ pts with founder-dense comments, **or**
   - official TypeSafe adjacency (mention/RT)  
5. Launch while the wave is still ≤ ~3–4 days old (you are at ~57h — **still viable, not infinite**)

### Honest call
- **Overnight 200 with zero amp:** unlikely (~10–20%).  
- **24–48h 200 with compaction-quality creative + staffed HN + 1 builder QT:** plausible (~35–45%).  
- **24h 200 if Diogo/typesafeai touches it:** likely (~70%+).  

Treat amp as a *force multiplier*, not the plan. The plan is: **be the obvious complementary OSS link** people paste under Jev demos — equation, proof, clone, shadow.

### Success metrics (instrument)
| Checkpoint | Good | Worry |
|---|---|---|
| H+2 | ≥10 stars or lively thread | 0 stars + 0 replies → fix media/hook |
| H+8 (pre-HN) | ≥30–50 | Still <10 → delay HN until demo tighter? |
| H+24 | ≥100 | <40 → day-2 video + builder outreach |
| H+48 | **≥200** target | Else accept slower compound; ship weekly recipes |

---

## 12. Sources

- GitHub `gh api` snapshots: AntonioCoppe/jev-harness, tamaratran/fast-jev-compaction, browser-use/jev-ultrafast (2026-09-17 ~10:58 PM ET)
- fxtwitter: CompleteSkeptic/2099925682726002904, gregpr07/2100411066966749359, iam_zachi/2100679300756435135, milindlabs/2100631847155994852; profiles Antoniocoppe, typesafeai
- https://news.ycombinator.com/showhn.html
- HN item 49735979 (Jev Ultrafast)
- Internal: `research/oss-launch-playbook.md`, `research/compaction-level-find.md`, `research/x-amplify-drafts.md`, `research/WHAT_TO_BUILD_AND_LAUNCH.md`, `docs/assets/marketing/proof/measured.json`

---

*Refresh CURRENT_STARS and peer star counts immediately before launch; this file’s peer numbers age in hours on a hot wave.*
