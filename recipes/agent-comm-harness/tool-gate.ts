import { choice, noul, score } from "@typesafe-ai/sdk";
import { defineRecipe } from "../../src/define-recipe.js";
import type { DecisionHarness } from "../../src/harness.js";
import type { DecisionResult } from "../../src/types.js";

export type ToolGateAction =
  | "continue"
  | "ask_user"
  | "escalate_specialist"
  | "abort";

export type ToolGateState = {
  tool_name: string;
  tool_args: Record<string, string | number | boolean | null>;
  user_goal: string;
  allowlist?: string[];
  policy?: string;
  context?: string;
};

/**
 * Tool allow/deny + confidence-gated handoff before irreversible exec.
 * Extends verify-gate/tool-call-allowlist + ship-gate; category: verify-gate.
 *
 * Proof: deny/allow confusion matrix; 0 ships when conf < threshold (suppress).
 */
export const toolGateRecipe = defineRecipe<
  ReturnType<typeof buildToolGateQuestions>,
  ToolGateAction,
  ToolGateState
>({
  id: "tool-gate",
  name: "Tool Gate",
  category: "verify-gate",
  description:
    "Gate a proposed tool call by risk class, policy, blast radius, then handoff disposition.",
  module: "recipes/agent-comm-harness/tool-gate.ts",
  runner: "runToolGate",
  questions: [
    { name: "risk_class", kind: "choice" },
    { name: "policy_ok", kind: "noul" },
    { name: "irreversible", kind: "noul" },
    { name: "blast_radius", kind: "score" },
    { name: "handoff", kind: "choice" },
  ],
  actions: ["continue", "ask_user", "escalate_specialist", "abort"],
  defaultMinConfidence: 0.6,
  defaultOnLowConfidence: "suppress",
  tags: ["agent-comm-harness", "tools", "allowlist", "gate", "verify-gate"],
  buildQuestions: (_state) => buildToolGateQuestions(),
  entryState: (state) => ({
    ...state,
    on_allowlist: state.allowlist ? state.allowlist.includes(state.tool_name) : true,
  }),
  decide: ({ answers }, state) => {
    const onAllowlist = state.allowlist
      ? state.allowlist.includes(state.tool_name)
      : true;
    if (
      !onAllowlist ||
      answers.risk_class.choice === "forbidden" ||
      answers.policy_ok.noul < 0.35 ||
      answers.handoff.choice === "abort"
    ) {
      return "abort";
    }
    if (
      answers.irreversible.noul >= 0.55 ||
      answers.blast_radius.score >= 1.5 ||
      answers.risk_class.choice === "irreversible"
    ) {
      if (answers.handoff.choice === "escalate_specialist") return "escalate_specialist";
      return "ask_user";
    }
    if (answers.handoff.choice === "ask_user") return "ask_user";
    if (answers.handoff.choice === "escalate_specialist") return "escalate_specialist";
    if (answers.policy_ok.noul < 0.55 || answers.risk_class.choice === "reversible") {
      return answers.handoff.choice === "continue" ? "ask_user" : answers.handoff.choice;
    }
    return "continue";
  },
});

function buildToolGateQuestions() {
  return {
    risk_class: choice("What risk class is this tool call?", {
      read_only: "No side effects — read / search / inspect",
      reversible: "Side effects that are cheap to undo",
      irreversible: "Hard or costly to undo (delete, send, spend)",
      forbidden: "Disallowed by policy or clear misuse",
    }),
    policy_ok: noul("Do the args match policy / allowlist intent?", {
      true: "Args look policy-aligned and within bounds",
      false: "Args violate policy, allowlist, or stated intent",
    }),
    irreversible: noul("Would the side effect be expensive or impossible to undo?", {
      true: "Cannot cheaply undo (rm, wire money, public post)",
      false: "Easy rollback or no durable side effect",
    }),
    blast_radius: score("If this goes wrong, how wide is the blast radius?", [
      "Local only — single file or session",
      "Project / team scope",
      "Prod systems or customer-facing",
      "External money / legal / safety",
    ]),
    handoff: choice("How should the agent proceed with this tool call?", {
      continue: "Safe enough — execute now",
      ask_user: "Ask the human before running",
      escalate_specialist: "Hand to a specialist agent / reviewer",
      abort: "Do not run; stop this path",
    }),
  } as const;
}

export function toolGateQuestions() {
  return buildToolGateQuestions();
}

export type ToolGateQuestions = ReturnType<typeof toolGateQuestions>;

export async function runToolGate(
  harness: DecisionHarness,
  state: ToolGateState,
  opts?: {
    mode?: "live" | "shadow";
    id?: string;
    minConfidence?: number;
    onLowConfidence?: "review" | "escalate_llm" | "suppress" | "proceed";
  },
): Promise<DecisionResult<ToolGateQuestions, ToolGateAction>> {
  return toolGateRecipe.run(harness, state, opts);
}
