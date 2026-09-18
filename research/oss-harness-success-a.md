# Storm A — OSS harness success patterns (AI era 2022–2026)

**For:** Antonio Coppe / `jev-harness` (TypeSafe Jev decision harness)  
**Date:** 2026-09-17 EDT  
**Method:** Live `gh api` star/metadata snapshots (2026-09-17~18 UTC), README first-screens via GitHub Contents API, WebSearch cross-checks for growth narratives and harness-engineering discourse.  
**Scope:** Frameworks that wrap models into reliable *product loops* (eval, agents, guardrails, orchestration, structured output) — not model weights.

---

## Snapshot table (stars via `gh api`, ~2026-09-17 EDT)

| Repo | Stars | Created | License | One-line role |
|---|---:|---|---|---|
| langchain-ai/langchain | 146,546 | 2022-10 | MIT | Agent engineering platform / ecosystem glue |
| browser-use/browser-use | 114,991 | 2024-10 | MIT | Browser agent loop (“use the web like a human”) |
| microsoft/autogen | 61,026 | 2023-08 | CC-BY-4.0 | Multi-agent programming framework (now maint. / AG2 fork) |
| crewAIInc/crewAI | 58,713 | 2023-10 | MIT | Role-playing multi-agent crews + flows |
| langchain-ai/langgraph | 41,852 | 2023-08 | MIT | Low-level durable stateful agent graphs |
| stanfordnlp/dspy | 38,112 | 2023-01 | MIT | Program LMs + compile/optimize prompts |
| openai/openai-agents-python | 29,528 | — | — | Production successor to Swarm (lightweight multi-agent) |
| vercel/ai | 26,814 | 2023-05 | proprietary-ish (NOASSERTION) | TypeScript AI SDK + UI streaming |
| promptfoo/promptfoo | 25,240 | 2023-04 | MIT | Declarative evals + red team (now under OpenAI) |
| browserbase/stagehand | 24,323 | 2024-03 | MIT | TS/Python/Go SDK: agents ↔ real browsers |
| Skyvern-AI/skyvern | 23,022 | 2024-02 | AGPL-3.0 | Vision+LLM browser workflow automation |
| guidance-ai/guidance | 21,760 | 2022-11 | MIT | Constrained generation language |
| openai/swarm | 21,987 | 2024-02 | MIT | Educational multi-agent (superseded) |
| pydantic/pydantic-ai | 20,015 | 2024-06 | MIT | Typed Python agent SDK (“How Python does AI”) |
| openai/evals | 19,472 | 2023-01 | NOASSERTION | Early eval registry (dashboard now primary) |
| confident-ai/deepeval | 18,313 | 2023-08 | Apache-2.0 | Pytest-style LLM metrics framework |
| anthropics/claude-quickstarts | 17,690 | 2024-08 | — | Official computer/browser-use demos |
| browser-use/browser-harness | 17,644 | 2026-04 | MIT | Self-healing browser harness (peer) |
| dottxt-ai/outlines | 15,827 | 2023-03 | Apache-2.0 | Structured generation (CFG/regex/JSON) |
| 567-labs/instructor | 13,915 | — | — | Pydantic structured extraction (peer) |
| guardrails-ai/guardrails | 7,427 | 2023-01 | Apache-2.0 | Validators / rails around LLM I/O |
| instructlab/instructlab | 1,416 | 2024-02 | Apache-2.0 | Taxonomy → synthetic data → train loop |
| lastmile-ai/aiconfig | 1,087 | 2023-09 | MIT | Config-as-code for genAI apps |
| pydantic/pydantic-ai-harness | 898 | 2026-03 | — | Explicit “harness” package on Pydantic AI |

**Growth signals (evidence-based):**
- **browser-use:** created Oct 2024 → ~115k★ by Sep 2026; GitStarClub milestones 10k (Jan 2025), 50k (Apr 2025). Extreme velocity = killer demo + clear job.
- **dspy:** ~10k by Apr 2024 → ~38k Sep 2026; steady research→prod narrative; GEPA / MIPROv2 keep momentum.
- **pydantic-ai:** Jun 2024 → ~20k; topics explicitly include `harness` / `harness-engineering`; spun `pydantic-ai-harness` (2026).
- **promptfoo:** eval→red-team expansion; 2026 acquisition narrative (“part of OpenAI”) while staying MIT OSS.
- **aiconfig / instructlab:** low stars + stale-ish push relative to leaders → category right, distribution/demo wrong or too early/narrow.

