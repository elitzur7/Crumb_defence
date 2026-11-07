// Before (ink) / after (play 0.72, radial) beside a Colony Flow crop.
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import { serve } from '../serve.mjs';
const ref = fs.readFileSync('/tmp/cf-ref-group.png').toString('base64');
const one = fs.readFileSync('/tmp/cf-ref-one.png').toString('base64');
const srv = await serve(8799, 'www-test');
const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.goto('http://127.0.0.1:8799/index.html');
await page.waitForFunction(() => window.__game && window.__game.A);
const url = await page.evaluate(async (refB64, oneB64) => {
  const { A, C } = window.__game;
  const types = ['small', 'worker', 'flyer', 'armored', 'sugarcube', 'queen8'];
  const cv = document.createElement('canvas'); cv.width = 1100; cv.height = 620;
  const g = cv.getContext('2d');
  g.fillStyle = '#3d6b4f'; g.fillRect(0, 0, 1100, 620);
  g.fillStyle = '#fff'; g.font = 'bold 22px sans-serif';
  g.fillText('Before  ink outline, full size', 36, 36);
  g.fillText('After  play scale 0.72, radial segments', 36, 230);
  g.fillStyle = '#fffaf0';
  g.fillRect(28, 52, 1044, 120);
  g.fillRect(28, 248, 700, 160);
  g.fillRect(744, 248, 328, 280);
  types.forEach((t, i) => {
    const x = 110 + i * 170;
    g.save(); g.translate(x, 118); A.drawAnt(g, t, 0.2, {}); g.restore();
    g.fillStyle = '#3d2a24'; g.font = '13px sans-serif'; g.textAlign = 'center';
    g.fillText(C.ANTS[t].name, x, 158);
  });
  types.forEach((t, i) => {
    const x = 86 + i * 112;
    g.save(); g.translate(x, 320); A.drawAnt(g, t, 0.2, { play: true }); g.restore();
    g.fillStyle = '#3d2a24'; g.font = '12px sans-serif'; g.textAlign = 'center';
    g.fillText(C.ANTS[t].name.replace(' Ant', '').replace(' Queen', ''), x, 390);
  });
  const img = new Image(); img.src = 'data:image/png;base64,' + refB64; await img.decode();
  const rw = 300, rh = Math.round(img.height * rw / img.width);
  g.drawImage(img, 758, 290, rw, rh);
  g.fillStyle = '#3d2a24'; g.font = 'bold 15px sans-serif'; g.textAlign = 'center';
  g.fillText('Colony Flow reference', 908, 274);
  g.font = '12px sans-serif'; g.fillText('colonyflow-play-4', 908, 290 + rh + 16);
  g.fillStyle = '#fff'; g.font = '13px sans-serif'; g.textAlign = 'left';
  g.fillText('Play ants use PLAY_ANT_SCALE ' + A.PLAY_ANT_SCALE + '. Book, prep and results keep the ink outline. Hitboxes unchanged.', 36, 560);
  const oneImg = new Image(); oneImg.src = 'data:image/png;base64,' + oneB64; await oneImg.decode();
  return { sheet: cv.toDataURL('image/png'), oneW: oneImg.width, oneH: oneImg.height };
}, ref, one);
const box = await page.evaluate(() => {
  const { A } = window.__game;
  const measure = (play) => {
    const cv = document.createElement('canvas'); cv.width = 400; cv.height = 400; const g = cv.getContext('2d');
    g.translate(200, 260); A.drawAnt(g, 'worker', 0.15, { play });
    const d = g.getImageData(0, 0, 400, 400).data; let x0 = 400, x1 = 0;
    for (let y = 0; y < 400; y++) for (let x = 0; x < 400; x++) if (d[(y * 400 + x) * 4 + 3] > 200) { if (x < x0) x0 = x; if (x > x1) x1 = x; }
    return x1 - x0;
  };
  return { ink: measure(false), play: measure(true), tile: 40, scale: window.__game.A.PLAY_ANT_SCALE };
});
fs.mkdirSync('/workspace/qa/v0.8.5', { recursive: true });
fs.mkdirSync('/opt/cursor/artifacts', { recursive: true });
const buf = Buffer.from(url.sheet.split(',')[1], 'base64');
fs.writeFileSync('/workspace/qa/v0.8.5/ants-vs-cf.png', buf);
fs.writeFileSync('/opt/cursor/artifacts/ants-vs-cf.png', buf);
fs.writeFileSync('/workspace/qa/v0.8.5/ant-bbox.json', JSON.stringify(box, null, 2));
console.log(JSON.stringify(box));
await browser.close(); srv.close();
