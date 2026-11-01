// Pass 4 shots (PP8, M7g, U11 + W6 contact sheet). usage: HASH=<7-char> node shots-v082-p4.mjs <outdir> [parts]
import { launch, richSave, sleep, namedShot, setupBattle } from './harness.mjs'; import fs from 'node:fs';
const OUT = process.argv[2]; fs.mkdirSync(OUT, { recursive: true }); const PARTS = (process.argv[3] || 'board,node,tips,ring,banner,sheet').split(',');
const freeze = (ev) => ev(() => { window.__ft = performance.now(); window.__run = 0; window.requestAnimationFrame = (cb) => setTimeout(() => { if (window.__run > 0) { window.__run--; window.__ft += 16.667; } cb(window.__ft); }, 16); });
const step = (page, ev) => async (sec) => { await ev((s) => { window.__run = Math.max(1, Math.round(s * 60)); }, sec); await page.waitForFunction(() => window.__run === 0, { polling: 10 }); await sleep(40); };
const VP = { width: 393, height: 852, deviceScaleFactor: 2 }, FULL = { x: 0, y: 0, width: 393, height: 852 }; const res = {};
const DECK = ['slingshot', 'laser', 'zapper', 'sound', 'lizard'];
const fresh = async (levels = 50, cl = {}) => { const h = await launch({ viewport: VP }); await richSave(h.page, levels); await sleep(200);
  await h.ev((cl) => { const g = window.__game; for (const [k, v] of Object.entries(cl)) g.S.save.cards[k].level = v; g.S.save.seenSpecial = {}; g.setSave(g.S.save); }, cl); return h; };
