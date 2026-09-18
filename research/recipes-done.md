# Recipes work log

**When:** 2026-09-17 ~21:15 EDT  
**Status:** Stopped expanding provisional vertical folders per steering. Waiting on `research/taxonomy.md`. Build: `npm run build` passes.

## Steering applied
- Do **not** invent final category folder names until empirical taxonomy lands.
- Pre-baked folders noted in `recipes/PENDING.md` (reorganization pending).
- Only **API-agnostic shapes** added under `recipes/emergent/` for now.

## Emergent shapes (primary deliverable this turn)
| File | Shape |
|------|--------|
| `recipes/emergent/candidate-action-select.ts` | Choice over dynamic candidates + stop Noul (milindlabs computer-use / perception-then-decide) |
| `recipes/emergent/row-semantic-match.ts` | Noul/Score per JSON row vs NL predicate; batch filter helper documented in comment (Postgres `jev(row, predicate)`) |
| `recipes/emergent/README.md` | 2-bullet parking-lot notes |

## Pending / taxonomy
| File | Purpose |
|------|---------|
| `recipes/PENDING.md` | Declares `agents/`, `ops/`, `guardrails/` (and any vertical stubs) provisional until `research/taxonomy.md` |

## Wired into package exports
- Updated `recipes/index.ts` — re-exports emergent runners + prior ops/agents/guardrails exports + catalog helpers.
- Updated `recipes/catalog.ts` — `RecipeCategory` includes `"emergent"`; entries for `candidate-action-select` and `row-semantic-match`.

## Pre-existing / earlier provisional tree (not expanded further)
These were already on disk from earlier work this session; left compiling but **not** treated as final taxonomy:

```
recipes/agents/model-router.ts
recipes/agents/tool-picker.ts
recipes/agents/stop-or-continue.ts
recipes/agents/browser-next-action.ts
recipes/agents/README.md
recipes/ops/alert-gate.ts
recipes/ops/inbox-triage.ts
recipes/ops/incident-severity.ts
recipes/ops/oncall-page.ts
recipes/ops/README.md
recipes/guardrails/llm-verifier.ts
recipes/guardrails/injection-check.ts
recipes/guardrails/tool-call-allowlist.ts
recipes/guardrails/rubric-scorer.ts
recipes/guardrails/README.md
recipes/catalog.ts
recipes/index.ts
```

## Type fixes for `EntryType` / JsonValue
- `recipes/ops/alert-gate.ts` — `AlertEventState` as type + spread cast to `EntryType`
- `recipes/ops/incident-severity.ts` — Json-safe metrics + `EntryType` cast
- `recipes/guardrails/tool-call-allowlist.ts` — Json-safe args + `EntryType` cast
- `recipes/emergent/row-semantic-match.ts` — Json-safe row + `EntryType` cast

## Not done (blocked on taxonomy)
- Wide vertical folders (`support/`, `growth/`, `commerce/`, …) and their recipe matrices from the original brief.
- Full catalog `{id, category, title, summary, whenToUse}` reshape — current catalog uses the richer provisional schema already in-tree; emergent entries added to that schema.

## Next
1. Consume `research/taxonomy.md` when research agents publish it.
2. Move `emergent/*` into empirical categories; reorganize provisional folders.
3. Expand catalog fields if taxonomy asks for `title` / `summary` / `whenToUse`.
