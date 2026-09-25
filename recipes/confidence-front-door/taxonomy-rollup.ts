import { choice } from "@typesafe-ai/sdk";
import { defineRecipe } from "../../src/define-recipe.js";
import type { DecisionHarness } from "../../src/harness.js";
import type { DecisionResult } from "../../src/types.js";

export type TaxonomyRollupAction = string; // "<parent>/<leaf>" | "<parent>"

export type TaxonomyNode = {
  id: string;
  description: string;
  children: { id: string; description: string }[];
};

export type TaxonomyRollupState = {
  /** Item to classify (ticket, product, document…). */
  text: string;
  taxonomy: TaxonomyNode[];
  /** Minimum leaf confidence to emit the fine label (default 0.6). */
  leaf_min_confidence?: number;
};

type Answers = {
  parent: { choice: string };
  leaf: { choice: string; confidence?: number };
};

/**
 * High-cardinality classification with confidence-aware rollup: emit the fine leaf label when
 * confident and consistent with the parent; otherwise fall back to the parent label.
 * Shape: confidence-front-door (coarse label is the safe default; fine label must earn it).
 *
 * Evidence: TypeSafe "High-cardinality and hierarchical classification" + "Confidence-aware
 * hierarchical classification" use cases; Jev-Tree (hierarchical decision-tree routing).
 * Equation: wrong fine labels = misroutes; always-coarse labels = manual re-triage.
 */
export const taxonomyRollupRecipe = defineRecipe<
  ReturnType<typeof buildTaxonomyRollupQuestions>,
  TaxonomyRollupAction,
  TaxonomyRollupState
>({
  id: "taxonomy-rollup",
  name: "Taxonomy Rollup",
  category: "confidence-front-door",
  description:
    "Two-level classification: fine leaf label when confident and consistent, else roll up to the parent label.",
  module: "recipes/confidence-front-door/taxonomy-rollup.ts",
  runner: "runTaxonomyRollup",
  questions: [
    { name: "parent", kind: "choice" },
    { name: "leaf", kind: "choice" },
  ],
  actions: ["<parent>/<leaf>", "<parent>"],
  defaultMinConfidence: 0.5,
  defaultOnLowConfidence: "review",
  tags: ["classification", "taxonomy", "hierarchical", "rollup", "front-door"],
  buildQuestions: (state) => buildTaxonomyRollupQuestions(state.taxonomy),
  entryState: (state) => ({ text: state.text }),
  decide: ({ answers }, state) =>
    decideTaxonomyRollup(answers, state.leaf_min_confidence ?? 0.6),
});

export function decideTaxonomyRollup(answers: Answers, leafMinConfidence = 0.6): TaxonomyRollupAction {
  const parent = answers.parent.choice;
  const leaf = answers.leaf.choice; // "<parent>/<leaf>"
  if (!leaf.startsWith(`${parent}/`)) return parent;
  if ((answers.leaf.confidence ?? 0) < leafMinConfidence) return parent;
  return leaf;
}

function buildTaxonomyRollupQuestions(taxonomy: TaxonomyNode[]) {
  if (taxonomy.length < 2) throw new Error("taxonomy-rollup requires at least 2 parent labels");
  const parents: Record<string, string> = {};
  const leaves: Record<string, string> = {};
  for (const p of taxonomy) {
    parents[p.id] = p.description;
    for (const c of p.children) leaves[`${p.id}/${c.id}`] = `${p.description} → ${c.description}`;
  }
  return {
    parent: choice("Which top-level category fits this item?", parents),
    leaf: choice("Which specific subcategory fits this item?", leaves),
  } as const;
}

export function taxonomyRollupQuestions(taxonomy: TaxonomyNode[]) {
  return buildTaxonomyRollupQuestions(taxonomy);
}

export type TaxonomyRollupQuestions = ReturnType<typeof taxonomyRollupQuestions>;

export async function runTaxonomyRollup(
  harness: DecisionHarness,
  state: TaxonomyRollupState,
  opts?: {
    mode?: "live" | "shadow";
    id?: string;
    minConfidence?: number;
    onLowConfidence?: "review" | "escalate_llm" | "suppress" | "proceed";
  },
): Promise<DecisionResult<TaxonomyRollupQuestions, TaxonomyRollupAction>> {
  return taxonomyRollupRecipe.run(harness, state, opts);
}
