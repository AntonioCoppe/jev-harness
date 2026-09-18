import { choice, noul, score } from "@typesafe-ai/sdk";
import { defineRecipe } from "../../src/define-recipe.js";
import type { DecisionHarness } from "../../src/harness.js";
import type { DecisionResult } from "../../src/types.js";

export type AlertAction = "notify" | "queue_review" | "suppress";

export interface AlertEventState {
  source: string;
  summary: string;
  signals?: Record<string, unknown>;
  policy?: string;
}

/**
 * Gate noisy automated alerts before they page a human.
 * Shape: confidence-front-door (Choice + Score + Noul).
 */
export const alertGateRecipe = defineRecipe<
  ReturnType<typeof buildAlertGateQuestions>,
  AlertAction,
  AlertEventState
>({
  id: "alert-gate",
  name: "Alert Gate",
  category: "confidence-front-door",
  description: "Gate noisy automated alerts before they page a human.",
  module: "recipes/confidence-front-door/alert-gate.ts",
  runner: "runAlertGate",
  questions: [
    { name: "disposition", kind: "choice" },
    { name: "severity", kind: "score" },
    { name: "needs_human", kind: "noul" },
  ],
  actions: ["notify", "queue_review", "suppress"],
  defaultMinConfidence: 0.55,
  defaultOnLowConfidence: "review",
  tags: ["alerts", "paging", "on-call", "routing"],
  buildQuestions: (_state) => buildAlertGateQuestions(),
  decide: ({ answers }) => {
    if (answers.disposition.choice === "suppress") return "suppress";
    if (answers.needs_human.noul >= 0.6) return "queue_review";
    if (answers.disposition.choice === "notify" && answers.severity.score >= 1.2) {
      return "notify";
    }
    return "queue_review";
  },
});

function buildAlertGateQuestions() {
  return {
    disposition: choice("How should we handle this alert?", {
      notify: "Page or push to on-call / customer now",
      queue_review: "Park for human review; do not page yet",
      suppress: "Likely false positive or duplicate; log only",
    }),
    severity: score("If real, how severe is customer or safety impact?", [
      "Negligible / cosmetic",
      "Notable but not urgent",
      "High — revenue, safety, or trust at risk",
    ]),
    needs_human: noul("Should a human look before any customer-facing notify?", {
      true: "Ambiguous, high blast radius, or policy requires review",
      false: "Safe to auto-notify if disposition says notify",
    }),
  } as const;
}

export function alertGateQuestions() {
  return buildAlertGateQuestions();
}

export type AlertQuestions = ReturnType<typeof alertGateQuestions>;

export async function runAlertGate(
  harness: DecisionHarness,
  state: AlertEventState,
  opts?: { mode?: "live" | "shadow"; id?: string; minConfidence?: number },
): Promise<DecisionResult<AlertQuestions, AlertAction>> {
  return alertGateRecipe.run(harness, state, opts);
}
