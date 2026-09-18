import type { DecisionResult, Questions } from "../types.js";

/** Stable JSON payload shared by all decision log sinks. */
export function decisionLogPayload<Q extends Questions>(result: DecisionResult<Q>) {
  return {
    ts: new Date().toISOString(),
    id: result.id,
    mode: result.mode,
    model: result.model,
    confidence: Number(result.confidence.toFixed(4)),
    intendedAction: result.intendedAction,
    action: result.action,
    reason: result.reason,
    usage: result.usage,
  };
}
