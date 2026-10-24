// Measures each ant type's drawn (opaque) area and bounding box relative to the regular Worker ant, in headless Chrome.
// Used for v0.4.0 item 14/20: sizes = small (~half the regular's area), regular, large (= 2x regular), queen (largest).
import puppeteer from 'puppeteer-core';
import { serve } from './serve.mjs';
const srv = await serve(8779, 'www-test');
const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.goto('http://127.0.0.1:8779/index.html');
await page.waitForFunction(() => window.__game && window.__game.A);
const rows = await page.evaluate(() => {
  const { A, C } = window.__game; const out = {};
  for (const type of Object.keys(C.ANTS)) {
    let area = 0, h = 0, w = 0; const N = 4;
    for (let f = 0; f < N; f++) {
      const cv = document.createElement('canvas'); cv.width = 400; cv.height = 400; const g = cv.getContext('2d');
      g.translate(200, 260); A.drawAnt(g, type, f / N, {});
      const d = g.getImageData(0, 0, 400, 400).data; let n = 0, x0 = 400, x1 = 0, y0 = 400, y1 = 0;
      for (let y = 0; y < 400; y++) for (let x = 0; x < 400; x++) if (d[(y * 400 + x) * 4 + 3] > 200) { n++; if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
      area += n / N; w += (x1 - x0) / N; h += (y1 - y0) / N;
    }
    out[type] = { area: Math.round(area), w: Math.round(w), h: Math.round(h), size: C.ANTS[type].size };
  }
  const base = out.worker.area; for (const k in out) out[k].areaVsRegular = +(out[k].area / base).toFixed(2);
  return out;
});
console.table(rows);
// --png <file>: a line-up picture (v0.3 sizes are not drawable any more; numbers above are the comparison)
const pi = process.argv.indexOf('--png');
if (pi > 0) {
  const url = await page.evaluate(() => {
    const { A, C } = window.__game; const order = ['small', 'worker', 'flyer', 'gasmask', 'armored', 'sprinter', 'big', 'heavy', 'queen'];
    const groups = { small: 'SMALL / fast', worker: 'REGULAR (+ wings, gas mask, helmet, sneakers)', big: 'LARGE (2x regular)', queen: 'QUEEN' };
    const cv = document.createElement('canvas'); cv.width = 1700; cv.height = 760; const g = cv.getContext('2d');
    g.fillStyle = '#fff6ee'; g.fillRect(0, 0, 1700, 760);
    g.fillStyle = '#7a5a6a'; g.font = 'bold 26px sans-serif'; g.textAlign = 'center'; g.fillText('Crumb Defense v0.4.0 - ant sizes (2x zoom)', 850, 40);
    let x = 70;
    for (const t of order) {
      const S = C.ANTS[t].size; const w = 90 + 60 * S;
      g.save(); g.translate(x + w / 2 - 40, 270); g.scale(2, 2); A.drawAnt(g, t, 0.15, {}); g.restore();
      g.fillStyle = '#523c4b'; g.font = 'bold 15px sans-serif'; g.fillText(C.ANTS[t].name || t, x + w / 2 - 40, 360);
      g.fillStyle = '#a08090'; g.font = '13px sans-serif'; g.fillText(`size ${S}`, x + w / 2 - 40, 380);
      if (groups[t]) { g.fillStyle = '#e0607e'; g.font = 'bold 13px sans-serif'; g.textAlign = 'left'; g.fillText(groups[t], x - 30, 80); g.textAlign = 'center'; }
      x += w;
    }
    // close-ups of the late-game knights + the large ant (4x) - walk frames
    g.fillStyle = '#7a5a6a'; g.font = 'bold 20px sans-serif'; g.fillText('Close-ups (4x): Sprint Knight (fast armored), Big Ant (large), Heavy Knight (large armored) - two walk frames each', 850, 440);
    let cx = 150;
    for (const t of ['sprinter', 'big', 'heavy']) for (const f of [0.1, 0.6]) { g.save(); g.translate(cx, 660); g.scale(4, 4); A.drawAnt(g, t, f, {}); g.restore(); cx += 260; }
    return cv.toDataURL('image/png');
  });
  const fs = await import('node:fs'); fs.writeFileSync(process.argv[pi + 1], Buffer.from(url.split(',')[1], 'base64'));
  console.log('wrote', process.argv[pi + 1]);
}
if (process.argv.includes('--json')) console.log(JSON.stringify(rows));
await browser.close(); srv.close();
