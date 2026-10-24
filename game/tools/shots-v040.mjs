// v0.4.0 key visuals -> /workspace/ant-td/screens/v0.4.1/ (npm run shots:v040)
//   v040-map-*.png        winding road + new stage markers (fresh / progress), Cards button blink
//   v040-calendar-*.png   3x3 weekly layout, wide day-7 tile (L2 card + 5 diamonds), monthly boxes, day-30 box claim
//   v040-treat-faces.png  animated bite reactions (cookie + a cake body using the same scheme), sampled over time
//   v040-battle-*.png     treat reaction in battle, Roasted Lava, fan area circle (no arrows), diamonds in the HUD
import puppeteer from 'puppeteer-core';
import { mkdirSync, writeFileSync } from 'node:fs';
import { serve } from './serve.mjs';
const OUT = '/workspace/ant-td/screens/v0.4.1'; mkdirSync(OUT, { recursive: true });
const srv = await serve(8783, 'www-test');
const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox', '--disable-gpu'] });
const page = await browser.newPage();
await page.emulate({ viewport: { width: 393, height: 852, deviceScaleFactor: 2.75, isMobile: true, hasTouch: true }, userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130 Mobile Safari/537.36' });
const errors = []; page.on('pageerror', (e) => errors.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
await page.goto('http://127.0.0.1:8783/index.html', { waitUntil: 'load' });
await page.waitForFunction(() => window.__game);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const G = (fn, arg) => page.evaluate(fn, arg);
const shot = async (name, wait = 400) => { await sleep(wait); await page.screenshot({ path: `${OUT}/${name}.png` }); console.log('saved', `${OUT}/${name}.png`); };

// ---- map: fresh, then progress; Cards blink (first time a card is affordable)
await G(() => { const g = window.__game; g.S.cal = null; const s = g.M.newSave(); s.coins = 0; g.Cal.touch(s, g.now()); g.setSave(s); g.go('map'); });
await shot('v040-map-fresh');
await G(() => { const g = window.__game; const s = g.S.save; s.levels.forEach((l, i) => { if (i < 6) { l.cleared = true; l.stars = [3, 2, 3, 1, 3, 2][i]; } }); s.coins = 30; g.S.cardsBlinkUntil = 0; });
await sleep(120);
const blink = await G(() => { const g = window.__game; return { until: g.S.cardsBlinkUntil - g.S.t, flags: g.S.save.cardBlink }; });
console.log('cards blink after becoming affordable:', JSON.stringify(blink));
await shot('v040-map-progress-cards-blink', 150);

// ---- calendar: day 7 of the cycle on streak day 30 (wide tile + biggest monthly box), before and after claiming
await G(() => {
  const g = window.__game; const s = g.S.save; const c = s.calendar; const today = g.Cal.dayNumber(g.now());
  Object.assign(c, { pos: 5, lastVisitDay: today - 1, cycleStartDay: today - 6, lastClaimDay: today - 1, lastClaimTs: g.now() - 86400000, streak: 29, coinStep: 8,
    weekClaimed: [true, true, true, false, true, true, false], weekGot: [{ kind: 'coins', count: 20 }, { kind: 'coins', count: 20 }, { kind: 'diamonds', count: 5 }, null, { kind: 'card', count: undefined }, { kind: 'diamonds', count: 5 }] });
  g.openCalendar();
});
await shot('v040-calendar-day7-streak30', 700);
await G(() => { const g = window.__game; const st = g.Cal.status(g.S.save, g.now()); return st.tile; }).then((t) => console.log('calendar tile today:', t + 1));
await G(() => { const b = window.__game.buttons().find((q) => q.id === 'calTile6'); return b; }).then(async (b) => { await page.touchscreen.tap(b.sx, b.sy); });
await shot('v040-calendar-day7-claimed', 900);
const got = await G(() => { const r = window.__game.S.cal.result; return { prize: r.prize && r.prize.kind, level: r.prize && r.prize.level, extra: r.extra, milestone: r.milestone && { kind: r.milestone.kind, level: r.milestone.level } }; });
console.log('day-7 claim:', JSON.stringify(got));
await G(() => { window.__game.S.cal = null; });

// ---- treat faces gallery (canvas)
const b64 = await G(() => {
  const { A, C } = window.__game; const R = ['surprised', 'oyoy', 'sad', 'crying']; const ages = [0.12, 0.45, 1.1];
  const W = 1500, H = 1180; const cv = document.createElement('canvas'); cv.width = W; cv.height = H; const g = cv.getContext('2d');
  const bg = g.createLinearGradient(0, 0, 0, H); bg.addColorStop(0, '#fff3e8'); bg.addColorStop(1, '#fde0d4'); g.fillStyle = bg; g.fillRect(0, 0, W, H);
  A.text(g, 'v0.4 treat faces - animated reactions while ants eat (one scheme for every world\'s treat)', W / 2, 44, 28, '#ffb3c1');
  R.forEach((f, ri) => {
    const y = 170 + ri * 230; A.text(g, f === 'oyoy' ? '"oy oy oy!"' : f, 110, y, 24, '#7a5a6a', 'center', null);
    ages.forEach((age, k) => { g.save(); g.translate(330 + k * 250, y); g.scale(2, 2); A.drawTreat(g, 'cookie', 0, 0, 0.7, 2 + age * 1.7 + k * 0.13, { react: { face: f, age } }); g.restore(); A.text(g, `t=${age}s`, 330 + k * 250, y + 90, 15, '#a08090', 'center', null); });
    g.save(); g.translate(1230, y); g.scale(2, 2); A.drawTreat(g, 'cake', 0, 0, 0.7, 2.3 + ri, { react: { face: f, age: 0.5 }, bubble: 'left' }); g.restore();
  });
  A.text(g, 'cookie (world 1) - three moments of each animation', 580, 1110, 18, '#7a5a6a', 'center', null);
  A.text(g, 'same faces on a future treat (cake)', 1230, 1110, 18, '#7a5a6a', 'center', null);
  return cv.toDataURL('image/png').split(',')[1];
});
writeFileSync(`${OUT}/v040-treat-faces.png`, Buffer.from(b64, 'base64')); console.log('saved', `${OUT}/v040-treat-faces.png`);

// ---- battle: Roasted Lava on the trail, fan + marble beside it, ants walking; diamonds in the HUD
await G(() => {
  const g = window.__game; const s = g.S.save; for (const id of ['lava', 'laser', 'sound']) g.M.unlockCard(s, id); s.diamonds = 37;
  g.openPrep(2); g.S.prep.deck = ['lava', 'fan', 'ball', 'slingshot', 'laser']; g.startBattle(2, g.S.prep.deck, ['bomb', 'freeze'], 7);
  const b = g.S.battle; b.addCrumbs(400);
  const pts = b.path.pts; const pick = (f) => pts[Math.floor(pts.length * f)];
  const lp = pick(0.35); b.addTower('lava', Math.floor(lp.x / 40), Math.floor(lp.y / 40));
  // fan and marble on free side tiles near the trail
  const free = (c, r) => c >= 0 && r >= 0 && c < g.C.GRID_COLS && r < g.C.GRID_ROWS && !b.isPathTile(c, r) && !b.towers.some((t) => t.c === c && t.r === r);
  let placed = 0;
  for (const f of [0.55, 0.75]) { const p = pick(f); const c0 = Math.floor(p.x / 40), r0 = Math.floor(p.y / 40);
    for (const [dc, dr] of [[0, 1], [1, 0], [0, -1], [-1, 0]]) if (free(c0 + dc, r0 + dr)) { b.addTower(placed ? 'ball' : 'fan', c0 + dc, r0 + dr); placed++; break; } }
  g.S.speed = 1;
});
await G(() => window.__game.simulate(13, false));
await G(() => { const g = window.__game; g.S.info = { tower: g.S.battle.towers.find((t) => t.type === 'fan') }; });
await shot('v040-battle-fan-circle-no-arrows', 500);
await G(() => { const g = window.__game; g.S.info = { tower: g.S.battle.towers.find((t) => t.type === 'lava') }; });
await shot('v040-battle-lava-info', 500);
await G(() => { const g = window.__game; g.S.info = null; });
await shot('v040-battle-lava-roasting', 200);
// treat reaction in battle: three quick bites -> "oy oy oy!"
await G(() => { const g = window.__game; for (let k = 0; k < 3; k++) g.Treat.onBite(g.S.treat, g.S.t, 1); });
await shot('v040-battle-treat-oyoy', 450);
await G(() => { const g = window.__game; g.Treat.onBite(g.S.treat, g.S.t, 50); });
await shot('v040-battle-treat-crying-queen-bite', 500);
// Large ants on screen (Heavy Knight, level 10)
await G(() => { const g = window.__game; g.startBattle(9, ['laser', 'sound', 'slingshot', 'gate', 'lava'], ['bomb', 'freeze'], 3); });
await G(() => window.__game.simulate(40, true));
await shot('v040-battle-level10-heavy-knights', 300);
console.log('errors:', errors.length ? errors : 'none');
await browser.close(); srv.close();
if (errors.length) process.exit(1);
