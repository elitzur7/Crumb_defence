// Renders a large close-up "ant gallery" of all ant types (walk frames) to /workspace/ant-td/screens/v0.4.1/ants-gallery.png
import puppeteer from 'puppeteer-core';
import { writeFileSync } from 'node:fs';
import { serve } from './serve.mjs';
const srv = await serve(8768, 'www-test');
const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(e.message));
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto('http://127.0.0.1:8768/index.html');
await page.waitForFunction(() => window.__game && window.__game.A);
const b64 = await page.evaluate(() => {
  const { A, C } = window.__game;
  const W = 1200, H = 1500, cv = document.createElement('canvas'); cv.width = W; cv.height = H; const g = cv.getContext('2d');
  const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#fff3e8'); bg.addColorStop(1, '#fde0d4'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
  A.text(g, 'Crumb Defense - the ants', W / 2, 60, 48, '#ffb3c1');
  const types = ['small', 'worker', 'big', 'gasmask', 'armored', 'flyer', 'queen'];
  types.forEach((t, i) => {
    const big = t === 'queen';
    const col = big ? 0 : i % 2, row = big ? 3 : Math.floor(i / 2);
    const cx = big ? W / 2 : 300 + col * 600, cy = 250 + row * 330;
    g.save(); A.rr(g, cx - 270, cy - 140, 540, 300, 30); g.fillStyle = 'rgba(255,255,255,0.55)'; g.fill(); g.restore();
    g.save(); g.translate(cx - 70, cy + 40); const sc = (big ? 6.8 : 4.6) / C.ANTS[t].size; g.scale(sc, sc); A.drawAnt(g, t, 0.15); g.restore();
    // small walk-cycle strip at phone scale (x1.3) to check readability
    for (let f = 0; f < 4; f++) { g.save(); const z = C.ANTS[t].size; g.translate(cx + (big ? 160 : 140) + (f % 2) * 60 * Math.max(1, z * 0.9), cy - 60 + Math.floor(f / 2) * 70 * Math.max(1, z * 0.75)); g.scale(1.3, 1.3); A.drawAnt(g, t, f / 4, { carrying: f === 3 }); g.restore(); }
    A.text(g, C.ANTS[t].name, cx - 60, cy + 128, 30, '#fff');
  });
  return cv.toDataURL('image/png').split(',')[1];
});
writeFileSync('/workspace/ant-td/screens/v0.4.1/ants-gallery.png', Buffer.from(b64, 'base64'));
await browser.close(); srv.close();
console.log('saved /workspace/ant-td/screens/v0.4.1/ants-gallery.png', errors.length ? errors : 'no errors');
