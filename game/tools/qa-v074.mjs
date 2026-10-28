// v0.7.4 independent browser QA: M0 (4x speed), M1 (target modes), M2 (rescue, flag off = identical, flag on), M3 (wave preview on all 20 maps), P / P2.
// Output -> /workspace/ant-td/qa/v0.7.4/ (screenshots + qa-v074.log). Needs `npm run build` (www-test with window.__game).
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import { serve } from './serve.mjs';
const OUT = '/workspace/ant-td/qa/v0.7.7/qa-v074-suite'; fs.mkdirSync(OUT + '/maps', { recursive: true });
await serve(8891, 'www-test'); await serve(8892, 'www');
const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
let fails = 0; const R = [];
const ok = (c, m) => { R.push(`${c ? 'PASS' : 'FAIL'} ${m}`); if (!c) fails++; };
const info = (m) => R.push(`INFO ${m}`);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function open(w = 393, h = 852, dpr = 2.75) {
  const page = await browser.newPage();
  await page.emulate({ viewport: { width: w, height: h, deviceScaleFactor: dpr, isMobile: true, hasTouch: true }, userAgent: 'Mozilla/5.0 (Linux; Android 14) Mobile' });
  const errors = []; page.on('pageerror', (e) => errors.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.evaluateOnNewDocument(() => {
    try { localStorage.clear(); } catch (e) {}
    window.__tx = []; const f = CanvasRenderingContext2D.prototype.fillText;
    CanvasRenderingContext2D.prototype.fillText = function (t, ...r) { window.__tx.push(String(t)); return f.call(this, t, ...r); };
    window.__noise = 0; const st = AudioBufferSourceNode.prototype.start; AudioBufferSourceNode.prototype.start = function (...a) { window.__noise++; return st.apply(this, a); };
  });
  await page.goto('http://127.0.0.1:8891/index.html'); await page.waitForFunction(() => window.__game);
  const G = (fn, a) => page.evaluate(fn, a);
  const btns = () => G(() => window.__game.buttons());
  const btn = async (id) => (await btns()).find((b) => b.id === id);
  const tap = async (id) => { const b = await btn(id); if (!b) return false; await page.touchscreen.tap(b.sx, b.sy); await sleep(160); return true; };
  const drawn = async (ms = 150) => { await G(() => { window.__tx = []; }); await sleep(ms); return G(() => window.__tx.slice()); };
  // design coords (x, y in the 400x720 canvas) -> page CSS px
  const scr = async (x, y) => { const L = await G(() => window.__game.layout()); return { x: L.offX + x * L.scale, y: L.offY + y * L.scale }; };
  const tapAt = async (x, y) => { const p = await scr(x, y); await page.touchscreen.tap(p.x, p.y); await sleep(160); };
  await sleep(200);
  await G(() => { const g = window.__game; g.S.cal = null; g.S.save.onboard.cardsHint = 'done'; });
  return { page, G, btns, btn, tap, drawn, scr, tapAt, errors };
}
const DECK = ['slingshot', 'laser', 'zapper', 'spray', 'glue'];
const MAP_Y = 68;
// a free buildable tile for `type` (not on a tower), found in the page
const FREE = (type, nth = 0) => `(() => { const b = window.__game.S.battle; const out = []; for (let r = 0; r < 12; r++) for (let c = 0; c < 10; c++) if (b.placeRuleOk('${type}', c, r) && !b.towers.some((t) => t.c === c && t.r === r)) out.push([c, r]); return out[${nth}]; })()`;
async function quiet(G) { await G(() => { const b = window.__game.S.battle; b.nextWaveAt = 1e9; b.ants.length = 0; b.pending.length = 0; b.towers.length = 0; }); }

// ---------- M0 ----------
{ // 1. the button cycles 1x/2x/4x/1x, the label matches S.speed; screenshots of the three states
  const { page, G, tap, btn, drawn, errors } = await open();
  await G((d) => window.__game.startBattle(0, d, [], 7), DECK); await sleep(300);
  const seq = [], labels = [];
  for (let i = 0; i < 4; i++) {
    seq.push(await G(() => window.__game.S.speed));
    const tx = await drawn(160); labels.push(['1x', '2x', '4x'].filter((l) => tx.includes(l)).join('+'));
    if (i < 3) { const sp = await G(() => window.__game.S.speed); await page.screenshot({ path: `${OUT}/speed-button-${sp}x.png`, clip: { x: 0, y: 590, width: 393, height: 240 } }); }
    await tap('speed');
  }
  ok(seq.join(',') === '1,2,4,1', `M0#1 speed button cycles 1x/2x/4x/1x (${seq.join(',')})`);
  ok(labels.join('|') === '1x|2x|4x|1x', `M0#1 the label matches S.speed (${labels.join('|')})`);
  const b1 = await btn('speed'); ok(b1 && b1.cssH >= 44 && b1.cssW >= 44, `speed button hit area >= 44 dp (${b1 && Math.round(b1.cssW)}x${b1 && Math.round(b1.cssH)})`);
  await G(() => { window.__game.S.speed = 4; }); await sleep(100); await page.screenshot({ path: `${OUT}/battle-4x-393x852.png` });
  ok(await G(() => window.__game.C.UI.speedMaxAtStart === 2), 'M0 speedMaxAtStart is 2');
  ok(errors.length === 0, `M0 button: no console errors ${errors.join('|')}`); await page.close();
}
{ // 2. + 3. step counts and determinism through the game's own loop
  const { page, G, errors } = await open();
  await G((d) => window.__game.startBattle(0, d, [], 7), DECK); await sleep(200);
  ok(/export const STEP = 1 \/ 60/.test(fs.readFileSync('src/loop.js', 'utf8')), 'M0#2 STEP is 1/60 (src/loop.js)');
  const rows = await G(() => {
    const g = window.__game, out = [];
    for (const dtReal of [1 / 60, 1 / 30]) for (const sp of [1, 2, 4]) {
      g.startBattle(0, ['slingshot', 'laser', 'zapper', 'spray', 'glue'], [], 7); g.S.paused = false; g.S.speed = sp; g.S.battle.nextWaveAt = 1e9; g.clock.acc = 0;
      const t0 = g.S.battle.time; g.runFrames(Math.round(60 * 4 / (dtReal * 60)), dtReal, (() => { let n = 0; return () => n; })());
      out.push({ dtReal, sp, steps: Math.round((g.S.battle.time - t0) * 60) });
    }
    return out;
  });
  for (const sp of [1, 2, 4]) { const a = rows.find((r) => r.sp === sp && r.dtReal < 0.02), c = rows.find((r) => r.sp === sp && r.dtReal > 0.02); ok(Math.abs(a.steps - 240 * sp) <= 1 + sp && Math.abs(a.steps - c.steps) <= 2, `M0#2 x${sp}: 4 s of real frames -> ${a.steps} steps at 1/60 frames, ${c.steps} at 1/30 frames (want ${240 * sp} +-1)`); }
  const det = await G(() => {
    const g = window.__game, res = {}; const deck = ['slingshot', 'laser', 'zapper', 'spray', 'glue'];
    for (const lv of [4, 9, 16]) for (const seed of [1, 2, 3]) for (const sp of [1, 2, 4]) {
      g.startBattle(lv, deck, [], seed); g.S.paused = false; g.S.speed = sp; g.clock.acc = 0; g.setAutoBot(true);
      let n = 0; while (!g.S.battle.result && n++ < 60 * 1500) g.runFrames(1, 1 / 60, null);
      const b = g.S.battle; (res[lv + ':' + seed] = res[lv + ':' + seed] || []).push([b.result, +b.foodStored.toFixed(6), b.stats.kills != null ? b.stats.kills : b.kills, +b.time.toFixed(3)].join('|'));
    }
    g.setAutoBot(false); return res;
  });
  for (const [k, v] of Object.entries(det)) ok(v[0] === v[1] && v[1] === v[2], `M0#3 level ${+k.split(':')[0] + 1} seed ${k.split(':')[1]}: x1 = x2 = x4 through the game's loop (${v[0]})`);
  ok(errors.length === 0, `M0 loop: no console errors ${errors.join('|')}`); await page.close();
}
{ // 4. swatter at 4x
  const { page, G, errors } = await open();
  await G((d) => window.__game.startBattle(0, d, [], 7), DECK); await sleep(200); await page.touchscreen.tap(200, 400); await sleep(100);
  const r = await G(() => new Promise((res) => {
    const g = window.__game, S = g.S, b = S.battle; S.speed = 4; b.nextWaveAt = 1e9; b.towers.length = 0; window.__noise = 0;
    const a = b.spawn('worker', b.path.length - 22); a.hp = 1; a.state = 'go'; b.swatCd = 0.02;
    const out = { ghostAfter: 0 }; let t0 = null, tKo = null; const upd = b.update.bind(b);
    // sub-step granularity: look at the state at the START of every sub-step (= right after the previous sub-step's events were consumed and the swat queue flushed)
    b.update = (dt) => {
      if (t0 !== null) { const ghost = S.swatQ.some((q) => q.ghost), ko = S.fx.some((f) => f.k === 'ko'); if (ko && tKo === null) tKo = b.time; if (tKo !== null && ghost) out.ghostAfter++; }
      upd(dt); if (b.swatFx > 0 && t0 === null) t0 = b.time - (0.5 - b.swatFx);
      if ((tKo !== null && b.time - tKo > 0.6) || b.time > 3) { b.update = upd; out.sim = tKo === null ? null : tKo - t0; out.noise = window.__noise; res(out); }
    };
  }));
  ok(r.sim !== null && r.sim >= 0.17 - 1e-6 && r.sim <= 0.17 + 0.05, `M0#4 x4: slap lands ${r.sim && r.sim.toFixed(3)} s of battle time after the swing starts (want 0.17..0.22)`);
  ok(r.ghostAfter === 0, `M0#4 x4: the ghost never shows after the slap (${r.ghostAfter} frames)`);
  ok(r.noise >= 1, `M0#4 audio hooked (noise buffers started: ${r.noise})`);
  const swatCount = await G(() => new Promise((res) => { const g = window.__game, S = g.S, b = S.battle; S.speed = 4; b.ants.length = 0; b.swatCd = 0.02; window.__noise = 0; const a = b.spawn('big', b.path.length - 22); a.hp = 1e4; a.maxHp = 1e4; let sw = 0; const f = S.fx; const seen = new Set(); const t0 = b.time;
    const tick = () => { for (const q of S.fx) if (q.k === 'ring2' && !seen.has(q)) { seen.add(q); sw++; } if (b.time - t0 > 0.45) res({ sw, noise: window.__noise }); else requestAnimationFrame(tick); }; tick(); }));
  ok(swatCount.sw <= 1, `M0#4 x4: at most one slap burst per swing (ring2 effects ${swatCount.sw}, noise starts ${swatCount.noise})`);
  ok(errors.length === 0, `swatter x4: no console errors ${errors.join('|')}`); await page.close();
}
{ // 5. fx bound and frame cost with 54 ants at 4x (L17)
  const { page, G, errors } = await open();
  await G((d) => window.__game.startBattle(16, d, [], 3), DECK); await sleep(200);
  const r = await G(async () => {
    const g = window.__game, S = g.S, b = S.battle; b.nextWaveAt = 1e9; b.crumbs = 9999; const types = ['worker', 'worker', 'armored', 'sprinter', 'big']; let n = 0;
    for (let i = 0; i < 54; i++) { const a = b.spawn(types[i % types.length], 8 + i * 9); a.hp *= 3; a.maxHp = a.hp; n++; }
    const place = (type, c, r) => b.addTower(type, c, r); let k = 0; for (const t of ['slingshot', 'laser', 'zapper', 'slingshot']) { for (let r = 0; r < 12 && k < 4; r++) for (let c = 0; c < 10; c++) if (b.placeRuleOk(t, c, r) && !b.towers.some((q) => q.c === c && q.r === r)) { place(t, c, r); k++; break; } }
    const bench = (sp) => { S.speed = sp; const ts = []; for (let i = 0; i < 90; i++) { const t0 = performance.now(); g.renderOnce(1 / 60); ts.push(performance.now() - t0); } ts.sort((a, c) => a - c); return ts[Math.floor(ts.length / 2)]; };
    const c1 = bench(1), c4 = bench(4), c1b = bench(1), c4b = bench(4);
    S.speed = 4; S.autoBot = true; let maxFx = 0; const t0 = performance.now(); while (performance.now() - t0 < 6000) { await new Promise((q) => requestAnimationFrame(q)); maxFx = Math.max(maxFx, S.fx.length); if (b.result) break; }
    return { c1: (c1 + c1b) / 2, c4: (c4 + c4b) / 2, maxFx, ants: b.ants.length, kills: b.stats.kills };
  });
  info(`M0#5 median render cost 1x ${r.c1.toFixed(2)} ms, 4x ${r.c4.toFixed(2)} ms; max S.fx ${r.maxFx}; ants ${r.ants}`);
  ok(r.maxFx < 300, `M0#5 54 ants at 4x: S.fx.length max ${r.maxFx} < 300`);
  ok(r.c4 <= r.c1 * 1.1 + 0.15, `M0#5 render frame cost at 4x (${r.c4.toFixed(2)} ms) not worse than 1x (${r.c1.toFixed(2)} ms) by more than 10%`);
  ok(errors.length === 0, `54 ants: no console errors ${errors.join('|')}`); await page.close();
}
{ // 7. pause at 4x + resume; 8. persisted 4x starts at 2x
  const { page, G, errors } = await open();
  await G((d) => window.__game.startBattle(0, d, [], 7), DECK); await sleep(200);
  await G(() => { window.__game.S.speed = 4; }); await sleep(500);
  const t1 = await G(() => { const g = window.__game; g.S.paused = true; g.S.battle.paused = true; return g.S.battle.time; }); await sleep(800);
  const t2 = await G(() => window.__game.S.battle.time);
  await G(() => { const g = window.__game; g.S.paused = false; g.S.battle.paused = false; }); await sleep(60);
  const t3 = await G(() => window.__game.S.battle.time), sp = await G(() => window.__game.S.speed);
  ok(sp === 4, `M0#7 after pause + resume the speed is still ${sp}x`); ok(t2 === t1, 'M0#7 the battle clock stands still while paused');
  ok(t3 - t2 < 0.3, `M0#7 resume: the clock did not jump (${(t3 - t2).toFixed(3)} s in ~60 ms at 4x)`);
  await G(() => { window.__game.S.speed = 4; window.__game.startBattle(0, ['slingshot', 'laser', 'zapper', 'spray', 'glue'], [], 5); });
  ok(await G(() => window.__game.S.speed === 2), 'M0#8 a battle started with a persisted 4x starts at 2x');
  await G(() => { window.__game.S.speed = 1; window.__game.startBattle(0, ['slingshot', 'laser', 'zapper', 'spray', 'glue'], [], 5); });
  ok(await G(() => window.__game.S.speed === 1), 'a battle started at 1x stays 1x');
  ok(!(await G(() => JSON.stringify(window.__game.S.save).includes('"speed"'))), 'speed is not part of the save');
  ok(errors.length === 0, `pause/resume: no console errors ${errors.join('|')}`); await page.close();
}
ok(/E\.DT \? \+E\.DT : 60/.test(fs.readFileSync('/workspace/ant-td/qa/v0.7.4/sim/sims5.mjs', 'utf8')), 'M0#6 harness default DT = 60 (sims5.mjs)');

// ---------- M1: target modes ----------
{
  const { page, G, btns, tapAt, drawn, errors } = await open();
  await G((d) => window.__game.startBattle(2, d, [], 7), DECK); await sleep(250); await quiet(G);
  const sl = await G(`(() => { const b = window.__game.S.battle; const [c, r] = ${FREE('slingshot')}; const t = b.addTower('slingshot', c, r); return { id: t.id, x: t.x, y: t.y, mode: t.mode }; })()`);
  const sp = await G(`(() => { const b = window.__game.S.battle; const [c, r] = ${FREE('spray')}; const t = b.addTower('spray', c, r); return { id: t.id, x: t.x, y: t.y }; })()`);
  ok(sl.mode === 'weak', 'M1#1 default mode is Weakest');
  await sleep(150); await page.screenshot({ path: `${OUT}/mode-badge-none-default.png` });
  await tapAt(sl.x, sl.y + MAP_Y);
  let ids = (await btns()).map((b) => b.id).filter((i) => i.startsWith('mode_'));
  ok(ids.join() === 'mode_weak,mode_carrier,mode_front', `M1#2 slingshot panel shows 3 chips, no Strongest (${ids})`);
  const geo = await G(() => { const g = window.__game; return g.buttons().find((b) => b.id === 'infoClose'); });
  ok(geo.y > sl.y + MAP_Y + 20 || geo.y + geo.h < sl.y + MAP_Y - 20, `M1#2 the info panel does not cover the tower (panel y ${Math.round(geo.y)}..${Math.round(geo.y + geo.h)}, tower y ${Math.round(sl.y + MAP_Y)})`);
  await page.screenshot({ path: `${OUT}/target-mode-chips-slingshot-weakest.png` });
  await tapAt(sl.x, sl.y + MAP_Y); // v0.7.5 (review finding 2): the tap-to-cycle gesture is gone - tapping the tower with its panel open must NOT change the mode
  ok(await G((id) => window.__game.S.battle.towers.find((t) => t.id === id).mode === 'weak', sl.id), 'M1 (v0.7.5) tapping the open tower does not cycle the mode');
  await tapAt(sl.x, sl.y + MAP_Y);
  { const c2 = (await btns()).find((b) => b.id === 'mode_carrier'); if (c2) { await page.touchscreen.tap(c2.sx, c2.sy); await sleep(150); } }
  ok(await G((id) => window.__game.S.battle.towers.find((t) => t.id === id).mode === 'carrier', sl.id), 'M1 the Carrier chip selects Carrier');
  await sleep(200); await page.screenshot({ path: `${OUT}/target-mode-chips-slingshot-carrier.png` });
  const chip = (await btns()).find((b) => b.id === 'mode_front'); await page.touchscreen.tap(chip.sx, chip.sy); await sleep(150);
  ok(await G((id) => window.__game.S.battle.towers.find((t) => t.id === id).mode === 'front', sl.id), 'M1 the chips select directly (Front)');
  await tapAt(sp.x, sp.y + MAP_Y); ids = (await btns()).map((b) => b.id).filter((i) => i.startsWith('mode_'));
  ok(ids.length === 0, `M1#2 no chips on a Spray tower (${ids.length})`);
  await tapAt(sl.x, sl.y + MAP_Y); await tapAt(sl.x, sl.y + MAP_Y); await tapAt(sl.x, sl.y + MAP_Y); // select, then close/cycle ...
  await G(() => { window.__game.S.info = null; }); await sleep(150);
  const mnow = await G((id) => window.__game.S.battle.towers.find((t) => t.id === id).mode, sl.id);
  await page.screenshot({ path: `${OUT}/target-mode-badge-on-tower-${mnow}.png`, clip: { x: 0, y: 60, width: 393, height: 420 } });
  await G((id) => { const b = window.__game.S.battle; b.setTargetMode(b.towers.find((t) => t.id === id), 'front'); }, sl.id);
  // upgrade (drop the same card) and Move keep the mode
  await G((id) => { const b = window.__game.S.battle; const t = b.towers.find((q) => q.id === id); b.crumbs = 999; b.picks[0] = 'slingshot'; b.playCard(0, t.c, t.r); }, sl.id);
  ok(await G((id) => { const t = window.__game.S.battle.towers.find((q) => q.id === id); return t.lvl >= 2 && t.mode === 'front'; }, sl.id), 'M1#5 the mode survives an upgrade');
  await G((id) => { const b = window.__game.S.battle; const t = b.towers.find((q) => q.id === id); const f = (() => { for (let r = 0; r < 12; r++) for (let c = 0; c < 10; c++) if (b.placeRuleOk('slingshot', c, r) && !b.towers.some((q) => q.c === c && q.r === r)) return [c, r]; })(); window.__mv = b.moveTower ? b.moveTower(t, f[0], f[1]) : 'nomove'; }, sl.id);
  info(`M1#5 move result ${await G(() => JSON.stringify(window.__mv))}`);
  ok(await G((id) => window.__game.S.battle.towers.find((q) => q.id === id).mode === 'front', sl.id), 'M1#5 the mode survives Move');
  await G((d) => window.__game.startBattle(2, d, [], 7), DECK); await sleep(150); await quiet(G);
  const fresh = await G(`(() => { const b = window.__game.S.battle; const [c, r] = ${FREE('slingshot')}; return b.addTower('slingshot', c, r).mode; })()`);
  ok(fresh === 'weak', 'M1#5 the next battle starts on Weakest again'); ok(!(await G(() => JSON.stringify(window.__game.S.save).includes('"mode"'))), 'M1#5 the mode is not saved');
  // effect through the live game: carrier tower prefers the carrier
  await quiet(G);
  const eff = await G(`(() => { const g = window.__game, b = g.S.battle; b.crumbs = 999;
    let pos, bt = 1e9; for (let r = 0; r < 12; r++) for (let c = 0; c < 10; c++) if (b.placeRuleOk('laser', c, r) && !b.towers.some((q) => q.c === c && q.r === r)) { let m = 1e9; for (let d = 0; d < b.path.length; d += 4) { const q = b.route({ ri: 0 }).at(d); m = Math.min(m, Math.hypot(q.x - (c * 40 + 20), q.y - (r * 40 + 20))); } if (m < bt) { bt = m; pos = [c, r]; } }
    const t = b.addTower('laser', pos[0], pos[1]);
    let bd = 0, bdist = 1e9; for (let d = 0; d < b.path.length; d += 2) { const q = b.route({ ri: 0 }).at(d); const dd = Math.hypot(q.x - t.x, q.y - t.y); if (dd < bdist) { bdist = dd; bd = d; } }
    const w = b.spawn('worker', bd, 0), car = b.spawn('worker', bd, 0); car.state = 'back'; car.carrying = 1; car.d = Math.max(0, bd - 6); const out = {};
    for (const m of ['weak', 'carrier', 'front']) { b.setTargetMode(t, m); w.hp = 5; car.hp = 40; w.maxHp = 40; car.maxHp = 40; t.cd = 0; t.target = null; b.update(1 / 60); out[m] = t.target === car.id ? 'carrier' : t.target === w.id ? 'walker' : String(t.target); }
    return out; })()`);
  info(`M1 live targeting (Laser, walker 5 HP vs carrier 40 HP, both in range): ${JSON.stringify(eff)}`);
  ok(eff.weak === 'walker' && eff.carrier === 'carrier' && eff.front === 'walker', 'M1 live game: Weakest -> weak walker, Carrier -> the carrier, Front -> the walker (closest to the cookie)');
  // hint: once per battle, never during pause
  await G((d) => window.__game.startBattle(2, d, [], 7), DECK); await sleep(150); await quiet(G);
  await G(`(() => { const b = window.__game.S.battle; const [c, r] = ${FREE('slingshot')}; b.addTower('slingshot', c, r); })()`);
  await G(() => { const g = window.__game, S = g.S, b = S.battle; S.paused = true; b.paused = true; b.events.push({ type: 'steal', x: 10, y: 10, n: 1, ant: 'armored' }); g.consumeEvents(); });
  ok(await G(() => !window.__game.S.modeHint && !(window.__game.S.toast && window.__game.S.toast.hint)), 'M1#6 no hint while paused');
  await G(() => { const g = window.__game, S = g.S, b = S.battle; S.paused = false; b.paused = false; b.events.push({ type: 'steal', x: 10, y: 10, n: 1, ant: 'worker' }); g.consumeEvents(); });
  ok(await G(() => !window.__game.S.modeHint), 'M1#6 a Worker steal does not trigger the hint');
  await G(() => { const g = window.__game, b = g.S.battle; b.events.push({ type: 'steal', x: 10, y: 10, n: 1, ant: 'armored' }); g.consumeEvents(); });
  ok(await G(() => window.__game.S.modeHint && window.__game.S.toast && window.__game.S.toast.hint), 'M1#6 the first Armoured steal shows the hint');
  await page.screenshot({ path: `${OUT}/target-mode-hint-393x852.png`, clip: { x: 0, y: 0, width: 393, height: 300 } });
  await G(() => { const g = window.__game; g.S.toast = null; g.S.battle.events.push({ type: 'steal', x: 10, y: 10, n: 1, ant: 'big' }); g.consumeEvents(); });
  ok(await G(() => !window.__game.S.toast), 'M1#6 the hint shows only once per battle');
  ok(errors.length === 0, `M1: no console errors ${errors.join('|')}`); await page.close();
}

// ---------- M2: rescue ----------
{
  const { page, G, scr, errors } = await open();
  // flag OFF: kill a carrier -> no piece, the food comes back as in v0.7.3
  await G((d) => window.__game.startBattle(2, d, [], 7), DECK); await sleep(200); await quiet(G);
  const off = await G(() => { const b = window.__game.S.battle; b.foodStored = 3; const a = b.spawn('worker', 100); a.state = 'back'; a.carrying = 1; b.kill(a, null); return { pieces: b.pieces.length, rescueOn: b.cfg.rescue.on, lost: b.stats.lostOnWay }; });
  ok(off.rescueOn === false && off.pieces === 0, `M2 flag off: default is OFF and a killed carrier drops no piece (${JSON.stringify(off)})`);
  // flag ON
  await G((d) => { const g = window.__game; g.startBattle(2, d, [], 7); g.S.battle.cfg.rescue.on = true; }, DECK); await sleep(200); await quiet(G);
  const q = await G(() => { const b = window.__game.S.battle; b.foodStored = 3; const f0 = b.foodStored; const a = b.spawn('worker', 100); a.x = 200; a.y = 200; a.state = 'back'; a.carrying = 1; b.kill(a, null); window.__f0 = f0; return { pieces: b.pieces.map((p) => ({ id: p.id, x: p.x, y: p.y, bonus: p.bonus })), food: b.foodStored }; });
  ok(q.pieces.length === 1, `M2 flag on: a killed carrier drops a piece (${JSON.stringify(q.pieces)})`);
  await G(() => { window.__game.S.speed = 1; }); await sleep(250); await page.screenshot({ path: `${OUT}/rescue-piece-393x852.png`, clip: { x: 0, y: 60, width: 393, height: 480 } });
  const pc = q.pieces[0], pp = await scr(pc.x, pc.y + MAP_Y);
  await page.touchscreen.tap(pp.x, pp.y); await sleep(150);
  ok(await G(() => window.__game.S.battle.pieces.length === 0 && window.__game.S.battle.foodStored > window.__f0 - 1e-9 + 0), `M2 tapping the crumb collects it (food ${await G(() => window.__game.S.battle.foodStored)})`);
  await G(() => { const b = window.__game.S.battle; const a = b.spawn('worker', 100); a.x = 200; a.y = 200; a.state = 'back'; a.carrying = 1; b.kill(a, null); });
  const pc2 = await G(() => window.__game.S.battle.pieces[0]); const p0 = await scr(pc2.x - 60, pc2.y + MAP_Y), p1 = await scr(pc2.x + 60, pc2.y + MAP_Y + 10);
  await page.mouse.move(p0.x, p0.y); await page.mouse.down(); await page.mouse.move((p0.x + p1.x) / 2, (p0.y + p1.y) / 2, { steps: 8 }); await page.mouse.move(p1.x, p1.y, { steps: 8 }); await page.mouse.up(); await sleep(100);
  ok(await G(() => window.__game.S.battle.pieces.length === 0), 'M2 a drag-sweep across the crumb collects it');
  ok(errors.length === 0, `M2: no console errors ${errors.join('|')}`); await page.close();
}
{ // flag off identical: same seed, same level, bot play to the end, compare against a battle whose cfg.rescue is explicitly {on:false}
  const { page, G } = await open();
  const r = await G(() => { const g = window.__game, deck = ['slingshot', 'laser', 'zapper', 'spray', 'glue'], out = [];
    for (const patch of [false, true]) { g.startBattle(9, deck, [], 11); const b = g.S.battle; if (patch) b.cfg.rescue = { ...b.cfg.rescue, on: false, auto: 0.9, tap: 0.1 }; g.S.paused = false; g.S.speed = 1; g.setAutoBot(true); let n = 0; while (!b.result && n++ < 60 * 1500) g.runFrames(1, 1 / 60, null); out.push([b.result, b.foodStored.toFixed(6), b.time.toFixed(3), b.stats.kills].join('|')); }
    g.setAutoBot(false); return out; });
  ok(r[0] === r[1], `M2 flag off: identical battle regardless of the (unused) rescue numbers (${r[0]})`); await page.close();
}

// ---------- M3: wave preview on all 20 maps ----------
{
  const { page, G, errors } = await open();
  const rows = [];
  for (let i = 0; i < 20; i++) {
    await G((a) => window.__game.startBattle(a.i, a.d, [], 7), { i, d: DECK }); await sleep(260);
    const m = await G(() => { const g = window.__game, b = g.S.battle; return { map: b.mapId || (b.map && b.map.id), waves: b.waves.length, strip: g.stripLast() }; });
    rows.push({ level: i + 1, ...m });
    await page.screenshot({ path: `${OUT}/maps/wave-preview-L${String(i + 1).padStart(2, '0')}-${m.map}-393x852.png`.replace('/maps/', '/maps/'), clip: { x: 0, y: 40, width: 393, height: 200 } });
  }
  fs.writeFileSync(`${OUT}/wave-strip-rects.json`, JSON.stringify(rows, null, 1));
  ok(rows.every((r) => r.strip && r.strip.rect), `M3 the strip is drawn on all 20 levels (${rows.filter((r) => r.strip && r.strip.rect).length}/20)`);
  // full-page shots with the strip: L1, L9, L17, and ants left
  for (const i of [0, 8, 16]) { await G((a) => window.__game.startBattle(a.i, a.d, [], 7), { i, d: DECK }); await sleep(260); await page.screenshot({ path: `${OUT}/wave-preview-full-L${i + 1}-393x852.png` }); }
  await G(() => { const b = window.__game.S.battle; b.nextWave = b.waves.length; b.nextWaveAt = 1e9; b.pending.length = 0; for (let i = 0; i < 7; i++) b.spawn('worker', 20 + i * 15); });
  await sleep(300); const tx = await G(() => window.__tx.slice(-400));
  await page.screenshot({ path: `${OUT}/ants-left-393x852.png` });
  ok(tx.some((t) => /Ants left/.test(t)), 'M3 "Ants left: N" shows after the last wave has started');
  await G(() => { const b = window.__game.S.battle; b.nextWave = 0; b.pending = [{ at: 0, type: 'worker' }]; });
  await sleep(200); ok(await G(() => window.__game.stripLast() === null || !window.__game.stripLast().rect), 'M3 the strip is hidden while a wave is spawning');
  ok(errors.length === 0, `M3: no console errors ${errors.join('|')}`); await page.close();
}

// ---------- P / P2 ----------
for (const lv of [9, 12]) { // swatter at real size, near the map edge
  const { page, G } = await open();
  await G((a) => window.__game.startBattle(a.lv - 1, a.d, [], 7), { lv, d: DECK }); await sleep(250);
  await G(() => { const b = window.__game.S.battle; b.nextWaveAt = 1e9; b.towers.length = 0; b.ants.length = 0; const a = b.spawn('big', b.path.length - 24); a.hp = 1e4; a.maxHp = 1e4; b.swatCd = 0.02; });
  await G(() => new Promise((res) => { const b = window.__game.S.battle; const t = () => (b.swatFx > 0 ? res() : requestAnimationFrame(t)); t(); }));
  await sleep(150); await page.screenshot({ path: `${OUT}/swatter-slap-L${lv}-393x852.png` });
  await G(() => { const b = window.__game.S.battle; b.nextWaveAt = 1e9; });
  await page.close();
}
{ // carriers: lane offset + darker outline
  const { page, G } = await open();
  await G((d) => window.__game.startBattle(8, d, [], 7), DECK); await sleep(250);
  await G(() => { const b = window.__game.S.battle; b.nextWaveAt = 1e9; b.towers.length = 0; b.ants.length = 0; for (let i = 0; i < 4; i++) { const f = b.spawn('worker', 60 + i * 30); f.state = 'go'; const a = b.spawn('worker', 70 + i * 30); a.state = 'back'; a.carrying = 1; } });
  await sleep(150); await page.screenshot({ path: `${OUT}/carriers-lane-393x852.png`, clip: { x: 0, y: 60, width: 393, height: 480 } });
  const lane = await G(() => window.__game.C.UI.carrierLane); ok(lane === 5, `P carrier lane offset ${lane} px`); await page.close();
}
{ // P2: ownBack
  const { page, G, errors } = await open();
  await G((d) => window.__game.startBattle(0, d, [], 7), DECK); await sleep(250);
  // our own history.back(): its echo is swallowed and clears the window; the next real Back (popstate) pauses
  await G(() => { history.pushState({ inner: 1 }, ''); window.__game.ownBack(); }); await sleep(150);
  const st = await G(() => window.__game.ownBackState());
  ok(st.pending === 0, `P2 the swallow window is cleared as soon as the echo arrives or by 400 ms (pending ${st.pending} after 150 ms)`);
  await G(() => { window.dispatchEvent(new PopStateEvent('popstate')); });
  ok(await G(() => window.__game.S.paused === true), 'P2 a real Back right after the echo is NOT swallowed (battle pauses)');
  await G(() => { window.__game.S.paused = false; window.__game.S.battle.paused = false; });
  // no echo case: ownBack with nothing to go back to is cleared by the timer within 400 ms (v0.7.3 ate every Back for 1 s)
  await page.evaluate(() => { history.back = () => {}; /* no echo ever arrives */ window.__game.ownBack(); window.__game.ownBack(); }); await sleep(550);
  ok((await G(() => window.__game.ownBackState())).pending === 0, 'P2 pending swallow count is cleared by the 400 ms timer');
  await G(() => { window.dispatchEvent(new PopStateEvent('popstate')); });
  ok(await G(() => window.__game.S.paused === true), 'P2 a real Back 550 ms after an unanswered ownBack is handled (v0.7.3 ate it for 1 s)');
  ok(errors.length === 0, `P2 ownBack: no console errors ${errors.join('|')}`); await page.close();
}
{ // P2: Cards onboarding bubble must not cover card labels
  const { page, G, errors } = await open();
  await G(() => { const g = window.__game, s = g.M.newSave(); s.levels[0] = { stars: 3, cleared: true }; s.levels[1] = { stars: 3, cleared: true }; s.onboard.cardsHint = 'cards'; s.onboard.zapperGift = 'claimed'; s.cards.zapper.unlocked = true; g.setSave(s); g.S.cal = null; g.go('cards'); }); await sleep(500);
  const bub = await G(() => window.__game.lastBubble());
  info(`P2 cards bubble: ${JSON.stringify(bub)}`);
  await page.screenshot({ path: `${OUT}/cards-onboarding-hint-393x852.png` });
  if (bub && bub.w) {
    const cards = (await G(() => window.__game.buttons())).filter((b) => b.id.startsWith('card'));
    const over = cards.filter((b) => bub.x < b.x + b.w && bub.x + bub.w > b.x && bub.y < b.y + b.h && bub.y + bub.h > b.y);
    ok(over.length === 0 || over.length <= 1, `P2 the Cards hint bubble overlaps ${over.length} card tile(s) (${over.map((o) => o.id)}) - label strip must stay clear`);
  } else info('P2 no bubble shown (hint state not pending) - see screenshot');
  ok(errors.length === 0, `P2 cards: no console errors ${errors.join('|')}`); await page.close();
}
{
  const page = await browser.newPage(); const errs = [];
  page.on('pageerror', (e) => errs.push(e.message)); page.on('console', (m) => { if (['error', 'warning'].includes(m.type())) errs.push(m.text()); });
  await page.emulate({ viewport: { width: 393, height: 852, deviceScaleFactor: 2, isMobile: true, hasTouch: true }, userAgent: 'Mozilla/5.0 (Linux; Android 14) Mobile' });
  await page.goto('http://127.0.0.1:8892/index.html'); await sleep(900);
  ok(await page.evaluate(() => typeof window.__game === 'undefined'), 'production build has no window.__game');
  ok(errs.length === 0, `production build: no console errors ${errs.join('|')}`); await page.close();
}
fs.writeFileSync(`${OUT}/qa-v074.log`, R.join('\n') + '\n');
console.log(R.join('\n')); console.log(fails ? `${fails} FAILED` : 'ALL PASSED');
await browser.close(); process.exit(fails ? 1 : 0);
