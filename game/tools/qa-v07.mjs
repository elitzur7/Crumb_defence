// v0.7.0 independent QA (separate from regress-ui.mjs): pack reveal (paid, paid+NEW tower via pity, free pack), skip, reduced motion,
// no toast / no NEW CARD queue for packs, upgrade gain label, opener rules in a real battle, version label, flyers pill,
// production build hygiene. Screenshots -> /workspace/ant-td/qa/v0.7/
import puppeteer from 'puppeteer-core';
import { serve } from './serve.mjs';
const OUT = '/workspace/ant-td/qa/v0.7';
await serve(8781, 'www-test'); await serve(8782, 'www');
const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
let fails = 0; const R = [];
const ok = (c, m) => { R.push(`${c ? 'PASS' : 'FAIL'} ${m}`); if (!c) fails++; };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function open(reduced = false) {
  const page = await browser.newPage();
  await page.emulate({ viewport: { width: 393, height: 852, deviceScaleFactor: 2.75, isMobile: true, hasTouch: true }, userAgent: 'Mozilla/5.0 (Linux; Android 14) Mobile' });
  if (reduced) await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  const errors = []; page.on('pageerror', (e) => errors.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.evaluateOnNewDocument(() => { try { localStorage.clear(); } catch (e) {} window.__all = new Set(); const f = CanvasRenderingContext2D.prototype.fillText; CanvasRenderingContext2D.prototype.fillText = function (t, ...r) { window.__all.add(String(t)); return f.call(this, t, ...r); }; });
  await page.goto('http://127.0.0.1:8781/index.html'); await page.waitForFunction(() => window.__game);
  const G = (fn, a) => page.evaluate(fn, a);
  const btn = async (id) => (await G(() => window.__game.buttons())).find((b) => b.id === id);
  const tap = async (id) => { const b = await btn(id); if (!b) return false; await page.touchscreen.tap(b.sx, b.sy); await sleep(150); return true; };
  const drawn = (re) => G((s) => [...window.__all].some((t) => new RegExp(s).test(t)), re);
  const clearTx = () => G(() => window.__all.clear());
  await G(() => { window.__game.S.cal = null; });
  return { page, G, btn, tap, drawn, clearTx, errors };
}
// ---------- 1. paid pack, no new tower ----------
{
  const { page, G, tap, drawn, clearTx, errors } = await open();
  await sleep(200); ok(await drawn('^v0\\.7\\.0$'), 'version label v0.7.0 drawn on the map');
  await G(() => { const g = window.__game, s = g.M.newSave(); s.coins = 500; s.levels[0] = { stars: 3, cleared: true }; s.onboard.zapperGift = 'done'; g.setSave(s); g.S.cal = null; g.go('shop'); });
  await sleep(250); await clearTx(); await sleep(150);
  ok(await drawn('sure in 10'), 'paid pack label shows the pity count ("sure in 10")');
  await G(() => { Math.random = (() => { let x = 99; return () => ((x = (x * 1103515245 + 12345) % 2147483648) / 2147483648) * 0.5 + 0.45; })(); }); // never < 10% -> no new tower
  ok(await tap('pack'), 'tap the pack button');
  const p = await G(() => { const g = window.__game; return { pack: !!g.S.pack, toast: g.S.toast, rev: g.S.reveal.length, n: g.S.pack && g.S.pack.cards.length, nw: g.S.pack && g.S.pack.newTower, src: g.S.pack && g.S.pack.source, since: g.S.save.packsSinceNew }; });
  ok(p.pack && p.n === 5 && !p.nw && p.src === 'paid' && !p.toast && p.rev === 0 && p.since === 1, `paid pack opens the pack reveal, 5 cards, no toast, no NEW CARD queue (${JSON.stringify(p)})`);
  await G(() => { window.__game.S.pack.t = 1.15 + 0.15 * 2 + 0.11; }); await sleep(30);
  await page.screenshot({ path: `${OUT}/pack-paid-midflip-393x852.png` });
  ok(await tap('packTap'), 'tap during the flip skips'); await sleep(250);
  const sk = await G(() => { const P = window.__game.S.pack; return P && { skipped: P.skipped, t: P.t, at: P.summaryAt }; });
  ok(sk && sk.skipped && sk.t >= sk.at, `skip jumps to the summary (${JSON.stringify(sk)})`);
  await sleep(400); await clearTx(); await sleep(200);
  ok(await drawn('Tap anywhere to continue') && !!(await G(() => window.__game.buttons().find((b) => b.id === 'packOk'))) && !!(await G(() => window.__game.buttons().find((b) => b.id === 'packCards'))), 'summary: OK + Cards buttons + "Tap anywhere to continue"');
  await page.screenshot({ path: `${OUT}/pack-paid-summary-393x852.png` });
  ok(await tap('packOk') && (await G(() => !window.__game.S.pack && window.__game.S.screen === 'shop')), 'OK closes the reveal and stays in the Shop');
  // ---------- 2. paid pack with NEW tower through pity (9 empty packs before) ----------
  await G(() => { const g = window.__game; g.S.save.packsSinceNew = 9; g.S.save.coins = 500; });
  await tap('pack');
  const q = await G(() => { const g = window.__game, P = g.S.pack; return P && { ids: P.cards.map((c) => c.id), nw: P.newTower, last: P.cards.at(-1).isNew, since: g.S.save.packsSinceNew, unlocked: g.S.save.cards[P.cards.at(-1).id].unlocked }; });
  ok(q && q.nw && q.last && q.since === 0 && q.unlocked && ['sound', 'pheromone', 'lava'].includes(q.ids.at(-1)), `pity: 10th pack holds a NEW tower from the cheapest tier, dealt last (${JSON.stringify(q)})`);
  await G(() => { window.__game.S.pack.t = 1.15 + 0.15 * 4 + 0.12; }); await sleep(30);
  await page.screenshot({ path: `${OUT}/pack-newtower-midflip-393x852.png` });
  await G(() => { window.__game.S.pack.t = 3.2; }); await sleep(120); await clearTx(); await sleep(150);
  ok(await drawn('NEW TOWER!'), 'NEW TOWER! ribbon on the summary');
  await page.screenshot({ path: `${OUT}/pack-newtower-summary-393x852.png` });
  await tap('packCards'); await sleep(200);
  ok(await G(() => !window.__game.S.pack && window.__game.S.screen === 'cards'), 'Cards button goes to the Cards screen');
  ok(errors.length === 0, `no console errors (paid) ${errors.join(' | ')}`);
  await page.close();
}
// ---------- 3. free pack (D-P0) through the real onboarding: win stage 2 -> Shop -> FREE ----------
{
  const { page, G, tap, drawn, clearTx, errors } = await open();
  await G(() => { const g = window.__game, s = g.M.newSave(); g.M.applyBattleResult(s, 0, 'win', 3, {}, () => 0); g.M.applyBattleResult(s, 1, 'win', 3, {}, () => 0); g.setSave(s); g.S.cal = null; g.go('shop'); });
  await sleep(250); await clearTx(); await sleep(150);
  ok(await drawn('4 random \\+ Zapper'), 'Shop free slot reads "4 random + Zapper"');
  await page.screenshot({ path: `${OUT}/free-pack-shop-393x852.png` });
  ok(await tap('gift'), 'tap the FREE pack');
  const f = await G(() => { const g = window.__game, P = g.S.pack; return P && { src: P.source, ids: P.cards.map((c) => c.id), nw: P.newTower, rev: g.S.reveal.length, toast: g.S.toast, coins: g.S.save.coins, z: g.S.save.cards.zapper.unlocked, pend: g.M.zapperGiftPending(g.S.save), dmg: P.cards.slice(0, 4).some((c) => g.M.isDamageId(c.id)) }; });
  ok(f && f.src === 'free' && f.ids.length === 5 && f.ids[4] === 'zapper' && f.nw && f.dmg && f.z && !f.pend && f.rev === 0 && !f.toast, `free pack: 4 random (>=1 damage) + Zapper last as NEW, no NEW CARD queue (${JSON.stringify(f)})`);
  await G(() => { window.__game.S.pack.t = 1.15 + 0.15 * 4 + 0.1; }); await sleep(30);
  await page.screenshot({ path: `${OUT}/free-pack-midflip-393x852.png` });
  await G(() => { window.__game.S.pack.t = 3.3; }); await sleep(150); await clearTx(); await sleep(150);
  ok(await drawn('FREE PACK!') && await drawn('NEW TOWER!'), 'free pack summary: title + NEW TOWER! for the Zapper');
  await page.screenshot({ path: `${OUT}/free-pack-summary-393x852.png` });
  await tap('packOk'); await sleep(250);
  ok(await G(() => window.__game.S.save.onboard.cardsHint === 'shop'), 'after the free pack the onboarding points at Cards');
  await page.screenshot({ path: `${OUT}/free-pack-after-cards-finger-393x852.png` });
  // old save (v0.6) past stage 2 -> pack pending once
  const old = await G(() => { const g = window.__game, s = g.M.newSave(); s.version = 4; s.levels[0] = { stars: 3, cleared: true }; s.levels[1] = { stars: 3, cleared: true }; s.onboard = { zapperGift: 'done', grantedOnLoad: true }; localStorage.setItem('crumbdefense.save.v1', JSON.stringify(s)); const l = g.M.loadSave(localStorage); return { pend: g.M.zapperGiftPending(l), v: l.version }; });
  ok(old.pend && old.v === 5, `old v0.6 save past stage 2 gets the free pack once (${JSON.stringify(old)})`);
  ok(errors.length === 0, `no console errors (free) ${errors.join(' | ')}`);
  await page.close();
}
// ---------- 4. reduced motion: straight to the summary ----------
{
  const { page, G, tap, errors } = await open(true);
  await G(() => { const g = window.__game, s = g.M.newSave(); s.coins = 100; s.onboard.zapperGift = 'done'; g.setSave(s); g.S.cal = null; g.go('shop'); }); await sleep(200);
  await tap('pack'); await sleep(100);
  const r = await G(() => { const P = window.__game.S.pack; return P && { reduced: P.reduced, t: P.t, at: P.summaryAt }; });
  ok(r && r.reduced && r.t >= r.at, `prefers-reduced-motion: summary at once (${JSON.stringify(r)})`);
  await page.screenshot({ path: `${OUT}/pack-reduced-motion-393x852.png` });
  ok(errors.length === 0, 'no console errors (reduced motion)');
  await page.close();
}
// ---------- 5. battle: opener rules, free redraw, upgrade gain label, flyers pill ----------
{
  const { page, G, tap, drawn, clearTx, errors } = await open();
  await G(() => { const g = window.__game, s = g.M.newSave(); for (let i = 0; i < 6; i++) s.levels[i] = { stars: 3, cleared: true }; s.onboard.zapperGift = 'done'; g.setSave(s); g.S.cal = null; });
  // flyers pill on the prep screen of a flyer level
  const fl = await G(() => { const g = window.__game; const i = g.C.LEVELS.findIndex((L, k) => k < 6 && JSON.stringify(L.waves || L).includes('flyer')); return i; });
  if (fl >= 0) { await G((i) => window.__game.openPrep(i), fl); await sleep(250); await clearTx(); await sleep(150); ok(await drawn('Flyers in this level'), `prep screen of level ${fl + 1} shows "Flyers in this level"`); await page.screenshot({ path: `${OUT}/prep-flyers-pill-393x852.png` }); }
  else ok(false, 'no flyer level found in 1-6');
  for (const [i, nm] of [[2, 'Masked Scout'], [3, 'Flying Scout'], [4, 'Armored Scout']]) { await G((i) => window.__game.openPrep(i), i); await sleep(250); await clearTx(); await sleep(150); ok(await drawn(nm), `prep L${i + 1} previews the new variant "${nm}"`); await page.screenshot({ path: `${OUT}/prep-L${i + 1}-variant-393x852.png` }); }
  await G(() => { const g = window.__game, s = g.S.save; s.cards.slingshot.inv = { 7: 1 }; s.cards.slingshot.level = 7; g.setSave(s); g.openPrep(1); }); await sleep(250); await clearTx(); await sleep(150);
  ok(await drawn('Cards act as L4 max'), 'prep (World 1) with a L7 card shows "Cards act as L4 max"');
  await page.screenshot({ path: `${OUT}/prep-card-level-cap-393x852.png` });
  const h = [];
  for (let seed = 1; seed <= 20; seed++) h.push(await G((seed) => { const g = window.__game; g.startBattle(0, ['slingshot', 'spray', 'glue', 'fan', 'ball'], [], seed); const b = g.S.battle; const isD = (id) => ['slingshot', 'spray', 'ball'].includes(id); return { picks: b.picks.slice(), d: b.picks.filter(isD).length, price: b.rerollPrice }; }, seed));
  ok(h.every((x) => new Set(x.picks).size === 3 && x.d >= 2 && x.price === 0), `20 real battles: distinct hands, >= 2 damage cards, first redraw free (${JSON.stringify(h.slice(0, 3))})`);
  await G(() => { const g = window.__game; g.startBattle(0, ['slingshot', 'spray', 'glue', 'fan', 'ball'], [], 7); }); await sleep(200); await clearTx(); await sleep(150);
  ok(await drawn('^Free$|FREE|free'), 'redraw button shows it is free');
  await page.screenshot({ path: `${OUT}/battle-free-redraw-393x852.png` });
  // place a slingshot on a side tile, open its info -> "x2 dmg! Next ..."
  const u = await G(() => { const g = window.__game, b = g.S.battle; b.addCrumbs(200); let spot = null;
    for (let r = 0; r < 12 && !spot; r++) for (let c = 0; c < 10; c++) { const t = b.tileInfo(c, r); if (t.valid && !t.onPath && !t.tower) { spot = { c, r }; break; } }
    b.picks[0] = 'slingshot'; const res = b.playCard(0, spot.c, spot.r); const tw = b.towers.find((q) => q.c === spot.c && q.r === spot.r); g.S.info = { tower: tw, t: 0 }; return { ok: res && res.ok, spot, gain: g.upgradeGain('slingshot', 2, 1) }; });
  await sleep(250); await clearTx(); await sleep(200);
  ok(u.ok && Math.abs(u.gain - 2) < 1e-6 && await drawn('^x2 dmg! Next'), `tower info "Next" line starts with "x2 dmg!" (${JSON.stringify(u)})`);
  await page.screenshot({ path: `${OUT}/upgrade-label-info-x2-393x852.png` });
  // drop the same card -> upgrade pop-up shows "Level 2!  x2 dmg"
  await G((spot) => { const g = window.__game, b = g.S.battle; g.S.info = null; b.picks[0] = 'slingshot'; b.playCard(0, spot.c, spot.r); }, u.spot);
  await sleep(120); await clearTx(); await sleep(200);
  ok(await drawn('Level 2!\\s+x2 dmg'), 'upgrade pop-up reads "Level 2!  x2 dmg"');
  await page.screenshot({ path: `${OUT}/upgrade-label-popup-393x852.png` });
  const lz = await G(() => [2, 3, 4, 5, 6].map((l) => Math.round(window.__game.upgradeGain('laser', l, 1) * 100) / 100));
  ok(JSON.stringify(lz) === JSON.stringify([1.7, 2.4, 3.1, 4.46, 6.31]), `Laser gains ${lz}`);
  ok(errors.length === 0, `no console errors (battle) ${errors.join(' | ')}`);
  await page.close();
}
// ---------- 6. production build ----------
{
  const page = await browser.newPage(); const ext = []; const errs = [];
  page.on('request', (r) => { if (!r.url().startsWith('http://127.0.0.1:8782') && !r.url().startsWith('data:')) ext.push(r.url()); });
  page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) errs.push(m.text()); });
  await page.goto('http://127.0.0.1:8782/index.html'); await sleep(1500);
  ok(await page.evaluate(() => typeof window.__game === 'undefined'), 'production build: no window.__game');
  ok(ext.length === 0 && errs.length === 0, `production build: no external requests, no console errors (${ext.concat(errs).join(' | ')})`);
  await page.screenshot({ path: `${OUT}/prod-map-393x852.png` });
  await page.close();
}
await browser.close();
console.log(R.join('\n')); console.log(fails ? `\n${fails} FAILED` : '\nALL PASS');
process.exit(fails ? 1 : 0);
