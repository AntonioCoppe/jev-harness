/**
 * Shared helpers for demos/proof/multi runners.
 * Loads .env for TYPESAFE_API_KEY without printing secrets.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
export const MULTI_ROOT = HERE;
export const OUT_DIR = join(HERE, "out");
export const FIXTURES = join(HERE, "fixtures");
export const REPO_ROOT = join(HERE, "../../..");

/** Load KEY=VAL lines from repo .env into process.env (no overwrite of set vars). */
export function loadEnv(): void {
  const envPath = join(REPO_ROOT, ".env");
  if (!existsSync(envPath)) return;
  const text = readFileSync(envPath, "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq < 1) continue;
    const key = trimmed.slice(0, eq).trim();
    let val = trimmed.slice(eq + 1).trim();
    if (
      (val.startsWith('"') && val.endsWith('"')) ||
      (val.startsWith("'") && val.endsWith("'"))
    ) {
      val = val.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = val;
  }
}

export function requireApiKey(): void {
  loadEnv();
  if (!process.env.TYPESAFE_API_KEY) {
    console.error("TYPESAFE_API_KEY missing (set in env or .env)");
    process.exit(2);
  }
}

export function ensureOut(): void {
  mkdirSync(OUT_DIR, { recursive: true });
}

export type MeasuredPayload = {
  id: string;
  label: string;
  recipe: string;
  measured: "MEASURED_LIVE";
  wall_ms: number;
  started_at: string;
  finished_at: string;
  n: number;
  quality: Record<string, unknown>;
  items?: unknown[];
  notes?: string[];
};

export function writeResult(id: string, payload: MeasuredPayload): string {
  ensureOut();
  const path = join(OUT_DIR, `${id}.json`);
  writeFileSync(path, JSON.stringify(payload, null, 2) + "\n");
  return path;
}

export function sumUsage(results: Array<{ usage?: { input_tokens?: number; output_tokens?: number } }>) {
  let input = 0;
  let output = 0;
  for (const r of results) {
    input += r.usage?.input_tokens ?? 0;
    output += r.usage?.output_tokens ?? 0;
  }
  return { input_tokens: input, output_tokens: output };
}

export function countBy<T extends string>(actions: T[]): Record<string, number> {
  const out: Record<string, number> = {};
  for (const a of actions) out[a] = (out[a] ?? 0) + 1;
  return out;
}

export async function mapPool<T, R>(
  items: T[],
  concurrency: number,
  fn: (item: T, index: number) => Promise<R>,
): Promise<R[]> {
  if (items.length === 0) return [];
  const results = new Array<R>(items.length);
  let next = 0;
  async function worker() {
    for (;;) {
      const i = next++;
      if (i >= items.length) return;
      results[i] = await fn(items[i]!, i);
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(concurrency, items.length) }, () => worker()),
  );
  return results;
}

export function banner(title: string) {
  console.log("=".repeat(72));
  console.log(title);
  console.log("=".repeat(72));
}
