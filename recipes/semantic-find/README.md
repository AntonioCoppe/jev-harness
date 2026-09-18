# semantic-find

Empirical category from `research/taxonomy.md` (cluster **G**).

**Shape:** Candidate list already in hand (lines, spans, BM25 shortlist). Choice (or per-item Score) for best match to an NL query; optional `exists` / `none_fit` Noul.

| Recipe | Role |
|---|---|
| `line-semantic-find` | Pick best doc line for a query, or `NONE`. |
| `span-pick` | Pick a pre-parsed value/span, or `NONE`. |

Related: `row-judgment` filters a corpus with a shared predicate; this cluster **ranks among** a shortlist for one query.
