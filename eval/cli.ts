#!/usr/bin/env node
/**
 * Offline / live eval runner for jev-harness fixtures (JSONL).
 *
 *   npx tsx eval/cli.ts eval/fixtures/alert-gate.jsonl
 *   npx tsx eval/cli.ts --all
 *   npx tsx eval/cli.ts --live eval/fixtures/alert-gate.jsonl
 *
 * Offline fixtures must include `answers` or `mockedAnswers`.
 * Live mode requires TYPESAFE_API_KEY and ignores fixture answers.
 */
import { readdirSync, readFileSync } from "node:fs";
import { basename, dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { DecisionHarness } from "../src/harness.js";
import { aggregateConfidence } from "../src/confidence.js";
import { resolvePolicy } from "../src/policy.js";
import type { AnyAnswer, LowConfidenceStrategy } from "../src/types.js";
import { catalog, getRecipe } from "../recipes/catalog.js";
import { candidateActionSelectQuestions } from "../recipes/candidate-action-selection/candidate-action-select.js";
import { toolPickerQuestions } from "../recipes/candidate-action-selection/tool-picker.js";
import { stopOrContinueQuestions } from "../recipes/candidate-action-selection/stop-or-continue.js";
import { rowSemanticMatchQuestions } from "../recipes/row-judgment/row-semantic-match.js";
import { alertGateQuestions } from "../recipes/confidence-front-door/alert-gate.js";
import { modelRouterQuestions } from "../recipes/confidence-front-door/model-router.js";
import { modelCostRouterQuestions } from "../recipes/confidence-front-door/model-cost-router.js";
import { inboxTriageQuestions } from "../recipes/confidence-front-door/inbox-triage.js";
import { incidentSeverityQuestions } from "../recipes/confidence-front-door/incident-severity.js";
import { oncallPageQuestions } from "../recipes/confidence-front-door/oncall-page.js";
import { llmVerifierQuestions } from "../recipes/verify-gate/llm-verifier.js";
import { shipGateQuestions } from "../recipes/verify-gate/ship-gate.js";
import { injectionCheckQuestions } from "../recipes/verify-gate/injection-check.js";
import { toolCallAllowlistQuestions } from "../recipes/verify-gate/tool-call-allowlist.js";
import {
  rubricQuestions,
  type RubricDimension,
} from "../recipes/composite-rubric/rubric-scorer.js";
import { typewriterPanelQuestions } from "../recipes/live-multi-judgment/typewriter-panel.js";
import { ticketFanoutQuestions } from "../recipes/live-multi-judgment/ticket-fanout.js";
import { lineSemanticFindQuestions } from "../recipes/semantic-find/line-semantic-find.js";
import { spanPickQuestions } from "../recipes/semantic-find/span-pick.js";
import { mmBuySellQuestions } from "../recipes/high-freq-reflex/mm-buy-sell.js";
import { hotPathAllowQuestions } from "../recipes/high-freq-reflex/hot-path-allow.js";

type RecipeId = (typeof catalog)[number]["id"];

interface FixtureCase {
  id: string;
  recipe: RecipeId;
  state: unknown;
  answers?: Record<string, AnyAnswer>;
  mockedAnswers?: Record<string, AnyAnswer>;
  dimensions?: RubricDimension[];
  expectedAction: string;
  minConfidence?: number;
  onLowConfidence?: LowConfidenceStrategy;
  mode?: "live" | "shadow";
  stopThreshold?: number;
  matchThreshold?: number;
  passThreshold?: number;
}

function asRecord(state: unknown): Record<string, unknown> {
  return state && typeof state === "object" && !Array.isArray(state)
    ? (state as Record<string, unknown>)
    : {};
}

function decideCandidate(c: FixtureCase, answers: Record<string, AnyAnswer>): string {
  const done = answers.done as { noul: number };
  const next = answers.next as { choice: string };
  if (done.noul >= (c.stopThreshold ?? 0.7)) return "STOP";
  return next.choice;
}

function decideToolPicker(answers: Record<string, AnyAnswer>): string {
  const tool = answers.tool as { choice: string };
  const necessary = answers.necessary as { noul: number };
  if (necessary.noul < 0.4 || tool.choice === "none") return "none";
  return tool.choice;
}

function decideStopOrContinue(answers: Record<string, AnyAnswer>): string {
  const disposition = answers.disposition as { choice: string };
  const progress = answers.progress as { score: number };
  const stuck = answers.stuck as { noul: number };
  if (stuck.noul >= 0.65) return "ask_user";
  if (disposition.choice === "stop" || progress.score < 0.4) {
    return disposition.choice === "continue" ? "ask_user" : disposition.choice;
  }
  return disposition.choice;
}

function decideRowSemanticMatch(c: FixtureCase, answers: Record<string, AnyAnswer>): string {
  const matches = answers.matches as { noul: number };
  const strength = answers.strength as { score: number };
  const matchThreshold = c.matchThreshold ?? 0.55;
  if (matches.noul >= matchThreshold && strength.score >= 0.8) return "include";
  if (matches.noul < matchThreshold - 0.15) return "exclude";
  return "review";
}

function decideModelRouter(answers: Record<string, AnyAnswer>): string {
  const tier = answers.tier as { choice: string };
  const risk = answers.risk as { score: number };
  if (risk.score >= 1.5) return "frontier";
  return tier.choice;
}

function decideModelCostRouter(answers: Record<string, AnyAnswer>): string {
  const tier = answers.tier as { choice: string };
  const risk = answers.risk as { score: number };
  if (risk.score >= 1.5) return "frontier";
  if (tier.choice === "mid" && risk.score < 0.6) return "cheap";
  return tier.choice;
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

function decideInboxTriage(answers: Record<string, AnyAnswer>): string {
  const bucket = answers.bucket as { choice: string };
  const isCustomer = answers.is_customer as { noul: number };
  if (bucket.choice === "spam" || isCustomer.noul < 0.35) return "spam";
  return bucket.choice;
}

function decideIncidentSeverity(answers: Record<string, AnyAnswer>): string {
  const severity = answers.severity as { choice: string };
  const blast = answers.blast_radius as { score: number };
  const customerFacing = answers.customer_facing as { noul: number };
  if (blast.score >= 1.6 && customerFacing.noul >= 0.6) return "sev1";
  if (severity.choice === "sev1") return "sev1";
  if (blast.score >= 1.0 && customerFacing.noul >= 0.45) {
    return severity.choice === "sev4" ? "sev3" : severity.choice;
  }
  return severity.choice;
}

function decideOncallPage(c: FixtureCase, answers: Record<string, AnyAnswer>): string {
  const action = answers.action as { choice: string };
  const urgency = answers.urgency as { score: number };
  const actionable = answers.actionable as { noul: number };
  const quietHours = Boolean(asRecord(c.state).quiet_hours);
  if (action.choice === "ignore" || actionable.noul < 0.35) return "ignore";
  if (urgency.score >= 1.5 && actionable.noul >= 0.55) return "page_now";
  if (action.choice === "page_now" && quietHours && urgency.score < 1.5) return "notify_slack";
  return action.choice;
}

function decideLlmVerifier(answers: Record<string, AnyAnswer>): string {
  const verdict = answers.verdict as { choice: string };
  const grounded = answers.grounded as { noul: number };
  const jailbreak = answers.jailbreak as { noul: number };
  if (jailbreak.noul >= 0.5 || verdict.choice === "block") return "block";
  if (grounded.noul < 0.45 || verdict.choice === "revise") return "revise";
  return "allow";
}

function decideShipGate(answers: Record<string, AnyAnswer>): string {
  const verdict = answers.verdict as { choice: string };
  const grounded = answers.grounded as { noul: number };
  const unsafe = answers.unsafe as { noul: number };
  if (unsafe.noul >= 0.5 || verdict.choice === "block") return "block";
  if (grounded.noul < 0.45 || verdict.choice === "revise") return "revise";
  return "ship";
}

function decideInjectionCheck(answers: Record<string, AnyAnswer>): string {
  const disposition = answers.disposition as { choice: string };
  const severity = answers.severity as { score: number };
  const isInjection = answers.is_injection as { noul: number };
  if (isInjection.noul >= 0.6 || disposition.choice === "block") return "block";
  if (severity.score >= 1.0 || disposition.choice === "sanitize") return "sanitize";
  return "pass";
}

function decideToolCallAllowlist(c: FixtureCase, answers: Record<string, AnyAnswer>): string {
  const state = asRecord(c.state);
  const toolName = String(state.tool_name ?? "");
  const allowlist = Array.isArray(state.allowlist) ? (state.allowlist as string[]) : [];
  const onAllowlist = allowlist.includes(toolName);
  const verdict = answers.verdict as { choice: string };
  const argsSafe = answers.args_safe as { noul: number };
  const intentAligned = answers.intent_aligned as { noul: number };
  if (!onAllowlist || verdict.choice === "deny") return "deny";
  if (argsSafe.noul < 0.5 || intentAligned.noul < 0.45) return "require_confirm";
  if (verdict.choice === "require_confirm") return "require_confirm";
  return "allow";
}

function decideRubricScorer(c: FixtureCase, answers: Record<string, AnyAnswer>): string {
  const state = asRecord(c.state);
  const dimensions =
    c.dimensions ??
    (Array.isArray(state.dimensions) ? (state.dimensions as RubricDimension[]) : []);
  const passThreshold = c.passThreshold ?? 1.2;
  let total = 0;
  let weightSum = 0;
  for (const d of dimensions) {
    const w = d.weight ?? 1;
    const a = answers[d.id] as { score: number } | undefined;
    total += (a?.score ?? 0) * w;
    weightSum += w;
  }
  const weighted = weightSum ? total / weightSum : 0;
  if (weighted >= passThreshold + 0.5) return "pass";
  if (weighted >= passThreshold - 0.3) return "revise";
  return "fail";
}

function decideTicketFanout(answers: Record<string, AnyAnswer>): string {
  const severity = answers.severity as { score: number };
  const frustration = answers.frustration as { score: number };
  const category = answers.category as { choice: string };
  if (severity.score >= 1.6 && frustration.score >= 1.4) return "escalate";
  return category.choice;
}

function decideLineSemanticFind(answers: Record<string, AnyAnswer>): string {
  const exists = answers.answer_exists as { noul: number };
  const best = answers.best as { choice: string };
  if (exists.noul < 0.45) return "NONE";
  return best.choice;
}

function decideSpanPick(answers: Record<string, AnyAnswer>): string {
  const noneFit = answers.none_fit as { noul: number };
  const span = answers.span as { choice: string };
  if (noneFit.noul >= 0.55) return "NONE";
  return span.choice;
}

function decideMmBuySell(answers: Record<string, AnyAnswer>): string {
  const side = answers.side as { choice: string };
  const edge = answers.edge as { score: number };
  if (side.choice === "hold" || edge.score < 0.9) return "hold";
  return side.choice;
}

function decideHotPathAllow(answers: Record<string, AnyAnswer>): string {
  const severity = answers.severity as { score: number };
  const allow = answers.allow as { noul: number };
  if (severity.score >= 1.5 && allow.noul < 0.65) return "deny";
  return allow.noul >= 0.55 ? "allow" : "deny";
}

function decideFor(c: FixtureCase, answers: Record<string, AnyAnswer>): string {
  switch (c.recipe) {
    case "candidate-action-select":
    case "browser-next-action":
      return decideCandidate(c, answers);
    case "tool-picker":
      return decideToolPicker(answers);
    case "stop-or-continue":
      return decideStopOrContinue(answers);
    case "row-semantic-match":
      return decideRowSemanticMatch(c, answers);
    case "model-router":
      return decideModelRouter(answers);
    case "model-cost-router":
      return decideModelCostRouter(answers);
    case "alert-gate":
      return decideAlertGate(answers);
    case "inbox-triage":
      return decideInboxTriage(answers);
    case "incident-severity":
      return decideIncidentSeverity(answers);
    case "oncall-page":
      return decideOncallPage(c, answers);
    case "llm-verifier":
      return decideLlmVerifier(answers);
    case "ship-gate":
      return decideShipGate(answers);
    case "injection-check":
      return decideInjectionCheck(answers);
    case "tool-call-allowlist":
      return decideToolCallAllowlist(c, answers);
    case "rubric-scorer":
      return decideRubricScorer(c, answers);
    case "typewriter-panel":
      return "update_ui";
    case "ticket-fanout":
      return decideTicketFanout(answers);
    case "line-semantic-find":
      return decideLineSemanticFind(answers);
    case "span-pick":
      return decideSpanPick(answers);
    case "mm-buy-sell":
      return decideMmBuySell(answers);
    case "hot-path-allow":
      return decideHotPathAllow(answers);
    default: {
      const _exhaustive: never = c.recipe;
      throw new Error(`Unknown recipe: ${_exhaustive}`);
    }
  }
}

function questionsFor(c: FixtureCase) {
  const state = asRecord(c.state);
  switch (c.recipe) {
    case "candidate-action-select":
    case "browser-next-action": {
      const candidates = (state.candidates as { id: string; description: string }[]) ?? [];
      return candidateActionSelectQuestions(candidates);
    }
    case "tool-picker": {
      const tools = (state.tools as { id: string; description: string }[]) ?? [];
      const map: Record<string, string> = {};
      for (const t of tools) map[t.id] = t.description;
      return toolPickerQuestions(map);
    }
    case "stop-or-continue":
      return stopOrContinueQuestions();
    case "row-semantic-match":
      return rowSemanticMatchQuestions(String(state.predicate ?? "matches criteria"));
    case "model-router":
      return modelRouterQuestions();
    case "model-cost-router":
      return modelCostRouterQuestions();
    case "alert-gate":
      return alertGateQuestions();
    case "inbox-triage":
      return inboxTriageQuestions();
    case "incident-severity":
      return incidentSeverityQuestions();
    case "oncall-page":
      return oncallPageQuestions();
    case "llm-verifier":
      return llmVerifierQuestions();
    case "ship-gate":
      return shipGateQuestions();
    case "injection-check":
      return injectionCheckQuestions();
    case "tool-call-allowlist":
      return toolCallAllowlistQuestions();
    case "rubric-scorer": {
      const dimensions =
        c.dimensions ??
        (Array.isArray(state.dimensions) ? (state.dimensions as RubricDimension[]) : []);
      return rubricQuestions(dimensions);
    }
    case "typewriter-panel":
      return typewriterPanelQuestions();
    case "ticket-fanout":
      return ticketFanoutQuestions();
    case "line-semantic-find": {
      const lines = (state.lines as { id: string; text: string }[]) ?? [];
      return lineSemanticFindQuestions(lines);
    }
    case "span-pick": {
      const spans = (state.spans as { id: string; text: string }[]) ?? [];
      return spanPickQuestions(spans);
    }
    case "mm-buy-sell":
      return mmBuySellQuestions();
    case "hot-path-allow":
      return hotPathAllowQuestions();
    default: {
      const _exhaustive: never = c.recipe;
      throw new Error(`Unknown recipe: ${_exhaustive}`);
    }
  }
}

function defaultMinConfidence(recipe: RecipeId): number {
  return getRecipe(recipe)?.defaultMinConfidence ?? 0.55;
}

function defaultOnLow(recipe: RecipeId): LowConfidenceStrategy {
  return (getRecipe(recipe)?.defaultOnLowConfidence as LowConfidenceStrategy) ?? "review";
}

function fixtureAnswers(c: FixtureCase): Record<string, AnyAnswer> | undefined {
  return c.answers ?? c.mockedAnswers;
}

function loadCases(path: string): FixtureCase[] {
  return readFileSync(path, "utf8")
    .split("\n")
    .map((l) => l.trim())
    .filter((l) => l && !l.startsWith("#"))
    .map((l) => JSON.parse(l) as FixtureCase);
}

function fixturesDir(): string {
  return join(dirname(fileURLToPath(import.meta.url)), "fixtures");
}

function discoverFixtureFiles(): string[] {
  return readdirSync(fixturesDir())
    .filter((f) => f.endsWith(".jsonl"))
    .sort()
    .map((f) => join(fixturesDir(), f));
}

async function runOffline(
  c: FixtureCase,
): Promise<{ action: string; confidence: number; reason: string }> {
  const answers = fixtureAnswers(c);
  if (!answers) {
    throw new Error(`Case ${c.id}: offline eval requires answers or mockedAnswers`);
  }
  const confidence = aggregateConfidence(answers as never);
  const resolution = resolvePolicy(
    {
      minConfidence: c.minConfidence ?? defaultMinConfidence(c.recipe),
      onLowConfidence: c.onLowConfidence ?? defaultOnLow(c.recipe),
      decide: ({ answers: a }) => decideFor(c, a as Record<string, AnyAnswer>),
    },
    { answers: answers as never, confidence },
  );
  if ((c.mode ?? "live") === "shadow") {
    return {
      action: "shadow_noop",
      confidence,
      reason: `shadow: would ${resolution.action} (${resolution.reason})`,
    };
  }
  return { action: resolution.action, confidence, reason: resolution.reason };
}

async function runLive(harness: DecisionHarness, c: FixtureCase) {
  const result = await harness.run({
    id: c.id,
    mode: c.mode ?? "live",
    state: c.state as never,
    questions: questionsFor(c),
    policy: {
      minConfidence: c.minConfidence ?? defaultMinConfidence(c.recipe),
      onLowConfidence: c.onLowConfidence ?? defaultOnLow(c.recipe),
      decide: ({ answers }) => decideFor(c, answers as Record<string, AnyAnswer>),
    },
  });
  return { action: result.action, confidence: result.confidence, reason: result.reason };
}

async function runFile(
  file: string,
  live: boolean,
  harness: DecisionHarness | null,
): Promise<{ total: number; passed: number; failed: number }> {
  const cases = loadCases(resolve(file));
  let passed = 0;
  let failed = 0;
  const actions: string[] = [];
  for (const c of cases) {
    if (!getRecipe(c.recipe)) {
      failed += 1;
      console.log(JSON.stringify({ ok: false, id: c.id, error: `Unknown recipe id: ${c.recipe}` }));
      continue;
    }
    try {
      const out = live && harness ? await runLive(harness, c) : await runOffline(c);
      actions.push(out.action);
      const ok = out.action === c.expectedAction;
      if (ok) {
        passed += 1;
        console.log(
          JSON.stringify({
            ok: true,
            file: basename(file),
            id: c.id,
            recipe: c.recipe,
            action: out.action,
            confidence: out.confidence,
          }),
        );
      } else {
        failed += 1;
        console.log(
          JSON.stringify({
            ok: false,
            file: basename(file),
            id: c.id,
            recipe: c.recipe,
            expected: c.expectedAction,
            actual: out.action,
            confidence: out.confidence,
            reason: out.reason,
          }),
        );
      }
    } catch (err) {
      failed += 1;
      console.log(JSON.stringify({ ok: false, file: basename(file), id: c.id, error: String(err) }));
    }
  }
  // Proof bar: action mix is screenshotable (tokens/$/ship suppress).
  if (actions.length > 0) {
    const counts: Record<string, number> = {};
    for (const a of actions) counts[a] = (counts[a] ?? 0) + 1;
    const tierActions = actions.filter((a) => a === "cheap" || a === "mid" || a === "frontier");
    const cheap = tierActions.filter((a) => a === "cheap").length;
    const proof: Record<string, unknown> = {
      file: basename(file),
      actionCounts: counts,
    };
    if (tierActions.length > 0) {
      proof.pctRoutedCheap = Math.round((1000 * cheap) / tierActions.length) / 10;
      proof.tierN = tierActions.length;
    }
    if (counts.suppress) {
      proof.suppressCount = counts.suppress;
      proof.suppressOnLowConf = true;
    }
    console.log(JSON.stringify({ proof }));
  }
  return { total: cases.length, passed, failed };
}

async function main() {
  const argv = process.argv.slice(2);
  const live = argv.includes("--live");
  const all = argv.includes("--all");
  const fileArgs = argv.filter((a) => !a.startsWith("-"));

  if (!all && fileArgs.length === 0) {
    console.error("Usage: jev-eval [--live] [--all | <fixture.jsonl>...]");
    process.exit(2);
  }

  const files = all ? discoverFixtureFiles() : fileArgs.map((f) => resolve(f));
  if (files.length === 0) {
    console.error("No fixture JSONL files found under eval/fixtures/");
    process.exit(2);
  }

  const harness = live ? new DecisionHarness({ logger: false }) : null;
  let total = 0;
  let passed = 0;
  let failed = 0;
  for (const file of files) {
    const summary = await runFile(file, live, harness);
    total += summary.total;
    passed += summary.passed;
    failed += summary.failed;
  }

  console.log(
    JSON.stringify({
      summary: { files: files.length, total, passed, failed, recipes: catalog.map((r) => r.id) },
    }),
  );
  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
