/**
 * Live proof runner — OUR people table × row-judgment.
 * Measures real wall ms + tokens + $ (official Jev input rate).
 * Never invents metrics. Requires TYPESAFE_API_KEY.
 *
 * Before = naive sequential runRowSemanticMatch (concurrency 1, no cache)
 * After  = mapRows (concurrency 8) via DecisionHarness
 * Cache  = second mapRows pass on warm Map
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { DecisionHarness } from "../../../src/index.js";
import {
  mapRows,
  type RowRecord,
} from "../../../recipes/row-judgment/batch.js";
import { runRowSemanticMatch } from "../../../recipes/row-judgment/row-semantic-match.js";

const __dir = dirname(fileURLToPath(import.meta.url));
const OUT_DIR = join(__dir, "out");
const PROOF_DIR = join(__dir, "../../../docs/assets/marketing/proof");

/** Official TypeSafe Jev rate (blog / docs): $0.042 / MTok input; output free. */
const JEV_USD_PER_MTOK_INPUT = 0.042;

const PREDICATE = "could work fully remote without on-site equipment";

function usdFromTokens(inputTokens: number): number {
  return (inputTokens / 1_000_000) * JEV_USD_PER_MTOK_INPUT;
}

function loadPeople(): RowRecord[] {
  const raw = JSON.parse(readFileSync(join(__dir, "people.json"), "utf8")) as RowRecord[];
  return raw;
}

async function measureNaive(
  harness: DecisionHarness,
  rows: RowRecord[],
  predicate: string,
) {
  const t0 = performance.now();
  let inputTokens = 0;
  let outputTokens = 0;
  const judgments: Array<{
    id: string;
    action: string;
    noul: number;
    strength: number;
    confidence: number;
    ms: number;
  }> = [];

  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]!;
    const r0 = performance.now();
    const result = await runRowSemanticMatch(
      harness,
      { row, predicate, row_id: String(row.id ?? i) },
      { id: `naive-${i}`, matchThreshold: 0.55 },
    );
    const ms = Math.round(performance.now() - r0);
    inputTokens += result.usage.input_tokens;
    outputTokens += result.usage.output_tokens;
    const answers = result.answers as {
      matches: { noul: number };
      strength: { score: number };
    };
    judgments.push({
      id: String(row.id ?? i),
      action: String(result.action),
      noul: answers.matches.noul,
      strength: answers.strength.score,
      confidence: result.confidence,
      ms,
    });
  }

  const wallMs = Math.round(performance.now() - t0);
  return {
    label: "naive_sequential",
    concurrency: 1,
    cache: false,
    wallMs,
    inputTokens,
    outputTokens,
    usd: usdFromTokens(inputTokens),
    include: judgments.filter((j) => j.action === "include").length,
    exclude: judgments.filter((j) => j.action === "exclude").length,
    review: judgments.filter((j) => j.action === "review").length,
    judgments,
  };
}

async function measureBatched(
  harness: DecisionHarness,
  rows: RowRecord[],
  predicate: string,
  cache: Map<string, never>,
  label: string,
) {
  const t0 = performance.now();
  const mapped = await mapRows(harness, rows, predicate, {
    concurrency: 8,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cache: cache as any,
    matchThreshold: 0.55,
  });
  const wallMs = Math.round(performance.now() - t0);

  let inputTokens = 0;
  let outputTokens = 0;
  let cached = 0;
  const judgments = mapped.map((m, i) => {
    if (m.cached) cached += 1;
    else {
      inputTokens += m.result.usage.input_tokens;
      outputTokens += m.result.usage.output_tokens;
    }
    const answers = m.result.answers as {
      matches: { noul: number };
      strength: { score: number };
    };
    return {
      id: String(m.row.id ?? i),
      action: String(m.result.action),
      noul: answers.matches.noul,
      strength: answers.strength.score,
      confidence: m.result.confidence,
      cached: m.cached,
    };
  });

  return {
    label,
    concurrency: 8,
    cache: label.includes("cache"),
    wallMs,
    inputTokens,
    outputTokens,
    usd: usdFromTokens(inputTokens),
    cachedCount: cached,
    include: judgments.filter((j) => j.action === "include").length,
    exclude: judgments.filter((j) => j.action === "exclude").length,
    review: judgments.filter((j) => j.action === "review").length,
    judgments,
  };
}

