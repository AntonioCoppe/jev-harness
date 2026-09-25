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
import { shellCommandGateQuestions } from "../recipes/verify-gate/shell-command-gate.js";
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
import { whoSpeaksNextQuestions } from "../recipes/agent-comm-harness/who-speaks-next.js";
import { toolGateQuestions } from "../recipes/agent-comm-harness/tool-gate.js";
import { messageRouteQuestions } from "../recipes/agent-comm-harness/message-route.js";
import { orderAllowDenyQuestions } from "../recipes/high-freq-reflex/order-allow-deny.js";
import { predictionMarketGateQuestions } from "../recipes/prediction-market-gate/prediction-market-gate.js";
import { sportsBetGateQuestions } from "../recipes/sports-bet-gate/sports-bet-gate.js";
import { swarmConsensusQuestions } from "../recipes/composite-rubric/swarm-consensus.js";
import { toolExecGateQuestions } from "../recipes/agent-comm-harness/tool-exec-gate.js";
import { fraudScoreGateQuestions } from "../recipes/high-freq-reflex/fraud-score-gate.js";
import { esportsReflexQuestions } from "../recipes/candidate-action-selection/esports-reflex.js";
import { keystrokeLauncherQuestions } from "../recipes/candidate-action-selection/keystroke-launcher.js";
import { agentStuckDriftQuestions } from "../recipes/verify-gate/agent-stuck-drift.js";
import { prRiskGateQuestions } from "../recipes/verify-gate/pr-risk-gate.js";
import { doneClaimCheckQuestions } from "../recipes/verify-gate/done-claim-check.js";
import { citationSupportQuestions } from "../recipes/verify-gate/citation-support.js";
import { invoiceMatchGateQuestions } from "../recipes/verify-gate/invoice-match-gate.js";
import { passageKeepDropQuestions } from "../recipes/row-judgment/passage-keep-drop.js";
import { decideToolArgDispatch, toolArgDispatchQuestions, type ToolSpec } from "../recipes/candidate-action-selection/tool-arg-dispatch.js";
import { decideAgentTraceReview, agentTraceReviewQuestions } from "../recipes/verify-gate/agent-trace-review.js";
import { decideExpenseApproval, expenseApprovalQuestions } from "../recipes/confidence-front-door/expense-approval.js";
import { decideClaimsTriage, claimsTriageQuestions } from "../recipes/confidence-front-door/claims-triage.js";
import { decideEntityPairMerge, entityPairMergeQuestions } from "../recipes/composite-rubric/entity-pair-merge.js";
import { decideTaxonomyRollup, taxonomyRollupQuestions, type TaxonomyNode } from "../recipes/confidence-front-door/taxonomy-rollup.js";
import { decideConventionLint, conventionLintQuestions, type Convention } from "../recipes/verify-gate/convention-lint.js";
import { decidePolicyDocCheck, policyDocCheckQuestions, type PolicyRequirement } from "../recipes/verify-gate/policy-doc-check.js";
import { skillRosterPickQuestions } from "../recipes/candidate-action-selection/skill-roster-pick.js";
import { edgeContentModQuestions } from "../recipes/verify-gate/edge-content-mod.js";
import { cyberAlertTriageQuestions } from "../recipes/confidence-front-door/cyber-alert-triage.js";
import { rtbBidGateQuestions } from "../recipes/high-freq-reflex/rtb-bid-gate.js";


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


function decideWhoSpeaksNext(c: FixtureCase, answers: Record<string, AnyAnswer>): string {
  const state = asRecord(c.state);
  const next = answers.next_speaker as { choice: string };
  const progress = answers.progress as { score: number };
  const needsHandoff = answers.needs_handoff as { noul: number };
  const userTurn = answers.user_turn as { noul: number };
  const current = typeof state.current_speaker === "string" ? state.current_speaker : undefined;
  const agents = Array.isArray(state.agents)
    ? (state.agents as { id: string }[])
    : [];
  if (userTurn.noul >= 0.6) return "user";
  if (next.choice === "none") return "none";
  if (needsHandoff.noul < 0.4 && current) {
    if (agents.some((a) => a.id === current)) return current;
  }
  if (progress.score < 0.35 && needsHandoff.noul < 0.35) return "none";
  return next.choice;
}


