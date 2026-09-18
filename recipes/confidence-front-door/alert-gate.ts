import { choice, noul, score } from "../../src/index.js";
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
export function alertGateQuestions() {
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

export type AlertQuestions = ReturnType<typeof alertGateQuestions>;

export async function runAlertGate(
  harness: DecisionHarness,
  state: AlertEventState,
  opts?: { mode?: "live" | "shadow"; id?: string; minConfidence?: number },
): Promise<DecisionResult<AlertQuestions, AlertAction>> {
  const questions = alertGateQuestions();
  return harness.run({
    id: opts?.id,
    mode: opts?.mode,
    state,
    questions,
    policy: {
      minConfidence: opts?.minConfidence ?? 0.55,
      onLowConfidence: "review",
      decide: ({ answers }) => {
        if (answers.disposition.choice === "suppress") return "suppress";
        if (answers.needs_human.noul >= 0.6) return "queue_review";
        if (answers.disposition.choice === "notify" && answers.severity.score >= 1.2) {
          return "notify";
        }
        return "queue_review";
      },
    },
  });
}
