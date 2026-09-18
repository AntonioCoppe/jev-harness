# Recipes remapped to empirical taxonomy

**Status: remapped** (2026-09-17 ET).

Folders under `recipes/` now use stable category IDs from `research/taxonomy.md` — not the provisional `agents/` / `ops/` / `guardrails/` / `emergent/` labels.

| Folder | Contents |
|---|---|
| `candidate-action-selection/` | candidate-action-select, browser-next-action, tool-picker, stop-or-continue |
| `row-judgment/` | row-semantic-match |
| `confidence-front-door/` | model-router, alert-gate, inbox-triage, incident-severity, oncall-page |
| `verify-gate/` | llm-verifier, injection-check, tool-call-allowlist |
| `composite-rubric/` | rubric-scorer |
| `live-multi-judgment/` | stub (no recipes yet) |
| `high-freq-reflex/` | stub (no recipes yet) |

`semantic-find/` not created — no existing recipe mapped cleanly (rank-among-candidates vs row-filter).

See `research/remap-done.md` for before→after paths. Catalog `category` values match taxonomy IDs.
