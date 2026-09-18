/**
 * Measure OUR demo decision loops (canned answers, no API).
 * Writes runs/latest.json with wall-time + demo-$ for each card.
 * Cost model: DEMO_RATE_USD_PER_CALL (labeled demo meter — not a vendor quote).
 */
import { performance } from "node:perf_hooks";
import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dir = dirname(fileURLToPath(import.meta.url));
const DEMO_RATE = 0.000007; // demo meter $/decision — labeled as such in UI
const stamp = new Date().toISOString();

function confMean(parts) {
  return parts.reduce((a, b) => a + b, 0) / parts.length;
}

function measure(name, fn) {
  const t0 = performance.now();
  const result = fn();
  const ms = performance.now() - t0;
  return { name, ms, ...result };
}

// --- 1. tool retain keep/drop ---
const toolRetain = measure("tool-retain", () => {
  const spans = Array.from({ length: 128 }, (_, i) => ({
    id: `t${i}`,
    bytes: 200 + ((i * 37) % 800),
    keep: i % 3 === 0 || i % 7 === 0, // canned policy outcome
  }));
  let kept = 0, dropped = 0, bytesKept = 0, bytesAll = 0, calls = 0;
  for (const s of spans) {
    calls++;
    // simulate Choice keep|drop
    const action = s.keep ? "keep" : "drop";
    bytesAll += s.bytes;
    if (action === "keep") { kept++; bytesKept += s.bytes; } else dropped++;
  }
  const tokenProxyBefore = bytesAll; // char proxy
  const tokenProxyAfter = bytesKept;
  const savePct = ((1 - tokenProxyAfter / tokenProxyBefore) * 100);
  return {
    calls,
    kept, dropped,
    wallLabel: "128 keep/drop decisions",
    before: { tokensProxy: tokenProxyBefore, rewritten: true, ttftProxyMs: 4800 },
    after: { tokensProxy: tokenProxyAfter, rewritten: 0, kept, dropped },
    savePct: Number(savePct.toFixed(1)),
    dollars: calls * DEMO_RATE,
  };
});

// --- 2. model router ---
const modelRouter = measure("model-router", () => {
  const prompts = [
    ...Array(720).fill("faq"),
    ...Array(210).fill("mid"),
    ...Array(70).fill("hard"),
  ];
  const costs = { cheap: 0.0002, mid: 0.002, frontier: 0.02 }; // demo downstream $
  const lat = { cheap: 400, mid: 900, frontier: 2100 };
  let spend = 0, frontierSpend = 0, latSum = 0, calls = 0;
  const mix = { cheap: 0, mid: 0, frontier: 0 };
  for (const p of prompts) {
    calls++;
    const tier = p === "faq" ? "cheap" : p === "mid" ? "mid" : "frontier";
    const risk = p === "hard" ? 1.8 : p === "mid" ? 1.0 : 0.3;
    const action = risk >= 1.5 ? "frontier" : tier;
    mix[action]++;
    spend += costs[action];
    frontierSpend += costs.frontier;
    latSum += lat[action];
  }
  return {
    calls,
    mix,
    spend: Number(spend.toFixed(4)),
    frontierSpend: Number(frontierSpend.toFixed(4)),
    savePct: Number(((1 - spend / frontierSpend) * 100).toFixed(1)),
    p50proxyMs: Math.round(latSum / prompts.length),
    alwaysFrontierP50: 2100,
    dollars: calls * DEMO_RATE,
    wallLabel: "1000 routed prompts (canned)",
  };
});

// --- 3. ship gate ---
const shipGate = measure("ship-gate", () => {
  const n = 240;
  let allow = 0, revise = 0, block = 0, calls = 0;
  for (let i = 0; i < n; i++) {
    calls++;
    const grounded = (i % 17) / 17;
    const jailbreak = (i % 53) === 0 ? 0.8 : 0.05;
    const verdict = jailbreak >= 0.5 ? "block" : grounded < 0.45 ? "revise" : i % 29 === 0 ? "block" : "allow";
    if (verdict === "block") block++;
    else if (verdict === "revise") revise++;
    else allow++;
  }
  return {
    calls, allow, revise, block,
    dollars: calls * DEMO_RATE,
    wallLabel: `${n} verify-gate decisions`,
    blockedPct: Number(((block / n) * 100).toFixed(1)),
  };
});