---

## Focus analyses

### 1. `stanfordnlp/dspy` — 38,112★

1. **What it is:** Framework for *programming*—not prompting—LMs: typed Signatures, Modules, and optimizers that compile better prompts/weights.
2. **Stars / growth:** 38.1k★, 3.3k forks, created 2023-01; still pushing daily (2026-09). Crossed ~10k Apr 2024; continued climb through 2025–26 (+hundreds★/mo). Homepage `dspy.ai`.
3. **Job it owns:** “My prompts are brittle; I want a programmable, optimizable pipeline that improves against a metric.”
4. **Why it won:**
   - **Abstraction level:** Signatures/Modules feel like software, not string soup.
   - **Self-improvement story:** Optimizers (BootstrapFewShot, MIPROv2, GEPA) are a unique wedge vs. pure orchestration libs.
   - **Academic credibility + demos:** Stanford NLP + papers → trust for serious builders.
   - **Portability:** Same program across models/strategies.
   - **Community compounding:** Discord, many derivative papers/apps (STORM, etc.).
5. **README first screen:** Headline “programming—not prompting”; docs link; `pip install dspy`; short LM config + Predict/ChainOfThought mental model.
6. **Killer demo / TTFSuccess:** Define a Signature → `dspy.ChainOfThought` → run → (optional) compile with a metric on a tiny trainset. First win in minutes without writing a prompt template by hand.
7. **Lessons for jev-harness:**
   - **Do:** Own a sharp slogan (“LLMs generate. Jev decides.” already fits). Make *typed I/O + metric/gate* the product, not chat.
   - **Do:** Show compile/eval loop (fixtures → policy regression) as first-class, DSPy-style.
   - **Don’t:** Become a general agent OS; DSPy wins by staying at the “program the LM” layer.
   - **Don’t:** Hide the metric—optimization without an explicit score is theater.

---

### 2. `langchain-ai/langgraph` (+ `langchain`) — 41,852★ / 146,546★

1. **What it is:** LangGraph = low-level durable stateful agent/workflow graphs; LangChain = broader “agent engineering platform” + integrations.
2. **Stars / growth:** LangChain is category gravity (146k★ since 2022-10). LangGraph split/clarified the *reliable loop* story (durable execution, HITL, memory) and sits at ~42k★ with heavy enterprise name-drops.
3. **Job it owns:** “I need long-running agents that checkpoint, interrupt for humans, and don’t lose state when tools fail.”
4. **Why it won:**
   - **Distribution:** Early (2022) mindshare + LangSmith observability funnel.
   - **Right abstraction after pain:** Graphs/state machines beat opaque agent chains for production.
   - **Enterprise proof:** Klarna, Replit, Elastic cited on README.
   - **Product ladder:** Open source → LangSmith → Deployments → Studio.
   - **Escape hatches:** Low-level enough that serious teams stay; Deep Agents for high-level.
5. **README first screen (LangGraph):** “Low-level orchestration framework for building stateful agents”; trust logos; `pip install -U langgraph`; bullet list: durable execution, HITL, memory, LangSmith, deployment.
6. **Killer demo:** Minimal graph with a tool node + checkpoint; interrupt/resume. Time-to-aha is “my agent survived a crash.”
7. **Lessons for jev-harness:**
   - **Do:** Emphasize *control plane* concerns (gates, shadow, resume semantics) the way LangGraph emphasizes durability/HITL.
   - **Do:** Pair OSS with an observability story (even if logs → user sink).
   - **Don’t:** Compete on “every integration”; LangChain already won glue.
   - **Don’t:** README that only lists abstractions—lead with failure modes you prevent (low confidence, unintended side effects).

---

### 3. `lastmile-ai/aiconfig` — 1,087★

