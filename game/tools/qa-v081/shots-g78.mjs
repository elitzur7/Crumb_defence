// G7 nest pennant + G8 food bar shots. usage: node shots-g78.mjs <outdir>
import { launch, richSave, setupBattle, sleep } from './harness.mjs'; import fs from 'node:fs';
const OUT = process.argv[2]; fs.mkdirSync(OUT, { recursive: true });
const h = await launch({ viewport: { width: 393, height: 852, deviceScaleFactor: 3 }, query: '' }); const { page, ev } = h;
await richSave(page, 40); await sleep(300);
await setupBattle(page, 5, ['slingshot'], 3, ['slingshot', 'spray']); await sleep(200);
const info = await ev(() => { const b = window.__game.S.battle; return { nests: b.routes.map((r) => r.pts[0]), food: b.cfg.foodHP }; }); console.log(JSON.stringify(info));
const F = [1, 0.7, 0.4, 0.15];
for (const f of F) { await ev((f, food) => { const g = window.__game; const b = g.S.battle; b.foodStored = f * food; g.S.paused = false; }, f, info.food); await sleep(120);
  for (let i = 0; i < 4; i++) await sleep(60); await page.screenshot({ path: `${OUT}/food-${f}.png`, clip: { x: 0, y: 72, width: 393, height: 56 } }); }
// drain: 0.7 -> 0.4 then capture right after
await ev((food) => { const g = window.__game; g.S.battle.foodStored = 0.7 * food; }, info.food); await sleep(150);
await ev((food) => { window.__game.S.battle.foodStored = 0.4 * food; }, info.food); await sleep(90); await page.screenshot({ path: `${OUT}/food-drain.png`, clip: { x: 0, y: 72, width: 393, height: 56 } });
await ev(() => { window.__game.S.paused = false; }); await sleep(100);
await page.screenshot({ path: `${OUT}/board-L06.png` });
await h.close();
for (const li of [16, 26, 33]) { const h2 = await launch({ viewport: { width: 393, height: 852, deviceScaleFactor: 3 } }); await richSave(h2.page, 40); await sleep(200);
  await setupBattle(h2.page, li, ['slingshot'], 2, ['slingshot', 'spray']); const n = await h2.ev(() => window.__game.S.battle.routes.map((r) => [Math.round(r.pts[0].x), Math.round(r.pts[0].y)])); console.log(li + 1, JSON.stringify(n));
  await h2.page.screenshot({ path: `${OUT}/board-L${li + 1}.png` }); await h2.close(); }
