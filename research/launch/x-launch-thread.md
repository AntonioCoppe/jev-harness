# X launch thread (post as Antonio)

1/
TypeSafe Jev is great at structured decisions.

I open-sourced the missing production layer:

jev-harness
→ policy
→ confidence gate
→ shadow mode
→ recipes
→ eval CLI

https://github.com/AntonioCoppe/jev-harness

2/
Same job, measured on my machine:

NL filter over 24 rows

Claude Code CLI: 48.9s
Jev + jev-harness: 1.3s

(terminal screenshots in reply / repo README)

3/
It’s not “another agent framework.”

It’s the control plane for System One decisions:
alert gate, model router, row filter, who-speaks-next, order allow/deny, …

4/
If you’re already playing with Jev / building agents that need fast calibrated judgments — star + try `npm i jev-harness`.

PRs welcome. Not affiliated with TypeSafe.
