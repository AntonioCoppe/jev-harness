import { choice, noul } from "@typesafe-ai/sdk";
import { defineRecipe } from "../../src/define-recipe.js";
import type { DecisionHarness } from "../../src/harness.js";
import type { DecisionResult } from "../../src/types.js";

export type ExpenseApprovalAction = "approve" | "request_receipt" | "route_manager" | "reject";

export type ExpenseApprovalState = {
  /** Expense line as submitted (merchant, description, amount, claimed category). */
  expense: string;
  /** Relevant expense policy excerpt. */
  policy: string;
  /** Code-owned: is a receipt attached? */
  receipt_attached: boolean;
  /** Code-owned: does the amount exceed the auto-approve limit for its category? */
  over_limit: boolean;
};

type Answers = {
  category: { choice: string };
  business_purpose: { noul: number };
  policy_violation: { noul: number };
  personal_expense: { noul: number };
};

/**
 * Expense-claim front door: classify, check business purpose and policy → approve / ask / route / reject.
 * Shape: confidence-front-door (auto-approve the clear cases, route exceptions to a person).
 *
 * Evidence: TypeSafe "Expense-claim approval" use case (classify expenses, route exceptions).
 * Equation: manual review of every claim = finance hours; auto-approving bad claims = leakage $.
 */
export const expenseApprovalRecipe = defineRecipe<
  ReturnType<typeof buildExpenseApprovalQuestions>,
  ExpenseApprovalAction,
  ExpenseApprovalState
>({
  id: "expense-approval",
  name: "Expense Approval",
  category: "confidence-front-door",
  description:
    "Expense claim front door: category, business purpose, policy fit → approve / request_receipt / route_manager / reject.",
  module: "recipes/confidence-front-door/expense-approval.ts",
  runner: "runExpenseApproval",
  questions: [
    { name: "category", kind: "choice" },
    { name: "business_purpose", kind: "noul" },
    { name: "policy_violation", kind: "noul" },
    { name: "personal_expense", kind: "noul" },
  ],
  actions: ["approve", "request_receipt", "route_manager", "reject"],
  defaultMinConfidence: 0.6,
  defaultOnLowConfidence: "review",
  tags: ["finance", "expenses", "approvals", "policy", "front-door"],
  buildQuestions: () => buildExpenseApprovalQuestions(),
  decide: ({ answers }, state) => decideExpenseApproval(answers, state),
});

export function decideExpenseApproval(
  answers: Answers,
  state: Pick<ExpenseApprovalState, "receipt_attached" | "over_limit">,
): ExpenseApprovalAction {
  if (answers.personal_expense.noul >= 0.7) return "reject";
  if (!state.receipt_attached) return "request_receipt";
  if (answers.policy_violation.noul >= 0.5 || state.over_limit) return "route_manager";
  if (answers.business_purpose.noul < 0.5) return "route_manager";
  return "approve";
}

function buildExpenseApprovalQuestions() {
  return {
    category: choice("Which expense category does this belong to?", {
      travel: "Flights, hotels, ground transport",
      meals: "Meals and client dining",
      software: "Software, subscriptions, cloud",
      office: "Office supplies and equipment",
      entertainment: "Events, gifts, entertainment",
      other: "Anything else",
    }),
    business_purpose: noul("Is there a clear business purpose for this expense?", {
      true: "Clear business purpose",
      false: "Business purpose unclear or missing",
    }),
    policy_violation: noul("Does this expense appear to violate the stated policy?", {
      true: "Likely policy violation",
      false: "Within policy",
    }),
    personal_expense: noul("Is this most likely a personal (non-business) expense?", {
      true: "Personal expense",
      false: "Business expense",
    }),
  } as const;
}

export function expenseApprovalQuestions() {
  return buildExpenseApprovalQuestions();
}

export type ExpenseApprovalQuestions = ReturnType<typeof expenseApprovalQuestions>;

export async function runExpenseApproval(
  harness: DecisionHarness,
  state: ExpenseApprovalState,
  opts?: {
    mode?: "live" | "shadow";
    id?: string;
    minConfidence?: number;
    onLowConfidence?: "review" | "escalate_llm" | "suppress" | "proceed";
  },
): Promise<DecisionResult<ExpenseApprovalQuestions, ExpenseApprovalAction>> {
  return expenseApprovalRecipe.run(harness, state, opts);
}
