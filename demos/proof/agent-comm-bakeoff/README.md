# agent-comm-bakeoff

Compare multi-agent coordination cost on a **fixed task**.

| Arm | Mode | Speaker policy | Harness |
|---|---|---|---|
| **A** (control) | `free_for_all_all_wake` | Wake all 3 every round | None (no Jev/TypeSafe) |
| **B** | gated | Wake only who should speak | jev-harness (elsewhere) |

Fixed task: design a 3-agent Polymarket BTC 15m arb monitor (roles, decision gates, kill criteria).

See `arm-a/` for control artifacts: `PROTOCOL.md`, `metrics.json`, `wake-schedule.json`, `design.md`.
