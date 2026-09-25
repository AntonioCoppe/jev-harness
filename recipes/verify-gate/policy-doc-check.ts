import { noul } from "@typesafe-ai/sdk";
import { defineRecipe } from "../../src/define-recipe.js";
import type { DecisionHarness } from "../../src/harness.js";
import type { DecisionResult } from "../../src/types.js";

export type PolicyDocCheckAction = "compliant" | "needs_review" | "noncompliant";

export type PolicyRequirement = {
  id: string;
  /** Requirement the document must meet, e.g. "Contains a data-retention clause". */
  requirement: string;
  /** Mandatory requirements make the document noncompliant when clearly unmet (default true). */
  mandatory?: boolean;
};

export type PolicyDocCheckState = {
  /** Contract / filing / policy document (or the relevant section). */
  document: string;
  requirements: PolicyRequirement[];
};

type Answers = Record<string, { noul: number }>;

export const meetsKey = (requirementId: string) => `meets__${requirementId}`;

/**
 * Batched compliance check: one Noul per requirement over a document, all in one call →
 * compliant / needs_review / noncompliant.
 * Shape: verify-gate (document vs requirements checklist; map over many documents).
 *
 * Evidence: TypeSafe "Policy, compliance, and document verification" + "Batched regulatory and
 * policy review" use cases (many questions per document, map-reduce).
 * Equation: manual checklist review per document = legal / ops hours; missed clauses = liability.
 */
export const policyDocCheckRecipe = defineRecipe<
  ReturnType<typeof buildPolicyDocCheckQuestions>,
  PolicyDocCheckAction,
  PolicyDocCheckState
>({
  id: "policy-doc-check",
  name: "Policy Doc Check",
  category: "verify-gate",
  description:
    "Batched compliance checklist: one Noul per requirement over a document → compliant / needs_review / noncompliant.",
  module: "recipes/verify-gate/policy-doc-check.ts",
  runner: "runPolicyDocCheck",
  questions: [{ name: "meets__<requirement-id>", kind: "noul" }],
  actions: ["compliant", "needs_review", "noncompliant"],
  defaultMinConfidence: 0.6,
  defaultOnLowConfidence: "review",
  tags: ["compliance", "contracts", "regulatory", "documents", "checklist", "verify-gate"],
  buildQuestions: (state) => buildPolicyDocCheckQuestions(state.requirements),
  decide: ({ answers }, state) => decidePolicyDocCheck(answers as unknown as Answers, state.requirements),
});

export function decidePolicyDocCheck(
  answers: Answers,
  requirements: PolicyRequirement[],
): PolicyDocCheckAction {
  let action: PolicyDocCheckAction = "compliant";
  for (const r of requirements) {
    const p = answers[meetsKey(r.id)]?.noul ?? 0;
    if (p < 0.3 && (r.mandatory ?? true)) return "noncompliant";
    if (p < 0.7) action = "needs_review";
  }
  return action;
}

function buildPolicyDocCheckQuestions(requirements: PolicyRequirement[]) {
  if (requirements.length < 1) throw new Error("policy-doc-check requires at least 1 requirement");
  const questions: Record<string, ReturnType<typeof noul>> = {};
  for (const r of requirements) {
    questions[meetsKey(r.id)] = noul(`Does the document meet this requirement: "${r.requirement}"?`, {
      true: "Requirement clearly met",
      false: "Requirement missing or not met",
    });
  }
  return questions;
}

export function policyDocCheckQuestions(requirements: PolicyRequirement[]) {
  return buildPolicyDocCheckQuestions(requirements);
}

export type PolicyDocCheckQuestions = ReturnType<typeof policyDocCheckQuestions>;

export async function runPolicyDocCheck(
  harness: DecisionHarness,
  state: PolicyDocCheckState,
  opts?: {
    mode?: "live" | "shadow";
    id?: string;
    minConfidence?: number;
    onLowConfidence?: "review" | "escalate_llm" | "suppress" | "proceed";
  },
): Promise<DecisionResult<PolicyDocCheckQuestions, PolicyDocCheckAction>> {
  return policyDocCheckRecipe.run(harness, state, opts);
}
