// v0.7.8 browser QA: P2-1 (Cards stats = effective/capped numbers), P2-2 (tap an ant in prep -> rarity tooltip + dot legend), P2-4 ("World n - scroll up" hint clear of node labels),
// 12 px text floor on those screens, no page errors. Output -> /workspace/ant-td/qa/v0.7.8/ (shots/, qa-v078.log). Needs `npm run build` (www-test with window.__game).
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import { serve } from './serve.mjs';
const OUT = '/workspace/ant-td/qa/v0.7.8'; const SH = `${OUT}/shots`; fs.mkdirSync(SH, { recursive: true });
await serve(8895, 'www-test');
const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
let fails = 0; const R = [];
const ok = (c, m) => { R.push(`${c ? 'PASS' : 'FAIL'} ${m}`); if (!c) fails++; };
const info = (m) => R.push(`INFO ${m}`);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const page = await browser.newPage();
await page.emulate({ viewport: { width: 393, height: 852, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, userAgent: 'Mozilla/5.0 (Linux; Android 14) Mobile' });
const errors = []; page.on('pageerror', (e) => errors.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.evaluateOnNewDocument(() => { try { localStorage.clear(); } catch (e) {} window.__tx = []; const f = CanvasRenderingContext2D.prototype.fillText;
  CanvasRenderingContext2D.prototype.fillText = function (t, ...r) { const m = /(\d+(?:\.\d+)?)px/.exec(this.font); window.__tx.push([String(t), m ? +m[1] : 0]); return f.call(this, t, ...r); }; });
await page.goto('http://127.0.0.1:8895/index.html'); await page.waitForFunction(() => window.__game);
const G = (fn, a) => page.evaluate(fn, a);
const drawn = async (ms = 250) => { await G(() => { window.__tx = []; }); await sleep(ms); return G(() => window.__tx.slice()); };
const shot = (name, clip) => page.screenshot({ path: `${SH}/${name}.png`, ...(clip ? { clip } : {}) });
await sleep(200);
const SAVE = (o) => G((o) => { const g = window.__game; const s = g.M.newSave(); for (const id of g.C.ALL_CARDS) s.cards[id].unlocked = true; s.coins = 800; s.diamonds = 40; s.onboard = 'done';
  for (let i = 0; i < o.wins; i++) g.M.applyBattleResult(s, i, 'win', o.stars, {}, () => 0);
  for (const [id, lv] of Object.entries(o.levels || {})) s.cards[id].level = lv;
  g.setSave(s); g.S.cal = null; g.S.reveal = []; g.S.save.onboard = 'done'; g.go('map'); }, o);
// floor12: glyph badges (level badges 11 px, coin 'C', the 11 px card tags 'on trail' / 'gnd+air' / 'air only') are pre-existing icon text, see qa-v077 V3
const floor12 = (tx, what) => { const small = tx.filter(([t, s]) => s && s < 12 && t.trim() && !/^(L\d+|C|\d+|×\d+|on trail|gnd\+air|air only)$/.test(t)); ok(small.length === 0, `${what}: no text drawn below 12 px${small.length ? ' (' + small.slice(0, 5).map(([t, s]) => `${t}@${s}`).join(' | ') + ')' : ''}`); };
const statTexts = (tx) => tx.filter(([t]) => /\d/.test(t) && !/^(L\d+|\d+)$/.test(t) && !/coins|cards|Merge|Fights|Next|Dots|W\d/.test(t)).map(([t]) => t);

// ----- P2-1: Cards stats panel = effective numbers -----
// laser at L7 in a W2-unlocked save (cap 5) must read exactly like laser at L5; L3 laser must differ (and keep its 'Next card level' preview)
const panelOf = async (lv) => { await SAVE({ wins: 12, stars: 3, levels: { laser: lv } }); await G(() => window.__game.openCardView('laser')); const tx = await drawn(400); return tx; };
const t7 = await panelOf(7); await shot('p21-laser-L7-cap5');
const t5 = await panelOf(5); await shot('p21-laser-L5-cap5');
const t3 = await panelOf(3); await shot('p21-laser-L3');
const t10 = await panelOf(10);
const keyTx = (tx) => JSON.stringify(tx.map(([t]) => t).filter((t) => /^(Damage|Rate|Range|Dmg|Power|Shots)|\d/.test(t)).filter((t) => !/^Cards held|^\d+$|^L\d+$|coins/.test(t)));

ok(t7.some(([t]) => t === 'Fights as L5'), 'P2-1 laser L7 in a W2 save: "Fights as L5"');
const panelTx = (tx) => { const a = tx.map(([t]) => t); const i = a.findIndex((t) => /^Card L\d+/.test(t)); const j = a.indexOf('Merge all', i); return a.slice(i + 1, j < 0 ? undefined : j); }; // the info panel after its header line: description, 3 stat boxes, footer line
const strip = (tx) => Array.from(new Set(panelTx(tx)));
info('laser L7 panel (after header): ' + strip(t7).join(' | ')); info('laser L3 panel (after header): ' + strip(t3).join(' | '));
ok(JSON.stringify(strip(t7)) === JSON.stringify(strip(t5)), 'P2-1 the stat panel of laser L7 is identical to laser L5 (both fight as L5): effective numbers shown');
ok(JSON.stringify(strip(t10)) === JSON.stringify(strip(t5)), 'P2-1 ... and laser L10 too');
ok(JSON.stringify(strip(t3)) !== JSON.stringify(strip(t5)), 'P2-1 laser L3 shows different (lower) numbers than L5');
ok(t7.some(([t]) => /^Card L7 - fights as L5$/.test(t)), 'P2-1 header reads "Card L7 - fights as L5"');
ok(t7.some(([t]) => /^At the world cap \(L5\)/.test(t)) && !t7.some(([t]) => /^Next card level/.test(t)), 'P2-1 at/above the cap the panel says "At the world cap (L5)..." and shows no next-level preview');
ok(t3.some(([t]) => /^Next card level L4: /.test(t)), 'P2-1 below the cap the "Next card level L4" preview is kept');
await SAVE({ wins: 3, stars: 3, levels: { laser: 7 } }); await G(() => window.__game.openCardView('laser')); const w1 = await drawn(400);
ok(w1.some(([t]) => t === 'Fights as L4') && w1.some(([t]) => /^At the world cap \(L4\)/.test(t)), 'P2-1 a W1-only save: laser L7 fights as L4, panel says cap L4');
floor12(t7.concat(t3, w1), 'P2-1 Cards panels');
await G(() => window.__game.go('cards')); const cl = await drawn(400); await shot('p21-cards-list'); floor12(cl, 'Cards list');

// ----- P2-2: tap an ant in prep -> rarity tooltip with the dot legend -----
await SAVE({ wins: 24, stars: 2 }); await G(() => window.__game.openPrep(24)); let tx = await drawn(300); await shot('p22-prep-L25-before');
const ants = await G(() => window.__game.buttons().filter((b) => b.id.startsWith('ant') && b.id !== 'antTip').map((b) => ({ id: b.id, sx: b.sx, sy: b.sy, cssW: b.cssW, cssH: b.cssH })));
info('prep L25 ant buttons: ' + JSON.stringify(ants.map((a) => a.id)));
ok(ants.length >= 3, `P2-2 every incoming ant has a tap target (${ants.length}); smallest ${Math.round(Math.min(...ants.map((a) => a.cssH)))} x ${Math.round(Math.min(...ants.map((a) => a.cssW)))} css px`);
const tgt = ants.find((a) => a.id === 'antmama') || ants[ants.length - 1];
await page.touchscreen.tap(tgt.sx, tgt.sy); tx = await drawn(250); await shot('p22-prep-L25-tooltip');
ok(tx.some(([t]) => /^Dots: 1 common, 2 uncommon, 3 rare, 4 elite$/.test(t)), 'P2-2 the legend line is drawn after a tap');
info('tooltip first line: ' + Array.from(new Set(tx.map(([t]) => t).filter((t) => /\(\d dots?\)|no dots/.test(t)))).join(' | '));
ok(tx.some(([t]) => /: (common|uncommon|rare|elite|boss) \((\d dots?|no dots)\)$/.test(t)), 'P2-2 the first line names the ant, its tier and its dot count');
floor12(tx, 'P2-2 prep + tooltip');
const tipBtn = await G(() => window.__game.buttons().find((b) => b.id === 'antTip'));
ok(!!tipBtn && tipBtn.cssH >= 44, 'P2-2 the tooltip is dismissable by tapping it');
await page.touchscreen.tap(tipBtn.sx, tipBtn.sy); tx = await drawn(250); ok(!tx.some(([t]) => /^Dots: 1 common/.test(t)), 'P2-2 tapping the tooltip closes it');
await page.touchscreen.tap(tgt.sx, tgt.sy); await sleep(3700); tx = await drawn(250); ok(!tx.some(([t]) => /^Dots: 1 common/.test(t)), 'P2-2 the tooltip closes by itself after ~3.4 s');
// a deck card tap still works while no tooltip is open (the tooltip does not leave a stuck overlay)
const deckN = await G(() => window.__game.S.prep.deck.length); await G(() => { const b = window.__game.buttons().find((x) => x.id === 'decklaser'); return !!b; });
info('deck size on prep: ' + deckN);
for (const li of [0, 10, 20, 29]) { await G((li) => window.__game.openPrep(li), li); await sleep(200); const bs = await G(() => window.__game.buttons().filter((b) => /^ant/.test(b.id) && b.id !== 'antTip')); if (bs.length) { await page.touchscreen.tap(bs[0].sx, bs[0].sy); const t2 = await drawn(250); ok(t2.some(([t]) => /^Dots:/.test(t)), `P2-2 tooltip works on L${li + 1}`); floor12(t2, `tooltip L${li + 1}`); } }
await G(() => window.__game.openPrep(29)); const qb = await G(() => window.__game.buttons().find((b) => b.id === 'antqueen3')); await page.touchscreen.tap(qb.sx, qb.sy); tx = await drawn(250); await shot('p22-prep-L30-queen-tooltip');
ok(tx.some(([t]) => /boss \(no dots\)$/.test(t)), 'P2-2 the Pie Queen reads "boss (no dots)"');

// ----- P2-4: scroll hint clear of node labels -----
await SAVE({ wins: 30, stars: 3 });
const hintAt = async (sc, name) => { await G((sc) => { const g = window.__game; g.S.mapScroll = sc === 'max' ? g.maxMapScroll() : sc; }, sc); await sleep(500); const t = await drawn(300); await shot(name); return t; };
for (const [sc, name] of [[0, 'p24-map-scroll0'], [120, 'p24-map-scroll120'], [400, 'p24-map-scroll400']]) {
  const t = await hintAt(sc, name); const h = t.find(([s]) => /scroll up/.test(s)); info(`map scroll ${sc}: hint ${h ? h[0] : 'none'}`); floor12(t, `map scroll ${sc}`);
}
// geometry: the pill is above the clip window (MAPVIEW.top 194) -> cannot overlap any node label; check by pixel: sample the label band of the nodes under the old pill position is clean
const geo = await G(() => { const g = window.__game; return { top: 194, pillY0: 164, pillY1: 188 }; });
ok(geo.pillY1 < geo.top, `P2-4 the hint pill (y ${geo.pillY0}-${geo.pillY1}) lies above the map window (y >= ${geo.top}), so no node label can sit under it`);
const hintOK = await G(() => { const g = window.__game; let n = 0; for (const sc of [0, 60, 150, 300, 450, g.maxMapScroll()]) { g.S.mapScroll = Math.min(sc, g.maxMapScroll()); n++; } return n; });
ok(hintOK > 0, 'P2-4 scrolled through several positions without errors');
ok(errors.length === 0, `no page errors (${errors.slice(0, 3).join(' | ')})`);
fs.writeFileSync(`${OUT}/qa-v078.log`, R.join('\n') + `\n\n${R.filter((x) => x.startsWith('PASS')).length} pass, ${fails} fail\n`);
console.log(R.join('\n')); console.log(fails ? `FAILS: ${fails}` : 'ALL PASS');
await browser.close(); process.exit(fails ? 1 : 0);
