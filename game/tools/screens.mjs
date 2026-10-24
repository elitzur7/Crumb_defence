// Loads the built web app (test build) in headless Chrome (phone viewport), drives it by touch, checks for console errors,
// measures frame time, and saves screenshots to /workspace/ant-td/screens/v0.4.1/.
import puppeteer from 'puppeteer-core';
import { mkdirSync } from 'node:fs';
import { serve } from './serve.mjs';

const OUT = '/workspace/ant-td/screens/v0.4.1';
mkdirSync(OUT, { recursive: true });
const srv = await serve(8765, 'www-test');
const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox', '--disable-gpu'] });
const page = await browser.newPage();
await page.emulate({ viewport: { width: 393, height: 852, deviceScaleFactor: 2.75, isMobile: true, hasTouch: true }, userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Mobile Safari/537.36' });
const errors = [], requests = [];
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errors.push(`[console.${m.type()}] ${m.text()}`); });
page.on('pageerror', (e) => errors.push(`[pageerror] ${e.message}`));
page.on('request', (r) => { if (!r.url().startsWith('http://127.0.0.1:8765/')) requests.push(r.url()); });
await page.goto('http://127.0.0.1:8765/index.html', { waitUntil: 'load' });
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
await sleep(800);
const only = process.argv[2] ? new RegExp(process.argv[2]) : null;
const shot = async (name, wait = 350) => { if (only && !only.test(name)) return; await sleep(wait); await page.screenshot({ path: `${OUT}/${name}.png` }); console.log('saved', `${OUT}/${name}.png`); };
const G = (fn, arg) => page.evaluate(fn, arg);
const tapBtn = async (id) => {
  const b = (await G(() => window.__game.buttons())).find((q) => q.id === id);
  if (!b) throw new Error('button not found: ' + id);
  await page.touchscreen.tap(b.sx, b.sy); await sleep(150);
};
const tileCss = (c, r) => G(({ c, r }) => { const cv = document.getElementById('game').getBoundingClientRect(); const sc = Math.min(cv.width / 400, cv.height / 720); return { x: (cv.width - 400 * sc) / 2 + (c + 0.5) * 40 * sc, y: (cv.height - 720 * sc) / 2 + (68 + (r + 0.5) * 40) * sc }; }, { c, r });
const screen = () => G(() => window.__game.S.screen);
const fullSave = () => G(() => { const g = window.__game; const s = g.M.newSave(); for (const id of g.C.SIM_ASSUMED_CARDS) g.M.unlockCard(s, id); for (const k of g.C.BONUS_TYPES) s.bonusStock[k] = 3; s.diamonds = 45; g.Cal.touch(s, g.now()); s.calendar = window.__game.S.save.calendar; s.levels.forEach((l, i) => { if (i < 9) { l.cleared = true; l.stars = 3 - (i % 3 === 2 ? 1 : 0); } }); s.coins = 640; g.setSave(s); });

