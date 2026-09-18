# OSS launch playbook — AI harness / agent / eval / SDK distribution on HN + X

**Collected:** Thu Sep 17, 2026 (America/Toronto / ET)  
**Scope:** How peer repos in the same era got distribution — DSPy, LangGraph/LangChain, Vercel AI SDK, Outlines/Guidance, Guardrails-adjacent, Promptfoo/DeepEval, Browser Use, PydanticAI, CrewAI, Autogen, MCP / Computer Use / Cursor-rules adjacent.  
**Method:** HN Algolia + full thread fetches; `user-X` MCP hit spend-cap (403) so X evidence via `api.fxtwitter.com` + HN-linked tweet URLs. Evidence > vibes.

---

## Executive summary (what actually moved the needle)

| Channel | What won | What flopped |
|---|---|---|
| **HN** | Absolute/guarantee claims; “programming not prompting”; open protocols; Launch HN + live demo + founders in comments | Vague “agent framework” posts; third-party Autogen mirrors; Show HNs with no wow claim and thin first comment |
| **X** | 1×-speed **video** + hard latency/$ numbers; negation hooks (“no embeddings / no screenshots”); before→after benchmarks | Text-only “we launched an agent framework”; star-count bragging without a cloneable loop |

**Distribution channels are not equal:** MCP (872 pts) and Outlines JSON (854 pts) crushed most framework Show HNs. Browser Use won by **prior Show HN → GitHub gravity → Launch HN (259)** plus continuous X demos. Promptfoo/DeepEval/PydanticAI/CrewAI mostly grew **off-HN** (brand, Twitter/YouTube, ecosystem) after soft or missing HN launches.

---

## 1. Pattern library — winning HN titles (with links + scores)

### Tier S — breakout (500+ pts)

| Title | Pts / comments | Link | Why it worked |
|---|---|---|---|
| **Show HN: LLMs can generate valid JSON 100% of the time** (Outlines) | **854** / 303 | https://news.ycombinator.com/item?id=37125118 | Guarantee claim + mechanism in first comment (FSM/mask logits) + “blows Guidance out of the water” + paper link. Founder (`remilouf`) answered every technical challenge. |
| **Model Context Protocol** | **872** / 258 | https://news.ycombinator.com/item?id=42237424 | Standards beat frameworks. Anthropic engineers (`@jspahrsummers` et al.) answered “why not OpenAPI?” live. Linked X demo thread. |
| **A guidance language for controlling LLMs** (Guidance) | **552** / ~190 | https://news.ycombinator.com/item?id=35963936 | Novel *language* framing (not “another wrapper”). Microsoft association + controllable generation. |

### Tier A — strong launches / narrative posts (140–400)

| Title | Pts | Link | Notes |
|---|---|---|---|
| LangChain: Build AI apps with LLMs through composability | 372 | https://news.ycombinator.com/item?id=34422627 | Early 2023 timing; “composability” as the hook; community piled on examples. |
| DSPy: Framework for programming with foundation models | **141** / 52 | https://news.ycombinator.com/item?id=37417698 | Omar (`okhat`) lived in comments; one-liner metric **26–36% → 60%** RAG; FAQ vs LangChain. |
| DSPy – Programming–not prompting–LMs | **189** / 45 | https://news.ycombinator.com/item?id=42343692 | Reframe as slogan; second wave after paper/docs matured. |
| Launch HN: Browser Use (YC W25) – open-source web agents | **259** / 100 | https://news.ycombinator.com/item?id=43173378 | YC Launch HN + video + honest cloud pricing line; founders (`gregpr07`, `MagMueller`) replied all day. Prior Show HN: https://news.ycombinator.com/item?id=42052432 (**180** pts). |
| DeepEval – Unit Testing for LLMs | **79** / 31 | https://news.ycombinator.com/item?id=37157323 | “Unit testing” metaphor beats “eval suite”. Follow-up Show HN only **18** pts — first framing mattered more. |

### Tier B — useful but soft (or later rode a wave)

