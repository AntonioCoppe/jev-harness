import { choice, noul, score } from "@typesafe-ai/sdk";
import type { DecisionHarness } from "../../src/harness.js";
import type { DecisionResult } from "../../src/types.js";

export type TicketFanoutAction =
  | "billing"
  | "bug"
  | "how_to"
  | "account"
  | "other"
  | "escalate";

export interface TicketFanoutState {
  subject?: string;
  body: string;
  customer_tier?: string;
  tags?: string[];
}

/**
 * Speculative ticket briefing: many independent judgments in one RTT.
 * Shape: live-multi-judgment (fan-out).
 */
export function ticketFanoutQuestions() {
  return {
    category: choice("Which support category fits this ticket?", {
      billing: "Payment, invoice, refund, or plan change",
      bug: "Product defect or unexpected error",
      how_to: "Usage question or documentation gap",
      account: "Login, access, or identity",
      other: "Does not fit the above",
    }),
    severity: score("How severe is the customer impact?", [
      "Cosmetic / inconvenience",
      "Degraded but workable",
      "Blocked or data/money at risk",
    ]),
    refund: noul("Is the customer asking for a refund or chargeback?"),
    has_repro: noul("Does the ticket include clear repro steps or evidence?"),
    frustration: score("How frustrated does the customer sound?", [
      "Calm",
      "Annoyed",
      "Angry / escalating",
    ]),
  } as const;
}

export type TicketFanoutQuestions = ReturnType<typeof ticketFanoutQuestions>;

export async function runTicketFanout(
  harness: DecisionHarness,
  state: TicketFanoutState,
  opts?: { mode?: "live" | "shadow"; id?: string; minConfidence?: number },
): Promise<DecisionResult<TicketFanoutQuestions, TicketFanoutAction>> {
  const questions = ticketFanoutQuestions();
  return harness.run({
    id: opts?.id,
    mode: opts?.mode,
    state,
    questions,
    policy: {
      minConfidence: opts?.minConfidence ?? 0.5,
      onLowConfidence: "review",
      decide: ({ answers }) => {
        if (answers.severity.score >= 1.6 && answers.frustration.score >= 1.4) {
          return "escalate";
        }
        return answers.category.choice as TicketFanoutAction;
      },
    },
  });
}
