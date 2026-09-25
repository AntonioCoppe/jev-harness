import { noul, score } from "@typesafe-ai/sdk";
import { defineRecipe } from "../../src/define-recipe.js";
import type { DecisionHarness } from "../../src/harness.js";
import type { DecisionResult } from "../../src/types.js";

export type ClaimsTriageAction = "fast_track" | "request_docs" | "adjuster" | "siu_referral";

export type ClaimsTriageState = {
  /** First notice of loss / claim description. */
  claim: string;
  /** Policy coverage excerpt. */
  policy: string;
  /** List of documents received so far. */
  documents?: string[];
};

type Answers = {
  covered: { noul: number };
  fraud_indicators: { noul: number };
  docs_complete: { noul: number };
  injury: { noul: number };
  complexity: { score: number };
};

/**
 * Insurance claims triage: rubric as independent Noul checks + complexity → fast-track or route.
 * Shape: confidence-front-door. Jev never denies a claim — uncertain coverage goes to an adjuster.
 *
 * Evidence: TypeSafe "Confidence-aware insurance claims triage" use case (claims rubric as
 * independent Noul checks with uncertain routing).
 * Equation: adjuster time on simple claims = $ + cycle time; missed fraud = loss $.
 */
export const claimsTriageRecipe = defineRecipe<
  ReturnType<typeof buildClaimsTriageQuestions>,
  ClaimsTriageAction,
  ClaimsTriageState
>({
  id: "claims-triage",
  name: "Claims Triage",
  category: "confidence-front-door",
  description:
    "Insurance claim triage: coverage, fraud, docs, injury, complexity → fast_track / request_docs / adjuster / siu_referral.",
  module: "recipes/confidence-front-door/claims-triage.ts",
  runner: "runClaimsTriage",
  questions: [
    { name: "covered", kind: "noul" },
    { name: "fraud_indicators", kind: "noul" },
    { name: "docs_complete", kind: "noul" },
    { name: "injury", kind: "noul" },
    { name: "complexity", kind: "score" },
  ],
  actions: ["fast_track", "request_docs", "adjuster", "siu_referral"],
  defaultMinConfidence: 0.6,
  defaultOnLowConfidence: "review",
  tags: ["insurance", "claims", "fraud", "triage", "front-door"],
  buildQuestions: () => buildClaimsTriageQuestions(),
  entryState: (state) => ({ ...state, documents: state.documents ?? [] }),
  decide: ({ answers }) => decideClaimsTriage(answers),
});

export function decideClaimsTriage(answers: Answers): ClaimsTriageAction {
  if (answers.fraud_indicators.noul >= 0.6) return "siu_referral";
  if (answers.docs_complete.noul < 0.5) return "request_docs";
  if (answers.covered.noul < 0.7) return "adjuster";
  if (answers.injury.noul >= 0.5 || answers.complexity.score >= 1.2) return "adjuster";
  return "fast_track";
}

function buildClaimsTriageQuestions() {
  return {
    covered: noul("Is this loss clearly covered by the policy excerpt?", {
      true: "Clearly covered",
      false: "Not covered or coverage unclear",
    }),
    fraud_indicators: noul("Are there fraud indicators (inconsistent story, timing, prior pattern)?", {
      true: "Fraud indicators present",
      false: "No fraud indicators",
    }),
    docs_complete: noul("Are the documents needed to settle this claim present?", {
      true: "Documentation complete",
      false: "Missing required documents",
    }),
    injury: noul("Does the claim involve bodily injury?", {
      true: "Bodily injury involved",
      false: "Property / non-injury only",
    }),
    complexity: score("How complex is this claim to settle?", [
      "Simple — single item, clear facts",
      "Moderate — multiple items or parties",
      "Complex — disputed facts, liability, or large loss",
    ]),
  } as const;
}

export function claimsTriageQuestions() {
  return buildClaimsTriageQuestions();
}

export type ClaimsTriageQuestions = ReturnType<typeof claimsTriageQuestions>;

export async function runClaimsTriage(
  harness: DecisionHarness,
  state: ClaimsTriageState,
  opts?: {
    mode?: "live" | "shadow";
    id?: string;
    minConfidence?: number;
    onLowConfidence?: "review" | "escalate_llm" | "suppress" | "proceed";
  },
): Promise<DecisionResult<ClaimsTriageQuestions, ClaimsTriageAction>> {
  return claimsTriageRecipe.run(harness, state, opts);
}
