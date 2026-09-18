import { choice, noul, score } from "@typesafe-ai/sdk";
import type { DecisionHarness } from "../../src/harness.js";
import type { DecisionResult } from "../../src/types.js";

export type TypewriterPanelAction = "update_ui";

export interface TypewriterPanelState {
  /** Current draft text (debounced keystrokes / stream buffer). */
  draft_text: string;
  /** Optional locale or editor mode hint. */
  locale?: string;
}

/**
 * Live multi-score editor panel: fan out tone/clarity/urgency/AI-written/intent
 * on the same draft. Shape: live-multi-judgment.
 */
export function typewriterPanelQuestions() {
  return {
    tone: score("What is the emotional tone of this draft?", [
      "Cold / formal",
      "Neutral",
      "Warm / emphatic",
    ]),
    clarity: score("How clear and readable is the draft?", [
      "Confusing",
      "Mostly clear",
      "Crystal clear",
    ]),
    urgent: noul("Does this draft convey time pressure or urgency?"),
    ai_written: noul("Does this read like AI-generated prose?"),
    intent: choice("What is the primary communicative intent?", {
      inform: "Share facts or status",
      request: "Ask for action or information",
      persuade: "Convince or sell",
      vent: "Express frustration without a clear ask",
      other: "None of the above / mixed",
    }),
  } as const;
}

export type TypewriterPanelQuestions = ReturnType<typeof typewriterPanelQuestions>;

export async function runTypewriterPanel(
  harness: DecisionHarness,
  state: TypewriterPanelState,
  opts?: { mode?: "live" | "shadow"; id?: string; minConfidence?: number },
): Promise<DecisionResult<TypewriterPanelQuestions, TypewriterPanelAction>> {
  const questions = typewriterPanelQuestions();
  return harness.run({
    id: opts?.id,
    mode: opts?.mode,
    state,
    questions,
    policy: {
      minConfidence: opts?.minConfidence ?? 0.4,
      onLowConfidence: "proceed",
      decide: () => "update_ui",
    },
  });
}
