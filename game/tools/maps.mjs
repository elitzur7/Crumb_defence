// Validates every map in src/maps.js and renders a preview PNG of each to /workspace/ant-td/screens/v0.4.1/maps/.
// Usage: npm run maps   (exit code 1 if any map has errors)
import { MAPS, validateMap, parseMap } from '../src/maps.js';
import puppeteer from 'puppeteer-core';
import { writeFileSync, mkdirSync } from 'node:fs';
import { serve } from './serve.mjs';
let bad = 0;
for (const [id, m] of Object.entries(MAPS)) {
  const errs = validateMap(id, m); const p = parseMap(m);
  console.log(`${errs.length ? 'FAIL' : 'ok  '} ${id.padEnd(8)} "${m.name}"  routes=${p.routes.length} props=${p.props.length}${errs.length ? '  ' + errs.join('; ') : ''}`);
  if (errs.length) bad++;
}
const OUT = '/workspace/ant-td/screens/v0.4.1/maps'; mkdirSync(OUT, { recursive: true });
const srv = await serve(8773, 'www-test');
const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.goto('http://127.0.0.1:8773/index.html'); await page.waitForFunction(() => window.__game && window.__game.A);
for (const id of Object.keys(MAPS)) {
  const b64 = (await page.evaluate((id) => window.__game.mapPreview(id), id)).split(',')[1];
  writeFileSync(`${OUT}/${id}.png`, Buffer.from(b64, 'base64'));
}
await browser.close(); srv.close();
console.log(`previews -> ${OUT}`);
process.exit(bad ? 1 : 0);
