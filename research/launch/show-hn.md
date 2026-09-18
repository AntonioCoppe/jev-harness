# Show HN draft

**Title:** Show HN: jev-harness – confidence-gated decisions for TypeSafe Jev (48.9s → 1.3s)

**URL:** https://github.com/AntonioCoppe/jev-harness

**Text (optional, keep short):**

TypeSafe’s Jev returns structured Choice/Score/Noul answers with confidence. I wanted the layer around that for production: policy → confidence gate → action, plus shadow mode and an eval CLI.

Repo: https://github.com/AntonioCoppe/jev-harness

Proof we measured (same 24-row NL filter):
- Claude Code CLI: 48.9s
- Jev + jev-harness (concurrency 8): 1.3s

Also includes recipes for alert gates, model routing, multi-agent who-speaks-next, Polymarket/sports gates, etc.

Happy to answer questions about the harness shape vs wrapping an LLM.

**First comment (post immediately after):**

Happy to dig into:
1. Why confidence ≠ argmax probability (and how we gate on it)
2. Shadow mode for safe rollout
3. The multi-agent who-speaks bakeoff (9 free-for-all wakes vs 4 gated)

Not affiliated with TypeSafe. Complementary to fast-jev-compaction (they own /compact keep/drop; we own the general decision control plane).
