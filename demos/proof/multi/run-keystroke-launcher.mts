/**
 * Live measure: keystroke-launcher over ~10 typed prefixes.
 *   npx tsx demos/proof/multi/run-keystroke-launcher.mts
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { DecisionHarness } from "../../../src/index.js";
import { runKeystrokeLauncher } from "../../../recipes/candidate-action-selection/keystroke-launcher.js";
import {
  FIXTURES,
  banner,
  countBy,
  mapPool,
  requireApiKey,
  sumUsage,
  writeResult,
} from "./_util.mts";

type LaunchFix = {
  candidates: Array<{ id: string; label: string; habit_score?: number }>;
  prefixes: Array<{ id: string; typed_prefix: string }>;
  recent_launches: string[];
};

async function main() {
  requireApiKey();
  const fix = JSON.parse(
    readFileSync(join(FIXTURES, "launcher-candidates.json"), "utf8"),
  ) as LaunchFix;
  const harness = new DecisionHarness({ logger: false });
  const concurrency = 4;

  banner("MULTI PROOF — keystroke-launcher (LIVE)");
  console.log(`prefixes    : ${fix.prefixes.length}`);
  console.log(`candidates  : ${fix.candidates.length}`);
  console.log(`concurrency : ${concurrency}`);
  const started_at = new Date().toISOString();
  console.log(`started     : ${started_at}`);

  const t0 = performance.now();
  const results = await mapPool(fix.prefixes, concurrency, async (p) => {
    const r = await runKeystrokeLauncher(
      harness,
      {
        typed_prefix: p.typed_prefix,
        candidates: fix.candidates,
        recent_launches: fix.recent_launches,
      },
      { id: p.id },
    );
    return { id: p.id, typed_prefix: p.typed_prefix, result: r };
  });
  const wall_ms = Math.round(performance.now() - t0);
  const finished_at = new Date().toISOString();

  const actions = results.map((x) => String(x.result.action));
  const by = countBy(actions);
  const usage = sumUsage(results.map((x) => x.result));
  const launched = actions.filter((a) => a !== "WAIT" && a !== "NONE" && a !== "review").length;
  const wait = actions.filter((a) => a === "WAIT" || a === "review").length;

  console.log(`finished    : ${finished_at}`);
  console.log(`WALL_MS     : ${wall_ms}`);
  console.log(`quality     : launchedish=${launched} wait/review=${wait} by=${JSON.stringify(by)}`);
  console.log(`tokens      : in=${usage.input_tokens} out=${usage.output_tokens}`);

  const path = writeResult("keystroke-launcher", {
    id: "keystroke-launcher",
    label: "keystroke-launcher (~10 prefixes)",
    recipe: "recipes/candidate-action-selection/keystroke-launcher.ts",
    measured: "MEASURED_LIVE",
    wall_ms,
    started_at,
    finished_at,
    n: fix.prefixes.length,
    quality: {
      actions: by,
      launchedish: launched,
      wait_or_review: wait,
      concurrency,
      ...usage,
      per_prefix_avg_ms: Math.round(wall_ms / fix.prefixes.length),
    },
    items: results.map((x) => ({
      id: x.id,
      typed_prefix: x.typed_prefix,
      action: x.result.action,
      confidence: x.result.confidence,
    })),
  });
  console.log(`wrote       : ${path}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
