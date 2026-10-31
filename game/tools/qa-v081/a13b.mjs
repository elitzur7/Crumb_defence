// RG1 browser-level A13: real frames (render + update), same seed, ART81 on vs off. usage: node a13b.mjs <art81 0|1> <out.json> [levels csv] [gameSecs]
import { launch, richSave, sleep } from './harness.mjs'; import fs from 'node:fs';
const [art, out, lv = '1,10,25,41,50', secs = '60'] = process.argv.slice(2);
const res = {};
for (const L of lv.split(',').map(Number)) for (const seed of [11, 12]) {
  const h = await launch({ viewport: { width: 393, height: 852, deviceScaleFactor: 1 }, query: art === '0' ? '?art81=0' : '' }); const { page, ev } = h;
  await richSave(page, 50); await sleep(200);
  await ev((L, seed) => { const g = window.__game; g.go('map'); g.startBattle(L - 1, ['slingshot', 'laser', 'spray', 'zapper', 'fan'], [], seed); g.S.paused = false; g.S.speed = 1; g.S.battle.crumbs = 300; g.setAutoBot(true);
    window.__ft = performance.now(); window.__run = 0; window.requestAnimationFrame = (cb) => setTimeout(() => { if (window.__run > 0) { window.__run--; window.__ft += 16.667; } cb(window.__ft); }, 1); }, L, seed);
  const art81 = await ev(() => window.__game.C.ART81);
  const total = +secs * 60; let done = 0, snap = [];
  while (done < total) { await ev((n) => { window.__run = n; }, 60); await ev(() => new Promise((r) => { const t = setInterval(() => { if (window.__run <= 0) { clearInterval(t); r(); } }, 2); }));
    done += 60; }
  res[`${L}/${seed}`] = await ev(() => { const b = window.__game.S.battle; return b ? [b.result || 'run', b.time.toFixed(3), b.foodStored, b.towers.length, b.crumbs, b.stats && b.stats.kills, b.ants.length, b.nextWave].join(',') : 'none'; });
  res.art81 = art81; await h.close();
}
fs.writeFileSync(out, JSON.stringify(res, null, 1)); console.log(JSON.stringify(res));
