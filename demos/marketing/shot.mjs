import { chromium } from 'playwright-core';
import fs from 'fs';
import path from 'path';

const OUT = path.resolve('docs/assets/marketing');
const PROOF = path.join(OUT, 'proof');
fs.mkdirSync(PROOF, { recursive: true });
const BASE = 'http://127.0.0.1:8765';

const shots = [
  ['card-tool-retain.png', `${BASE}/cards/tool-retain.html`, 1100, 920],
  ['card-model-router.png', `${BASE}/cards/model-router.html`, 1100, 920],
  ['card-ship-gate.png', `${BASE}/cards/ship-gate.html`, 1100, 920],
  ['card-alert-fp.png', `${BASE}/cards/alert-fp.html`, 1100, 920],
  ['card-row-filter.png', `${BASE}/cards/row-filter.html`, 1100, 920],
  ['card-ui-action.png', `${BASE}/cards/ui-action.html`, 1100, 920],
  ['savings.png', `${BASE}/savings.html`, 1400, 1200],
  ['our-eval-proof.png', `${BASE}/our-eval-proof.html`, 1100, 900],
  ['alert-gate.png', `${BASE}/alert-gate.html`, 1400, 900],
  ['row-filter.png', `${BASE}/row-filter.html`, 1400, 900],
  ['ui-click.png', `${BASE}/ui-click.html`, 1400, 900],
];

const browser = await chromium.launch({
  executablePath: '/usr/bin/google-chrome',
  headless: true,
  args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
});

for (const [name, url, w, h] of shots) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForTimeout(800);
  const dest = path.join(OUT, name);
  await page.screenshot({ path: dest, type: 'png' });
  if (name.startsWith('card-') || name === 'our-eval-proof.png' || name === 'savings.png') {
    fs.copyFileSync(dest, path.join(PROOF, name));
  }
  console.log('OK', name, fs.statSync(dest).size);
  await page.close();
}
await browser.close();
console.log('done');
