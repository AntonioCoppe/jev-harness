import { DecisionHarness, choice, noul, type DecisionResult } from "../../src/index.js";

export type CandidateAction = string;

export type CandidateOption = {
  /** Stable id used as the Choice key and returned as the action when selected. */
  id: string;
  /** Short human label / OCR / detector description — only text leaves the device. */
  description: string;
};

/**
 * Shape: Choice over a **dynamic** candidate set (+ optional stop Noul).
 *
 * Inspired by computer-use without LLM vision (milindlabs): classical perception
 * proposes candidates → Jev returns a distribution over text labels → act → loop.
 * Options are built at call time; this recipe does not hard-code a domain vertical.
 */
export function candidateActionSelectQuestions(candidates: CandidateOption[]) {
  if (candidates.length < 2) {
    throw new Error("candidate-action-select requires at least 2 candidates");
  }
  const criteria: Record<string, string> = {};
  for (const c of candidates) {
    criteria[c.id] = c.description;
  }
  return {
    next: choice("Which candidate best advances the goal right now?", criteria),
    done: noul("Have we already achieved the goal and should stop?"),
  } as const;
}

export async function runCandidateActionSelect(
  harness: DecisionHarness,
  state: {
    goal: string;
    candidates: CandidateOption[];
    /** Optional perception / UI context (URL, screen id, history of prior picks). */
    context?: Record<string, unknown>;
    history?: string[];
  },
  opts?: { mode?: "live" | "shadow"; id?: string; minConfidence?: number; stopThreshold?: number },
): Promise<DecisionResult<ReturnType<typeof candidateActionSelectQuestions>, CandidateAction>> {
  const questions = candidateActionSelectQuestions(state.candidates);
  const stopThreshold = opts?.stopThreshold ?? 0.7;

  return harness.run({
    id: opts?.id,
    mode: opts?.mode,
    state: {
      goal: state.goal,
      candidates: state.candidates,
      history: state.history ?? [],
      ...(state.context ?? {}),
    },
    questions,
    policy: {
      minConfidence: opts?.minConfidence ?? 0.45,
      onLowConfidence: "review",
      decide: ({ answers }) => {
        if (answers.done.noul >= stopThreshold) return "STOP";
        return answers.next.choice;
      },
    },
  });
}
