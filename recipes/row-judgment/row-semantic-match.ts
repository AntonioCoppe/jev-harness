import { DecisionHarness, noul, score, type EntryType, type DecisionResult } from "../../src/index.js";

export type RowMatchAction = "include" | "exclude" | "review";

/**
 * Shape: Noul (+ optional Score) judging whether one JSON/DB row matches an NL predicate.
 *
 * Inspired by semantic WHERE (iam_zachi / Postgres `jev(row, 'natural language predicate')`):
 * for each row, ask Jev whether it matches; no embeddings index required.
 *
 * Batch helper (docs only — call `runRowSemanticMatch` in a loop or with Promise.all):
 *
 * ```ts
 * // Filter rows where Jev says the NL predicate holds, gated by confidence.
 * async function filterRowsByPredicate(
 *   harness: DecisionHarness,
 *   rows: Record<string, unknown>[],
 *   predicate: string,
 *   opts?: { concurrency?: number; mode?: "live" | "shadow" },
 * ) {
 *   const concurrency = opts?.concurrency ?? 8;
 *   const included: Record<string, unknown>[] = [];
 *   for (let i = 0; i < rows.length; i += concurrency) {
 *     const chunk = rows.slice(i, i + concurrency);
 *     const results = await Promise.all(
 *       chunk.map((row, j) =>
 *         runRowSemanticMatch(harness, { row, predicate }, {
 *           mode: opts?.mode,
 *           id: `row-${i + j}`,
 *         }),
 *       ),
 *     );
 *     results.forEach((r, j) => {
 *       if (r.action === "include") included.push(chunk[j]!);
 *     });
 *   }
 *   return included;
 * }
 * ```
 */
export function rowSemanticMatchQuestions(predicate: string) {
  return {
    matches: noul(`Does this row satisfy: ${predicate}?`, {
      true: "Row clearly matches the natural-language predicate",
      false: "Row does not match, or match is not supported by the fields",
    }),
    strength: score("How strongly does the row support that judgment?", [
      "Weak / missing fields",
      "Moderate support",
      "Strong, unambiguous support",
    ]),
  } as const;
}

export async function runRowSemanticMatch(
  harness: DecisionHarness,
  state: {
    /** One JSON-serializable row (DB tuple, document, CRM record, …). */
    row: Record<string, string | number | boolean | null | string[]>;
    /** Natural-language predicate, e.g. "could work from home". */
    predicate: string;
    row_id?: string;
  },
  opts?: {
    mode?: "live" | "shadow";
    id?: string;
    minConfidence?: number;
    /** Minimum matches.noul to include. Default 0.55. */
    matchThreshold?: number;
  },
): Promise<DecisionResult<ReturnType<typeof rowSemanticMatchQuestions>, RowMatchAction>> {
  const questions = rowSemanticMatchQuestions(state.predicate);
  const matchThreshold = opts?.matchThreshold ?? 0.55;

  return harness.run({
    id: opts?.id ?? state.row_id,
    mode: opts?.mode,
    state: {
      row: state.row,
      predicate: state.predicate,
      row_id: state.row_id ?? null,
    } as EntryType,
    questions,
    policy: {
      minConfidence: opts?.minConfidence ?? 0.5,
      onLowConfidence: "review",
      decide: ({ answers }) => {
        if (answers.matches.noul >= matchThreshold && answers.strength.score >= 0.8) {
          return "include";
        }
        if (answers.matches.noul < matchThreshold - 0.15) return "exclude";
        return "review";
      },
    },
  });
}
