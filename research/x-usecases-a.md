# TypeSafe / Jev / System One — concrete use cases from X + mirrors

**Collected:** Thu Sep 17, 2026 (America/Toronto)  
**Method note:** `user-X` MCP hit monthly spend-cap (403). Posts fetched via `https://api.fxtwitter.com/...` + public writeups/GitHub. Categories = **empirical clusters** from `taxonomy.md` (not agents/guardrails/ops…).

**People:** `@typesafeai` (org), `@CompleteSkeptic` (Diogo Almeida, CEO). Seed experiments: `@milindlabs`, `@iam_zachi`, `@gregpr07`, `@stevekrouse`, `@identityTorn`, `@iamMrDuncan`.

---

## Use cases found

### 1. On-device UI element picker (CoreML → OCR → Jev)
- **Description:** Segment buttons locally, OCR labels, send only text to Jev; pick best element; click; re-detect; loop (~90ms/decision).
- **Cluster:** A — Perception→Choice→loop
- **Source:** https://x.com/milindlabs/status/2100631847155994852
- **Username:** milindlabs
- **Why Jev vs LLM:** Needs a typed distribution over a *dynamic* candidate set every frame; no screenshots/LLM/pixels leave the machine.

### 2. Postgres `jev()` natural-language row filter
- **Description:** SQL UDF judges each row against an NL predicate (`could work from home`); 129 rows ~1s / $0.0009; cache hit 6ms.
- **Cluster:** B — Map NL over items
- **Source:** https://x.com/iam_zachi/status/2100679300756435135
- **Username:** iam_zachi
- **Why Jev vs LLM:** Per-row boolean/score at SQL-scale cost; no embeddings/index; LLM would dominate latency/cost per row.

### 3. Browser Use indexed DOM flight booker
- **Description:** Each step: DOM → numbered elements; one Jev call picks operation + target; small LLM only for TYPE_TEXT; Zürich–London 7.1s / $0.0039.
- **Cluster:** A — Perception→Choice→loop
- **Source:** https://x.com/gregpr07/status/2100411066966749359 · https://github.com/browser-use/jev-ultrafast
- **Username:** gregpr07
- **Why Jev vs LLM:** Speculative fan-out of ops×targets; vision/LLM-per-step is the bottleneck being replaced.

### 4. Mac computer-use via OCR (no screenshot to frontier model)
- **Description:** Deterministic OCR → Jev next-action Choice; writing model only for free text; ~$0.0002/decision.
- **Cluster:** A — Perception→Choice→loop
- **Source:** https://github.com/awlevin/typesafe-computer-use (community showcase)
- **Username:** awlevin (repo); discussed in launch-week roundups
- **Why Jev vs LLM:** Most steps are “which of these?” not “plan from pixels”; dates/arithmetic rebuilt in code.

### 5. Live typewriter with 16 parallel judgments
- **Description:** As text changes, update ~16 typed Scores/Nouls in the UI (Val Town demo).
- **Cluster:** C — Live multi-judgment
- **Source:** https://x.com/stevekrouse/status/2100287368221659289 · https://typesafe-demo.val.run/
- **Username:** stevekrouse
- **Why Jev vs LLM:** Sub-second parallel structured answers; generation would lag and invent prose.

### 6. Internal high-volume classifier substitute
- **Description:** Zero-shot Jev within ~5pts recall of private fine-tuned Qwen at matched precision; ~$70/mo full volume, sub-second.
- **Cluster:** D — Confidence front door
- **Source:** https://x.com/identityTorn/status/2100475121324728615
- **Username:** identityTorn
- **Why Jev vs LLM:** Production classify economics + latency; still trails fine-tune slightly on their private set.

### 7. Qwen-on-Cerebras structured-output baseline vs Jev
- **Description:** Side-by-side decision-quality/cost video + open benchmark repo.
- **Cluster:** D / eval (supports front-door economics)
- **Source:** https://x.com/iamMrDuncan/status/2100467548298899918 · https://github.com/iammrduncan/typesafe-ai-benchmark
- **Username:** iamMrDuncan
- **Why Jev vs LLM:** Same interface shape; Jev cheaper and edged their Qwen 27B structured baseline.

