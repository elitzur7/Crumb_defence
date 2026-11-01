// G2 overlap check: share of ground-ant samples whose body is >25% covered by a tower body drawn after it (tower y > ant y). usage: node overlap.mjs <out.json> [K]
import { launch, richSave, setupBattle, sleep } from './harness.mjs'; import fs from 'node:fs';
const THR = parseFloat(process.argv[4] || '0.25'); const out = process.argv[2]; const K = parseFloat(process.argv[3] || '1.18'); const res = {};
const deck = ['slingshot', 'laser', 'zapper', 'spray', 'fan', 'ball', 'sound', 'pheromone', 'lizard', 'tractor', 'glue', 'gate'];
for (const [tag, query] of [['art81', ''], ['v080', '?art81=0']]) for (const li of [5, 16, 37]) {
  const h = await launch({ viewport: { width: 393, height: 852, deviceScaleFactor: 1 }, query }); const { page, ev } = h; await richSave(page, 40); await sleep(200);
  await setupBattle(page, li, deck, 30, deck.slice(0, 5));
  const r = await ev((k, process_thr) => { const g = window.__game, C = g.C; let samples = 0, bad = 0;
    for (let s = 0; s < 400; s++) { g.simulate(0.15, true); const b = g.S.battle; if (!b || b.result) break;
      for (const a of b.ants) { if (a.flying) continue; samples++; let cov = 0;
        for (const tw of b.towers) { if (C.TOWERS[tw.type].place === 'path') continue; if (tw.y <= a.y) continue;
          const kk = (window.__game.C.ART81 ? k : 1); const x0 = tw.x - 14 * kk, x1 = tw.x + 14 * kk, y1 = tw.y - 8 + 8 /* pad top */, y0 = tw.y + 8 - 34 * kk;
          let n = 0, m = 0; for (let i = -3; i <= 3; i++) for (let j = -3; j <= 3; j++) { if (i * i + j * j > 9) continue; m++; const px = a.x + i * 3, py = a.y - 8 + j * 3; if (px >= x0 && px <= x1 && py >= y0 && py <= y1) n++; } cov = Math.max(cov, n / m); }
        if (cov > +(process_thr)) bad++; } }
    return { samples, bad, towers: g.S.battle ? g.S.battle.towers.length : 0 }; }, K, THR);
  res[tag + '-L' + (li + 1)] = r; console.log(tag, li + 1, JSON.stringify(r)); await h.close(); }
fs.writeFileSync(out, JSON.stringify(res, null, 1));
