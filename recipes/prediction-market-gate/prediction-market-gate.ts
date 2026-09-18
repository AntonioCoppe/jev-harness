import { choice, noul, score } from "@typesafe-ai/sdk";
import { defineRecipe } from "../../src/define-recipe.js";
import type { DecisionHarness } from "../../src/harness.js";
import type { DecisionResult } from "../../src/types.js";

export type PredictionMarketAction = "post_bid" | "cancel" | "hedge_other" | "skip";

export interface PredictionMarketGateState {
  /** Compact CLOB / pair snapshot (prices, depth, fees, gas). */
  market: Record<string, string | number | boolean | null>;
  /** Optional sharp/odds fair value + freshness ms. */
  fair?: Record<string, string | number | boolean | null>;
  /** Min size the bot wants to trade. */
  min_size?: number;
  budget_ms?: number;
}

/**
 * Polymarket / prediction-market arb + liquidity-vs-edge gate.
 * Shape: high-freq-reflex (extends mm-buy-sell patterns; episode half-life ~seconds).
 *
 * Proof: arb episode capture rate; naked-leg kill count; edge-after-gas distribution.
 */
export const predictionMarketGateRecipe = defineRecipe<
  ReturnType<typeof buildPredictionMarketGateQuestions>,
  PredictionMarketAction,
  PredictionMarketGateState
>({
  id: "prediction-market-gate",
  name: "Prediction Market Gate",
  category: "high-freq-reflex",
  description:
    "Arb / liquidity-vs-edge gate for prediction markets (post, cancel, hedge, or skip).",
  module: "recipes/prediction-market-gate/prediction-market-gate.ts",
  runner: "runPredictionMarketGate",
  questions: [
    { name: "is_arb", kind: "noul" },
    { name: "edge_after_costs", kind: "score" },
    { name: "depth_ok", kind: "noul" },
    { name: "fair_fresh", kind: "noul" },
    { name: "tradeoff", kind: "score" },
    { name: "action", kind: "choice" },
  ],
  actions: ["post_bid", "cancel", "hedge_other", "skip"],
  defaultMinConfidence: 0.5,
  defaultOnLowConfidence: "suppress",
  tags: ["latency", "polymarket", "arb", "liquidity", "reflex"],
  buildQuestions: (_state) => buildPredictionMarketGateQuestions(),
  decide: ({ answers }) => {
    // Stale fair or vanishing edge → cancel / skip (fail closed on toxic fills).
    if (answers.fair_fresh.noul < 0.45) {
      return answers.action.choice === "cancel" ? "cancel" : "skip";
    }
    if (answers.tradeoff.score < 0.5) return "skip"; // no_edge
    if (answers.tradeoff.score >= 0.5 && answers.tradeoff.score < 1.2 && answers.depth_ok.noul < 0.5) {
      return "skip"; // edge_no_liq
    }
    if (answers.is_arb.noul >= 0.55 && answers.edge_after_costs.score >= 0.9 && answers.depth_ok.noul >= 0.55) {
      if (answers.action.choice === "hedge_other") return "hedge_other";
      return "post_bid";
    }
    if (answers.action.choice === "cancel") return "cancel";
    if (answers.action.choice === "hedge_other" && answers.depth_ok.noul >= 0.45) return "hedge_other";
    return "skip";
  },
});

function buildPredictionMarketGateQuestions() {
  return {
    is_arb: noul("After fees/gas, is pair cost executable under $1 with real depth?", {
      true: "Executable arb / near-arb after costs",
      false: "Not an arb once fees, gas, and slippage are included",
    }),
    edge_after_costs: score("How strong is edge after fees, gas, and expected adverse selection?", [
      "None / negative after costs",
      "Thin — fragile to one tick",
      "Solid — worth posting / taking",
    ]),
    depth_ok: noul("Does top-of-book size support the minimum size without naked-leg risk?", {
      true: "Depth covers min size on both legs / intended side",
      false: "Too thin — toxic or unexecutable",
    }),
    fair_fresh: noul("Is the sharp/odds fair-value source fresh enough to trust?", {
      true: "Fair value is fresh relative to episode half-life",
      false: "Stale fair — high adverse-selection risk",
    }),
    tradeoff: score("Liquidity vs edge tradeoff on this quote?", [
      "No edge",
      "Edge without liquidity",
      "Liquidity without edge",
      "Both edge and liquidity",
    ]),
    action: choice("What should the maker/taker loop do now?", {
      post_bid: "Post or take the arb / edge now",
      cancel: "Cancel resting — edge vanished or toxic",
      hedge_other: "Hedge / complete the other leg",
      skip: "Skip this episode",
    }),
  } as const;
}

export function predictionMarketGateQuestions() {
  return buildPredictionMarketGateQuestions();
}

export type PredictionMarketGateQuestions = ReturnType<typeof predictionMarketGateQuestions>;

export async function runPredictionMarketGate(
  harness: DecisionHarness,
  state: PredictionMarketGateState,
  opts?: {
    mode?: "live" | "shadow";
    id?: string;
    minConfidence?: number;
    onLowConfidence?: "review" | "escalate_llm" | "suppress" | "proceed";
  },
): Promise<DecisionResult<PredictionMarketGateQuestions, PredictionMarketAction>> {
  return predictionMarketGateRecipe.run(harness, state, opts);
}