function decideToolGate(c: FixtureCase, answers: Record<string, AnyAnswer>): string {
  const state = asRecord(c.state);
  const toolName = String(state.tool_name ?? "");
  const allowlist = Array.isArray(state.allowlist) ? (state.allowlist as string[]) : null;
  const onAllowlist = allowlist ? allowlist.includes(toolName) : true;
  const risk = answers.risk_class as { choice: string };
  const policyOk = answers.policy_ok as { noul: number };
  const irreversible = answers.irreversible as { noul: number };
  const blast = answers.blast_radius as { score: number };
  const handoff = answers.handoff as { choice: string };
  if (!onAllowlist || risk.choice === "forbidden" || policyOk.noul < 0.35 || handoff.choice === "abort") {
    return "abort";
  }
  if (irreversible.noul >= 0.55 || blast.score >= 1.5 || risk.choice === "irreversible") {
    if (handoff.choice === "escalate_specialist") return "escalate_specialist";
    return "ask_user";
  }
  if (handoff.choice === "ask_user") return "ask_user";
  if (handoff.choice === "escalate_specialist") return "escalate_specialist";
  if (policyOk.noul < 0.55 || risk.choice === "reversible") {
    return handoff.choice === "continue" ? "ask_user" : handoff.choice;
  }
  return "continue";
}

function decideMessageRoute(answers: Record<string, AnyAnswer>): string {
  const route = answers.route as { choice: string };
  const secrets = answers.contains_secrets as { noul: number };
  const escalate = answers.escalate as { noul: number };
  if (escalate.noul >= 0.6) return "escalate";
  if (secrets.noul >= 0.55 && route.choice === "broadcast") return "escalate";
  if (route.choice === "drop") return "drop";
  return route.choice;
}


function decideOrderAllowDeny(answers: Record<string, AnyAnswer>): string {
  const allowOrder = answers.allow_order as { noul: number };
  const side = answers.side_intent as { choice: string };
  const edge = answers.edge as { score: number };
  const risk = answers.risk as { score: number };
  const newsConflict = answers.news_conflict as { noul: number };
  if (newsConflict.noul >= 0.55) return "deny";
  if (risk.score >= 1.5) return "deny";
  if (side.choice === "cancel") return "cancel";
  if (side.choice === "hold") return "hold";
  if (allowOrder.noul < 0.55) return "deny";
  if (edge.score < 0.9) return "hold";
  if (risk.score >= 1.0 && edge.score < 1.4) return "deny";
  return "allow";
}

function decidePredictionMarketGate(answers: Record<string, AnyAnswer>): string {
  const isArb = answers.is_arb as { noul: number };
  const edgeAfter = answers.edge_after_costs as { score: number };
  const depthOk = answers.depth_ok as { noul: number };
  const fairFresh = answers.fair_fresh as { noul: number };
  const tradeoff = answers.tradeoff as { score: number };
  const action = answers.action as { choice: string };
  if (fairFresh.noul < 0.45) {
    return action.choice === "cancel" ? "cancel" : "skip";
  }
  if (tradeoff.score < 0.5) return "skip";
  if (tradeoff.score >= 0.5 && tradeoff.score < 1.2 && depthOk.noul < 0.5) return "skip";
  if (isArb.noul >= 0.55 && edgeAfter.score >= 0.9 && depthOk.noul >= 0.55) {
    if (action.choice === "hedge_other") return "hedge_other";
    return "post_bid";
  }
  if (action.choice === "cancel") return "cancel";
  if (action.choice === "hedge_other" && depthOk.noul >= 0.45) return "hedge_other";
  return "skip";
}

