# X reply targets — search angles (high signal only)

**Constraint:** 1–3 replies overnight, spaced ≥30–60 min. Non-obvious value first, repo last.  
**X API note:** `user-X` hit monthly spend cap (403) at draft time — use X search UI with angles below.  
**Already engaged / skip:** see `research/x-engager-seen.json` (vinicius2prg, VacekvVita, madhu_sd16 replied; skip dabit3 hype-only, self-anchor, etc.).

---

## Search angles (paste into X search)

### 1. NL row filter / semantic WHERE (best fit for our bakeoff)

```
("work from home" OR "row filter" OR "WHERE jev" OR embeddings) (Jev OR TypeSafe OR System)
```
```
(Jev OR "System One") (SQL OR Postgres OR "no embeddings" OR "129 rows" OR predicate)
```

**Value to add (not spam):**  
“Same shape we measured: map one NL predicate over rows with DecisionHarness + confidence→review bucket — Claude CLI wall 48.9s vs harness 1.3s on 24 rows. Recipe is `row-semantic-match`, not vectors.”  
+ link repo once.

### 2. Browser / UI candidate → Choice loops

```
(Jev OR TypeSafe) (browser OR DOM OR click OR "candidate" OR OCR OR "no screenshots")
```
```
("System One" OR Jev) (Browser Use OR booking OR "UI actions")
```

**Value:**  
Point at `candidate-action` recipe: local labels/IDs → one Choice → act → loop; harness adds policy + shadow so you can dry-run before clicking live. Don’t claim their demo latency.

### 3. “What do I put around Jev in production?”

```
(Jev OR TypeSafe OR "System One") (harness OR production OR confidence OR policy OR eval OR "false positive")
```
```
("agent harness" OR "throw away" OR "just call the API") (Jev OR TypeSafe)
```

**Value:**  
Keep the decide layer; drop the agent loop if options are structured. Confidence gate + shadow_noop is the missing middle between “raw API” and “full agent framework.”

### 4. Alert / on-call / routing

```
(Jev OR TypeSafe) (alert OR pager OR oncall OR suppress OR "false positive" OR triage)
```

**Value:**  
Alert recipe: disposition Choice + severity Score + needs_human Noul → policy; low confidence → review queue instead of page.

### 5. Founder / launch gravity (quote, don’t reply-spam)

| Target | URL / handle | How to engage |
| --- | --- | --- |
| Diogo / CompleteSkeptic launch | https://x.com/CompleteSkeptic/status/2099925682726002904 | **Quote** with our bakeoff (see `x-launch-thread.md`) — primary, not a pile-on reply |
| @typesafeai | search latest | One constructive builder post max; no “pls RT” |
| Threads citing gregpr07 / Browser Use + Jev | search `Jev Browser Use` | Add harness angle only if someone asks about production gating |

### 6. People talking “harness” skepticism

```
("agent harness" OR "harness for agents" OR "throw away the harness") (LLM OR agent OR Jev)
```

**Value:**  
Agree that agent loops get thrown away; disagree that *policy + confidence + shadow* should. Link repo as the thin version of that.

---

## Reply quality bar (must pass all)

1. Answers a concrete question or adds a mechanism they missed.  
2. Uses **our** measured numbers only (48.9s / 1.3s / ~$0.00045) or no numbers.  
3. One repo link max; no identical copy across threads.  
4. Not a reply to pure praise / meme / “W” posts.  
5. Not within a thread we already answered (`x-engager-seen.json`).

## After posting a reply

- [ ] Append id/url/why/at to `research/x-engager-seen.json` `replied`  
- [ ] Tick checkbox in `research/path-to-200-stars-EXECUTE.md`
