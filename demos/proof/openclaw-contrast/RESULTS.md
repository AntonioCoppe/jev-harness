# OpenClaw contrast — BEFORE / AFTER

Honest wall-clock contrast for OpenClaw-style hot paths.
**Never invent numbers.** Missing BEFORE stays `pending Mac Claude CLI`.

## Protocol

| Side | Path | Notes |
|------|------|-------|
| **BEFORE** | Frontier LLM ≈ “normal OpenClaw” | Claude CLI `claude -p` tools off on Mac. This Linux box has no `claude` → skip + document. |
| **AFTER** | jev-harness recipes + `TYPESAFE_API_KEY` | Live TypeSafe Jev; stamped `MEASURED_LIVE`. |

Row-filter BEFORE is the only OpenClaw/LLM wall already measured (Mac Claude CLI).

## RESULTS

| Hot path | OpenClaw / LLM BEFORE | jev-harness AFTER | Source |
|----------|----------------------:|------------------:|--------|
| row-semantic-match | **48.856 s** (Claude CLI Mac, tools off) | **1257 ms** | BEFORE: `docs/assets/marketing/proof/measured.json` · AFTER: `demos/proof/multi/out/row-semantic-match.json` |
| shell-command-gate | pending Mac Claude CLI | **1197 ms** | AFTER: `demos/proof/multi/out/shell-command-gate.json` |
| keystroke-launcher | pending Mac Claude CLI | **885 ms** | AFTER: `demos/proof/multi/out/keystroke-launcher.json` |
| alert-gate | pending Mac Claude CLI | **1181 ms** | AFTER: `demos/proof/multi/out/alert-gate.json` |
| model-cost-router | pending Mac Claude CLI | **907 ms** | AFTER: `demos/proof/multi/out/model-cost-router.json` |
| tool-picker / candidate-action-select | pending Mac Claude CLI | **1054 ms** | AFTER: `demos/proof/openclaw-contrast/out/tool-picker.json` |
| browser-next-action | pending Mac Claude CLI | **490 ms** | AFTER: `demos/proof/openclaw-contrast/out/browser-next-action.json` |
| agent-stuck-drift | pending Mac Claude CLI | **559 ms** | AFTER: `demos/proof/openclaw-contrast/out/agent-stuck-drift.json` |
| ship-gate | pending Mac Claude CLI | **596 ms** | AFTER: `demos/proof/openclaw-contrast/out/ship-gate.json` |
| inbox-triage | pending Mac Claude CLI | **505 ms** | AFTER: `demos/proof/openclaw-contrast/out/inbox-triage.json` |

### AFTER detail (OpenClaw-map live batch)

| Hot path | n | concurrency | wall_ms | measured |
|----------|--:|------------:|--------:|----------|
| tool-picker | 8 | 4 | 1054 | MEASURED_LIVE |
| browser-next-action | 8 | 4 | 490 | MEASURED_LIVE |
| agent-stuck-drift | 8 | 4 | 559 | MEASURED_LIVE |
| ship-gate | 8 | 4 | 596 | MEASURED_LIVE |
| inbox-triage | 10 | 5 | 505 | MEASURED_LIVE |

Measured ET window: 2026-09-18 ~13:35 ET (`started_at` / `finished_at` in each `out/*.json`).

## How to re-run

```bash
# AFTER (this box or any with TYPESAFE_API_KEY)
npx tsx demos/proof/openclaw-contrast/run-jev.mts

# BEFORE (Mac with `claude` on PATH)
bash demos/proof/openclaw-contrast/run-claude.sh
# row BEFORE reuse:
bash demos/proof/row-filter/mac-llm-cli-bakeoff.sh
```

If Claude is missing, `run-claude.sh` writes `out/claude-before-note.json` and exits 0.

## Caption

X caption draft (only real BEFORE→AFTER + LIVE walls): `x-caption.md`
