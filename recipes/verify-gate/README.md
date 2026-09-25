# verify-gate

**Shape:** Verdict over (request, model output, tool call, **shell command**, content, diff) — allow/revise/block/ask, grounded?, injection?, irreversible?

**Equation:** bad ships / irreversible exec / poisoned context = **$ + recovery latency**.

Recipes: `llm-verifier`, `ship-gate` (proof: suppress on low confidence), `injection-check`, `tool-call-allowlist`, `shell-command-gate` (fx-style CLI string gate), `agent-stuck-drift` (Foreman-style stuck/drift/tests/progress), `pr-risk-gate` (jev-review-shaped PR/diff severity), `done-claim-check` (jev-belay-shaped Stop hook), `citation-support` (claim vs cited passage), `invoice-match-gate` (invoice vs PO/vendor/history), `edge-content-mod`.
