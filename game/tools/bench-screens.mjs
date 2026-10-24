// Frame-time benchmark of the card screens (NEW CARD reveal zoom, Cards, Shop, prep) - dev only. Usage: node tools/bench-screens.mjs <www dir> <label>
import puppeteer from 'puppeteer-core';
import { serve } from '/workspace/ant-td/game/tools/serve.mjs';
const [dir, label] = process.argv.slice(2);
const port = 8700 + Math.floor(Math.random() * 90); const srv = await serve(port, dir);
const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox', '--disable-gpu'] });
const page = await browser.newPage();
await page.emulate({ viewport: { width: 393, height: 852, deviceScaleFactor: 3, isMobile: true, hasTouch: true }, userAgent: 'Mozilla/5.0 (Linux; Android 14) Mobile' });
await page.goto(`http://127.0.0.1:${port}/index.html`); await page.waitForFunction(() => window.__game);
const r = await page.evaluate(async () => { const g = window.__game, s = g.M.newSave(); s.onboard = 'done'; g.Cal.touch(s, g.now()); g.Cal.claim(s, g.now(), () => 0); for (const id of g.C.ALL_CARDS) g.M.unlockCard(s, id); g.setSave(s); g.S.cal = null; g.S.reveal = []; g.go('cards');
  for (let i = 0; i < 30; i++) g.renderOnce();
  const out = {};
  for (const [name, setup] of [['reveal', () => g.queueReveal('laser', 3, true, g.S.t)], ['cards', () => {}], ['shop', () => g.go('shop')], ['prep', () => g.openPrep(1)]]) {
    g.S.reveal = []; if (name !== 'reveal') g.go('cards'); setup(); const ts = [];
    for (let i = 0; i < 90; i++) { const t0 = performance.now(); g.renderOnce(); ts.push(performance.now() - t0); }
    const so = ts.slice().sort((a, b) => a - b); out[name] = { first: +ts[0].toFixed(1), max: +so.at(-1).toFixed(1), med: +so[45].toFixed(2), total: +ts.reduce((a, b) => a + b, 0).toFixed(0) };
  }
  out.cache = g.spriteCache(); return out; });
console.log(label, JSON.stringify(r));
await browser.close(); srv.close(); process.exit(0);
