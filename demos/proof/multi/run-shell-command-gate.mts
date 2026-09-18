/**
 * Live measure: shell-command-gate over ~12 safe/dangerous/ambiguous commands.
 *   npx tsx demos/proof/multi/run-shell-command-gate.mts
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { DecisionHarness } from "../../../src/index.js";
import { runShellCommandGate } from "../../../recipes/verify-gate/shell-command-gate.js";
import {
  FIXTURES,
  banner,
  countBy,
  mapPool,
  requireApiKey,
  sumUsage,
  writeResult,
} from "./_util.mts";

type CmdFix = {
  user_goal: string;
  known_safe: string[];
  commands: Array<{ id: string; command: string; expected_bucket: string }>;
};

async function main() {
  requireApiKey();
  const fix = JSON.parse(readFileSync(join(FIXTURES, "shell-commands.json"), "utf8")) as CmdFix;
  const harness = new DecisionHarness({ logger: false });
  const concurrency = 4;

  banner("MULTI PROOF — shell-command-gate (LIVE)");
  console.log(`commands    : ${fix.commands.length}`);
  console.log(`concurrency : ${concurrency}`);
  const started_at = new Date().toISOString();
  console.log(`started     : ${started_at}`);

  const t0 = performance.now();
  const results = await mapPool(fix.commands, concurrency, async (c) => {
    const r = await runShellCommandGate(
      harness,
      {
        command: c.command,
        known_safe: fix.known_safe,
        user_goal: fix.user_goal,
        cwd: "/workspace/jev-harness",
        policy: "Deny irreversible / exfil; ask on ambiguous; allow known-safe reads",
      },
      { id: c.id },
    );
    return { id: c.id, command: c.command, expected_bucket: c.expected_bucket, result: r };
  });
  const wall_ms = Math.round(performance.now() - t0);
  const finished_at = new Date().toISOString();

  const actions = results.map((x) => String(x.result.action));
  const by = countBy(actions);
  const usage = sumUsage(results.map((x) => x.result));

  console.log(`finished    : ${finished_at}`);
  console.log(`WALL_MS     : ${wall_ms}`);
  console.log(
    `quality     : allow=${by.allow ?? 0} deny=${by.deny ?? 0} ask=${by.ask ?? 0} suppress=${by.suppress ?? 0}`,
  );
  console.log(`tokens      : in=${usage.input_tokens} out=${usage.output_tokens}`);

  const path = writeResult("shell-command-gate", {
    id: "shell-command-gate",
    label: "shell-command-gate (~12 commands)",
    recipe: "recipes/verify-gate/shell-command-gate.ts",
    measured: "MEASURED_LIVE",
    wall_ms,
    started_at,
    finished_at,
    n: fix.commands.length,
    quality: {
      actions: by,
      concurrency,
      ...usage,
      per_cmd_avg_ms: Math.round(wall_ms / fix.commands.length),
    },
    items: results.map((x) => ({
      id: x.id,
      command: x.command,
      expected_bucket: x.expected_bucket,
      action: x.result.action,
      confidence: x.result.confidence,
      reason: x.result.reason,
    })),
  });
  console.log(`wrote       : ${path}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
