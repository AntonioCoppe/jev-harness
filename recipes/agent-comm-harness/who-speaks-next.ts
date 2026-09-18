import { choice, noul, score } from "@typesafe-ai/sdk";
import { defineRecipe } from "../../src/define-recipe.js";
import type { DecisionHarness } from "../../src/harness.js";
import type { DecisionResult } from "../../src/types.js";

/** Domain action: agent id, `user`, or `none` (no speaker / pause). */
export type WhoSpeaksNextAction = string;

export type AgentOption = { id: string; description: string };

export type WhoSpeaksNextState = {
  goal: string;
  agents: AgentOption[];
  /** Currently speaking agent id, if any. */
  current_speaker?: string;
  /** Recent turns / transcript snippets. */
  transcript?: string[];
  context?: string;
};

/**
 * Multi-agent who-speaks-next selector (Swarm / AutoGen SelectorGroupChat replacement).
 * Extends stop-or-continue + tool-picker shapes; catalog category: candidate-action-selection.
 *
 * Proof equation: wasted speaker turns = $ (tokens) + wallclock. Measure YOUR selector p50;
 * do not invent timings.
 */
export const whoSpeaksNextRecipe = defineRecipe<
  ReturnType<typeof buildWhoSpeaksNextQuestions>,
  WhoSpeaksNextAction,
  WhoSpeaksNextState
>({
  id: "who-speaks-next",
  name: "Who Speaks Next",
  category: "candidate-action-selection",
  description:
    "Pick the next multi-agent speaker (agent id / user / none) with handoff + user-turn gates.",
  module: "recipes/agent-comm-harness/who-speaks-next.ts",
  runner: "runWhoSpeaksNext",
  questions: [
    { name: "next_speaker", kind: "choice" },
    { name: "progress", kind: "score" },
    { name: "needs_handoff", kind: "noul" },
    { name: "user_turn", kind: "noul" },
  ],
  actions: ["<agent-id>", "user", "none"],
  defaultMinConfidence: 0.5,
  defaultOnLowConfidence: "review",
  tags: ["agent-comm-harness", "multi-agent", "handoff", "selector", "candidates"],
  buildQuestions: (state) => buildWhoSpeaksNextQuestions(state.agents),
  decide: ({ answers }, state) => {
    if (answers.user_turn.noul >= 0.6) return "user";
    if (answers.next_speaker.choice === "none") return "none";
    if (answers.needs_handoff.noul < 0.4 && state.current_speaker) {
      const stillPresent = state.agents.some((a) => a.id === state.current_speaker);
      if (stillPresent) return state.current_speaker;
    }
    if (answers.progress.score < 0.35 && answers.needs_handoff.noul < 0.35) {
      return "none";
    }
    return answers.next_speaker.choice;
  },
});

function buildWhoSpeaksNextQuestions(agents: AgentOption[]) {
  if (agents.length < 1) {
    throw new Error("who-speaks-next requires at least 1 agent");
  }
  const options: Record<string, string> = {};
  for (const a of agents) options[a.id] = a.description;
  options.user = "Human must answer before any agent continues";
  options.none = "No speaker — pause / wait / stop the round";

  return {
    next_speaker: choice("Who should speak or act next?", options),
    progress: score("How is the multi-agent team progressing toward the goal?", [
      "Stuck / thrashing / no useful progress",
      "Slow — some motion but wasteful turns",
      "On track — useful specialist work",
      "Near done — close to a terminal answer",
    ]),
    needs_handoff: noul("Should control leave the current speaker?", {
      true: "Handoff to another agent or the user",
      false: "Current speaker should keep the turn",
    }),
    user_turn: noul("Is a human answer required before any agent continues?", {
      true: "Need user clarification, approval, or missing info",
      false: "Agents can proceed without the user",
    }),
  } as const;
}

export function whoSpeaksNextQuestions(agents: AgentOption[]) {
  return buildWhoSpeaksNextQuestions(agents);
}

export type WhoSpeaksNextQuestions = ReturnType<typeof whoSpeaksNextQuestions>;

export async function runWhoSpeaksNext(
  harness: DecisionHarness,
  state: WhoSpeaksNextState,
  opts?: {
    mode?: "live" | "shadow";
    id?: string;
    minConfidence?: number;
    onLowConfidence?: "review" | "escalate_llm" | "suppress" | "proceed";
  },
): Promise<DecisionResult<WhoSpeaksNextQuestions, WhoSpeaksNextAction>> {
  return whoSpeaksNextRecipe.run(harness, state, opts);
}