1. **What it is:** Config-based framework to build generative AI applications (prompts/models as versioned config).
2. **Stars / growth:** ~1.1k★; last meaningful push ~2026-02; weak relative to peers. Right *idea* (prompt/config as artifact), wrong era timing vs. SDKs that absorbed config.
3. **Job it owns:** “Treat prompts/models like deployable config, not buried strings.”
4. **Why it didn’t fully win (useful negative case):**
   - **DX lost to code-first SDKs** (Vercel AI, Pydantic AI, Instructor) that keep types in-language.
   - **Demo wasn’t visceral**—config files don’t screenshot well vs. browser agents.
   - **Category got eaten** by eval tools + prompt management SaaS + Git-based prompt files.
   - **Distribution thin** vs. Stanford/Microsoft/Vercel brands.
   - **Abstraction too early/narrow** before “harness” vocabulary crystallized.
5. **README first screen:** Quickstart for VS Code + `pip`/`npm` install; config-centric workflow.
6. **Killer demo:** Edit YAML/JSON config, run same app against another model—nice, but not addictive.
7. **Lessons for jev-harness:**
   - **Do:** Keep recipes as *code + catalog* (you already have `catalog.ts`) rather than opaque remote config.
   - **Don’t:** Bet the README on “config framework” branding alone.
   - **Do:** Version recipes/fixtures in git so “config as code” is a property, not the product name.

---

### 4. `guardrails-ai/guardrails` — 7,427★

1. **What it is:** Library for adding validators/rails around LLM inputs and outputs.
2. **Stars / growth:** Mid-tier (~7.4k★) since 2023-01; still maintained (push 2026-09) but not a breakout. 2026 README news: validators moving to plain PyPI packages; remote inferencing discontinued.
3. **Job it owns:** “Stop bad/structured-wrong outputs from reaching production.”
4. **Why it partially won / stalled:**
   - **Clear itch** (safety + schema) early in ChatGPT boom.
   - **Lost structured-output war** to provider native JSON schema, Instructor, Outlines, OpenAI Structured Outputs.
   - **Safety market fragmented** into promptfoo red-team, vendor moderation, and app-level policy.
   - **Operational friction** (hub/remote inference) hurt DX vs. local validators.
   - **Still valuable as vocabulary:** “rails” / validators remain the mental model.
5. **README first screen:** News/migration banner + `pip install guardrails-ai` — currently leads with *change risk*, not magic demo.
6. **Killer demo:** Wrap a generation with validators; fail → reask. Solid, not viral.
7. **Lessons for jev-harness:**
   - **Do:** Make confidence gates and `onLowConfidence` the *native* rail (you already do)—this is closer to product truth than post-hoc string validators.
   - **Don’t:** Build a giant validator marketplace; ship a few sharp policies (review / escalate_llm / suppress / shadow).
   - **Do:** Keep install path boring (`npm i`) and local-first.

---

### 5. Structured generation cluster

#### `dottxt-ai/outlines` — 15,827★
1. **What:** Structured Outputs via constrained decoding (regex/CFG/JSON).
2. **Stars:** ~15.8k★; active through 2026-09.
3. **Job:** “Guarantee the tokens obey a schema.”
4. **Why it won (niche):** Correctness at decode-time; strong for local/open models; clear scientific brand (dottxt).
5. **README:** “Building the future of structured generation”; partner/enterprise tone + connect-to-model steps.
6. **Demo:** Schema → guaranteed JSON. Fast aha for ML engineers.
7. **Lessons:** Guarantee structure *below* the harness when needed; jev already assumes typed Choice/Score/Noul—lean on that guarantee in marketing.

#### `guidance-ai/guidance` — 21,760★
1. **What:** A guidance language for controlling LM generation (interleaved prompts + constraints).
2. **Stars:** ~21.8k★ (early 2022-11 Microsoft-adjacent wave); push quieter by mid-2026.
3. **Job:** Fine-grained control over generation programs.
4. **Why it won then / faded as default:** Early DX novelty; later absorbed by tool-calling + JSON mode + agent SDKs.
5. **README:** Install + multi-backend story first.
6. **Demo:** Prompt programs with guaranteed sections.
7. **Lessons:** Novel DSL helps launch; long-term winners wrap *idiomatic host language* (Python/TS), not a new language—jev-harness’s TS API is the right bet.

#### `instructlab/instructlab` — 1,416★
1. **What:** CLI workflow: taxonomy → synthetic data → train/chat custom models (`ilab`).
2. **Stars:** Low (~1.4k); community-thank-you README tone; not a product harness for app loops.
3. **Job:** Customize models with community knowledge (Red Hat/IBM line).
4. **Why limited for “harness” comparison:** Training-loop adjacent, not runtime decision harness.
5. **Lessons:** Don’t confuse *model improvement pipelines* with *runtime policy harnesses*; jev-harness is runtime.

