# Ego-style multi-usecase proof pack (5 cases)

Pattern ref (format only): https://x.com/ego_agent/status/2100970015977804008
Their Amazon numbers (3.71s vs 54.45s) are **not ours**.

**AFTER walls** come from `demos/proof/multi/out/*.json` (`MEASURED_LIVE`, commit 1d170c7).
**BEFORE:** only row-filter has Mac Claude CLI **48.856s** (`docs/assets/marketing/proof/measured.json`). All other cases label BEFORE as **Mac Claude CLI pending**. Never invent.

## Case matrix

| # | Case | n | BEFORE | AFTER (multi/out) | Status |
|---|------|---|--------|-------------------|--------|
| 1 | row / row-semantic-match | 24 | Claude CLI **48.856s** | **1.257s** (1257 ms) | AFTER MEASURED_LIVE |
| 2 | shell-command-gate | 12 | **PENDING** (Mac Claude CLI) | **1.197s** (1197 ms) | AFTER MEASURED_LIVE |
| 3 | keystroke-launcher | 10 | **PENDING** (Mac Claude CLI) | **0.885s** (885 ms) | AFTER MEASURED_LIVE |
| 4 | alert-gate | 15 | **PENDING** (Mac Claude CLI) | **1.181s** (1181 ms) | AFTER MEASURED_LIVE |
| 5 | model-cost-router | 10 | **PENDING** (Mac Claude CLI) | **0.907s** (907 ms) | AFTER MEASURED_LIVE |

CLI map: `row` · `shell` · `keystroke` · `alert` · `router`

```bash
node demos/proof/ego-style/run-cinematic-case.mjs row
node demos/proof/ego-style/run-cinematic-case.mjs shell
node demos/proof/ego-style/run-cinematic-case.mjs keystroke
node demos/proof/ego-style/run-cinematic-case.mjs alert
node demos/proof/ego-style/run-cinematic-case.mjs router
node demos/proof/ego-style/run-cinematic.mjs   # == row
```

Re-measure AFTER: `npx tsx demos/proof/multi/run-all.mts`

---

## 1) row / row-semantic-match

**Shot list**

| # | Dur | Shot |
|---|-----|------|
| 1 | 2s | Title + SAME TASK |
| 2 | 3–12s | BEFORE (Claude compressed for row; PENDING card for others) |
| 3 | 0.4s | Smash cut NOW |
| 4 | 3–11s | AFTER REPLAY of multi/out items + big WALL CLOCK |
| 5 | 4s | End card + repo URL |

```json
{
  "id": "row-semantic-match",
  "measured": "MEASURED_LIVE",
  "wall_ms": 1257,
  "wall_s": 1.257,
  "n": 24,
  "quality": {
    "actions": {
      "include": 14,
      "exclude": 8,
      "review": 2
    },
    "concurrency": 8,
    "input_tokens": 11761,
    "output_tokens": 792,
    "per_row_avg_ms": 52
  },
  "before": {
    "path": "Claude Code CLI Mac",
    "wall_s": 48.856,
    "status": "MEASURED"
  },
  "source": "demos/proof/multi/out/row-semantic-match.json"
}
```

Cinematic: `node demos/proof/ego-style/run-cinematic-case.mjs row`  
Caption: `x-caption-row-filter.md`

---

## 2) shell-command-gate

**Shot list**

| # | Dur | Shot |
|---|-----|------|
| 1 | 2s | Title + SAME TASK |
| 2 | 3–12s | BEFORE (Claude compressed for row; PENDING card for others) |
| 3 | 0.4s | Smash cut NOW |
| 4 | 3–11s | AFTER REPLAY of multi/out items + big WALL CLOCK |
| 5 | 4s | End card + repo URL |

```json
{
  "id": "shell-command-gate",
  "measured": "MEASURED_LIVE",
  "wall_ms": 1197,
  "wall_s": 1.197,
  "n": 12,
  "quality": {
    "actions": {
      "allow": 4,
      "ask": 3,
      "suppress": 1,
      "deny": 4
    },
    "concurrency": 4,
    "input_tokens": 9538,
    "output_tokens": 1688,
    "per_cmd_avg_ms": 100
  },
  "before": {
    "status": "PENDING",
    "note": "Mac Claude CLI required; see multi/out/claude-contrast-note.json"
  },
  "source": "demos/proof/multi/out/shell-command-gate.json"
}
```

