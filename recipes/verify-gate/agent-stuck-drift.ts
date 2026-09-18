import { choice, noul, score } from "@typesafe-ai/sdk";
import { defineRecipe } from "../../src/define-recipe.js";
import type { DecisionHarness } from "../../src/harness.js";
import type { DecisionResult } from "../../src/types.js";

export type AgentStuckDriftAction = "continue" | "nudge" | "recover" | "stop_review";

export type AgentStuckDriftState = {
  /** What the coding agent was asked to finish. */
  goal: string;
  /** Recent steps / tool results / assistant turns (Foreman-style trace tail). */
  trace_tail: string[];
  /** Compact test / CI summary if available. */
  test_summary?: string;
  /** Whether the agent claimed the goal is done. */
  claimed_done?: boolean;
  remaining_budget?: string;
};

/**
 * Foreman-shaped agent supervisor: stuck / drift / tests / progress → intervene.
 * Shape: verify-gate (supervision over an agent trace, not a single LLM string).
 *
 * Differs from `stop-or-continue`: multi-signal pack with drift + tests_pass and
 * intervene actions (nudge / recover / stop_review), not just loop control.
 *
 * Evidence: JoshARosen / thruwire/foreman (public OSS + X demo).
 * Equation: stuck/drifted workers = wasted agent $ + wallclock.
 */
export const agentStuckDriftRecipe = defineRecipe<
  ReturnType<typeof buildAgentStuckDriftQuestions>,
  AgentStuckDriftAction,
  AgentStuckDriftState
>({
  id: "agent-stuck-drift",
  name: "Agent Stuck Drift",
  category: "verify-gate",
  description:
    "Foreman-style supervisor: stuck + drift + tests + progress → continue / nudge / recover / stop_review.",
  module: "recipes/verify-gate/agent-stuck-drift.ts",
  runner: "runAgentStuckDrift",
  questions: [
    { name: "stuck", kind: "noul" },
    { name: "drifted", kind: "noul" },
    { name: "progress", kind: "score" },
    { name: "tests_pass", kind: "noul" },
    { name: "disposition", kind: "choice" },
  ],
  actions: ["continue", "nudge", "recover", "stop_review"],
  defaultMinConfidence: 0.55,
  defaultOnLowConfidence: "review",
  tags: ["foreman", "supervisor", "stuck", "drift", "agents", "verify-gate", "proof"],
  buildQuestions: (_state) => buildAgentStuckDriftQuestions(),
  decide: ({ answers }) => {
    // Stuck + failing tests → recover (reset / new tactic), not soft nudge.
    if (answers.stuck.noul >= 0.65 && answers.tests_pass.noul < 0.45) return "recover";
    if (answers.stuck.noul >= 0.65) {
      return answers.disposition.choice === "stop_review" ? "stop_review" : "recover";
    }
    // Off-goal: nudge if still progressing; recover if spinning off-path.
    if (answers.drifted.noul >= 0.65) {
      return answers.progress.score < 0.5 ? "recover" : "nudge";
    }
    // No traction and tests red → human / stop review.
    if (answers.tests_pass.noul < 0.4 && answers.progress.score < 0.5) return "stop_review";
    if (answers.disposition.choice === "stop_review") return "stop_review";
    if (answers.disposition.choice === "recover") return "recover";
    if (answers.disposition.choice === "nudge") return "nudge";
    if (answers.progress.score < 0.4) return "nudge";
    return "continue";
  },
});

function buildAgentStuckDriftQuestions() {
  return {
    stuck: noul("Is the agent stuck repeating failed tactics with no new information?", {
      true: "Same failing approach / loop; no material new evidence",
      false: "Still exploring usefully or advancing",
    }),
    drifted: noul("Has the agent drifted away from the stated goal?", {
      true: "Working on unrelated scope, rabbit holes, or wrong success criteria",
      false: "Actions still aim at the goal",
    }),
    progress: score("How much progress toward the goal since the last check?", [
      "None / spinning",
      "Partial progress",
      "Clear, material progress",
    ]),
    tests_pass: noul("Do the available tests / checks support claiming success?", {
      true: "Tests green or evidence supports the claim",
      false: "Tests failing, missing, or contradict the claim",
    }),
    disposition: choice("What intervention should the supervisor take?", {
      continue: "On track — let the agent keep working",
      nudge: "Steer back toward the goal with a short directive",
      recover: "Reset tactic / recover from stuck or bad path",
      stop_review: "Stop and escalate for human review",
    }),
  } as const;
}

export function agentStuckDriftQuestions() {
  return buildAgentStuckDriftQuestions();
}

export type AgentStuckDriftQuestions = ReturnType<typeof agentStuckDriftQuestions>;

export async function runAgentStuckDrift(
  harness: DecisionHarness,
  state: AgentStuckDriftState,
  opts?: {
    mode?: "live" | "shadow";
    id?: string;
    minConfidence?: number;
    onLowConfidence?: "review" | "escalate_llm" | "suppress" | "proceed";
  },
): Promise<DecisionResult<AgentStuckDriftQuestions, AgentStuckDriftAction>> {
  return agentStuckDriftRecipe.run(harness, state, opts);
}