function decideSportsBetGate(answers: Record<string, AnyAnswer>): string {
  const bet = answers.bet as { noul: number };
  const book = answers.book as { choice: string };
  const edge = answers.edge as { score: number };
  const clv = answers.meets_clv_filter as { noul: number };
  const liq = answers.liquidity_ok as { score: number };
  if (clv.noul < 0.5) return "no_bet";
  if (edge.score < 0.7) return "no_bet";
  if (liq.score < 0.6) return "shop_elsewhere";
  if (bet.noul >= 0.55 && edge.score >= 0.9 && clv.noul >= 0.55) return "bet";
  if (bet.noul >= 0.45 && book.choice !== "none" && edge.score >= 0.7) return "shop_elsewhere";
  return "no_bet";
}


function decideSwarmConsensus(c: FixtureCase, answers: Record<string, AnyAnswer>): string {
  const consensus = answers.consensus_reached as { noul: number };
  const winner = answers.winner as { choice: string };
  const evidence = answers.evidence_quality as { score: number };
  const fatal = answers.fatal_objection as { noul: number };
  const disposition = answers.disposition as { choice: string };
  const state = asRecord(c.state);
  if (fatal.noul >= 0.65) {
    return disposition.choice === "abort" ? "abort" : "escalate_human";
  }
  if (consensus.noul >= 0.6 && evidence.score >= 1.0 && winner.choice !== "none") return "adopt";
  if (disposition.choice === "abort") return "abort";
  if (disposition.choice === "escalate_human") return "escalate_human";
  const maxRounds = Number(state.max_rounds ?? 5);
  const round = Number(state.round ?? 1);
  if (round >= maxRounds) return "escalate_human";
  return "another_round";
}

function decideToolExecGate(c: FixtureCase, answers: Record<string, AnyAnswer>): string {
  const state = asRecord(c.state);
  const risk = answers.risk_class as { choice: string };
  const policyOk = answers.policy_ok as { noul: number };
  const irreversible = answers.irreversible as { noul: number };
  const blast = answers.blast_radius as { score: number };
  if (risk.choice === "forbidden" || policyOk.noul < 0.4) return "deny";
  if (risk.choice === "irreversible" || irreversible.noul >= 0.6) {
    return blast.score >= 1.5 ? "escalate" : "ask_user";
  }
  if (state.allowlist_hit === false) return "ask_user";
  return "exec";
}

function decideFraudScoreGate(answers: Record<string, AnyAnswer>): string {
  const fraud = answers.fraud_risk as { score: number };
  const disposition = answers.disposition as { choice: string };
  const device = answers.device_anomaly as { noul: number };
  const velocity = answers.velocity_anomaly as { noul: number };
  const anomaly = device.noul >= 0.6 || velocity.noul >= 0.6;
  if (fraud.score >= 1.5 || disposition.choice === "deny") return "deny";
  if (fraud.score >= 1.0 || (anomaly && fraud.score >= 0.7)) return "step_up";
  if (disposition.choice === "review" || disposition.choice === "step_up") return disposition.choice;
  if (fraud.score < 0.7 && !anomaly) return "allow";
  return "review";
}

function decideEsportsReflex(answers: Record<string, AnyAnswer>): string {
  const done = answers.done as { noul: number };
  const regroup = answers.regroup as { noul: number };
  const urgency = answers.urgency as { score: number };
  const legal = answers.legal_action as { choice: string };
  if (done.noul >= 0.7) return "STOP";
  if (regroup.noul >= 0.65 && urgency.score < 1.2) return "REGROUP";
  return legal.choice;
}