#### Peer: `567-labs/instructor` — 13,915★
- README killer line: “Get reliable JSON from any LLM” + 15-line Pydantic example. Cross-sells to PydanticAI for agents. **Lesson:** One screenful to first structured object.

---

### 6. Eval cluster

#### `openai/evals` — 19,472★
1. **What:** Early framework + registry for evaluating LLMs/systems.
2. **Stars:** ~19.5k★ but README now pushes **OpenAI Dashboard evals**; git-lfs heavy local path.
3. **Job:** Benchmark/regression culture for prompts & models.
4. **Why it mattered:** Normalized “evals as engineering”; brand halo. Why it ceded CLI mindshare: friction + platform absorption.
5. **Lessons:** Registry/fixtures matter; UX must be `one command`. Your `jev-eval` CLI is strategically correct—keep it lighter than openai/evals’ LFS era.

#### `promptfoo/promptfoo` — 25,240★
1. **What:** Declarative evals + red teaming/pentest for LLM apps; CI-native; TypeScript.
2. **Stars:** ~25.2k★; very active; **Promptfoo now part of OpenAI**, remains MIT OSS (per README).
3. **Job:** “Stop shipping prompt/agent regressions and security holes.”
4. **Why it won:**
   - **CLI DX:** `promptfoo init` → `eval` → `view` in minutes.
   - **Visual matrix** of prompt×provider (screenshotable).
   - **Expanded job** into red team (security buyers).
   - **CI/CD** as distribution into existing engineering habits.
   - **TS/Node** home where many app teams live (same as jev-harness).
5. **README first screen:** One-line job (“Stop trial-and-error”); install; getting-started example; OpenAI acquisition note.
6. **Killer demo:** Side-by-side model comparison in web viewer + failing red-team finding.
7. **Lessons for jev-harness:**
   - **Do:** Make `jev-eval` + fixtures the default “prove the policy” path; show a matrix/table of state→action.
   - **Do:** Speak CI language (exit codes, golden fixtures).
   - **Don’t:** Only document happy-path `harness.run`; show a failing low-confidence case in the first screenful.

#### `confident-ai/deepeval` — 18,313★
1. **What:** “The LLM Evaluation Framework” — metrics library + Confident AI cloud.
2. **Stars:** ~18.3k★; Colab badge; pytest-flavored DX.
3. **Job:** Metric batteries (faithfulness, hallucination, etc.) for RAG/agents.
4. **Why it won:** Ready-made metrics + familiar test runner feel + SaaS upsell.
5. **Lessons:** Offer **opinionated metrics for your domain** (decision accuracy, gate rate, shadow disagreement)—not 50 generic NLP scores.

---

### 7. Computer / browser use harnesses

#### `browser-use/browser-use` — 114,991★
1. **What:** Agents that use the browser (Playwright + LLM loop).
2. **Stars / growth:** Category rocket—~115k★ from Oct 2024; 10k→50k in ~3 months (early 2025). Companion `browser-use/browser-harness` (~17.6k★, created 2026-04) literally brands “harness.”
3. **Job:** “Do real multi-step work on the live web.”
4. **Why it won:**
   - **Visceral demo** (book a driving test / CAPTCHA narrative + GIFs).
   - **One Agent API:** `Agent(task=..., llm=...).run()`.
   - **Timing:** Peak agent hype + computer-use announcements.
   - **Benchmarks** (WebVoyager / Odysseys claims) for credibility.
   - **Cloud + OSS ladder** + skill/CLI for coding agents.
5. **README first screen:** Hero art, “Navigate the web like a human does,” concrete scenario, demo media—then code.
6. **Killer demo:** One task string → watch the browser. Sub-5-minute dopamine.
7. **Lessons:**
   - **Do:** Lead with a *concrete operational scenario* (alert gate, ticket triage)—not “framework.”
   - **Do:** Offer a dead-simple constructor (`new DecisionHarness()`).
   - **Don’t:** Expect stars without a demo that non-ML people understand.
   - **Note:** Your job is *decision gating*, not browser control—borrow demo craft, not scope.

