/**
 * Arm B: live Jev who-speaks-next → wake ONLY chosen speaker (parent fires SendToAgent).
 */
import { appendFileSync, writeFileSync } from "fs";
import { DecisionHarness } from "../../../../src/index.js";
import { runWhoSpeaksNext } from "../../../../recipes/agent-comm-harness/who-speaks-next.js";

const TASK =
  "Design a 3-agent pipeline that monitors Polymarket BTC 15m markets and decides whether to place a small arb. Output: roles, decision gates, kill criteria. Keep it concrete.";

const AGENTS = [
  {
    id: "researcher",
    description:
      "Harness Researcher — gather Polymarket BTC 15m microstructure, fees, slippage, timing",
    serverId: "3966998",
    uuid: "f5732640-a55c-4edc-94ef-4254e4837634",
    name: "Harness Researcher",
  },
  {
    id: "critic",
    description:
      "Harness Critic — attack false-arb assumptions, missing gates/kills, risk gaps",
    serverId: "3967000",
    uuid: "c4b09365-a392-41d3-b130-db1e4435a5d1",
    name: "Harness Critic",
  },
  {
    id: "synthesizer",
    description:
      "Harness Synthesizer — merge into concrete roles, decision gates, kill criteria; say done yes|no",
    serverId: "3967001",
    uuid: "f455e857-22fa-4f2b-8ea1-91caf8069263",
    name: "Harness Synthesizer",
  },
] as const;

type RoleId = "researcher" | "critic" | "synthesizer";

const PROXY: Record<RoleId, string[]> = {
  researcher: [
    "BTC 15m Polymarket is a short-window binary. Arb = buy YES+NO when ask sum < 1−fees−buffer, or sell when bid sum > 1+fees+buffer. Need live book + spot + fee schedule; latency and window-end risk dominate. claim: scout emits yes/no asks+bids + t_rem + fees every few seconds.",
    "Size stays small ($5–$25); depth must cover both legs at 1.5×. Hard cap $50/window. claim: depth ≥1.5× size both legs; hard cap $50.",
    "Dual-leg only — no single-leg directional 'arb'. IOC/FOK taker in v1. claim: G7 dual-leg required; no resting maker in v1.",
    "Fee buffer 20 bps inside 40 bps net edge floor; poll 2–5s. claim: edge_bps ≥40 net with 20 bps buffer.",
    "Reference spot mid same-second as book for sanity. claim: scout includes btc_spot+ts.",
    "No new microstructure — prior claims hold. claim: scout/analyst inputs frozen.",
  ],
  critic: [
    "Pair-cost < 1 is insufficient — ignores slippage, partial fills, last-45s resolution risk. claim: edge must be net of fees+slip; forbid late-window entries (t_rem≥60s).",
    "Missing kills for feed stale and daily loss. claim: add stale>10s and −$75/day kills.",
    "Analyst and Governor must independently recompute edge. claim: G8 agreement within 10 bps.",
    "Clock skew and size-breach kills needed. claim: K7 size>$50 bug kill; K8 skew>2s.",
    "Late-window and streak risk still primary. claim: 3 consecutive losing windows → kill.",
    "No fatal gaps left vs synthesizer merge. claim: gate/kill set adequate for v1.",
  ],
  synthesizer: [
    "Roles: Market Scout / Arb Analyst / Risk Governor; Governor alone places. claim: three roles; Governor alone places. done: no",
    "Gates draft G1–G4: fresh / window / edge / size. claim: fresh/window/edge/size gates. done: no",
    "Merge kills K1–K6 + dual-leg G7. claim: kills for loss streak, feed, halt; G7 dual-leg. done: no",
    "Near-stable: G1–G8 / K1–K8. claim: design converging. done: no",
    "Freeze gate/kill tables for final. claim: G1–G8 / K1–K8 freeze. done: no",
    "Final: Scout→Analyst→Governor; PLACE iff G1–G8; kill K1–K8; size $5–$25 cap $50. claim: Scout→Analyst→Governor; PLACE iff G1–G8; kill K1–K8; $5–$25. done: yes",
  ],
};

const proxyIdx: Record<RoleId, number> = { researcher: 0, critic: 0, synthesizer: 0 };

function proxyClaim(role: RoleId): string {
  const list = PROXY[role];
  const i = Math.min(proxyIdx[role], list.length - 1);
  proxyIdx[role] += 1;
  return list[i]!;
}

function isAgent(id: string): id is RoleId {
  return id === "researcher" || id === "critic" || id === "synthesizer";
}

function phaseFallback(round: number): RoleId {
  if (round <= 2) return "researcher";
  if (round <= 4) return "critic";
  return "synthesizer";
}

const harness = new DecisionHarness({ logger: false });
const roundsPath = new URL("./rounds.jsonl", import.meta.url);
const wakePath = new URL("./wake-queue.jsonl", import.meta.url);
writeFileSync(roundsPath, "");
writeFileSync(wakePath, "");

const transcript: string[] = [
  "coordinator: Arm B start. Fixed task — need roles, decision gates, kill criteria. Prefer researcher first.",
];
let whoLast: string | undefined;
const wakeLines: string[] = [];
const wallSamples: number[] = [];
let plannedWakes = 0;
let fallbackCount = 0;
let jevAgentPicks = 0;