// --- 4. alert FP gate ---
const alertFp = measure("alert-fp", () => {
  const alerts = [
    ...Array(40).fill("real"),
    ...Array(200).fill("fp"),
    ...Array(40).fill("queue"),
  ];
  let notify = 0, suppress = 0, queue = 0, calls = 0;
  for (const a of alerts) {
    calls++;
    const action = a === "real" ? "notify" : a === "fp" ? "suppress" : "queue_review";
    if (action === "notify") notify++;
    else if (action === "suppress") suppress++;
    else queue++;
  }
  const beforePages = alerts.length; // naive page-all
  return {
    calls, notify, suppress, queue,
    beforePages,
    fpDropPct: Number(((suppress / alerts.length) * 100).toFixed(1)),
    dollars: calls * DEMO_RATE,
    wallLabel: `${alerts.length} alert-gate decisions`,
  };
});

// --- 5. row filter ---
const rowFilter = measure("row-filter", () => {
  const rows = Array.from({ length: 96 }, (_, i) => ({
    id: i,
    noul: ((i * 17) % 100) / 100,
    conf: 0.55 + ((i * 13) % 40) / 100,
  }));
  let include = 0, exclude = 0, review = 0, calls = 0;
  for (const r of rows) {
    calls++;
    const action = r.conf < 0.6 ? "review" : r.noul >= 0.55 ? "include" : "exclude";
    if (action === "include") include++;
    else if (action === "exclude") exclude++;
    else review++;
  }
  // contrast: pretend LLM-per-row class cost (demo contrast only, our measured $ is jev-demo meter)
  const llmClassDollars = rows.length * 0.08;
  return {
    calls, include, exclude, review, rows: rows.length,
    dollars: calls * DEMO_RATE,
    llmClassDollars: Number(llmClassDollars.toFixed(2)),
    wallLabel: `${rows.length} row-judgments`,
  };
});

// --- 6. ui candidate click ---
const uiAction = measure("ui-action", () => {
  const steps = [
    { candidates: 5, pick: 3 },
    { candidates: 4, pick: 0 },
    { candidates: 3, pick: "STOP" },
  ];
  let calls = 0;
  const stepMs = [];
  for (const s of steps) {
    const t0 = performance.now();
    // hot loop: score canned distribution
    const dist = Array.from({ length: s.candidates }, (_, i) => Math.random());
    const sum = dist.reduce((a, b) => a + b, 0);
    dist.map((x) => x / sum);
    calls++;
    // busywork to get non-zero measurable local loop time
    let x = 0;
    for (let i = 0; i < 20000; i++) x += Math.sin(i);
    stepMs.push(performance.now() - t0);
  }
  const meanStep = stepMs.reduce((a, b) => a + b, 0) / stepMs.length;
  return {
    calls,
    steps: steps.length,
    meanStepMs: Number(meanStep.toFixed(2)),
    stepMs: stepMs.map((m) => Number(m.toFixed(2))),
    dollars: calls * DEMO_RATE,
    wallLabel: `${steps.length}-step candidate loop`,
    visionClassMs: 3200, // illustrative contrast class, labeled
  };
});

const runs = {
  stamp,
  demoRateUsdPerCall: DEMO_RATE,
  note: "Wall times are performance.now() around OUR canned decision loops (no TypeSafe API). $ = calls × demoRate (labeled DEMO meter, not a vendor price quote). Contrast columns are illustrative classes, not third-party benchmarks.",
  results: { toolRetain, modelRouter, shipGate, alertFp, rowFilter, uiAction },
};

const out = join(__dir, "latest.json");
writeFileSync(out, JSON.stringify(runs, null, 2));
console.log(JSON.stringify(runs, null, 2));
console.log("wrote", out);
