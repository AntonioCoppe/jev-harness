import { DecisionHarness, choice, noul, type DecisionResult } from "../../src/index.js";

export type ToolPickAction = string;

/**
 * Pick which tool to invoke next from a declared catalog, or decline to call any.
 */
export function toolPickerQuestions(tools: Record<string, string>) {
  return {
    tool: choice("Which tool should we call next?", {
      ...tools,
      none: "No tool needed — answer or stop",
    }),
    necessary: noul("Is calling a tool necessary to make progress?"),
  } as const;
}

export async function runToolPicker(
  harness: DecisionHarness,
  state: {
    goal: string;
    tools: { id: string; description: string }[];
    context?: string;
    history?: string[];
  },
  opts?: { mode?: "live" | "shadow"; id?: string },
): Promise<DecisionResult<ReturnType<typeof toolPickerQuestions>, ToolPickAction>> {
  if (state.tools.length < 1) {
    throw new Error("tool-picker requires at least 1 tool");
  }
  const catalog: Record<string, string> = {};
  for (const t of state.tools) catalog[t.id] = t.description;

  const questions = toolPickerQuestions(catalog);
  return harness.run({
    id: opts?.id,
    mode: opts?.mode,
    state,
    questions,
    policy: {
      minConfidence: 0.5,
      onLowConfidence: "review",
      decide: ({ answers }) => {
        if (answers.necessary.noul < 0.4 || answers.tool.choice === "none") return "none";
        return answers.tool.choice;
      },
    },
  });
}
