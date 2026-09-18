import { DecisionHarness, choice, noul, score, type DecisionResult } from "../../src/index.js";

export type InjectionAction = "pass" | "sanitize" | "block";

/**
 * Detect prompt injection / jailbreak attempts in untrusted input before it reaches the model.
 */
export function injectionCheckQuestions() {
  return {
    disposition: choice("How should we treat this untrusted input?", {
      pass: "Benign — safe to include as-is",
      sanitize: "Suspicious fragments — strip or quote before use",
      block: "Clear injection / override attempt — reject",
    }),
    severity: score("How aggressive is the injection attempt?", [
      "None / accidental phrasing",
      "Mild role-play or boundary probing",
      "Explicit instruction override or exfiltration",
    ]),
    is_injection: noul("Does this try to override system/developer instructions?"),
  } as const;
}

export async function runInjectionCheck(
  harness: DecisionHarness,
  state: {
    untrusted_text: string;
    channel?: string;
    system_policy?: string;
  },
  opts?: { mode?: "live" | "shadow"; id?: string },
): Promise<DecisionResult<ReturnType<typeof injectionCheckQuestions>, InjectionAction>> {
  const questions = injectionCheckQuestions();
  return harness.run({
    id: opts?.id,
    mode: opts?.mode,
    state,
    questions,
    policy: {
      minConfidence: 0.55,
      onLowConfidence: "review",
      decide: ({ answers }) => {
        if (answers.is_injection.noul >= 0.6 || answers.disposition.choice === "block") return "block";
        if (answers.severity.score >= 1.0 || answers.disposition.choice === "sanitize") return "sanitize";
        return "pass";
      },
    },
  });
}