function decideEdgeContentMod(answers: Record<string, AnyAnswer>): string {
  const verdict = answers.verdict as { choice: string };
  const severity = answers.severity as { score: number };
  const hate = answers.hate as { noul: number };
  const sexual = answers.sexual as { noul: number };
  const selfHarm = answers.self_harm as { noul: number };
  const spam = answers.spam as { noul: number };
  const anyHard =
    hate.noul >= 0.65 || sexual.noul >= 0.65 || selfHarm.noul >= 0.55 || severity.score >= 1.5;
  if (anyHard || verdict.choice === "block") return "block";
  if (spam.noul >= 0.7 && severity.score >= 0.8) return "block";
  if (
    verdict.choice === "review" ||
    severity.score >= 1.0 ||
    hate.noul >= 0.4 ||
    sexual.noul >= 0.4 ||
    selfHarm.noul >= 0.35
  ) {
    return "review";
  }
  if (verdict.choice === "warn" || spam.noul >= 0.45) return "warn";
  return "allow";
}

function decideCyberAlertTriage(answers: Record<string, AnyAnswer>): string {
  const disposition = answers.disposition as { choice: string };
  const severity = answers.severity as { score: number };
  const needsHuman = answers.needs_human as { noul: number };
  const actionable = answers.actionable as { noul: number };
  if (disposition.choice === "suppress" || actionable.noul < 0.35) return "suppress";
  if (needsHuman.noul >= 0.6 || actionable.noul < 0.55) return "queue_review";
  if (disposition.choice === "notify" && severity.score >= 1.2) return "notify";
  return "queue_review";
}

function decideRtbBidGate(answers: Record<string, AnyAnswer>): string {
  const bid = answers.bid as { noul: number };
  const brandSafety = answers.brand_safety as { choice: string };
  const ivt = answers.ivt_risk as { score: number };
  const align = answers.creative_page_align as { noul: number };
  if (brandSafety.choice === "block" || ivt.score >= 1.5) return "block";
  if (brandSafety.choice === "sensitive" || ivt.score >= 0.9 || align.noul < 0.4) return "pass";
  if (bid.noul >= 0.55 && brandSafety.choice === "safe") return "bid";
  return "pass";
}


function decideShellCommandGate(c: FixtureCase, answers: Record<string, AnyAnswer>): string {
  const state = asRecord(c.state);
  const command = String(state.command ?? "");
  const knownSafeList = Array.isArray(state.known_safe) ? (state.known_safe as string[]) : [];
  const knownSafe = knownSafeList.some((s) => {
    const t = String(s).trim();
    const cmd = command.trim();
    return t.length > 0 && (cmd === t || cmd.startsWith(`${t} `));
  });
  const verdict = answers.verdict as { choice: string };
  const risk = answers.risk_class as { choice: string };
  const irreversible = answers.irreversible as { noul: number };
  const intentOk = answers.intent_ok as { noul: number };
  const blast = answers.blast_radius as { score: number };
  if (verdict.choice === "deny" || risk.choice === "forbidden") return "deny";
  if (
    irreversible.noul >= 0.55 ||
    blast.score >= 1.5 ||
    risk.choice === "irreversible" ||
    verdict.choice === "ask"
  ) {
    return "ask";
  }
  if (intentOk.noul < 0.45) return "ask";
  if (risk.choice === "reversible" && !knownSafe && verdict.choice !== "allow") return "ask";
  if (knownSafe || verdict.choice === "allow") return "allow";
  return "ask";
}



function decideSkillRosterPick(answers: Record<string, AnyAnswer>): string {
  const skill = answers.skill as { choice: string };
  const needsSkill = answers.needs_skill as { noul: number };
  const fitsTop = answers.fits_top as { noul: number };
  if (needsSkill.noul < 0.4) return "none";
  if (skill.choice === "none") return "none";
  if (fitsTop.noul < 0.4) return "none";
  return skill.choice;
}

