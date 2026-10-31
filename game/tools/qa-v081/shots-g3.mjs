// G3 reward header shots. usage: node shots-g3.mjs <outdir> [query]
import { launch, richSave, sleep } from './harness.mjs'; import fs from 'node:fs';
const REDUCE = process.argv[5] === 'reduce'; const OUT = process.argv[2]; const query = process.argv[3] || ''; const pre = process.argv[4] || 'v081-G3-'; fs.mkdirSync(OUT, { recursive: true });
const variants = [['win1', 1, false, true, 3], ['win2', 2, false, true, 3], ['win3', 3, false, true, 3], ['perfect', 3, true, true, 3], ['loss', 0, false, false, 3]];
const h = await launch({ viewport: { width: 393, height: 852, deviceScaleFactor: 2 }, query }); const { page, ev } = h;
for (const [name, stars, perfect, win] of variants) {
  await richSave(page, 4); await sleep(200);
  await ev((stars, perfect, win, REDUCE) => { const g = window.__game; if (REDUCE) g.S.save.settings = { ...(g.S.save.settings || {}), reduceMotion: 'on' }; g.go('map'); g.startBattle(2, ['slingshot', 'laser', 'glue', 'spray', 'fan'], ['bomb', 'freeze'], 5); g.S.paused = false; const b = g.S.battle; b.crumbs = 9999; g.simulate(900, true); const R = g.S.result; R.stars = stars; R.perfect = perfect; R.win = win; R.moment = null; R.hold = 0; }, stars, perfect, win, REDUCE);
  for (const t of [2.2]) { await ev((t) => { window.__game.S.result.t = t - 0.04; }, t); await sleep(120); await page.screenshot({ path: `${OUT}/${pre}${name}.png` }); }
  if (name === 'win3') for (const [t, tg] of [[0.2, 'motion-a'], [0.45, 'motion-b']]) { await ev((t) => { const R = window.__game.S.result; R.t = t - 0.04; R.paused = true; }, t); await page.screenshot({ path: `${OUT}/${pre}win3-${tg}.png` }); }
}
await h.close();
