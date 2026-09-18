# Recipes remapped to empirical taxonomy

**Status: remapped** (2026-09-17 ET); C/G/H stubs added.

Folders under `recipes/` use stable category IDs from `research/taxonomy.md`.

| Folder | Contents |
|---|---|
| `candidate-action-selection/` | candidate-action-select, browser-next-action, tool-picker, stop-or-continue |
| `row-judgment/` | row-semantic-match (+ batch helpers) |
| `confidence-front-door/` | model-router, alert-gate, inbox-triage, incident-severity, oncall-page |
| `verify-gate/` | llm-verifier, injection-check, tool-call-allowlist |
| `composite-rubric/` | rubric-scorer |
| `live-multi-judgment/` | typewriter-panel, ticket-fanout |
| `semantic-find/` | line-semantic-find, span-pick |
| `high-freq-reflex/` | mm-buy-sell, hot-path-allow |

See `research/remap-done.md` for before→after paths. Catalog `category` values match taxonomy IDs.
