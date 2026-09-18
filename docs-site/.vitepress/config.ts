import { defineConfig } from "vitepress";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const generatedPath = join(__dirname, "generated-sidebar.json");

type SidebarRecipe = { text: string; link: string };

function recipeSidebarItems(): SidebarRecipe[] {
  if (!existsSync(generatedPath)) return [];
  const data = JSON.parse(readFileSync(generatedPath, "utf8")) as {
    recipes: SidebarRecipe[];
  };
  return data.recipes ?? [];
}

export default defineConfig({
  title: "jev-harness",
  description:
    "Decision harness for TypeSafe Jev — confidence-gated System One decisions with recipes, shadow mode, and evals",
  cleanUrls: true,
  ignoreDeadLinks: true,
  themeConfig: {
    nav: [
      { text: "Home", link: "/" },
      { text: "Taxonomy", link: "/taxonomy" },
      { text: "Recipes", link: "/recipes/" },
      {
        text: "GitHub",
        link: "https://github.com/AntonioCoppe/jev-harness",
      },
    ],
    sidebar: [
      {
        text: "Guide",
        items: [
          { text: "Home", link: "/" },
          { text: "Taxonomy", link: "/taxonomy" },
          { text: "Recipes", link: "/recipes/" },
        ],
      },
      {
        text: "Catalog recipes",
        collapsed: false,
        items: recipeSidebarItems(),
      },
    ],
    socialLinks: [
      {
        icon: "github",
        link: "https://github.com/AntonioCoppe/jev-harness",
      },
    ],
    search: { provider: "local" },
    outline: { level: [2, 3] },
  },
});
