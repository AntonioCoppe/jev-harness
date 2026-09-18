import { writeFileSync, readFileSync } from "fs";
import { DecisionHarness } from "../../../src/index.js";
import { runRowSemanticMatch } from "../../../recipes/row-judgment/row-semantic-match.js";

const people = JSON.parse(readFileSync(new URL("./out/people.json", import.meta.url), "utf8"));
const predicate = readFileSync(new URL("./out/predicate.txt", import.meta.url), "utf8").trim();
const harness = new DecisionHarness({});

async function main() {
  console.log("=".repeat(72));
  console.log("BAKEOFF — Jev + jev-harness (LIVE TypeSafe API)");
  console.log("=".repeat(72));
  console.log("host        : jev-harness box");
  console.log("tool        : DecisionHarness + row-semantic-match");
  console.log(`rows        : ${people.length}`);
  console.log(`predicate   : ${predicate}`);
  console.log(`started     : ${new Date().toISOString()}`);

  const t0 = performance.now();
  const results = [] as any[];
  const concurrency = 8;
  for (let i = 0; i < people.length; i += concurrency) {
    const chunk = people.slice(i, i + concurrency);
    const part = await Promise.all(
      chunk.map((row: any, j: number) =>
        runRowSemanticMatch(
          harness,
          { row, predicate, row_id: row.id },
          { id: `row-${i + j}` },
        ),
      ),
    );
    results.push(...part);
  }
  const wall = performance.now() - t0;
  const include = results.filter((r) => r.action === "include").length;
  const exclude = results.filter((r) => r.action === "exclude").length;
  const review = results.filter((r) => r.action === "review").length;
  let input = 0;
  let output = 0;
  for (const r of results) {
    input += r.raw?.usage?.input_tokens ?? r.usage?.input_tokens ?? 0;
    output += r.raw?.usage?.output_tokens ?? r.usage?.output_tokens ?? 0;
  }
  const usd = (input / 1e6) * 0.042;

  console.log(`finished    : ${new Date().toISOString()}`);
  console.log(`WALL CLOCK  : ${(wall / 1000).toFixed(3)} seconds`);
  console.log(`per row avg : ${(wall / people.length).toFixed(0)} ms`);
  console.log(`actions     : include=${include} exclude=${exclude} review=${review}`);
  console.log(`tokens      : in=${input} out=${output}`);
  console.log(`est USD     : $${usd.toFixed(6)} (input @ $0.042/MTok)`);
  console.log("=".repeat(72));

  writeFileSync(
    new URL("./out/jev_live.json", import.meta.url),
    JSON.stringify({ wall_ms: Math.round(wall), include, exclude, review, input_tokens: input, output_tokens: output, usd, concurrency }, null, 2),
  );
}

main().catch((e) => { console.error(e); process.exit(1); });