function decideAgentStuckDrift(answers: Record<string, AnyAnswer>): string {
  const stuck = answers.stuck as { noul: number };
  const drifted = answers.drifted as { noul: number };
  const progress = answers.progress as { score: number };
  const testsPass = answers.tests_pass as { noul: number };
  const disposition = answers.disposition as { choice: string };
  if (stuck.noul >= 0.65 && testsPass.noul < 0.45) return "recover";
  if (stuck.noul >= 0.65) {
    return disposition.choice === "stop_review" ? "stop_review" : "recover";
  }
  if (drifted.noul >= 0.65) {
    return progress.score < 0.5 ? "recover" : "nudge";
  }
  if (testsPass.noul < 0.4 && progress.score < 0.5) return "stop_review";
  if (disposition.choice === "stop_review") return "stop_review";
  if (disposition.choice === "recover") return "recover";
  if (disposition.choice === "nudge") return "nudge";
  if (progress.score < 0.4) return "nudge";
  return "continue";
}


function decidePrRiskGate(answers: Record<string, AnyAnswer>): string {
  const risk = answers.risk as { score: number };
  const severity = answers.severity as { choice: string };
  const secrets = answers.secrets as { noul: number };
  const securityIssue = answers.security_issue as { noul: number };
  const testGap = answers.test_gap as { noul: number };
  const correctness = answers.correctness as { score: number };
  const disposition = answers.disposition as { choice: string };
  if (secrets.noul >= 0.65) return "block";
  if (securityIssue.noul >= 0.7 && severity.choice === "critical") return "block";
  if (disposition.choice === "block") return "block";
  if (
    (severity.choice === "critical" || severity.choice === "high") &&
    risk.score >= 1.4
  ) {
    return "request_changes";
  }
  if (correctness.score < 0.7) return "request_changes";
  if (testGap.noul >= 0.65) return "request_changes";
  if (securityIssue.noul >= 0.55) return "request_changes";
  if (disposition.choice === "request_changes") return "request_changes";
  if (risk.score >= 1.6) return "request_changes";
  return "merge_ok";
}

function decideDoneClaimCheck(c: FixtureCase, answers: Record<string, AnyAnswer>): string {
  const state = asRecord(c.state);
  const claimsDone = answers.claims_done as { noul: number };
  const verificationApplies = answers.verification_applies as { noul: number };
  const outcome = answers.outcome as { choice: string };
  if (Number(state.file_changes ?? 0) === 0 || state.check_passed_after_change === true) {
    return "allow_stop";
  }
  if (outcome.choice === "blocked") return "allow_stop";
  if (claimsDone.noul >= 0.7 && verificationApplies.noul >= 0.5) return "block_stop";
  return "allow_stop";
}

function decideCitationSupport(answers: Record<string, AnyAnswer>): string {
  const support = answers.support as { choice: string };
  const quotePresent = answers.quote_present as { noul: number };
  if (support.choice === "contradicts") return "reject";
  if (support.choice === "silent") return "flag";
  if (quotePresent.noul < 0.4) return "flag";
  return "accept";
}

function decideInvoiceMatchGate(c: FixtureCase, answers: Record<string, AnyAnswer>): string {
  const state = asRecord(c.state);
  const duplicate = answers.duplicate as { noul: number };
  const fraudSignal = answers.fraud_signal as { noul: number };
  const wrongVendor = answers.wrong_vendor as { noul: number };
  const lineMismatch = answers.line_mismatch as { noul: number };
  if (fraudSignal.noul >= 0.6 || duplicate.noul >= 0.6) return "hold";
  if (wrongVendor.noul >= 0.6) return "request_correction";
  if (state.totals_match !== true || lineMismatch.noul >= 0.6) return "dispute_lines";
  if (state.over_approval_limit === true) return "route_approval";
  return "pay";
}

function decidePassageKeepDrop(answers: Record<string, AnyAnswer>): string {
  const relevance = answers.relevance as { score: number };
  const contradicts = answers.contradicts as { noul: number };
  const hasInjection = answers.has_injection as { noul: number };
  if (hasInjection.noul >= 0.5) return "drop";
  if (relevance.score < 1) return "drop";
  if (contradicts.noul >= 0.6) return "keep_flag";
  return "keep";
}

