# Marketing brief — proof bar = compaction; proof artifact = OUR screenshots

**Date:** Thu Sep 17, 2026 (ET / America/Toronto)  
**Product:** [jev-harness](https://github.com/AntonioCoppe/jev-harness)  
**Proof bar:** [fast-jev-compaction](https://github.com/tamaratran/fast-jev-compaction)  
**Hard rule (Antonio):** README savings gallery embeds **our timing/cost screenshots** as proof. A repo link is **not** proof. **Do not** cite @iam_zachi / other tweet $·ms as *ours*.

---

## Compaction equation (the bar)

> **context window = money + speed**

Soft complementary line only: they own context→$ for Claude Code `/compact`. We own the **next equations** (alerts, routing, verify, filter, UI click) as DecisionHarness + shadow + eval.

---

## What counts as proof in the README

| Allowed | Forbidden |
|---|---|
| PNGs under `docs/assets/marketing/` showing **our** cards / mocks / eval proof page | Quoting community tweet numbers as product claims |
| `npm run eval` JSON `proof.*` from **our** fixtures (`pctRoutedCheap`, `suppressOnLowConf`, …) | “129 rows / $0.0009” framed as jev-harness measured |
| DEMO-labeled share-card figures that live **in the screenshot** | Abstract “why us” without an image |

Regenerate shots: `node demos/marketing/shot.mjs` (see `demos/marketing/README.md`).

---

## Gallery card = equation → screenshot → paste-prompt

Template:

1. One-liner equation (`pain = $ + speed`)
2. Embed `docs/assets/marketing/card-*.png` (and interactive mock PNG when useful)
3. Optional one-line pointer to **our** fixture proof
4. Fenced agent **Paste:** block

Six cards (aligned with `demos/marketing/cards/manifest.json`):

| PNG | Equation |
|---|---|
| `card-tool-retain.png` | Context tokens = money + speed |
| `card-model-router.png` | Always-frontier = $ waste; smart route = $ + latency |
| `card-ship-gate.png` | Ungated ship = incident $; gate = catch before prod |
| `card-alert-fp.png` | Alert flood = pager burn; gate = eng hours + sleep |
| `card-row-filter.png` | LLM-per-row = $ + wallclock; Jev batch = cents + seconds |
| `card-ui-action.png` | Vision-agent loop = $ + seconds; candidate Choice = ms + cents |

Plus hero: `our-eval-proof.png` (fixture runs) and `savings.png` (tile overview).

---

## Killer one-liner

> **Typed decisions with proof — confidence, shadow, and policies you can eval.**

Sub: Compaction owns context→$; we ship the next equations — **screenshots carry the $ / ms**.

---

## Checklist

- [x] Hook + soft compaction complementary line
- [x] Gallery embeds our PNGs as proof
- [x] No @iam_zachi (or other tweet) numbers claimed as ours
- [x] Paste-prompts under each card
- [x] Short install after wow
- [x] This brief updated
