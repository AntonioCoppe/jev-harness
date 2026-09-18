---
layout: home

hero:
  name: jev-harness
  text: Decision harness for TypeSafe Jev
  tagline: Confidence-gated System One decisions with recipes, shadow mode, and evals.
  actions:
    - theme: brand
      text: Browse recipes
      link: /recipes/
    - theme: alt
      text: Taxonomy
      link: /taxonomy
    - theme: alt
      text: GitHub
      link: https://github.com/AntonioCoppe/jev-harness

features:
  - title: Policy + confidence
    details: Map Jev answers to domain actions, refuse to act when unsure, and observe safely in shadow mode.
  - title: Empirical taxonomy
    details: Bottom-up harness shapes (not departments) — candidate-action-selection, row-judgment, verify-gate, and more.
  - title: Catalog recipes
    details: Opinionated questions + policies for recurring shapes, indexed in recipes/catalog.ts.
---

## Quick links

| Page | What it is |
|---|---|
| [Taxonomy](/taxonomy) | Empirical shape IDs from `research/taxonomy.md` |
| [Recipes](/recipes/) | Catalog entries grouped by taxonomy ID |
| [README](https://github.com/AntonioCoppe/jev-harness#readme) | Install, concepts, shadow + eval CLI |

## Local docs

```bash
npm run docs:dev    # http://localhost:5173
npm run docs:build  # static output under docs-site/.vitepress/dist
```

Recipe pages are generated from `recipes/catalog.ts` before each docs run.
