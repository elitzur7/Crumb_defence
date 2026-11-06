// Before (ink, full size) vs after (play scale 0.62, no ink) on a trail-colored ground.
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import { serve } from '../serve.mjs';

const port = 8791;
const srv = await serve(port, 'www-test');
const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.goto(`http://127.0.0.1:${port}/index.html`);
await page.waitForFunction(() => window.__game && window.__game.A);
const url = await page.evaluate(() => {
  const { A, C } = window.__game;
  const types = ['small', 'worker', 'flyer', 'armored', 'drone', 'queen6'];
  const cv = document.createElement('canvas'); cv.width = 980; cv.height = 520;
  const g = cv.getContext('2d');
  g.fillStyle = '#3d6b4f'; g.fillRect(0, 0, 980, 520);
  g.fillStyle = '#fffaf0'; g.fillRect(40, 70, 900, 70); g.fillRect(40, 280, 900, 70);
  g.fillStyle = '#fff'; g.font = 'bold 22px sans-serif';
  g.fillText('Before  vc28 ink outline, full size', 40, 40);
  g.fillText('After  v0.8.4 play scale 0.62, no ink', 40, 250);
  types.forEach((t, i) => {
    const x = 90 + i * 145;
    g.save(); g.translate(x, 130); A.drawAnt(g, t, 0.2, {}); g.restore();
    g.save(); g.translate(x, 340); A.drawAnt(g, t, 0.2, { play: true }); g.restore();
    g.fillStyle = '#fff'; g.font = '14px sans-serif'; g.textAlign = 'center';
    g.fillText(C.ANTS[t].name, x, 190); g.fillText(C.ANTS[t].name, x, 400);
  });
  g.textAlign = 'left'; g.font = '13px sans-serif';
  g.fillText('Trail band is #fffaf0. Play ants use PLAY_ANT_SCALE ' + A.PLAY_ANT_SCALE + '. Hitboxes are unchanged.', 40, 470);
  return cv.toDataURL('image/png');
});
const buf = Buffer.from(url.split(',')[1], 'base64');
fs.mkdirSync('/workspace/qa/v0.8.4', { recursive: true });
fs.mkdirSync('/opt/cursor/artifacts', { recursive: true });
fs.writeFileSync('/workspace/qa/v0.8.4/ants-before-after.png', buf);
fs.writeFileSync('/opt/cursor/artifacts/ants-before-after.png', buf);
const box = await page.evaluate(() => {
  const { A } = window.__game;
  const measure = (play) => {
    const cv = document.createElement('canvas'); cv.width = 400; cv.height = 400; const g = cv.getContext('2d');
    g.translate(200, 260); A.drawAnt(g, 'worker', 0.15, { play });
    const d = g.getImageData(0, 0, 400, 400).data; let x0 = 400, x1 = 0;
    for (let y = 0; y < 400; y++) for (let x = 0; x < 400; x++) if (d[(y * 400 + x) * 4 + 3] > 200) { if (x < x0) x0 = x; if (x > x1) x1 = x; }
    return x1 - x0;
  };
  return { ink: measure(false), play: measure(true), tile: 40 };
});
fs.writeFileSync('/workspace/qa/v0.8.4/ant-bbox.json', JSON.stringify(box, null, 2));
console.log(JSON.stringify(box));
await browser.close(); srv.close();
