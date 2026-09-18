import { choice, noul } from "@typesafe-ai/sdk";
import { defineRecipe } from "../../src/define-recipe.js";
import type { DecisionHarness } from "../../src/harness.js";
import type { DecisionResult } from "../../src/types.js";

export type ShipAction = "ship" | "revise" | "block";

export type ShipGateState = {
  user_request: string;
  candidate_output: string;
  evidence?: string;
  policy?: string;
};

/**
 * Ship-or-hold gate before a model/tool output leaves the building.
 * Shape: verify-gate.
 *
 * Proof equation: **bad ships to prod = incident $ + rollback latency**.
 * Default `onLowConfidence: "suppress"` — unsure never ships (fixture asserts suppress).
 */
export const shipGateRecipe = defineRecipe<
  ReturnType<typeof buildShipGateQuestions>,
  ShipAction,
  ShipGateState
>({
  id: "ship-gate",
  name: "Ship Gate",
  category: "verify-gate",
  description:
    "Allow / revise / block a candidate output before ship; suppress on low confidence.",
  module: "recipes/verify-gate/ship-gate.ts",
  runner: "runShipGate",
  questions: [
    { name: "verdict", kind: "choice" },
    { name: "grounded", kind: "noul" },
    { name: "unsafe", kind: "noul" },
  ],
  actions: ["ship", "revise", "block"],
  defaultMinConfidence: 0.65,
  defaultOnLowConfidence: "suppress",
  tags: ["safety", "verification", "ship", "proof"],
  buildQuestions: (_state) => buildShipGateQuestions(),
  decide: ({ answers }) => {
    if (answers.unsafe.noul >= 0.5 || answers.verdict.choice === "block") return "block";
    if (answers.grounded.noul < 0.45 || answers.verdict.choice === "revise") return "revise";
    return "ship";
  },
});

function buildShipGateQuestions() {
  return {
    verdict: choice("Should we ship this candidate output?", {
      ship: "Faithful, safe, and on-policy — release it",
      revise: "Fixable issues — send back for another pass",
      block: "Unsafe, fabricated, or policy-breaking — do not ship",
    }),
    grounded: noul("Are factual claims supported by the provided evidence/state?", {
      true: "Claims are backed by evidence in state",
      false: "Claims look unsupported or invented",
    }),
    unsafe: noul("Does this look unsafe, injected, or policy-evading?", {
      true: "Jailbreak, secret leak, malware, or clear policy break",
      false: "No clear safety/policy red flag",
    }),
  } as const;
}

export function shipGateQuestions() {
  return buildShipGateQuestions();
}

export type ShipGateQuestions = ReturnType<typeof shipGateQuestions>;

export async function runShipGate(
  harness: DecisionHarness,
  state: ShipGateState,
  opts?: {
    mode?: "live" | "shadow";
    id?: string;
    minConfidence?: number;
    onLowConfidence?: "review" | "escalate_llm" | "suppress" | "proceed";
  },
): Promise<DecisionResult<ShipGateQuestions, ShipAction>> {
  return shipGateRecipe.run(harness, state, opts);
}
