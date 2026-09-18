/**
 * Example: gate an ops alert with DecisionHarness + the alert-gate recipe.
 *
 *   TYPESAFE_API_KEY=tsk_... npx tsx examples/alert-gate.ts
 */
import { DecisionHarness } from "../src/index.js";
import { runAlertGate } from "../recipes/confidence-front-door/alert-gate.js";

async function main() {
  const harness = new DecisionHarness({
    // Uses TYPESAFE_API_KEY; default model jev-latest
  });

  const result = await runAlertGate(
    harness,
    {
      source: "pagerduty",
      summary: "p99 latency spike on checkout-api (region=us-east-1)",
      signals: { p99_ms: 2400, baseline_ms: 180, error_rate: 0.02 },
      policy: "Page only for customer-impacting production incidents",
    },
    { id: "ex-alert-1", mode: process.env.SHADOW === "1" ? "shadow" : "live" },
  );

  console.log(
    JSON.stringify(
      {
        action: result.action,
        intendedAction: result.intendedAction,
        confidence: result.confidence,
        reason: result.reason,
        answers: result.answers,
      },
      null,
      2,
    ),
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
