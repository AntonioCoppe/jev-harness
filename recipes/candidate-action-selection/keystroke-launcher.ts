import { choice, noul, score } from "@typesafe-ai/sdk";
import { defineRecipe } from "../../src/define-recipe.js";
import type { DecisionHarness } from "../../src/harness.js";
import type { DecisionResult } from "../../src/types.js";

export type KeystrokeLauncherAction = string; // candidate id | "NONE" | "WAIT"

export type LauncherCandidate = {
  id: string;
  label: string;
  /** Optional habit / frequency hint already computed in code. */
  habit_score?: number;
};

export type KeystrokeLauncherState = {
  /** Current keystroke buffer / typed prefix. */
  typed_prefix: string;
  /** Dynamic launcher candidates (apps, commands, URLs). */
  candidates: LauncherCandidate[];
  /** Optional recent launch ids for habit features in state. */
  recent_launches?: string[];
};

/**
 * Predictive launcher / keystroke oracle: re-rank candidates each keystroke.
 * Shape: candidate-action-selection (+ live prefix in state).
 *
 * Proof equation: **per-keystroke LLM intent = RTT $ + UI lag** →
 * **bounded Choice over candidates = ms + cents**.
 * Default onLowConfidence: "review" → action WAIT (do not launch yet).
 */
export const keystrokeLauncherRecipe = defineRecipe<
  ReturnType<typeof buildKeystrokeLauncherQuestions>,
  KeystrokeLauncherAction,
  KeystrokeLauncherState
>({
  id: "keystroke-launcher",
  name: "Keystroke Launcher",
  category: "candidate-action-selection",
  description:
    "Per-keystroke intent Choice over launcher candidates; WAIT when unsure (dabit3-style oracle).",
  module: "recipes/candidate-action-selection/keystroke-launcher.ts",
  runner: "runKeystrokeLauncher",
  questions: [
    { name: "best", kind: "choice" },
    { name: "match_quality", kind: "score" },
    { name: "ready", kind: "noul" },
  ],
  actions: ["<candidate-id>", "NONE", "WAIT"],
  defaultMinConfidence: 0.5,
  defaultOnLowConfidence: "review",
  tags: ["launcher", "keystroke", "oracle", "candidates", "live", "proof"],
  buildQuestions: (state) => buildKeystrokeLauncherQuestions(state.candidates),
  entryState: (state) => ({
    typed_prefix: state.typed_prefix,
    candidates: state.candidates,
    recent_launches: state.recent_launches ?? [],
    prefix_len: state.typed_prefix.length,
  }),
  decide: ({ answers }, state) => {
    if (state.typed_prefix.trim().length < 1) return "WAIT";
    if (answers.best.choice === "NONE") {
      return answers.ready.noul >= 0.45 ? "NONE" : "WAIT";
    }
    if (answers.ready.noul < 0.45 || answers.match_quality.score < 0.7) return "WAIT";
    return answers.best.choice;
  },
});

function buildKeystrokeLauncherQuestions(candidates: LauncherCandidate[]) {
  if (candidates.length < 1) {
    throw new Error("keystroke-launcher requires at least 1 candidate");
  }
  const criteria: Record<string, string> = { NONE: "No candidate matches the typed intent" };
  for (const c of candidates) {
    const habit =
      typeof c.habit_score === "number" ? ` (habit ${c.habit_score.toFixed(2)})` : "";
    criteria[c.id] = `${c.label}${habit}`.slice(0, 240);
  }
  return {
    best: choice("Which launcher candidate best matches the typed prefix / intent?", criteria),
    match_quality: score("How strong is the match between prefix and the top candidate?", [
      "Weak / ambiguous",
      "Plausible",
      "Clear top hit",
    ]),
    ready: noul("Is the user ready to launch (prefix specific enough, not still typing)?", {
      true: "Prefix is specific; safe to launch top hit",
      false: "Still typing or ambiguous — wait for more keystrokes",
    }),
  } as const;
}

export function keystrokeLauncherQuestions(candidates: LauncherCandidate[]) {
  return buildKeystrokeLauncherQuestions(candidates);
}

export type KeystrokeLauncherQuestions = ReturnType<typeof keystrokeLauncherQuestions>;

export async function runKeystrokeLauncher(
  harness: DecisionHarness,
  state: KeystrokeLauncherState,
  opts?: {
    mode?: "live" | "shadow";
    id?: string;
    minConfidence?: number;
    onLowConfidence?: "review" | "escalate_llm" | "suppress" | "proceed";
  },
): Promise<DecisionResult<KeystrokeLauncherQuestions, KeystrokeLauncherAction>> {
  return keystrokeLauncherRecipe.run(harness, state, opts);
}