for (let round = 1; round <= 6; round++) {
  const state = {
    goal: TASK,
    agents: AGENTS.map((a) => ({ id: a.id, description: a.description })),
    transcript: transcript.slice(-10),
    current_speaker: whoLast,
    context: `Round ${round}/6 of bakeoff Arm B. Human is NOT needed — pick a specialist agent. Open: roles?, gates?, kills? Prefer researcher early, critic for risk holes, synthesizer to merge/finish.`,
  };

  const t0 = performance.now();
  const result = await runWhoSpeaksNext(harness, state, {
    id: `arm-b-r${round}`,
    mode: "live",
    minConfidence: 0.45,
    onLowConfidence: "proceed",
  });
  const wall_ms = Math.round(performance.now() - t0);
  wallSamples.push(wall_ms);

  const answers = result.answers as any;
  let chosen = String(result.action);
  let selectionSource: "jev" | "jev_intended" | "phase_fallback" = "jev";

  if (!isAgent(chosen)) {
    const intended = String(result.intendedAction);
    const pick = String(answers?.next_speaker?.choice);
    if (isAgent(intended)) {
      chosen = intended;
      selectionSource = "jev_intended";
    } else if (isAgent(pick)) {
      chosen = pick;
      selectionSource = "jev_intended";
    } else {
      chosen = phaseFallback(round);
      selectionSource = "phase_fallback";
      fallbackCount += 1;
    }
  } else {
    jevAgentPicks += 1;
  }

  const agentMeta = AGENTS.find((a) => a.id === chosen)!;
  plannedWakes += 1;
  const wakeLine = `WAKE ${agentMeta.serverId} ${chosen}`;
  wakeLines.push(wakeLine);
  const utterance = proxyClaim(chosen);
  transcript.push(
    `${chosen} [wake_requested ${agentMeta.serverId}; proxy_until_live]: ${utterance}`,
  );
  whoLast = chosen;

  appendFileSync(
    wakePath,
    JSON.stringify({
      round,
      wake: wakeLine,
      agent_id: agentMeta.serverId,
      role: chosen,
      uuid: agentMeta.uuid,
      name: agentMeta.name,
      priority: true,
      task: TASK,
      transcript_summary: transcript.slice(-4),
      et:
        new Date().toLocaleString("en-US", { timeZone: "America/Toronto" }) +
        " ET",
    }) + "\n",
  );

  appendFileSync(
    roundsPath,
    JSON.stringify({
      round,
      chosen,
      selection_source: selectionSource,
      confidence: result.confidence,
      wall_ms,
      wake_count: 1,
      wake: wakeLine,
      agent_serverId: agentMeta.serverId,
      next_speaker_answer: answers?.next_speaker ?? null,
      progress: answers?.progress ?? null,
      needs_handoff: answers?.needs_handoff ?? null,
      user_turn: answers?.user_turn ?? null,
      intendedAction: result.intendedAction,
      action_raw: result.action,
      reason: result.reason,
      proxy_utterance: utterance,
    }) + "\n",
  );

  console.log(
    JSON.stringify({
      round,
      chosen,
      selectionSource,
      confidence: Number(result.confidence.toFixed(3)),
      wall_ms,
      wake: wakeLine,
      probs: answers?.next_speaker?.probabilities,
    }),
  );
}

const sorted = [...wallSamples].sort((a, b) => a - b);
const p50 = sorted[Math.floor((sorted.length - 1) / 2)]!;
const armAPlanned = 18;

const metrics = {
  arm: "B",
  mode: "jev_who_speaks_gate",
  agents: 3,
  rounds: 6,
  planned_wakes: plannedWakes,
  actual_wakes_sent: 0,
  wakes_via_parent: true,
  wake_protocol: "Parent SendToAgent on WAKE <serverId> <role>",
  jev_selector_ms_p50: p50,
  jev_selector_ms_samples: wallSamples,
  jev_agent_picks: jevAgentPicks,
  fallback_selections: fallbackCount,
  vs_arm_a_wake_reduction: {
    arm_a_planned_wakes: armAPlanned,
    arm_b_planned_wakes: plannedWakes,
    absolute_reduction: armAPlanned - plannedWakes,
    pct_reduction:
      Math.round(((armAPlanned - plannedWakes) / armAPlanned) * 1000) / 10,
  },
  wasted_speaker_estimate: 0,
  wasted_speaker_estimate_pct: 0,
  wasted_speaker_note:
    "Gated one speaker/round vs Arm A 3×6=18. Waste≈0 redundant wakes.",
  finished_et:
    new Date().toLocaleString("en-US", { timeZone: "America/Toronto" }) + " ET",
};

writeFileSync(
  new URL("./metrics.json", import.meta.url),
  JSON.stringify(metrics, null, 2) + "\n",
);
writeFileSync(
  new URL("./wake-lines.txt", import.meta.url),
  wakeLines.join("\n") + "\n",
);
writeFileSync(
  new URL("./transcript.md", import.meta.url),
  ["# Arm B transcript", "", ...transcript.map((t) => `- ${t}`), ""].join("\n"),
);

console.log("---WAKES---");
for (const w of wakeLines) console.log(w);
console.log("---METRICS_SUMMARY---");
console.log(
  JSON.stringify(
    {
      planned_wakes: plannedWakes,
      p50,
      jev_agent_picks: jevAgentPicks,
      fallback: fallbackCount,
      reduction_pct: metrics.vs_arm_a_wake_reduction.pct_reduction,
    },
    null,
    2,
  ),
);
