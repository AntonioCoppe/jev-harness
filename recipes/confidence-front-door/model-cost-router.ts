import { choice, score } from "@typesafe-ai/sdk";
import { defineRecipe } from "../../src/define-recipe.js";
import type { DecisionHarness } from "../../src/harness.js";
import type { DecisionResult } from "../../src/types.js";

export type CostTier = "cheap" | "mid" | "frontier";

export type ModelCostRouterState = {
  prompt: string;
  /** Optional hint for eval/demo labels (not sent to Jev unless entryState includes it). */
  label?: string;
};

/**
 * Cost-first model router: prefer the cheapest tier that still clears risk.
 * Shape: confidence-front-door.
 *
 * Proof equation: **tokens to frontier = $ spend + latency**.
 * Offline fixture target: ≥70% of clear-confidence cases route to `cheap`.
 */
export const modelCostRouterRecipe = defineRecipe<
  ReturnType<typeof buildModelCostRouterQuestions>,
  CostTier,
  ModelCostRouterState
>({
  id: "model-cost-router",
  name: "Model Cost Router",
  category: "confidence-front-door",
  description:
    "Route prompts to cheap/mid/frontier with a cheap-first bias; escalate on low confidence.",
  module: "recipes/confidence-front-door/model-cost-router.ts",
  runner: "runModelCostRouter",
  questions: [
    { name: "tier", kind: "choice" },
    { name: "risk", kind: "score" },
  ],
  actions: ["cheap", "mid", "frontier"],
  defaultMinConfidence: 0.5,
  defaultOnLowConfidence: "escalate_llm",
  tags: ["routing", "cost", "llm", "proof"],
  buildQuestions: (_state) => buildModelCostRouterQuestions(),
  decide: ({ answers }) => {
    // High wrong-answer cost always forces frontier.
    if (answers.risk.score >= 1.5) return "frontier";
    // Cheap-first: if Jev picked mid but risk is low, stay cheap.
    if (answers.tier.choice === "mid" && answers.risk.score < 0.6) return "cheap";
    return answers.tier.choice as CostTier;
  },
  entryState: (state) => ({ prompt: state.prompt }),
});

function buildModelCostRouterQuestions() {
  return {
    tier: choice("Which model tier should handle this request?", {
      cheap: "Simple FAQ, formatting, lookup, or rewrite — prefer cheapest",
      mid: "Normal reasoning, coding, or multi-step help",
      frontier: "Hard reasoning, high stakes, or ambiguous requirements",
    }),
    risk: score("How costly is a wrong answer (money, safety, irreversibility)?", [
      "Low — easy to retry; prefer cheap",
      "Medium — user time lost",
      "High — money, safety, or irreversible action",
    ]),
  } as const;
}

export function modelCostRouterQuestions() {
  return buildModelCostRouterQuestions();
}

export type ModelCostRouterQuestions = ReturnType<typeof modelCostRouterQuestions>;

export async function runModelCostRouter(
  harness: DecisionHarness,
  prompt: string,
  opts?: { mode?: "live" | "shadow"; id?: string; minConfidence?: number },
): Promise<DecisionResult<ModelCostRouterQuestions, CostTier>> {
  return modelCostRouterRecipe.run(harness, { prompt }, opts);
}

/** Screenshotable proof helper: % of actions that landed on cheap (excludes escalate/suppress). */
export function pctRoutedCheap(actions: string[]): {
  total: number;
  routed: number;
  cheap: number;
  pctCheap: number;
} {
  const routed = actions.filter((a) => a === "cheap" || a === "mid" || a === "frontier");
  const cheap = routed.filter((a) => a === "cheap").length;
  return {
    total: actions.length,
    routed: routed.length,
    cheap,
    pctCheap: routed.length ? cheap / routed.length : 0,
  };
}
