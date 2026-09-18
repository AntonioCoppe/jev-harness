import { DecisionHarness, choice, noul, type EntryType, type DecisionResult } from "../../src/index.js";

export type ToolAllowAction = "allow" | "deny" | "require_confirm";

/**
 * Gate a proposed tool call against policy / allowlist before execution.
 */
export function toolCallAllowlistQuestions() {
  return {
    verdict: choice("Should we execute this tool call?", {
      allow: "On allowlist, args look safe, matches user intent",
      deny: "Disallowed tool, dangerous args, or clear misuse",
      require_confirm: "Borderline — ask a human before running",
    }),
    args_safe: noul("Are the tool arguments within safe bounds for this policy?"),
    intent_aligned: noul("Does this call advance the user's stated goal?"),
  } as const;
}

export async function runToolCallAllowlist(
  harness: DecisionHarness,
  state: {
    tool_name: string;
    tool_args: Record<string, string | number | boolean | null>;
    allowlist: string[];
    user_goal: string;
    policy?: string;
  },
  opts?: { mode?: "live" | "shadow"; id?: string },
): Promise<DecisionResult<ReturnType<typeof toolCallAllowlistQuestions>, ToolAllowAction>> {
  const questions = toolCallAllowlistQuestions();
  const onAllowlist = state.allowlist.includes(state.tool_name);
  return harness.run({
    id: opts?.id,
    mode: opts?.mode,
    state: { ...state, on_allowlist: onAllowlist } as EntryType,
    questions,
    policy: {
      minConfidence: 0.6,
      onLowConfidence: "review",
      decide: ({ answers }) => {
        if (!onAllowlist || answers.verdict.choice === "deny") return "deny";
        if (answers.args_safe.noul < 0.5 || answers.intent_aligned.noul < 0.45) {
          return "require_confirm";
        }
        if (answers.verdict.choice === "require_confirm") return "require_confirm";
        return "allow";
      },
    },
  });
}
