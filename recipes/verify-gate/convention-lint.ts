import { noul } from "@typesafe-ai/sdk";
import { defineRecipe } from "../../src/define-recipe.js";
import type { DecisionHarness } from "../../src/harness.js";
import type { DecisionResult } from "../../src/types.js";

export type ConventionLintAction = "pass" | "warn" | "fail";

export type Convention = {
  id: string;
  /** Plain-language team rule, e.g. "Public functions have a docstring". */
  rule: string;
  /** "error" fails the check; "warn" only warns (default "warn"). */
  severity?: "error" | "warn";
};

export type ConventionLintState = {
  /** Diff or changed file excerpt. */
  diff: string;
  conventions: Convention[];
};

type Answers = Record<string, { noul: number }>;

export const violatesKey = (conventionId: string) => `violates__${conventionId}`;

/**
 * Semantic lint: one Noul per team convention over a diff → pass / warn / fail (CI check).
 * Shape: verify-gate. Conventions that regex linters can't express ("errors are wrapped with context").
 *
 * Evidence: TypeSafe "Semantic code and writing linting" use case (team conventions → CI checks);
 * Jev-Pref (diffs vs project preferences); Jev.nvim (score functions against plain-language questions).
 * Equation: convention drift caught in review = reviewer hours; caught in CI = seconds.
 */
export const conventionLintRecipe = defineRecipe<
  ReturnType<typeof buildConventionLintQuestions>,
  ConventionLintAction,
  ConventionLintState
>({
  id: "convention-lint",
  name: "Convention Lint",
  category: "verify-gate",
  description:
    "Semantic CI lint: one Noul per plain-language team convention over a diff → pass / warn / fail.",
  module: "recipes/verify-gate/convention-lint.ts",
  runner: "runConventionLint",
  questions: [{ name: "violates__<convention-id>", kind: "noul" }],
  actions: ["pass", "warn", "fail"],
  defaultMinConfidence: 0.55,
  defaultOnLowConfidence: "proceed",
  tags: ["lint", "ci", "conventions", "code-review", "writing", "verify-gate"],
  buildQuestions: (state) => buildConventionLintQuestions(state.conventions),
  decide: ({ answers }, state) => decideConventionLint(answers as unknown as Answers, state.conventions),
});

export function decideConventionLint(answers: Answers, conventions: Convention[]): ConventionLintAction {
  let action: ConventionLintAction = "pass";
  for (const c of conventions) {
    const p = answers[violatesKey(c.id)]?.noul ?? 0;
    if (p >= 0.7 && c.severity === "error") return "fail";
    if (p >= 0.5) action = "warn";
  }
  return action;
}

function buildConventionLintQuestions(conventions: Convention[]) {
  if (conventions.length < 1) throw new Error("convention-lint requires at least 1 convention");
  const questions: Record<string, ReturnType<typeof noul>> = {};
  for (const c of conventions) {
    questions[violatesKey(c.id)] = noul(`Does the change violate this convention: "${c.rule}"?`, {
      true: "The change violates the convention",
      false: "The change follows it, or it doesn't apply",
    });
  }
  return questions;
}

export function conventionLintQuestions(conventions: Convention[]) {
  return buildConventionLintQuestions(conventions);
}

export type ConventionLintQuestions = ReturnType<typeof conventionLintQuestions>;

export async function runConventionLint(
  harness: DecisionHarness,
  state: ConventionLintState,
  opts?: {
    mode?: "live" | "shadow";
    id?: string;
    minConfidence?: number;
    onLowConfidence?: "review" | "escalate_llm" | "suppress" | "proceed";
  },
): Promise<DecisionResult<ConventionLintQuestions, ConventionLintAction>> {
  return conventionLintRecipe.run(harness, state, opts);
}
