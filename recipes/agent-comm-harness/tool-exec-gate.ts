import { choice, noul, score } from "@typesafe-ai/sdk";
import { defineRecipe } from "../../src/define-recipe.js";
import type { DecisionHarness } from "../../src/harness.js";
import type { DecisionResult } from "../../src/types.js";

export type ToolExecGateAction = "exec" | "ask_user" | "escalate" | "deny";

export interface ToolExecGateState {
  tool_name: string;
  args_summary: string;
  policy_summary: string;
  allowlist_hit?: boolean;
}

/**
 * Tool allow/deny + confidence-gated handoff before irreversible exec.
 * Shape: verify-gate. Pack: agent-comm-harness (research/crazy-fast-decisions.md §1b).
 */
export const toolExecGateRecipe = defineRecipe<
  ReturnType<typeof buildToolExecGateQuestions>,
  ToolExecGateAction,
  ToolExecGateState
>({
  id: "tool-exec-gate",
  name: "Tool Exec Gate",
  category: "verify-gate",
  description:
    "Allow/deny tool execution with risk class, policy Noul, and blast-radius Score.",
  module: "recipes/agent-comm-harness/tool-exec-gate.ts",
  runner: "runToolExecGate",
  questions: [
    { name: "risk_class", kind: "choice" },
    { name: "policy_ok", kind: "noul" },
    { name: "irreversible", kind: "noul" },
    { name: "blast_radius", kind: "score" },
  ],
  actions: ["exec", "ask_user", "escalate", "deny"],
  defaultMinConfidence: 0.55,
  defaultOnLowConfidence: "suppress",
  tags: ["agent-comm", "agent-comm-harness", "tools", "allowlist", "gate"],
  buildQuestions: (_state) => buildToolExecGateQuestions(),
  decide: ({ answers }, state) => {
    if (answers.risk_class.choice === "forbidden" || answers.policy_ok.noul < 0.4) {
      return "deny";
    }
    if (answers.risk_class.choice === "irreversible" || answers.irreversible.noul >= 0.6) {
      return answers.blast_radius.score >= 1.5 ? "escalate" : "ask_user";
    }
    if (state.allowlist_hit === false) return "ask_user";
    return "exec";
  },
});

function buildToolExecGateQuestions() {
  return {
    risk_class: choice("What is the risk class of this tool call?", {
      read_only: "No side effects / read-only",
      reversible: "Side effects that are cheap to undo",
      irreversible: "Hard or costly to undo",
      forbidden: "Violates policy / must never run",
    }),
    policy_ok: noul("Do args match policy / allowlist intent?", {
      true: "Args match allowlist / policy",
      false: "Args diverge from policy",
    }),
    irreversible: noul("Is the side effect irreversible or expensive to undo?", {
      true: "Hard or costly to undo",
      false: "Cheaply reversible or read-only",
    }),
    blast_radius: score("Blast radius if this runs wrong?", [
      "Local / single file",
      "Project",
      "Prod systems",
      "External money / users",
    ]),
  } as const;
}

export function toolExecGateQuestions() {
  return buildToolExecGateQuestions();
}

export type ToolExecGateQuestions = ReturnType<typeof toolExecGateQuestions>;

export async function runToolExecGate(
  harness: DecisionHarness,
  state: ToolExecGateState,
  opts?: {
    mode?: "live" | "shadow";
    id?: string;
    minConfidence?: number;
    onLowConfidence?: "review" | "escalate_llm" | "suppress" | "proceed";
  },
): Promise<DecisionResult<ToolExecGateQuestions, ToolExecGateAction>> {
  return toolExecGateRecipe.run(harness, state, opts);
}
