import { TypeSafeClient, type EntryType, type Questions } from "@typesafe-ai/sdk";
import { aggregateConfidence } from "./confidence.js";
import {
  ConsoleDecisionLogger,
  MultiDecisionLogger,
  type DecisionLogger,
} from "./logger.js";
import { resolvePolicy } from "./policy.js";
import type {
  DecisionAction,
  DecisionRequest,
  DecisionResult,
  RunMode,
} from "./types.js";

export interface DecisionHarnessOptions {
  apiKey?: string;
  /** Defaults to jev-latest */
  defaultModel?: string;
  /**
   * Single logger (legacy). Ignored when `loggers` is provided.
   * Pass `false` to disable logging.
   */
  logger?: DecisionLogger | false;
  /** Prefer this for multiple sinks (file, OTEL, PostHog, …). */
  loggers?: DecisionLogger[];
  client?: TypeSafeClient;
}

export class DecisionHarness {
  private readonly client: TypeSafeClient;
  private readonly defaultModel: string;
  private readonly logger: DecisionLogger | null;

  constructor(options: DecisionHarnessOptions = {}) {
    this.client =
      options.client ??
      new TypeSafeClient({
        apiKey: options.apiKey ?? process.env.TYPESAFE_API_KEY,
        defaultModel: options.defaultModel ?? "jev-latest",
      });
    this.defaultModel = options.defaultModel ?? this.client.defaultModel;
    this.logger = resolveLoggers(options);
  }

  async run<Q extends Questions, A extends DecisionAction = DecisionAction>(
    request: DecisionRequest<Q, A>,
  ): Promise<DecisionResult<Q, A>> {
    const mode: RunMode = request.mode ?? "live";
    const model = request.model ?? this.defaultModel;

    const raw = await this.client.systemOne({
      state: request.state as EntryType,
      questions: request.questions,
      model,
    });

    const confidence = aggregateConfidence(raw.answers);
    const resolution = resolvePolicy(request.policy, {
      answers: raw.answers,
      confidence,
    });

    const action = mode === "shadow" ? ("shadow_noop" as const) : resolution.action;

    const result: DecisionResult<Q, A> = {
      id: request.id,
      mode,
      answers: raw.answers,
      confidence,
      intendedAction: resolution.intendedAction,
      action,
      reason:
        mode === "shadow"
          ? `shadow: would ${resolution.action} (${resolution.reason})`
          : resolution.reason,
      model: raw.model,
      usage: raw.usage,
      raw,
    };

    try {
      void this.logger?.logDecision(result);
    } catch (err) {
      console.warn("[DecisionHarness] logger failed:", err);
    }
    return result;
  }
}

function resolveLoggers(options: DecisionHarnessOptions): DecisionLogger | null {
  if (options.loggers) {
    if (options.loggers.length === 0) return null;
    if (options.loggers.length === 1) return options.loggers[0]!;
    return new MultiDecisionLogger(options.loggers);
  }
  if (options.logger === false) return null;
  return options.logger ?? new ConsoleDecisionLogger();
}
