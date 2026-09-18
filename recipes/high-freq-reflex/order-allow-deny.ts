import { choice, noul, score } from "@typesafe-ai/sdk";
import { defineRecipe } from "../../src/define-recipe.js";
import type { DecisionHarness } from "../../src/harness.js";
import type { DecisionResult } from "../../src/types.js";

export type OrderAllowDenyAction = "allow" | "deny" | "cancel" | "hold";

export interface OrderAllowDenyState {
  /** Compact proposed order + book / inventory / risk snapshot. */
  order: Record<string, string | number | boolean | null>;
  /** Optional recent headline / news blurb that may conflict with thesis. */
  news?: string;
  /** Desk / risk policy hint. */
  policy_hint?: string;
  budget_ms?: number;
}

/**
 * Pre-trade order allow/deny gate (not a pricing model).
 * Shape: high-freq-reflex — builds on mm-buy-sell + hot-path-allow.
 *
 * Proof: gate p50 <150ms / p99 <300ms; shadow↔live agreement; denied-would-have-lost $.
 */
export const orderAllowDenyRecipe = defineRecipe<
  ReturnType<typeof buildOrderAllowDenyQuestions>,
  OrderAllowDenyAction,
  OrderAllowDenyState
>({
  id: "order-allow-deny",
  name: "Order Allow Deny",
  category: "high-freq-reflex",
  description:
    "Pre-trade allow/deny/cancel/hold gate with edge, risk, and news-conflict checks.",
  module: "recipes/high-freq-reflex/order-allow-deny.ts",
  runner: "runOrderAllowDeny",
  questions: [
    { name: "allow_order", kind: "noul" },
    { name: "side_intent", kind: "choice" },
    { name: "edge", kind: "score" },
    { name: "risk", kind: "score" },
    { name: "news_conflict", kind: "noul" },
  ],
  actions: ["allow", "deny", "cancel", "hold"],
  defaultMinConfidence: 0.5,
  defaultOnLowConfidence: "suppress",
  tags: ["latency", "trading", "gate", "risk", "reflex"],
  buildQuestions: (_state) => buildOrderAllowDenyQuestions(),
  decide: ({ answers }) => {
    if (answers.news_conflict.noul >= 0.55) return "deny";
    if (answers.risk.score >= 1.5) return "deny";
    if (answers.side_intent.choice === "cancel") return "cancel";
    if (answers.side_intent.choice === "hold") return "hold";
    if (answers.allow_order.noul < 0.55) return "deny";
    if (answers.edge.score < 0.9) return "hold";
    if (answers.risk.score >= 1.0 && answers.edge.score < 1.4) return "deny";
    return "allow";
  },
});

function buildOrderAllowDenyQuestions() {
  return {
    allow_order: noul("Should this order hit the wire given policy + context?", {
      true: "Policy-ok, thesis intact, size within limits — send it",
      false: "Do not send — policy, risk, or thesis broken",
    }),
    side_intent: choice("What side / disposition does the signal intend?", {
      buy: "Lift / bid — expected positive edge",
      sell: "Hit / offer — expected positive edge",
      cancel: "Pull resting / cancel in-flight",
      hold: "No wire action this tick",
    }),
    edge: score("How strong is the expected edge if we act?", [
      "Noise / unclear",
      "Modest edge",
      "Strong, clear edge",
    ]),
    risk: score("Where is risk vs limits for this order?", [
      "Within limits",
      "Elevated — tight but acceptable",
      "Breach — oversize, concentration, or kill-band",
    ]),
    news_conflict: noul("Does recent headline/news contradict the trade thesis?", {
      true: "Material conflict — flatten or skip",
      false: "No material news conflict",
    }),
  } as const;
}

export function orderAllowDenyQuestions() {
  return buildOrderAllowDenyQuestions();
}

export type OrderAllowDenyQuestions = ReturnType<typeof orderAllowDenyQuestions>;

export async function runOrderAllowDeny(
  harness: DecisionHarness,
  state: OrderAllowDenyState,
  opts?: {
    mode?: "live" | "shadow";
    id?: string;
    minConfidence?: number;
    onLowConfidence?: "review" | "escalate_llm" | "suppress" | "proceed";
  },
): Promise<DecisionResult<OrderAllowDenyQuestions, OrderAllowDenyAction>> {
  return orderAllowDenyRecipe.run(harness, state, opts);
}
