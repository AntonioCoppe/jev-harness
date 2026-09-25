import { choice, noul } from "@typesafe-ai/sdk";
import { defineRecipe } from "../../src/define-recipe.js";
import type { DecisionHarness } from "../../src/harness.js";
import type { DecisionResult } from "../../src/types.js";

export type CitationSupportAction = "accept" | "flag" | "reject";

export type CitationSupportState = {
  /** The sentence / claim that carries the citation. */
  claim: string;
  /** Excerpt of the cited source (retrieved by code). */
  source_excerpt: string;
};

/**
 * Claim vs cited source: supports / contradicts / says nothing → accept / flag / reject.
 * Shape: verify-gate. Low confidence routes to human review (default `review`).
 *
 * Deepens taxonomy P1 stub `citation-support` (TypeSafe citation_check cookbook).
 * Evidence: https://github.com/MarissaFamularo/citation-verifier (manuscript citation
 * checker; Jev scores whether the cited passage supports the claim).
 * Equation: unsupported citations shipped = retractions / trust $ + reviewer hours.
 */
export const citationSupportRecipe = defineRecipe<
  ReturnType<typeof buildCitationSupportQuestions>,
  CitationSupportAction,
  CitationSupportState
>({
  id: "citation-support",
  name: "Citation Support",
  category: "verify-gate",
  description:
    "Check a claim against its cited passage: supports / contradicts / silent → accept / flag / reject.",
  module: "recipes/verify-gate/citation-support.ts",
  runner: "runCitationSupport",
  questions: [
    { name: "support", kind: "choice" },
    { name: "quote_present", kind: "noul" },
  ],
  actions: ["accept", "flag", "reject"],
  defaultMinConfidence: 0.6,
  defaultOnLowConfidence: "review",
  tags: ["citations", "claims", "grounding", "rag", "verify-gate"],
  buildQuestions: () => buildCitationSupportQuestions(),
  decide: ({ answers }) => {
    if (answers.support.choice === "contradicts") return "reject";
    if (answers.support.choice === "silent") return "flag";
    // Supports, but nothing in the excerpt actually carries the claim → flag.
    if (answers.quote_present.noul < 0.4) return "flag";
    return "accept";
  },
});

function buildCitationSupportQuestions() {
  return {
    support: choice("Does the cited passage support the claim?", {
      supports: "The passage supports the claim",
      contradicts: "The passage contradicts the claim",
      silent: "The passage says nothing that establishes the claim",
    }),
    quote_present: noul("Does the passage contain specific text that backs the claim?", {
      true: "A specific sentence or figure in the passage backs the claim",
      false: "Only topical overlap; no specific backing text",
    }),
  } as const;
}

export function citationSupportQuestions() {
  return buildCitationSupportQuestions();
}

export type CitationSupportQuestions = ReturnType<typeof citationSupportQuestions>;

export async function runCitationSupport(
  harness: DecisionHarness,
  state: CitationSupportState,
  opts?: {
    mode?: "live" | "shadow";
    id?: string;
    minConfidence?: number;
    onLowConfidence?: "review" | "escalate_llm" | "suppress" | "proceed";
  },
): Promise<DecisionResult<CitationSupportQuestions, CitationSupportAction>> {
  return citationSupportRecipe.run(harness, state, opts);
}
