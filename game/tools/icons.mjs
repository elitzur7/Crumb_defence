// Renders the launcher icons + splash images procedurally with the game's own art code (headless Chrome).
import puppeteer from 'puppeteer-core';
import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { serve } from './serve.mjs';
const RES = 'android/app/src/main/res';
const pngSize = (p) => { const b = readFileSync(p); return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) }; };
const srv = await serve(8767, 'www-test');
const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
const page = await browser.newPage();
await page.goto('http://127.0.0.1:8767/index.html');
await page.waitForFunction(() => window.__game && window.__game.A);
const render = (kind, w, h) => page.evaluate(({ kind, w, h }) => {
  const A = window.__game.A;
  const cv = document.createElement('canvas'); cv.width = w; cv.height = h; const g = cv.getContext('2d');
  const BG = '#ffe1cf';
  const art = (s) => { // cookie with a worker ant peeking over it, centred at 0,0, ~100 units wide
    g.save(); g.scale(s, s);
    A.drawCookie(g, 0, 8, 0.82, 0.5, false);
    g.save(); g.translate(12, -22); g.scale(1.25, 1.25); A.drawAnt(g, 'worker', 0.1); g.restore();
    g.restore();
  };
  if (kind === 'fg') { g.translate(w / 2, h / 2 + w * 0.06); art(w / 108 * 0.62); }
  else if (kind === 'legacy' || kind === 'round') {
    g.beginPath();
    if (kind === 'round') g.arc(w / 2, h / 2, w / 2 - 1, 0, 7); else A.rr(g, 1, 1, w - 2, h - 2, w * 0.22);
    const gr = g.createLinearGradient(0, 0, 0, h); gr.addColorStop(0, '#fff1e6'); gr.addColorStop(1, '#ffc9b5'); g.fillStyle = gr; g.fill();
    g.translate(w / 2, h / 2 + w * 0.08); art(w / 112);
  } else if (kind === 'splash') {
    g.fillStyle = BG; g.fillRect(0, 0, w, h);
    const s = Math.min(w, h) / 220; g.translate(w / 2, h / 2 - 20 * s); art(s);
    A.text(g, 'Crumb Defense', 0, 0, 1); // warm font cache
    g.setTransform(1, 0, 0, 1, 0, 0); A.text(g, 'Crumb Defense', w / 2, h / 2 + 52 * s, 22 * s, '#ffb3c1');
  }
  return cv.toDataURL('image/png').split(',')[1];
}, { kind, w, h });
const write = async (path, kind) => { const { w, h } = pngSize(path); writeFileSync(path, Buffer.from(await render(kind, w, h), 'base64')); console.log('wrote', path, w + 'x' + h); };
for (const d of readdirSync(RES)) {
  if (d.startsWith('mipmap-') && d !== 'mipmap-anydpi-v26') {
    await write(`${RES}/${d}/ic_launcher.png`, 'legacy');
    await write(`${RES}/${d}/ic_launcher_round.png`, 'round');
    await write(`${RES}/${d}/ic_launcher_foreground.png`, 'fg');
  }
  if (d.startsWith('drawable') && existsSync(`${RES}/${d}/splash.png`)) await write(`${RES}/${d}/splash.png`, 'splash');
}
writeFileSync(`${RES}/values/ic_launcher_background.xml`, '<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <color name="ic_launcher_background">#FFE1CF</color>\n</resources>\n');
// preview
const prev = await render('legacy', 512, 512); writeFileSync('/workspace/ant-td/screens/00-app-icon.png', Buffer.from(prev, 'base64'));
await browser.close(); srv.close();