### 8. Research-paper topic labeling at corpus scale
- **Description:** Summarize with cheap LLM; classify 1,018 papers into 24 topics with Jev for $0.08 (median ~256ms).
- **Cluster:** B — Map NL over items
- **Source:** Reported https://dev.to/valyuai/how-to-use-jev-a-practical-guide-to-typesafes-system-one-model-g5e (Hassan El Mghari / 1kpapers thread)
- **Username:** (Hassan El Mghari — thread cited in writeup)
- **Why Jev vs LLM:** Separation of generate vs label; labeling bill is pennies.

### 9. Mass listing / catalog classification
- **Description:** ~98k listings classified in ~10 minutes (early self-report).
- **Cluster:** B — Map NL over items
- **Source:** Same DEV launch-week roundup
- **Username:** community (anonymous in roundup)
- **Why Jev vs LLM:** Throughput + free output for label-shaped work.

### 10. Semantic code search (“Every”)
- **Description:** Ask a yes/no of every function; rank by probability.
- **Cluster:** B / G — Map + semantic find
- **Source:** https://github.com/sufianetaouil/every
- **Username:** sufianetaouil
- **Why Jev vs LLM:** Repo-wide map of Nouls cheaper than embedding index + LLM judge.

### 11. Staged PR / code review metrics
- **Description:** Risk matrix → file profiles → evidence → severity → route; dashboard of Scores/Nouls.
- **Cluster:** E — Verify/gate artifact
- **Source:** https://github.com/devagrawal09/jev-review
- **Username:** devagrawal09
- **Why Jev vs LLM:** Independent quality dimensions + confidence, not a free-form review essay.

### 12. Coding-agent shell / tool irreversibility gate
- **Description:** Before exec, classify command read-only / reversible / irreversible; low confidence → ask human.
- **Cluster:** E — Verify/gate artifact
- **Source:** Documented experiment in https://flaviocopes.com/jev/ (shadow `rm -rf` 0.56 @ conf 0.33)
- **Username:** community / Flavio Copes field note
- **Why Jev vs LLM:** Confidence channel is the product; wrong discrete label without conf is dangerous.

### 13. Pi / agent harness policy reflexes
- **Description:** Shadow tool-call gates, injection screens, loop detection, risky-diff flags (Bicameral, pi-warden, jev-axi).
- **Cluster:** E — Verify/gate artifact
- **Source:** https://github.com/AbdelStark/bicameral · https://github.com/DevMortimer/pi-warden · https://github.com/shiftynick/jev-axi
- **Username:** AbdelStark / DevMortimer / shiftynick
- **Why Jev vs LLM:** Typed hold/steer returned to agent loop without chatting.

### 14. Helpdesk / intent triage cascade
- **Description:** Choice(intent) + Score(complexity) → pure lookup vs specialist LLM vs human.
- **Cluster:** D — Confidence front door
- **Source:** Console playground + https://dev.to/valyuai/how-to-use-jev-a-practical-guide-to-typesafes-system-one-model-g5e Pattern 4
- **Username:** typesafeai (official patterns)
- **Why Jev vs LLM:** Most tickets never need generation; confidence decides automation.

### 15. Model-tier router
- **Description:** Route prompt to cheap/mid/frontier by difficulty + wrong-answer cost Score.
- **Cluster:** D — Confidence front door
- **Source:** Vercel AI Gateway notes + harness recipes; https://vercel.com/changelog/typesafe-ai-jev-now-available-on-ai-gateway
- **Username:** typesafeai / vercel
- **Why Jev vs LLM:** Router itself must be cheaper/faster than the models it selects.

### 16. Resume / hiring rubric scoring
- **Description:** Multi-Score depth of skills vs job posting; escalate low confidence.
- **Cluster:** F — Composite rubric
- **Source:** TypeSafe Playground example; cost note in Flavio writeup
- **Username:** typesafeai
- **Why Jev vs LLM:** Rubric-aligned Scores + weights in code; claimed ~1/10 small-LLM cost.

### 17. Ticket priority composite
- **Description:** severity × frustration × report_quality Scores → weighted priority.
- **Cluster:** F — Composite rubric
- **Source:** https://flaviocopes.com/jev/
- **Username:** (pattern writeup)
- **Why Jev vs LLM:** Re-weight without re-prompt; atomic dimensions avoid muddled single questions.

