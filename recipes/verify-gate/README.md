# verify-gate

**Shape:** Verdict over (request, model output, tool call, content, diff) — allow/revise/block, grounded?, injection?, irreversible?

**Equation:** bad ships / irreversible exec / poisoned context = **$ + recovery latency**.

Recipes: `llm-verifier`, `ship-gate` (proof: suppress on low confidence), `injection-check`, `tool-call-allowlist`., `edge-content-mod`
