import { DecisionHarness } from "../../../src/index.js";
import { runWhoSpeaksNext } from "../../../recipes/agent-comm-harness/who-speaks-next.js";
import { appendFileSync, mkdirSync, writeFileSync } from "fs";

const round = Number(process.argv[2] || "1");
const harness = new DecisionHarness({});
const agents = [
  { id: "researcher", description: "Harness Researcher — facts, constraints, open questions" },
  { id: "critic", description: "Harness Critic — failure modes, fees, latency risks" },
  { id: "synthesizer", description: "Harness Synthesizer — merge into concrete roles/gates/kills" },
];
const goal =
  "Design a 3-agent pipeline that monitors Polymarket BTC 15m markets and decides whether to place a small arb. Output roles, decision gates, kill criteria.";
const transcripts: Record<number, string[]> = {
  1: ["Task assigned. No speakers yet."],
  2: ["Researcher sketched Scout/Analyst/Governor roles. Need critique of latency and fees."],
  3: ["Still thin on kill criteria; critic should attack assumptions OR synthesizer should tighten."],
  4: ["Researcher spoke. Critic should stress-test fee/latency; then synthesizer locks gates."],
  5: ["Need synthesizer to emit final roles + gates + kills and mark done."],
  6: ["Final polish: synthesizer only unless a fatal hole remains for critic."],
};
const current: Record<number, string | undefined> = {
  1: undefined,
  2: "researcher",
  3: "researcher",
  4: "researcher",
  5: "critic",
  6: "synthesizer",
};
const t0 = performance.now();
const result = await runWhoSpeaksNext(harness, {
  goal,
  agents,
  current_speaker: current[round],
  transcript: transcripts[round] ?? ["Continue the design."],
  context: `Bakeoff Arm B round ${round}. Prefer rotating specialties when handoff helps.`,
});
const ms = performance.now() - t0;
const out = {
  round,
  wall_ms: Math.round(ms),
  action: result.action,
  confidence: result.confidence,
  intendedAction: (result as any).intendedAction,
  reason: (result as any).reason,
};
mkdirSync("demos/proof/agent-comm-bakeoff/arm-b", { recursive: true });
appendFileSync("demos/proof/agent-comm-bakeoff/arm-b/rounds.jsonl", JSON.stringify(out) + "\n");
writeFileSync("demos/proof/agent-comm-bakeoff/arm-b/latest-selection.json", JSON.stringify(out, null, 2));
console.log(JSON.stringify(out));
