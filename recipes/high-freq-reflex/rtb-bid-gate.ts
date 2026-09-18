import { choice, noul, score } from "@typesafe-ai/sdk";
import { defineRecipe } from "../../src/define-recipe.js";
import type { DecisionHarness } from "../../src/harness.js";
import type { DecisionResult } from "../../src/types.js";

export type RtbBidAction = "bid" | "pass" | "block";

export interface RtbBidState {
  /** Compact auction / page / creative context (keep tiny for p99 budget). */
  request: Record<string, string | number | boolean | null>;
  brand_policy?: string;
  /** Latency budget hint (ms); raw Jev may need edge cache / speculative precompute. */
  budget_ms?: number;
}

/**
 * Ads RTB brand-safety / bid-or-pass gate.
 * Shape: high-freq-reflex (extends hot-path-allow).
 *
 * Proof equation: **invalid or unsafe impressions = $ + <100ms auction budget**.
 * Caveat: fit as pre-bid filter; measure YOUR path — do not invent timings.
 */
export const rtbBidGateRecipe = defineRecipe<
  ReturnType<typeof buildRtbBidGateQuestions>,
  RtbBidAction,
  RtbBidState
>({
  id: "rtb-bid-gate",
  name: "RTB Bid Gate",
  category: "high-freq-reflex",
  description:
    "Pre-bid filter: bid, pass, or block on brand-safety + IVT risk for RTB auctions.",
  module: "recipes/high-freq-reflex/rtb-bid-gate.ts",
  runner: "runRtbBidGate",
  questions: [
    { name: "bid", kind: "noul" },
    { name: "brand_safety", kind: "choice" },
    { name: "ivt_risk", kind: "score" },
    { name: "creative_page_align", kind: "noul" },
  ],
  actions: ["bid", "pass", "block"],
  defaultMinConfidence: 0.5,
  defaultOnLowConfidence: "suppress",
  tags: ["ads", "rtb", "brand-safety", "ivt", "latency", "reflex"],
  buildQuestions: (_state) => buildRtbBidGateQuestions(),
  decide: ({ answers }) => {
    if (answers.brand_safety.choice === "block" || answers.ivt_risk.score >= 1.5) {
      return "block";
    }
    if (
      answers.brand_safety.choice === "sensitive" ||
      answers.ivt_risk.score >= 0.9 ||
      answers.creative_page_align.noul < 0.4
    ) {
      return "pass";
    }
    if (answers.bid.noul >= 0.55 && answers.brand_safety.choice === "safe") return "bid";
    return "pass";
  },
  entryState: (state) => ({
    request: state.request,
    brand_policy: state.brand_policy,
    budget_ms: state.budget_ms,
  }),
});

function buildRtbBidGateQuestions() {
  return {
    bid: noul("Should we bid on this auction request?", {
      true: "Impression looks monetizable and on-policy",
      false: "Better to pass — weak fit, risk, or no edge",
    }),
    brand_safety: choice("Brand-safety classification for this page/context?", {
      safe: "On-brand / allowed inventory",
      sensitive: "Borderline — pass rather than risk brand",
      block: "Unsafe / prohibited — never bid",
    }),
    ivt_risk: score("Invalid-traffic / fraud risk for this request?", [
      "Clean — low IVT signals",
      "Suspicious — mixed signals",
      "Likely invalid — bots, spoof, or known bad",
    ]),
    creative_page_align: noul("Does the creative align with page/context category?", {
      true: "Creative and page category are compatible",
      false: "Mismatch or off-context placement",
    }),
  } as const;
}

export function rtbBidGateQuestions() {
  return buildRtbBidGateQuestions();
}

export type RtbBidQuestions = ReturnType<typeof rtbBidGateQuestions>;

export async function runRtbBidGate(
  harness: DecisionHarness,
  state: RtbBidState,
  opts?: { mode?: "live" | "shadow"; id?: string; minConfidence?: number },
): Promise<DecisionResult<RtbBidQuestions, RtbBidAction>> {
  return rtbBidGateRecipe.run(harness, state, opts);
}

export type RtbBidGateAction = RtbBidAction;

export type RtbBidGateState = RtbBidState;

export type RtbBidGateQuestions = RtbBidQuestions;
