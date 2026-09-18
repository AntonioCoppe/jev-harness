import type { DecisionResult, Questions } from "./types.js";
import { decisionLogPayload } from "./loggers/serialize.js";

export interface DecisionLogger {
  logDecision<Q extends Questions>(result: DecisionResult<Q>): void | Promise<void>;
}

export class ConsoleDecisionLogger implements DecisionLogger {
  logDecision<Q extends Questions>(result: DecisionResult<Q>): void {
    console.log(JSON.stringify(decisionLogPayload(result)));
  }
}

export class MemoryDecisionLogger implements DecisionLogger {
  readonly entries: DecisionResult<Questions>[] = [];
  logDecision<Q extends Questions>(result: DecisionResult<Q>): void {
    this.entries.push(result as DecisionResult<Questions>);
  }
}

/** Fan-out to multiple sinks (errors isolated per sink). */
export class MultiDecisionLogger implements DecisionLogger {
  constructor(private readonly sinks: DecisionLogger[]) {}

  logDecision<Q extends Questions>(result: DecisionResult<Q>): void {
    for (const sink of this.sinks) {
      try {
        void sink.logDecision(result);
      } catch (err) {
        console.warn("[MultiDecisionLogger] sink failed:", err);
      }
    }
  }
}

export {
  FileDecisionLogger,
  OtelDecisionLogger,
  PostHogDecisionLogger,
  decisionLogPayload,
  type FileDecisionLoggerOptions,
  type OtelDecisionLoggerOptions,
  type PostHogDecisionLoggerOptions,
} from "./loggers/index.js";
