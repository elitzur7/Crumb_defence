// v0.5.0 screenshots, one or more per approved item -> /workspace/ant-td/screens/v0.5.0/ (npm run shots:v050)
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';
import { serve } from './serve.mjs';
const OUT = '/workspace/ant-td/screens/v0.5.0'; mkdirSync(OUT, { recursive: true });
const srv = await serve(8785, 'www-test');
const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox', '--disable-gpu'] });
const page = await browser.newPage();
await page.emulate({ viewport: { width: 393, height: 852, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) Mobile' });
const errors = []; page.on('pageerror', (e) => errors.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto('http://127.0.0.1:8785/index.html', { waitUntil: 'load' });
await page.waitForFunction(() => window.__game);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const G = (fn, arg) => page.evaluate(fn, arg);
const saved = [];
const shot = async (name, wait = 350) => { await sleep(wait); await page.screenshot({ path: `${OUT}/${name}.png` }); saved.push(name); console.log('saved', name); };
const btn = async (id) => (await G(() => window.__game.buttons())).find((b) => b.id === id);
const tapId = async (id) => { const b = await btn(id); if (!b) throw new Error('no button ' + id); await page.touchscreen.tap(b.sx, b.sy); };
// a mid-game save: world 1 partly done, some cards at higher levels
const baseSave = () => G(() => {
  const g = window.__game, s = g.M.newSave(); g.Cal.touch(s, g.now()); g.Cal.claim(s, g.now(), () => 0);
  s.coins = 1240; s.diamonds = 23;
  for (let i = 0; i < 6; i++) s.levels[i] = { stars: [3, 3, 2, 3, 2, 3][i], cleared: true };
  for (const id of ['laser', 'zapper', 'sound']) g.M.unlockCard(s, id);
  const sl = s.cards.slingshot; sl.inv = { 1: 1, 2: 1, 3: 1, 4: 1 }; sl.seen = [1, 2, 3, 4]; sl.copies = 2;
  s.cards.spray.inv = { 1: 2, 2: 1 }; s.cards.spray.seen = [1, 2]; s.cards.spray.copies = 4;
  s.cards.laser.inv = { 1: 1 }; s.cards.laser.fresh = true;
  for (const id of g.C.ALL_CARDS) { const c = s.cards[id]; let L = 0; for (const k of Object.keys(c.inv || {})) if (c.inv[k] > 0) L = Math.max(L, +k); if (L) { c.level = L; c.unlocked = true; } }
  for (const k of g.C.BONUS_TYPES) s.bonusStock[k] = 2;
  g.setSave(s); g.S.cal = null; g.S.reveal = [];
});
const battle = (lvl, deck, seed = 3) => G(([l, d, sd]) => { const g = window.__game; g.S.reveal = []; g.startBattle(l, d, ['bomb', 'freeze'], sd); const b = g.S.battle; b.addCrumbs(300); g.consumeEvents(); }, [lvl, deck, seed]);
const place = (type, c, r) => G(([t, c, r]) => { const g = window.__game, b = g.S.battle; const tw = b.addTower(t, c, r); g.consumeEvents(); return tw.id; }, [type, c, r]);
const info = (id) => G((i) => { const g = window.__game; g.S.info = { tower: g.S.battle.towers.find((t) => t.id === i), t: 0 }; }, id);
const hold = () => G(() => { const b = window.__game.S.battle; b.nextWaveAt = b.time + 90; });

await baseSave();
// ---- item 9: diamonds left of coins on one row (map) + item 13 map
await G(() => window.__game.go('map')); await shot('09-map-diamonds-left-of-coins');

// ---- items 1b + 5b: Cards screen info panel (real stats, next card upgrade); item 6/7 highest level + NEW tag
await G(() => { const g = window.__game; g.go('cards'); g.S.cardsSel = 'slingshot'; }); await shot('01b-05b-cards-panel-slingshot-L4');
await G(() => { window.__game.S.cardsSel = 'laser'; }); await shot('01b-05b-cards-panel-laser-L1');
// ---- items 6 + 7: a card's own screen: inventory per level + manual merges
await G(() => window.__game.openCardView('slingshot')); await shot('06-card-view-slingshot');
await G(() => window.__game.openCardView('spray')); await shot('06-card-view-spray-merge-ready');
await tapId('mrg0'); await shot('06-merge-3-copies-to-L1-anim', 500);
await G(() => { window.__game.S.mergeAnim = null; }); await shot('06-card-view-spray-after-merge', 200);
// ---- item 7: prize straight into the inventory; NEW CARD reveal only for a new type / level
await G(() => { const g = window.__game; g.go('map'); g.queueReveal('lizard', 1, true, g.S.t); }); await shot('07-new-card-reveal', 900);
await G(() => { const g = window.__game; g.S.reveal = []; g.queueReveal('slingshot', 5, false, g.S.t); }); await shot('07-new-level-reveal', 900);
await G(() => { window.__game.S.reveal = []; });
// perfect battle with a card prize (Math.random -> 0 picks the card prize; owned-type L1 card -> no reveal)
await G(() => { const g = window.__game; const s = g.S.save; for (const id of g.C.ALL_CARDS) if (!s.cards[id].unlocked) g.M.unlockCard(s, id); g.setSave(s); });
await battle(0, ['slingshot', 'spray', 'glue', 'fan', 'ball']);
await G(() => { const g = window.__game, b = g.S.battle; b.nextWave = b.waves.length; const r = Math.random; Math.random = () => 0; g.simulate(0.1, false); Math.random = r; });
await shot('07-16-perfect-prize-won-card', 2600);
await shot('07-result-after-celebration', 1800);
await baseSave();

// ---- item 1b + 8: Shop - info panel, bigger owned count, purchase animations (card pulse, count pulse, -price float)
await G(() => { const g = window.__game; g.go('shop'); g.S.shopSel = 'zapper'; }); await shot('01b-08-shop-panel-and-counts');
await tapId('buyslingshot'); await shot('08-shop-buy-animation-mid', 160);
await shot('08-shop-buy-animation-later', 350);
await tapId('bbuybomb'); await shot('08-shop-buy-booster-diamonds', 200);

// ---- items 2 + 10a: marble rolls straight away from the tower along the adjacent trail, breaks at the wall
await battle(0, ['ball', 'fan', 'slingshot', 'laser', 'zapper']); await hold();
let id = await place('ball', 0, 2); await info(id); await shot('02-marble-aim-roll-line-and-break-star');
await G((i) => { const g = window.__game, b = g.S.battle; g.S.info = null; const tw = b.towers.find((t) => t.id === i);
  for (const x of [150, 230, 300]) { const a = b.spawn('worker', 104 + (x - 60)); a.speed = 0; } tw.cd = 0; }, id);
await sleep(700); await shot('02-marble-rolling', 0);
await G(() => new Promise((res) => { const b = window.__game.S.battle; const t0 = performance.now(); const f = () => { if (!b.balls.length || performance.now() - t0 > 4000) res(); else requestAnimationFrame(f); }; f(); }));
await shot('02-marble-broke-at-wall', 60);
await battle(0, ['ball', 'fan', 'slingshot', 'laser', 'zapper']); await hold();
id = await place('ball', 0, 3); await info(id); await shot('02-marble-no-adjacent-trail-no-roll');
await battle(0, ['ball', 'fan', 'slingshot', 'laser', 'zapper']); await hold();
id = await place('ball', 7, 3); await info(id); await shot('02-marble-tiebreak-corner');
// ---- item 10b: fan - same direction logic, area circle, no arrows
await battle(0, ['fan', 'ball', 'slingshot', 'laser', 'zapper']); await hold();
id = await place('fan', 9, 2); await info(id); await shot('10b-fan-area-circle');
await G(() => { const g = window.__game, b = g.S.battle; g.S.info = null; b.nextWaveAt = 0; }); await sleep(5000); await shot('10b-fan-in-action', 0);
// ---- item 4: ranges (1.5 / 2 / 2.5 tiles from the tower centre)
for (const [t, c, r] of [['slingshot', 4, 3], ['zapper', 4, 3], ['laser', 4, 3]]) {
  await battle(0, ['slingshot', 'zapper', 'laser', 'ball', 'fan']); await hold(); id = await place(t, c, r); await info(id); await shot(`04-range-${t}`);
}
// ---- items 11 + 12: Move (1 diamond) / Swap (free)
await battle(0, ['slingshot', 'laser', 'zapper', 'ball', 'fan']); await hold();
const a1 = await place('slingshot', 4, 3); const a2 = await place('laser', 9, 4);
await info(a1); await shot('11-12-tower-panel-move-swap-buttons');
await G((i) => { const g = window.__game; g.startMode('move', g.S.battle.towers.find((t) => t.id === i)); }, a1); await shot('11-move-mode');
await G(() => { const g = window.__game, b = g.S.battle; const tw = g.S.mode.tower; const r = g.M.moveTowerWithDiamond(g.S.save, b, tw, 0, 6); g.S.mode = null; g.consumeEvents(); return r; }).then((r) => console.log('move', JSON.stringify(r)));
await shot('11-after-move-diamond-spent', 200);
await G((i) => { const g = window.__game; g.startMode('swap', g.S.battle.towers.find((t) => t.id === i)); }, a2); await shot('12-swap-mode');
await G(() => { const g = window.__game, b = g.S.battle; const [x, y] = b.towers; b.swapTowers(x, y); g.S.mode = null; g.consumeEvents(); }); await shot('12-after-swap', 250);
// ---- item 17: redraw 3, 6, 9 ...
await shot('17-redraw-price-3', 50);
await G(() => { const g = window.__game; g.S.battle.reroll(); }); await shot('17-redraw-price-6', 200);
await G(() => { const g = window.__game; g.S.battle.reroll(); }); await shot('17-redraw-price-9', 200);
// ---- item 3: treat faces only (no speech) while ants eat
await battle(1, ['slingshot', 'spray', 'glue', 'fan', 'ball']);
await G(() => { const g = window.__game; g.simulate(55, false); }); await shot('03-treat-face-no-speech', 300);

// ---- items 13 + 14: world 2 on the map (scroll), locked then unlocked
await baseSave();
await G(() => { const g = window.__game; const s = g.S.save; for (let i = 0; i < 10; i++) s.levels[i] = { stars: i < 4 ? 3 : 2, cleared: true }; g.setSave(s); g.go('map'); });
await shot('13-map-world1-done-scroll-hint');
await G(() => { const g = window.__game; g.S.mapScroll = g.maxMapScroll(); }); await shot('14-map-world2-locked-24-stars');
await G(() => { const g = window.__game; const s = g.S.save; s.levels[4].stars = 3; g.setSave(s); g.go('map'); }); await shot('14-map-world2-unlocked-25-stars');
await G(() => { const g = window.__game; g.S.mapScroll = g.maxMapScroll(); }); await shot('13-map-world2-top-swift-queen');
await G(() => window.__game.openPrep(10)); await shot('13-prep-level11-cake');
await battle(10, ['slingshot', 'laser', 'zapper', 'sound', 'spray']); await G(() => window.__game.simulate(20, true)); await shot('13-battle-level11-cake', 200);
await battle(19, ['laser', 'zapper', 'sound', 'slingshot', 'spray']);
await G(() => { const g = window.__game, b = g.S.battle; b.nextWave = b.waves.length - 1; b.nextWaveAt = 0; g.simulate(8, true); }); await shot('14-swift-queen-level20', 200);

// ---- item 16: celebrations
await baseSave();
await battle(0, ['slingshot', 'spray', 'glue', 'fan', 'ball']);
await G(() => { const g = window.__game, b = g.S.battle; b.result = 'win'; b.stars = 3; b.foodStored = 80; g.finishBattle(); }); await shot('16-three-stars-confetti', 500);
await battle(0, ['slingshot', 'spray', 'glue', 'fan', 'ball']);
await G(() => { const g = window.__game, b = g.S.battle; b.result = 'win'; b.stars = 3; b.foodStored = b.cfg.foodHP; g.finishBattle(); }); await shot('16-full-food-confetti-fireworks', 1300);
await battle(9, ['laser', 'zapper', 'sound', 'slingshot', 'spray']);
await G(() => { const g = window.__game, b = g.S.battle; b.nextWave = b.waves.length; b.nextWaveAt = 1e9;
  const q = b.spawn('queen', 300); g.simulate(0.5, false); b.damage(q, 1e7, { ignoreArmor: true }); for (const a of b.ants) if (!a.dead) b.damage(a, 1e7, { ignoreArmor: true }); g.consumeEvents(); });
await shot('16-queen-defeated-fireworks-text', 1200);
await battle(9, ['laser', 'zapper', 'sound', 'slingshot', 'spray']);
await G(() => { const g = window.__game, b = g.S.battle; b.nextWave = b.waves.length - 1; b.nextWaveAt = b.time + 90;
  const q = b.spawn('queen', 300); g.simulate(0.3, false); b.damage(q, 1e7, { ignoreArmor: true }); g.consumeEvents(); });
await shot('16-queen-defeated-cheer-in-battle', 1000);
await shot('16-queen-defeated-result', 3500);
// ---- item 18: the queen still eats half the treat
await battle(9, ['slingshot', 'spray', 'glue', 'fan', 'ball']);
const q = await G(() => { const g = window.__game, b = g.S.battle; b.nextWave = b.waves.length; b.nextWaveAt = 1e9; b.foodStored = 100;
  const rt = b.route({ ri: 0 }); const qa = b.spawn('queen', Math.max(0, rt.length - 60), 0);
  let st = null; for (let i = 0; i < 60 * 60 && !st; i++) { b.update(1 / 60); st = b.events.find((e) => e.type === 'steal' && e.n >= 40); if (!st) b.events = []; }
  g.consumeEvents(); return { food: b.foodStored, steal: st && st.n }; });
console.log('queen steal', JSON.stringify(q)); await shot('18-queen-ate-half', 500);

console.log('errors:', errors.length ? errors : 'none');
console.log(saved.length, 'screenshots');
await browser.close(); process.exit(0);
