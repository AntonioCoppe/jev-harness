import { choice, noul } from "@typesafe-ai/sdk";
import type { DecisionHarness } from "../../src/harness.js";
import type { DecisionResult } from "../../src/types.js";

export type SpanPickAction = string; // span id or "NONE"

export interface SpanCandidate {
  id: string;
  text: string;
  /** Optional source hint (regex group, OCR box, …). */
  source?: string;
}

export interface SpanPickState {
  request: string;
  spans: SpanCandidate[];
}

/**
 * Pre-parsed value / span pick: Choice over candidate spans + none_fit Noul.
 * Shape: semantic-find.
 */
export function spanPickQuestions(spans: SpanCandidate[]) {
  if (spans.length < 1) {
    throw new Error("span-pick requires at least 1 span candidate");
  }
  const criteria: Record<string, string> = {};
  for (const s of spans) {
    criteria[s.id] = s.source ? `${s.text} (${s.source})` : s.text;
  }
  return {
    span: choice("Which candidate span best satisfies the request?", criteria),
    none_fit: noul("Do none of the spans fit the request?"),
  } as const;
}

export async function runSpanPick(
  harness: DecisionHarness,
  state: SpanPickState,
  opts?: { mode?: "live" | "shadow"; id?: string; minConfidence?: number },
): Promise<DecisionResult<ReturnType<typeof spanPickQuestions>, SpanPickAction>> {
  const questions = spanPickQuestions(state.spans);
  return harness.run({
    id: opts?.id,
    mode: opts?.mode,
    state,
    questions,
    policy: {
      minConfidence: opts?.minConfidence ?? 0.5,
      onLowConfidence: "review",
      decide: ({ answers }) => {
        if (answers.none_fit.noul >= 0.55) return "NONE";
        return answers.span.choice;
      },
    },
  });
}
