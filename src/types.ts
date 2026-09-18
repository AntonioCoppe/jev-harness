import type {
  ChoiceResponse,
  EntryType,
  NoulResponse,
  Questions,
  ScoreResponse,
  SystemOneResult,
} from "@typesafe-ai/sdk";

export type { EntryType, Questions };
export type AnswersOf<Q extends Questions> = SystemOneResult<Q>["answers"];

export type DecisionAction = string;

/** What to do when aggregate confidence is below the policy threshold. */
export type LowConfidenceStrategy = "review" | "escalate_llm" | "suppress" | "proceed";

export type RunMode = "live" | "shadow";

export interface PolicyContext<Q extends Questions> {
  answers: AnswersOf<Q>;
  confidence: number;
}

export interface DecisionPolicy<Q extends Questions, A extends DecisionAction = DecisionAction> {
  /** Minimum confidence to auto-act. Default 0.55. */
  minConfidence?: number;
  /** Behaviour when confidence is below the threshold. Default "review". */
  onLowConfidence?: LowConfidenceStrategy;
  /** Map Jev answers → a domain action. */
  decide: (ctx: PolicyContext<Q>) => A;
}

export interface DecisionRequest<Q extends Questions, A extends DecisionAction = DecisionAction> {
  /**
   * Application state for Jev. Forwarded to System One as EntryType
   * (string | JSON object/array | null). Callers may pass plain objects;
   * the harness casts at the SDK boundary.
   */
  state: unknown;
  questions: Q;
  policy: DecisionPolicy<Q, A>;
  model?: string;
  mode?: RunMode;
  /** Optional correlation id for logs. */
  id?: string;
}

export interface DecisionResult<Q extends Questions, A extends DecisionAction = DecisionAction> {
  id?: string;
  mode: RunMode;
  answers: AnswersOf<Q>;
  confidence: number;
  /** Action the policy selected before low-confidence / shadow overrides. */
  intendedAction: A;
  /**
   * Action to execute.
   * In shadow mode this is always "shadow_noop".
   */
  action: A | "shadow_noop" | "review" | "escalate_llm" | "suppress";
  reason: string;
  model: string;
  usage: { input_tokens: number; output_tokens: number };
  raw: SystemOneResult<Q>;
}

export type AnyAnswer = ChoiceResponse | ScoreResponse | NoulResponse;

export function isChoiceAnswer(a: AnyAnswer): a is ChoiceResponse {
  return a.type === "choice";
}

export function isScoreAnswer(a: AnyAnswer): a is ScoreResponse {
  return a.type === "score";
}

export function isNoulAnswer(a: AnyAnswer): a is NoulResponse {
  return a.type === "noul";
}
