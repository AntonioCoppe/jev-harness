# Recipes remapped to empirical taxonomy

**Status: remapped** (2026-09-17 ET); crazy-fast packs stubbed / landed.

Folders under `recipes/` use stable category IDs from `research/taxonomy.md`.

| Folder | Contents |
|---|---|
| `candidate-action-selection/` | candidate-action-select, browser-next-action, tool-picker, stop-or-continue, esports-reflex |
| `row-judgment/` | row-semantic-match (+ batch helpers) |
| `confidence-front-door/` | model-router, alert-gate, inbox-triage, incident-severity, oncall-page, cyber-alert-triage |
| `verify-gate/` | llm-verifier, injection-check, tool-call-allowlist, ship-gate, shell-command-gate, agent-stuck-drift, edge-content-mod |
| `composite-rubric/` | rubric-scorer, swarm-consensus |
| `live-multi-judgment/` | typewriter-panel, ticket-fanout |
| `semantic-find/` | line-semantic-find, span-pick |
| `high-freq-reflex/` | mm-buy-sell, hot-path-allow, order-allow-deny, fraud-score-gate, rtb-bid-gate |
| `agent-comm-harness/` | who-speaks-next, tool-gate, tool-exec-gate, message-route, swarm-consensus re-export *(pack)* |
| `prediction-market-gate/` | prediction-market-gate *(high-freq-reflex shape)* |
| `sports-bet-gate/` | sports-bet-gate *(high-freq-reflex shape)* |
| `rtb-bid-gate/` | alias re-export → high-freq-reflex/rtb-bid-gate |

Crazy-fast map: `research/crazy-fast-decisions.md`. Catalog `category` values match taxonomy IDs.

**2026-09-18:** added `shell-command-gate` (verify-gate) + `keystroke-launcher` (candidate-action-selection) for weekend proof demos.

**2026-09-18 (ecosystem sync #1):** added `agent-stuck-drift` (verify-gate) — Foreman-shaped stuck/drift/tests/progress supervisor.
