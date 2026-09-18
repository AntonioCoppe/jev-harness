#!/usr/bin/env node
/**
 * Offline / live eval runner for jev-harness fixtures (JSONL).
 *
 *   npx tsx eval/cli.ts eval/fixtures/alert-gate.jsonl
 *   npx tsx eval/cli.ts --live eval/fixtures/alert-gate.jsonl
 *
 * Offline fixtures must include `answers` matching System One shapes.
 * Live mode calls the API (requires TYPESAFE_API_KEY) and ignores fixture answers.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  DecisionHarness,
  aggregateConfidence,
  resolvePolicy,
  type AnyAnswer,
  type LowConfidenceStrategy,
} from "../src/index.js";
import { alertGateQuestions } from "../recipes/confidence-front-door/alert-gate.js";
import { modelRouterQuestions } from "../recipes/confidence-front-door/model-router.js";

interface FixtureCase {
  id: string;
  recipe: "alert-gate" | "model-router";
  state: unknown;
  /** Pre-baked answers for offline eval (System One answer shapes). */
  answers?: Record<string, AnyAnswer>;
  expectedAction: string;
  minConfidence?: number;
  onLowConfidence?: LowConfidenceStrategy;
  mode?: "live" | "shadow";
}

function decideAlertGate(answers: Record<string, AnyAnswer>): string {
  const disposition = answers.disposition as { choice: string };
  const severity = answers.severity as { score: number };
  const needsHuman = answers.needs_human as { noul: number };
  if (disposition.choice === "suppress") return "suppress";
  if (needsHuman.noul >= 0.6) return "queue_review";
  if (disposition.choice === "notify" && severity.score >= 1.2) return "notify";
  return "queue_review";
}

function decideModelRouter(answers: Record<string, AnyAnswer>): string {
  const tier = answers.tier as { choice: string };
  const risk = answers.risk as { score: number };
  if (risk.score >= 1.5) return "frontier";
  return tier.choice;
}

function decideFor(recipe: FixtureCase["recipe"], answers: Record<string, AnyAnswer>): string {
  switch (recipe) {
    case "alert-gate":
      return decideAlertGate(answers);
    case "model-router":
      return decideModelRouter(answers);
    default: {
      const _exhaustive: never = recipe;
      throw new Error(`Unknown recipe: ${_exhaustive}`);
    }
  }
}

function questionsFor(recipe: FixtureCase["recipe"]) {
  switch (recipe) {
    case "alert-gate":
      return alertGateQuestions();
    case "model-router":
      return modelRouterQuestions();
    default: {
      const _exhaustive: never = recipe;
      throw new Error(`Unknown recipe: ${_exhaustive}`);
    }
  }
}

function loadCases(path: string): FixtureCase[] {
  const text = readFileSync(path, "utf8");
  return text
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"))
    .map((l) => JSON.parse(l) as FixtureCase);
}

async function runOffline(c: FixtureCase): Promise<{ action: string; confidence: number; reason: string }> {
  if (!c.answers) {
    throw new Error(`Case ${c.id}: offline eval requires answers`);
  }
  const confidence = aggregateConfidence(c.answers as never);
  const resolution = resolvePolicy(
    {
      minConfidence: c.minConfidence ?? 0.55,
      onLowConfidence: c.onLowConfidence ?? "review",
      decide: ({ answers }) => decideFor(c.recipe, answers as Record<string, AnyAnswer>),
    },
    { answers: c.answers as never, confidence },
  );
  const mode = c.mode ?? "live";
  if (mode === "shadow") {
    return {
      action: "shadow_noop",
      confidence,
      reason: `shadow: would ${resolution.action} (${resolution.reason})`,
    };
  }
  return { action: resolution.action, confidence, reason: resolution.reason };
}

async function runLive(harness: DecisionHarness, c: FixtureCase) {
  const questions = questionsFor(c.recipe);
  const result = await harness.run({
    id: c.id,
    mode: c.mode ?? "live",
    state: c.state as never,
    questions,
    policy: {
      minConfidence: c.minConfidence ?? 0.55,
      onLowConfidence: c.onLowConfidence ?? "review",
      decide: ({ answers }) => decideFor(c.recipe, answers as Record<string, AnyAnswer>),
    },
  });
  return { action: result.action, confidence: result.confidence, reason: result.reason };
}

async function main() {
  const argv = process.argv.slice(2);
  const live = argv.includes("--live");
  const file = argv.find((a) => !a.startsWith("-"));
  if (!file) {
    console.error("Usage: jev-eval [--live] <fixture.jsonl>");
    process.exit(2);
  }

  const cases = loadCases(resolve(file));
  const harness = live ? new DecisionHarness({ logger: false }) : null;

  let passed = 0;
  let failed = 0;

  for (const c of cases) {
    try {
      const out = live && harness ? await runLive(harness, c) : await runOffline(c);
      const ok = out.action === c.expectedAction;
      if (ok) {
        passed += 1;
        console.log(JSON.stringify({ ok: true, id: c.id, action: out.action, confidence: out.confidence }));
      } else {
        failed += 1;
        console.log(
          JSON.stringify({
            ok: false,
            id: c.id,
            expected: c.expectedAction,
            actual: out.action,
            confidence: out.confidence,
            reason: out.reason,
          }),
        );
      }
    } catch (err) {
      failed += 1;
      console.log(JSON.stringify({ ok: false, id: c.id, error: String(err) }));
    }
  }

  console.log(JSON.stringify({ summary: { total: cases.length, passed, failed } }));
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
