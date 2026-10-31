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
const res = await page.evaluate((li) => { const g = window.__game; g.S.cal = null; g.S.save.onboard.cardsHint = 'done'; g.go('map'); g.startBattle(+li, ['slingshot', 'laser', 'spray', 'fan', 'glue'], ['bomb', 'freeze'], 3); g.S.paused = false; g.setAutoBot(false);
  const b = g.S.battle; b.crumbs = 600; g.simulate(40, true); for (let i = 0; i < 60; i++) g.renderOnce(1/60);
  const P = CanvasRenderingContext2D.prototype, by = {}; for (const k of ['createRadialGradient', 'createLinearGradient', 'clip', 'strokeText']) { const o = P[k]; P[k] = function (...a) { const st = k.slice(6, 9) + ':' + new Error().stack.split('\n').slice(2, 5).map((l) => l.trim().split(' ')[1]).join('<'); by[st] = (by[st] || 0) + 1; return o.apply(this, a); }; }
  for (let i = 0; i < 10; i++) g.renderOnce(1/60); for (const k in by) by[k] /= 10; return by; }, level);
console.log(JSON.stringify(res, null, 0).replace(/,"/g, '\n"'));
await browser.close(); process.exit(0);
