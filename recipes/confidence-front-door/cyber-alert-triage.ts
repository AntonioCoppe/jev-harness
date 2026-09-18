import { choice, noul, score } from "@typesafe-ai/sdk";
import { defineRecipe } from "../../src/define-recipe.js";
import type { DecisionHarness } from "../../src/harness.js";
import type { DecisionResult } from "../../src/types.js";

export type CyberAlertAction = "notify" | "queue_review" | "suppress";

export interface CyberAlertState {
  source: string;
  summary: string;
  /** Detector / SIEM rule id or name. */
  rule?: string;
  signals?: Record<string, unknown>;
  /** Recent related alerts (dedupe / flapping context). */
  recent?: string[];
  policy?: string;
}

/**
 * Cybersecurity alert triage — extends alert-gate / oncall-page patterns.
 * Shape: confidence-front-door (Choice + Score + dual Noul).
 *
 * Proof equation: **false pages + missed true positives = analyst $ + MTTR**.
 */
export const cyberAlertTriageRecipe = defineRecipe<
  ReturnType<typeof buildCyberAlertTriageQuestions>,
  CyberAlertAction,
  CyberAlertState
>({
  id: "cyber-alert-triage",
  name: "Cyber Alert Triage",
  category: "confidence-front-door",
  description:
    "Triage SOC/SIEM alerts: notify, queue for review, or suppress — with actionable + needs_human gates.",
  module: "recipes/confidence-front-door/cyber-alert-triage.ts",
  runner: "runCyberAlertTriage",
  questions: [
    { name: "disposition", kind: "choice" },
    { name: "severity", kind: "score" },
    { name: "needs_human", kind: "noul" },
    { name: "actionable", kind: "noul" },
  ],
  actions: ["notify", "queue_review", "suppress"],
  defaultMinConfidence: 0.55,
  defaultOnLowConfidence: "review",
  tags: ["alerts", "security", "soc", "paging", "on-call", "triage"],
  buildQuestions: (_state) => buildCyberAlertTriageQuestions(),
  decide: ({ answers }) => {
    if (answers.disposition.choice === "suppress" || answers.actionable.noul < 0.35) {
      return "suppress";
    }
    if (answers.needs_human.noul >= 0.6 || answers.actionable.noul < 0.55) {
      return "queue_review";
    }
    if (answers.disposition.choice === "notify" && answers.severity.score >= 1.2) {
      return "notify";
    }
    return "queue_review";
  },
});

function buildCyberAlertTriageQuestions() {
  return {
    disposition: choice("How should we handle this security alert?", {
      notify: "Page or push to on-call / SOC now — likely true positive",
      queue_review: "Park for analyst review; do not page yet",
      suppress: "False positive, duplicate, or non-actionable noise; log only",
    }),
    severity: score("If real, how severe is customer, safety, or blast-radius impact?", [
      "Negligible / cosmetic / already mitigated",
      "Notable but not urgent",
      "High — breach, ransomware, or trust/revenue at risk",
    ]),
    needs_human: noul("Should a human look before any customer-facing or irreversible notify?", {
      true: "Ambiguous, high blast radius, or policy requires review",
      false: "Safe to auto-notify if disposition says notify",
    }),
    actionable: noul("Is there a clear owner action (contain, revoke, patch) right now?", {
      true: "Runbook step or owner action is clear",
      false: "No clear next step — noise or incomplete signal",
    }),
  } as const;
}

export function cyberAlertTriageQuestions() {
  return buildCyberAlertTriageQuestions();
}

export type CyberAlertQuestions = ReturnType<typeof cyberAlertTriageQuestions>;

export async function runCyberAlertTriage(
  harness: DecisionHarness,
  state: CyberAlertState,
  opts?: { mode?: "live" | "shadow"; id?: string; minConfidence?: number },
): Promise<DecisionResult<CyberAlertQuestions, CyberAlertAction>> {
  return cyberAlertTriageRecipe.run(harness, state, opts);
}

export type CyberAlertTriageAction = CyberAlertAction;

export type CyberAlertTriageState = CyberAlertState;
