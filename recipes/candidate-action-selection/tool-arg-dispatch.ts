import { choice, noul } from "@typesafe-ai/sdk";
import { defineRecipe } from "../../src/define-recipe.js";
import type { DecisionHarness } from "../../src/harness.js";
import type { DecisionResult } from "../../src/types.js";

export type ToolArgDispatchAction = string; // tool id | "ask_clarify" | "reject"

export type ToolArgSpec = {
  /** Closed set of allowed values → description. */
  options: Record<string, string>;
};

export type ToolSpec = {
  id: string;
  description: string;
  /** Closed-set arguments for this tool. */
  args?: Record<string, ToolArgSpec>;
};

export type ToolArgDispatchState = {
  /** Natural-language command from the user. */
  utterance: string;
  tools: ToolSpec[];
};

type Answers = Record<string, { choice?: string; noul?: number }>;

/** Question key for an argument's value, and for "was this argument actually stated?". */
export const argKey = (toolId: string, arg: string) => `${toolId}__${arg}`;
export const statedKey = (toolId: string, arg: string) => `${toolId}__${arg}__stated`;

/**
 * Closed-set function call: pick the tool AND its argument values in one call, or ask to clarify.
 * Shape: candidate-action-selection. Extends `tool-picker` (tool only) with typed arguments.
 *
 * Evidence: TypeSafe function_calling cookbook ("Typed function and tool dispatch" use case);
 * taxonomy stub `tool-arg-dispatch`. Equation: wrong args = failed / harmful tool runs + retries.
 */
export const toolArgDispatchRecipe = defineRecipe<
  ReturnType<typeof buildToolArgDispatchQuestions>,
  ToolArgDispatchAction,
  ToolArgDispatchState
>({
  id: "tool-arg-dispatch",
  name: "Tool Arg Dispatch",
  category: "candidate-action-selection",
  description:
    "Map a command to a tool plus closed-set argument values; ask to clarify when an argument wasn't stated.",
  module: "recipes/candidate-action-selection/tool-arg-dispatch.ts",
  runner: "runToolArgDispatch",
  questions: [
    { name: "tool", kind: "choice" },
    { name: "<tool>__<arg>", kind: "choice" },
    { name: "<tool>__<arg>__stated", kind: "noul" },
  ],
  actions: ["<tool-id>", "ask_clarify", "reject"],
  defaultMinConfidence: 0.55,
  defaultOnLowConfidence: "review",
  tags: ["tools", "function-calling", "arguments", "dispatch", "candidates"],
  buildQuestions: (state) => buildToolArgDispatchQuestions(state.tools),
  decide: ({ answers }, state) => decideToolArgDispatch(answers as unknown as Answers, state.tools),
});

export function decideToolArgDispatch(answers: Answers, tools: ToolSpec[]): ToolArgDispatchAction {
  const toolId = answers.tool?.choice ?? "none";
  const tool = tools.find((t) => t.id === toolId);
  if (!tool) return "reject";
  for (const arg of Object.keys(tool.args ?? {})) {
    // An argument the user never stated is a guess — ask instead of calling.
    if ((answers[statedKey(tool.id, arg)]?.noul ?? 0) < 0.5) return "ask_clarify";
  }
  return tool.id;
}

/** Read the chosen argument values for a tool from the answers. */
export function toolArgs(tool: ToolSpec, answers: Answers): Record<string, string> {
  const out: Record<string, string> = {};
  for (const arg of Object.keys(tool.args ?? {})) {
    const value = answers[argKey(tool.id, arg)]?.choice;
    if (value !== undefined) out[arg] = value;
  }
  return out;
}

function buildToolArgDispatchQuestions(tools: ToolSpec[]) {
  if (tools.length < 1) throw new Error("tool-arg-dispatch requires at least 1 tool");
  const toolCriteria: Record<string, string> = {
    none: "No listed tool fits this command",
  };
  const questions: Record<string, ReturnType<typeof choice> | ReturnType<typeof noul>> = {};
  for (const t of tools) {
    toolCriteria[t.id] = t.description.slice(0, 240);
    for (const [arg, spec] of Object.entries(t.args ?? {})) {
      questions[argKey(t.id, arg)] = choice(
        `If calling ${t.id}, which value should argument "${arg}" take?`,
        spec.options,
      );
      questions[statedKey(t.id, arg)] = noul(
        `Does the command state or clearly imply the "${arg}" argument for ${t.id}?`,
        { true: "Stated or clearly implied", false: "Not stated — would be a guess" },
      );
    }
  }
  return { tool: choice("Which tool should handle this command?", toolCriteria), ...questions };
}

export function toolArgDispatchQuestions(tools: ToolSpec[]) {
  return buildToolArgDispatchQuestions(tools);
}

export type ToolArgDispatchQuestions = ReturnType<typeof toolArgDispatchQuestions>;

export async function runToolArgDispatch(
  harness: DecisionHarness,
  state: ToolArgDispatchState,
  opts?: {
    mode?: "live" | "shadow";
    id?: string;
    minConfidence?: number;
    onLowConfidence?: "review" | "escalate_llm" | "suppress" | "proceed";
  },
): Promise<DecisionResult<ToolArgDispatchQuestions, ToolArgDispatchAction>> {
  return toolArgDispatchRecipe.run(harness, state, opts);
}
