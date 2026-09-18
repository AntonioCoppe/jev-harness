import type { Questions } from "@typesafe-ai/sdk";
import type { DecisionHarness } from "./harness.js";
import type {
  DecisionAction,
  DecisionResult,
  LowConfidenceStrategy,
  PolicyContext,
  RunMode,
} from "./types.js";
import type {
  RecipeCatalogEntry,
  RecipeCategory,
  RecipeQuestionKind,
} from "../recipes/catalog.js";

export type { RecipeCatalogEntry, RecipeCategory, RecipeQuestionKind };

export interface RecipeRunOptions {
  mode?: RunMode;
  id?: string;
  minConfidence?: number;
  onLowConfidence?: LowConfidenceStrategy;
  model?: string;
}

/**
 * Config for {@link defineRecipe}: catalog metadata + questions builder + policy.
 * Runners and `recipes/catalog.ts` share the same shape via `catalogEntry`.
 */
export interface DefineRecipeConfig<
  Q extends Questions,
  A extends DecisionAction,
  S = unknown,
> {
  id: string;
  name: string;
  category: RecipeCategory;
  description: string;
  /** Import path relative to package root (TypeScript source). */
  module: string;
  /** Exported runner function name. */
  runner: string;
  questions: { name: string; kind: RecipeQuestionKind }[];
  actions: string[];
  defaultMinConfidence?: number;
  defaultOnLowConfidence?: LowConfidenceStrategy;
  tags?: string[];
  /** Build System One questions from caller state. */
  buildQuestions: (state: S) => Q;
  /** Map answers → domain action (before confidence / shadow overrides). */
  decide: (ctx: PolicyContext<Q>, state: S) => A;
  /** Optional transform of state sent to Jev (defaults to `state` as-is). */
  entryState?: (state: S) => unknown;
}

export interface DefinedRecipe<
  Q extends Questions,
  A extends DecisionAction,
  S = unknown,
> {
  readonly id: string;
  /** Machine-readable catalog row — keep in sync with `recipes/catalog.ts`. */
  readonly catalogEntry: RecipeCatalogEntry;
  buildQuestions: (state: S) => Q;
  run: (
    harness: DecisionHarness,
    state: S,
    opts?: RecipeRunOptions,
  ) => Promise<DecisionResult<Q, A>>;
}

/**
 * Typed recipe helper shared by runners and catalog metadata.
 *
 * ```ts
 * const recipe = defineRecipe({
 *   id: "model-router",
 *   category: "confidence-front-door",
 *   // …catalog fields…
 *   buildQuestions: () => ({ tier: choice(...), risk: score(...) }),
 *   decide: ({ answers }) => answers.tier.choice,
 * });
 *
 * await recipe.run(harness, { prompt });
 * catalog.push(recipe.catalogEntry); // or mirror fields in catalog.ts
 * ```
 */
export function defineRecipe<
  Q extends Questions,
  A extends DecisionAction,
  S = unknown,
>(config: DefineRecipeConfig<Q, A, S>): DefinedRecipe<Q, A, S> {
  const catalogEntry: RecipeCatalogEntry = {
    id: config.id,
    name: config.name,
    category: config.category,
    description: config.description,
    module: config.module,
    runner: config.runner,
    questions: config.questions,
    actions: config.actions,
    defaultMinConfidence: config.defaultMinConfidence ?? 0.55,
    defaultOnLowConfidence: config.defaultOnLowConfidence ?? "review",
    tags: config.tags ?? [],
  };

  return {
    id: config.id,
    catalogEntry,
    buildQuestions: config.buildQuestions,
    async run(harness, state, opts) {
      const questions = config.buildQuestions(state);
      return harness.run({
        id: opts?.id,
        mode: opts?.mode,
        model: opts?.model,
        state: config.entryState ? config.entryState(state) : (state as unknown),
        questions,
        policy: {
          minConfidence: opts?.minConfidence ?? catalogEntry.defaultMinConfidence,
          onLowConfidence:
            opts?.onLowConfidence ?? catalogEntry.defaultOnLowConfidence,
          decide: (ctx) => config.decide(ctx, state),
        },
      });
    },
  };
}
