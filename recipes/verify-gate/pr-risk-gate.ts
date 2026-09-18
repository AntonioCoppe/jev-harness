import { choice, noul, score } from "@typesafe-ai/sdk";
import { defineRecipe } from "../../src/define-recipe.js";
import type { DecisionHarness } from "../../src/harness.js";
import type { DecisionResult } from "../../src/types.js";

export type PrRiskGateAction = "merge_ok" | "request_changes" | "block";

export type PrRiskGateState = {
  /** What the change claims to do (PR title/body or agent task). */
  description: string;
  /** Compact diff, hunk summary, or changed-file excerpts. */
  diff: string;
  /** Optional related test / CI output when judging coverage gaps. */
  test_summary?: string;
  /** Optional list of paths touched. */
  files_touched?: string[];
};

/**
 * PR/diff severity gate: risk + secrets + test gap → merge_ok / request_changes / block.
 * Shape: verify-gate (verdict over a change before merge, not a free-form review essay).
 *
 * Deepens taxonomy stub `pr-risk-gate` with jev-review-shaped signals
 * (correctness/security/test coverage → severity → conditional routing).
 *
 * Evidence: https://github.com/devagrawal09/jev-review (OSS staged workflow + dashboard).
 * Equation: bad merges / missed secrets / untested risk = incident $ + rollback latency.
 */
export const prRiskGateRecipe = defineRecipe<
  ReturnType<typeof buildPrRiskGateQuestions>,
  PrRiskGateAction,
  PrRiskGateState
>({
  id: "pr-risk-gate",
  name: "PR Risk Gate",
  category: "verify-gate",
  description:
    "PR/diff severity gate: risk + secrets + test gap → merge_ok / request_changes / block.",
  module: "recipes/verify-gate/pr-risk-gate.ts",
  runner: "runPrRiskGate",
  questions: [
    { name: "risk", kind: "score" },
    { name: "severity", kind: "choice" },
    { name: "secrets", kind: "noul" },
    { name: "security_issue", kind: "noul" },
    { name: "test_gap", kind: "noul" },
    { name: "correctness", kind: "score" },
    { name: "disposition", kind: "choice" },
  ],
  actions: ["merge_ok", "request_changes", "block"],
  defaultMinConfidence: 0.55,
  defaultOnLowConfidence: "review",
  tags: ["pr", "diff", "review", "severity", "secrets", "verify-gate", "proof"],
  buildQuestions: (_state) => buildPrRiskGateQuestions(),
  decide: ({ answers }) => {
    // Secrets or clear security defect → block merge.
    if (answers.secrets.noul >= 0.65) return "block";
    if (answers.security_issue.noul >= 0.7 && answers.severity.choice === "critical") return "block";
    if (answers.disposition.choice === "block") return "block";
    // Critical/high severity with elevated risk, or broken correctness → request changes.
    if (
      (answers.severity.choice === "critical" || answers.severity.choice === "high") &&
      answers.risk.score >= 1.4
    ) {
      return "request_changes";
    }
    if (answers.correctness.score < 0.7) return "request_changes";
    if (answers.test_gap.noul >= 0.65) return "request_changes";
    if (answers.security_issue.noul >= 0.55) return "request_changes";
    if (answers.disposition.choice === "request_changes") return "request_changes";
    if (answers.risk.score >= 1.6) return "request_changes";
    return "merge_ok";
  },
});

function buildPrRiskGateQuestions() {
  return {
    risk: score("How risky is merging this change as-is?", [
      "Low — small, well-scoped, easy rollback",
      "Medium — material change; needs care",
      "High — large blast radius or hard to reverse",
    ]),
    severity: choice("What severity should this review be treated as?", {
      low: "Cosmetic / docs / trivial",
      medium: "Normal feature or refactor risk",
      high: "Core path, auth, data, or infra impact",
      critical: "Likely incident if wrong — secrets, security hole, data loss",
    }),
    secrets: noul("Does the diff appear to introduce secrets, credentials, or private keys?", {
      true: "Likely secrets / tokens / keys in the change",
      false: "No clear secret material",
    }),
    security_issue: noul("Is there a security concern (auth bypass, injection, unsafe defaults) beyond secrets?", {
      true: "Clear security concern in the change",
      false: "No clear security defect signaled",
    }),
    test_gap: noul("Is test coverage inadequate for the risk of this change?", {
      true: "Missing or weak tests relative to the change",
      false: "Tests look adequate for the risk",
    }),
    correctness: score("How correct does the change look relative to the stated description?", [
      "Likely wrong or incomplete",
      "Plausible with gaps",
      "Looks correct and complete",
    ]),
    disposition: choice("What should the merge gate do?", {
      merge_ok: "Safe enough to merge",
      request_changes: "Needs fixes, tests, or clarification before merge",
      block: "Do not merge — secrets, critical security, or clear breakage",
    }),
  } as const;
}

export function prRiskGateQuestions() {
  return buildPrRiskGateQuestions();
}

export type PrRiskGateQuestions = ReturnType<typeof prRiskGateQuestions>;

export async function runPrRiskGate(
  harness: DecisionHarness,
  state: PrRiskGateState,
  opts?: {
    mode?: "live" | "shadow";
    id?: string;
    minConfidence?: number;
    onLowConfidence?: "review" | "escalate_llm" | "suppress" | "proceed";
  },
): Promise<DecisionResult<PrRiskGateQuestions, PrRiskGateAction>> {
  return prRiskGateRecipe.run(harness, state, opts);
}
