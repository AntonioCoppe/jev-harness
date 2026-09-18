# Marketing demos

Screenshot-first proof. Every savings card **self-measures** on open:

- **Wall time** — `performance.now()` around OUR canned decision loop  
- **$** — `calls × $0.000007` DEMO meter (labeled; not a vendor quote)

```text
<painful resource> = <money savings> + <speed>
```

**Do not** use other people’s posts/timings as our proof. Repo URL is footer only.

## Open

```bash
python3 -m http.server 8765 --directory demos/marketing
# http://127.0.0.1:8765/
```

| Path | What |
|---|---|
| `index.html` | Hub |
| `alert-gate.html` / `row-filter.html` / `ui-click.html` | Interactive mocks with OUR wall+$ strips |
| `savings.html` | Six proof tiles |
| `cards/*.html` | Share cards (measure on load) |
| `runs/measure.mjs` | Node re-measure → `runs/latest.json` |
| `PROMPTS.md` | One agent prompt per card |

## Record PNGs → `docs/assets/marketing/`

```bash
python3 -m http.server 8765 --directory demos/marketing &
BASE=http://127.0.0.1:8765
OUT=docs/assets/marketing
mkdir -p "$OUT"
# wait for in-page measure (~300ms), then screenshot
for pair in   "gallery.png /index.html 1400 1200"   "savings.png /savings.html 1400 1100"   "alert-gate.png /alert-gate.html 1400 900"   "row-filter.png /row-filter.html 1400 980"   "ui-click.png /ui-click.html 1400 900"   "card-tool-retain.png /cards/tool-retain.html 1100 980"   "card-model-router.png /cards/model-router.html 1100 980"   "card-ship-gate.png /cards/ship-gate.html 1100 980"   "card-alert-fp.png /cards/alert-fp.html 1100 980"   "card-row-filter.png /cards/row-filter.html 1100 980"   "card-ui-action.png /cards/ui-action.html 1100 980"
do
  set -- $pair
  timeout 25 google-chrome --headless=new --disable-gpu --no-sandbox --hide-scrollbars     --virtual-time-budget=1500 --window-size=$3,$4     --screenshot="$OUT/$1" "$BASE$2" || true
done
```

## Claims discipline

- DEMO = canned answers + measured local wall + labeled meter $  
- Contrast “before” = illustrative class, not someone else’s benchmark  
- Compaction Claude Code UX → complementary [fast-jev-compaction](https://github.com/tamaratran/fast-jev-compaction); we don’t steal their numbers  
- No invented TypeSafe API claims beyond `research/` + docs.typesafe.ai patterns already in-repo  
