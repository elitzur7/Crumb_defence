// L38 at label 4x for 40 s of 60 Hz frames. Reports p95 of sim+render work.
import puppeteer from 'puppeteer-core';
import { serve } from '../serve.mjs';
import fs from 'node:fs';
const srv = await serve(8792, 'www-test');
const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.setViewport({ width: 393, height: 852, deviceScaleFactor: 2 });
await page.goto('http://127.0.0.1:8792/index.html');
await page.waitForFunction(() => window.__game && window.__game.startBattle);
const out = await page.evaluate(async () => {
  const g = window.__game;
  const save = g.M.newSave();
  for (let i = 0; i < save.levels.length; i++) save.levels[i] = { cleared: i < 37, stars: i < 37 ? 1 : 0 };
  for (const id of ['slingshot', 'spray', 'laser', 'zapper', 'fan', 'sound', 'ball']) if (save.cards[id]) save.cards[id].level = 4;
  g.setSave(save);
  g.startBattle(37, ['slingshot', 'spray', 'laser', 'zapper', 'fan'], []);
  g.S.speed = 4; g.setAutoBot(true);
  const times = [];
  const frames = 40 * 60;
  for (let i = 0; i < frames && g.S.battle && !g.S.battle.result; i++) {
    const a = performance.now();
    g.battleFrame(1 / 60);
    g.renderOnce(0);
    times.push(performance.now() - a);
  }
  times.sort((a, b) => a - b);
  const p = (q) => times[Math.min(times.length - 1, Math.floor(times.length * q))];
  const over = times.filter((t) => t > 22).length;
  return { n: times.length, p50: +p(0.5).toFixed(2), p90: +p(0.9).toFixed(2), p95: +p(0.95).toFixed(2), p99: +p(0.99).toFixed(2), max: +times[times.length - 1].toFixed(2), over22: over, caps: window.__caps ? window.__caps() : {} };
});
fs.mkdirSync('/workspace/qa/v0.8.4', { recursive: true });
fs.writeFileSync('/workspace/qa/v0.8.4/r3b-raw.json', JSON.stringify(out, null, 2));
console.log(JSON.stringify(out));
await browser.close(); srv.close();
