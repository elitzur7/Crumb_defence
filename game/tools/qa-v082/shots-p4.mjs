// Pass 4 shots: samples a live battle and keeps the best frame per effect. usage: node shots-p4.mjs <outdir> [reduced]
import { launch, richSave, setupBattle, sleep } from './harness.mjs'; import fs from 'node:fs';
const OUT = process.argv[2], RM = process.argv[3] === 'reduced'; fs.mkdirSync(OUT, { recursive: true });
const h = await launch({ viewport: { width: 393, height: 852, deviceScaleFactor: 2 }, query: '' }); const { page, ev } = h;
await richSave(page, 40); await sleep(300);
if (RM) await ev(() => { window.__game.S.save.settings = { ...(window.__game.S.save.settings || {}), reduceMotion: 'on' }; });
await setupBattle(page, 5, ['slingshot', 'zapper', 'laser', 'lizard', 'spray', 'pheromone', 'glue', 'lava', 'fan', 'sound'], 18, ['slingshot', 'laser', 'spray', 'zapper', 'fan']);
await ev(() => { const g = window.__game; g.S.paused = false; g.S.speed = 1; g.S.battle.crumbs = 900; });
const best = {}; const keep = async (name, score, tag) => { if (score > (best[name] || 0)) { best[name] = score; await page.screenshot({ path: `${OUT}/${tag}-${name}.png`, clip: { x: 0, y: 72, width: 393, height: 520 } }); } };
const tag = RM ? 'reduced' : 'motion';
for (let i = 0; i < 90; i++) {
  await sleep(110);
  const c = await ev(() => { const g = window.__game, S = g.S; return { cs: (S.crumbSprites || []).length, sp: S.fx.filter((f) => f.k === 'spark' || f.k === 'star').length, imp: S.fx.filter((f) => f.k === 'impact').length, ban: S.fx.filter((f) => f.k === 'banner').length, bump: S.crumbBump > 0 ? 1 : 0, ko: S.fx.filter((f) => f.k === 'ko' || f.k === 'healCross').length, bub: S.battle.ants.filter((a) => a._bubbleUntil > S.t).length, t: S.t }; });
  await keep('crumbs', c.cs * 10 + c.bump, tag); await keep('sparkles', c.sp, tag); await keep('impacts', c.imp, tag); await keep('banner', c.ban * 5, tag); await keep('deaths', c.ko, tag); await keep('bubble', c.bub * 5, tag);
}
console.log(JSON.stringify(best));
// upgrade hop + place burst: upgrade a tower and sample
await ev(() => { const g = window.__game, b = g.S.battle; const tw = b.towers.find((t) => t.type === 'slingshot'); b.crumbs = 900; const pick = b.picks.indexOf('slingshot'); g.S._upTw = tw ? [tw.c, tw.r] : null; });
const up = await ev(() => { const g = window.__game, b = g.S.battle, tw = b.towers.find((t) => t.type === 'slingshot' && t.lvl < 4); if (!tw) return null; const i = b.picks.indexOf('slingshot'); const r = b.canPlay(i, tw.c, tw.r); return { r: !!r.ok, up: !!r.upgrade, c: tw.c, r2: tw.r, i, lvl: tw.lvl }; });
console.log('upgrade', JSON.stringify(up));
if (up && up.up) { await ev((up) => { const g = window.__game; g.S.battle.play(up.i, up.c, up.r2); }, up); for (const d of [60, 100, 100, 100, 150]) { await sleep(d); await page.screenshot({ path: `${OUT}/${tag}-upgrade-${Date.now() % 100000}.png`, clip: { x: 0, y: 72, width: 393, height: 520 } }); } }
console.log(JSON.stringify(await ev(() => window.__caps && window.__caps())));
await h.close();
