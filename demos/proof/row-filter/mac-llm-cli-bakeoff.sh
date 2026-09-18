#!/usr/bin/env bash
# LLM-per-row BEFORE bakeoff via signed-in Mac CLIs (claude / gemini / grok).
# machineId: 342b25bc-ecc2-4847-8cd8-ae44443911ea
# Usage:
#   export PATH="/opt/homebrew/bin:$HOME/.local/bin:$PATH"
#   bash demos/proof/row-filter/mac-llm-cli-bakeoff.sh
# Writes: demos/proof/row-filter/out/llm-before.json
#          docs/assets/marketing/proof/llm-before.json
set -euo pipefail
export PATH="/opt/homebrew/bin:/usr/local/bin:$HOME/.local/bin:$PATH"

ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
# Allow running from a copied path
if [[ ! -f "$ROOT/demos/proof/row-filter/people.json" ]]; then
  ROOT="$(pwd)"
fi
DIR="$ROOT/demos/proof/row-filter"
OUT="$DIR/out"
PROOF="$ROOT/docs/assets/marketing/proof"
PEOPLE="$DIR/people.json"
PRED='could work fully remote without on-site equipment'
mkdir -p "$OUT" "$PROOF"

need_one=false
for c in claude gemini grok; do
  if command -v "$c" >/dev/null 2>&1; then
    echo "found CLI: $c -> $(command -v "$c")"
    need_one=true
  else
    echo "missing CLI: $c"
  fi
done
if [[ "$need_one" != true ]]; then
  echo "FATAL: none of claude/gemini/grok on PATH" >&2
  exit 2
fi

python3 - <<'PY' "$PEOPLE" "$PRED" "$OUT/llm-before.json" "$PROOF/llm-before.json"
import json, os, subprocess, time, shutil, sys
from pathlib import Path

people_path, pred, out1, out2 = sys.argv[1:5]
rows = json.loads(Path(people_path).read_text())
clis = [c for c in ("claude", "gemini", "grok") if shutil.which(c)]

def prompt_for(row):
    return f"""You are a row filter. Reply with ONLY one JSON object, no markdown:
{{"action":"include"|"exclude"|"review","noul":0.0-1.0}}

Predicate: {pred}
Row JSON: {json.dumps(row, ensure_ascii=False)}
"""

def run_cli(cli, row):
    p = prompt_for(row)
    # Prefer non-interactive / print flags where known
    if cli == "claude":
        cmd = ["claude", "-p", p, "--output-format", "text"]
    elif cli == "gemini":
        cmd = ["gemini", "-p", p]
    else:  # grok
        cmd = ["grok", p] if False else ["grok", "-p", p]
        # fallbacks tried below
    t0 = time.perf_counter()
    attempts = [cmd]
    if cli == "grok":
        attempts = [["grok", "-p", p], ["grok", "ask", p], ["grok", p]]
    if cli == "gemini":
        attempts = [["gemini", "-p", p], ["gemini", p]]
    last_err = None
    for cmd in attempts:
        try:
            r = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
            ms = int((time.perf_counter() - t0) * 1000)
            text = (r.stdout or "") + ("\n" + r.stderr if r.returncode else "")
            return {"ok": r.returncode == 0, "ms": ms, "cmd": cmd[0:2], "raw": text[-2000:], "code": r.returncode}
        except FileNotFoundError as e:
            last_err = str(e)
            continue
        except Exception as e:
            ms = int((time.perf_counter() - t0) * 1000)
            return {"ok": False, "ms": ms, "cmd": cmd[0:2], "raw": str(e), "code": -1}
    return {"ok": False, "ms": 0, "cmd": [cli], "raw": last_err or "failed", "code": -1}

def parse_action(raw):
    import re
    m = re.search(r"\{[^{}]*\"action\"[^{}]*\}", raw or "", re.S)
    if not m:
        return None
    try:
        return json.loads(m.group(0))
    except Exception:
        return None

results = {
    "proof_id": "jev-harness-row-filter-llm-cli-before-v1",
    "label": "MEASURED",
    "path": "Mac CLI per-row (signed-in claude/gemini/grok)",
    "machineId": "342b25bc-ecc2-4847-8cd8-ae44443911ea",
    "predicate": pred,
    "rows": len(rows),
    "measured_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    "clis": {},
}

# Use first available CLI as primary BEFORE (prefer claude then gemini then grok)
primary = clis[0]
print(f"PRIMARY_CLI={primary}", flush=True)

# Measure primary across all rows (sequential — naive LLM-per-row)
judgments = []
wall0 = time.perf_counter()
for i, row in enumerate(rows):
    print(f"[{primary}] {i+1}/{len(rows)} {row.get('id')}", flush=True)
    r = run_cli(primary, row)
    parsed = parse_action(r.get("raw", "")) if r.get("ok") else None
    judgments.append({
        "id": row.get("id"),
        "ok": r.get("ok"),
        "ms": r.get("ms"),
        "action": (parsed or {}).get("action"),
        "noul": (parsed or {}).get("noul"),
        "parse_ok": parsed is not None,
    })
wall_ms = int((time.perf_counter() - wall0) * 1000)

include = sum(1 for j in judgments if j.get("action") == "include")
exclude = sum(1 for j in judgments if j.get("action") == "exclude")
review = sum(1 for j in judgments if j.get("action") == "review")

results["clis"][primary] = {
    "wall_ms": wall_ms,
    "per_row_ms_avg": int(wall_ms / max(len(rows), 1)),
    "include": include,
    "exclude": exclude,
    "review": review,
    "parse_ok": sum(1 for j in judgments if j.get("parse_ok")),
    "judgments": judgments,
}
results["before"] = {
    "cli": primary,
    "wall_ms": wall_ms,
    "include": include,
    "exclude": exclude,
    "review": review,
    "usd_note": "CLI subscription path — $ not metered here; wall_ms is the scarce-resource proof",
}

# Smoke one row on each other CLI for presence
for cli in clis:
    if cli == primary:
        continue
    print(f"smoke {cli}", flush=True)
    r = run_cli(cli, rows[0])
    results["clis"][cli] = {"smoke_ms": r.get("ms"), "ok": r.get("ok"), "code": r.get("code")}

text = json.dumps(results, indent=2)
Path(out1).write_text(text)
Path(out2).write_text(text)
print(json.dumps({"wrote": [out1, out2], "before_wall_ms": wall_ms, "cli": primary, "include": include}, indent=2))
PY
