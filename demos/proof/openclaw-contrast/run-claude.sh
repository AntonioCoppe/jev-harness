#!/usr/bin/env bash
# OpenClaw-style BEFORE via Claude CLI (`claude -p`, tools off).
# Approximates normal OpenClaw = frontier LLM on every hot-path decision.
# NEVER invent timings. Missing Claude → document skip, exit 0.
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
HERE="$ROOT/demos/proof/openclaw-contrast"
OUT="$HERE/out"
mkdir -p "$OUT"
NOTE="$OUT/claude-before-note.json"

if ! command -v claude >/dev/null 2>&1; then
  cat > "$NOTE" <<'JSON'
{
  "status": "SKIPPED",
  "reason": "BEFORE requires Mac Claude CLI (claude -p, tools off)",
  "openclaw_approximation": "frontier LLM path ≈ normal OpenClaw hot-path decisions",
  "measured_before": {
    "row-semantic-match": {
      "wall_s": 48.856,
      "wall_ms": 48856,
      "source": "docs/assets/marketing/proof/measured.json"
    }
  },
  "pending_before": [
    "shell-command-gate",
    "keystroke-launcher",
    "alert-gate",
    "model-cost-router",
    "tool-picker",
    "browser-next-action",
    "agent-stuck-drift",
    "ship-gate",
    "inbox-triage"
  ],
  "how_to_run_on_mac": [
    "export PATH=\"/opt/homebrew/bin:$HOME/.local/bin:$PATH\"",
    "bash demos/proof/row-filter/mac-llm-cli-bakeoff.sh",
    "For each fixtures/*.json: loop items through `claude -p` asking for the same action enum as the recipe; time wall clock; write out/<id>-claude-before.json stamped MEASURED_LIVE"
  ]
}
JSON
  echo "Claude CLI not on PATH. Wrote $NOTE"
  echo "BEFORE = pending Mac Claude CLI (except row-semantic-match 48.856s already measured)."
  echo "Jev AFTER walls stand alone as MEASURED_LIVE — do not invent OpenClaw/Claude times."
  exit 0
fi

echo "Claude CLI found: $(command -v claude)"
echo "Fair protocol: same fixture batches as run-jev.mts; sequential claude -p per item; wall clock."
echo "TODO on Mac: write out/<id>-claude-before.json with measured MEASURED_LIVE and wall_ms."
echo "Do not invent numbers."
