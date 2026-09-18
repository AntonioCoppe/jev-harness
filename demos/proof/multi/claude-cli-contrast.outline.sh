#!/usr/bin/env bash
# Claude CLI contrast outline for fair BEFORE cases (row filter + shell gate).
# This box has no Claude CLI → BEFORE requires Mac Claude CLI.
# Do not invent Claude timings here. Only outline the bakeoff.
#
# Usage (Mac with `claude` on PATH):
#   bash demos/proof/multi/claude-cli-contrast.outline.sh
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
OUT="$ROOT/demos/proof/multi/out"
mkdir -p "$OUT"

NOTE="$OUT/claude-contrast-note.json"
if ! command -v claude >/dev/null 2>&1; then
  cat > "$NOTE" <<'JSON'
{
  "status": "SKIPPED",
  "reason": "BEFORE requires Mac Claude CLI",
  "fair_cases": ["row-semantic-match", "shell-command-gate"],
  "skipped_as_unfair_or_awkward": ["keystroke-launcher", "alert-gate", "model-cost-router"],
  "how_to_run_on_mac": [
    "export PATH=\"/opt/homebrew/bin:$HOME/.local/bin:$PATH\"",
    "bash demos/proof/row-filter/mac-llm-cli-bakeoff.sh",
    "For shell gate: loop each fixtures/shell-commands.json command through `claude -p` asking allow|deny|ask JSON only; time wall clock"
  ]
}
JSON
  echo "Claude CLI not on PATH. Wrote $NOTE"
  echo "BEFORE requires Mac Claude CLI. Jev wall measurements stand alone (MEASURED_LIVE)."
  exit 0
fi

echo "Claude CLI found: $(command -v claude)"
echo "TODO implement live Claude contrast on Mac (not invent timings)."
echo "Fair cases: row-semantic-match (reuse row-filter bakeoff), shell-command-gate."
