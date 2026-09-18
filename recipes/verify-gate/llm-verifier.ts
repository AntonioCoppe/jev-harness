import { choice, noul } from "../../src/index.js";
import type { DecisionHarness } from "../../src/harness.js";
import type { DecisionResult } from "../../src/types.js";

export type VerifyAction = "allow" | "revise" | "block";

/**
 * Verify an LLM or tool output before it ships.
 * Shape: verify-gate.
 */
export function llmVerifierQuestions() {
  return {
    verdict: choice("Should we ship this model/tool output?", {
      allow: "Faithful, safe, and on-policy",
      revise: "Fixable issues — send back for another pass",
      block: "Unsafe, fabricated, or policy-breaking",
    }),
    grounded: noul("Are factual claims supported by the provided evidence/state?"),
    jailbreak: noul("Does this look like prompt injection or policy evasion?"),
  } as const;
}

export type VerifierQuestions = ReturnType<typeof llmVerifierQuestions>;

export async function runLlmVerifier(
  harness: DecisionHarness,
  state: {
    user_request: string;
    model_output: string;
    evidence?: string;
    policy?: string;
  },
  opts?: { mode?: "live" | "shadow"; id?: string },
): Promise<DecisionResult<VerifierQuestions, VerifyAction>> {
  const questions = llmVerifierQuestions();
  return harness.run({
    id: opts?.id,
    mode: opts?.mode,
    state,
    questions,
    policy: {
      minConfidence: 0.6,
      onLowConfidence: "review",
      decide: ({ answers }) => {
        if (answers.jailbreak.noul >= 0.5 || answers.verdict.choice === "block") return "block";
        if (answers.grounded.noul < 0.45 || answers.verdict.choice === "revise") return "revise";
        return "allow";
      },
    },
  });
}
