# agent-comm-bakeoff

Compare multi-agent coordination cost on a **fixed task**.

| Arm | Mode | Speaker policy | Harness |
|---|---|---|---|
| **A** (control) | `free_for_all_all_wake` | Wake all 3 every round | None (no Jev/TypeSafe) |
| **B** | `jev_who_speaks_gate` | Wake only who should speak | DecisionHarness + who-speaks-next |

Fixed task: design a 3-agent Polymarket BTC 15m arb monitor (roles, decision gates, kill criteria).

- `arm-a/` — control: PROTOCOL, metrics (`planned_wakes=18`), design
- `arm-b/` — gated: PROTOCOL, metrics (`planned_wakes=6`, ~66.7% wake reduction), rounds.jsonl, design
