/**
 * Live measure: row-semantic-match / mapRows over 24 people rows.
 *   npx tsx demos/proof/multi/run-row-semantic-match.mts
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { DecisionHarness } from "../../../src/index.js";
import { mapRows } from "../../../recipes/row-judgment/batch.js";
import {
  FIXTURES,
  banner,
  countBy,
  requireApiKey,
  sumUsage,
  writeResult,
} from "./_util.mts";

async function main() {
  requireApiKey();
  const people = JSON.parse(readFileSync(join(FIXTURES, "people.json"), "utf8"));
  const predicate = readFileSync(join(FIXTURES, "predicate.txt"), "utf8").trim();
  const harness = new DecisionHarness({ logger: false });
  const concurrency = 8;

  banner("MULTI PROOF — row-semantic-match / mapRows (LIVE)");
  console.log(`rows        : ${people.length}`);
  console.log(`predicate   : ${predicate}`);
  console.log(`concurrency : ${concurrency}`);
  const started_at = new Date().toISOString();
  console.log(`started     : ${started_at}`);

  const t0 = performance.now();
  const mapped = await mapRows(harness, people, predicate, { concurrency });
  const wall_ms = Math.round(performance.now() - t0);
  const finished_at = new Date().toISOString();

  const actions = mapped.map((m) => String(m.result.action));
  const by = countBy(actions);
  const usage = sumUsage(mapped.map((m) => m.result));
  const cached = mapped.filter((m) => m.cached).length;

  console.log(`finished    : ${finished_at}`);
  console.log(`WALL_MS     : ${wall_ms}`);
  console.log(
    `quality     : include=${by.include ?? 0} exclude=${by.exclude ?? 0} review=${by.review ?? 0} cached=${cached}`,
  );
  console.log(`tokens      : in=${usage.input_tokens} out=${usage.output_tokens}`);

  const path = writeResult("row-semantic-match", {
    id: "row-semantic-match",
    label: "row-semantic-match / mapRows (24 people)",
    recipe: "recipes/row-judgment/row-semantic-match.ts + batch.mapRows",
    measured: "MEASURED_LIVE",
    wall_ms,
    started_at,
    finished_at,
    n: people.length,
    quality: {
      actions: by,
      cached,
      concurrency,
      predicate,
      ...usage,
      per_row_avg_ms: Math.round(wall_ms / people.length),
    },
    items: mapped.map((m, i) => ({
      id: (people[i] as { id?: string }).id ?? `row-${i}`,
      action: m.result.action,
      confidence: m.result.confidence,
      cached: m.cached,
    })),
  });
  console.log(`wrote       : ${path}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