#### `browserbase/stagehand` — 24,323★
1. **What:** SDK for agents to extract/interact with any site (TS-first, also Python/Go); Playwright for agents.
2. **Job:** Reliable browser primitives (`act`/`extract`/`observe`) with typed schemas (Zod).
3. **Why it won:** Positions vs Playwright (“built for agents”); Browserbase distribution; TypeScript home.
4. **README:** Logo, one strong sentence, cookies-persist code sample immediately.
5. **Lessons:** TS + Zod-shaped examples convert app engineers; jev should keep TS examples pristine.

#### `Skyvern-AI/skyvern` — 23,022★
1. **What:** Vision-LLM browser workflow automation + no-code builder (AGPL).
2. **Job:** Replace brittle RPA/XPath with resilient web workflows.
3. **Why it won:** GIF-heavy README, clear RPA replacement story, swarm-of-agents diagram.
4. **Lessons:** License (AGPL) can limit enterprise OSS adoption—MIT helps jev; show before/after reliability.

#### `anthropics/claude-quickstarts` (`computer-use-demo`) — 17,690★ (monorepo)
1. **What:** Official reference agent loop: Docker desktop + Claude computer tools + Streamlit UI; plus best-practices / browser-use demos.
2. **Job:** Teach the *canonical* plan-act-observe computer-use loop and safety caveats.
3. **Why it matters:** Legitimizes harness patterns (bounds, sandbox, confirmations, trajectory recording). Not a general product framework—**reference architecture as marketing**.
4. **Killer demo:** `docker run ... computer-use-demo-latest` → VNC/Streamlit.
5. **Lessons:**
   - **Do:** Publish a minimal reference loop (state→questions→policy→action) people can copy.
   - **Do:** Document failure/safety modes up front (Anthropic’s CAUTION block is a trust signal).
   - **Don’t:** Rely only on a mega-demo container if `npm` example can carry the aha.

---

### 8. `vercel/ai` (AI SDK) — 26,814★

1. **What it is:** Provider-agnostic TypeScript toolkit for AI apps/agents (streaming UI, generateText, tools) from the Next.js creators.
2. **Stars / growth:** ~26.8k★ since 2023-05; enormous *downstream* distribution via Vercel/Next.
3. **Job it owns:** “Ship AI features in my web app with streaming UX and one API.”
4. **Why it won:**
   - **Channel power:** Next.js / Vercel default path.
   - **UI-first killer feature:** streaming React hooks / generative UI.
   - **Unified provider string** + gateway story.
   - **Coding-agent skill** (`npx skills add vercel/ai`)—2026 distribution tactic.
   - **Abstraction sweet spot:** app DX, not research OS.
5. **README first screen:** Hero GIF; definition; `npm install ai`; unified `generateText({ model: '...' })`.
6. **Killer demo:** Streaming chat in a Next.js app in minutes.
7. **Lessons for jev-harness:**
   - **Do:** Stay TS-native; one `npm i` + 15-line example (you already mirror this).
   - **Do:** Consider a “skill” / Cursor rule pack for coding agents later.
   - **Don’t:** Try to own streaming UI; integrate *with* AI SDK users as the decision layer behind tools/routes.
   - **Do:** Provider-agnostic *decision* API while Jev is the engine (similar to their model string swap).

---

### 9. `pydantic/pydantic-ai` — 20,015★

1. **What it is:** Typed Python AI SDK / agent loop—“How Python does AI”; explicit **Harness** sibling package for long-running capabilities.
2. **Stars / growth:** ~20k★ from 2024-06; topics include `harness`, `harness-engineering`. `pydantic/pydantic-ai-harness` (~898★, 2026-03) names the category outright.
3. **Job it owns:** End-to-end typed agents (tools, realtime, embeddings) with production interfaces (CLI, web, durable queues).
4. **Why it won:**
   - **Brand transfer** from Pydantic (already in every Python AI stack).
   - **Types as DX** (IDE autocomplete, validation)—same reason Instructor exploded.
   - **Honest layering:** core agent vs. harness capabilities (memory, subagents, compaction, coder).
   - **100% coverage / quality signaling** on README badges.
   - **Timing:** Post-LangChain fatigue → “just Python” appetite.