| Title | Pts | Link | Lesson |
|---|---|---|---|
| Show HN: Promptfoo – CLI for testing & improving LLM prompt quality | **14** / 5 | https://news.ycombinator.com/item?id=35807020 | Correct product; **no absolute claim / no demo wow**. Growth came later (CLI product-market fit → OpenAI acquisition news). |
| Show HN: DeepEval – Evaluation and Unit Testing for LLMs | **18** / 8 | https://news.ycombinator.com/item?id=37649856 | Second post underperformed first. |
| Vercel AI SDK: Build AI-Powered Applications with React and Svelte | **16** / 5 | https://news.ycombinator.com/item?id=36343279 | Distribution primarily via Vercel brand / Next.js / X / docs — not HN. AI SDK 3.0 RSC post similarly soft (**9** pts): https://news.ycombinator.com/item?id=39567131 |
| Pydantic.ai: Python agent framework from Pydantic team | **5** / 1 | https://news.ycombinator.com/item?id=43006835 | **Brand + typed agents** grew elsewhere; HN launch was a dud. Later “build a coding agent with Pydantic-AI” hit **197**: https://news.ycombinator.com/item?id=45055439 |
| AutoGen (third-party summary) | **1** | https://news.ycombinator.com/item?id=37855314 | Microsoft didn’t own the thread; no founder replies → dead on arrival on HN. |

### Title formula cheatsheet (from winners)

1. **Guarantee / metric:** `… 100% of the time` · `from 53% to 99%` · `26% → 60%`
2. **Reprogram the category:** `Programming–not prompting` · `A guidance language` · `Unit Testing for LLMs`
3. **Protocol / interface:** `Model Context Protocol` · `Launch HN: … open-source web agents`
4. **Avoid:** `Yet another agent framework` · `Show HN: my CrewAI Gmail bot` without a novel mechanism (26 pts flagged/meh)

### Comment themes that appear on *every* successful thread

| Theme | How winners handled it |
|---|---|
| “How is this different from LangChain / X?” | Pre-written FAQ paste (DSPy); concrete architecture (Browser Use DOM→IDs→actions) |
| “Show me a non-toy example” | Colab / video / notebook in first hour (okhat, remilouf, MagMueller) |
| “Is this just masking / prompting?” | Mechanism paragraph (Outlines FSM; DSPy teleprompter bootstrap) |
| Security / scrape ethics (browser agents) | Engage honestly; don’t dodge (Browser Use Launch HN spent dozens of comments here) |
| Founder presence | Top posters replied **tens of times** same day |

### Anti-HN (viral but not “launch”)

Negative posts about LangChain (`Why we no longer use…` **480**, `Langchain Is Pointless` **386**) got more distribution than many launches. **Do not rely on this** for your own product — but expect competitors’ rage-bait to define category narrative if you don’t own a crisp differentiation.

---

## 2. Pattern library — winning X posts (hooks + media)

> **Note:** `user-X` MCP returned spend-cap 403 on 2026-09-17. Metrics below from `api.fxtwitter.com` and HN-linked tweets.

### Documented high-performing hooks

