import { DecisionHarness, choice, noul, score, type DecisionResult } from "../../src/index.js";

export type OncallPageAction = "page_now" | "notify_slack" | "defer" | "ignore";

/**
 * Decide whether an event should page on-call, soft-notify, defer, or be ignored.
 */
export function oncallPageQuestions() {
  return {
    action: choice("How should we notify on-call?", {
      page_now: "Page immediately — actionable and urgent",
      notify_slack: "Post to the team channel; no page",
      defer: "Wait for more signal or business hours",
      ignore: "Noise / duplicate / already handled",
    }),
    urgency: score("How urgent is human intervention?", [
      "Can wait until morning",
      "Same shift",
      "Wake someone now",
    ]),
    actionable: noul("Is there a clear owner action they can take right now?"),
  } as const;
}

export async function runOncallPage(
  harness: DecisionHarness,
  state: {
    alert_name: string;
    summary: string;
    runbook_url?: string;
    recent_pages?: string[];
    quiet_hours?: boolean;
  },
  opts?: { mode?: "live" | "shadow"; id?: string },
): Promise<DecisionResult<ReturnType<typeof oncallPageQuestions>, OncallPageAction>> {
  const questions = oncallPageQuestions();
  return harness.run({
    id: opts?.id,
    mode: opts?.mode,
    state,
    questions,
    policy: {
      minConfidence: 0.55,
      onLowConfidence: "review",
      decide: ({ answers }) => {
        if (answers.action.choice === "ignore" || answers.actionable.noul < 0.35) return "ignore";
        if (answers.urgency.score >= 1.5 && answers.actionable.noul >= 0.55) return "page_now";
        if (answers.action.choice === "page_now" && state.quiet_hours && answers.urgency.score < 1.5) {
          return "notify_slack";
        }
        return answers.action.choice as OncallPageAction;
      },
    },
  });
}
