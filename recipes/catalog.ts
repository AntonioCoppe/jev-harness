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

export const catalog = [
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
  {
    id: "typewriter-panel",
    name: "Typewriter Panel",
    category: "live-multi-judgment",
    description: "Live multi-score editor panel: tone, clarity, urgency, AI-written, intent on a draft.",
    module: "recipes/live-multi-judgment/typewriter-panel.ts",
    runner: "runTypewriterPanel",
    questions: [
      { name: "tone", kind: "score" },
      { name: "clarity", kind: "score" },
      { name: "urgent", kind: "noul" },
      { name: "ai_written", kind: "noul" },
      { name: "intent", kind: "choice" },
    ],
    actions: ["update_ui"],
    defaultMinConfidence: 0.4,
    defaultOnLowConfidence: "proceed",
    tags: ["live", "fan-out", "editor", "typewriter"],
  },
  {
    id: "ticket-fanout",
    name: "Ticket Fanout",
    category: "live-multi-judgment",
    description: "Speculative multi-question ticket briefing in one RTT; route or escalate.",
    module: "recipes/live-multi-judgment/ticket-fanout.ts",
    runner: "runTicketFanout",
    questions: [
      { name: "category", kind: "choice" },
      { name: "severity", kind: "score" },
      { name: "refund", kind: "noul" },
      { name: "has_repro", kind: "noul" },
      { name: "frustration", kind: "score" },
    ],
    actions: ["billing", "bug", "how_to", "account", "other", "escalate"],
    defaultMinConfidence: 0.5,
    defaultOnLowConfidence: "review",
    tags: ["live", "fan-out", "support", "ticket"],
  },
  {
    id: "line-semantic-find",
    name: "Line Semantic Find",
    category: "semantic-find",
    description: "Pick the best doc line for an NL query, or NONE if nothing fits.",
    module: "recipes/semantic-find/line-semantic-find.ts",
    runner: "runLineSemanticFind",
    questions: [
      { name: "best", kind: "choice" },
      { name: "answer_exists", kind: "noul" },
    ],
    actions: ["<line-id>", "NONE"],
    defaultMinConfidence: 0.5,
    defaultOnLowConfidence: "review",
    tags: ["search", "rank", "lines", "rag"],
  },
  {
    id: "span-pick",
    name: "Span Pick",
    category: "semantic-find",
    description: "Pick a pre-parsed value/span that satisfies a request, or NONE.",
    module: "recipes/semantic-find/span-pick.ts",
    runner: "runSpanPick",
    questions: [
      { name: "span", kind: "choice" },
      { name: "none_fit", kind: "noul" },
    ],
    actions: ["<span-id>", "NONE"],
    defaultMinConfidence: 0.5,
    defaultOnLowConfidence: "review",
    tags: ["extraction", "spans", "candidates"],
  },
  {
    id: "mm-buy-sell",
    name: "MM Buy Sell",
    category: "high-freq-reflex",
    description: "Block-time buy/sell/hold reflex from a compact book snapshot.",
    module: "recipes/high-freq-reflex/mm-buy-sell.ts",
    runner: "runMmBuySell",
    questions: [
      { name: "side", kind: "choice" },
      { name: "edge", kind: "score" },
    ],
    actions: ["buy", "sell", "hold"],
    defaultMinConfidence: 0.45,
    defaultOnLowConfidence: "suppress",
    tags: ["latency", "trading", "reflex"],
  },
  {
    id: "hot-path-allow",
    name: "Hot Path Allow",
    category: "high-freq-reflex",
    description: "Sub-100ms allow/deny reflex on a compact hot-path event.",
    module: "recipes/high-freq-reflex/hot-path-allow.ts",
    runner: "runHotPathAllow",
    questions: [
      { name: "allow", kind: "noul" },
      { name: "severity", kind: "score" },
    ],
    actions: ["allow", "deny"],
    defaultMinConfidence: 0.5,
    defaultOnLowConfidence: "review",
    tags: ["latency", "gate", "reflex"],
  },
] as const satisfies readonly RecipeCatalogEntry[];

export function getRecipe(id: string): RecipeCatalogEntry | undefined {
  return catalog.find((r) => r.id === id);
}

export function recipesByCategory(category: RecipeCategory): RecipeCatalogEntry[] {
  return catalog.filter((r) => r.category === category);
}
