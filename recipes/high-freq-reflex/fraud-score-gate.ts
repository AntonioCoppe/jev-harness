import { choice, noul, score } from "@typesafe-ai/sdk";
import { defineRecipe } from "../../src/define-recipe.js";
import type { DecisionHarness } from "../../src/harness.js";
import type { DecisionResult } from "../../src/types.js";

export type FraudScoreAction = "allow" | "step_up" | "deny" | "review";

export interface FraudScoreState {
  /** Compact payment / login event (device, velocity, amount, geo flags). */
  event: Record<string, string | number | boolean | null>;
  narrative?: string;
  policy_hint?: string;
}

/**
 * Payment / login fraud score gate — extends hot-path-allow + rubric patterns.
 * Shape: high-freq-reflex.
 *
 * Proof equation: **chargebacks + false declines = $ + checkout friction ms**.
 */
export const fraudScoreGateRecipe = defineRecipe<
  ReturnType<typeof buildFraudScoreGateQuestions>,
  FraudScoreAction,
  FraudScoreState
>({
  id: "fraud-score-gate",
  name: "Fraud Score Gate",
  category: "high-freq-reflex",
  description:
    "Score payment/login fraud risk and dispose: allow, step-up, deny, or review.",
  module: "recipes/high-freq-reflex/fraud-score-gate.ts",
  runner: "runFraudScoreGate",
  questions: [
    { name: "fraud_risk", kind: "score" },
    { name: "disposition", kind: "choice" },
    { name: "device_anomaly", kind: "noul" },
    { name: "velocity_anomaly", kind: "noul" },
  ],
  actions: ["allow", "step_up", "deny", "review"],
  defaultMinConfidence: 0.55,
  defaultOnLowConfidence: "review",
  tags: ["fraud", "payments", "login", "risk", "latency", "reflex"],
  buildQuestions: (_state) => buildFraudScoreGateQuestions(),
  decide: ({ answers }) => {
    const anomaly =
      answers.device_anomaly.noul >= 0.6 || answers.velocity_anomaly.noul >= 0.6;
    if (answers.fraud_risk.score >= 1.5 || answers.disposition.choice === "deny") {
      return "deny";
    }
    if (answers.fraud_risk.score >= 1.0 || (anomaly && answers.fraud_risk.score >= 0.7)) {
      return "step_up";
    }
    if (answers.disposition.choice === "review" || answers.disposition.choice === "step_up") {
      return answers.disposition.choice as FraudScoreAction;
    }
    if (answers.fraud_risk.score < 0.7 && !anomaly) return "allow";
    return "review";
  },
  entryState: (state) => ({
    event: state.event,
    narrative: state.narrative,
    policy_hint: state.policy_hint,
  }),
});

function buildFraudScoreGateQuestions() {
  return {
    fraud_risk: score("Overall fraud risk for this payment or login?", [
      "Low — looks legitimate",
      "Elevated — mixed signals",
      "High — likely fraud / account takeover",
    ]),
    disposition: choice("What should the hot path do?", {
      allow: "Proceed without friction",
      step_up: "Challenge (MFA / 3DS / extra verify)",
      deny: "Hard decline / block",
      review: "Queue for manual or async review",
    }),
    device_anomaly: noul("Does device / fingerprint / client look anomalous?", {
      true: "New device, emulator, spoof, or mismatch",
      false: "Device looks consistent with history",
    }),
    velocity_anomaly: noul("Is velocity (attempts, amount, geo hops) anomalous?", {
      true: "Burst, impossible travel, or amount spike",
      false: "Velocity within normal band",
    }),
  } as const;
}

export function fraudScoreGateQuestions() {
  return buildFraudScoreGateQuestions();
}

export type FraudScoreQuestions = ReturnType<typeof fraudScoreGateQuestions>;

export async function runFraudScoreGate(
  harness: DecisionHarness,
  state: FraudScoreState,
  opts?: { mode?: "live" | "shadow"; id?: string; minConfidence?: number },
): Promise<DecisionResult<FraudScoreQuestions, FraudScoreAction>> {
  return fraudScoreGateRecipe.run(harness, state, opts);
}

export type FraudScoreGateAction = FraudScoreAction;

export type FraudScoreGateState = FraudScoreState;
