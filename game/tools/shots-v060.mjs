// v0.6.0 extra screenshot: tower level shapes L1..L6 (Tractor + Slingshot + Laser) in battle -> /workspace/ant-td/screens/v0.6.0/
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';
import { serve } from './serve.mjs';
const OUT = '/workspace/ant-td/screens/v0.6.0'; mkdirSync(OUT, { recursive: true });
await serve(8787, 'www-test');
const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox', '--disable-gpu'] });
const page = await browser.newPage();
await page.emulate({ viewport: { width: 393, height: 852, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, userAgent: 'Mozilla/5.0 (Linux; Android 14) Mobile' });
const errors = []; page.on('pageerror', (e) => errors.push(e.message));
await page.goto('http://127.0.0.1:8787/index.html'); await page.waitForFunction(() => window.__game);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const G = (fn, a) => page.evaluate(fn, a);
await G(() => { const g = window.__game, s = g.M.newSave(); g.Cal.touch(s, g.now()); g.Cal.claim(s, g.now(), () => 0); for (const id of g.C.ALL_CARDS) g.M.unlockCard(s, id); s.onboard = 'done'; g.setSave(s); g.S.cal = null; g.S.reveal = [];
  g.startBattle(2, ['tractor', 'slingshot', 'laser', 'gate', 'glue'], ['bomb', 'freeze'], 5); });
await sleep(150);
const placed = await G(() => { const g = window.__game, b = g.S.battle; b.addCrumbs(20000); const out = []; const types = ['tractor', 'slingshot', 'laser'];
  const cand = [];
  for (let r = 2; r < 12; r++) for (let c = 0; c < 10; c++) { const t = b.tileInfo(c, r); if (t.valid && !t.onPath && !t.tower && b.trailDirection(c, r)) cand.push([c, r]); }
  const used = new Set();
  for (const [c, r] of cand) { if (out.length >= 6) break; if (used.has((c - 1) + ',' + r) || used.has(c + ',' + (r - 1)) || used.has((c + 1) + ',' + (r - 1)) || used.has((c - 1) + ',' + (r - 1))) continue;
    const type = types[out.length % 3]; const lvl = out.length + 1;
    for (let L = 0; L < lvl; L++) { b.picks[0] = type; b.playCard(0, c, r); }
    const tw = b.towers.at(-1); used.add(c + ',' + r); out.push(type[0] + tw.lvl + '@' + c + ',' + r); }
  g.consumeEvents(); g.S.info = null; b.nextWaveAt = 0; return out; });
console.log('placed', placed.join(' '));
await sleep(3500);
await page.screenshot({ path: `${OUT}/tower-level-shapes-L1-L6-battle.png` });
console.log('errors', errors.length);
await browser.close(); process.exit(0);
