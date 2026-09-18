import { choice, noul, score } from "@typesafe-ai/sdk";
import { defineRecipe } from "../../src/define-recipe.js";
import type { DecisionHarness } from "../../src/harness.js";
import type { DecisionResult } from "../../src/types.js";

export type SportsBetAction = "bet" | "no_bet" | "shop_elsewhere";

export interface SportsBetOffering {
  id: string;
  book: string;
  description: string;
}

export interface SportsBetGateState {
  /** Compact card: event, market, offered price, model fair, size. */
  ticket: Record<string, string | number | boolean | null>;
  /** Optional shortlist of books/lines for Choice. */
  offerings?: SportsBetOffering[];
  /** Expected CLV / closing-line proxy features. */
  clv?: Record<string, string | number | boolean | null>;
  budget_ms?: number;
}

/**
 * Sports betting bet/no-bet gate with CLV filter.
 * Shape: high-freq-reflex (+ optional book Choice over offerings).
 *
 * Proof: % bets with +CLV; suppress-on-low-conf; decision p50.
 */
export const sportsBetGateRecipe = defineRecipe<
  ReturnType<typeof buildSportsBetGateQuestions>,
  SportsBetAction,
  SportsBetGateState
>({
  id: "sports-bet-gate",
  name: "Sports Bet Gate",
  category: "high-freq-reflex",
  description: "Bet / no-bet / shop-elsewhere gate with edge score and CLV filter.",
  module: "recipes/sports-bet-gate/sports-bet-gate.ts",
  runner: "runSportsBetGate",
  questions: [
    { name: "bet", kind: "noul" },
    { name: "book", kind: "choice" },
    { name: "edge", kind: "score" },
    { name: "meets_clv_filter", kind: "noul" },
    { name: "liquidity_ok", kind: "score" },
  ],
  actions: ["bet", "no_bet", "shop_elsewhere"],
  defaultMinConfidence: 0.55,
  defaultOnLowConfidence: "suppress",
  tags: ["latency", "sports", "betting", "clv", "reflex"],
  buildQuestions: (state) => buildSportsBetGateQuestions(state),
  decide: ({ answers }) => {
    if (answers.meets_clv_filter.noul < 0.5) return "no_bet";
    if (answers.edge.score < 0.7) return "no_bet";
    if (answers.liquidity_ok.score < 0.6) return "shop_elsewhere";
    if (answers.bet.noul >= 0.55 && answers.edge.score >= 0.9 && answers.meets_clv_filter.noul >= 0.55) {
      return "bet";
    }
    if (answers.bet.noul >= 0.45 && answers.book.choice !== "none" && answers.edge.score >= 0.7) {
      return "shop_elsewhere";
    }
    return "no_bet";
  },
});

function buildSportsBetGateQuestions(state: SportsBetGateState) {
  const offerings = state.offerings?.length
    ? state.offerings
    : [
        { id: "primary", book: "primary", description: "Primary offered line on the ticket" },
      ];
  const bookOptions: Record<string, string> = { none: "No book worth taking" };
  for (const o of offerings) {
    bookOptions[o.id] = `${o.book}: ${o.description}`;
  }

  return {
    bet: noul("Should we take this price vs our fair value?", {
      true: "+EV at this price; take it",
      false: "Pass — price not worth the juice / risk",
    }),
    book: choice("Which offered line should we prefer (or none)?", bookOptions),
    edge: score("How strong is the edge on the best available ticket?", [
      "None / −EV",
      "Thin",
      "Solid",
      "Fat",
    ]),
    meets_clv_filter: noul("Is expected closing-line value positive for this ticket?", {
      true: "Expected +CLV vs projected close / sharp",
      false: "Expected −CLV or flat — filter out",
    }),
    liquidity_ok: score("Can we get the intended size without moving the market?", [
      "No — too thin",
      "Marginal size only",
      "Full size OK",
    ]),
  } as const;
}

export function sportsBetGateQuestions(state: SportsBetGateState = { ticket: {} }) {
  return buildSportsBetGateQuestions(state);
}

export type SportsBetGateQuestions = ReturnType<typeof sportsBetGateQuestions>;

export async function runSportsBetGate(
  harness: DecisionHarness,
  state: SportsBetGateState,
  opts?: {
    mode?: "live" | "shadow";
    id?: string;
    minConfidence?: number;
    onLowConfidence?: "review" | "escalate_llm" | "suppress" | "proceed";
  },
): Promise<DecisionResult<SportsBetGateQuestions, SportsBetAction>> {
  return sportsBetGateRecipe.run(harness, state, opts);
}
