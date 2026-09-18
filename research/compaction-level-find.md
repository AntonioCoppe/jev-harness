# Compaction-level find

**Bar:** fast-jev-compaction — context window = money + speed (one everyday job + undeniable proof).

## Winner: semantic WHERE without embeddings

**Source:** [@iam_zachi](https://x.com/iam_zachi/status/2100679300756435135) (fxtwitter id may vary; text verified 2026-09-18)

**Equation:** semantic table filter (no embeddings / no index) = money + speed

**Proof (measured by author):**
- 129 rows judged in ~1s for **$0.0009**
- Second run: **6ms** from cache
- API: `WHERE jev(people, 'could work from home')` style NL predicate

**Why it matches compaction:**
| Compaction | This |
|---|---|
| Context tokens are the scarce resource | Row×LLM (or embed+index) is the scarce resource |
| Stop rewriting; only keep/drop | Stop generating embeddings; only yes/no per row |
| $ + TTFT from smaller context | $ + wallclock from skipping embed pipeline |

**Harness hook:** `recipes/row-judgment/` + batch helpers in jev-harness.

## Runners-up
1. **@milindlabs UI click** — ~90ms/decision, no pixels leave device → VLM loop tokens = $ + latency
2. **Browser Use + Jev flights** — 7.1s / $0.0039 → agent step budget = $ + speed

## Paste-into-agent prompt
```
Use github.com/AntonioCoppe/jev-harness

Build a row-judgment demo: given a JSON array of people (name, title, city, notes),
filter with an NL predicate like "could work from home" using DecisionHarness +
the row-judgment recipe (batch Noul/Score per row, confidence gate, cache).

Print: rows in, rows kept, wall time, estimated $ vs naive LLM-per-row.
Do not invent TypeSafe pricing — use the author's public numbers as a comparison
anchor (129 rows ~1s / $0.0009) and label any estimates.
```
