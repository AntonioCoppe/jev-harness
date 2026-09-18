/**
 * Live measure: model-cost-router over ~10 prompts (cheap/mid/frontier).
 *   npx tsx demos/proof/multi/run-model-cost-router.mts
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { DecisionHarness } from "../../../src/index.js";
import {
  pctRoutedCheap,
  runModelCostRouter,
} from "../../../recipes/confidence-front-door/model-cost-router.js";
import {
  FIXTURES,
  banner,
  countBy,
  mapPool,
  requireApiKey,
  sumUsage,
  writeResult,
} from "./_util.mts";

type PromptFix = {
  prompts: Array<{ id: string; prompt: string; label: string }>;
};

async function main() {
  requireApiKey();
  const fix = JSON.parse(readFileSync(join(FIXTURES, "prompts.json"), "utf8")) as PromptFix;
  const harness = new DecisionHarness({ logger: false });
  const concurrency = 4;

  banner("MULTI PROOF — model-cost-router (LIVE)");
  console.log(`prompts     : ${fix.prompts.length}`);
  console.log(`concurrency : ${concurrency}`);
  const started_at = new Date().toISOString();
  console.log(`started     : ${started_at}`);

  const t0 = performance.now();
  const results = await mapPool(fix.prompts, concurrency, async (p) => {
    const r = await runModelCostRouter(harness, p.prompt, { id: p.id });
    return { id: p.id, prompt: p.prompt, label: p.label, result: r };
  });
  const wall_ms = Math.round(performance.now() - t0);
  const finished_at = new Date().toISOString();

  const actions = results.map((x) => String(x.result.action));
  const by = countBy(actions);
  const usage = sumUsage(results.map((x) => x.result));
  const cheapStats = pctRoutedCheap(actions);

  console.log(`finished    : ${finished_at}`);
  console.log(`WALL_MS     : ${wall_ms}`);
  console.log(
    `quality     : cheap=${by.cheap ?? 0} mid=${by.mid ?? 0} frontier=${by.frontier ?? 0} pctCheap=${(cheapStats.pctCheap * 100).toFixed(0)}%`,
  );
  console.log(`tokens      : in=${usage.input_tokens} out=${usage.output_tokens}`);

  const path = writeResult("model-cost-router", {
    id: "model-cost-router",
    label: "model-cost-router (~10 prompts)",
    recipe: "recipes/confidence-front-door/model-cost-router.ts",
    measured: "MEASURED_LIVE",
    wall_ms,
    started_at,
    finished_at,
    n: fix.prompts.length,
    quality: {
      actions: by,
      pct_cheap: cheapStats.pctCheap,
      concurrency,
      ...usage,
      per_prompt_avg_ms: Math.round(wall_ms / fix.prompts.length),
    },
    items: results.map((x) => ({
      id: x.id,
      label_hint: x.label,
      prompt: x.prompt.slice(0, 120),
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