5. **README first screen:** “How Python does AI”; agents/voice/images/embeddings; points to Harness for complex work; `uv add pydantic-ai`.
6. **Killer demo:** Typed agent with tools in a page of code; optional coding agent profile.
7. **Lessons for jev-harness:**
   - **Do:** Steal the word **harness** in public positioning the way Pydantic now does—category education helps you.
   - **Do:** Separate core `DecisionHarness` from capability packs/recipes (you already have recipes/).
   - **Don’t:** Boil the ocean into voice/embeddings; stay the decision/control plane.
   - **Do:** Badge quality (types, tests, node engine) prominently.

---

### 10. Multi-agent / swarm-style

#### `crewAIInc/crewAI` — 58,713★
1. **What:** Role-playing multi-agent orchestration (Crews) + event-driven Flows.
2. **Job:** “Spin up a team of specialist agents for a business workflow.”
3. **Why it won:** Narrative UX (roles/crews humans understand); aggressive content/community; high-level fast path + lower-level Flows; cloud trial ladder.
4. **README:** Logo wall, stars badges, “Fast and Flexible Multi-Agent Automation.”
5. **Demo:** Define agents/tasks/crew → `kickoff()`.
6. **Lessons:** Anthropomorphic demos sell; for jev, map to *roles in a decision pipeline* (propose → judge → gate) without claiming full multi-agent OS. **Don’t** chase crew theater if your wedge is calibrated confidence.

#### `microsoft/autogen` — 61,026★
1. **What:** Multi-agent programming framework; README shows **maintenance mode** badge; community continuation via `ag2ai/ag2` (~4.9k★).
2. **Job:** Conversational multi-agent apps (autonomous or with humans).
3. **Why it won then:** Microsoft distribution + early multi-agent demos (2023). **Cautionary tale:** stars ≠ ongoing product clarity after rewrite/split.
4. **Lessons:** Avoid confusing renames/splits early; keep one obvious entrypoint. Stars can be lagging indicators.

#### `openai/swarm` → `openai/openai-agents-python` — 21,987★ / 29,528★
1. **What:** Swarm = educational ergonomic multi-agent handoffs; Agents SDK = production evolution (routines, handoffs, guardrails, tracing).
2. **Job:** Lightweight multi-agent workflows without a heavy framework.
3. **Why Swarm “won” culturally:** Tiny API + OpenAI brand + “educational” honesty. Agents SDK keeps the spirit with production features.
4. **README honesty:** Swarm banner says *go use Agents SDK*.
5. **Lessons:**
   - **Do:** Prefer a *small* core API people memorize.
   - **Do:** Be honest about maturity (shadow mode, evals).
   - **Don’t:** Ship a toy and leave users stranded—plan the production path (you: live/shadow + eval CLI).

#### Peer worth watching: `OpenHands/OpenHands` (~88k★), `camel-ai/camel` (~17.7k★), `BerriAI/litellm` (~59k★)
- OpenHands = coding-agent product loop (harness for software work).
- LiteLLM = gateway (cost/routing/guardrails)—infrastructure adjacent to harnesses.
- Relevance: **the winning “harness” is often domain-shaped** (browser, coding, decisions)—not universal.

---

## Cross-cutting patterns (what actually correlated with success)

| Pattern | Evidence | Implication for jev-harness |
|---|---|---|
| One-sentence job | browser-use, promptfoo, Instructor, DSPy | Keep “confidence-gated decisions” as the only job |
| Time-to-first-success < 5 min | AI SDK, Instructor, promptfoo init, Swarm | Protect the README quick start; one env var |
| Visceral or visual demo | browser-use GIFs, promptfoo matrix, Skyvern | Add a ticket-triage before/after (live vs shadow) gif/asciinema |
| Host-language idioms | Pydantic AI, Vercel AI, Stagehand TS | Stay idiomatic TypeScript; Zod-like clarity via Choice/Score/Noul |
| Eval/CI as product | promptfoo, deepeval, DSPy optimizers | `jev-eval` + fixtures are a growth feature, not an afterthought |
| Control-plane features | LangGraph durability/HITL; Anthropic bounds; your shadow/gates | Market failure modes you prevent |
| Distribution channel | Vercel, Microsoft, OpenAI, Stanford, Pydantic | Lean on TypeSafe/Jev brand; publish recipes people copy |
| Category naming | Pydantic “Harness”, browser-harness | Use “decision harness” consistently in OSS SEO |
| Negative: config-only / DSL-only | aiconfig, guidance aging | Don’t invent a new language; recipes-as-code |