async function main() {
  if (!process.env.TYPESAFE_API_KEY?.trim()) {
    console.error("FATAL: TYPESAFE_API_KEY missing — refuse to invent metrics.");
    process.exit(2);
  }

  mkdirSync(OUT_DIR, { recursive: true });
  mkdirSync(PROOF_DIR, { recursive: true });

  const rows = loadPeople();
  const harness = new DecisionHarness({ logger: false });

  console.error(`rows=${rows.length} predicate=${JSON.stringify(PREDICATE)}`);
  console.error("measuring BEFORE (naive sequential)…");
  const before = await measureNaive(harness, rows, PREDICATE);
  console.error(
    `before wallMs=${before.wallMs} tokens_in=${before.inputTokens} usd≈$${before.usd.toFixed(6)} include=${before.include}`,
  );

  console.error("measuring AFTER (mapRows concurrency=8)…");
  const cache = new Map();
  const after = await measureBatched(harness, rows, PREDICATE, cache, "batch_concurrency_8");
  console.error(
    `after wallMs=${after.wallMs} tokens_in=${after.inputTokens} usd≈$${after.usd.toFixed(6)} include=${after.include}`,
  );

  console.error("measuring CACHE HIT (warm Map)…");
  const cacheHit = await measureBatched(harness, rows, PREDICATE, cache, "cache_hit");
  console.error(
    `cacheHit wallMs=${cacheHit.wallMs} cached=${cacheHit.cachedCount}/${rows.length}`,
  );

  const measuredAt = new Date().toISOString();
  const payload = {
    proof_id: "jev-harness-row-filter-v1",
    owner: "AntonioCoppe/jev-harness",
    label: "MEASURED",
    not_community_seed: true,
    measured_at: measuredAt,
    timezone_note: "ISO-8601 UTC; display ET for Antonio",
    predicate: PREDICATE,
    rows: rows.length,
    model: "jev-latest",
    pricing: {
      source: "TypeSafe official Jev rate",
      input_usd_per_mtok: JEV_USD_PER_MTOK_INPUT,
      output: "free",
    },
    before: {
      path: "naive sequential runRowSemanticMatch (concurrency 1, no cache)",
      wall_ms: before.wallMs,
      input_tokens: before.inputTokens,
      output_tokens: before.outputTokens,
      usd: Number(before.usd.toFixed(8)),
      include: before.include,
      exclude: before.exclude,
      review: before.review,
    },
    after: {
      path: "DecisionHarness mapRows concurrency=8",
      wall_ms: after.wallMs,
      input_tokens: after.inputTokens,
      output_tokens: after.outputTokens,
      usd: Number(after.usd.toFixed(8)),
      include: after.include,
      exclude: after.exclude,
      review: after.review,
    },
    cache_hit: {
      path: "mapRows warm in-memory cache",
      wall_ms: cacheHit.wallMs,
      cached_rows: cacheHit.cachedCount,
      input_tokens: cacheHit.inputTokens,
      usd: Number(cacheHit.usd.toFixed(8)),
    },
    deltas: {
      wall_ms_saved: before.wallMs - after.wallMs,
      wall_speedup: Number((before.wallMs / Math.max(after.wallMs, 1)).toFixed(2)),
      cache_vs_after_ms: after.wallMs - cacheHit.wallMs,
    },
    sample_rows: after.judgments.slice(0, 24).map((j) => ({
      id: j.id,
      action: j.action,
      noul: Number(j.noul.toFixed(3)),
      strength: Number(j.strength.toFixed(3)),
      confidence: Number(j.confidence.toFixed(3)),
    })),
  };

  const outJson = join(OUT_DIR, "measured.json");
  const proofJson = join(PROOF_DIR, "measured.json");
  writeFileSync(outJson, JSON.stringify(payload, null, 2));
  writeFileSync(proofJson, JSON.stringify(payload, null, 2));
  writeFileSync(join(OUT_DIR, "rows.json"), JSON.stringify(rows, null, 2));
  console.log(JSON.stringify({ wrote: [outJson, proofJson], summary: {
    rows: rows.length,
    before_wall_ms: before.wallMs,
    after_wall_ms: after.wallMs,
    cache_hit_wall_ms: cacheHit.wallMs,
    before_usd: before.usd,
    after_usd: after.usd,
    include: after.include,
  }}, null, 2));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
