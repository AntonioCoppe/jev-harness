# Multi use-case proof runners (ego-style)

Live wall-clock measurements for several jev-harness recipes. Each runner hits the TypeSafe API (`TYPESAFE_API_KEY`), prints `WALL_MS` + a quality summary, and writes `out/<id>.json` stamped `MEASURED_LIVE`.

Do not invent timings. Re-run to refresh numbers.

## Cases

| Case | Recipe | Command | X caption angle (Antonio) |
|------|--------|---------|---------------------------|
| row-semantic-match | `mapRows` / row-semantic-match | `npx tsx demos/proof/multi/run-row-semantic-match.mts` | Same 24 people rows. NL predicate. Jev filters in wall ms while a frontier CLI crawls. Same task family as the ego-style 48.9s→1.3s clip. |
| shell-command-gate | shell-command-gate | `npx tsx demos/proof/multi/run-shell-command-gate.mts` | Agent wants to run a shell line. Safe, dangerous, ambiguous in one batch. Gate returns allow/deny/ask before blast radius hits prod. |
| keystroke-launcher | keystroke-launcher | `npx tsx demos/proof/multi/run-keystroke-launcher.mts` | Per-keystroke Choice over a fixed launcher list. WAIT when the prefix is still mush. ms UX instead of waiting on a full chat roundtrip. |
| alert-gate | alert-gate | `npx tsx demos/proof/multi/run-alert-gate.mts` | Fifteen synthetic alerts. Notify, suppress, or queue review. Confidence front door so on-call is not woken for staging flake. |
| model-cost-router | model-cost-router | `npx tsx demos/proof/multi/run-model-cost-router.mts` | Ten prompts. Cheap first when risk is low. Mid or frontier only when wrong answers hurt. Router spend is cents; frontier tokens are the real bill. |

## Run all

```bash
# from repo root (needs TYPESAFE_API_KEY in env or .env)
npm run build
npx tsx demos/proof/multi/run-all.mts
```

Or one case at a time with the commands in the table.

## Claude CLI contrast

Fair BEFORE comparison only for **row filter** and maybe **shell gate**.

```bash
bash demos/proof/multi/claude-cli-contrast.outline.sh
```

If Claude CLI is missing (this Linux box), the script writes `out/claude-contrast-note.json` and exits 0. Note: **BEFORE requires Mac Claude CLI**. Do not invent Claude wall times. On Mac, reuse `demos/proof/row-filter/mac-llm-cli-bakeoff.sh` for the row case.

## Outputs

| File | Contents |
|------|----------|
| `out/row-semantic-match.json` | wall_ms, include/exclude/review, tokens |
| `out/shell-command-gate.json` | wall_ms, allow/deny/ask |
| `out/keystroke-launcher.json` | wall_ms, action histogram |
| `out/alert-gate.json` | wall_ms, notify/suppress/review |
| `out/model-cost-router.json` | wall_ms, cheap/mid/frontier + pctCheap |
| `out/claude-contrast-note.json` | skip note when Claude CLI absent |

## Fixtures

Under `fixtures/`: people rows + predicate (reused from row-filter), shell commands, launcher candidates/prefixes, alerts, prompts.
