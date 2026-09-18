import { choice, noul, score } from "@typesafe-ai/sdk";
import { defineRecipe } from "../../src/define-recipe.js";
import type { DecisionHarness } from "../../src/harness.js";
import type { DecisionResult } from "../../src/types.js";

export type SwarmConsensusAction =
  | "adopt"
  | "another_round"
  | "escalate_human"
  | "abort"
  | string;

export type SwarmProposal = {
  id: string;
  summary: string;
};

export interface SwarmConsensusState {
  /** Task / debate topic. */
  task: string;
  /** Competing proposals from agents (ids used as Choice keys + `none`). */
  proposals: SwarmProposal[];
  /** Optional transcript excerpt or claim bullets. */
  transcript?: string;
  round?: number;
  max_rounds?: number;
}

/**
 * Debate judge / swarm consensus gate — stop-or-continue + rubric patterns.
 * Shape: composite-rubric / live multi-judgment (judge, not generator).
 *
 * Proof equation: **debate tokens until consensus = $ + time-to-consensus**.
 */
export const swarmConsensusRecipe = defineRecipe<
  ReturnType<typeof buildSwarmConsensusQuestions>,
  SwarmConsensusAction,
  SwarmConsensusState
>({
  id: "swarm-consensus",
  name: "Swarm Consensus",
  category: "composite-rubric",
  description:
    "Judge multi-agent debate: consensus?, winner, evidence quality, fatal objection → disposition.",
  module: "recipes/composite-rubric/swarm-consensus.ts",
  runner: "runSwarmConsensus",
  questions: [
    { name: "consensus_reached", kind: "noul" },
    { name: "winner", kind: "choice" },
    { name: "evidence_quality", kind: "score" },
    { name: "fatal_objection", kind: "noul" },
    { name: "disposition", kind: "choice" },
  ],
  actions: ["adopt", "another_round", "escalate_human", "abort", "<proposal-id>"],
  defaultMinConfidence: 0.5,
  defaultOnLowConfidence: "review",
  tags: ["swarm-consensus", "agent-comm", "debate", "terminate"],
  buildQuestions: (state) => buildSwarmConsensusQuestions(state.proposals),
  decide: ({ answers }, state) => {
    const maxRounds = state.max_rounds ?? 5;
    const round = state.round ?? 1;
    if (answers.fatal_objection.noul >= 0.6) return "abort";
    if (answers.disposition.choice === "abort") return "abort";
    if (answers.disposition.choice === "escalate_human") return "escalate_human";
    if (
      answers.consensus_reached.noul >= 0.55 &&
      answers.winner.choice !== "none" &&
      answers.evidence_quality.score >= 0.9
    ) {
      return answers.disposition.choice === "adopt" || answers.disposition.choice === "another_round"
        ? "adopt"
        : (answers.disposition.choice as SwarmConsensusAction);
    }
    if (round >= maxRounds) return "escalate_human";
    return "another_round";
  },
});

function buildSwarmConsensusQuestions(proposals: SwarmProposal[]) {
  const winnerOpts: Record<string, string> = {
    none: "No proposal is ready to adopt",
  };
  for (const p of proposals) {
    winnerOpts[p.id] = p.summary;
  }
  return {
    consensus_reached: noul("Do the claims agree enough to act?", {
      true: "Agreement is sufficient to ship a decision",
      false: "Material disagreement remains",
    }),
    winner: choice("Which proposal wins, if any?", winnerOpts),
    evidence_quality: score("How strong is the supporting evidence?", [
      "Weak",
      "Mixed",
      "Strong",
    ]),
    fatal_objection: noul("Is there an unresolved fatal objection?", {
      true: "A blocker remains unresolved",
      false: "No fatal objection outstanding",
    }),
    disposition: choice("What should the swarm do next?", {
      adopt: "Adopt the winning proposal and stop",
      another_round: "Run another debate round",
      escalate_human: "Escalate to a human judge",
      abort: "Abort the task",
    }),
  } as const;
}

export function swarmConsensusQuestions(proposals: SwarmProposal[]) {
  return buildSwarmConsensusQuestions(proposals);
}

export type SwarmConsensusQuestions = ReturnType<typeof swarmConsensusQuestions>;

export async function runSwarmConsensus(
  harness: DecisionHarness,
  state: SwarmConsensusState,
  opts?: {
    mode?: "live" | "shadow";
    id?: string;
    minConfidence?: number;
    onLowConfidence?: "review" | "escalate_llm" | "suppress" | "proceed";
  },
): Promise<DecisionResult<SwarmConsensusQuestions, SwarmConsensusAction>> {
  return swarmConsensusRecipe.run(harness, state, opts);
}
