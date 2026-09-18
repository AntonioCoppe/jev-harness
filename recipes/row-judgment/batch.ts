import { createHash } from "node:crypto";
import type { DecisionHarness } from "../../src/harness.js";
import type { DecisionResult } from "../../src/types.js";
import {
  runRowSemanticMatch,
  rowSemanticMatchQuestions,
  type RowMatchAction,
} from "./row-semantic-match.js";

export type RowRecord = Record<string, string | number | boolean | null | string[]>;

export type RowMatchResult = DecisionResult<
  ReturnType<typeof rowSemanticMatchQuestions>,
  RowMatchAction
>;

export interface BatchRowOptions {
  /** Max in-flight Jev calls. Default 8. */
  concurrency?: number;
  mode?: "live" | "shadow";
  minConfidence?: number;
  matchThreshold?: number;
  /**
   * Shared in-memory cache keyed by `hash(row) + predicate`.
   * Pass the same Map across calls to reuse judgments.
   */
  cache?: Map<string, RowMatchResult>;
}

export interface MappedRow {
  row: RowRecord;
  result: RowMatchResult;
  /** True when the result came from `cache` without a new API call. */
  cached: boolean;
}

/** Stable cache key: sha256(canonical JSON row) + predicate. */
export function rowPredicateCacheKey(row: RowRecord, predicate: string): string {
  const rowHash = createHash("sha256").update(stableStringify(row)).digest("hex");
  const predHash = createHash("sha256").update(predicate).digest("hex");
  return `${rowHash}:${predHash}`;
}

/**
 * Map the same NL predicate over many rows with a concurrency pool and optional cache.
 */
export async function mapRows(
  harness: DecisionHarness,
  rows: RowRecord[],
  predicate: string,
  opts?: BatchRowOptions,
): Promise<MappedRow[]> {
  const concurrency = Math.max(1, opts?.concurrency ?? 8);
  const cache = opts?.cache ?? new Map<string, RowMatchResult>();

  return mapPool(rows, concurrency, async (row, index) => {
    const key = rowPredicateCacheKey(row, predicate);
    const hit = cache.get(key);
    if (hit) {
      return { row, result: hit, cached: true };
    }
    const result = await runRowSemanticMatch(
      harness,
      { row, predicate },
      {
        mode: opts?.mode,
        id: `row-${index}`,
        minConfidence: opts?.minConfidence,
        matchThreshold: opts?.matchThreshold,
      },
    );
    cache.set(key, result);
    return { row, result, cached: false };
  });
}

/**
 * Filter rows where the semantic match action is `include`
 * (concurrency pool + in-memory cache).
 */
export async function batchFilterRows(
  harness: DecisionHarness,
  rows: RowRecord[],
  predicate: string,
  opts?: BatchRowOptions,
): Promise<RowRecord[]> {
  const mapped = await mapRows(harness, rows, predicate, opts);
  return mapped.filter((m) => m.result.action === "include").map((m) => m.row);
}

async function mapPool<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  if (items.length === 0) return [];
  const results = new Array<R>(items.length);
  let next = 0;

  async function worker(): Promise<void> {
    for (;;) {
      const i = next++;
      if (i >= items.length) return;
      results[i] = await fn(items[i]!, i);
    }
  }

  const workers = Array.from({ length: Math.min(concurrency, items.length) }, () => worker());
  await Promise.all(workers);
  return results;
}

/** Deterministic JSON for hashing (sorted object keys). */
function stableStringify(value: unknown): string {
  return JSON.stringify(sortKeys(value));
}

function sortKeys(value: unknown): unknown {
  if (value === null || typeof value !== "object") return value;
  if (Array.isArray(value)) return value.map(sortKeys);
  const obj = value as Record<string, unknown>;
  const out: Record<string, unknown> = {};
  for (const key of Object.keys(obj).sort()) {
    out[key] = sortKeys(obj[key]);
  }
  return out;
}
