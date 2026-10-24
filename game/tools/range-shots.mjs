// v0.4.1: range-circle screenshots per tower + raw "without circle" frames for pixel measurement (tools/range-measure.py).
// Output: /workspace/ant-td/screens/v0.4.1/ranges/  (npm run ranges)
import puppeteer from 'puppeteer-core';
import { mkdirSync, writeFileSync } from 'node:fs';
import { serve } from './serve.mjs';
const OUT = '/workspace/ant-td/screens/v0.4.1/ranges'; mkdirSync(`${OUT}/raw`, { recursive: true });
const srv = await serve(8785, 'www-test');
const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox', '--disable-gpu'] });
const page = await browser.newPage();
const DPR = 2.75;
await page.emulate({ viewport: { width: 393, height: 852, deviceScaleFactor: DPR, isMobile: true, hasTouch: true }, userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Mobile Safari/537.36' });
const errors = []; page.on('pageerror', (e) => errors.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto('http://127.0.0.1:8785/index.html', { waitUntil: 'load' });
await page.waitForFunction(() => window.__game);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const G = (fn, arg) => page.evaluate(fn, arg);
const TYPES = ['slingshot', 'spray', 'sound', 'fan', 'lizard', 'laser', 'zapper', 'glue', 'pheromone', 'gate', 'lava'];
const meta = { dpr: DPR, towers: [] };
for (const type of TYPES) {
  const info = await G((type) => {
    const g = window.__game; g.S.cal = null; const s = g.M.newSave(); for (const id of Object.keys(g.C.TOWERS)) g.M.unlockCard(s, id); g.Cal.touch(s, g.now()); g.setSave(s);
    g.openPrep(0); g.startBattle(0, ['slingshot', 'spray', 'sound', 'fan', 'glue'], ['bomb', 'freeze'], 1);
    const b = g.S.battle; b.nextWaveAt = b.t + 60; g.S.paused = false;
    const T = g.C.TOWERS[type];
    // the side tile nearest the top-middle of the board that touches the trail (side towers), or the top-most trail tile near x=200 (path)
    let best = null;
    for (let r = 1; r < 7; r++) for (let c = 2; c < 8; c++) {
      const onPath = b.isPathTile(c, r);
      if (T.place === 'path' ? !onPath : onPath) continue;
      if (T.place !== 'path') { let near = false; for (const [dc, dr] of [[0, 1], [1, 0], [0, -1], [-1, 0]]) if (b.isPathTile(c + dc, r + dr)) near = true; if (!near) continue; }
      const score = Math.abs(c - 4.5) + r * 0.7; if (!best || score < best.score) best = { c, r, score };
    }
    const tw = b.addTower(type, best.c, best.r);
    g.S.info = null;
    const x = T.place === 'path' ? tw.px : tw.x, y = T.place === 'path' ? tw.py : tw.y;
    return { type, c: best.c, r: best.r, x, y, rangePx: tw.stat('range'), tile: g.C.TILE };
  }, type);
  // canvas transform: logical (0,0) and scale from the canvas element itself
  const tf = await G(() => { const cv = document.querySelector('canvas'); const r = cv.getBoundingClientRect(); const s = Math.min(r.width / 400, r.height / 720); return { left: r.left + (r.width - 400 * s) / 2, top: r.top + (r.height - 720 * s) / 2, s }; });
  await sleep(250);
  await page.screenshot({ path: `${OUT}/raw/${type}-off.png` });
  await G(() => { const g = window.__game; g.S.info = { tower: g.S.battle.towers[0], t: 0 }; });
  await sleep(350);
  await page.screenshot({ path: `${OUT}/raw/${type}-on.png` });
  await page.screenshot({ path: `${OUT}/range-${type}.png` });
  meta.towers.push({ ...info, tf, mapY: 68 });
  console.log(type, 'tile', info.c, info.r, 'range', info.rangePx, 'px');
}
// the real map cell: with a card selected the game tints every tile you can place it on (one rounded box per cell, art inset 4 px)
await G(() => { const g = window.__game; g.S.info = null; const b = g.S.battle; b.towers.length = 0; b.addCrumbs(500); g.S.sel = null; });
await sleep(300); await page.screenshot({ path: `${OUT}/raw/cells-off.png` });
await G(() => { const g = window.__game; g.S.sel = { kind: 'card', i: g.S.battle.picks.findIndex((id) => g.C.TOWERS[id].place === 'side') }; });
await sleep(300); await page.screenshot({ path: `${OUT}/raw/cells-on.png` }); await page.screenshot({ path: `${OUT}/cells-placement-highlights.png` });
meta.cellsTf = await G(() => { const cv = document.querySelector('canvas'); const r = cv.getBoundingClientRect(); const s = Math.min(r.width / 400, r.height / 720); return { left: r.left + (r.width - 400 * s) / 2, top: r.top + (r.height - 720 * s) / 2, s }; });
writeFileSync(`${OUT}/raw/meta.json`, JSON.stringify(meta, null, 1));
console.log(errors.length ? errors : 'no errors');
await browser.close(); srv.close();
