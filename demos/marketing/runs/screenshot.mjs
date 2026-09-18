import { chromium } from "playwright";
import { mkdirSync } from "fs";
import { join } from "path";

const BASE = process.env.BASE || "http://127.0.0.1:8765";
const OUT = process.env.OUT || "/workspace/jev-harness/docs/assets/marketing";
mkdirSync(OUT, { recursive: true });

const shots = [
  ["card-tool-retain.png", "/cards/tool-retain.html", 1100, 980, 400],
  ["card-model-router.png", "/cards/model-router.html", 1100, 980, 400],
  ["card-ship-gate.png", "/cards/ship-gate.html", 1100, 980, 400],
  ["card-alert-fp.png", "/cards/alert-fp.html", 1100, 980, 400],
  ["card-row-filter.png", "/cards/row-filter.html", 1100, 980, 400],
  ["card-ui-action.png", "/cards/ui-action.html", 1100, 980, 400],
  ["alert-gate.png", "/alert-gate.html", 1400, 900, 900],
  ["row-filter.png", "/row-filter.html", 1400, 1000, 700],
  ["ui-click.png", "/ui-click.html", 1400, 900, 1200],
  ["savings.png", "/savings.html", 1400, 1100, 300],
  ["gallery.png", "/index.html", 1400, 1200, 300],
];

const browser = await chromium.launch({ headless: true });
for (const [name, path, w, h, wait] of shots) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto(BASE + path, { waitUntil: "networkidle" });
  await page.waitForTimeout(wait);
  // Prefer proof ready
  await page.waitForFunction(() => {
    const wall = document.getElementById("wall");
    if (wall && wall.textContent && wall.textContent !== "—") return true;
    if (window.__DEMO_PROOF__ || window.__ROW_PROOF__ || window.__ALERT_PROOF__ || window.__UI_PROOF__) return true;
    return document.readyState === "complete";
  }, { timeout: 5000 }).catch(() => {});
  const file = join(OUT, name);
  await page.screenshot({ path: file, fullPage: false });
  console.log("OK", name);
  await page.close();
}
await browser.close();
