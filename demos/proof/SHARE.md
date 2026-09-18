# Share pack — row-filter proof (MEASURED)

**Do not post without attaching the PNGs.**

## PNG paths (absolute)

- `/workspace/jev-harness/docs/assets/marketing/proof/before.png`
- `/workspace/jev-harness/docs/assets/marketing/proof/after.png`
- `/workspace/jev-harness/docs/assets/marketing/proof/timings-closeup.png`

Repo-relative: `docs/assets/marketing/proof/{before,after,timings-closeup}.png`

Canonical numbers: `docs/assets/marketing/proof/measured.json` (no secrets).  
Source logs: `demos/proof/row-filter/out/claude_terminal_bakeoff.txt`, `jev_terminal.txt`.

## Measured (OUR run — not iam_zachi)

| Side | Path | Wall | Notes |
|---|---|---|---|
| **BEFORE** | Mac Claude Code CLI (`claude -p`, sonnet, tools off) | **48,856 ms (48.9s)** | signed-in Mac CLI · no API key |
| **AFTER** | live Jev `DecisionHarness` mapRows c=8 | **1,320 ms** | **$0.000454** (10,818 in-tok × $0.042/MTok) · 3 incl / 10 ex / 11 review |
| **CACHE** | warm Map | **&lt;1 ms** | 24/24 |

- Rows: **24** (`demos/proof/row-filter/people.json`)
- Predicate: `could work fully remote without on-site equipment`
- Speedup: **37.01×** wall (Claude CLI → Jev)
- Measured Thu Sep 17, 2026 evening ET

## Tweet draft (attach the three PNGs)

```
compaction bar: scarce resource = money + speed.

same altitude, OUR measured proof (not someone else's demo):

  WHERE jev(people, 'could work fully remote without on-site equipment')

BEFORE · Claude Code CLI on Mac: 24 rows in 48.9s
AFTER  · Jev + jev-harness mapRows: 1.32s · $0.00045 · cache <1ms

→ 37× wall. same 24 synthetic rows. measured.

row-judgment recipe in jev-harness
(DecisionHarness + confidence + shadow)

📸 before / after / timings attached
```

## Paste-into-agent prompt

```
Use recipes/row-judgment/row-semantic-match.ts + mapRows (batch.ts)
over demos/proof/row-filter/people.json with predicate
"could work fully remote without on-site equipment".

Measure LIVE:
1) BEFORE: Mac Claude Code CLI (`claude -p`, tools off) wall_ms — machineId 342b25bc-ecc2-4847-8cd8-ae44443911ea
2) AFTER: DecisionHarness mapRows concurrency=8 via TYPESAFE_API_KEY (box-secrets card) → wall_ms, tokens, usd @ $0.042/MTok
3) CACHE: second mapRows on warm Map

Write docs/assets/marketing/proof/measured.json (no secrets) and
before.png / after.png / timings-closeup.png with BIG readable numbers.
Do NOT invent metrics. Do NOT reuse iam_zachi 129-row / $0.0009 figures as ours.
```

## Do not post without attaching the PNGs

Repo links alone are not the proof. The screenshots are.

---

## Related paste prompts (crazy-fast packs)

For agent-comm, Polymarket, sports-bet, and trading gates (no measured timings claimed yet — stubs + research targets only), see [`demos/marketing/PROMPTS.md`](../marketing/PROMPTS.md) §§7–10 and [`research/crazy-fast-decisions.md`](../../research/crazy-fast-decisions.md).
