import { DecisionHarness, score, type DecisionResult } from "../../src/index.js";

export type RubricAction = "pass" | "revise" | "fail";

export type RubricDimension = {
  id: string;
  instructions: string;
  levels: [string, string, ...string[]];
  weight?: number;
};

/**
 * Score a submission against an ordered rubric (education / interview practice).
 */
export function rubricQuestions(dimensions: RubricDimension[]) {
  const questions: Record<string, ReturnType<typeof score>> = {};
  for (const d of dimensions) {
    questions[d.id] = score(d.instructions, d.levels);
  }
  return questions;
}

export async function runRubricScorer(
  harness: DecisionHarness,
  state: { prompt: string; submission: string; rubric_notes?: string },
  dimensions: RubricDimension[],
  opts?: { mode?: "live" | "shadow"; id?: string; passThreshold?: number },
): Promise<DecisionResult<ReturnType<typeof rubricQuestions>, RubricAction> & { weightedScore: number }> {
  const questions = rubricQuestions(dimensions);
  const passThreshold = opts?.passThreshold ?? 1.2;

  let weightedScore = 0;

  const result = await harness.run({
    id: opts?.id,
    mode: opts?.mode,
    state,
    questions,
    policy: {
      minConfidence: 0.5,
      onLowConfidence: "review",
      decide: ({ answers }) => {
        let total = 0;
        let weightSum = 0;
        for (const d of dimensions) {
          const w = d.weight ?? 1;
          const a = (answers as Record<string, { score: number }>)[d.id];
          total += (a?.score ?? 0) * w;
          weightSum += w;
        }
        weightedScore = weightSum ? total / weightSum : 0;
        if (weightedScore >= passThreshold + 0.5) return "pass";
        if (weightedScore >= passThreshold - 0.3) return "revise";
        return "fail";
      },
    },
  });

  return Object.assign(result, { weightedScore });
}