function decideToolArgDispatch_(c: FixtureCase, answers: Record<string, AnyAnswer>): string {
  const state = asRecord(c.state);
  return decideToolArgDispatch(answers as unknown as Parameters<typeof decideToolArgDispatch>[0], (state.tools as ToolSpec[]) ?? []);
}

function decideExpenseApproval_(c: FixtureCase, answers: Record<string, AnyAnswer>): string {
  const state = asRecord(c.state);
  return decideExpenseApproval(answers as unknown as Parameters<typeof decideExpenseApproval>[0], { receipt_attached: state.receipt_attached === true, over_limit: state.over_limit === true });
}

function decideTaxonomyRollup_(c: FixtureCase, answers: Record<string, AnyAnswer>): string {
  const state = asRecord(c.state);
  return decideTaxonomyRollup(answers as unknown as Parameters<typeof decideTaxonomyRollup>[0], Number(state.leaf_min_confidence ?? 0.6));
}

function decideConventionLint_(c: FixtureCase, answers: Record<string, AnyAnswer>): string {
  const state = asRecord(c.state);
  return decideConventionLint(answers as unknown as Parameters<typeof decideConventionLint>[0], (state.conventions as Convention[]) ?? []);
}

function decidePolicyDocCheck_(c: FixtureCase, answers: Record<string, AnyAnswer>): string {
  const state = asRecord(c.state);
  return decidePolicyDocCheck(answers as unknown as Parameters<typeof decidePolicyDocCheck>[0], (state.requirements as PolicyRequirement[]) ?? []);
}

