# High-signal seeds (empirical category drivers)

These two posts **must** shape taxonomy roots (see `taxonomy.md`). Verified via `https://api.fxtwitter.com/...`.

## 1. UI candidate action selection — computer use without LLM vision
- Source: https://x.com/milindlabs/status/2100631847155994852 (@milindlabs)
- fxtwitter: `https://api.fxtwitter.com/milindlabs/status/2100631847155994852`
- Pattern: classical perception proposes candidates → Jev returns distribution over them → act → loop
- Stack detail: on-device CoreML segmentation + OCR; only text labels sent to Jev; ~90ms/decision; no pixels leave device
- Harness shape: `Choice` (or ranked `Score`) over **dynamic** option set; optional `Noul` for goal-achieved/stop
- **Taxonomy IDs:** `candidate-action-selection` / `ui-grounding`
- Recipe: `recipes/emergent/candidate-action-select.ts`

## 2. Natural-language row judgment — semantic WHERE
- Source: https://x.com/iam_zachi/status/2100679300756435135 (@iam_zachi)
- fxtwitter: `https://api.fxtwitter.com/iam_zachi/status/2100679300756435135`
- Pattern: for each DB/JSON row, ask Jev whether it matches an NL predicate; no embeddings/index required
- Example: `WHERE jev(people, 'could work from home')` — 129 rows ~1s, then cached
- Harness shape: batched `Noul`/`Score` per row (+ confidence gate for include/exclude/review)
- **Taxonomy IDs:** `row-judgment` / `structured-data-filter`
- Recipe: `recipes/emergent/row-semantic-match.ts`

## Process rule
Categories are **clustered from evidence** (these seeds + further X/docs). Do not start from verticals like "support" or "growth", or from pre-baked recipe folders (`agents` / `ops` / `guardrails`), unless the evidence pile earns a harness-shape name.
