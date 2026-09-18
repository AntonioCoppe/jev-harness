/**
 * Generate VitePress recipe pages + taxonomy copy from repo sources.
 * Run from repo root: npx tsx docs-site/scripts/generate.mts
 */
import { mkdirSync, writeFileSync, copyFileSync, readFileSync, existsSync, readdirSync, unlinkSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { catalog, type RecipeCatalogEntry, type RecipeCategory } from "../../recipes/catalog.ts";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "../..");
const docsRoot = join(root, "docs-site");
const recipesDir = join(docsRoot, "recipes");

const CATEGORY_ORDER: RecipeCategory[] = [
  "candidate-action-selection",
  "row-judgment",
  "verify-gate",
  "confidence-front-door",
  "composite-rubric",
  "semantic-find",
  "live-multi-judgment",
  "high-freq-reflex",
];

const CATEGORY_TITLES: Record<RecipeCategory, string> = {
  "candidate-action-selection": "Candidate action selection",
  "row-judgment": "Row judgment",
  "live-multi-judgment": "Live multi-judgment",
  "confidence-front-door": "Confidence front door",
  "verify-gate": "Verify gate",
  "composite-rubric": "Composite rubric",
  "semantic-find": "Semantic find",
  "high-freq-reflex": "High-freq reflex",
};

function escapeMd(s: string): string {
  return s.replace(/\|/g, "\\|");
}

function yamlQuote(s: string): string {
  return JSON.stringify(s);
}

function recipePage(entry: RecipeCatalogEntry): string {
  const questions = entry.questions
    .map((q) => `| \`${q.name}\` | \`${q.kind}\` |`)
    .join("\n");
  const actions = entry.actions.map((a) => `\`${a}\``).join(", ");
  const tags = entry.tags.map((t) => `\`${t}\``).join(", ");

  return `---
title: ${yamlQuote(entry.name)}
description: ${yamlQuote(entry.description)}
---

# ${entry.name}

\`${entry.id}\` · category [\`${entry.category}\`](/recipes/#${entry.category})

${entry.description}

## Catalog

| Field | Value |
|---|---|
| **ID** | \`${entry.id}\` |
| **Category** | [\`${entry.category}\`](/recipes/#${entry.category}) |
| **Module** | [\`${entry.module}\`](https://github.com/AntonioCoppe/jev-harness/blob/main/${entry.module}) |
| **Runner** | \`${entry.runner}\` |
| **Default min confidence** | \`${entry.defaultMinConfidence}\` |
| **On low confidence** | \`${entry.defaultOnLowConfidence}\` |
| **Actions** | ${actions} |
| **Tags** | ${tags || "—"} |

## Questions

| Name | Kind |
|---|---|
${questions}

## Import

\`\`\`ts
import { ${entry.runner} } from "jev-harness/recipes";
\`\`\`

See also: [Recipes index](/recipes/), [Taxonomy](/taxonomy), [source](https://github.com/AntonioCoppe/jev-harness/blob/main/${entry.module}).
`;
}

function recipesIndex(entries: readonly RecipeCatalogEntry[]): string {
  const byCat = new Map<RecipeCategory, RecipeCatalogEntry[]>();
  for (const id of CATEGORY_ORDER) byCat.set(id, []);
  for (const e of entries) {
    const list = byCat.get(e.category) ?? [];
    list.push(e);
    byCat.set(e.category, list);
  }

  const sections: string[] = [];
  for (const cat of CATEGORY_ORDER) {
    const list = byCat.get(cat) ?? [];
    const title = CATEGORY_TITLES[cat];
    sections.push(`## \`${cat}\` {#${cat}}\n`);
    sections.push(`${title}. See [taxonomy](/taxonomy).\n`);
    if (list.length === 0) {
      sections.push("_No catalog recipes yet for this shape._\n");
      continue;
    }
    sections.push("| Recipe | Description |");
    sections.push("|---|---|");
    for (const e of list) {
      sections.push(
        `| [\`${e.id}\`](/recipes/${e.id}) — **${escapeMd(e.name)}** | ${escapeMd(e.description)} |`,
      );
    }
    sections.push("");
  }

  return `---
title: Recipes
description: Catalog recipes grouped by taxonomy shape ID
---

# Recipes

Machine-readable entries from \`recipes/catalog.ts\`, grouped by taxonomy ID (\`research/taxonomy.md\`).

${entries.length} recipes in catalog.

${sections.join("\n")}
`;
}

function main() {
  mkdirSync(recipesDir, { recursive: true });

  // Remove previously generated recipe pages (keep index regenerated)
  if (existsSync(recipesDir)) {
    for (const f of readdirSync(recipesDir)) {
      if (f.endsWith(".md")) unlinkSync(join(recipesDir, f));
    }
  }

  copyFileSync(join(root, "research/taxonomy.md"), join(docsRoot, "taxonomy.md"));

  writeFileSync(join(recipesDir, "index.md"), recipesIndex(catalog), "utf8");

  for (const entry of catalog) {
    writeFileSync(join(recipesDir, `${entry.id}.md`), recipePage(entry), "utf8");
  }

  // Sidebar helper for config (optional JSON)
  const sidebarRecipes = catalog.map((e) => ({
    text: e.name,
    link: `/recipes/${e.id}`,
  }));
  writeFileSync(
    join(docsRoot, ".vitepress/generated-sidebar.json"),
    JSON.stringify({ recipes: sidebarRecipes, categories: CATEGORY_ORDER }, null, 2),
    "utf8",
  );

  console.log(`Generated taxonomy + ${catalog.length} recipe pages under docs-site/`);
}

main();
