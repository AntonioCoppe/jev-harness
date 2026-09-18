import { choice, noul, score } from "@typesafe-ai/sdk";
import { defineRecipe } from "../../src/define-recipe.js";
import type { DecisionHarness } from "../../src/harness.js";
import type { DecisionResult } from "../../src/types.js";

/** Route target: specialist id, `broadcast`, `drop`, or `escalate`. */
export type MessageRouteAction = string;

export type RouteOption = { id: string; description: string };

export type MessageRouteState = {
  message: string;
  specialists: RouteOption[];
  from_agent?: string;
  topic?: string;
  context?: string;
};

/**
 * Inter-agent message routing / escalate-or-not (agent bus).
 * Extends inbox-triage / model-router; category: confidence-front-door.
 *
 * Proof: route accuracy on labeled bus events; secret-leak FN = 0 on fixtures.
 */
export const messageRouteRecipe = defineRecipe<
  ReturnType<typeof buildMessageRouteQuestions>,
  MessageRouteAction,
  MessageRouteState
>({
  id: "message-route",
  name: "Message Route",
  category: "confidence-front-door",
  description:
    "Route an inter-agent message to a specialist, broadcast, drop, or escalate (secret-aware).",
  module: "recipes/agent-comm-harness/message-route.ts",
  runner: "runMessageRoute",
  questions: [
    { name: "route", kind: "choice" },
    { name: "urgency", kind: "score" },
    { name: "contains_secrets", kind: "noul" },
    { name: "escalate", kind: "noul" },
  ],
  actions: ["<specialist-id>", "broadcast", "drop", "escalate"],
  defaultMinConfidence: 0.55,
  defaultOnLowConfidence: "review",
  tags: ["agent-comm-harness", "routing", "multi-agent", "bus", "secrets"],
  buildQuestions: (state) => buildMessageRouteQuestions(state.specialists),
  decide: ({ answers }) => {
    if (answers.escalate.noul >= 0.6) return "escalate";
    if (answers.contains_secrets.noul >= 0.55 && answers.route.choice === "broadcast") {
      return "escalate";
    }
    if (answers.route.choice === "drop") return "drop";
    if (answers.contains_secrets.noul >= 0.55 && answers.route.choice !== "drop") {
      // Prefer a single specialist over broadcast when secrets present
      if (answers.route.choice === "broadcast") return "escalate";
    }
    return answers.route.choice;
  },
});

function buildMessageRouteQuestions(specialists: RouteOption[]) {
  if (specialists.length < 1) {
    throw new Error("message-route requires at least 1 specialist");
  }
  const options: Record<string, string> = {};
  for (const s of specialists) options[s.id] = s.description;
  options.broadcast = "Send to all specialists on the bus";
  options.drop = "Drop — irrelevant, duplicate, or unsafe to forward";

  return {
    route: choice("Where should this inter-agent message go?", options),
    urgency: score("How urgent is delivery?", [
      "Can wait / batch later",
      "Same session / normal priority",
      "Immediate — blocks progress or risk",
    ]),
    contains_secrets: noul("Does the payload contain secrets that must not be broadcast?", {
      true: "API keys, PII, credentials, or confidential customer data",
      false: "No secret material apparent",
    }),
    escalate: noul("Does this need a human or higher-tier owner instead of agents?", {
      true: "Policy, legal, or ambiguous high-stakes — escalate",
      false: "Safe for agent routing",
    }),
  } as const;
}

export function messageRouteQuestions(specialists: RouteOption[]) {
  return buildMessageRouteQuestions(specialists);
}

export type MessageRouteQuestions = ReturnType<typeof messageRouteQuestions>;

export async function runMessageRoute(
  harness: DecisionHarness,
  state: MessageRouteState,
  opts?: {
    mode?: "live" | "shadow";
    id?: string;
    minConfidence?: number;
    onLowConfidence?: "review" | "escalate_llm" | "suppress" | "proceed";
  },
): Promise<DecisionResult<MessageRouteQuestions, MessageRouteAction>> {
  return messageRouteRecipe.run(harness, state, opts);
}
