# row-judgment

*(alias: `structured-data-filter`)* — seed: iam_zachi Postgres `jev()`.

**Shape:** Map the same NL predicate over many rows/items; per-item Noul/Score/Choice + threshold/cache.

Recipes: `row-semantic-match`.

**Batch helpers:** `mapRows` / `batchFilterRows` — concurrency pool + in-memory cache keyed by `hash(row)+predicate`.

```ts
import { DecisionHarness, batchFilterRows, mapRows } from "jev-harness";

const harness = new DecisionHarness();
const included = await batchFilterRows(harness, rows, "could work from home", {
  concurrency: 8,
  cache: new Map(), // reuse across calls
});
```
