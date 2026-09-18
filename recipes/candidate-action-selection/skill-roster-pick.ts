import { choice, noul } from "@typesafe-ai/sdk";
import { defineRecipe } from "../../src/define-recipe.js";
import type { DecisionHarness } from "../../src/harness.js";
import type { DecisionResult } from "../../src/types.js";

export type SkillRosterPickAction = string; // skill id | "none"

export type SkillOption = {
  id: string;
  description: string;
};

export type SkillRosterPickState = {
  /** Current user turn / prompt the agent is about to handle. */
  user_turn: string;
  /** Visible / loadable skill roster (SKILL.md-style catalog). */
  skills: SkillOption[];
  /** Optional extra session context (recent tools, goal, etc.). */
  context?: string;
  /** Skills already loaded into the session (avoid redundant suggest). */
  loaded_skills?: string[];
};

/**
 * Skill suggestion shortlist: Choice over a skill roster + need/fit gates → suggest or abstain.
 * Shape: candidate-action-selection (dynamic catalog Choice; code loads the skill).
 *
 * Deepens taxonomy P0 stub `skill-roster-pick` (TypeSafe skill_suggestion cookbook).
 * Evidence: https://github.com/Dicklesworthstone/skillranker (OSS skill ranker for coding agents).
 * Equation: wrong / extra skill loads = wasted context tokens + misdirected agent work.
 *
 * Distinct from `tool-picker`: skills are procedure packs (SKILL.md), not tool invocations.
 */
export const skillRosterPickRecipe = defineRecipe<
  ReturnType<typeof buildSkillRosterPickQuestions>,
  SkillRosterPickAction,
  SkillRosterPickState
>({
  id: "skill-roster-pick",
  name: "Skill Roster Pick",
  category: "candidate-action-selection",
  description:
    "Suggest which agent skill to load next from a roster, or abstain (skill_suggestion / SkillRanker shape).",
  module: "recipes/candidate-action-selection/skill-roster-pick.ts",
  runner: "runSkillRosterPick",
  questions: [
    { name: "skill", kind: "choice" },
    { name: "needs_skill", kind: "noul" },
    { name: "fits_top", kind: "noul" },
  ],
  actions: ["<skill-id>", "none"],
  defaultMinConfidence: 0.5,
  defaultOnLowConfidence: "review",
  tags: ["skills", "skill-suggestion", "roster", "candidates", "skillranker"],
  buildQuestions: (state) => buildSkillRosterPickQuestions(state.skills),
  entryState: (state) => ({
    user_turn: state.user_turn,
    skills: state.skills,
    context: state.context ?? "",
    loaded_skills: state.loaded_skills ?? [],
  }),
  decide: ({ answers }) => {
    if (answers.needs_skill.noul < 0.4) return "none";
    if (answers.skill.choice === "none") return "none";
    if (answers.fits_top.noul < 0.4) return "none";
    return answers.skill.choice;
  },
});

function buildSkillRosterPickQuestions(skills: SkillOption[]) {
  if (skills.length < 1) {
    throw new Error("skill-roster-pick requires at least 1 skill");
  }
  const criteria: Record<string, string> = {
    none: "No skill needed — proceed without loading a specialized procedure",
  };
  for (const s of skills) {
    criteria[s.id] = s.description.slice(0, 240);
  }
  return {
    skill: choice("Which installed skill best fits the next step?", criteria),
    needs_skill: noul("Does this turn need a specialized skill loaded?", {
      true: "A specialized procedure would materially help",
      false: "General agent capability is enough; no skill load needed",
    }),
    fits_top: noul("Does the chosen / top skill actually fit this turn?", {
      true: "Clear fit between the turn and the skill's purpose",
      false: "Weak or ambiguous fit — better to abstain",
    }),
  } as const;
}

export function skillRosterPickQuestions(skills: SkillOption[] | Record<string, string>) {
  if (Array.isArray(skills)) {
    return buildSkillRosterPickQuestions(skills);
  }
  const list: SkillOption[] = Object.entries(skills).map(([id, description]) => ({
    id,
    description,
  }));
  return buildSkillRosterPickQuestions(list);
}

export type SkillRosterPickQuestions = ReturnType<typeof skillRosterPickQuestions>;

export async function runSkillRosterPick(
  harness: DecisionHarness,
  state: SkillRosterPickState,
  opts?: {
    mode?: "live" | "shadow";
    id?: string;
    minConfidence?: number;
    onLowConfidence?: "review" | "escalate_llm" | "suppress" | "proceed";
  },
): Promise<DecisionResult<SkillRosterPickQuestions, SkillRosterPickAction>> {
  return skillRosterPickRecipe.run(harness, state, opts);
}