### 18. Podcast / claim verification against transcript
- **Description:** LLM writes summary; Noul per claim vs transcript; flag low-probability claims.
- **Cluster:** E — Verify/gate artifact
- **Source:** Proposed workflow in Flavio / TypeSafe citation cookbooks
- **Username:** community proposal
- **Why Jev vs LLM:** Generate then verify; verify must be << generate cost.

### 19. RAG passage filter / citation support check
- **Description:** Retrieve wide; Noul relevance (and injection) per passage; citation_check cookbook.
- **Cluster:** B + E
- **Source:** https://docs.typesafe.ai/concepts/use-case-map.md · cookbooks cited in skill
- **Username:** typesafeai
- **Why Jev vs LLM:** Filter cost < tokens saved in context window.

### 20. Semantic find / rank candidates (no embeddings)
- **Description:** Choice over ≤250 candidate ids for NL query + Noul “exists answer?”.
- **Cluster:** G — Semantic find/rank
- **Source:** https://glama.ai/mcp/servers/jkudish/jev-mcp (jev_find) · semantic_find cookbook
- **Username:** jkudish / typesafeai
- **Why Jev vs LLM:** No index maintenance; anti-false-top-hit via exists Noul.

### 21. Literature inclusion screening (RCT / outcome / evidence strength)
- **Description:** Retrieve papers; per-paper Noul/Score fan-out for inclusion criteria.
- **Cluster:** B — Map NL over items
- **Source:** https://dev.to/valyuai/how-to-use-jev-a-practical-guide-to-typesafes-system-one-model-g5e Pattern 5
- **Username:** valyuai (writeup)
- **Why Jev vs LLM:** Systematic-review shaped questions at cents per paper.

### 22. Wikiracing / high-cardinality link choice
- **Description:** Each step choose among hundreds of links without inventing URLs; 2-stage score→choice if needed.
- **Cluster:** A — Perception→Choice→loop
- **Source:** https://typesafe.ai/blog/introducing-system-one-models-and-jev
- **Username:** typesafeai / CompleteSkeptic
- **Why Jev vs LLM:** Schema prevents hallucinated links; parallel Choice.

### 23. Doom / Mario / StarCraft structured-state controllers
- **Description:** Game telemetry → JSON state → legal action Choice at real-time rates.
- **Cluster:** A / H
- **Source:** TypeSafe Doom demo; https://github.com/fhshaik/typesafe-mario · https://github.com/phyous/tsai-sc
- **Username:** typesafeai · fhshaik · phyous
- **Why Jev vs LLM:** Control-loop latency; legal action set is enumerated.

### 24. Quadrotor tactical judgment (advisory only)
- **Description:** Classical CV → symbolic scene; Jev ~2.5Hz Choice(manoeuvre)+Score(risk)+Noul(target lost); code owns flight control.
- **Cluster:** A / H
- **Source:** https://github.com/RomanSlack/jev-drone
- **Username:** RomanSlack
- **Why Jev vs LLM:** Cannot be perception or control rate; narrow tactical judgment.

### 25. Market-maker buy/sell per block
- **Description:** Read order book; Jev buy/sell; post-only limit one tick inside; ~81ms model latency.
- **Cluster:** H — High-freq reflexes
- **Source:** https://github.com/jarrodwatts/jev-trader
- **Username:** jarrodwatts
- **Why Jev vs LLM:** Must fit ~300ms block; free output; decision not narrative.

### 26. Crowd / persona reaction simulator
- **Description:** Batched Jev probs (read/like/repost/block) across synthetic persona groups for a short post.
- **Cluster:** F — Composite / multi-judgment batch
- **Source:** https://crowdcheck-ai.vercel.app/ · listed in awesome-typesafe
- **Username:** community (Crowdcheck)
- **Why Jev vs LLM:** Thousands of typed reaction probs; not chat personas.

### 27. Home Assistant entity judgment sensors
- **Description:** Typed questions over HA entity state → sensors/actions with token budget.
- **Cluster:** D / A (state→decision)
- **Source:** https://github.com/AboveColin/HA-Jev
- **Username:** AboveColin
- **Why Jev vs LLM:** Automation needs values + cost caps; answers carry no explanation (author caveat: not for safety).

