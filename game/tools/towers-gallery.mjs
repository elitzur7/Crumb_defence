// Close-up gallery of every tower (levels 1-3), laser close-up, fan aimed at the board centre from 8 spots, cookie faces, props and status FX
// -> /workspace/ant-td/screens/v0.4.1/towers-gallery.png
import puppeteer from 'puppeteer-core';
import { writeFileSync, mkdirSync } from 'node:fs';
import { serve } from './serve.mjs';
mkdirSync('/workspace/ant-td/screens/v0.4.1', { recursive: true });
const srv = await serve(8769, 'www-test');
const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
const errors = []; page.on('pageerror', (e) => errors.push(e.message));
await page.goto('http://127.0.0.1:8769/index.html');
await page.waitForFunction(() => window.__game && window.__game.A);
const b64 = await page.evaluate(() => {
  const { A, C } = window.__game;
  const W = 1200, H = 2140, cv = document.createElement('canvas'); cv.width = W; cv.height = H; const g = cv.getContext('2d');
  const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#fff3e8'); bg.addColorStop(1, '#fde0d4'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
  A.text(g, 'Crumb Defense v0.4.1 - towers, levels 1/2/3', W / 2, 50, 40, '#ffb3c1');
  const ids = Object.keys(C.TOWERS);
  ids.forEach((id, i) => {
    const col = i % 3, row = Math.floor(i / 3), cx = 200 + col * 400, cy = 180 + row * 250;
    g.save(); A.rr(g, cx - 185, cy - 105, 370, 230, 26); g.fillStyle = 'rgba(255,255,255,0.55)'; g.fill(); g.restore();
    for (let l = 1; l <= 3; l++) {
      const tw = { type: id, lvl: l, aim: -0.5, fireFx: 0, dir: 1, chew: 0, x: 0, y: 0, lx: 0, ly: 40, dirx: 1, diry: 0 };
      g.save(); g.translate(cx - 120 + (l - 1) * 120, cy + 10); g.scale(2.4, 2.4); A.drawTower(g, id, 1.3 + l, tw); g.restore();
    }
    A.text(g, C.TOWERS[id].name, cx, cy + 95, 24, '#fff');
  });
  // fan + marble: true angle toward the board centre (8 sample spots around the centre)
  const y2 = 1210; A.text(g, 'Fan / marble facing the board centre (v0.4: no direction arrows in the game)', 600, y2 - 80, 22, '#7a5a6a', 'center', null);
  for (let k = 0; k < 8; k++) { const a = Math.PI / 2 + k * Math.PI / 4; const ax = -Math.cos(a), ay = -Math.sin(a) * -1; const v = { ax: Math.cos(k * Math.PI / 4 + Math.PI / 8), ay: Math.sin(k * Math.PI / 4 + Math.PI / 8) };
    g.save(); g.translate(80 + k * 148, y2 + 10); g.scale(2.2, 2.2); A.drawTower(g, k % 2 ? 'ball' : 'fan', 2 + k * 0.3, { type: k % 2 ? 'ball' : 'fan', lvl: 1, fireFx: 0, aim: 0, x: 0, y: 0, lx: v.ax * 30, ly: v.ay * 30, ax: v.ax, ay: v.ay }); g.restore(); }
  // laser close-up (redesign) idle / firing
  const yL = 1440; A.text(g, 'Laser turret (v0.3 redesign) - idle / charging / firing', 600, yL - 95, 22, '#7a5a6a', 'center', null);
  [[0, -0.5], [0, 0.6], [0.3, 2.6]].forEach(([fx, aim], i) => { g.save(); g.translate(330 + i * 270, yL + 10); g.scale(4, 4); A.drawTower(g, 'laser', 1.1 + i * 0.55, { type: 'laser', lvl: 1 + i, aim, fireFx: fx, x: 0, y: 0 }); g.restore(); });
  // cookie faces
  const yC = 1720; A.text(g, 'Cookie moods by food left (+ "ouch" on a bite)', 600, yC - 90, 22, '#7a5a6a', 'center', null);
  const faces = C.UI.cookieFaces.map((f) => [f.face, Math.max(0.01, f.min + 0.02)]).concat([['ouch', 0.6]]);
  faces.forEach(([f, pct], i) => { const x = 70 + i * 117; g.save(); g.translate(x, yC); g.scale(1.75, 1.75); A.drawCookie(g, 0, 0, pct, 0.6 + i * 0.37, { face: f }); g.restore(); A.text(g, f, x, yC + 66, 16, '#7a5a6a', 'center', null); });
  A.text(g, 'Kitchen props', 300, 1880, 22, '#7a5a6a', 'center', null);
  ['mug', 'sugar', 'jam', 'spoon', 'plant'].forEach((k, i) => { g.save(); g.translate(60 + i * 120, 1960); g.scale(2, 2); A.drawProp(g, k, 0, 0); g.restore(); });
  // status FX row
  const y3 = 1960; A.text(g, 'Status: stagger / charm / marble', 930, 1880, 22, '#7a5a6a', 'center', null);
  g.save(); g.translate(760, y3 + 30); g.scale(2.2, 2.2); A.drawAnt(g, 'worker', 0); A.stunStars(g, 0, -30, 1.2); g.restore();
  g.save(); g.translate(940, y3 + 30); g.scale(2.2, 2.2); A.drawAnt(g, 'small', 0.3); A.heart(g, 0, -28, 3, '#ff8fbf'); g.restore();
  g.save(); g.translate(1110, y3 + 30); g.scale(2.2, 2.2); A.marble(g, 0, -8, 12, 0.6); g.restore();
  // icons
  g.save(); g.translate(1150, 60); A.diamondIcon(g, 0, 0, 3); g.restore(); g.save(); g.translate(60, 60); A.giftIcon(g, 0, 0, 2.6); g.restore();
  return cv.toDataURL('image/png').split(',')[1];
});
writeFileSync('/workspace/ant-td/screens/v0.4.1/towers-gallery.png', Buffer.from(b64, 'base64'));
await browser.close(); srv.close();
console.log('saved /workspace/ant-td/screens/v0.4.1/towers-gallery.png', errors.length ? errors : 'no errors');
