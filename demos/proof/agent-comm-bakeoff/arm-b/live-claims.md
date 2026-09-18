# Arm B — live claims (Jev who-speaks gated)

## Researcher (selected r1)
Roles: Scout (code) / Judge (Jev Noul+Score+Choice) / Executor. Code owns books/limits; Jev only gates place vs skip on structured arb state.

## Critic (r4)
placeholder — **invalid**; re-asked for real critique.

## Synthesizer (r5–r6, done: yes)
Code Scout emits mid/bid-ask/depth/fees/t_rem/inventory; Judge runs Jev; Executor alone places.
Gates: code rejects if net edge ≤ fees+slip, book age >10s, t_rem <60s, depth <1.5× size; then Noul ≥0.75, Score edge mid+ conf≥0.7, Choice place only if conf≥0.8.
Kill: −$75/day, $50/window, consecutive-loss breaker, stale/API, t_rem <30s, low conf → no order.
claim: Code owns books/limits/latency; Jev only gates place vs skip/paper on net-edge state.

**Wakes to reach this:** 4 gated (+ 2 low-conf suppressions)
