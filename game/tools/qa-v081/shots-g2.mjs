// G2: 13 towers x L1/L3/L6 on wood + mint, before (?art81=0) / after; 24 px greyscale crop; clipping + overlap stats. usage: node shots-g2.mjs <outdir>
import { launch, sleep } from './harness.mjs'; import fs from 'node:fs';
const OUT = process.argv[2]; fs.mkdirSync(OUT, { recursive: true });
const res = {};
for (const [tag, query] of [['after', ''], ['before', '?art81=0']]) {
  const h = await launch({ viewport: { width: 1400, height: 900, deviceScaleFactor: 1 }, query }); const { ev } = h;
  const out = await ev(() => { const g = window.__game, A = g.A, C = g.C; const types = Object.keys(C.TOWERS); const S = 2.4;
    const mk = (themeI, grey, scale) => { const cell = 44 * scale, W = types.length * cell + 10, H = 3 * cell * 1.5 + 10; const cv = document.createElement('canvas'); cv.width = Math.ceil(W); cv.height = Math.ceil(H); const c = cv.getContext('2d');
      const th = A.THEMES[themeI]; c.fillStyle = th.a; c.fillRect(0, 0, W, H); if (grey) c.filter = 'none';
      [1, 3, 6].forEach((lvl, row) => types.forEach((tp, i) => { c.save(); c.translate(5 + cell * (i + 0.5), 5 + cell * 1.5 * (row + 0.7)); c.scale(scale, scale);
        const tw = { type: tp, lvl, aim: -0.6, fireFx: 0, ax: 0.45, ay: 0.9, dirx: 1, diry: 0, trailDir: null, x: 0, y: 0, lx: 30, ly: 10, c: 0, r: 0, chew: 0, id: i }; A.drawTower(c, tp, 0.3, tw); c.restore(); }));
      return cv; };
    const r = {}; r.types = types;
    r.wood = mk(1, false, S).toDataURL(); r.mint = mk(7, false, S).toDataURL();
    // 24 px greyscale: each tower L1 at 24 css px wide cell, upscaled x8 nearest, desaturated
    const cv = mk(1, false, 0.6); const w = cv.width, hh = Math.round(cv.height / 3); const c2 = document.createElement('canvas'); c2.width = w * 5; c2.height = hh * 5; const q = c2.getContext('2d'); q.imageSmoothingEnabled = false; q.drawImage(cv, 0, 0, w, hh, 0, 0, w * 5, hh * 5);
    const id = q.getImageData(0, 0, c2.width, c2.height); const d = id.data; for (let i = 0; i < d.length; i += 4) { const y = 0.2126 * d[i] + 0.7152 * d[i + 1] + 0.0722 * d[i + 2]; d[i] = d[i + 1] = d[i + 2] = y; } q.putImageData(id, 0, 0); r.grey = c2.toDataURL();
    r.stats = A.spriteCacheStats(); return r; });
  for (const k of ['wood', 'mint', 'grey']) fs.writeFileSync(`${OUT}/g2-${tag}-${k}.png`, Buffer.from(out[k].split(',')[1], 'base64'));
  res[tag] = out.stats; console.log(tag, JSON.stringify(out.stats)); await h.close();
}
fs.writeFileSync(`${OUT}/g2-stats.json`, JSON.stringify(res));
