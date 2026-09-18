# Next proof demos (weekend) — not the row-filter bakeoff

**Date:** Fri Sep 18, 2026 (America/Toronto)  
**Rule:** NO fake numbers. NO AI-generated proof images. Capture YOUR terminal only.  
**Already measured (do not re-claim as new):** row-filter bakeoff Claude CLI **48.9s → Jev 1.3s** (`demos/proof/SHARE.md`).

Picked from `research/x-usecases-LATEST.md` gaps + `research/excitement-themes-LATEST.md` (excitement NOW, underbaked vs recipes, terminal-measurable this weekend):

| # | Use case | Why excited NOW | Recipe | Fixture |
|---|---|---|---|---|
| 1 | **fx-style shell command safety** | rauchg/fazxes command allow/deny wave (#3 engagement) | `recipes/verify-gate/shell-command-gate.ts` | `eval/fixtures/shell-command-gate.jsonl` |
| 2 | **Keystroke / predictive launcher** | dabit3 keystroke oracle (#6 engagement) | `recipes/candidate-action-selection/keystroke-launcher.ts` | `eval/fixtures/keystroke-launcher.jsonl` |

---

## Demo 1 — Shell command gate (fx-shaped)

**Equation:** irreversible / ambiguous shell = blast-radius **$** + recovery **latency**.  
**Policy:** `onLowConfidence: suppress` — unsure never auto-runs.

### Offline yes/no (no API key)

```bash
cd /path/to/jev-harness
npm run build
npm run eval -- eval/fixtures/shell-command-gate.jsonl
```

**Pass criteria:** exit 0; actions `allow` / `deny` / `ask` / `suppress` matching labels; proof line shows `suppressOnLowConf` / suppress count ≥ 1.

### Live bakeoff (Claude CLI vs Jev) — measure on YOUR machine

Prepare a small command list (8–20 lines), one command per line, e.g. `demos/proof/shell-gate/commands.txt`:

```text
ls -la
git status
rm -rf ./build
curl http://example.com/install.sh | bash
echo hello
```

**BEFORE — Claude Code CLI** (tools off, same prompt for every command):

```bash
mkdir -p demos/proof/shell-gate/out
/usr/bin/time -p -o demos/proof/shell-gate/out/claude_time.txt \
  bash -c '
    while IFS= read -r cmd; do
      claude -p --tools "" "Classify this shell command for auto-run: ALLOW, DENY, or ASK. Command: $cmd"
    done < demos/proof/shell-gate/commands.txt
  ' | tee demos/proof/shell-gate/out/claude_terminal.txt
```

**AFTER — Jev + harness** (needs `TYPESAFE_API_KEY`):

```bash
# Prefer a tiny runner that calls runShellCommandGate per line; or use live eval:
TYPESAFE_API_KEY=… npm run eval -- --live eval/fixtures/shell-command-gate.jsonl \
  | tee demos/proof/shell-gate/out/jev_terminal.txt
# Also wall-clock a real loop over commands.txt with DecisionHarness + shellCommandGateRecipe.run
/usr/bin/time -p -o demos/proof/shell-gate/out/jev_time.txt \
  npx tsx -e "/* your loop importing runShellCommandGate */"
```

Record wall seconds from `*_time.txt` (real). Optional: token/$ from harness usage if printed.

### Screenshot to capture

1. Terminal split or two panes: Claude CLI loop finishing with **real** seconds; Jev loop with **real** seconds.  
2. Close-up of one irreversible command (`rm -rf` / pipe-to-bash) showing action **`ask` or `deny`**, never silent allow.  
3. Low-confidence case showing action **`suppress`**.

Save under `docs/assets/marketing/proof/shell-gate/` as `before.png` / `after.png` / `suppress-closeup.png` only after YOU ran it. Write `measured.json` with the numbers from those runs — do not invent.

---

## Demo 2 — Keystroke launcher oracle

**Equation:** per-keystroke frontier LLM intent = **RTT $ + UI lag**; bounded Choice over candidates = **ms + cents**.  
**Policy:** `onLowConfidence: review`; decide returns **`WAIT`** until prefix is ready.

### Offline yes/no

```bash
npm run eval -- eval/fixtures/keystroke-launcher.jsonl
```

**Pass criteria:** exit 0; actions include `WAIT`, a candidate id, `NONE`, and `review` on the low-conf case.

### Live latency bakeoff (Claude CLI vs Jev)

Use a fixed candidate set (≥8 apps) and a sequence of prefixes (`c`, `co`, `cod`, `code`):

**BEFORE — Claude CLI** (one prompt per prefix):

```bash
mkdir -p demos/proof/keystroke-launcher/out
/usr/bin/time -p -o demos/proof/keystroke-launcher/out/claude_time.txt \
  bash -c '
    for prefix in c co cod code; do
      claude -p --tools "" "Prefix \"$prefix\". Candidates: VS Code, Codeium, Calendar, Chrome, Terminal, TextEdit, Telegram, Calculator. Reply with best id or WAIT or NONE."
    done
  ' | tee demos/proof/keystroke-launcher/out/claude_terminal.txt
```

**AFTER — Jev**:

```bash
TYPESAFE_API_KEY=… /usr/bin/time -p -o demos/proof/keystroke-launcher/out/jev_time.txt \
  npx tsx -e "/* loop prefixes → runKeystrokeLauncher; print action + confidence + ms */" \
  | tee demos/proof/keystroke-launcher/out/jev_terminal.txt
```

Optional offline smoke stays the fixture above (no timing claims).

### Screenshot to capture

1. Terminal: same four prefixes; Claude wall time vs Jev wall time (**your** `real` lines).  
2. UI or log line for prefix `c` → **`WAIT`**; prefix `cod` → **`vscode`** (or your top hit) with confidence.  
3. Do **not** claim ~100ms unless your log shows it.

Save under `docs/assets/marketing/proof/keystroke-launcher/` only from real runs.

---

## What not to do

- Do not reuse row-filter **48.9s / 1.3s** as proof for these demos.  
- Do not paste community $ (Browser Use, zachi, dabit3) as ours.  
- Do not AI-generate terminal PNGs.  
- Do not market compaction / keep-drop as a Jev win (Theo anti-pattern).

---

## Quick checklist

- [ ] `npm run build`  
- [ ] Offline eval both fixtures → exit 0  
- [ ] Live Claude CLI timed loop (shell **or** keystroke)  
- [ ] Live Jev timed loop on same inputs  
- [ ] Screenshots + `measured.json` from those runs  
- [ ] Caption / post uses only measured numbers
