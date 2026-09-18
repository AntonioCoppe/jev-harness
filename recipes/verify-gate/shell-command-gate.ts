import { choice, noul, score } from "@typesafe-ai/sdk";
import { defineRecipe } from "../../src/define-recipe.js";
import type { DecisionHarness } from "../../src/harness.js";
import type { DecisionResult } from "../../src/types.js";

export type ShellCommandAction = "allow" | "deny" | "ask";

export type ShellCommandGateState = {
  /** Full shell command string proposed for execution (fx / agent auto-mode style). */
  command: string;
  /** Exact or prefix-safe commands that never need a model for allow (known-safe). */
  known_safe?: string[];
  /** Optional user / agent goal for intent alignment. */
  user_goal?: string;
  cwd?: string;
  policy?: string;
};

/**
 * fx-style CLI command safety: command string → allow / deny / ask.
 * Shape: verify-gate (not tool-name allowlist — judges the argv string + irreversibility).
 *
 * Proof equation: **irreversible shell = blast-radius $ + recovery latency**.
 * Default onLowConfidence: "suppress" — unsure never auto-runs.
 */
export const shellCommandGateRecipe = defineRecipe<
  ReturnType<typeof buildShellCommandGateQuestions>,
  ShellCommandAction,
  ShellCommandGateState
>({
  id: "shell-command-gate",
  name: "Shell Command Gate",
  category: "verify-gate",
  description:
    "CLI command string → allow / deny / ask with irreversible class + known-safe allowlist (fx-style).",
  module: "recipes/verify-gate/shell-command-gate.ts",
  runner: "runShellCommandGate",
  questions: [
    { name: "verdict", kind: "choice" },
    { name: "risk_class", kind: "choice" },
    { name: "irreversible", kind: "noul" },
    { name: "intent_ok", kind: "noul" },
    { name: "blast_radius", kind: "score" },
  ],
  actions: ["allow", "deny", "ask"],
  defaultMinConfidence: 0.6,
  defaultOnLowConfidence: "suppress",
  tags: ["shell", "fx", "cli", "allowlist", "safety", "verify-gate", "proof"],
  buildQuestions: (_state) => buildShellCommandGateQuestions(),
  entryState: (state) => ({
    ...state,
    on_known_safe: isKnownSafe(state.command, state.known_safe ?? []),
  }),
  decide: ({ answers }, state) => {
    const knownSafe = isKnownSafe(state.command, state.known_safe ?? []);
    if (answers.verdict.choice === "deny" || answers.risk_class.choice === "forbidden") {
      return "deny";
    }
    if (
      answers.irreversible.noul >= 0.55 ||
      answers.blast_radius.score >= 1.5 ||
      answers.risk_class.choice === "irreversible" ||
      answers.verdict.choice === "ask"
    ) {
      return "ask";
    }
    if (answers.intent_ok.noul < 0.45) return "ask";
    // Reversible side effects: allow only when known-safe or model says allow with solid intent.
    if (answers.risk_class.choice === "reversible" && !knownSafe && answers.verdict.choice !== "allow") {
      return "ask";
    }
    if (knownSafe || answers.verdict.choice === "allow") return "allow";
    return "ask";
  },
});

function isKnownSafe(command: string, knownSafe: string[]): boolean {
  const trimmed = command.trim();
  if (!trimmed) return false;
  return knownSafe.some((safe) => {
    const s = safe.trim();
    if (!s) return false;
    return trimmed === s || trimmed.startsWith(`${s} `);
  });
}

function buildShellCommandGateQuestions() {
  return {
    verdict: choice("Should we execute this shell command now?", {
      allow: "Safe enough to run without asking — read-only or clearly reversible",
      deny: "Disallowed, clearly destructive, or policy-breaking — do not run",
      ask: "Borderline or irreversible — ask a human before running",
    }),
    risk_class: choice("What risk class is this command?", {
      read_only: "No side effects — ls, cat, git status, curl GET",
      reversible: "Side effects that are cheap to undo",
      irreversible: "Hard or costly to undo (rm -rf, drop db, force push, send mail)",
      forbidden: "Disallowed by policy or clear misuse (pipe-to-shell, credential dump)",
    }),
    irreversible: noul("Would the side effect be expensive or impossible to undo?", {
      true: "Cannot cheaply undo (rm -rf, wire money, public post, drop table)",
      false: "Easy rollback or no durable side effect",
    }),
    intent_ok: noul("Does this command advance the user's stated goal?", {
      true: "Args and intent look aligned with the goal",
      false: "Looks unrelated, over-scoped, or hostile to the goal",
    }),
    blast_radius: score("If this goes wrong, how wide is the blast radius?", [
      "Local only — single file or session",
      "Project / team repo or shared host",
      "Prod systems or customer-facing",
      "External money / legal / safety",
    ]),
  } as const;
}

export function shellCommandGateQuestions() {
  return buildShellCommandGateQuestions();
}

export type ShellCommandGateQuestions = ReturnType<typeof shellCommandGateQuestions>;

export async function runShellCommandGate(
  harness: DecisionHarness,
  state: ShellCommandGateState,
  opts?: {
    mode?: "live" | "shadow";
    id?: string;
    minConfidence?: number;
    onLowConfidence?: "review" | "escalate_llm" | "suppress" | "proceed";
  },
): Promise<DecisionResult<ShellCommandGateQuestions, ShellCommandAction>> {
  return shellCommandGateRecipe.run(harness, state, opts);
}
