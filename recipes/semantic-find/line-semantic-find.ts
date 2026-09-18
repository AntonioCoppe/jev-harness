import { choice, noul } from "@typesafe-ai/sdk";
import type { DecisionHarness } from "../../src/harness.js";
import type { DecisionResult } from "../../src/types.js";

export type LineSemanticFindAction = string; // line id or "NONE"

export interface LineCandidate {
  id: string;
  text: string;
}

export interface LineSemanticFindState {
  query: string;
  lines: LineCandidate[];
}

/**
 * Pick the best doc line for an NL query, or NONE if nothing fits.
 * Shape: semantic-find (Choice + exists Noul).
 */
export function lineSemanticFindQuestions(lines: LineCandidate[]) {
  if (lines.length < 1) {
    throw new Error("line-semantic-find requires at least 1 line candidate");
  }
  const criteria: Record<string, string> = {};
  for (const line of lines) {
    criteria[line.id] = line.text.slice(0, 240);
  }
  return {
    best: choice("Which line best answers the query?", criteria),
    answer_exists: noul("Does any line adequately answer the query?"),
  } as const;
}

export async function runLineSemanticFind(
  harness: DecisionHarness,
  state: LineSemanticFindState,
  opts?: { mode?: "live" | "shadow"; id?: string; minConfidence?: number },
): Promise<
  DecisionResult<ReturnType<typeof lineSemanticFindQuestions>, LineSemanticFindAction>
> {
  const questions = lineSemanticFindQuestions(state.lines);
  return harness.run({
    id: opts?.id,
    mode: opts?.mode,
    state,
    questions,
    policy: {
      minConfidence: opts?.minConfidence ?? 0.5,
      onLowConfidence: "review",
      decide: ({ answers }) => {
        if (answers.answer_exists.noul < 0.45) return "NONE";
        return answers.best.choice;
      },
    },
  });
}