function decideKeystrokeLauncher(c: FixtureCase, answers: Record<string, AnyAnswer>): string {
  const state = asRecord(c.state);
  const prefix = String(state.typed_prefix ?? "");
  const best = answers.best as { choice: string };
  const match = answers.match_quality as { score: number };
  const ready = answers.ready as { noul: number };
  if (prefix.trim().length < 1) return "WAIT";
  if (best.choice === "NONE") return ready.noul >= 0.45 ? "NONE" : "WAIT";
  if (ready.noul < 0.45 || match.score < 0.7) return "WAIT";
  return best.choice;
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
    case "who-speaks-next":
      return decideWhoSpeaksNext(c, answers);
    case "tool-gate":
      return decideToolGate(c, answers);
    case "message-route":
      return decideMessageRoute(answers);
    case "order-allow-deny":
      return decideOrderAllowDeny(answers);
    case "prediction-market-gate":
      return decidePredictionMarketGate(answers);
    case "sports-bet-gate":
      return decideSportsBetGate(answers);
    case "swarm-consensus":
      return decideSwarmConsensus(c, answers);
    case "tool-exec-gate":
      return decideToolExecGate(c, answers);
    case "fraud-score-gate":
      return decideFraudScoreGate(answers);
    case "esports-reflex":
      return decideEsportsReflex(answers);
    case "edge-content-mod":
      return decideEdgeContentMod(answers);
    case "cyber-alert-triage":
      return decideCyberAlertTriage(answers);
    case "rtb-bid-gate":
      return decideRtbBidGate(answers);
    case "shell-command-gate":
      return decideShellCommandGate(c, answers);
    case "keystroke-launcher":
      return decideKeystrokeLauncher(c, answers);
    case "skill-roster-pick":
      return decideSkillRosterPick(answers);
    case "agent-stuck-drift":
      return decideAgentStuckDrift(answers);
    case "pr-risk-gate":
      return decidePrRiskGate(answers);
    case "done-claim-check":
      return decideDoneClaimCheck(c, answers);
    case "citation-support":
      return decideCitationSupport(answers);
    case "invoice-match-gate":
      return decideInvoiceMatchGate(c, answers);
    case "passage-keep-drop":
      return decidePassageKeepDrop(answers);
    case "tool-arg-dispatch":
      return decideToolArgDispatch_(c, answers);
    case "agent-trace-review":
      return decideAgentTraceReview(answers as unknown as Parameters<typeof decideAgentTraceReview>[0]);
    case "expense-approval":
      return decideExpenseApproval_(c, answers);
    case "claims-triage":
      return decideClaimsTriage(answers as unknown as Parameters<typeof decideClaimsTriage>[0]);
    case "entity-pair-merge":
      return decideEntityPairMerge(answers as unknown as Parameters<typeof decideEntityPairMerge>[0]);
    case "taxonomy-rollup":
      return decideTaxonomyRollup_(c, answers);
    case "convention-lint":
      return decideConventionLint_(c, answers);
    case "policy-doc-check":
      return decidePolicyDocCheck_(c, answers);
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
    case "who-speaks-next": {
      const agents = (state.agents as { id: string; description: string }[]) ?? [];
      return whoSpeaksNextQuestions(agents);
    }
    case "tool-gate":
      return toolGateQuestions();
    case "message-route": {
      const specialists = (state.specialists as { id: string; description: string }[]) ?? [];
      return messageRouteQuestions(specialists);
    }
    case "order-allow-deny":
      return orderAllowDenyQuestions();
    case "prediction-market-gate":
      return predictionMarketGateQuestions();
    case "sports-bet-gate":
      return sportsBetGateQuestions({
        ticket: (state.ticket as Record<string, string | number | boolean | null>) ?? {},
        offerings: state.offerings as
          | { id: string; book: string; description: string }[]
          | undefined,
        clv: state.clv as Record<string, string | number | boolean | null> | undefined,
      });
    case "swarm-consensus": {
      const proposals = (state.proposals as { id: string; summary: string }[]) ?? [];
      return swarmConsensusQuestions(proposals);
    }
    case "tool-exec-gate":
      return toolExecGateQuestions();
    case "fraud-score-gate":
      return fraudScoreGateQuestions();
    case "esports-reflex": {
      const candidates = (state.candidates as { id: string; description: string }[]) ?? [];
      return esportsReflexQuestions(candidates);
    }
    case "edge-content-mod":
      return edgeContentModQuestions();
    case "cyber-alert-triage":
      return cyberAlertTriageQuestions();
    case "rtb-bid-gate":
      return rtbBidGateQuestions();
    case "shell-command-gate":
      return shellCommandGateQuestions();
    case "keystroke-launcher": {
      const candidates = (state.candidates as { id: string; label: string; habit_score?: number }[]) ?? [];
      return keystrokeLauncherQuestions(candidates);
    }
    case "skill-roster-pick": {
      const skills = (state.skills as { id: string; description: string }[]) ?? [];
      return skillRosterPickQuestions(skills);
    }
    case "agent-stuck-drift":
      return agentStuckDriftQuestions();
    case "pr-risk-gate":
      return prRiskGateQuestions();
    case "done-claim-check":
      return doneClaimCheckQuestions();
    case "citation-support":
      return citationSupportQuestions();
    case "invoice-match-gate":
      return invoiceMatchGateQuestions();
    case "passage-keep-drop":
      return passageKeepDropQuestions();
    case "tool-arg-dispatch":
      return toolArgDispatchQuestions((state.tools as ToolSpec[]) ?? []);
    case "agent-trace-review":
      return agentTraceReviewQuestions();
    case "expense-approval":
      return expenseApprovalQuestions();
    case "claims-triage":
      return claimsTriageQuestions();
    case "entity-pair-merge":
      return entityPairMergeQuestions();
    case "taxonomy-rollup":
      return taxonomyRollupQuestions((state.taxonomy as TaxonomyNode[]) ?? []);
    case "convention-lint":
      return conventionLintQuestions((state.conventions as Convention[]) ?? []);
    case "policy-doc-check":
      return policyDocCheckQuestions((state.requirements as PolicyRequirement[]) ?? []);
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
