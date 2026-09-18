import { noul, score } from "@typesafe-ai/sdk";
import type { DecisionHarness } from "../../src/harness.js";
import type { DecisionResult } from "../../src/types.js";

export type HotPathAllowAction = "allow" | "deny";

export interface HotPathAllowState {
  /** Compact event payload for a sub-100ms allow/deny gate. */
  event: Record<string, string | number | boolean | null>;
  policy_hint?: string;
}

/**
 * Sub-100ms allow/deny reflex on a hot path.
 * Shape: high-freq-reflex.
 */
export function hotPathAllowQuestions() {
  return {
    allow: noul("Should this event be allowed to proceed?"),
    severity: score("If we deny incorrectly, how bad is the fallout?", [
      "Low — easy retry",
      "Medium — user friction",
      "High — safety, money, or trust",
    ]),
  } as const;
}

export type HotPathAllowQuestions = ReturnType<typeof hotPathAllowQuestions>;

export async function runHotPathAllow(
  harness: DecisionHarness,
  state: HotPathAllowState,
  opts?: { mode?: "live" | "shadow"; id?: string; minConfidence?: number },
): Promise<DecisionResult<HotPathAllowQuestions, HotPathAllowAction>> {
  const questions = hotPathAllowQuestions();
  return harness.run({
    id: opts?.id,
    mode: opts?.mode,
    state,
    questions,
    policy: {
      minConfidence: opts?.minConfidence ?? 0.5,
      onLowConfidence: "review",
      decide: ({ answers }) => {
        // High severity + uncertain allow → deny (fail closed on hot path).
        if (answers.severity.score >= 1.5 && answers.allow.noul < 0.65) return "deny";
        return answers.allow.noul >= 0.55 ? "allow" : "deny";
      },
    },
  });
}
