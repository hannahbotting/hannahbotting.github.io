import { chromium } from 'playwright-core';
import { readdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const ROOT = join(import.meta.dirname, '..', '..');
const MODELS = join(ROOT, 'public', 'models');
const DEV = process.env.THUMBGEN_URL ?? 'http://localhost:5173/scripts/thumbgen/';

const only = new Set(process.argv.slice(2));

const browser = await chromium.launch({
  executablePath: process.env.CHROME_BIN,
  headless: true,
  args: ['--no-sandbox', '--disable-gpu', '--use-gl=swiftshader', '--enable-unsafe-swiftshader'],
});

const ensurePage = async () => {
  const page = await browser.newPage();
  await page.goto(DEV, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => window.__renderModel, { timeout: 15000 });
  return page;
};

let page = await ensurePage();

const folders = readdirSync(MODELS, { withFileTypes: true })
  .filter((d) => d.isDirectory())
  .map((d) => d.name)
  .sort();

let done = 0;
const failures = [];
for (const base of folders) {
  if (only.size && !only.has(base)) continue;

  const folder = join(MODELS, base);
  const glb = readdirSync(folder).find((f) => f.endsWith('.glb'));
  if (!glb) continue;

  let ok = false;
  for (let attempt = 0; attempt < 3 && !ok; attempt++) {
    try {
      const dataUrl = await page.evaluate(
        (u) => window.__renderModel(u),
        `/models/${base}/${glb}`
      );
      writeFileSync(join(folder, `${base}.png`), Buffer.from(dataUrl.split(',')[1], 'base64'));
      done += 1;
      ok = true;
    } catch {
      try { await page.close(); } catch {}
      page = await ensurePage();
    }
  }
  if (!ok) failures.push(base);

  if ((done + failures.length) % 20 === 0) {
    console.log(`progress: ${done + failures.length}/${folders.length}`);
  }
}

console.log(`done: ${done} thumbs, ${failures.length} failures`);
if (failures.length) console.log('FAIL', failures.join(', '));
await page.close();
await browser.close();
