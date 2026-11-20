// Aspect screenshots of a battle, plus a gait contact strip.
import puppeteer from 'puppeteer-core';
import { serve } from '../serve.mjs';
import fs from 'node:fs';
const dir = '/workspace/qa/v0.8.6';
fs.mkdirSync(dir, { recursive: true });
const srv = await serve(8793, 'www-test');
const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
const aspects = [['16x9', 360, 640], ['18x9', 360, 720], ['19.5x9', 360, 780], ['20x9', 360, 800], ['21x9', 360, 840]];
for (const [name, w, h] of aspects) {
  const page = await browser.newPage();
  await page.setViewport({ width: w, height: h, deviceScaleFactor: 1 });
  await page.goto('http://127.0.0.1:8793/index.html');
  await page.waitForFunction(() => window.__game && window.__game.startBattle);
  await page.evaluate(() => {
    const g = window.__game;
    g.startBattle(0, ['slingshot', 'spray', 'laser', 'fan', 'ball'], []);
    g.S.paused = true;
  });
  await page.screenshot({ path: `${dir}/layout-${name}.png` });
  await page.close();
}
const page = await browser.newPage();
await page.setViewport({ width: 800, height: 240, deviceScaleFactor: 1 });
await page.goto('http://127.0.0.1:8793/index.html');
await page.waitForFunction(() => window.__game);
const png = await page.evaluate(() => {
  const g = window.__game, A = g.A;
  const cv = document.createElement('canvas'); cv.width = 800; cv.height = 220;
  const ctx = cv.getContext('2d'); ctx.fillStyle = '#e8d4c4'; ctx.fillRect(0, 0, 800, 220);
  const types = ['worker', 'flyer', 'sugarcube', 'queen'];
  types.forEach((t, row) => {
    for (let i = 0; i < 6; i++) {
      ctx.save(); ctx.translate(70 + i * 120, 40 + row * 50); ctx.scale(1.1, 1.1);
      A.drawAnt(ctx, t, i / 6, { play: true });
      ctx.restore();
    }
  });
  return cv.toDataURL('image/png');
});
fs.writeFileSync(`${dir}/gait-sheet.png`, Buffer.from(png.split(',')[1], 'base64'));
await browser.close(); srv.close();
console.log('shots ok');
