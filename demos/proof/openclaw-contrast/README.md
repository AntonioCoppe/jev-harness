# OpenClaw contrast proof

BEFORE/AFTER wall clocks for OpenClaw-style hot paths.
**Do not invent timings.**

## Layout

| Path | Role |
|------|------|
| `fixtures/` | Small fixed batches per hot path |
| `run-jev.mts` | Live AFTER via recipes + `TYPESAFE_API_KEY` |
| `run-claude.sh` | BEFORE outline / Mac Claude CLI if present |
| `out/*.json` | `MEASURED_LIVE` AFTER JSON |
| `RESULTS.md` | Summary table + sources |
| `x-caption.md` | X caption draft (honest BEFORE→AFTER only) |

## OpenClaw map (live AFTER here)

- tool-picker / candidate-action-select
- browser-next-action
- agent-stuck-drift
- ship-gate
- inbox-triage (alert-gate-shaped batch)

Multi pack AFTER (already measured): row-semantic-match, shell-command-gate, keystroke-launcher, alert-gate, model-cost-router → `demos/proof/multi/out/`.

## Run

```bash
npx tsx demos/proof/openclaw-contrast/run-jev.mts
bash demos/proof/openclaw-contrast/run-claude.sh
```
