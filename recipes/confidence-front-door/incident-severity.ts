import { DecisionHarness, choice, noul, score, type EntryType, type DecisionResult } from "../../src/index.js";

export type IncidentSeverityAction = "sev1" | "sev2" | "sev3" | "sev4";

/**
 * Classify incident severity from signals, blast radius, and customer impact.
 */
export function incidentSeverityQuestions() {
  return {
    severity: choice("What severity should we assign?", {
      sev1: "Critical — widespread outage or safety/data-loss risk now",
      sev2: "Major — significant degradation for many users",
      sev3: "Minor — limited impact; workaround exists",
      sev4: "Low — cosmetic or single-user with no urgency",
    }),
    blast_radius: score("How wide is the blast radius?", [
      "Single user / internal only",
      "Segment or region affected",
      "Most or all production traffic",
    ]),
    customer_facing: noul("Are paying customers actively impacted right now?"),
  } as const;
}

export async function runIncidentSeverity(
  harness: DecisionHarness,
  state: {
    title: string;
    description: string;
    metrics?: Record<string, string | number | boolean | null>;
    affected_services?: string[];
  },
  opts?: { mode?: "live" | "shadow"; id?: string },
): Promise<DecisionResult<ReturnType<typeof incidentSeverityQuestions>, IncidentSeverityAction>> {
  const questions = incidentSeverityQuestions();
  return harness.run({
    id: opts?.id,
    mode: opts?.mode,
    state: state as EntryType,
    questions,
    policy: {
      minConfidence: 0.55,
      onLowConfidence: "review",
      decide: ({ answers }) => {
        if (answers.blast_radius.score >= 1.6 && answers.customer_facing.noul >= 0.6) return "sev1";
        if (answers.severity.choice === "sev1") return "sev1";
        if (answers.blast_radius.score >= 1.0 && answers.customer_facing.noul >= 0.45) {
          return answers.severity.choice === "sev4" ? "sev3" : (answers.severity.choice as IncidentSeverityAction);
        }
        return answers.severity.choice as IncidentSeverityAction;
      },
    },
  });
}
