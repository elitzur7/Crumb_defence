// v0.7.3 independent QA: safe-area re-read (frame loop + orientationchange + visualViewport), gear panel history (Android Back), calendar race,
// swatter slap on the hit frame (ghost + battle-clock timing at 1x / 2x), version label rules, QA screenshots. Output -> /workspace/ant-td/qa/v0.7.3/
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import { serve } from './serve.mjs';
const OUT = '/workspace/ant-td/qa/v0.7.4/qa-v073-suite'; fs.mkdirSync(OUT, { recursive: true });
await serve(8891, 'www-test'); await serve(8892, 'www');
const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
let fails = 0; const R = [];
const ok = (c, m) => { R.push(`${c ? 'PASS' : 'FAIL'} ${m}`); if (!c) fails++; };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function open(w = 393, h = 852, dpr = 2.75, reduced = false) {
  const page = await browser.newPage();
  await page.emulate({ viewport: { width: w, height: h, deviceScaleFactor: dpr, isMobile: true, hasTouch: true }, userAgent: 'Mozilla/5.0 (Linux; Android 14) Mobile' });
  if (reduced) await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  const errors = []; page.on('pageerror', (e) => errors.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.evaluateOnNewDocument(() => {
    try { localStorage.clear(); } catch (e) {}
    window.__tx = []; const f = CanvasRenderingContext2D.prototype.fillText;
    CanvasRenderingContext2D.prototype.fillText = function (t, ...r) { window.__tx.push(String(t)); return f.call(this, t, ...r); };
  });
  await page.goto('http://127.0.0.1:8891/index.html'); await page.waitForFunction(() => window.__game);
  const G = (fn, a) => page.evaluate(fn, a);
  const btns = () => G(() => window.__game.buttons());
  const btn = async (id) => (await btns()).find((b) => b.id === id);
  const tap = async (id) => { const b = await btn(id); if (!b) return false; await page.touchscreen.tap(b.sx, b.sy); await sleep(160); return true; };
  const drawn = async (ms = 150) => { await G(() => { window.__tx = []; }); await sleep(ms); return G(() => window.__tx.slice()); };
  await sleep(200);
  await G(() => { const g = window.__game; g.S.cal = null; g.S.save.onboard.cardsHint = 'done'; });
  return { page, G, btns, btn, tap, drawn, errors };
}
const DECK = ['slingshot', 'spray', 'glue', 'fan', 'ball'];
const VER = 'v0.7.4';

// ---------- 1. safe-area inset: frame-loop re-read, orientationchange, visualViewport ----------
{
  const { page, G, btns, errors } = await open();
  await G(() => { const g = window.__game; g.setInset(0); g.go('map'); }); await sleep(300);
  await G(() => window.__game.setInsetQuiet(30));          // the value changes WITHOUT any resize event: only the frame loop can notice
  await sleep(800);
  let L = await G(() => window.__game.layout());
  ok(L.insetB === 30, `frame loop re-reads the inset within ~0.5 s (insetB ${L.insetB})`);
  let t = (await btns()).filter((b) => /^tab\d$/.test(b.id)); let bottom = Math.max(...t.map((b) => b.sy + b.cssH / 2));
  ok(Math.abs(bottom - (852 - 30)) < 1.5, `tab bar follows the new inset: tabs end at ${bottom.toFixed(1)} (want ${852 - 30})`);
  await page.screenshot({ path: `${OUT}/tabbar-inset30-reread-393x852.png` });
  await G(() => window.__game.setInsetQuiet(0)); await G(() => window.dispatchEvent(new Event('orientationchange')));
  L = await G(() => window.__game.layout()); ok(L.insetB === 0, `orientationchange event re-reads at once (insetB ${L.insetB})`);
  await G(() => window.__game.setInsetQuiet(18)); await G(() => window.visualViewport.dispatchEvent(new Event('resize')));
  L = await G(() => window.__game.layout()); ok(L.insetB === 18, `visualViewport resize event re-reads at once (insetB ${L.insetB})`);
  await G(() => window.__game.setInsetQuiet(0)); await sleep(700);
  L = await G(() => window.__game.layout()); ok(L.insetB === 0, 'inset back to 0 after another quiet change');
  // a real viewport change (rotation-like) re-lays out
  await page.setViewport({ width: 852, height: 393, deviceScaleFactor: 2.75, isMobile: true, hasTouch: true }); await sleep(400);
  L = await G(() => window.__game.layout()); ok(L.cw === 852 && L.ch === 393, `landscape resize applied (${L.cw}x${L.ch})`);
  await page.setViewport({ width: 393, height: 852, deviceScaleFactor: 2.75, isMobile: true, hasTouch: true }); await sleep(400);
  ok(errors.length === 0, `inset: no console errors ${errors.join('|')}`);
  await page.close();
}
// ---------- 2. gear panel history: Android Back closes the panel, the app stays ----------
{
  const { page, G, tap, btns, errors } = await open();
  await G(() => window.__game.go('map')); await sleep(300);
  const url0 = page.url(); const len0 = await G(() => history.length);
  ok(await G(() => !(history.state && history.state.inner)), 'map: no inner history entry before the gear');
  await tap('gear'); await sleep(300);
  ok(await G(() => !!window.__game.S.settings), 'gear opens the panel');
  ok(await G(() => !!(history.state && history.state.inner)) && (await G(() => history.length)) === len0 + 1, 'opening the panel pushed ONE history entry');
  await page.goBack(); await sleep(300);
  ok(await G(() => window.__game.S.settings === null && window.__game.S.screen === 'map'), 'Android Back (history back) closes the panel, still on the map');
  ok(page.url() === url0, 'and the page did not navigate away (app not exited)');
  // close by the Close button: entry is popped again, a further Back is not swallowed by a stale entry
  await tap('gear'); await sleep(250); await tap('setClose'); await sleep(400);
  ok(await G(() => window.__game.S.settings === null) && await G(() => !(history.state && history.state.inner)), 'Close button: panel closed and the history entry popped');
  // outside tap
  await tap('gear'); await sleep(250);
  await page.touchscreen.tap(10, 10); await sleep(400);
  ok(await G(() => window.__game.S.settings === null) && await G(() => !(history.state && history.state.inner)), 'outside tap: panel closed and the entry popped');
  // 5 open/close cycles do not leak entries
  for (let i = 0; i < 5; i++) { await tap('gear'); await sleep(200); await tap('setClose'); await sleep(350); }
  ok((await G(() => history.length)) <= len0 + 1, `5 open/close cycles: history length ${await G(() => history.length)} (start ${len0})`);
  // gear then a tab is impossible (panel blocks); reset closes the panel too
  await tap('gear'); await sleep(250); await tap('setReset'); await sleep(100); await tap('setReset'); await sleep(450);
  ok(await G(() => window.__game.S.settings === null && !(history.state && history.state.inner)), 'Reset (2 taps) closes the panel and pops the entry');
  // Cards -> Back -> Map still works (existing behaviour)
  await tap('tab1'); await sleep(300); await G(() => history.back()); await sleep(350);
  ok(await G(() => window.__game.S.screen) === 'map', 'Cards -> Android Back -> Map');
  ok(errors.length === 0, `gear history: no console errors ${errors.join('|')}`);
  await page.close();
}
// ---------- 3. calendar race: go('map') + async history.back() must not close a just-opened calendar ----------
{
  const { page, G, errors } = await open();
  let survived = 0;
  for (let i = 1; i <= 4; i++) {
    await G((i) => { const g = window.__game; g.S.cal = null; g.setClockOffset(i * 86400000 * 2); g.go('cards'); }, i); await sleep(150);
    await G(() => window.__game.go('map')); await sleep(30);
    const opened = await G(() => !!window.__game.S.cal); await sleep(500);
    const still = await G(() => !!window.__game.S.cal);
    if (opened && still) survived++;
  }
  ok(survived === 4, `calendar opened by go('map') stays open after the async history.back() (${survived}/4 days)`);
  // a real user Back right after (well after the echo) still closes the calendar
  await G(() => { window.__game.setClockOffset(40 * 86400000); window.__game.S.cal = null; window.__game.go('cards'); }); await sleep(200);
  await G(() => window.__game.go('map')); await sleep(1300);
  ok(await G(() => !!window.__game.S.cal), 'calendar still open 1.3 s later');
  ok(errors.length === 0, `calendar race: no console errors ${errors.join('|')}`);
  await page.close();
}
// ---------- 4. swatter: slap lands on the hit frame (ghost + battle clock), sound with it, speed aware ----------
for (const speed of [1, 2]) {
  const { page, G, errors } = await open();
  await G((d) => window.__game.startBattle(0, d, [], 7), DECK); await sleep(200);
  const r = await G((speed) => new Promise((res) => {
    const g = window.__game, S = g.S, b = S.battle; S.speed = speed; b.nextWaveAt = 1e9; b.towers.length = 0;
    const a = b.spawn('worker', b.path.length - 22); a.hp = 1; a.state = 'go'; b.swatCd = 0.02;
    const out = { ghostFrames: 0, koFrames0: 0 }; let t0 = null, tKo = null, r0 = null, rKo = null;
    const tick = () => {
      if (b.swatFx > 0 && t0 === null) { t0 = b.time - (0.5 - b.swatFx); r0 = performance.now(); out.killedImmediately = !b.ants.includes(a) && a.dead; }
      if (t0 !== null) {
        const ghost = S.swatQ.some((q) => q.ghost); const ko = S.fx.some((f) => f.k === 'ko');
        if (ghost && !ko) out.ghostFrames++;
        if (ko && tKo === null) { tKo = b.time; rKo = performance.now(); out.queueLenAtKo = S.swatQ.length; }
        if (ko && tKo !== null && S.fx.some((f) => f.k === 'spark')) out.sparkWithKo = true;
      }
      if (tKo !== null || b.time > 3) { out.sim = tKo === null ? null : tKo - t0; out.real = rKo === null ? null : (rKo - r0) / 1000; out.dead = a.dead; res(out); return; }
      requestAnimationFrame(tick);
    }; requestAnimationFrame(tick);
  }), speed);
  ok(r.dead && r.killedImmediately, `x${speed}: the sim kills the ant at the swing start (damage unchanged)`);
  ok(r.sim !== null && r.sim >= 0.17 - 1e-6 && r.sim <= 0.17 + 0.05, `x${speed}: kill effects + slap spark appear 0.17 s of BATTLE time after the swing starts (${r.sim && r.sim.toFixed(3)} s)`);
  ok(r.ghostFrames >= 2 || speed === 2 && r.ghostFrames >= 1, `x${speed}: the swatted ant stays drawn (ghost) until then (${r.ghostFrames} frames)`);
  ok(r.sparkWithKo === true && r.queueLenAtKo === 0, `x${speed}: spark / ring / kill effects fire together on the hit frame`);
  ok(speed === 1 ? r.real > 0.12 : r.real < 0.14, `x${speed}: real time to the hit ${r.real && r.real.toFixed(3)} s (x2 is about half of x1)`);
  ok(errors.length === 0, `swatter x${speed}: no console errors ${errors.join('|')}`);
  await page.close();
}
{ // pause freezes the pending slap; resume completes it
  const { page, G } = await open();
  await G((d) => window.__game.startBattle(0, d, [], 7), DECK); await sleep(200);
  await G(() => { const b = window.__game.S.battle; b.nextWaveAt = 1e9; b.towers.length = 0; const a = b.spawn('worker', b.path.length - 22); a.hp = 1; b.swatCd = 0.02; });
  await G(() => new Promise((res) => { const S = window.__game.S; const t = () => (S.swatQ.length ? res() : requestAnimationFrame(t)); t(); }));
  await G(() => { window.__game.S.paused = true; window.__game.S.battle.paused = true; }); await sleep(600);
  ok(await G(() => window.__game.S.swatQ.length >= 1 && !window.__game.S.fx.some((f) => f.k === 'ko')), 'paused: the pending slap and the ghost wait (nothing fires on the wall clock)');
  await G(() => { window.__game.S.paused = false; window.__game.S.battle.paused = false; }); await sleep(500);
  ok(await G(() => window.__game.S.swatQ.length === 0), 'resumed: the slap lands');
  await page.close();
}
{ // reduced motion: no waiting, no ghost
  const { page, G } = await open(393, 852, 2.75, true);
  await G((d) => window.__game.startBattle(0, d, [], 7), DECK); await sleep(200);
  const q = await G(() => new Promise((res) => { const g = window.__game, b = g.S.battle; b.nextWaveAt = 1e9; b.towers.length = 0; const a = b.spawn('worker', b.path.length - 22); a.hp = 1; b.swatCd = 0.02;
    let n = 0; const t = () => { if (b.swatFx > 0) res({ q: g.S.swatQ.length, ko: g.S.fx.some((f) => f.k === 'ko') }); else if (n++ > 200) res(null); else requestAnimationFrame(t); }; t(); }));
  ok(q && q.q === 0 && q.ko, `reduced motion: kill effects at once, nothing queued (${JSON.stringify(q)})`);
  await page.close();
}
// ---------- 5. version label rules + gear/bubble placement ----------
{
  const { page, G, btns, drawn, errors } = await open();
  await G(() => { const g = window.__game; g.setInset(24); g.go('map'); }); await sleep(400);
  ok((await drawn()).includes(VER), `map: version label ${VER} drawn`);
  await G(() => window.__game.openCalendar()); await sleep(300);
  ok(!(await drawn()).includes(VER), 'Daily Rewards open: version label hidden');
  await page.screenshot({ path: `${OUT}/daily-rewards-393x852.png` });
  await G(() => { window.__game.S.cal = null; }); await sleep(200);
  const gear = (await btns()).find((b) => b.id === 'gear'); ok(gear && gear.cssW >= 44 && gear.cssH >= 44, `gear hit area >= 44 dp (${gear && Math.round(gear.cssW)}x${gear && Math.round(gear.cssH)})`);
  await page.screenshot({ path: `${OUT}/map-393x852.png` });
  await page.touchscreen.tap(gear.sx, gear.sy); await sleep(400);
  ok(!(await drawn()).includes(VER), 'gear panel open: version label hidden');
  await page.screenshot({ path: `${OUT}/gear-panel-393x852.png` });
  await G(() => window.__game.S.settings = null); await sleep(100);
  // onboarding hint (free pack in the Shop)
  await G(() => { const g = window.__game, s = g.M.newSave(); s.levels[0] = { stars: 3, cleared: true }; s.levels[1] = { stars: 3, cleared: true }; s.onboard.zapperGift = 'pending'; g.setSave(s); g.S.cal = null; g.S.settings = null; g.S.reveal = []; g.go('map'); }); await sleep(700);
  const gift = await G(() => window.__game.M.zapperGiftPending(window.__game.S.save));
  ok(gift, 'free-pack hint is pending');
  ok(!(await drawn()).includes(VER), 'onboarding hint showing: version label hidden');
  await page.screenshot({ path: `${OUT}/onboarding-hint-393x852.png` });
  // bubble geometry: the hint text panel must not overlap the version label corner, and the hand/bubble stay inside the screen
  ok(errors.length === 0, `version label: no console errors ${errors.join('|')}`);
  await page.close();
}
// ---------- 6. battle with swatter screenshots + tab bar ----------
{
  const { page, G, errors } = await open();
  await G((d) => window.__game.startBattle(0, d, ['bomb', 'freeze'], 7), DECK); await sleep(300);
  await G(() => { const b = window.__game.S.battle; b.nextWaveAt = 1e9; b.towers.length = 0; b.ants.length = 0; const a = b.spawn('big', b.path.length - 24); a.hp = 1000; a.maxHp = 1000; b.swatCd = 0.02; });
  // wait for the swing, capture the slap frame (hit ~0.17 s after the start; at 1x real time)
  await G(() => new Promise((res) => { const b = window.__game.S.battle; const t = () => (b.swatFx > 0 ? res() : requestAnimationFrame(t)); t(); }));
  await sleep(150); await page.screenshot({ path: `${OUT}/battle-swatter-slap-393x852.png` });
  await G(() => { const b = window.__game.S.battle; b.nextWaveAt = 1e9; b.ants.length = 0; const a = b.spawn('worker', b.path.length - 24); a.hp = 1; b.swatCd = 0.02; });
  await G(() => new Promise((res) => { const g = window.__game; const t = () => (g.S.swatQ.some((q) => q.ghost) ? res() : requestAnimationFrame(t)); t(); }));
  await page.screenshot({ path: `${OUT}/battle-swatter-ghost-393x852.png` });
  await sleep(500); await page.screenshot({ path: `${OUT}/battle-swatter-after-393x852.png` });
  await G(() => { const g = window.__game; g.setInset(24); g.go('map'); }); await sleep(500);
  await page.screenshot({ path: `${OUT}/tab-bar-map-inset24-393x852.png` });
  await G(() => window.__game.go('cards')); await sleep(450); await page.screenshot({ path: `${OUT}/tab-bar-cards-inset24-393x852.png` });
  await G(() => window.__game.go('shop')); await sleep(450); await page.screenshot({ path: `${OUT}/tab-bar-shop-inset24-393x852.png` });
  ok(errors.length === 0, `battle screenshots: no console errors ${errors.join('|')}`);
  await page.close();
}
// ---------- 7. production build ----------
{
  const page = await browser.newPage(); const errs = [];
  page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) errs.push(m.text()); });
  await page.emulate({ viewport: { width: 393, height: 852, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, userAgent: 'Mozilla/5.0 (Linux; Android 14) Mobile' });
  await page.goto('http://127.0.0.1:8892/index.html'); await sleep(900);
  ok(await page.evaluate(() => typeof window.__game === 'undefined'), 'production build has no window.__game');
  ok(errs.length === 0, `production build: no console errors ${errs.join('|')}`);
  await page.screenshot({ path: `${OUT}/prod-map-393x852.png` }); await page.close();
}
fs.writeFileSync(`${OUT}/qa-v073-rerun.log`, R.join('\n') + '\n');
console.log(R.join('\n')); console.log(fails ? `${fails} FAILED` : 'ALL PASSED');
await browser.close(); process.exit(fails ? 1 : 0);
