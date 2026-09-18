import type { Questions } from "@typesafe-ai/sdk";
import type {
  DecisionAction,
  DecisionPolicy,
  LowConfidenceStrategy,
  PolicyContext,
} from "./types.js";

export interface PolicyResolution<A extends DecisionAction> {
  intendedAction: A;
  action: A | "review" | "escalate_llm" | "suppress";
  reason: string;
  belowThreshold: boolean;
}

export function resolvePolicy<Q extends Questions, A extends DecisionAction>(
  policy: DecisionPolicy<Q, A>,
  ctx: PolicyContext<Q>,
): PolicyResolution<A> {
  const minConfidence = policy.minConfidence ?? 0.55;
  const onLow: LowConfidenceStrategy = policy.onLowConfidence ?? "review";
  const intendedAction = policy.decide(ctx);
  const belowThreshold = ctx.confidence < minConfidence;

  if (!belowThreshold) {
    return {
      intendedAction,
      action: intendedAction,
      reason: `confidence ${ctx.confidence.toFixed(3)} ≥ ${minConfidence}`,
      belowThreshold: false,
    };
  }

  if (onLow === "proceed") {
    return {
      intendedAction,
      action: intendedAction,
      reason: `confidence ${ctx.confidence.toFixed(3)} < ${minConfidence} but onLowConfidence=proceed`,
      belowThreshold: true,
    };
  }

  return {
    intendedAction,
    action: onLow,
    reason: `confidence ${ctx.confidence.toFixed(3)} < ${minConfidence} → ${onLow}`,
    belowThreshold: true,
  };
}
