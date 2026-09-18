import { choice, noul, score } from "@typesafe-ai/sdk";
import { defineRecipe } from "../../src/define-recipe.js";
import type { DecisionHarness } from "../../src/harness.js";
import type { DecisionResult } from "../../src/types.js";

export type EsportsReflexAction = string;

export type EsportsCandidate = {
  id: string;
  description: string;
};

export interface EsportsReflexState {
  goal: string;
  /** Legal actions from the game engine / rules (dynamic closed set). */
  candidates: EsportsCandidate[];
  tick?: Record<string, unknown>;
  history?: string[];
}

/**
 * Esports / game reflex next-action — extends candidate-action-selection.
 * Shape: Choice over engine-legal candidates + urgency Score + done/regroup Nouls.
 *
 * Proof equation: **planning lag per tick = rank $ + ms/frame**.
 */
export const esportsReflexRecipe = defineRecipe<
  ReturnType<typeof buildEsportsReflexQuestions>,
  EsportsReflexAction,
  EsportsReflexState
>({
  id: "esports-reflex",
  name: "Esports Reflex",
  category: "candidate-action-selection",
  description:
    "Pick the next legal game action from engine candidates; stop or regroup on Noul.",
  module: "recipes/candidate-action-selection/esports-reflex.ts",
  runner: "runEsportsReflex",
  questions: [
    { name: "legal_action", kind: "choice" },
    { name: "urgency", kind: "score" },
    { name: "done", kind: "noul" },
    { name: "regroup", kind: "noul" },
  ],
  actions: ["<candidate-id>", "STOP", "REGROUP"],
  defaultMinConfidence: 0.45,
  defaultOnLowConfidence: "review",
  tags: ["games", "esports", "reflex", "candidates", "latency"],
  buildQuestions: (state) => buildEsportsReflexQuestions(state.candidates),
  decide: ({ answers }) => {
    if (answers.done.noul >= 0.7) return "STOP";
    if (answers.regroup.noul >= 0.65 && answers.urgency.score < 1.2) return "REGROUP";
    return answers.legal_action.choice;
  },
  entryState: (state) => ({
    goal: state.goal,
    candidates: state.candidates,
    tick: state.tick,
    history: state.history ?? [],
  }),
});

function buildEsportsReflexQuestions(candidates: EsportsCandidate[]) {
  if (candidates.length < 2) {
    throw new Error("esports-reflex requires at least 2 candidates");
  }
  const criteria: Record<string, string> = {};
  for (const c of candidates) {
    criteria[c.id] = c.description;
  }
  return {
    legal_action: choice("Which legal action best advances the goal this tick?", criteria),
    urgency: score("How urgent is committing an action this tick?", [
      "Can wait / low pressure",
      "Should act soon",
      "Must act now — frame-critical",
    ]),
    done: noul("Have we already achieved the goal and should stop?", {
      true: "Objective complete — stop the loop",
      false: "Still fighting / progressing",
    }),
    regroup: noul("Should we regroup / reset rather than press this action?", {
      true: "Pull back, heal, or replan locally",
      false: "Continue pressing the selected action",
    }),
  } as const;
}

export function esportsReflexQuestions(candidates: EsportsCandidate[]) {
  return buildEsportsReflexQuestions(candidates);
}

export type EsportsReflexQuestions = ReturnType<typeof esportsReflexQuestions>;

export async function runEsportsReflex(
  harness: DecisionHarness,
  state: EsportsReflexState,
  opts?: { mode?: "live" | "shadow"; id?: string; minConfidence?: number },
): Promise<DecisionResult<EsportsReflexQuestions, EsportsReflexAction>> {
  return esportsReflexRecipe.run(harness, state, opts);
}
