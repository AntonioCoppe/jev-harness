import { choice, noul, score } from "@typesafe-ai/sdk";
import { defineRecipe } from "../../src/define-recipe.js";
import type { DecisionHarness } from "../../src/harness.js";
import type { DecisionResult } from "../../src/types.js";

export type EdgeContentModAction = "allow" | "warn" | "review" | "block";

export interface EdgeContentModState {
  content: string;
  /** Channel / surface (chat, live, ugc, ads). */
  surface?: string;
  policy?: string;
  user_risk?: string;
}

/**
 * Edge content moderation — extends ship-gate / llm-verifier patterns.
 * Shape: verify-gate with policy Noul fan-out.
 *
 * Proof equation: **toxic ships / overblocks = trust $ + stream lag**.
 * Default onLowConfidence: review — unsure goes to human, not auto-mute.
 */
export const edgeContentModRecipe = defineRecipe<
  ReturnType<typeof buildEdgeContentModQuestions>,
  EdgeContentModAction,
  EdgeContentModState
>({
  id: "edge-content-mod",
  name: "Edge Content Mod",
  category: "verify-gate",
  description:
    "Edge moderation: allow / warn / review / block with hate/sexual/self-harm/spam fan-out.",
  module: "recipes/verify-gate/edge-content-mod.ts",
  runner: "runEdgeContentMod",
  questions: [
    { name: "verdict", kind: "choice" },
    { name: "severity", kind: "score" },
    { name: "hate", kind: "noul" },
    { name: "sexual", kind: "noul" },
    { name: "self_harm", kind: "noul" },
    { name: "spam", kind: "noul" },
  ],
  actions: ["allow", "warn", "review", "block"],
  defaultMinConfidence: 0.6,
  defaultOnLowConfidence: "review",
  tags: ["moderation", "safety", "edge", "live", "guardrails"],
  buildQuestions: (_state) => buildEdgeContentModQuestions(),
  decide: ({ answers }) => {
    const anyHard =
      answers.hate.noul >= 0.65 ||
      answers.sexual.noul >= 0.65 ||
      answers.self_harm.noul >= 0.55 ||
      answers.severity.score >= 1.5;
    if (anyHard || answers.verdict.choice === "block") return "block";
    if (answers.spam.noul >= 0.7 && answers.severity.score >= 0.8) return "block";
    if (
      answers.verdict.choice === "review" ||
      answers.severity.score >= 1.0 ||
      answers.hate.noul >= 0.4 ||
      answers.sexual.noul >= 0.4 ||
      answers.self_harm.noul >= 0.35
    ) {
      return "review";
    }
    if (answers.verdict.choice === "warn" || answers.spam.noul >= 0.45) return "warn";
    return "allow";
  },
  entryState: (state) => ({
    content: state.content,
    surface: state.surface,
    policy: state.policy,
    user_risk: state.user_risk,
  }),
});

function buildEdgeContentModQuestions() {
  return {
    verdict: choice("How should we dispose of this content at the edge?", {
      allow: "On-policy — release / keep visible",
      warn: "Soft action — label, throttle, or warn user",
      review: "Ambiguous — human / secondary queue",
      block: "Mute / remove / hard block",
    }),
    severity: score("How severe is the policy violation if present?", [
      "None / negligible",
      "Moderate — warn or review",
      "Severe — immediate block",
    ]),
    hate: noul("Does this contain hate or harassment targeting protected classes?", {
      true: "Clear hate / harassment",
      false: "No clear hate signal",
    }),
    sexual: noul("Does this contain prohibited sexual / NSFW content for this surface?", {
      true: "Prohibited sexual content",
      false: "No clear sexual policy break",
    }),
    self_harm: noul("Does this involve self-harm or suicide content needing action?", {
      true: "Self-harm / suicide content present",
      false: "No self-harm signal",
    }),
    spam: noul("Is this spam, scams, or low-quality flood?", {
      true: "Spam / scam / flood",
      false: "Not spam-like",
    }),
  } as const;
}

export function edgeContentModQuestions() {
  return buildEdgeContentModQuestions();
}

export type EdgeContentModQuestions = ReturnType<typeof edgeContentModQuestions>;

export async function runEdgeContentMod(
  harness: DecisionHarness,
  state: EdgeContentModState,
  opts?: { mode?: "live" | "shadow"; id?: string; minConfidence?: number },
): Promise<DecisionResult<EdgeContentModQuestions, EdgeContentModAction>> {
  return edgeContentModRecipe.run(harness, state, opts);
}
