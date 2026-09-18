import { choice, score } from "../../src/index.js";
import type { DecisionHarness } from "../../src/harness.js";
import type { DecisionResult } from "../../src/types.js";

export type ModelTier = "cheap" | "mid" | "frontier";

/**
 * Route a user prompt to a model tier by difficulty / risk.
 * Shape: confidence-front-door.
 */
export function modelRouterQuestions() {
  return {
    tier: choice("Which model tier should handle this request?", {
      cheap: "Simple FAQ, formatting, or lookup-style work",
      mid: "Normal reasoning, coding, or multi-step help",
      frontier: "Hard reasoning, high stakes, or ambiguous requirements",
    }),
    risk: score("How costly is a wrong answer?", [
      "Low — easy to retry",
      "Medium — user time lost",
      "High — money, safety, or irreversible action",
    ]),
  } as const;
}

export type ModelRouterQuestions = ReturnType<typeof modelRouterQuestions>;

export async function runModelRouter(
  harness: DecisionHarness,
  prompt: string,
  opts?: { mode?: "live" | "shadow"; id?: string },
): Promise<DecisionResult<ModelRouterQuestions, ModelTier>> {
  const questions = modelRouterQuestions();
  return harness.run({
    id: opts?.id,
    mode: opts?.mode,
    state: { prompt },
    questions,
    policy: {
      minConfidence: 0.5,
      onLowConfidence: "escalate_llm",
      decide: ({ answers }) => {
        if (answers.risk.score >= 1.5) return "frontier";
        return answers.tier.choice as ModelTier;
      },
    },
  });
}
