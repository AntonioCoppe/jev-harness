# Ego-style proof demos (5 use cases)

Format study ref: `research/refs/ego-agent-demo.mp4`  
Source post (pattern only): https://x.com/ego_agent/status/2100970015977804008  

**Their** numbers: 3.71s vs 54.45s · 20 Amazon decisions. **Not ours.**  
**Ours AFTER:** `demos/proof/multi/out/*.json` (`MEASURED_LIVE`).  
**Ours BEFORE (row only):** Claude CLI **48.9s** in `docs/assets/marketing/proof/measured.json`.

Full matrix + JSON snippets: **[MULTI-USECASE.md](./MULTI-USECASE.md)**

## Cases

| CLI arg | Recipe | BEFORE | AFTER file |
|---------|--------|--------|------------|
| `row` | row-semantic-match | Claude 48.9s MEASURED | `multi/out/row-semantic-match.json` |
| `shell` | shell-command-gate | Mac Claude PENDING | `multi/out/shell-command-gate.json` |
| `keystroke` | keystroke-launcher | Mac Claude PENDING | `multi/out/keystroke-launcher.json` |
| `alert` | alert-gate | Mac Claude PENDING | `multi/out/alert-gate.json` |
| `router` | model-cost-router | Mac Claude PENDING | `multi/out/model-cost-router.json` |

## Run

```bash
node demos/proof/ego-style/run-cinematic-case.mjs row
node demos/proof/ego-style/run-cinematic-case.mjs shell
node demos/proof/ego-style/run-cinematic-case.mjs keystroke
node demos/proof/ego-style/run-cinematic-case.mjs alert
node demos/proof/ego-style/run-cinematic-case.mjs router
```

## Record

```bash
bash demos/proof/ego-style/record-box.sh row
# … shell | keystroke | alert | router
```

### Antonio Mac fallback

1. Dark Terminal ~18pt, 1280×720+.
2. `node demos/proof/ego-style/run-cinematic-case.mjs <case>`
3. QuickTime New Screen Recording → that window → trim ≤30s.
4. Post with matching `x-caption-*.md`. No QT ask.

## Captions

- `x-caption.md` / `x-caption-row-filter.md`
- `x-caption-shell.md`
- `x-caption-keystroke.md`
- `x-caption-alert.md`
- `x-caption-router.md`
