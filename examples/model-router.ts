/**
 * Example: route a prompt to a model tier.
 *
 *   TYPESAFE_API_KEY=tsk_... npx tsx examples/model-router.ts
 */
import { DecisionHarness } from "../src/index.js";
import { runModelRouter } from "../recipes/confidence-front-door/model-router.js";

async function main() {
  const harness = new DecisionHarness();
  const prompt =
    process.argv.slice(2).join(" ") ||
    "Refactor this payment retry loop so it is idempotent under at-least-once delivery.";

  const result = await runModelRouter(harness, prompt, {
    id: "ex-router-1",
    mode: process.env.SHADOW === "1" ? "shadow" : "live",
  });

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
