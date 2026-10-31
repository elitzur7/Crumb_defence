// QA4: particle / frame caps on a heavy level at 1x and 4x. usage: node caps.mjs <level 1-based> <secs> <out.json>
import { launch, richSave, setupBattle, sleep } from './harness.mjs'; import fs from 'node:fs';
const LV = +process.argv[2] || 38, SECS = +process.argv[3] || 40, OUT = process.argv[4] || '/tmp/caps.json';
const res = {};
for (const sp of [1, 4]) {
  const h = await launch({ viewport: { width: 393, height: 852, deviceScaleFactor: 1 }, query: '' }); const { page, ev } = h;
  await richSave(page, 40); await sleep(300);
  await setupBattle(page, LV - 1, ['slingshot', 'zapper', 'laser', 'lizard', 'spray', 'pheromone', 'glue', 'lava', 'fan', 'sound'], 3, ['slingshot', 'laser', 'spray', 'zapper', 'fan']);
  await ev((sp) => { const g = window.__game; g.S.paused = false; g.S.speed = sp; g.setAutoBot(true); g.S.battle.crumbs = 2000; }, sp);
  const t0 = Date.now(); let n = 0;
  while (Date.now() - t0 < SECS * 1000) { await sleep(500); n++; const r = await ev(() => { const S = window.__game.S; return S.screen; }); if (r !== 'battle') break; }
  res[sp + 'x'] = await ev(() => window.__caps());
  res[sp + 'x'].screen = await ev(() => window.__game.S.screen); res[sp + 'x'].secs = (Date.now() - t0) / 1000;
  await h.close();
}
fs.writeFileSync(OUT, JSON.stringify(res, null, 1)); console.log(JSON.stringify(res));