### 28. Smart-home / tool-picker without generative chat
- **Description:** Choice over tools + argument Choices from conversation candidates; ~300ms light-off demo.
- **Cluster:** A / D
- **Source:** TypeSafe interactive demos (launch); Flavio tool-picker recount
- **Username:** typesafeai
- **Why Jev vs LLM:** Pick card from deck (tools/args), don’t invent function calls.

### 29. Feed / post moderation by user-defined categories
- **Description:** Per-post Scores for rage-bait / crypto promo / political argument; hide high scores (browser extension idea).
- **Cluster:** B / F
- **Source:** Flavio Copes early-experiments section
- **Username:** community idea
- **Why Jev vs LLM:** User-owned criteria + volume; not a fixed platform classifier.

### 30. Feature extraction for classical ML
- **Description:** Autoresearch grows 18→38 questions; answers become numeric columns for CatBoost.
- **Cluster:** F / B
- **Source:** TypeSafe feature-discovery cookbook (cited in skill + Flavio)
- **Username:** typesafeai
- **Why Jev vs LLM:** Probabilistic features for supervised models; not end-to-end generation.

### 31. Sponsor / inbound form auto-triage
- **Description:** Noul(is sponsor?) + Choice(category including prohibited) + Score(specificity) → auto rate-card vs inbox.
- **Cluster:** D — Confidence front door
- **Source:** Concrete personal plan in https://flaviocopes.com/jev/
- **Username:** (Flavio Copes)
- **Why Jev vs LLM:** Form-scale judgments with explicit prohibited options and confidence gates.

### 32. Android Settings UI agent (bounded actions)
- **Description:** Choice over prevalidated UI actions with confidence gates + optional LLM planner.
- **Cluster:** A
- **Source:** https://github.com/Friedjof/jev-mobile
- **Username:** Friedjof
- **Why Jev vs LLM:** Per-step UI grounding with escalation; PoC vs Settings.

### 33. Rerank bench / spam zero-shot evals
- **Description:** Independent evals of Jev as reranker and spam detector vs baselines.
- **Cluster:** G / B (eval)
- **Source:** https://github.com/anessbelbati/jev-rerank-bench · https://github.com/bitnovus/jev-spam-eval
- **Username:** anessbelbati · bitnovus
- **Why Jev vs LLM:** Measures decision quality where embeddings/classifiers traditionally live.

### 34. Stealth-game guard judgments (HEIST//ONE)
- **Description:** Six guards get batched typed judgments; deterministic sim validates every proposal.
- **Cluster:** A / H
- **Source:** https://github.com/AbdelStark/heist-one
- **Username:** AbdelStark
- **Why Jev vs LLM:** Observable decision lens; code owns validation.

---

## Category frequency (empirical clusters)

| Cluster | Count in this list | Notes |
|---|---|---|
| **A Perception→Choice→loop** | 9 | milindlabs, browser-use, OCR CU, games, drone, mobile, tools, HEIST, wiki |
| **B Map NL over items** | 7 | postgres jev(), papers, listings, every, lit screen, moderation map, features |
| **E Verify/gate artifact** | 5 | shell gate, jev-review, agent reflexes, claim verify, RAG citation |
| **D Confidence front door** | 5 | classifier sub, cascade, model router, sponsor form, HA |
| **F Composite rubric** | 4 | resume, priority, crowdcheck, features |
| **G Semantic find/rank** | 3 | jev_find, rerank bench, (every overlap) |
| **H High-freq reflexes** | 3 | trader, doom rates, drone rate |
| **C Live multi-judgment** | 1 | typewriter |

**Top categories by frequency:** A (candidate-action loops), B (corpus/row NL filters), then E and D.

**Rejected as taxonomy axes:** agents, guardrails, ops, support, growth, commerce, trust-safety, rag, education, automation — see `taxonomy.md`.

---

## Seeds (drivers)

1. https://x.com/milindlabs/status/2100631847155994852 — UI candidate Choice loop  
2. https://x.com/iam_zachi/status/2100679300756435135 — Postgres NL row filter  

## Follow-ups when X MCP spend cap lifts
- `search_posts_all` relevancy queries from the brief  
- `get_posts_quoted_posts` on both seeds  
- `get_users_posts` for `@typesafeai` and `@CompleteSkeptic`
