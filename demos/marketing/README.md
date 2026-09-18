# Marketing demos

Self-contained HTML mocks + **proof cards** for screenshot/share energy.

## Bar

Every savings card leads with the compaction-class equation:

```text
<painful resource> = <money savings> + <speed>
```

Examples:

| Painful resource | Money | Speed |
|---|---|---|
| Context tokens (lossy compact) | $ / turn | TTFT |
| Always-frontier routing | $ waste → routed $ | p50 latency |
| Alert flood / pager burn | eng hours | sleep / MTTR |
| LLM-per-row filter | $ | wallclock |
| Vision-agent click loop | $ / step | seconds → ~ms |
| Ungated LLM ship | incident $ | catch before prod |

Interactive mocks dramatize the decision loop (canned Jev-like probabilities; labeled **DEMO** when no API key).

## Open

```bash
# from repo root
python3 -m http.server 8765 --directory demos/marketing
# open http://127.0.0.1:8765/
```

Or open any HTML file directly in a browser (ESM-free; no build).

| Path | What |
|---|---|
| `index.html` | Gallery hub |
| `alert-gate.html` | Inbox / alert gate mock |
| `row-filter.html` | NL row filter mock |
| `ui-click.html` | UI candidate click mock |
| `savings.html` | Six equation proof tiles |
| `cards/*.html` | Individual share cards |
| `PROMPTS.md` | One agent prompt per card |

## Record screenshots

PNGs land in `docs/assets/marketing/`:

```bash
# requires google-chrome or chromium
ROOT="$(pwd)/demos/marketing"
OUT="$(pwd)/docs/assets/marketing"
mkdir -p "$OUT"

shot () {
  local name="$1" url="$2" w="${3:-1400}" h="${4:-900}"
  google-chrome --headless=new --disable-gpu --hide-scrollbars \
    --window-size="$w,$h" --screenshot="$OUT/$name" "$url"
}

# start a tiny static server in another terminal, or use file://
python3 -m http.server 8765 --directory demos/marketing &
sleep 0.5
BASE=http://127.0.0.1:8765

shot gallery.png        "$BASE/index.html" 1400 1100
shot savings.png        "$BASE/savings.html" 1400 1200
shot alert-gate.png     "$BASE/alert-gate.html" 1400 900
shot row-filter.png     "$BASE/row-filter.html" 1400 900
shot ui-click.png       "$BASE/ui-click.html" 1400 900
shot card-tool-retain.png   "$BASE/cards/tool-retain.html" 1100 900
shot card-model-router.png  "$BASE/cards/model-router.html" 1100 900
shot card-ship-gate.png     "$BASE/cards/ship-gate.html" 1100 900
shot card-alert-fp.png      "$BASE/cards/alert-fp.html" 1100 900
shot card-row-filter.png    "$BASE/cards/row-filter.html" 1100 900
shot card-ui-action.png     "$BASE/cards/ui-action.html" 1100 900
```

Allow ~600ms after load for mocks that auto-run (alert storm gate, row judge, click loop).

## Claims discipline

- Do **not** invent TypeSafe API surfaces beyond `research/` and patterns already cited from docs.typesafe.ai.
- **DEMO** = synthetic before/after for share cards — re-measure on your traffic.
- **SEED** = figures from `research/seeds.md` / taxonomy (row ~1s / $0.0009; UI ~90ms; no pixels leave device).
- Compaction Claude Code specialist is complementary: [fast-jev-compaction](https://github.com/tamaratran/fast-jev-compaction). We point at it; we do not claim to own `/compact`.

## Recipes touched

- `recipes/confidence-front-door/alert-gate.ts`
- `recipes/confidence-front-door/model-router.ts`
- `recipes/confidence-front-door/model-cost-router.ts` (proof: % routed cheap)
- `recipes/verify-gate/llm-verifier.ts`
- `recipes/verify-gate/ship-gate.ts` (proof: suppress on low confidence)
- `research/decisions-with-proof.md`
- `recipes/row-judgment/row-semantic-match.ts`
- `recipes/candidate-action-selection/candidate-action-select.ts`
