// v0.7.5 perf gate: median frame time (render, and sim step + render) in headless Chrome, old build vs new build on the same box with the same scenario.
// usage: node tools/perf-v075.mjs <dirOld> <dirNew> [rounds]   (each dir contains game/www-test, e.g. /workspace/ant-td/qa/v0.7.5/base and /workspace/ant-td)
import puppeteer from 'puppeteer-core';
import { serve } from './serve.mjs';
import path from 'node:path';
const [dirOld, dirNew, rounds = '5'] = process.argv.slice(2);
const baseDir = new URL('../', import.meta.url).pathname, rel = (d) => path.relative(baseDir, path.join(d, 'game/www-test'));
await serve(8921, rel(dirOld)); await serve(8922, rel(dirNew));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
const LV = [[5, 'L6'], [16, 'L17'], [9, 'L10'], [3, 'L4']];
async function run(port) {
  const page = await browser.newPage();
  await page.emulate({ viewport: { width: 393, height: 852, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, userAgent: 'Mozilla/5.0 (Linux; Android 14) Mobile' });
  await page.evaluateOnNewDocument(() => { try { localStorage.clear(); } catch (e) {} });
  await page.goto(`http://127.0.0.1:${port}/index.html`); await page.waitForFunction(() => window.__game); await sleep(500);
  await page.evaluate(() => { const g = window.__game; g.S.cal = null; g.S.save.onboard.cardsHint = 'done'; });
  const out = {};
  for (const [li, name] of LV) {
    await page.evaluate((li) => { const g = window.__game; g.go('map'); g.startBattle(li, ['slingshot', 'laser', 'spray', 'fan', 'glue'], ['bomb', 'freeze'], 3); g.S.paused = false; g.setAutoBot(false);
      const b = g.S.battle; b.crumbs = 600; const want = ['slingshot', 'laser', 'spray', 'slingshot', 'fan', 'laser', 'slingshot']; const used = []; const cand = [];
      for (let r = 0; r < 12; r++) for (let c = 0; c < 10; c++) { const ti = b.tileInfo(c, r); if (ti.valid && !ti.onPath && !ti.tower && b.touchesTrail(c, r) && r > 0) cand.push([c, r]); }
      let pick = cand[Math.floor(cand.length / 2)]; used.push(pick);
      while (used.length < want.length) { let best = null, bd = -1; for (const q of cand) { const d = Math.min(...used.map((u) => Math.hypot(u[0] - q[0], u[1] - q[1]))); if (d > bd) { bd = d; best = q; } } used.push(best); }
      used.forEach((q, i) => { const t = b.addTower(want[i], q[0], q[1]); t.lvl = i % 3 === 0 ? 3 : (i % 3 === 1 ? 2 : 1); }); }, li);
    await sleep(200); await page.evaluate(() => window.__game.simulate(40, true)); await sleep(300);
    out[name] = await page.evaluate(() => { const g = window.__game; const R = [], F = [];
      for (let i = 0; i < 60; i++) g.renderOnce(1 / 60); // warm up caches / JIT
      for (let i = 0; i < 360; i++) { const s0 = performance.now(); g.renderOnce(1 / 60); const s1 = performance.now(); R.push(s1 - s0); g.battleFrame(1 / 60); F.push(performance.now() - s0); }
      const q = (a, p) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length * p)]; }; return { rMed: q(R, 0.5), rP95: q(R, 0.95), fMed: q(F, 0.5), fP95: q(F, 0.95) }; });
  }
  await page.close(); return out;
}
const acc = { old: {}, new: {} };
for (let r = 0; r < +rounds; r++) for (const [k, port] of [['old', 8921], ['new', 8922]]) { const o = await run(port); for (const [n, v] of Object.entries(o)) (acc[k][n] ||= []).push(v); }
const med = (a) => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
const rows = []; let allOld = [], allNew = [];
for (const [, n] of LV) {
  const f = (k, key) => med(acc[k][n].map((v) => v[key]));
  rows.push({ level: n, render_ms: { old: +f('old', 'rMed').toFixed(3), new: +f('new', 'rMed').toFixed(3) }, frame_ms: { old: +f('old', 'fMed').toFixed(3), new: +f('new', 'fMed').toFixed(3) }, frame_p95_ms: { old: +f('old', 'fP95').toFixed(3), new: +f('new', 'fP95').toFixed(3) } });
  allOld.push(f('old', 'fMed')); allNew.push(f('new', 'fMed'));
}
const delta = med(allNew) - med(allOld);
console.log(JSON.stringify({ rounds: +rounds, rows, medianFrameOld: +med(allOld).toFixed(3), medianFrameNew: +med(allNew).toFixed(3), deltaMs: +delta.toFixed(3), gate: delta <= 1 ? 'PASS (<= +1 ms)' : 'FAIL' }, null, 1));
await browser.close(); process.exit(0);
