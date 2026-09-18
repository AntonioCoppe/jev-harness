/**
 * Machine-readable catalog of reference recipes for discovery, docs, and tooling.
 * Category IDs match research/taxonomy.md (empirical harness shapes).
 */
export type RecipeCategory =
  | "candidate-action-selection"
  | "row-judgment"
  | "live-multi-judgment"
  | "confidence-front-door"
  | "verify-gate"
  | "composite-rubric"
  | "semantic-find"
  | "high-freq-reflex";

export type RecipeQuestionKind = "choice" | "score" | "noul";

export interface RecipeCatalogEntry {
  /** Stable id, matches path slug under recipes/<category>/ */
  id: string;
  name: string;
  category: RecipeCategory;
  description: string;
  /** Import path relative to package root (TypeScript source). */
  module: string;
  /** Exported runner function name. */
  runner: string;
  /** Question names and kinds used by the recipe. */
  questions: { name: string; kind: RecipeQuestionKind }[];
  /** Domain actions the policy may return (not including low-confidence / shadow overrides). */
  actions: string[];
  defaultMinConfidence: number;
  defaultOnLowConfidence: "review" | "escalate_llm" | "suppress" | "proceed";
  tags: string[];
}

export const catalog: readonly RecipeCatalogEntry[] = [
  {
    id: "candidate-action-select",
    name: "Candidate Action Select",
    category: "candidate-action-selection",
    description: "Choice over a dynamic candidate set (+ optional stop Noul) for perception→act loops.",
    module: "recipes/candidate-action-selection/candidate-action-select.ts",
    runner: "runCandidateActionSelect",
    questions: [
      { name: "next", kind: "choice" },
      { name: "done", kind: "noul" },
    ],
    actions: ["<candidate-id>", "STOP"],
    defaultMinConfidence: 0.45,
    defaultOnLowConfidence: "review",
    tags: ["ui-grounding", "candidates", "computer-use"],
  },
  {
    id: "browser-next-action",
    name: "Browser Next Action",
    category: "candidate-action-selection",
    description: "Pick the next click/candidate in computer-use or wiki-race flows.",
    module: "recipes/candidate-action-selection/browser-next-action.ts",
    runner: "runBrowserNextAction",
    questions: [
      { name: "next", kind: "choice" },
      { name: "done", kind: "noul" },
    ],
    actions: ["<candidate-id>", "STOP"],
    defaultMinConfidence: 0.45,
    defaultOnLowConfidence: "review",
    tags: ["ui-grounding", "browser", "computer-use"],
  },
  {
    id: "tool-picker",
    name: "Tool Picker",
    category: "candidate-action-selection",
    description: "Pick which tool to invoke next from a declared catalog, or decline.",
    module: "recipes/candidate-action-selection/tool-picker.ts",
    runner: "runToolPicker",
    questions: [
      { name: "tool", kind: "choice" },
      { name: "necessary", kind: "noul" },
    ],
    actions: ["<tool-id>", "none"],
    defaultMinConfidence: 0.5,
    defaultOnLowConfidence: "review",
    tags: ["tools", "planning", "candidates"],
  },
  {
    id: "stop-or-continue",
    name: "Stop or Continue",
    category: "candidate-action-selection",
    description: "Decide whether an agent loop should keep going, stop, or ask the user.",
    module: "recipes/candidate-action-selection/stop-or-continue.ts",
    runner: "runStopOrContinue",
    questions: [
      { name: "disposition", kind: "choice" },
      { name: "progress", kind: "score" },
      { name: "stuck", kind: "noul" },
    ],
    actions: ["continue", "stop", "ask_user"],
    defaultMinConfidence: 0.5,
    defaultOnLowConfidence: "review",
    tags: ["loops", "control", "stop-noul"],
  },
  {
    id: "row-semantic-match",
    name: "Row Semantic Match",
    category: "row-judgment",
    description: "Judge whether one JSON/DB row matches a natural-language predicate.",
    module: "recipes/row-judgment/row-semantic-match.ts",
    runner: "runRowSemanticMatch",
    questions: [
      { name: "matches", kind: "noul" },
      { name: "strength", kind: "score" },
    ],
    actions: ["include", "exclude", "review"],
    defaultMinConfidence: 0.5,
    defaultOnLowConfidence: "review",
    tags: ["structured-data-filter", "semantic-where", "data"],
  },
  {
    id: "model-router",
    name: "Model Router",
    category: "confidence-front-door",
    description: "Route a user prompt to cheap / mid / frontier tiers by difficulty and risk.",
    module: "recipes/confidence-front-door/model-router.ts",
    runner: "runModelRouter",
    questions: [
      { name: "tier", kind: "choice" },
      { name: "risk", kind: "score" },
    ],
    actions: ["cheap", "mid", "frontier"],
    defaultMinConfidence: 0.5,
    defaultOnLowConfidence: "escalate_llm",
    tags: ["routing", "cost", "llm"],
  },
  {
    id: "alert-gate",
    name: "Alert Gate",
    category: "confidence-front-door",
    description: "Gate noisy automated alerts before they page a human.",
    module: "recipes/confidence-front-door/alert-gate.ts",
    runner: "runAlertGate",
    questions: [
      { name: "disposition", kind: "choice" },
      { name: "severity", kind: "score" },
      { name: "needs_human", kind: "noul" },
    ],
    actions: ["notify", "queue_review", "suppress"],
    defaultMinConfidence: 0.55,
    defaultOnLowConfidence: "review",
    tags: ["alerts", "paging", "on-call", "routing"],
  },
  {
    id: "inbox-triage",
    name: "Inbox Triage",
    category: "confidence-front-door",
    description: "Route inbound messages into bookings, orders, support, spam, or other.",
    module: "recipes/confidence-front-door/inbox-triage.ts",
    runner: "runInboxTriage",
    questions: [
      { name: "bucket", kind: "choice" },
      { name: "urgency", kind: "score" },
      { name: "is_customer", kind: "noul" },
    ],
    actions: ["bookings", "orders", "support", "spam", "other"],
    defaultMinConfidence: 0.55,
    defaultOnLowConfidence: "review",
    tags: ["email", "inbox", "triage", "routing"],
  },
  {
    id: "incident-severity",
    name: "Incident Severity",
    category: "confidence-front-door",
    description: "Classify incident severity from signals, blast radius, and customer impact.",
    module: "recipes/confidence-front-door/incident-severity.ts",
    runner: "runIncidentSeverity",
    questions: [
      { name: "severity", kind: "choice" },
      { name: "blast_radius", kind: "score" },
      { name: "customer_facing", kind: "noul" },
    ],
    actions: ["sev1", "sev2", "sev3", "sev4"],
    defaultMinConfidence: 0.55,
    defaultOnLowConfidence: "review",
    tags: ["incident", "severity", "routing"],
  },
  {
    id: "oncall-page",
    name: "On-call Page",
    category: "confidence-front-door",
    description: "Decide whether an event should page on-call, soft-notify, defer, or be ignored.",
    module: "recipes/confidence-front-door/oncall-page.ts",
    runner: "runOncallPage",
    questions: [
      { name: "action", kind: "choice" },
      { name: "urgency", kind: "score" },
      { name: "actionable", kind: "noul" },
    ],
    actions: ["page_now", "notify_slack", "defer", "ignore"],
    defaultMinConfidence: 0.55,
    defaultOnLowConfidence: "review",
    tags: ["on-call", "paging", "routing"],
  },
  {
    id: "llm-verifier",
    name: "LLM Verifier",
    category: "verify-gate",
    description: "Verify an LLM or tool output before it ships.",
    module: "recipes/verify-gate/llm-verifier.ts",
    runner: "runLlmVerifier",
    questions: [
      { name: "verdict", kind: "choice" },
      { name: "grounded", kind: "noul" },
      { name: "jailbreak", kind: "noul" },
    ],
    actions: ["allow", "revise", "block"],
    defaultMinConfidence: 0.6,
    defaultOnLowConfidence: "review",
    tags: ["safety", "verification", "gate"],
  },
  {
    id: "injection-check",
    name: "Injection Check",
    category: "verify-gate",
    description: "Detect prompt injection / jailbreak attempts in untrusted input.",
    module: "recipes/verify-gate/injection-check.ts",
    runner: "runInjectionCheck",
    questions: [
      { name: "disposition", kind: "choice" },
      { name: "severity", kind: "score" },
      { name: "is_injection", kind: "noul" },
    ],
    actions: ["pass", "sanitize", "block"],
    defaultMinConfidence: 0.55,
    defaultOnLowConfidence: "review",
    tags: ["injection", "security", "gate"],
  },
  {
    id: "tool-call-allowlist",
    name: "Tool Call Allowlist",
    category: "verify-gate",
    description: "Gate a proposed tool call against policy / allowlist before execution.",
    module: "recipes/verify-gate/tool-call-allowlist.ts",
    runner: "runToolCallAllowlist",
    questions: [
      { name: "verdict", kind: "choice" },
      { name: "args_safe", kind: "noul" },
      { name: "intent_aligned", kind: "noul" },
    ],
    actions: ["allow", "deny", "require_confirm"],
    defaultMinConfidence: 0.6,
    defaultOnLowConfidence: "review",
    tags: ["tools", "allowlist", "gate"],
  },
  {
    id: "rubric-scorer",
    name: "Rubric Scorer",
    category: "composite-rubric",
    description: "Score a submission against an ordered multi-dimension rubric.",
    module: "recipes/composite-rubric/rubric-scorer.ts",
    runner: "runRubricScorer",
    questions: [{ name: "<dimension-id>", kind: "score" }],
    actions: ["pass", "revise", "fail"],
    defaultMinConfidence: 0.5,
    defaultOnLowConfidence: "review",
    tags: ["rubric", "scoring", "multi-score"],
  },
] as const;

export function getRecipe(id: string): RecipeCatalogEntry | undefined {
  return catalog.find((r) => r.id === id);
}

export function recipesByCategory(category: RecipeCategory): RecipeCatalogEntry[] {
  return catalog.filter((r) => r.category === category);
}
