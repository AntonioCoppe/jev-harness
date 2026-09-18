import { DecisionHarness, choice, noul, score, type DecisionResult } from "../../src/index.js";

export type InboxAction = "bookings" | "orders" | "support" | "spam" | "other";

export function inboxTriageQuestions() {
  return {
    bucket: choice("Which inbox bucket should own this message?", {
      bookings: "Stay / reservation / check-in",
      orders: "Product or farm order",
      support: "Problem with an existing stay or order",
      spam: "Scraper, promo, or irrelevant",
      other: "None of the above",
    }),
    urgency: score("How time-sensitive is a reply?", [
      "Can wait a day",
      "Same business day",
      "Needs a reply within a few hours",
    ]),
    is_customer: noul("Is this from a real prospective or current customer?"),
  } as const;
}

export async function runInboxTriage(
  harness: DecisionHarness,
  message: { from?: string; subject?: string; body: string; language?: string },
  opts?: { mode?: "live" | "shadow"; id?: string },
): Promise<DecisionResult<ReturnType<typeof inboxTriageQuestions>, InboxAction>> {
  const questions = inboxTriageQuestions();
  return harness.run({
    id: opts?.id,
    mode: opts?.mode,
    state: message,
    questions,
    policy: {
      minConfidence: 0.55,
      onLowConfidence: "review",
      decide: ({ answers }) => {
        if (answers.bucket.choice === "spam" || answers.is_customer.noul < 0.35) {
          return "spam";
        }
        return answers.bucket.choice as InboxAction;
      },
    },
  });
}
