import puppeteer from 'puppeteer-core';
import { serve } from './serve.mjs';
const [dir, port, level = '16'] = process.argv.slice(2);
await serve(+port, dir);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.emulate({ viewport: { width: 393, height: 852, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, userAgent: 'Mozilla/5.0 (Linux; Android 14) Mobile' });
await page.evaluateOnNewDocument(() => { try { localStorage.clear(); } catch (e) {} });
await page.goto(`http://127.0.0.1:${port}/index.html`); await page.waitForFunction(() => window.__game); await sleep(800);
const res0 = await page.evaluate((li) => { const g = window.__game; g.S.cal = null; g.S.save.onboard.cardsHint = 'done'; g.go('map'); g.startBattle(+li, ['slingshot', 'laser', 'spray', 'fan', 'glue'], ['bomb', 'freeze'], 3); g.S.paused = false; g.setAutoBot(false);
  const b = g.S.battle; b.crumbs = 600; g.simulate(40, true);
  const cv = document.querySelector('canvas'), cx = cv.getContext('2d'); const P = CanvasRenderingContext2D.prototype;
  const run = () => { const T = []; for (let i = 0; i < 60; i++) g.renderOnce(1/60); for (let i = 0; i < 240; i++) { const s = performance.now(); g.renderOnce(1/60); g.battleFrame(1/60); cx.getImageData(0, 0, 1, 1); T.push(performance.now() - s); } T.sort((a, b) => a - b); return +(T.reduce((a, b) => a + b, 0) / T.length).toFixed(2) + ' med ' + T[120].toFixed(2); };
  const out = { base: run() };
  const cnt = {}; for (const k of ['fillText', 'strokeText', 'drawImage', 'createRadialGradient', 'createLinearGradient', 'fill', 'stroke', 'save', 'clip', 'fillRect']) { const o = P[k]; P[k] = function (...a) { cnt[k] = (cnt[k] || 0) + 1; return o.apply(this, a); }; } 
  g.renderOnce(1/60); for (const k in cnt) cnt[k] = 0; for (let i = 0; i < 10; i++) g.renderOnce(1/60); for (const k in cnt) cnt[k] /= 10; out.perFrame = cnt;
  for (const k of ['fillText', 'strokeText', 'drawImage', 'createRadialGradient', 'createLinearGradient', 'fill', 'stroke', 'clip']) { }
  return out; }, level);

const variants = ['drawAntObj', 'drawTowerObj', 'drawCard', 'bakedBox', 'drawBackdrop', 'none'];
for (const v of variants) {
  const r = await page.evaluate((v) => { const g = window.__game, cv = document.querySelector('canvas'), cx = cv.getContext('2d'); const P = CanvasRenderingContext2D.prototype; const o = P.drawImage; P.drawImage = function (...a) { if (v !== 'none' && new Error().stack.includes(v)) return; return o.apply(this, a); };
    const T = []; for (let i = 0; i < 60; i++) g.renderOnce(1/60); for (let i = 0; i < 300; i++) { const s = performance.now(); g.renderOnce(1/60); g.battleFrame(1/60); cx.getImageData(0, 0, 1, 1); T.push(performance.now() - s); } P.drawImage = o; T.sort((a, b) => a - b); return T[150].toFixed(2); }, v);
  console.log('skip-' + v, r);
}
await browser.close(); process.exit(0);
