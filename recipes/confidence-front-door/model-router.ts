import { choice, score } from "@typesafe-ai/sdk";
import { defineRecipe } from "../../src/define-recipe.js";
import type { DecisionHarness } from "../../src/harness.js";
import type { DecisionResult } from "../../src/types.js";

export type ModelTier = "cheap" | "mid" | "frontier";

export type ModelRouterState = { prompt: string };

/**
 * Route a user prompt to a model tier by difficulty / risk.
 * Shape: confidence-front-door.
 */
export const modelRouterRecipe = defineRecipe<
  ReturnType<typeof buildModelRouterQuestions>,
  ModelTier,
  ModelRouterState
>({
  id: "model-router",
  name: "Model Router",
  category: "confidence-front-door",
  description: "Route a user prompt to cheap / mid / frontier tiers by difficulty and risk.",
  module: "recipes/confidence-front-door/model-router.ts",
  runner: "runModelRouter",
  questions: [
    { name: "tier", kind: "choice" },
    { name: "risk", kind: "score" },
  ],
  actions: ["cheap", "mid", "frontier"],
  defaultMinConfidence: 0.5,
  defaultOnLowConfidence: "escalate_llm",
  tags: ["routing", "cost", "llm"],
  buildQuestions: (_state) => buildModelRouterQuestions(),
  decide: ({ answers }) => {
    if (answers.risk.score >= 1.5) return "frontier";
    return answers.tier.choice as ModelTier;
  },
});

function buildModelRouterQuestions() {
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

export function modelRouterQuestions() {
  return buildModelRouterQuestions();
}

export type ModelRouterQuestions = ReturnType<typeof modelRouterQuestions>;

export async function runModelRouter(
  harness: DecisionHarness,
  prompt: string,
  opts?: { mode?: "live" | "shadow"; id?: string },
): Promise<DecisionResult<ModelRouterQuestions, ModelTier>> {
  return modelRouterRecipe.run(harness, { prompt }, opts);
}
