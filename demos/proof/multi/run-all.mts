/**
 * Run all multi proof cases sequentially.
 *   npx tsx demos/proof/multi/run-all.mts
 */
import { spawn } from "node:child_process";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const HERE = dirname(fileURLToPath(import.meta.url));
const runners = [
  "run-row-semantic-match.mts",
  "run-shell-command-gate.mts",
  "run-keystroke-launcher.mts",
  "run-alert-gate.mts",
  "run-model-cost-router.mts",
];

function runOne(file: string): Promise<number> {
  return new Promise((resolve) => {
    const child = spawn("npx", ["tsx", join(HERE, file)], {
      stdio: "inherit",
      cwd: join(HERE, "../../.."),
      env: process.env,
    });
    child.on("close", (code) => resolve(code ?? 1));
  });
}

async function main() {
  let failed = 0;
  for (const r of runners) {
    console.log(`\n>>> ${r}`);
    const code = await runOne(r);
    if (code !== 0) {
      console.error(`FAILED ${r} exit=${code}`);
      failed++;
    }
  }
  if (failed) process.exit(1);
}

main();
