import { choice, noul, score } from "@typesafe-ai/sdk";
import { defineRecipe } from "../../src/define-recipe.js";
import type { DecisionHarness } from "../../src/harness.js";
import type { DecisionResult } from "../../src/types.js";

export type SwarmConsensusAction =
  | "adopt"
  | "another_round"
  | "escalate_human"
  | "abort";

export type SwarmProposal = {
  id: string;
  summary: string;
};

export interface SwarmConsensusState {
  task: string;
  proposals: SwarmProposal[];
  transcript?: string;
  round?: number;
  max_rounds?: number;
}

/**
 * Debate judge / swarm consensus gate — extends stop-or-continue + rubric.
 * Shape: composite-rubric (judge, not generator). Also packed under agent-comm-harness.
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
  actions: ["adopt", "another_round", "escalate_human", "abort"],
  defaultMinConfidence: 0.55,
  defaultOnLowConfidence: "review",
  tags: ["swarm", "debate", "consensus", "multi-agent", "judge", "agent-comm-harness"],
  buildQuestions: (state) => buildSwarmConsensusQuestions(state.proposals),
  decide: ({ answers }, state) => {
    if (answers.fatal_objection.noul >= 0.65) {
      return answers.disposition.choice === "abort" ? "abort" : "escalate_human";
    }
    if (
      answers.consensus_reached.noul >= 0.6 &&
      answers.evidence_quality.score >= 1.0 &&
      answers.winner.choice !== "none"
    ) {
      return "adopt";
    }
    if (answers.disposition.choice === "abort") return "abort";
    if (answers.disposition.choice === "escalate_human") return "escalate_human";
    const maxRounds = state.max_rounds ?? 5;
    const round = state.round ?? 1;
    if (round >= maxRounds) return "escalate_human";
    return "another_round";
  },
  entryState: (state) => ({
    task: state.task,
    proposals: state.proposals,
    transcript: state.transcript,
    round: state.round,
    max_rounds: state.max_rounds,
  }),
});

function buildSwarmConsensusQuestions(proposals: SwarmProposal[]) {
  const winnerOptions: Record<string, string> = {
    none: "No proposal is ready to adopt",
  };
  for (const p of proposals) {
    winnerOptions[p.id] = p.summary;
  }
  return {
    consensus_reached: noul("Have the agents agreed enough to act?", {
      true: "Claims agree enough to adopt a winner",
      false: "Still material disagreement",
    }),
    winner: choice("Which proposal should win if we adopt?", winnerOptions),
    evidence_quality: score("How strong is the evidence behind the leading proposal?", [
      "Weak",
      "Mixed",
      "Strong",
    ]),
    fatal_objection: noul("Is there an unresolved fatal objection?", {
      true: "Blocker remains — do not adopt",
      false: "No fatal unresolved objection",
    }),
    disposition: choice("What should the swarm do next?", {
      adopt: "Adopt the winner and terminate debate",
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
