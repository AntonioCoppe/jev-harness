# Contributing

Thanks for helping improve **jev-harness**.

## Setup

```bash
git clone https://github.com/AntonioCoppe/jev-harness.git
cd jev-harness
npm install
cp .env.example .env   # set TYPESAFE_API_KEY for live examples / evals
npm run build
```

## Workflow

1. Prefer small, focused PRs (one recipe, one harness fix, or one docs cluster).
2. Match existing TypeScript style (`strict`, ESM, `.js` import suffixes in source).
3. New recipes: add the runner under the appropriate folder, export from `recipes/index.ts`, and **register in `recipes/catalog.ts`**.
4. Tag recipes with empirical taxonomy IDs from `research/taxonomy.md` (e.g. `candidate-action-selection`, `row-judgment`) — do not invent vertical TOC roots (`support`, `growth`, …).
5. Add or extend `eval/fixtures/*.jsonl` when you change policy logic; run offline eval:

   ```bash
   npx tsx eval/cli.ts eval/fixtures/alert-gate.jsonl
   ```

6. Shadow-mode examples are encouraged (`mode: "shadow"`) so reviewers can see intended actions without side effects.

## Docs

- User-facing: `README.md`
- Architecture: `docs/architecture.md`
- Evidence taxonomy: `research/taxonomy.md` (update when a new harness shape is earned by public builds)

## License

By contributing you agree your work is released under the MIT License (© Antonio Coppe).