---

## Ranked list: What people actually want from a harness in 2026

Ranked by observed demand (stars × velocity × discourse in harness-engineering writing), not by academic purity:

1. **A bounded plan–act–observe loop that always terminates**  
   Max steps, cost/token budgets, stop conditions (LangGraph durability, Anthropic computer-use practices, harness-engineering handbooks).

2. **Tools that are typed, validated, and permissioned**  
   Schema-safe args/results; approval gates for side effects (Agents SDK guardrails, Stagehand/Zod extract, Instructor/Pydantic).

3. **Deterministic structure where it matters**  
   Structured outputs / typed decisions so the rest of the program can be normal software (Outlines, Instructor, Jev Choice/Score/Noul).

4. **Human-in-the-loop and safe defaults for irreversible actions**  
   Interrupts, confirmations, sandboxing (LangGraph HITL, computer-use CAUTION patterns).

5. **Shadow / dry-run / trajectory recording**  
   Observe intended actions without committing; replay traces (jev shadow mode; Anthropic trajectory recording; LangSmith traces).

6. **Evals as engineering, not slides**  
   Fixtures, CI exit codes, behavioral assertions on tools/actions, regression on policy changes (promptfoo, deepeval, Google “behavioral evals”, DSPy metrics).

7. **Observability: traces over chat transcripts**  
   Step logs with tool I/O, tokens, cost, gate decisions (LangSmith, Pydantic/Logfire adjacency, harness handbooks: “believe the trace”).

8. **Domain-shaped first success**  
   Browser task, coding agent, or *decision gate*—not “build anything” (browser-use, OpenHands, Crew narrative—but winners are specific).

9. **Provider portability without rewriting the app**  
   Model/string swap (AI SDK, LiteLLM, DSPy LM config)—engine behind the harness can move.

10. **Composable recipes / capabilities, not a monolith**  
    Packaged patterns (Crew templates, Pydantic harness capabilities, jev recipes catalog) with a tiny core API.

11. **Red-team / abuse resistance for anything user-facing**  
    Prompt injection & policy tests (promptfoo red team)—especially if the harness can act.

12. **Distribution into existing workflows**  
    npm/PyPI, CI, coding-agent skills, Docker reference—not a new IDE unless you must.

---

## Direct takeaways for `jev-harness`

**Already aligned with winners**
- Tiny core API (`DecisionHarness.run`) ≈ Swarm/Instructor simplicity.
- Explicit control plane: confidence gate, `onLowConfidence`, shadow mode ≈ 2026 harness discourse.
- Recipes + eval CLI ≈ promptfoo/DSPy “prove it” culture.
- TypeScript + sharp slogan ≈ Vercel AI / Stagehand audience.

**Do next (from this landscape)**
1. Make the README first screen show **live vs shadow** and a **failing low-confidence → review** path (promptfoo/Anthropic honesty pattern).
2. Publish 1–2 **gif/asciinema** operational demos (alert-gate, ticket triage)—browser-use lesson without browser scope.
3. Treat **`jev-eval` fixtures as the growth loop**; show a comparison table in docs (state → intended action → gated action).
4. Keep saying **decision harness**; the word is now mainstream (Pydantic AI Harness, browser-harness).
5. Partner mentally with **AI SDK / LangGraph users** as upstream proposers; you own the gate.

**Don’t**
- Expand into general multi-agent crews or browser RPA (Crew/browser-use already own dopamine).
- Bet on config-file frameworks (aiconfig cautionary tale).
- Dilute into training/taxonomy pipelines (InstructLab).
- Let stars envy dictate scope—**category clarity beats umbrella frameworks** in 2026.

---

## Sources

- GitHub REST via `gh api repos/...` (star counts, timestamps, licenses) on 2026-09-17/18 EDT.
- README first-screens via `gh api repos/.../readme` (base64 Contents API).
- WebSearch: DSPy review/star history; browser-use growth (GitStarClub / SkillPack); harness-engineering handbook & Google Developers “Anatomy of Harness Engineering.”
- Local repo context: `/workspace/jev-harness/README.md`, `package.json`, `recipes/`, `examples/`.

*End of Storm A research note.*