| Hook pattern | Example | Media | Engagement (approx.) | Source |
|---|---|---|---|---|
| **Latency + $ in first two lines + 1× video** | “flights took **7s** and cost only **$0.0039** … (this video is at 1x speed)” | **video** | **7.1k likes / 463 RTs** | [@gregpr07/2100411066966749359](https://x.com/gregpr07/status/2100411066966749359) (Browser Use + Jev) |
| **Negation stack** (“without X, Y, Z”) | “Without any screenshots, or LLMs and no Pixels leave my mac” | **video** | **706 likes / 47 RTs** | [@milindlabs/2100631847155994852](https://x.com/milindlabs/status/2100631847155994852) |
| **SQL one-liner + no embeddings** | ``WHERE jev(people, 'could work from home')`` · “No index, no embeddings” · 129 rows ~1s / $0.0009 | **video** | **618 likes / 40 RTs** | [@iam_zachi/2100679300756435135](https://x.com/iam_zachi/status/2100679300756435135) |
| **Protocol + diagram/photo** | “No more building custom integrations… one protocol to connect them all” | **photo** | **7.1k likes / 965 RTs** | [@alexalbert__/1861079762506252723](https://x.com/alexalbert__/status/1861079762506252723) (MCP intro; linked from HN) |
| **Before→after accuracy** | DSPy RAG **26–36% → 60%** in ~25 lines (cited on HN + X) | Colab / thread | Drove HN understanding | okhat on HN + linked Twitter thread (id in HN comments) |

### Viral hook taxonomy (copyable)

1. **Hard numbers first:** seconds, dollars, % — not “blazing fast.”
2. **Negations:** no embeddings · no screenshots · no prompt soup · no fine-tune.
3. **Show the loop at 1×:** if you speed-ramp the video, say so; 1× is a trust signal.
4. **Pasteable artifact:** one SQL/`Choice`/`Score` line people can mentally clone.
5. **Tiny OSS companion:** “Built a tiny open source … try it below ↓” (gregpr07 pattern).
6. **Benchmark chart / side-by-side:** structured-output vs System One (see iamMrDuncan / typesafe-ai-benchmark in `x-usecases-a.md`).

### Media type ranking (this category)

1. **Short video of the product working** (browser/UI/SQL) — clear #1  
2. **Single diagram / architecture photo** (MCP)  
3. **Code screenshot / gist** (DSPy signatures, Outlines Pydantic model)  
4. Text-only announcements — weak unless from mega-account

### Launch assets that make “clone in 60s” real

| Asset | What winners shipped |
|---|---|
| **README with one runnable path** | `pip/npm install` → 10–20 line example that prints a surprising metric |
| **Colab / Val Town / demo URL** | DSPy Colab; Vercel `sdk.vercel.ai/demo`; Browser Use screen.studio clip |
| **Repo shape** | Minimal core + `examples/` + optional cloud; MIT helps HN trust |
| **GIF/video in README top** | Browser Use, Guidance-era repos; Outlines sold via claim + paper |
| **One-liner positioning** | “Programming not prompting” · “valid JSON 100%” · “unit testing for LLMs” |

---

## 3. Per-target dossier (evidence)

### DSPy
- **HN:** https://news.ycombinator.com/item?id=37417698 — 141 pts; founder-dense replies; Simon Willison skepticism answered with mechanism + metric.  
- **Second wave:** “Programming–not prompting” 189 pts.  
- **X:** Threads with Llama2 quality jumps + Colab; metric-first.  
- **Clone-in-60s:** Signatures + teleprompter compile demo.

### LangChain / LangGraph
- **HN launch:** composability post 372 pts (early market).  
- **Later:** criticism posts dominate; Harrison Chase engages on “why we left LangChain” threads (https://news.ycombinator.com/item?id=40739982). LangGraph sold as **lower-level / cyclical / Pregel** — recovery narrative, not a single viral Show HN.  
- **Distribution lesson:** first-mover HN + GitHub stars + Twitter ecosystem > later Launch polish.

### Vercel AI SDK
- Soft HN numbers; **distribution = Vercel surface area** (Next.js, docs, RSC streaming demos, playground).  
- Lesson for jev-harness: if you lack a mega platform, **you must earn HN/X with claims + video**; brand won’t carry you.

### Outlines / Guidance
- Guidance: language-for-control (552). Outlines: **guarantee title** (854) + efficiency vs Guidance in paper Figure 2.  
- Comment gold: “syntax vs semantics,” logit masking caveats — founders stayed technical.

### Guardrails (ecosystem)
- Original Guardrails AI lacked a S-tier HN smash in this sample.  
- Pattern that *does* win: **metric guardrails** — e.g. Forge “8B from 53% → 99%” (**687** pts, https://news.ycombinator.com/item?id=48192383). Sell **delta**, not the word “guardrails.”

### Promptfoo / DeepEval
- Soft Show HNs (14 / 18) but sticky category metaphor (**CLI eval** / **pytest for LLMs**).  
- Growth: GitHub + Twitter + “red team / CI” content; Promptfoo later news (OpenAI) recirculated HN attention.

### Browser Use
- Show HN → community → **Launch HN 259** + relentless X demos.  
- Founders reply on security, LinkedIn blocking, MCP skepticism — high trust.  
- Clone asset: numbered DOM actions + prompt → Playwright.

### PydanticAI
- HN launch flop (5 pts); brand/types/docs (`ai.pydantic.dev`) + later how-to posts.  
- Lesson: **typed agents alone aren’t a HN title** — need a guarantee, recipe, or coding-agent story.

### CrewAI / Autogen
- No S-tier owned HN launch found. CrewAI: YouTube + Twitter + “role crew” demos; employee Show HN Gmail crew **26** pts. Autogen: Microsoft blog/GitHub; third-party HN posts died.  
- Lesson: multi-agent **roleplay framing** underperforms **single crisp mechanism** on HN.

### MCP / Claude Computer Use / Cursor rules
- **MCP:** protocol post + Anthropic X diagram = category defining.  
- **Computer Use:** Anthropic product news; OSS “computer use for any LLM” Show HN **180** (browser-use adjacent).  
- **Cursor rules:** PostHog `.cursorrules` curiosity (**193** pts) — config-as-artifact is shareable.

---

## 4. Anti-patterns (what flopped or underperformed)

1. **Show HN without a falsifiable claim** — Promptfoo 14, many “my agents” posts.  
2. **Third-party announcing someone else’s Microsoft/Google repo** — Autogen 1 pt.  
3. **“Agent framework from {famous lib}” with no demo** — PydanticAI 5 pts.  
4. **Abstracting prompts without inspectability** — DSPy’s main HN risk (Simon W.); if you hide the string, show the log.  
5. **Speed-ramped demo video without saying so** — trust hit; winners label **1×**.  
6. **Star-count / hype without clone loop** — HN dunks.  
7. **Ignoring “diff vs LangChain”** — every thread asks; FAQ-ready answer required.  
8. **Security hand-waving for browser/CDP tools** — Launch HN will roast you; engage or get flagged.  
9. **Second Show HN that repeats the first** — DeepEval 18 after 79. Prefer new angle (recipe, benchmark, integration).  
10. **Betting only on HN** when brand distribution exists elsewhere — or the inverse: betting only on X when you need long-form founder Q&A (HN).

---

## 5. Recommended launch kit — **jev-harness** (TypeSafe Jev)

### Positioning (one sentence)

**TypeSafe Jev / System One:** typed **Choice / Score / Noul** decisions with confidence + shadow mode — so harnesses pick among *real candidates* (UI elements, DB rows, recipe actions) instead of generating prose and hoping.

### Must-ship assets (clone in 60s)

| # | Asset | Spec |
|---|---|---|
| 1 | **README hero** | 15-line TS: `Choice(candidates)` → pick; print distribution + confidence |
| 2 | **Recipe A video (≤25s, 1×)** | UI candidate-click: OCR/DOM labels → Jev → click loop (milindlabs / Browser Use shape) |
| 3 | **Recipe B video (≤20s, 1×)** | NL row filter: ``WHERE jev(row, '…')`` or batch `row-semantic-match` with $ and ms on screen |
| 4 | **Negation one-liner** | “No embeddings. No prompt templates. No screenshots to a frontier model.” |
| 5 | **Shadow-mode snippet** | Log what Jev *would* do vs production policy; confidence gate |
| 6 | **Repo layout** | `src/` primitives · `recipes/emergent/candidate-action-select.ts` · `recipes/emergent/row-semantic-match.ts` · `examples/` |
| 7 | **Diff FAQ** | vs LangChain/Crew (orchestration) · vs Outlines/Guidance (token grammars) · vs Browser Use vision agents (candidate Choice) · vs DSPy (compile prompts vs System One decisions) |

### Empirical categories to lead with (from `taxonomy.md`)

1. **`candidate-action-selection` / ui-grounding`** — dynamic option set → Choice  
2. **`row-judgment` / structured-data-filter`** — map NL predicate over rows  
3. Confidence / shadow as the **production** story (not day-0 marketing fluff)

### Channel plan

| Day | Channel | Move |
|---|---|---|
| −3 | Seed builders | Soft-share recipes privately; collect 2–3 quote-tweets with numbers |
| 0 AM | **X launch** | Video + $ + ms (draft below) |
| 0 midday | **Show HN** | Title + first comment ready; founders online 4–6h |
| +1–3 | **X demos** | One recipe teaser/day; quote community forks |
| +7 | HN follow-up *only if new* | Benchmark or “shadow mode in prod” — not a repeat Show HN |

---

## 6. Drafts for jev-harness

### A. Show HN — title + first comment

**Title:**  
`Show HN: jev-harness – typed Choice/Score decisions for UI clicks and NL row filters`

*(Alt if you want Outlines-style guarantee energy:)*  
`Show HN: System One decisions – pick among real candidates with confidence, not another agent framework`

**First comment (paste-ready):**

> Hi HN — we built **jev-harness** around TypeSafe **Jev / System One**: instead of asking an LLM to “figure it out,” you give it a **typed decision** over candidates your code already knows.
>
> Primitives:
> - **Choice(options)** → distribution over a dynamic set (UI elements, DOM ids, wiki links, tool names)
> - **Score / Noul** → graded or boolean judgments (row filters, gates)
> - **confidence + shadow mode** → ship the harness before you trust it in prod
>
> Two recipes we keep seeing in the wild (and ship as copy-paste):
> 1. **UI candidate-click** — local OCR/DOM → labels only → Choice → click → loop (~tens of ms/decision; no pixels to a frontier model). Shape: `recipes/emergent/candidate-action-select.ts`
> 2. **NL row filter** — map the same predicate over rows (`could work from home`) without embeddings/index. Shape: `recipes/emergent/row-semantic-match.ts`
>
> This is **not** LangChain/Crew (orchestration), **not** Outlines (token grammars), and **not** “computer use via screenshots.” It’s the decision layer when the option set is already structured.
>
> Repo: *[link]* · 60s path: `npm i … && node examples/…`
>
> Happy to dig into confidence calibration, shadow diffs, or how people wire this next to Browser Use / Postgres.

### B. Three X posts

**1) Launch**

> we open-sourced **jev-harness** — TypeSafe System One for agents that must *decide*, not essay.
>
> Choice / Score / Noul + confidence + shadow mode  
> recipes: UI candidate-click · NL row filter
>
> no embeddings. no prompt soup. candidates in → decision out.
>
> [video: 15-line Choice demo]  
> github: *[link]*

**2) Demo (metric-first, 1×)**

> Browser step: DOM → numbered actions → one Jev Choice  
> (typing falls back to a small LLM)
>
> Zürich→London booked in **7.1s** for **$0.0039**  
> (video is **1×**)
>
> harness shape = candidate-action-selection, not “vision agent”
>
> [video] recipe: `candidate-action-select` · [repo]

**3) Recipe teaser (SQL / negation)**

> Postgres without a vector index:
>
> ```sql
> WHERE jev(people, 'could work from home')
> ```
>
> 129 row-judgments ≈ **1s** / **$0.0009** · cache **6ms**  
> no embeddings. just Noul/Score over rows.
>
> [video] · `row-semantic-match` in jev-harness

---

## 7. Quick reference — HN scoreboard (this research)

| Project | Best HN hit (pts) | Own launch quality |
|---|---|---|
| MCP | 872 | Excellent (protocol + eng in comments) |
| Outlines | 854 | Excellent (guarantee Show HN) |
| Guidance | 552 | Excellent |
| LangChain launch | 372 | Excellent (timing) |
| Browser Use Launch HN | 259 | Excellent |
| DSPy (first / slogan) | 141 / 189 | Strong + founder replies |
| DeepEval (first framing) | 79 | Good metaphor; Show HN weaker |
| Promptfoo Show HN | 14 | Weak HN; strong later product |
| Vercel AI SDK | ~16 | Weak HN; strong brand |
| PydanticAI launch | 5 | Weak HN; strong brand |
| Autogen (3rd party) | 1 | Fail |
| CrewAI | ≤26 owned | X/YouTube > HN |

---

## 8. Sources & limits

- HN: Algolia API + item pages listed above (fetched 2026-09-17 ET).  
- X: `api.fxtwitter.com` for gregpr07 / milindlabs / iam_zachi / alexalbert__ ; user-X MCP spend-cap.  
- Internal: `research/taxonomy.md`, `research/x-usecases-a.md`, `recipes/emergent/*`.  
- Re-run user-X search when cap lifts for CrewAI/joaomdmoura, okhat/lateinteraction historical threads, and Guardrails AI launch tweets.

