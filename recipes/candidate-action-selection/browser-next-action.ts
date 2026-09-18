import { DecisionHarness, choice, noul, type DecisionResult } from "../../src/index.js";

export type BrowserNextAction = string;

/**
 * Pick the next browser action from code-scraped candidates (wiki-race / computer-use style).
 * Pass candidate ids as Choice criteria keys.
 */
export async function runBrowserNextAction(
  harness: DecisionHarness,
  state: {
    goal: string;
    url: string;
    candidates: { id: string; description: string }[];
    history?: string[];
  },
  opts?: { mode?: "live" | "shadow"; id?: string },
): Promise<DecisionResult<ReturnType<typeof buildQuestions>, BrowserNextAction>> {
  if (state.candidates.length < 2) {
    throw new Error("browser-next-action requires at least 2 candidates");
  }

  const questions = buildQuestions(state.candidates);

  return harness.run({
    id: opts?.id,
    mode: opts?.mode,
    state: {
      goal: state.goal,
      url: state.url,
      history: state.history ?? [],
      candidates: state.candidates,
    },
    questions,
    policy: {
      minConfidence: 0.45,
      onLowConfidence: "review",
      decide: ({ answers }) => {
        if (answers.done.noul >= 0.7) return "STOP";
        return answers.next.choice;
      },
    },
  });
}

function buildQuestions(candidates: { id: string; description: string }[]) {
  const criteria: Record<string, string> = {};
  for (const c of candidates) {
    criteria[c.id] = c.description;
  }
  return {
    next: choice("Which candidate best advances the goal right now?", criteria),
    done: noul("Have we already achieved the goal and should stop?"),
  } as const;
}