const CL = { slingshot: 5, laser: 6, zapper: 5, sound: 5, lizard: 3 };
if (PARTS.includes('node')) {
  const h = await fresh(50, CL); const { page, ev } = h; const st = step(page, ev); await freeze(ev);
  { await ev(() => { const g = window.__game; g.go('map'); g.S.mapScroll = Math.min(g.maxMapScroll(), Math.max(0, 440 - g.gateY(6))); }); await st(0.5); res.node = await namedShot(page, OUT, 'PP8-node', FULL); }
  await h.close();
}
if (PARTS.includes('board')) {
  const h = await fresh(50, CL); const { page, ev } = h; const st = step(page, ev); await freeze(ev);
  {
    await setupBattle(page, 50, ['slingshot', 'laser', 'zapper', 'sound', 'lizard'], 25, DECK);
    await ev(() => { const g = window.__game; g.S.specialBanner = null; g.S.paused = false; }); await st(0.5); res.board = await namedShot(page, OUT, 'PP8-board', FULL);
    const pt = await ev(() => { const g = window.__game, b = g.S.battle, rt = b.routes[0], p = rt.at(rt.length - 4), L = g.layout(); return { x: L.offX + p.x * L.scale, y: L.offY + (p.y + 72) * L.scale, s: L.scale }; });
    const c = { x: 393 - 190, y: 520, width: 190, height: 190 }; res.treat = await namedShot(page, OUT, 'PP8-treat', c); res.treatPt = pt;
  }
  await h.close();
}
if (PARTS.includes('sheet')) {
  const h = await fresh(50, CL); const { page, ev } = h; const st = step(page, ev); await freeze(ev); const files = [];
  for (let k = 0; k < 10; k++) { await ev(() => { window.__game.go('map'); }); await setupBattle(page, 50 + k, ['slingshot', 'laser', 'zapper', 'sound', 'lizard'], 22, DECK); await ev(() => { const g = window.__game; g.S.specialBanner = null; g.S.paused = false; }); await st(0.4);
    const f = `${OUT}/sheet-L${51 + k}.png`; await page.screenshot({ path: f, clip: { x: 0, y: 70, width: 393, height: 520 } }); files.push(f); }
  res.sheetFiles = files; await h.close();
}
if (PARTS.includes('tips')) {
  const tip = async (name, li, id, cl, full) => { const h = await fresh(50, { ...CL, [id]: cl }); const { page, ev } = h; const st = step(page, ev); await freeze(ev);
    await ev((li) => { window.__game.openPrep(li); }, li); await st(0.4);
    const pos = await ev((id) => { const b = window.__game.buttons().find((q) => q.id === 'deck' + id); return b ? { x: b.sx, y: b.sy } : null; }, id); res[name + 'Btn'] = pos;
    if (pos) { await page.touchscreen.tap(pos.x, pos.y); await st(0.4); }
    res[name] = await namedShot(page, OUT, name, full ? FULL : { x: 0, y: 150, width: 393, height: 330 }); await h.close(); };
  await tip('M7g-tip-active', 50, 'laser', 6); await tip('M7g-tip-asleep', 49, 'laser', 6); await tip('M7g-tip-locked', 50, 'slingshot', 3);
  await tip('U11-prep-asleep', 49, 'zapper', 5, true);
  const h = await fresh(50, CL); const { page, ev } = h; const st = step(page, ev); await freeze(ev);
  await ev(() => { const g = window.__game; g.go('cards'); g.S.cardsSel = 'laser'; }); await st(0.4); res.cards = await namedShot(page, OUT, 'M7g-cards-active', FULL);
  await ev(() => { window.__game.S.cardsSel = 'slingshot'; window.__game.S.save.cards.slingshot.level = 3; }); await st(0.3); res.cardsLocked = await namedShot(page, OUT, 'M7g-cards-locked', FULL);
  await ev(() => { window.__game.openCardView('laser'); }); await st(0.4); res.cv = await namedShot(page, OUT, 'M7g-cardview', FULL);
  await ev(() => { const g = window.__game; g.go('shop'); g.S.shopSel = 'zapper'; }); await st(0.4); res.shop = await namedShot(page, OUT, 'M7g-shop', FULL); await h.close();
}
if (PARTS.includes('ring')) {
  const h = await fresh(50, CL); const { page, ev } = h; const st = step(page, ev); await freeze(ev);
  await setupBattle(page, 50, ['slingshot', 'laser', 'zapper', 'sound', 'lizard'], 25, DECK); await ev(() => { const g = window.__game; g.S.specialBanner = null; g.S.paused = false; }); await st(0.5);
  res.ring = await namedShot(page, OUT, 'M7g-battle-ring', FULL); await h.close();
  const h2 = await fresh(49, CL); const p2 = h2.page, e2 = h2.ev, s2 = step(p2, e2); await freeze(e2); // W5 (index 44): the ring never shows
  await setupBattle(p2, 44, ['slingshot', 'laser', 'zapper', 'sound', 'lizard'], 25, DECK); await e2(() => { window.__game.S.paused = false; }); await s2(0.5); res.noRingW5 = await namedShot(p2, OUT, 'M7g-battle-noring-W5', FULL);
  res.w5Banner = await e2(() => !!window.__game.S.specialBanner); await h2.close();
}
if (PARTS.includes('banner')) {
  const h = await fresh(50, CL); const { page, ev } = h; const st = step(page, ev); await freeze(ev);
  await ev((deck) => { const g = window.__game; g.go('map'); g.startBattle(50, deck, ['bomb', 'freeze'], 5); g.S.paused = false; }, DECK); await st(0.7);
  res.banner = await namedShot(page, OUT, 'U11-banner', FULL); res.flag = await ev(() => JSON.stringify(window.__game.S.save.seenSpecial)); await st(3);
  res.bannerGone = await ev(() => !window.__game.S.specialBanner);
  await ev((deck) => { const g = window.__game; g.go('map'); g.startBattle(50, deck, ['bomb', 'freeze'], 5); }, DECK); res.second = await ev(() => !!window.__game.S.specialBanner); await h.close();
}
fs.writeFileSync(OUT + '/p4-res.json', JSON.stringify(res, null, 1)); console.log(JSON.stringify(res));
