/**
 * Live-measure OpenClaw-map hot paths with jev-harness recipes.
 * NEVER invent timings — writes MEASURED_LIVE JSON under out/.
 *
 *   npx tsx demos/proof/openclaw-contrast/run-jev.mts
 *   npx tsx demos/proof/openclaw-contrast/run-jev.mts tool-picker ship-gate
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { DecisionHarness } from "../../../src/index.js";
import { runToolPicker } from "../../../recipes/candidate-action-selection/tool-picker.js";
import { runBrowserNextAction } from "../../../recipes/candidate-action-selection/browser-next-action.js";
import { runAgentStuckDrift } from "../../../recipes/verify-gate/agent-stuck-drift.js";
import { runShipGate } from "../../../recipes/verify-gate/ship-gate.js";
import { runInboxTriage } from "../../../recipes/confidence-front-door/inbox-triage.js";
import {
  FIXTURES,
  banner,
  countBy,
  mapPool,
  requireApiKey,
  sumUsage,
  writeResult,
  type MeasuredPayload,
} from "./_util.mts";

const ALL = [
  "tool-picker",
  "browser-next-action",
  "agent-stuck-drift",
  "ship-gate",
  "inbox-triage",
] as const;
type CaseId = (typeof ALL)[number];

function loadJson<T>(name: string): T {
  return JSON.parse(readFileSync(join(FIXTURES, name), "utf8")) as T;
}

async function measureToolPicker(harness: DecisionHarness): Promise<number> {
  const fix = loadJson<{
    tools_catalog: Array<{ id: string; description: string }>;
    cases: Array<{ id: string; goal: string; context?: string; history?: string[] }>;
  }>("tool-picker.json");
  const concurrency = 4;
  banner("OPENCLAW CONTRAST — tool-picker (LIVE)");
  console.log(`cases       : ${fix.cases.length}`);
  console.log(`concurrency : ${concurrency}`);
  const started_at = new Date().toISOString();
  console.log(`started     : ${started_at}`);

  const t0 = performance.now();
  const results = await mapPool(fix.cases, concurrency, async (c) => {
    const r = await runToolPicker(
      harness,
      {
        goal: c.goal,
        tools: fix.tools_catalog,
        context: c.context,
        history: c.history,
      },
      { id: c.id },
    );
    return { id: c.id, goal: c.goal, result: r };
  });
  const wall_ms = Math.round(performance.now() - t0);
  const finished_at = new Date().toISOString();
  const by = countBy(results.map((x) => String(x.result.action)));
  const usage = sumUsage(results.map((x) => x.result));

  console.log(`finished    : ${finished_at}`);
  console.log(`WALL_MS     : ${wall_ms}`);
  console.log(`actions     : ${JSON.stringify(by)}`);
  console.log(`tokens      : in=${usage.input_tokens} out=${usage.output_tokens}`);

  const payload: MeasuredPayload = {
    id: "tool-picker",
    label: "tool-picker / candidate-action-select",
    recipe: "recipes/candidate-action-selection/tool-picker.ts",
    measured: "MEASURED_LIVE",
    wall_ms,
    started_at,
    finished_at,
    n: fix.cases.length,
    quality: {
      actions: by,
      concurrency,
      ...usage,
      per_case_avg_ms: Math.round(wall_ms / fix.cases.length),
    },
    items: results.map((x) => ({
      id: x.id,
      goal: x.goal,
      action: x.result.action,
      confidence: x.result.confidence,
    })),
    notes: [
      "OpenClaw map: tool-picker / candidate-action-select (same Choice-over-ids shape)",
    ],
    openclaw_map: "tool-picker / candidate-action-select",
  };
  console.log(`wrote       : ${writeResult("tool-picker", payload)}`);
  return wall_ms;
}

async function measureBrowser(harness: DecisionHarness): Promise<number> {
  const fix = loadJson<{
    cases: Array<{
      id: string;
      goal: string;
      url: string;
      candidates: Array<{ id: string; description: string }>;
      history?: string[];
    }>;
  }>("browser-next-action.json");
  const concurrency = 4;
  banner("OPENCLAW CONTRAST — browser-next-action (LIVE)");
  console.log(`cases       : ${fix.cases.length}`);
  console.log(`concurrency : ${concurrency}`);
  const started_at = new Date().toISOString();
  console.log(`started     : ${started_at}`);

  const t0 = performance.now();
  const results = await mapPool(fix.cases, concurrency, async (c) => {
    const r = await runBrowserNextAction(
      harness,
      {
        goal: c.goal,
        url: c.url,
        candidates: c.candidates,
        history: c.history,
      },
      { id: c.id },
    );
    return { id: c.id, goal: c.goal, url: c.url, result: r };
  });
  const wall_ms = Math.round(performance.now() - t0);
  const finished_at = new Date().toISOString();
  const by = countBy(results.map((x) => String(x.result.action)));
  const usage = sumUsage(results.map((x) => x.result));

  console.log(`finished    : ${finished_at}`);
  console.log(`WALL_MS     : ${wall_ms}`);
  console.log(`actions     : ${JSON.stringify(by)}`);
  console.log(`tokens      : in=${usage.input_tokens} out=${usage.output_tokens}`);

  const payload: MeasuredPayload = {
    id: "browser-next-action",
    label: "browser-next-action",
    recipe: "recipes/candidate-action-selection/browser-next-action.ts",
    measured: "MEASURED_LIVE",
    wall_ms,
    started_at,
    finished_at,
    n: fix.cases.length,
    quality: {
      actions: by,
      concurrency,
      ...usage,
      per_case_avg_ms: Math.round(wall_ms / fix.cases.length),
    },
    items: results.map((x) => ({
      id: x.id,
      goal: x.goal,
      url: x.url,
      action: x.result.action,
      confidence: x.result.confidence,
    })),
    openclaw_map: "browser-next-action",
  };
  console.log(`wrote       : ${writeResult("browser-next-action", payload)}`);
  return wall_ms;
}

async function measureStuck(harness: DecisionHarness): Promise<number> {
  const fix = loadJson<{
    cases: Array<{
      id: string;
      goal: string;
      trace_tail: string[];
      test_summary?: string;
      claimed_done?: boolean;
    }>;
  }>("agent-stuck-drift.json");
  const concurrency = 4;
  banner("OPENCLAW CONTRAST — agent-stuck-drift (LIVE)");
  console.log(`cases       : ${fix.cases.length}`);
  console.log(`concurrency : ${concurrency}`);
  const started_at = new Date().toISOString();
  console.log(`started     : ${started_at}`);

  const t0 = performance.now();
  const results = await mapPool(fix.cases, concurrency, async (c) => {
    const r = await runAgentStuckDrift(
      harness,
      {
        goal: c.goal,
        trace_tail: c.trace_tail,
        test_summary: c.test_summary,
        claimed_done: c.claimed_done,
      },
      { id: c.id },
    );
    return { id: c.id, goal: c.goal, result: r };
  });
  const wall_ms = Math.round(performance.now() - t0);
  const finished_at = new Date().toISOString();
  const by = countBy(results.map((x) => String(x.result.action)));
  const usage = sumUsage(results.map((x) => x.result));

  console.log(`finished    : ${finished_at}`);
  console.log(`WALL_MS     : ${wall_ms}`);
  console.log(`actions     : ${JSON.stringify(by)}`);
  console.log(`tokens      : in=${usage.input_tokens} out=${usage.output_tokens}`);

  const payload: MeasuredPayload = {
    id: "agent-stuck-drift",
    label: "agent-stuck-drift",
    recipe: "recipes/verify-gate/agent-stuck-drift.ts",
    measured: "MEASURED_LIVE",
    wall_ms,
    started_at,
    finished_at,
    n: fix.cases.length,
    quality: {
      actions: by,
      concurrency,
      ...usage,
      per_case_avg_ms: Math.round(wall_ms / fix.cases.length),
    },
    items: results.map((x) => ({
      id: x.id,
      goal: x.goal,
      action: x.result.action,
      confidence: x.result.confidence,
    })),
    openclaw_map: "agent-stuck-drift",
  };
  console.log(`wrote       : ${writeResult("agent-stuck-drift", payload)}`);
  return wall_ms;
}

async function measureShip(harness: DecisionHarness): Promise<number> {
  const fix = loadJson<{
    policy?: string;
    cases: Array<{
      id: string;
      user_request: string;
      candidate_output: string;
      evidence?: string;
    }>;
  }>("ship-gate.json");
  const concurrency = 4;
  banner("OPENCLAW CONTRAST — ship-gate (LIVE)");
  console.log(`cases       : ${fix.cases.length}`);
  console.log(`concurrency : ${concurrency}`);
  const started_at = new Date().toISOString();
  console.log(`started     : ${started_at}`);

  const t0 = performance.now();
  const results = await mapPool(fix.cases, concurrency, async (c) => {
    const r = await runShipGate(
      harness,
      {
        user_request: c.user_request,
        candidate_output: c.candidate_output,
        evidence: c.evidence,
        policy: fix.policy,
      },
      { id: c.id },
    );
    return { id: c.id, user_request: c.user_request, result: r };
  });
  const wall_ms = Math.round(performance.now() - t0);
  const finished_at = new Date().toISOString();
  const by = countBy(results.map((x) => String(x.result.action)));
  const usage = sumUsage(results.map((x) => x.result));

  console.log(`finished    : ${finished_at}`);
  console.log(`WALL_MS     : ${wall_ms}`);
  console.log(`actions     : ${JSON.stringify(by)}`);
  console.log(`tokens      : in=${usage.input_tokens} out=${usage.output_tokens}`);

  const payload: MeasuredPayload = {
    id: "ship-gate",
    label: "ship-gate",
    recipe: "recipes/verify-gate/ship-gate.ts",
    measured: "MEASURED_LIVE",
    wall_ms,
    started_at,
    finished_at,
    n: fix.cases.length,
    quality: {
      actions: by,
      concurrency,
      ...usage,
      per_case_avg_ms: Math.round(wall_ms / fix.cases.length),
    },
    items: results.map((x) => ({
      id: x.id,
      user_request: x.user_request,
      action: x.result.action,
      confidence: x.result.confidence,
    })),
    openclaw_map: "ship-gate",
  };
  console.log(`wrote       : ${writeResult("ship-gate", payload)}`);
  return wall_ms;
}

async function measureInbox(harness: DecisionHarness): Promise<number> {
  const fix = loadJson<{
    cases: Array<{ id: string; from?: string; subject?: string; body: string }>;
  }>("inbox-triage.json");
  const concurrency = 5;
  banner("OPENCLAW CONTRAST — inbox-triage (LIVE)");
  console.log(`cases       : ${fix.cases.length}`);
  console.log(`concurrency : ${concurrency}`);
  const started_at = new Date().toISOString();
  console.log(`started     : ${started_at}`);

  const t0 = performance.now();
  const results = await mapPool(fix.cases, concurrency, async (c) => {
    const r = await runInboxTriage(
      harness,
      { from: c.from, subject: c.subject, body: c.body },
      { id: c.id },
    );
    return { id: c.id, subject: c.subject, result: r };
  });
  const wall_ms = Math.round(performance.now() - t0);
  const finished_at = new Date().toISOString();
  const by = countBy(results.map((x) => String(x.result.action)));
  const usage = sumUsage(results.map((x) => x.result));

  console.log(`finished    : ${finished_at}`);
  console.log(`WALL_MS     : ${wall_ms}`);
  console.log(`actions     : ${JSON.stringify(by)}`);
  console.log(`tokens      : in=${usage.input_tokens} out=${usage.output_tokens}`);

  const payload: MeasuredPayload = {
    id: "inbox-triage",
    label: "inbox-triage (alert-gate-shaped batch)",
    recipe: "recipes/confidence-front-door/inbox-triage.ts",
    measured: "MEASURED_LIVE",
    wall_ms,
    started_at,
    finished_at,
    n: fix.cases.length,
    quality: {
      actions: by,
      concurrency,
      ...usage,
      per_case_avg_ms: Math.round(wall_ms / fix.cases.length),
    },
    items: results.map((x) => ({
      id: x.id,
      subject: x.subject,
      action: x.result.action,
      confidence: x.result.confidence,
    })),
    openclaw_map: "inbox-triage",
  };
  console.log(`wrote       : ${writeResult("inbox-triage", payload)}`);
  return wall_ms;
}

async function main() {
  requireApiKey();
  const want = process.argv.slice(2).filter((a) => !a.startsWith("-"));
  const cases: CaseId[] = want.length ? (want as CaseId[]) : [...ALL];
  for (const c of cases) {
    if (!(ALL as readonly string[]).includes(c)) {
      console.error(`unknown case ${c}; choose from: ${ALL.join(", ")}`);
      process.exit(2);
    }
  }

  const harness = new DecisionHarness({ logger: false });
  const summary: Record<string, number> = {};

  for (const c of cases) {
    if (c === "tool-picker") summary[c] = await measureToolPicker(harness);
    else if (c === "browser-next-action") summary[c] = await measureBrowser(harness);
    else if (c === "agent-stuck-drift") summary[c] = await measureStuck(harness);
    else if (c === "ship-gate") summary[c] = await measureShip(harness);
    else if (c === "inbox-triage") summary[c] = await measureInbox(harness);
  }

  console.log("\n" + "=".repeat(72));
  console.log("SUMMARY wall_ms (MEASURED_LIVE)");
  for (const [k, v] of Object.entries(summary)) {
    console.log(`  ${k.padEnd(22)} ${v} ms`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
