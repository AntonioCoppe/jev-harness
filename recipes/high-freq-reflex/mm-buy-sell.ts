import { choice, score } from "@typesafe-ai/sdk";
import type { DecisionHarness } from "../../src/harness.js";
import type { DecisionResult } from "../../src/types.js";

export type MmBuySellAction = "buy" | "sell" | "hold";

export interface MmBuySellState {
  /** Compact book / mid / inventory snapshot for the hot loop. */
  book_snapshot: Record<string, string | number | boolean | null>;
  /** Optional latency budget hint (ms). */
  budget_ms?: number;
}

/**
 * Block-time buy/sell/hold reflex. Shape: high-freq-reflex
 * (throughput/budget claim; keep state tiny and minConfidence tight).
 */
export function mmBuySellQuestions() {
  return {
    side: choice("What should we do on this tick?", {
      buy: "Lift / bid — expected positive edge",
      sell: "Hit / offer — expected positive edge",
      hold: "No actionable edge; stay flat",
    }),
    edge: score("How strong is the expected edge if we act?", [
      "Noise / unclear",
      "Modest edge",
      "Strong, clear edge",
    ]),
  } as const;
}

export type MmBuySellQuestions = ReturnType<typeof mmBuySellQuestions>;

export async function runMmBuySell(
  harness: DecisionHarness,
  state: MmBuySellState,
  opts?: { mode?: "live" | "shadow"; id?: string; minConfidence?: number },
): Promise<DecisionResult<MmBuySellQuestions, MmBuySellAction>> {
  const questions = mmBuySellQuestions();
  return harness.run({
    id: opts?.id,
    mode: opts?.mode,
    state,
    questions,
    policy: {
      minConfidence: opts?.minConfidence ?? 0.45,
      onLowConfidence: "suppress",
      decide: ({ answers }) => {
        if (answers.side.choice === "hold" || answers.edge.score < 0.9) return "hold";
        return answers.side.choice as MmBuySellAction;
      },
    },
  });
}
