import { DecisionHarness } from "../../../../src/index.js";
import { runWhoSpeaksNext } from "../../../../recipes/agent-comm-harness/who-speaks-next.js";

const harness = new DecisionHarness({ logger: false });
const t0 = performance.now();
const r = await runWhoSpeaksNext(
  harness,
  {
    goal: "Design a 3-agent pipeline that monitors Polymarket BTC 15m markets and decides whether to place a small arb. Output: roles, decision gates, kill criteria.",
    agents: [
      { id: "researcher", role: "Gather market structure, fee/slippage, timing constraints" },
      { id: "critic", role: "Attack false arb assumptions and risk" },
      { id: "synthesizer", role: "Merge into concrete roles/gates/kills" },
    ],
    transcript_tail: ["coordinator: round 1 start — need concrete pipeline design"],
  },
  { id: "arm-b-smoke", mode: "live" },
);
const wall = performance.now() - t0;
console.log(
  JSON.stringify(
    {
      action: r.action,
      intended: r.intendedAction,
      confidence: r.confidence,
      wall_ms: Math.round(wall),
      next_speaker: (r.answers as any)?.next_speaker,
      progress: (r.answers as any)?.progress,
      needs_handoff: (r.answers as any)?.needs_handoff,
      reason: r.reason,
    },
    null,
    2,
  ),
);