// 1. fresh save -> level map -> prep -> battle (real touch)
// 0. first launch: the Reward Calendar pops up; claim today's prize
if (!(await G(() => !!window.__game.S.cal))) throw new Error('calendar did not pop up on first launch');
await shot('00a-calendar-popup');
{ const tile = await G(() => window.__game.Cal.status(window.__game.S.save, window.__game.now()).tile); await tapBtn('calTile' + tile); }
await shot('00b-calendar-claimed', 700);
await tapBtn('calClose');
await shot('01-level-map');
await tapBtn('lvl0'); if (await screen() !== 'prep') throw new Error('did not reach prep');
await shot('02-prep-deck');
await tapBtn('start'); if (await screen() !== 'battle') throw new Error('did not reach battle');
// place the free first card by touch: tap pick, tap tile
await G(() => { window.__game.S.battle.picks[0] = 'slingshot'; });
await tapBtn('pick0');
await shot('03-battle-card-selected');
const t1 = await tileCss(4, 3); await page.touchscreen.tap(t1.x, t1.y); await sleep(120);
if ((await G(() => window.__game.S.battle.towers.length)) !== 1) throw new Error('touch placement failed');
await shot('04-purchase-card-fly', 60);
console.log('touch placement OK (free first card placed)');
// not enough crumbs: tap a pick with 0 crumbs -> small pill above the tray
await tapBtn('pick1');
await shot('05-not-enough-crumbs', 120);
await tapBtn('pick1');
// Android back button pauses
await G(() => history.back()); await sleep(300);
if (!(await G(() => window.__game.S.paused && window.__game.S.screen === 'battle'))) throw new Error('back did not pause');
await shot('06-paused');
await tapBtn('resume');
console.log('back-button pause OK');
// fan placed by drag (ghost shows the wind arrows) and upgrade with stat diff
await G(() => { const b = window.__game.S.battle; b.addCrumbs(200); b.picks[0] = 'fan'; });
const pk = (await G(() => window.__game.buttons())).find((q) => q.id === 'pick0');
const t2 = await tileCss(6, 3);
await page.touchscreen.touchStart(pk.sx, pk.sy); for (let k = 1; k <= 8; k++) await page.touchscreen.touchMove(pk.sx + (t2.x - pk.sx) * k / 8, pk.sy + (t2.y + 34 * 0.95 - pk.sy) * k / 8);
await shot('07-drag-fan-ghost-wind', 200);
await page.touchscreen.touchEnd(); await sleep(150);
await tapBtn('wave');
await G(() => window.__game.simulate(14, false));
await G(() => { const g = window.__game, b = g.S.battle; b.picks[0] = 'slingshot'; b.playCard(0, 4, 3); g.consumeEvents(); });
await shot('08-upgrade-stat-diff', 500);
// tap the fan -> info panel with Power/Rate/Range + Turn + wind arrows
await G(() => { window.__game.S.info = null; });
const tf = await tileCss(6, 3); await page.touchscreen.tap(tf.x, tf.y); await sleep(150);
await shot('09-tower-info-fan');
// crumb "+" -> buy 50 crumbs with diamonds (the battle waits)
await G(() => { window.__game.S.info = null; window.__game.S.save.diamonds = 60; });
await tapBtn('buyCrumbs');
await shot('10a-crumb-dialog');
await tapBtn('dlgBuy');
await shot('10b-crumbs-bought', 250);
// a booster with 0 stock -> buy dialog for 20 diamonds
await tapBtn('bonusbomb');
await shot('10c-booster-buy-dialog');
await tapBtn('dlgCancel');
await G(() => { window.__game.S.info = null; });
// marble: placed next to a straight stretch, info shows its roll line
await G(() => { const g = window.__game, b = g.S.battle; b.addCrumbs(100); b.picks[1] = 'ball'; b.playCard(1, 7, 1); g.consumeEvents(); g.simulate(1.2, false); });
const tm = await tileCss(7, 1); await page.touchscreen.tap(tm.x, tm.y); await sleep(150);
await shot('11-marble-aim', 300);
await G(() => { window.__game.S.info = null; window.__game.simulate(12, true); });
await shot('12-battle-level1');

