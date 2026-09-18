/**
 * Live measure: alert-gate over ~15 synthetic alerts.
 *   npx tsx demos/proof/multi/run-alert-gate.mts
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { DecisionHarness } from "../../../src/index.js";
import { runAlertGate } from "../../../recipes/confidence-front-door/alert-gate.js";
import {
  FIXTURES,
  banner,
  countBy,
  mapPool,
  requireApiKey,
  sumUsage,
  writeResult,
} from "./_util.mts";

type AlertFix = {
  policy: string;
  alerts: Array<{
    id: string;
    source: string;
    summary: string;
    signals?: Record<string, unknown>;
  }>;
};

async function main() {
  requireApiKey();
  const fix = JSON.parse(readFileSync(join(FIXTURES, "alerts.json"), "utf8")) as AlertFix;
  const harness = new DecisionHarness({ logger: false });
  const concurrency = 5;

  banner("MULTI PROOF — alert-gate (LIVE)");
  console.log(`alerts      : ${fix.alerts.length}`);
  console.log(`concurrency : ${concurrency}`);
  const started_at = new Date().toISOString();
  console.log(`started     : ${started_at}`);

  const t0 = performance.now();
  const results = await mapPool(fix.alerts, concurrency, async (a) => {
    const r = await runAlertGate(
      harness,
      {
        source: a.source,
        summary: a.summary,
        signals: a.signals,
        policy: fix.policy,
      },
      { id: a.id },
    );
    return { id: a.id, source: a.source, summary: a.summary, result: r };
  });
  const wall_ms = Math.round(performance.now() - t0);
  const finished_at = new Date().toISOString();

  const actions = results.map((x) => String(x.result.action));
  const by = countBy(actions);
  const usage = sumUsage(results.map((x) => x.result));

  console.log(`finished    : ${finished_at}`);
  console.log(`WALL_MS     : ${wall_ms}`);
  console.log(
    `quality     : notify=${by.notify ?? 0} queue_review=${by.queue_review ?? 0} suppress=${by.suppress ?? 0} review=${by.review ?? 0}`,
  );
  console.log(`tokens      : in=${usage.input_tokens} out=${usage.output_tokens}`);

  const path = writeResult("alert-gate", {
    id: "alert-gate",
    label: "alert-gate (~15 synthetic alerts)",
    recipe: "recipes/confidence-front-door/alert-gate.ts",
    measured: "MEASURED_LIVE",
    wall_ms,
    started_at,
    finished_at,
    n: fix.alerts.length,
    quality: {
      actions: by,
      concurrency,
      ...usage,
      per_alert_avg_ms: Math.round(wall_ms / fix.alerts.length),
    },
    items: results.map((x) => ({
      id: x.id,
      source: x.source,
      summary: x.summary,
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
