# Share — row-filter bakeoff

## Measured (this machine run)

| Side | Tool | Wall clock | Notes |
|------|------|------------|-------|
| BEFORE | Claude Code CLI (`claude -p`, sonnet, tools off) on MacBookPro | **48.856 s** | signed-in local CLI |
| AFTER | Jev + `DecisionHarness` row-semantic-match (live TypeSafe) | **1.320 s** | concurrency 8, ~$0.000454 |

**Speedup: 37.0×**

## Proof assets (required)

Real terminal screenshots only:

- `docs/assets/marketing/proof/terminal/claude-terminal.png`
- `docs/assets/marketing/proof/terminal/jev-harness.png`

Logs: `demos/proof/row-filter/out/claude_terminal*.txt`, `jev_terminal*.txt`  
Numbers: `demos/proof/row-filter/out/measured.json`

## Quote template (attach the two terminal PNGs)

> implemented this shape in jev-harness — measured on our side vs Claude Code CLI (same 24 rows):
>
> 48.9s → 1.32s (37×) · ~$0.00045
>
> screenshots = our terminal runs
>
> https://github.com/AntonioCoppe/jev-harness

Do not use HTML mock cards or AI images as proof.
