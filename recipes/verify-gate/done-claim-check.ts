import { choice, noul } from "@typesafe-ai/sdk";
import { defineRecipe } from "../../src/define-recipe.js";
import type { DecisionHarness } from "../../src/harness.js";
import type { DecisionResult } from "../../src/types.js";

export type DoneClaimCheckAction = "allow_stop" | "block_stop";

export type DoneClaimCheckState = {
  /** The user's task / prompt for this turn. */
  task: string;
  /** The agent's closing message (the "done" claim, if any). */
  final_message: string;
  /** Files changed during the turn (code-owned count). */
  file_changes: number;
  /** True if a test/build/lint check passed after the last change (code-owned). */
  check_passed_after_change: boolean;
};

/**
 * Stop-hook gate: does the agent claim "done" without a passing check after its edits?
 * Shape: verify-gate (verdict on an agent's final message before the turn ends).
 *
 * Evidence: https://github.com/valentynkit/jev-belay (Claude Code Stop hook, one
 * four-question Jev call) and https://github.com/qkal/Canny (flags "done" claims
 * without a passing check). Equation: false "done" = review time + shipped breakage.
 *
 * Distinct from `agent-stuck-drift` (mid-run supervisor) — this runs once at stop.
 */
export const doneClaimCheckRecipe = defineRecipe<
  ReturnType<typeof buildDoneClaimCheckQuestions>,
  DoneClaimCheckAction,
  DoneClaimCheckState
>({
  id: "done-claim-check",
  name: "Done Claim Check",
  category: "verify-gate",
  description:
    "Stop-hook gate: block an agent's 'done' claim when files changed but no check passed (jev-belay shape).",
  module: "recipes/verify-gate/done-claim-check.ts",
  runner: "runDoneClaimCheck",
  questions: [
    { name: "claims_done", kind: "noul" },
    { name: "claims_verified", kind: "noul" },
    { name: "verification_applies", kind: "noul" },
    { name: "outcome", kind: "choice" },
  ],
  actions: ["allow_stop", "block_stop"],
  defaultMinConfidence: 0.5,
  defaultOnLowConfidence: "proceed",
  tags: ["agents", "stop-hook", "done-claim", "evidence", "verify-gate", "jev-belay"],
  buildQuestions: () => buildDoneClaimCheckQuestions(),
  decide: ({ answers }, state) => {
    // Code-owned evidence first: nothing changed, or a check already passed.
    if (state.file_changes === 0 || state.check_passed_after_change) return "allow_stop";
    // Agent honestly reports it is blocked — don't force it to keep going.
    if (answers.outcome.choice === "blocked") return "allow_stop";
    if (answers.claims_done.noul >= 0.7 && answers.verification_applies.noul >= 0.5) {
      return "block_stop";
    }
    return "allow_stop";
  },
});

function buildDoneClaimCheckQuestions() {
  return {
    claims_done: noul("Does the final message present the work as finished or working?", {
      true: "Claims the task is done / working",
      false: "Does not claim completion",
    }),
    claims_verified: noul("Does it claim tests, a build, or checks ran and passed?", {
      true: "Claims checks ran and passed",
      false: "No claim of passing checks",
    }),
    verification_applies: noul(
      "Would running tests, a build, or lint be a meaningful check of this task?",
      {
        true: "A test/build/lint run would meaningfully verify this work",
        false: "Checks don't apply (docs-only, question, research)",
      },
    ),
    outcome: choice("What outcome does the final message report?", {
      complete: "Task complete",
      partial: "Partially done",
      blocked: "Blocked — needs input or cannot proceed",
      other: "Something else (answer, question, plan)",
    }),
  } as const;
}

export function doneClaimCheckQuestions() {
  return buildDoneClaimCheckQuestions();
}

export type DoneClaimCheckQuestions = ReturnType<typeof doneClaimCheckQuestions>;

export async function runDoneClaimCheck(
  harness: DecisionHarness,
  state: DoneClaimCheckState,
  opts?: {
    mode?: "live" | "shadow";
    id?: string;
    minConfidence?: number;
    onLowConfidence?: "review" | "escalate_llm" | "suppress" | "proceed";
  },
): Promise<DecisionResult<DoneClaimCheckQuestions, DoneClaimCheckAction>> {
  return doneClaimCheckRecipe.run(harness, state, opts);
}
