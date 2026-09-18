# Share — row-filter bakeoff

## Measured (OUR run)

| Side | Tool | Wall | Notes |
|------|------|------|-------|
| BEFORE | Claude Code CLI on Mac (`claude -p`, sonnet, tools off) | **48.856 s** | signed-in local CLI |
| AFTER | Jev + DecisionHarness row-semantic-match (live) | **1.320 s** | concurrency 8 · ~$0.000454 |

**Speedup: 37.01×**

## Proof assets (required before posting)

Real Terminal screenshots only:
- `docs/assets/marketing/proof/terminal/claude-cli.png`
- `docs/assets/marketing/proof/terminal/jev-harness.png`

Designed cards under `_deprecated_designed_cards/` are **not** proof.

## Quote template (attach the two terminal PNGs)

> implemented this shape in jev-harness — measured vs Claude Code CLI (same 24 rows):
>
> 48.9s → 1.32s (37×) · ~$0.00045
>
> screenshots = our terminal runs
>
> https://github.com/AntonioCoppe/jev-harness
