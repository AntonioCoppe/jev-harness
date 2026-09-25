import { noul } from "@typesafe-ai/sdk";
import { defineRecipe } from "../../src/define-recipe.js";
import type { DecisionHarness } from "../../src/harness.js";
import type { DecisionResult } from "../../src/types.js";

export type EntityPairMergeAction = "merge" | "leave" | "curate";

export type EntityPairMergeState = {
  /** Left record (serialized fields). */
  left_record: string;
  /** Right record (serialized fields). */
  right_record: string;
  /** Optional description of the entity type ("company", "person", "product"). */
  entity_type?: string;
};

type Answers = {
  same_entity: { noul: number };
  conflicting_fields: { noul: number };
};

/**
 * Entity alignment for a candidate pair: same entity? conflicting facts? → merge / leave / curate.
 * Shape: composite-rubric (independent judgments combined by code; map over candidate pairs).
 *
 * Deepens taxonomy stub `entity-pair-merge` (TypeSafe entity_alignment cookbook,
 * "Knowledge-graph entity alignment" use case).
 * Equation: bad merges corrupt the graph; missed merges = duplicate records + manual curation hours.
 */
export const entityPairMergeRecipe = defineRecipe<
  ReturnType<typeof buildEntityPairMergeQuestions>,
  EntityPairMergeAction,
  EntityPairMergeState
>({
  id: "entity-pair-merge",
  name: "Entity Pair Merge",
  category: "composite-rubric",
  description:
    "Entity alignment for a candidate pair: same entity + conflicting fields → merge / leave / curate.",
  module: "recipes/composite-rubric/entity-pair-merge.ts",
  runner: "runEntityPairMerge",
  questions: [
    { name: "same_entity", kind: "noul" },
    { name: "conflicting_fields", kind: "noul" },
  ],
  actions: ["merge", "leave", "curate"],
  defaultMinConfidence: 0.6,
  defaultOnLowConfidence: "review",
  tags: ["entity-resolution", "dedupe", "knowledge-graph", "records", "rubric"],
  buildQuestions: () => buildEntityPairMergeQuestions(),
  entryState: (state) => ({ ...state, entity_type: state.entity_type ?? "" }),
  decide: ({ answers }) => decideEntityPairMerge(answers),
});

export function decideEntityPairMerge(answers: Answers): EntityPairMergeAction {
  if (answers.same_entity.noul < 0.3) return "leave";
  if (answers.same_entity.noul >= 0.8 && answers.conflicting_fields.noul < 0.5) return "merge";
  return "curate";
}

function buildEntityPairMergeQuestions() {
  return {
    same_entity: noul("Do both records refer to the same real-world entity?", {
      true: "Same entity",
      false: "Different entities",
    }),
    conflicting_fields: noul("Do the records contain conflicting facts that must be resolved before merging?", {
      true: "Conflicting facts present",
      false: "Compatible (differences are formatting or missing fields)",
    }),
  } as const;
}

export function entityPairMergeQuestions() {
  return buildEntityPairMergeQuestions();
}

export type EntityPairMergeQuestions = ReturnType<typeof entityPairMergeQuestions>;

export async function runEntityPairMerge(
  harness: DecisionHarness,
  state: EntityPairMergeState,
  opts?: {
    mode?: "live" | "shadow";
    id?: string;
    minConfidence?: number;
    onLowConfidence?: "review" | "escalate_llm" | "suppress" | "proceed";
  },
): Promise<DecisionResult<EntityPairMergeQuestions, EntityPairMergeAction>> {
  return entityPairMergeRecipe.run(harness, state, opts);
}
