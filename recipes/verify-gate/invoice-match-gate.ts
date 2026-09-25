import { noul } from "@typesafe-ai/sdk";
import { defineRecipe } from "../../src/define-recipe.js";
import type { DecisionHarness } from "../../src/harness.js";
import type { DecisionResult } from "../../src/types.js";

export type InvoiceMatchGateAction =
  | "pay"
  | "hold"
  | "dispute_lines"
  | "request_correction"
  | "route_approval";

export type InvoiceMatchGateState = {
  /** Invoice text or parsed summary (vendor, lines, totals). */
  invoice: string;
  /** Matching purchase order / contract excerpt. */
  purchase_order: string;
  /** Vendor master record (name, bank details on file, terms). */
  vendor_record: string;
  /** Recent invoices from this vendor, for duplicate checks. */
  prior_invoices?: string[];
  /** Code-owned arithmetic: do invoice totals reconcile with the PO? */
  totals_match: boolean;
  /** Code-owned: does the amount exceed the auto-pay approval limit? */
  over_approval_limit: boolean;
};

/**
 * Invoice vs PO / vendor / history: semantic checks by Jev, arithmetic + payment by code.
 * Shape: verify-gate (verdict on a document against its evidence before money moves).
 *
 * Evidence: TypeSafe "Invoice matching and payment controls" use case
 * (https://evals.typesafe.ai/invoice_processing) — actions pay / hold / dispute lines /
 * request correction / route for approval.
 * Equation: duplicate / fraudulent payments = cash lost + AP review hours.
 */
export const invoiceMatchGateRecipe = defineRecipe<
  ReturnType<typeof buildInvoiceMatchGateQuestions>,
  InvoiceMatchGateAction,
  InvoiceMatchGateState
>({
  id: "invoice-match-gate",
  name: "Invoice Match Gate",
  category: "verify-gate",
  description:
    "Invoice vs PO/vendor/history: duplicate, fraud, wrong-vendor, line mismatch → pay / hold / dispute / correct / approve.",
  module: "recipes/verify-gate/invoice-match-gate.ts",
  runner: "runInvoiceMatchGate",
  questions: [
    { name: "duplicate", kind: "noul" },
    { name: "fraud_signal", kind: "noul" },
    { name: "wrong_vendor", kind: "noul" },
    { name: "line_mismatch", kind: "noul" },
  ],
  actions: ["pay", "hold", "dispute_lines", "request_correction", "route_approval"],
  defaultMinConfidence: 0.6,
  defaultOnLowConfidence: "review",
  tags: ["finance", "invoices", "accounts-payable", "fraud", "payments", "verify-gate"],
  buildQuestions: () => buildInvoiceMatchGateQuestions(),
  decide: ({ answers }, state) => {
    if (answers.fraud_signal.noul >= 0.6 || answers.duplicate.noul >= 0.6) return "hold";
    if (answers.wrong_vendor.noul >= 0.6) return "request_correction";
    if (!state.totals_match || answers.line_mismatch.noul >= 0.6) return "dispute_lines";
    if (state.over_approval_limit) return "route_approval";
    return "pay";
  },
});

function buildInvoiceMatchGateQuestions() {
  return {
    duplicate: noul("Is this invoice a duplicate of a prior invoice (same work billed again)?", {
      true: "Likely duplicate of a prior invoice",
      false: "Distinct invoice",
    }),
    fraud_signal: noul(
      "Are there fraud signals (changed bank details, urgency pressure, mismatched sender)?",
      {
        true: "Fraud indicators present",
        false: "No fraud indicators",
      },
    ),
    wrong_vendor: noul("Is the invoice addressed from or to the wrong entity vs the PO/vendor record?", {
      true: "Vendor / bill-to entity doesn't match",
      false: "Entities match",
    }),
    line_mismatch: noul("Do invoice line items differ from what the PO/contract covers?", {
      true: "Items, quantities, or rates not covered by the PO/contract",
      false: "Lines match the PO/contract",
    }),
  } as const;
}

export function invoiceMatchGateQuestions() {
  return buildInvoiceMatchGateQuestions();
}

export type InvoiceMatchGateQuestions = ReturnType<typeof invoiceMatchGateQuestions>;

export async function runInvoiceMatchGate(
  harness: DecisionHarness,
  state: InvoiceMatchGateState,
  opts?: {
    mode?: "live" | "shadow";
    id?: string;
    minConfidence?: number;
    onLowConfidence?: "review" | "escalate_llm" | "suppress" | "proceed";
  },
): Promise<DecisionResult<InvoiceMatchGateQuestions, InvoiceMatchGateAction>> {
  return invoiceMatchGateRecipe.run(harness, state, opts);
}
