import { TypeSafeClient, type EntryType, type Questions } from "@typesafe-ai/sdk";
import { aggregateConfidence } from "./confidence.js";
import { ConsoleDecisionLogger, type DecisionLogger } from "./logger.js";
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
  logger?: DecisionLogger | false;
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
    this.logger =
      options.logger === false ? null : (options.logger ?? new ConsoleDecisionLogger());
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

    this.logger?.logDecision(result);
    return result;
  }
}