Cinematic: `node demos/proof/ego-style/run-cinematic-case.mjs shell`  
Caption: `x-caption-shell.md`

---

## 3) keystroke-launcher

**Shot list**

| # | Dur | Shot |
|---|-----|------|
| 1 | 2s | Title + SAME TASK |
| 2 | 3–12s | BEFORE (Claude compressed for row; PENDING card for others) |
| 3 | 0.4s | Smash cut NOW |
| 4 | 3–11s | AFTER REPLAY of multi/out items + big WALL CLOCK |
| 5 | 4s | End card + repo URL |

```json
{
  "id": "keystroke-launcher",
  "measured": "MEASURED_LIVE",
  "wall_ms": 885,
  "wall_s": 0.885,
  "n": 10,
  "quality": {
    "actions": {
      "vscode": 1,
      "review": 8,
      "WAIT": 1
    },
    "concurrency": 4,
    "input_tokens": 9711,
    "output_tokens": 1329,
    "per_prefix_avg_ms": 89
  },
  "before": {
    "status": "PENDING",
    "note": "Mac Claude CLI required; see multi/out/claude-contrast-note.json"
  },
  "source": "demos/proof/multi/out/keystroke-launcher.json"
}
```

Cinematic: `node demos/proof/ego-style/run-cinematic-case.mjs keystroke`  
Caption: `x-caption-keystroke.md`

---

## 4) alert-gate

**Shot list**

| # | Dur | Shot |
|---|-----|------|
| 1 | 2s | Title + SAME TASK |
| 2 | 3–12s | BEFORE (Claude compressed for row; PENDING card for others) |
| 3 | 0.4s | Smash cut NOW |
| 4 | 3–11s | AFTER REPLAY of multi/out items + big WALL CLOCK |
| 5 | 4s | End card + repo URL |

```json
{
  "id": "alert-gate",
  "measured": "MEASURED_LIVE",
  "wall_ms": 1181,
  "wall_s": 1.181,
  "n": 15,
  "quality": {
    "actions": {
      "queue_review": 7,
      "suppress": 5,
      "review": 3
    },
    "concurrency": 5,
    "input_tokens": 7966,
    "output_tokens": 1136,
    "per_alert_avg_ms": 79
  },
  "before": {
    "status": "PENDING",
    "note": "Mac Claude CLI required; see multi/out/claude-contrast-note.json"
  },
  "source": "demos/proof/multi/out/alert-gate.json"
}
```

Cinematic: `node demos/proof/ego-style/run-cinematic-case.mjs alert`  
Caption: `x-caption-alert.md`

---

## 5) model-cost-router

**Shot list**

| # | Dur | Shot |
|---|-----|------|
| 1 | 2s | Title + SAME TASK |
| 2 | 3–12s | BEFORE (Claude compressed for row; PENDING card for others) |
| 3 | 0.4s | Smash cut NOW |
| 4 | 3–11s | AFTER REPLAY of multi/out items + big WALL CLOCK |
| 5 | 4s | End card + repo URL |

```json
{
  "id": "model-cost-router",
  "measured": "MEASURED_LIVE",
  "wall_ms": 907,
  "wall_s": 0.907,
  "n": 10,
  "quality": {
    "actions": {
      "cheap": 5,
      "mid": 2,
      "frontier": 3
    },
    "concurrency": 4,
    "input_tokens": 4388,
    "output_tokens": 546,
    "per_prompt_avg_ms": 91,
    "pct_cheap": 0.5
  },
  "before": {
    "status": "PENDING",
    "note": "Mac Claude CLI required; see multi/out/claude-contrast-note.json"
  },
  "source": "demos/proof/multi/out/model-cost-router.json"
}
```

Cinematic: `node demos/proof/ego-style/run-cinematic-case.mjs router`  
Caption: `x-caption-router.md`

---

## Recording

```bash
bash demos/proof/ego-style/record-box.sh row
bash demos/proof/ego-style/record-box.sh shell
bash demos/proof/ego-style/record-box.sh keystroke
bash demos/proof/ego-style/record-box.sh alert
bash demos/proof/ego-style/record-box.sh router
```

Screen on this box is **1280×800**. If x11grab fails, use Mac QuickTime steps in `README.md`.

## Posting order

1. **row** first (only full 48.9s → LIVE after before/after).
2. shell / alert / router (fast MEASURED AFTER walls).
3. keystroke (1x per-keystroke energy).
4. No QT ask. Optional Diogo quote only on row post.
