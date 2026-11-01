// art sheets for Pass 1: F6 (4 ant sizes at 4x), F9 (marble chute L1/L3/L6), P3 (treat bites F10, antennae F11, nest F12, cheer arm F16). usage: WWW=<root> node shots-art.mjs <outdir>
import { launch } from './harness.mjs'; import fs from 'node:fs';
const OUT = process.argv[2]; fs.mkdirSync(OUT, { recursive: true });
const h = await launch({ viewport: { width: 1200, height: 800, deviceScaleFactor: 1 } });
const draw = (kind) => h.ev((kind) => { const g0 = window.__game, A = g0.A; document.body.innerHTML = ''; const W = 1200, H = 520;
  const cv = document.createElement('canvas'); cv.width = W; cv.height = H; document.body.appendChild(cv); const g = cv.getContext('2d'); g.fillStyle = '#f6e3cf'; g.fillRect(0, 0, W, H);
  const lab = (s, x, y) => { g.fillStyle = '#523c4b'; g.font = 'bold 14px sans-serif'; g.textAlign = 'center'; g.fillText(s, x, y); };
  if (kind === 'F6') { ['small', 'worker', 'big', 'heavy'].forEach((id, i) => { g.save(); g.translate(150 + i * 290, 260); g.scale(4, 4); A.drawAnt(g, id, 0.2, {}); g.restore(); lab(id + ' (4x)', 150 + i * 290, 420); }); }
  if (kind === 'F9') { [1, 3, 6].forEach((l, i) => { const tw = { type: 'ball', lvl: l, aim: -0.5, fireFx: 0, dir: 1, chew: 0, x: 0, y: 0, lx: 0, ly: 40, dirx: 1, diry: 0 }; g.save(); g.translate(200 + i * 400, 300); g.scale(4, 4); A.drawTower(g, 'ball', 1.3 + l, tw); g.restore(); lab('Marble L' + l, 200 + i * 400, 490); }); }
  if (kind === 'P3') {
    ['cookie', 'cake', 'pie', 'sundae'].forEach((k, i) => [1, 0.7, 0.4].forEach((p, j) => { g.save(); g.translate(80 + i * 150, 60 + j * 120); A.drawTreat(g, k, 0, 0, p, 0, { face: 'content' }); g.restore(); }));
    lab('treats: bites at 100% / 70% / 40%', 300, 20);
    g.save(); g.translate(760, 90); g.scale(1.6, 1.6); A.drawNest(g, 0, 0, 0.5); g.restore(); lab('nest', 760, 170);
    g.save(); g.translate(880, 170); g.scale(4, 4); A.drawAnt(g, 'worker', 0.2, { pose: 'cheer' }); g.restore(); lab('hero cheer arm (4x)', 880, 240);
    g.save(); g.translate(1090, 120); g.scale(4, 4); A.drawAnt(g, 'small', 0.2, {}); g.restore(); lab('antennae small (4x)', 1090, 170);
    g.save(); g.translate(1000, 400); g.scale(4, 4); A.drawAnt(g, 'big', 0.2, {}); g.restore(); lab('antennae big (4x)', 1000, 490);
  }
}, kind);
for (const k of ['F6', 'F9', 'P3']) { await draw(k); await h.page.screenshot({ path: `${OUT}/${k}.png`, clip: { x: 0, y: 0, width: 1200, height: 520 } }); console.log(k); }
await h.close();
