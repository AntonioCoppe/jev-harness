import type { DecisionResult, Questions } from "./types.js";

export interface DecisionLogger {
  logDecision<Q extends Questions>(result: DecisionResult<Q>): void;
}

export class ConsoleDecisionLogger implements DecisionLogger {
  logDecision<Q extends Questions>(result: DecisionResult<Q>): void {
    console.log(
      JSON.stringify({
        ts: new Date().toISOString(),
        id: result.id,
        mode: result.mode,
        model: result.model,
        confidence: Number(result.confidence.toFixed(4)),
        intendedAction: result.intendedAction,
        action: result.action,
        reason: result.reason,
        usage: result.usage,
      }),
    );
  }
}

export class MemoryDecisionLogger implements DecisionLogger {
  readonly entries: DecisionResult<Questions>[] = [];
  logDecision<Q extends Questions>(result: DecisionResult<Q>): void {
    this.entries.push(result as DecisionResult<Questions>);
  }
}