// 2. late game: all maps, flyers, queen
await fullSave();
const maps = [[3, 'fork'], [5, 'twin'], [6, 'snake'], [9, 'cross']];
for (const [lv, name] of maps) {
  await G(({ lv }) => { const g = window.__game; g.startBattle(lv, ['laser', 'zapper', 'sound', 'gate', 'pheromone'], ['plane', 'freeze'], 7); g.simulate(70); }, { lv });
  await shot(`13-map-${name}`);
}
await G(() => { const g = window.__game; g.startBattle(5, ['laser', 'zapper', 'sound', 'gate', 'lizard'], ['plane', 'freeze'], 7); g.simulate(95); g.S.battle.useBonus('plane', 0, 0); g.simulate(1.6, false); });
await shot('14-crop-duster-two-routes');
await G(() => { const g = window.__game; g.startBattle(9, ['laser', 'zapper', 'sound', 'gate', 'slingshot'], ['bomb', 'freeze'], 3); });
let guard = 0;
while (guard++ < 200) { const q = await G(() => { const g = window.__game; g.simulate(5); const b = g.S.battle; return { queen: b.ants.some((a) => a.type === 'queen' && a.d > 150), done: !!b.result }; }); if (q.queen || q.done) break; }
await shot('15-queen-boss');
await G(() => { const g = window.__game; while (!g.S.battle.result) g.simulate(10); });
await shot('16-result', 1500);
// 3. perfect cookie: win level 1 with nothing stolen
await G(() => { const g = window.__game; g.startBattle(0, ['slingshot', 'spray', 'glue', 'fan', 'ball'], ['bomb', 'freeze'], 1); const b = g.S.battle; b.nextWave = b.waves.length; g.simulate(0.1, false); });
await shot('17-perfect-cookie-celebration', 700);
await shot('18-perfect-prize', 1800);
// loss result: few coins from kills only
await G(() => { const g = window.__game; g.startBattle(2, ['slingshot', 'spray', 'glue', 'fan', 'ball'], ['bomb', 'freeze'], 1); g.simulate(600, false); });
await shot('19-loss-result', 900);
// 4. prep: zero-stock booster selected -> lava border + warning (Defend still allowed)
await G(() => { const g = window.__game; g.go('map'); }); await sleep(250);
await G(() => { const g = window.__game; g.S.save.bonusStock.bomb = 0; g.openPrep(3); g.S.prep.bonuses = ['bomb', 'plane']; });
await sleep(250);
await shot('20-prep-zero-booster-warning', 200);
await G(() => { const g = window.__game; g.S.save.bonusStock.bomb = 2; g.S.prep.deck = ['slingshot', 'spray', 'glue', 'fan', 'ball']; g.S.prepAlert = null; });
await shot('21-prep-flyer-warning-wrapped');
// 5. cards + merge animation
await G(() => { const g = window.__game; g.S.save.cards.laser.copies = 4; g.S.save.coins = 640; g.go('cards'); });
await shot('22-cards');
await tapBtn('mergelaser');
await shot('23-merge-animation-1', 250);
await shot('24-merge-animation-2', 450);
await sleep(1500);
await G(() => { const g = window.__game; g.S.save.coins = 140; g.go('shop'); });
await shot('25-shop');
await tapBtn('buyzapper');
await shot('25b-shop-unlocked-card', 200);
await tapBtn('back'); if (await screen() !== 'map') throw new Error('back failed');
await shot('26-map-progress');
// calendar a few days later (streak running, past days of the week)
await G(() => { const g = window.__game; const t = g.now(); for (let d = 1; d <= 3; d++) { g.setClockOffset(d * 86400000 - 3600000); g.heartbeat(true); g.Cal.claim(g.S.save, g.now()); } g.setClockOffset(4 * 86400000 - 3600000); g.heartbeat(true); g.openCalendar(); });
await shot('27-calendar-day-5-streak', 500);
await G(() => { const g = window.__game; g.S.cal = null; g.setClockOffset(9 * 86400000); g.heartbeat(true); g.openCalendar(); });
await shot('28-calendar-after-long-absence-reset', 500);
await G(() => { const g = window.__game; g.S.cal = null; g.setClockOffset(0); });
// cookie in trouble near the end of a battle (crying / screaming faces)
for (const [n, f] of [['29a-cookie-crying', 0.2], ['29b-cookie-screaming', 0.12]]) {
  await G((f) => { const g = window.__game; g.startBattle(4, ['laser', 'zapper', 'sound', 'gate', 'slingshot'], ['bomb', 'freeze'], 4); g.simulate(30, true); g.S.battle.foodStored = g.S.battle.cfg.foodHP * f; }, f);
  await shot(n, 200);
}
// frame time on a busy battle (headless, software rendering - indicative only)
const perf = await G(async () => {
  const g = window.__game; g.startBattle(8, ['laser', 'zapper', 'sound', 'gate', 'slingshot'], ['bomb', 'freeze'], 5); g.simulate(120);
  const ts = []; await new Promise((res) => { let n = 0; const f = (t) => { ts.push(t); if (++n < 90) requestAnimationFrame(f); else res(); }; requestAnimationFrame(f); });
  const d = ts.slice(1).map((t, i) => t - ts[i]).sort((a, b) => a - b); return { median: d[d.length >> 1], p90: d[Math.floor(d.length * 0.9)], ants: g.S.battle.ants.length };
});
console.log('frame time (headless):', JSON.stringify(perf));
await browser.close(); srv.close();
console.log('external requests:', requests.length ? requests : 'none');
console.log('console errors/warnings:', errors.length ? errors : 'none');
process.exit(errors.length || requests.length ? 1 : 0);
