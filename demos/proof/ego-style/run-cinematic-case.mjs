#!/usr/bin/env node
/**
 * Cinematic terminal for ego-style clips.
 * AFTER walls: demos/proof/multi/out/<case>.json (MEASURED_LIVE)
 * BEFORE: row uses Claude 48.9s from docs/.../measured.json; others = Mac Claude CLI pending
 *
 * Usage: node demos/proof/ego-style/run-cinematic-case.mjs <row|shell|keystroke|alert|router>
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "../../..");
const MULTI = join(ROOT, "demos/proof/multi/out");
const CANON = join(ROOT, "docs/assets/marketing/proof/measured.json");

const CASES = {
  row: {
    file: "row-semantic-match.json",
    title: "row-semantic-match · 24-row NL filter",
    beforeMode: "claude48",
  },
  shell: {
    file: "shell-command-gate.json",
    title: "shell-command-gate · fx-style",
    beforeMode: "pending",
  },
  keystroke: {
    file: "keystroke-launcher.json",
    title: "keystroke-launcher · dabit3-style",
    beforeMode: "pending",
  },
  alert: {
    file: "alert-gate.json",
    title: "alert-gate · on-call front door",
    beforeMode: "pending",
  },
  router: {
    file: "model-cost-router.json",
    title: "model-cost-router · cheap→frontier",
    beforeMode: "pending",
  },
};

const caseId = (process.argv[2] || "").toLowerCase();
if (!CASES[caseId]) {
  console.error("usage: run-cinematic-case.mjs <row|shell|keystroke|alert|router>");
  process.exit(1);
}
const cfg = CASES[caseId];
const path = join(MULTI, cfg.file);
if (!existsSync(path)) {
  console.error("missing", path, "— run: npx tsx demos/proof/multi/run-all.mts");
  process.exit(1);
}
const m = JSON.parse(readFileSync(path, "utf8"));
const wallS = m.wall_ms / 1000;
const usdPerMtok = 0.042;
const usd = ((m.quality?.input_tokens || 0) / 1e6) * usdPerMtok;

let claudeBefore = null;
if (existsSync(CANON)) {
  const c = JSON.parse(readFileSync(CANON, "utf8"));
  claudeBefore = c.before?.wall_s ?? 48.856;
}

const C = {
  reset: "\x1b[0m",
  bold: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
};
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const clear = () => process.stdout.write("\x1b[2J\x1b[H");
function banner(t, c = C.cyan) {
  const bar = "=".repeat(72);
  console.log(c + bar + C.reset);
  console.log(C.bold + c + t + C.reset);
  console.log(c + bar + C.reset);
}
function clock(label, s, color = C.green) {
  return `${C.bold}${color}  WALL CLOCK  ${s.toFixed(3).padStart(8)}s${C.reset}  ${C.dim}${label}${C.reset}`;
}
function actColor(a) {
  const x = String(a).toLowerCase();
  if (["allow", "include", "notify", "cheap", "vscode", "code", "continue", "mid"].includes(x))
    return C.green;
  if (["deny", "exclude", "suppress", "none", "frontier"].includes(x)) return C.red;
  return C.yellow;
}
function itemDetail(r) {
  if (r.command) return String(r.command).slice(0, 50);
  if (r.typed_prefix !== undefined) return `prefix="${r.typed_prefix}"`;
  if (r.summary) return String(r.summary).slice(0, 50);
  if (r.prompt) return String(r.prompt).slice(0, 50);
  if (r.label_hint) return `hint=${r.label_hint}`;
  return r.id || "";
}

async function title() {
  clear();
  banner(`  jev-harness  ·  ${cfg.title}`, C.cyan);
  console.log();
  console.log(`  ${C.bold}${m.label}${C.reset}`);
  console.log(`  source : demos/proof/multi/out/${cfg.file}  ·  ${m.measured}`);
  console.log(`  n=${m.n}  ·  wall_ms=${m.wall_ms}`);
  console.log();
  if (cfg.beforeMode === "claude48") {
    console.log(
      `  ${C.dim}BEFORE${C.reset}  Claude Code CLI (Mac)  ${C.bold}${C.yellow}${(claudeBefore ?? 48.856).toFixed(1)}s${C.reset}`,
    );
  } else {
    console.log(
      `  ${C.dim}BEFORE${C.reset}  Mac Claude CLI  ${C.bold}${C.yellow}PENDING${C.reset}  ${C.dim}(not measured on this box)${C.reset}`,
    );
  }
  console.log(
    `  ${C.dim}AFTER${C.reset}   Jev + harness LIVE   ${C.bold}${C.green}${wallS.toFixed(3)}s${C.reset}`,
  );
  console.log(`  ${C.dim}ego_agent Amazon 3.71s/54.45s are NOT ours${C.reset}`);
  await sleep(2000);
}

async function beforeClaudeCompressed() {
  clear();
  const target = claudeBefore ?? 48.856;
  const compressS = Number(process.env.BEFORE_COMPRESS_S || 10);
  const steps = 40;
  const stepMs = (compressS * 1000) / steps;
  banner("  BEFORE  ·  Claude Code CLI  ·  MacBookPro", C.yellow);
  console.log(`  tool     : claude -p · sonnet · tools off`);
  console.log(`  rows     : 24  ·  MEASURED (docs/.../measured.json)`);
  console.log(`  video    : ${target.toFixed(3)}s wall compressed to ${compressS}s`);
  console.log();
  console.log(clock("Claude CLI path", 0, C.yellow));
  console.log();
  for (let i = 1; i <= steps; i++) {
    const t = (target * i) / steps;
    process.stdout.write("\x1b[2A\x1b[2K");
    console.log(clock("Claude CLI path", t, C.yellow));
    process.stdout.write("\x1b[2K");
    console.log(`  ${C.dim}${"░".repeat(Math.min(40, Math.floor((i / steps) * 40)))}${C.reset}`);
    await sleep(stepMs);
  }
  console.log();
  console.log(`${C.bold}${C.yellow}  WALL CLOCK  ${target.toFixed(3)} seconds${C.reset}`);
  await sleep(800);
}

async function beforePending() {
  clear();
  banner("  BEFORE  ·  Claude Code CLI", C.yellow);
  console.log();
  console.log(`  status : ${C.bold}${C.yellow}PENDING · Mac Claude CLI${C.reset}`);
  console.log(`  note   : ${C.dim}No signed-in Claude CLI on this Linux box.${C.reset}`);
  console.log(`  note   : ${C.dim}Do not invent a before wall. See multi/out/claude-contrast-note.json${C.reset}`);
  console.log();
  console.log(`  ${C.dim}Row-filter remains the only case with Claude BEFORE (48.9s).${C.reset}`);
  await sleep(2800);
}

async function smash() {
  clear();
  console.log();
  console.log(`${C.bold}${C.white}                          NOW                           ${C.reset}`);
  console.log();
  await sleep(400);
}

async function afterReplay() {
  clear();
  banner(`  AFTER  ·  Jev + jev-harness  ·  REPLAY (${m.measured})`, C.green);
  console.log(`  recipe : ${m.recipe}`);
  console.log(`  file   : multi/out/${cfg.file}`);
  console.log();
  console.log(clock("Jev harness", 0, C.green));
  console.log();
  const items = m.items || [];
  const n = items.length || m.n || 1;
  const playMs = Math.min(11000, Math.max(2800, wallS * 1000 * 1.15));
  const step = playMs / n;
  for (let i = 0; i < n; i++) {
    const r = items[i] || { id: `i-${i}`, action: "?" };
    const elapsed = ((i + 1) / n) * wallS;
    const ac = actColor(r.action);
    process.stdout.write("\x1b[2A\x1b[2K");
    console.log(clock("REPLAY · multi/out", elapsed, C.green));
    process.stdout.write("\x1b[2K");
    const conf = typeof r.confidence === "number" ? r.confidence.toFixed(3) : "—";
    console.log(
      `  ${ac}${C.bold}${String(r.action).padEnd(14)}${C.reset} ${C.dim}${itemDetail(r)}${C.reset}  conf ${conf}`,
    );
    await sleep(step);
  }
  console.log();
  console.log(`${C.bold}${C.green}  WALL CLOCK  ${wallS.toFixed(3)} seconds${C.reset}  ${C.dim}(= ${m.wall_ms} ms MEASURED_LIVE)${C.reset}`);
  const acts = m.quality?.actions || {};
  console.log(`  actions : ${Object.entries(acts).map(([k, v]) => `${k}=${v}`).join("  ")}`);
  if (m.quality?.per_prefix_avg_ms)
    console.log(`  per keystroke avg : ${m.quality.per_prefix_avg_ms} ms`);
  if (m.quality?.per_row_avg_ms) console.log(`  per row avg : ${m.quality.per_row_avg_ms} ms`);
  if (m.quality?.per_cmd_avg_ms) console.log(`  per cmd avg : ${m.quality.per_cmd_avg_ms} ms`);
  if (m.quality?.per_alert_avg_ms) console.log(`  per alert avg : ${m.quality.per_alert_avg_ms} ms`);
  if (m.quality?.per_prompt_avg_ms) console.log(`  per prompt avg : ${m.quality.per_prompt_avg_ms} ms`);
  if (m.quality?.pct_cheap !== undefined)
    console.log(`  pct cheap : ${(m.quality.pct_cheap * 100).toFixed(0)}%`);
  console.log(
    `  tokens in=${m.quality?.input_tokens ?? "?"} out=${m.quality?.output_tokens ?? "?"}  ·  ~$${usd.toFixed(6)}`,
  );
  await sleep(700);
}

async function endCard() {
  clear();
  banner("  RESULT  ·  MEASURED", C.cyan);
  console.log();
  if (cfg.beforeMode === "claude48") {
    console.log(
      `  ${C.bold}${C.yellow}${(claudeBefore ?? 48.856).toFixed(1)}s${C.reset}  Claude CLI  →  ${C.bold}${C.green}${wallS.toFixed(3)}s${C.reset}  Jev + harness`,
    );
    const speed = (claudeBefore ?? 48.856) / wallS;
    console.log(`  ${C.bold}${speed.toFixed(1)}× wall${C.reset}   ·   n=${m.n}`);
  } else {
    console.log(
      `  ${C.bold}${C.green}${wallS.toFixed(3)}s${C.reset}  Jev + ${m.id}  ·  n=${m.n}  ·  ${m.measured}`,
    );
    console.log(`  ${C.dim}BEFORE Claude CLI: PENDING (Mac)${C.reset}`);
  }
  console.log(`  ~$${usd.toFixed(6)}  ·  ${cfg.file}`);
  console.log();
  console.log(`  ${C.bold}${C.white}github.com/AntonioCoppe/jev-harness${C.reset}`);
  console.log();
  console.log(`  ${C.dim}Do not cite ego_agent Amazon timings as ours.${C.reset}`);
  await sleep(4200);
}

await title();
if (cfg.beforeMode === "claude48") {
  await beforeClaudeCompressed();
  await smash();
} else {
  await beforePending();
  await smash();
}
await afterReplay();
await endCard();
