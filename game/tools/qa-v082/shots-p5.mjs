// Pass 5 shots: W5 maps, nest-flag pixel test, map strip + gate (U6), ant cards (U2), donut treat, result, queen5 death, L42 shield. usage: node shots-p5.mjs <outdir> [parts: maps,nest,map,cards,treat,death]
import { launch, richSave, setupBattle, sleep } from './harness.mjs'; import fs from 'node:fs';
const OUT = process.argv[2]; fs.mkdirSync(OUT, { recursive: true }); const PARTS = (process.argv[3] || 'maps,map,cards,treat,death').split(',');
const freeze = (ev) => ev(() => { window.__ft = performance.now(); window.__run = 0; window.requestAnimationFrame = (cb) => setTimeout(() => { if (window.__run > 0) { window.__run--; window.__ft += 16.667; } cb(window.__ft); }, 8); });
const mk = (page, ev) => ({
  step: async (sec) => { await ev((s) => { window.__run = Math.max(1, Math.round(s * 60)); }, sec); await page.waitForFunction(() => window.__run === 0, { polling: 10 }); await sleep(40); },
  shot: async (name, clip) => { for (let k = 0; k < 5; k++) { const buf = await page.screenshot({ path: `${OUT}/${name}.png`, clip }); if (buf.length > 9000) return; await sleep(150); } },
});
const deck = ['slingshot', 'laser', 'glue', 'spray', 'fan'];
const results = {};
if (PARTS.includes('maps') || PARTS.includes('nest')) for (let k = 0; k < 10; k++) {
  const li = 40 + k; const h = await launch({ viewport: { width: 393, height: 852, deviceScaleFactor: 2 }, query: '' }); const { page, ev } = h; const { step, shot } = mk(page, ev);
  await richSave(page, 40); await sleep(200);
  await setupBattle(page, li, ['slingshot', 'laser', 'spray', 'glue'], PARTS.includes('nest') && !PARTS.includes('maps') ? 0 : (k === 1 ? 24 : 8), deck); await sleep(200); await freeze(ev); await step(0.1);
  await shot(PARTS.includes('maps') ? `v081-W5-map-L${li + 1}` : `v081-W5-nests-L${li + 1}`, { x: 0, y: 0, width: 393, height: 852 });
  const nest = await ev(() => { const g = window.__game, b = g.S.battle, L = g.layout(); const cv = document.querySelector('canvas'); const c = cv.getContext('2d'); const out = [];
    const seen = []; for (const rt of b.routes) { const q = rt.pts[0]; if (!seen.some((n) => Math.hypot(n.x - q.x, n.y - q.y) < 5)) seen.push(q); }
    for (const q of seen) { // pennant fill #ff6f86 pixels in a window around the nest (the canvas is logical-sized * dpr; the board starts at MAP_Y)
      let best = 0; for (const oy of [0, 68]) { const cx = Math.max(30, Math.min(400 - 30, q.x)), cy = Math.max(26, Math.min(720 - 20, q.y + 6)) + oy; const s = L.dpr * L.scale;
        const x0 = Math.round(L.offX * L.dpr + (cx - 6) * s), y0 = Math.round(L.offY * L.dpr + (cy - 50) * s), w = Math.round(40 * s), hh = Math.round(46 * s);
        const d = c.getImageData(Math.max(0, x0), Math.max(0, y0), Math.max(1, Math.min(cv.width - x0, w)), Math.max(1, Math.min(cv.height - y0, hh))).data; let n = 0;
        for (let i = 0; i < d.length; i += 4) if (Math.abs(d[i] - 255) < 10 && Math.abs(d[i + 1] - 111) < 14 && Math.abs(d[i + 2] - 134) < 14) n++; best = Math.max(best, n); }
      out.push({ x: Math.round(q.x), y: Math.round(q.y), pennantPx: best }); }
    return { nests: out, routes: b.routes.length, map: b.map.id || null }; });
  results['L' + (li + 1)] = nest; console.log('L' + (li + 1), JSON.stringify(nest)); await h.close();
}
fs.writeFileSync(`${OUT}/p5-nest.json`, JSON.stringify(results, null, 1));
if (PARTS.includes('map')) {
  const h = await launch({ viewport: { width: 393, height: 852, deviceScaleFactor: 2 }, query: '' }); const { page, ev } = h; const { step, shot } = mk(page, ev);
  await richSave(page, 40); await sleep(200);
  const setStars = (n14) => ev((n14) => { const g = window.__game, s = g.S.save; for (let i = 30; i < 40; i++) s.levels[i] = { stars: 1, cleared: true }; for (let j = 0; j < n14 - 10; j++) s.levels[30 + j].stars = 2; g.S.starCard = null; g.go('map'); }, n14);
  await setStars(13); await sleep(200); await freeze(ev);
  await ev(() => { const g = window.__game; g.S.mapScroll = Math.min(g.maxMapScroll(), Math.max(0, 440 - g.gateY(5))); }); await step(0.2);
  await shot('v081-W5-map-strip-locked13', { x: 0, y: 0, width: 393, height: 852 });
  await ev(() => { window.__game.S.starCard = { w: 5 }; }); await step(0.3); await shot('v081-U6-card-13star', { x: 0, y: 0, width: 393, height: 852 });
  console.log('starcard 13', JSON.stringify(await ev(() => window.__game.M.lowestStarLevels(window.__game.S.save, 5).slice(0, 4))));
  await setStars(14); await ev(() => { const g = window.__game; g.S.mapScroll = Math.min(g.maxMapScroll(), Math.max(0, 440 - g.gateY(5))); }); await step(0.3);
  await shot('v081-W5-map-strip-open14', { x: 0, y: 0, width: 393, height: 852 });
  // tap the locked gate in the 13-star state through the real button
  await setStars(13); await ev(() => { const g = window.__game; g.S.mapScroll = Math.min(g.maxMapScroll(), Math.max(0, 440 - g.gateY(5))); }); await step(0.3);
  const bt = await ev(() => window.__game.buttons().filter((b) => /^gate/.test(b.id)).map((b) => ({ id: b.id, sx: b.sx, sy: b.sy }))); console.log('gate buttons', JSON.stringify(bt));
  // a few levels of W5 cleared to see the node art: nodes with stars
  await ev(() => { const g = window.__game; g.S.save.levels[40] = { stars: 3, cleared: true }; g.S.save.levels[41] = { stars: 2, cleared: true }; g.S.save.levels[42] = { stars: 1, cleared: true }; g.S.starCard = null; g.go('map'); g.S.mapScroll = Math.min(g.maxMapScroll(), Math.max(0, 440 - g.gateY(5))); }); await step(0.3);
  await shot('v081-W5-map-nodes-progress', { x: 0, y: 0, width: 393, height: 852 });
  await ev(() => { const g = window.__game; for (let i = 40; i < 49; i++) g.S.save.levels[i] = { stars: 3, cleared: true }; g.go('map'); g.S.mapScroll = Math.min(g.maxMapScroll(), Math.max(0, 440 - g.gateY(5))); }); await step(0.3);
  await shot('v081-W5-map-boss-node', { x: 0, y: 0, width: 393, height: 852 });
  await h.close();
}
if (PARTS.includes('cards')) {
  const h = await launch({ viewport: { width: 393, height: 852, deviceScaleFactor: 2 }, query: '?antcard=1' }); const { page, ev } = h; const { step, shot } = mk(page, ev);
  await richSave(page, 40); await sleep(200); await ev(() => { window.__game.S.save.seenAnts = []; }); await freeze(ev);
  await ev(() => { window.__game.openPrep(41); }); await step(0.4); await shot('v081-U2-card-glazed', { x: 0, y: 0, width: 393, height: 852 });
  console.log('card', await ev(() => window.__game.S.antCard));
  await ev(() => { window.__game.openPrep(49); }); await step(0.4); await shot('v081-U2-card-glazed-L50', { x: 0, y: 0, width: 393, height: 852 });
  await ev(() => { const g = window.__game; g.M.markAntSeen(g.S.save, 'glazed'); g.openPrep(49); }); await step(0.4); await shot('v081-U2-card-queen5', { x: 0, y: 0, width: 393, height: 852 });
  console.log('card', await ev(() => window.__game.S.antCard));
  await ev(() => { const g = window.__game; g.S.save.levels[31] = { stars: 0, cleared: false }; g.openPrep(31); }); await step(0.4); await shot('v081-U2-card-nurse', { x: 0, y: 0, width: 393, height: 852 });
  console.log('card', await ev(() => window.__game.S.antCard));
  await h.close();
}
if (PARTS.includes('treat')) {
  const h = await launch({ viewport: { width: 393, height: 852, deviceScaleFactor: 3 }, query: '' }); const { page, ev } = h; const { step, shot } = mk(page, ev);
  await richSave(page, 40); await sleep(200); await setupBattle(page, 40, ['slingshot', 'laser'], 3, deck); await sleep(200); await freeze(ev);
  const pos = await ev(() => { const b = window.__game.S.battle; return { cookie: b.map && b.map.cookie, foodHP: b.cfg.foodHP, keys: Object.keys(b.map || {}).slice(0, 12) }; }); console.log('treat info', JSON.stringify(pos));
  for (const [f, tag] of [[1, 'full'], [0.6, 'bit'], [0.25, 'low']]) { await ev((f) => { const b = window.__game.S.battle; b.foodStored = f * b.cfg.foodHP; }, f); await step(0.3); await shot(`v081-W5-treat-${tag}`, { x: 0, y: 72, width: 393, height: 700 }); }
  // result screen: win with 3 stars, then a 1-star loss-free win on a boss
  await ev(() => { const g = window.__game, b = g.S.battle; b.foodStored = b.cfg.foodHP; b.result = 'win'; b.stars = 3; g.finishBattle(); }); await step(2.5); await shot('v081-W5-result-win3', { x: 0, y: 0, width: 393, height: 852 });
  await h.close();
}
if (PARTS.includes('death')) {
  const h = await launch({ viewport: { width: 393, height: 852, deviceScaleFactor: 2 }, query: '' }); const { page, ev } = h; const { step, shot } = mk(page, ev);
  await richSave(page, 40); await sleep(200); await setupBattle(page, 49, ['slingshot', 'laser', 'spray', 'glue'], 2, deck); await sleep(200); await freeze(ev);
  await ev(() => { const b = window.__game.S.battle; b.spawn('queen5', 250); });
  let q = null; for (let i = 0; i < 40 && !q; i++) { await step(0.25); q = await ev(() => { const b = window.__game.S.battle; const a = b.ants.find((a) => a.type === 'queen5' && !a.dead); return a ? { x: a.x, y: a.y, hp: a.hp } : null; }); }
  console.log('queen5', JSON.stringify(q)); await ev(() => { window.__game.S.queenIntro = null; }); await step(1.2); await shot('v081-W5-queen5-alive', { x: 0, y: 72, width: 393, height: 600 });
  await ev(() => { const b = window.__game.S.battle; const a = b.ants.find((a) => a.type === 'queen5' && !a.dead); if (a) { a.shield = 0; a.hp = 0.01; } b.crumbs = 999; for (const t of b.towers) t.cool = 0; });
  for (let i = 0; i < 12; i++) { await step(0.05); const dead = await ev(() => { const b = window.__game.S.battle; return !b.ants.some((a) => a.type === 'queen5' && !a.dead); }); if (dead) break; }
  console.log('fx', await ev(() => window.__game.S.fx.length));
  for (const [n, s] of [['a', 0.02], ['b', 0.12], ['c', 0.2], ['d', 0.3]]) { await step(s); await shot(`v081-W5-queen5-death-${n}`, { x: 0, y: 72, width: 393, height: 600 }); console.log('fx', n, await ev(() => window.__game.S.fx.length)); }
  await h.close();
}
