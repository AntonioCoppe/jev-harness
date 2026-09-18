import { DecisionHarness, choice, noul, score, type DecisionResult } from "../../src/index.js";

export type StopOrContinueAction = "continue" | "stop" | "ask_user";

/**
 * Decide whether an agent loop should keep going, stop, or ask the user.
 */
export function stopOrContinueQuestions() {
  return {
    disposition: choice("What should the agent do next?", {
      continue: "More useful work remains; keep looping",
      stop: "Goal achieved or blocked with nothing left to try",
      ask_user: "Need clarification or confirmation before continuing",
    }),
    progress: score("How much progress toward the goal since the last step?", [
      "None / spinning",
      "Partial progress",
      "Clear, material progress",
    ]),
    stuck: noul("Is the agent stuck repeating failed tactics?"),
  } as const;
}

export async function runStopOrContinue(
  harness: DecisionHarness,
  state: {
    goal: string;
    last_steps: string[];
    remaining_budget?: string;
    blockers?: string[];
  },
  opts?: { mode?: "live" | "shadow"; id?: string },
): Promise<DecisionResult<ReturnType<typeof stopOrContinueQuestions>, StopOrContinueAction>> {
  const questions = stopOrContinueQuestions();
  return harness.run({
    id: opts?.id,
    mode: opts?.mode,
    state,
    questions,
    policy: {
      minConfidence: 0.5,
      onLowConfidence: "review",
      decide: ({ answers }) => {
        if (answers.stuck.noul >= 0.65) return "ask_user";
        if (answers.disposition.choice === "stop" || answers.progress.score < 0.4) {
          return answers.disposition.choice === "continue" ? "ask_user" : (answers.disposition.choice as StopOrContinueAction);
        }
        return answers.disposition.choice as StopOrContinueAction;
      },
    },
  });
}
