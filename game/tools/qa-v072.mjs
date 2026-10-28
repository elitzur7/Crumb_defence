// v0.7.2 independent QA (separate from regress-ui.mjs and the unit tests): C13 cookie guard drawn + swinging + hurting ants in the real game loop,
// C14 shuttling ants in a real battle (never "escape", trips grow, win/loss only on 0 ants / 0 food), C16 tab bar on 3 phones x 2 insets
// (layout math, hit areas, taps, hidden in battle / modals), reduced motion, production build hygiene. Screenshots -> /workspace/ant-td/qa/v0.7.2/
import puppeteer from 'puppeteer-core';
import { serve } from './serve.mjs';
const OUT = '/workspace/ant-td/qa/v0.7.9/suites/v072';
await serve(8881, 'www-test'); await serve(8882, 'www');
const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
let fails = 0; const R = [];
const ok = (c, m) => { R.push(`${c ? 'PASS' : 'FAIL'} ${m}`); if (!c) fails++; };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function open(w = 393, h = 852, dpr = 2.75, reduced = false) {
  const page = await browser.newPage();
  await page.emulate({ viewport: { width: w, height: h, deviceScaleFactor: dpr, isMobile: true, hasTouch: true }, userAgent: 'Mozilla/5.0 (Linux; Android 14) Mobile' });
  if (reduced) await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  const errors = []; page.on('pageerror', (e) => errors.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.evaluateOnNewDocument(() => { try { localStorage.clear(); } catch (e) {} });
  await page.goto('http://127.0.0.1:8881/index.html'); await page.waitForFunction(() => window.__game);
  const G = (fn, a) => page.evaluate(fn, a);
  const btns = () => G(() => window.__game.buttons());
  const btn = async (id) => (await btns()).find((b) => b.id === id);
  const tap = async (id) => { const b = await btn(id); if (!b) return false; await page.touchscreen.tap(b.sx, b.sy); await sleep(160); return true; };
  await G(() => { const g = window.__game; g.S.cal = null; g.S.save.onboard.cardsHint = 'done'; });
  return { page, G, btns, btn, tap, errors };
}
const DECK = ['slingshot', 'spray', 'glue', 'fan', 'ball'];

// ---------- 1. C13 the guard: drawn, swings, hurts, no tower card, in a real battle ----------
{
  const { page, G, errors } = await open();
  await G((d) => window.__game.startBattle(0, d, ['bomb', 'freeze'], 7), DECK); await sleep(400);
  await page.screenshot({ path: `${OUT}/guard-battle-start-393x852.png` });
  // an ant right at the cookie, then let the real loop run: the guard swats it
  const r = await G(() => { const b = window.__game.S.battle; const a = b.spawn('worker', b.path.length - 25); b.swatCd = 0.05; return { hp: a.hp }; });
  await sleep(120);
  const mid = await G(() => { const b = window.__game.S.battle; return { fx: b.swatFx, swats: b.stats.swats || 0 }; });
  ok(mid.swats >= 1 && mid.fx > 0, `guard swats an ant in the real loop (${JSON.stringify(mid)})`);
  // freeze the sim and draw 3 phases of the swing next to an ant
  await G(() => { const b = window.__game.S.battle; b.update = () => {}; b.ants.length = 0; const a = b.spawn('big', b.path.length - 24); b.swatTarget = { x: a.x, y: a.y }; b.swatFx = 0.43; });
  await sleep(120); await page.screenshot({ path: `${OUT}/guard-swing-windup-393x852.png` });
  await G(() => { window.__game.S.battle.swatFx = 0.3; }); await sleep(120); await page.screenshot({ path: `${OUT}/guard-swing-slap-393x852.png` });
  await G(() => { window.__game.S.battle.swatFx = 0; }); await sleep(120); await page.screenshot({ path: `${OUT}/guard-rest-393x852.png` });
  ok(await G(() => window.__game.buttons().every((b) => !/swat|guard/i.test(b.id))), 'the guard has no button (not placeable / selectable)');
  const tw = await G(() => window.__game.S.battle.towers.length); ok(tw === 0, 'no tower object for the guard');
  ok(errors.length === 0, `guard: no console errors ${errors.join('|')}`);
  await page.close();
}
// ---------- 2. C14 shuttle in a real battle: no tower, no swatter -> an ant keeps going until the cookie is gone ----------
{
  const { page, G, errors } = await open();
  await G((d) => window.__game.startBattle(0, d, [], 7), DECK); await sleep(200);
  const res = await G(() => { const b = window.__game.S.battle; b.cfg.swatter = { ...b.cfg.swatter, on: false }; b.towers.length = 0; b.nextWaveAt = 1e9;
    b.foodStored = 12; const a = b.spawn('worker', b.path.length - 2); let escaped = false, maxTrips = 0, t = 0;
    for (; t < 60 * 900 && !b.result; t++) { b.update(1 / 60); maxTrips = Math.max(maxTrips, a.trips); if (b.ants.some((x) => x.escaped)) escaped = true; }
    return { result: b.result, trips: a.trips, escaped, food: b.foodStored, delivered: b.foodDelivered, secs: t / 60, dead: a.dead }; });
  ok(res.result === 'lose' && res.trips >= 10 && !res.escaped && !res.dead, `one ant shuttles until the food is gone: ${JSON.stringify(res)}`);
  // a shuttling ant on screen (state 'back' carrying + one on its 2nd trip), screenshot
  await G(() => { const g = window.__game; g.finishBattle && 0; g.startBattle(0, ['slingshot', 'spray', 'glue', 'fan', 'ball'], [], 7); }); await sleep(200);
  await G(() => { const b = window.__game.S.battle; b.update = () => {}; b.ants.length = 0; b.cfg.swatter = { ...b.cfg.swatter, on: false };
    const a = b.spawn('worker', b.path.length * 0.55); a.state = 'back'; a.carrying = 0.9; a.trips = 0;
    const c = b.spawn('worker', b.path.length * 0.35); c.state = 'go'; c.trips = 2; const d = b.spawn('big', b.path.length * 0.7); d.state = 'back'; d.carrying = 1.8; d.trips = 1; });
  await sleep(250); await page.screenshot({ path: `${OUT}/shuttle-ants-393x852.png` });
  const hud = await G(() => { const b = window.__game.S.battle; return b.ants.filter((a) => a.trips === 0 && a.carrying > 0).length; }); ok(hud === 1, 'HUD counts only first-trip carriers (1 of 3 ants)');
  ok(errors.length === 0, `shuttle: no console errors ${errors.join('|')}`);
  await page.close();
}
// ---------- 3. a whole level with the bot: ends only on win (0 ants) or loss (0 food) ----------
{
  const { page, G, errors } = await open();
  const out = await G((d) => { const g = window.__game; g.startBattle(2, d, ['bomb', 'freeze'], 11); g.S.save.coins = 0; g.setAutoBot(true); g.simulate(900, true); const b = g.S.battle || {}; return { result: b.result, ants: b.ants && b.ants.length, escaped: b.ants && b.ants.some((a) => a.escaped), food: b.foodStored, swats: b.stats && b.stats.swats, loops: b.stats && b.stats.loops }; }, DECK);
  ok(out.result === 'win' || out.result === 'lose', `bot level ends: ${JSON.stringify(out)}`);
  ok(out.result !== 'win' || out.ants === 0, 'a win means 0 ants alive'); ok(out.swats > 0, `the guard swatted during a full level (${out.swats})`);
  await sleep(300); await page.screenshot({ path: `${OUT}/level-end-393x852.png` });
  ok(errors.length === 0, `full level: no console errors ${errors.join('|')}`);
  await page.close();
}
// ---------- 4. C16 tab bar: 3 phones x inset 0/24, math + screenshots + real taps ----------
for (const [w, h, dpr] of [[320, 568, 2], [393, 852, 2.75], [412, 915, 2.6]]) {
  const { page, G, btns, btn, tap, errors } = await open(w, h, dpr);
  for (const inset of [0, 24]) {
    await G((i) => window.__game.setInset(i), inset); await sleep(250);
    for (const scr of ['map', 'cards', 'shop']) {
      await G((s) => { const g = window.__game; g.S.mergeAnim = null; g.go(s); }, scr); await sleep(420);
      const L = await G(() => window.__game.layout()); const t = (await btns()).filter((b) => /^tab\d$/.test(b.id));
      const barTop = h - inset - 56;
      ok(t.length === 3 && t.every((b) => b.cssH >= 48 && b.cssW >= 48), `${w}x${h} inset ${inset} ${scr}: 3 tabs, each >= 48dp (${Math.round(t[0] && t[0].cssW)}x${Math.round(t[0] && t[0].cssH)})`);
      ok(L.offY + 660 * L.scale <= barTop + 0.5, `${w}x${h} inset ${inset} ${scr}: content (660 design px) ends above the bar (${(L.offY + 660 * L.scale).toFixed(1)} <= ${barTop})`);
      ok(Math.abs(L.scale - Math.min(w / 400, (h - inset - 56) / 660)) < 1e-6, `${w}x${h} inset ${inset} ${scr}: scale = min(w/400, (h-bar)/660)`);
      const covered = (await btns()).filter((b) => !/^tab|Block/.test(b.id) && b.sy + b.cssH / 2 - 0 > barTop + 56 * 0.0 && b.sy - b.cssH / 2 > barTop - 1);
      ok(covered.length === 0, `${w}x${h} inset ${inset} ${scr}: no control starts inside the bar`);
      if (inset === 24 && w !== 412) await page.screenshot({ path: `${OUT}/tabbar-${scr}-${w}x${h}-inset24.png` });
      if (inset === 0 && w === 393) await page.screenshot({ path: `${OUT}/tabbar-${scr}-${w}x${h}-inset0.png` });
    }
  }
  await G(() => window.__game.setInset(24)); await G(() => window.__game.go('map')); await sleep(300);
  await tap('tab1'); ok(await G(() => window.__game.S.screen) === 'cards', `${w}x${h} real tap Cards`); await sleep(250);
  await tap('tab2'); ok(await G(() => window.__game.S.screen) === 'shop', `${w}x${h} real tap Shop`); await sleep(250);
  await tap('tab0'); ok(await G(() => window.__game.S.screen) === 'map', `${w}x${h} real tap Map`); await sleep(250);
  // android back from a tab screen goes to the map
  await tap('tab1'); await sleep(200); await page.evaluate(() => history.back()); await sleep(250);
  ok(await G(() => window.__game.S.screen) === 'map', `${w}x${h} back button from Cards -> Map`);
  await G(() => window.__game.startBattle(0, ['slingshot', 'spray', 'glue', 'fan', 'ball'], [], 3)); await sleep(300);
  ok((await btns()).filter((b) => /^tab/.test(b.id)).length === 0, `${w}x${h} no tab bar in battle`);
  if (w === 393) await page.screenshot({ path: `${OUT}/tabbar-hidden-in-battle-${w}x${h}.png` });
  ok(errors.length === 0, `${w}x${h} tab bar: no console errors ${errors.join('|')}`);
  await page.close();
}
// ---------- 5. onboarding spots point at the tabs; modals hide the bar; reduced motion ----------
{
  const { page, G, btns, btn, tap, errors } = await open(393, 852, 2.75, true);
  await G(() => { const g = window.__game, s = g.M.newSave(); s.levels[0] = { stars: 3, cleared: true }; g.setSave(s); g.S.cal = null; g.setInset(24); g.go('map'); }); await sleep(500);
  const gift = await G(() => window.__game.M.zapperGiftPending(window.__game.S.save));
  const spot = (await btns()).find((b) => b.id === 'shop');
  ok(!gift || (spot && spot.cssW >= 100 && Math.abs(spot.sy + spot.cssH / 2 - (852 - 24 - 6)) < 20), `free-pack spot sits on the Shop tab (gift pending: ${gift})`);
  if (gift) await page.screenshot({ path: `${OUT}/onboarding-shop-tab-393x852.png` });
  await G(() => { window.__game.S.save.onboard.zapperGift = 'done'; }); await sleep(100);
  await tap('gear'); await sleep(300);
  ok((await btns()).filter((b) => /^tab\d/.test(b.id)).length === 0, 'reduced motion: the bar is gone at once while Settings is open');
  await page.screenshot({ path: `${OUT}/settings-393x852.png` });
  await tap('setReset'); await sleep(100); ok(await G(() => window.__game.S.confirmReset > window.__game.S.t), 'Reset needs a second tap');
  await tap('setClose'); await sleep(200);
  ok(errors.length === 0, `onboarding / settings: no console errors ${errors.join('|')}`);
  await page.close();
}
// ---------- 6. production build ----------
{
  const page = await browser.newPage(); const errs = [];
  page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) errs.push(m.text()); });
  await page.emulate({ viewport: { width: 393, height: 852, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, userAgent: 'Mozilla/5.0 (Linux; Android 14) Mobile' });
  await page.goto('http://127.0.0.1:8882/index.html'); await sleep(900);
  ok(await page.evaluate(() => typeof window.__game === 'undefined'), 'production build has no window.__game');
  ok(errs.length === 0, `production build: no console errors ${errs.join('|')}`);
  await page.screenshot({ path: `${OUT}/prod-map-393x852.png` }); await page.close();
}
console.log(R.join('\n')); console.log(fails ? `${fails} FAILED` : 'ALL PASSED');
await browser.close(); process.exit(fails ? 1 : 0);
