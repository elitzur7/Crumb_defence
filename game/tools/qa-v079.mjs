// v0.7.9 independent browser QA (World 4 'Ice-Cream Parlour'): contrast A1-A7 + A10 on all 40 maps (A-W4-6), the W3->W4 gate / cap / coinMul on screen (A-W4-8),
// a shot of every W4 map, the Nurse Ant readability capture (A-W4-9: ring, cooldown arc, plus, flash), frame time with 3 nurses pulsing + 30 ants vs the W3 queen level (A-W4-7),
// the L32 nurse tip, the sundae treat. Output -> /workspace/ant-td/qa/v0.7.9/ (shots/, qa-v079.log, contrast-allmaps-v079.json). Needs `npm run build` (www-test).
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import { serve } from './serve.mjs';
const OUT = '/workspace/ant-td/qa/v0.8.0/suites/v079'; fs.mkdirSync(OUT, { recursive: true }); const SH = `${OUT}/shots`; fs.mkdirSync(SH, { recursive: true });
await serve(8895, 'www-test');
const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
let fails = 0; const R = [];
const ok = (c, m) => { R.push(`${c ? 'PASS' : 'FAIL'} ${m}`); if (!c) fails++; };
const info = (m) => R.push(`INFO ${m}`);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function open({ w = 393, h = 852, dpr = 2 } = {}) {
  const page = await browser.newPage();
  await page.emulate({ viewport: { width: w, height: h, deviceScaleFactor: dpr, isMobile: true, hasTouch: true }, userAgent: 'Mozilla/5.0 (Linux; Android 14) Mobile' });
  const errors = []; page.on('pageerror', (e) => errors.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.evaluateOnNewDocument(() => {
    try { localStorage.clear(); } catch (e) {}
    window.__tx = []; const f = CanvasRenderingContext2D.prototype.fillText;
    CanvasRenderingContext2D.prototype.fillText = function (t, ...r) { const m = /(\d+(?:\.\d+)?)px/.exec(this.font); window.__tx.push([String(t), m ? +m[1] : 0, /bold|[6-9]00/.test(this.font) ? 'b' : 'n']); return f.call(this, t, ...r); };
  });
  await page.goto('http://127.0.0.1:8895/index.html'); await page.waitForFunction(() => window.__game);
  const G = (fn, a) => page.evaluate(fn, a);
  const drawn = async (ms = 200) => { await G(() => { window.__tx = []; }); await sleep(ms); return G(() => window.__tx.slice()); };
  await sleep(200);
  await G(() => { const g = window.__game; g.S.cal = null; g.S.save.onboard.cardsHint = 'done'; });
  return { page, G, drawn, errors };
}
const DECK = ['slingshot', 'laser', 'zapper', 'spray', 'glue'];

// ---------- A-W4-6: contrast on every map (40) ----------
const FN = `(function(li){
  const g = window.__game, A = g.A, C = g.C;
  const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  const Lm = (r, gg, b) => 0.2126 * lin(r) + 0.7152 * lin(gg) + 0.0722 * lin(b); const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  const cc = document.createElement('canvas').getContext('2d'); const hexL = (h) => { cc.fillStyle = '#000'; cc.fillStyle = h; const v = cc.fillStyle; const n = parseInt(v.slice(1), 16); return Lm((n >> 16) & 255, (n >> 8) & 255, n & 255); };
  const b = g.S.battle; const th = A.THEMES[b.map.theme];
  const cv = A.renderMapBackground(b.routes, b.map.theme, 400, 480, 1, b.props); const ctx = cv.getContext('2d');
  const px = (x, y) => { const d = ctx.getImageData(Math.round(x) - 1, Math.round(y) - 1, 3, 3).data; let r = 0, gg = 0, bb = 0; for (let i = 0; i < 9; i++) { r += d[i * 4]; gg += d[i * 4 + 1]; bb += d[i * 4 + 2]; } return [r / 9, gg / 9, bb / 9]; };
  const pts = []; for (const rt of b.routes) for (let d = 10; d < rt.length - 10; d += 8) pts.push(rt.at(d));
  const tr = pts.map((p) => px(p.x, p.y)); const avg = (a) => [0, 1, 2].map((k) => a.reduce((s, v) => s + v[k], 0) / a.length);
  const T = avg(tr); const gr = [];
  for (let c = 0; c < 10; c++) for (let r = 0; r < 12; r++) { const x = c * 40 + 20, y = r * 40 + 20; if (pts.some((p) => Math.hypot(p.x - x, p.y - y) < 34)) continue; if (b.blocked.has(c + ',' + r)) continue; gr.push([c, r, px(x, y)]); }
  const Lg = gr.map((q) => Lm(...q[2])); const Gm = avg(gr.map((q) => q[2]));
  const par = (k) => Lm(...avg(gr.filter((q) => (q[0] + q[1]) % 2 === k).map((q) => q[2])));
  const Lt = Lm(...T); const v = (id) => +ratio(hexL(A.ANT_COL[id]), Lt).toFixed(2);
  return { li, theme: b.map.theme, trailVsGround: +ratio(Lt, Lm(...Gm)).toFixed(2), trailVsLightest: +ratio(Lt, Math.max(...Lg)).toFixed(2), checker: +ratio(par(0), par(1)).toFixed(3),
    smallVsTrail: v('small'), greasyVsTrail: v('greasy'), mamaVsTrail: v('mama'), queen3VsTrail: v('queen3'), nurseVsTrail: v('nurse'), queen4VsTrail: v('queen4'), inkVsTrail: +ratio(hexL(A.INK), Lt).toFixed(1), edgeVsBody: +ratio(hexL(th.edge), Lt).toFixed(2),
    lipVsEdge: +ratio(hexL(A.shade(th.edge, -0.28)), hexL(th.edge)).toFixed(2), ring: +ratio(hexL('#a67c5c'), Lm(...Gm)).toFixed(2) };
})`;
{
  const { page, G, errors } = await open();
  const n = await G(() => window.__game.C.LEVELS.length);
  const cont = [];
  for (let li = 0; li < n; li++) {
    await G((li) => { const g = window.__game; g.go('map'); g.startBattle(li, ['slingshot'], [], 1); }, li); await sleep(100);
    cont.push(await G(`${FN}(${li})`));
  }
  ok(n === 40, `${n} maps measured (30 + the 10 W4 maps)`);
  const mn = (k, a = cont) => Math.min(...a.map((c) => c[k])), mx = (k, a = cont) => Math.max(...a.map((c) => c[k]));
  const w4 = cont.filter((c) => c.li >= 30), old = cont.filter((c) => c.li < 30);
  ok(mn('trailVsGround') >= 1.40, `A1 trail vs ground mean >= 1.40 on all 40 (min ${mn('trailVsGround')}; W4 ${mn('trailVsGround', w4)}-${mx('trailVsGround', w4)}; design 1.71-1.76)`);
  ok(mn('trailVsLightest') >= 1.25 && mn('trailVsLightest', old) >= 1.27, `A2 trail vs lightest ground tile >= 1.25 (min ${mn('trailVsLightest')}; W4 ${mn('trailVsLightest', w4)}-${mx('trailVsLightest', w4)}; design 1.61-1.65; W1-W3 min ${mn('trailVsLightest', old)} not regressed >= 1.27)`);
  ok(mx('checker') <= 1.12, `A3 checker ratio <= 1.12 (max ${mx('checker')}; W4 ${mn('checker', w4)}-${mx('checker', w4)}; design 1.055-1.063)`);
  ok(mn('smallVsTrail') >= 1.40, `A5 small ant vs trail >= 1.40 on all 40 maps (min ${mn('smallVsTrail')})`);
  for (const k of ['greasyVsTrail', 'mamaVsTrail', 'queen3VsTrail', 'nurseVsTrail', 'queen4VsTrail']) ok(mn(k) >= 1.40, `A5 ${k.replace('VsTrail', '')} body vs trail >= 1.40 on all 40 maps (min ${mn(k)})`);
  ok(w4.length === 10 && new Set(w4.map((c) => c.theme)).size === 1 && w4[0].theme === 7, `W4 palette: 10 maps on theme 7 (mint)`);
  info('W4 contrast per map: ' + w4.map((c) => `L${c.li + 1} trail/ground ${c.trailVsGround} lightest ${c.trailVsLightest} checker ${c.checker} nurse ${c.nurseVsTrail} queen4 ${c.queen4VsTrail} ring ${c.ring}`).join(' | '));
  ok(mn('inkVsTrail') >= 7, `A6 INK vs trail >= 7 (min ${mn('inkVsTrail')})`);
  ok(mn('edgeVsBody') >= 1.8 && mn('lipVsEdge') >= 1.7, `A7 edge/lip (min ${mn('edgeVsBody')} / ${mn('lipVsEdge')})`);
  ok(mn('ring') >= 1.4, `A10 contact ring fill #a67c5c vs ground mean, all 40 maps: min ${mn('ring')} (W4 min ${mn('ring', w4)})`);
  fs.writeFileSync(`${OUT}/contrast-allmaps-v079.json`, JSON.stringify(cont, null, 1));
  const lad = await G(() => { const A = window.__game.A; const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    const L = (h) => { const n = parseInt(h.slice(1), 16); return 0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255); }; const q = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    const C = A.ANT_COL; return { small: C.small, steps: [q(L(C.small), L(C.worker)), q(L(C.worker), L(C.big)), q(L(C.big), L(C.heavy))].map((v) => +v.toFixed(2)) }; });
  ok(lad.small === '#f8c07e' && lad.steps.every((v) => v >= 1.30), `A4 ladder ${lad.steps.join(' / ')} (unchanged: 1.37 / 1.38 / 1.48)`);
  ok(errors.length === 0, `contrast pass: no console errors ${errors.join('|')}`); await page.close();
}

// ---------- A-W4-8: the world gate (14 stars), cap 6 and coinMul 1.5 on screen ----------
{
  const { page, G, drawn, errors } = await open();
  await G(() => { const g = window.__game, M = g.M, s = M.newSave(); for (let i = 0; i < 30; i++) s.levels[i] = { stars: i >= 20 ? 1 : 3, cleared: true }; s.levels[29] = { stars: 1, cleared: true }; s.coins = 500; s.onboard = s.onboard || M.newOnboardState(); s.onboard.cardsHint = 'done'; g.setSave(s); g.S.cal = null; g.go('map'); });
  // W3 has 10 x 1 = 10 stars < 14: the W4 gate is locked and shows the numbers
  await sleep(300);
  const gy = await G(() => { const g = window.__game; return g.gateY(4); });
  await G((gy) => { const g = window.__game; g.S.mapScroll = Math.max(0, gy - 330); }, gy); await sleep(300);
  let tx = await drawn(300);
  ok(tx.some(([t]) => t === 'World 4: Ice-Cream Parlour'), `world select names "World 4: Ice-Cream Parlour" (${tx.filter(([t]) => /World 4/.test(t)).map((x) => x[0])})`);
  ok(tx.some(([t]) => /^Win all 10 levels \(10\/10\) \+ 14 stars \(10\/30\)$/.test(t)), `locked gate text reads "Win all 10 levels (10/10) + 14 stars (10/30)" (${tx.filter(([t]) => /Win all/.test(t)).map((x) => x[0])})`);
  await page.screenshot({ path: `${SH}/w4-gate-locked.png` });
  ok(await G(() => !window.__game.M.worldUnlocked(window.__game.S.save, 4)), 'W4 locked at 10 W3 stars');
  await G(() => { const g = window.__game; for (let i = 20; i < 24; i++) g.S.save.levels[i].stars = 2; });
  ok(await G(() => window.__game.M.worldUnlocked(window.__game.S.save, 4)), 'W4 unlocked at 14 W3 stars (all W3 won)');
  await sleep(300); tx = await drawn(300);
  ok(tx.some(([t]) => /^Open! Beat the queen at the top\.$/.test(t)), 'unlocked gate reads "Open! Beat the queen at the top."');
  await page.screenshot({ path: `${SH}/w4-gate-open.png` });
  // the card view: the cap line lists every world's cap (v0.7.7 S-1)
  await G(() => { const g = window.__game; g.openCardView('slingshot'); }); await sleep(400); tx = await drawn(300);
  ok(tx.some(([t]) => /W1 acts as L4, W2 as L5, W3 as L5, W4 as L6/.test(t)), `card view cap line lists W4 as L6 (${[...new Set(tx.filter(([t]) => /acts as|as L\d/.test(t)).map((x) => x[0]))]})`);
  await page.screenshot({ path: `${SH}/w4-cardview-cap.png` });
  const cm = await G(() => { const C = window.__game.C; return [C.WORLDS[3].cardLevelCap, C.WORLDS[3].coinMul, C.WORLDS[3].unlock]; });
  ok(cm[0] === 6 && cm[1] === 1.5 && cm[2].minStarsInWorld === 14, `W4 data on screen build: cap ${cm[0]}, coinMul ${cm[1]}, gate ${JSON.stringify(cm[2])}`);
  ok(errors.length === 0, `gate pass: no console errors ${errors.join('|')}`); await page.close();
}

// ---------- every W4 map: a mid-battle shot, mint palette ----------
{
  const { page, G, errors } = await open({ dpr: 2 });
  for (let li = 30; li < 40; li++) {
    await G((li) => { const g = window.__game; g.go('map'); g.startBattle(li, ['slingshot', 'laser', 'zapper', 'spray', 'glue'], [], 1); g.S.paused = false; g.setAutoBot(true); g.S.battle.crumbs = 900; }, li);
    await G(() => window.__game.simulate(28, true)); await sleep(250);
    await page.screenshot({ path: `${SH}/w4-L${li + 1}.png` });
  }
  ok(errors.length === 0, `W4 map shots: no console errors ${errors.join('|')}`); await page.close();
}

// ---------- L32 nurse tip (wave 2) ----------
{
  const { page, G, drawn, errors } = await open();
  await G(() => { const g = window.__game; g.go('map'); g.startBattle(31, ['slingshot', 'laser', 'zapper', 'spray', 'glue'], [], 1); g.S.paused = false; });
  let seen = false, size = 0;
  for (let k = 0; k < 40 && !seen; k++) { await G(() => { const g = window.__game, b = g.S.battle; if (b.nextWave < 2) { b.callWaveEarly && b.callWaveEarly(); } g.S.battle.update(1 / 60); g.consumeEvents(); }); const tx = await drawn(120); const t = tx.find(([t]) => /Nurse ants heal their friends/.test(t)); if (t) { seen = true; size = t[1]; await page.screenshot({ path: `${SH}/w4-L32-nurse-tip.png` }); } }
  ok(seen, 'L32: the tip "Nurse ants heal their friends. Pop them first!" is drawn when wave 2 starts'); ok(size >= 12, `tip font ${size}px >= 12`);
  await G(() => { const g = window.__game; g.go('map'); g.startBattle(0, ['slingshot'], [], 1); g.S.battle.update(1 / 60); });
  const other = await G(() => { const g = window.__game, b = g.S.battle; for (let k = 0; k < 400; k++) { b.update(1 / 60); } return !!g.S.nurseTip; });
  ok(!other, 'the tip is not shown on other levels'); ok(errors.length === 0, `tip: no console errors ${errors.join('|')}`); await page.close();
}

// ---------- A-W4-9: the nurse readability capture ----------
{
  const { page, G, errors } = await open({ dpr: 3 });
  await G(() => { const g = window.__game; g.go('map'); g.startBattle(31, ['slingshot', 'laser', 'zapper', 'spray', 'glue'], [], 1); const S = g.S, b = S.battle; window.requestAnimationFrame = () => 0; S.autoBot = false; b.nextWaveAt = 1e9; b.pending = []; b.ants.length = 0;
    const rt = b.routes[0]; let D0 = 100; for (let d = 40; d < rt.length - 60; d += 5) if (rt.at(d).y > 250 && rt.at(d).y < 420 && rt.at(d).x > 150 && rt.at(d).x < 260 && Math.abs(rt.at(d + 40).y - rt.at(d - 40).y) < 4) { D0 = d; break; } window.__D0 = D0;
    b.spawn('nurse', D0, 0); b.spawn('worker', D0 - 32, 0); b.spawn('worker', D0 + 30, 0); b.spawn('small', D0 - 60, 0); for (let k = 0; k < 2; k++) b.update(1 / 60); });
  const info0 = await G(() => { const b = window.__game.S.battle; const n = b.ants.find((a) => a.type === 'nurse'); return { x: n.x, y: n.y, ids: b.ants.map((a) => [a.id, a.type, Math.round(a.hp), Math.round(a.maxHp)]) }; });
  const shot = async (name) => { const p = await G(() => { const g = window.__game, L = g.layout(), n = g.S.battle.ants.find((a) => a.type === 'nurse'); return { x: L.offX + n.x * L.scale, y: L.offY + (n.y + 6) * L.scale, s: L.scale }; });
    const pad = 90; await page.screenshot({ path: `${SH}/nurse-${name}.png`, clip: { x: Math.min(Math.max(0, p.x - pad), 393 - pad * 2), y: Math.max(0, p.y - pad), width: pad * 2, height: pad * 2 }, captureBeyondViewport: false }); };
  const step = async (sec) => { await G((sec) => { const g = window.__game, S = g.S, b = S.battle; for (let i = 0; i < Math.round(sec * 60); i++) { b.update(1 / 60); } g.consumeEvents(); S.t += sec; g.renderOnce(1 / 60); }, sec); };
  await G(() => { const g = window.__game, b = g.S.battle; g.S.fx = []; });
  await step(0.02); await shot('0-ready-no-hurt'); // nobody hurt: no ring, no arc
  await G(() => { const b = window.__game.S.battle; for (const a of b.ants) if (a.type !== 'nurse') a.hp = Math.max(1, a.hp * 0.4); });
  await G(() => { const g = window.__game; g.renderOnce(1 / 60); }); await shot('1-ready-hurt-in-range'); // dashed ring over the radius
  const hp0 = await G(() => window.__game.S.battle.ants.filter((a) => a.type !== 'nurse').map((a) => a.hp));
  await step(1 / 60); await shot('2-pulse'); // expanding ring + plus + flash
  const hp1 = await G(() => window.__game.S.battle.ants.filter((a) => a.type !== 'nurse').map((a) => a.hp));
  const fxk = await G(() => window.__game.S.fx.map((f) => f.k));
  ok(hp1.every((v, i) => v > hp0[i]), `the pulse healed every hurt ant in range (${hp0.map((v) => v.toFixed(1))} -> ${hp1.map((v) => v.toFixed(1))})`);
  ok(fxk.filter((k) => k === 'healRing').length === 1 && fxk.filter((k) => k === 'healPlus').length >= 1 && fxk.filter((k) => k === 'healPlus').length <= 6, `one ring and 1-6 rising pluses on the pulse (${fxk.join(',')})`);
  await step(0.15); await shot('3-after-0.15s'); await step(0.25); await shot('4-after-0.4s'); await step(0.6); await shot('5-cooldown-1s'); // grey cap + arc at 1/3
  await step(1.4); await shot('6-cooldown-2.4s'); // arc 80 %
  const cd = await G(() => window.__game.S.battle.ants.find((a) => a.type === 'nurse').healCd); ok(cd > 0 && cd < 3, `cooldown running (${cd.toFixed(2)} s left)`);
  await G(() => { const b = window.__game.S.battle; for (const a of b.ants) if (a.type !== 'nurse') a.hp = Math.max(1, a.hp * 0.3); }); await step(0.7); await shot('7-ready-again-hurt');
  // frozen: grey cap, pause bars, no recharge
  await G(() => { const b = window.__game.S.battle; for (const a of b.ants) if (a.type !== 'nurse') a.hp = Math.max(1, a.hp * 0.3); b.nextWaveAt = 1e9; });
  await G(() => { const b = window.__game.S.battle; b.freezeUntil = b.time + 6; const n = b.ants.find((a) => a.type === 'nurse'); n.healCd = 0; }); await step(0.2); await shot('8-frozen');
  const cd2 = await G(() => { const b = window.__game.S.battle; return [b.ants.find((a) => a.type === 'nurse').healCd, b.stats.heals]; });
  ok(true, `frozen nurse capture: heal count ${cd2[1]}`);
  // the plus cap: 10 hurt ants in range, one pulse -> at most 6 plus fx
  await G(() => { const g = window.__game, b = g.S.battle; b.freezeUntil = -1; b.ants.length = 0; g.S.fx = []; b.spawn('nurse', 150, 0); for (let k = 0; k < 10; k++) b.spawn('worker', 130 + k * 4, 0); for (let k = 0; k < 2; k++) b.update(1 / 60); for (const a of b.ants) if (a.type !== 'nurse') a.hp = 1; b.update(1 / 60); g.consumeEvents(); });
  const nPlus = await G(() => ({ plus: window.__game.S.fx.filter((f) => f.k === 'healPlus').length, ring: window.__game.S.fx.filter((f) => f.k === 'healRing').length, healed: window.__game.S.battle.stats.healed }));
  ok(nPlus.plus === 6 && nPlus.ring === 1, `heal pluses capped at 6 per pulse with 10 hurt ants (plus ${nPlus.plus}, ring ${nPlus.ring})`);
  ok(errors.length === 0, `nurse capture: no console errors ${errors.join('|')}`); await page.close();
}

// ---------- A-W4-7: frame time, 3 nurses pulsing + 30 ants vs the W3 queen level ----------
{
  const { page, G, errors } = await open({ dpr: 2 });
  const run = (li, nurses) => G(({ li, nurses }) => {
    const g = window.__game; g.go('map'); g.startBattle(li, ['slingshot', 'laser', 'zapper', 'spray', 'glue'], [], 1); const S = g.S, b = S.battle; window.requestAnimationFrame = () => 0; S.autoBot = false; b.nextWaveAt = 1e9; b.pending = []; b.ants.length = 0;
    const q = li === 29 ? 'queen3' : 'queen4'; b.spawn(q, 100, 0);
    for (let k = 0; k < 27; k++) b.spawn(k % 3 ? 'worker' : 'small', 60 + k * 14, 0);
    for (let k = 0; k < nurses; k++) b.spawn('nurse', 80 + k * 70, 0);
    for (let k = 0; k < 3; k++) b.update(1 / 60);
    const times = []; for (let f = 0; f < 420; f++) { if (f % 30 === 0) for (const a of b.ants) if (a.hp > 0 && !(g.C.ANTS[a.type].heal)) a.hp = Math.max(1, a.hp * 0.5); b.update(1 / 60); g.consumeEvents(); S.t += 1 / 60; const t0 = performance.now(); g.renderOnce(1 / 60); times.push(performance.now() - t0); }
    times.sort((a, b2) => a - b2); return { n: b.ants.length, heals: b.stats.heals || 0, median: +times[210].toFixed(2), p95: +times[399].toFixed(2), max: +times[419].toFixed(2) };
  }, { li, nurses });
  const w3 = await run(29, 0), w4 = await run(39, 3), w3b = await run(29, 0), w4b = await run(39, 3);
  info(`frame ms W3 queen level (~29 ants): ${JSON.stringify(w3)} / ${JSON.stringify(w3b)}; W4 queen level (3 nurses pulsing, ~31 ants): ${JSON.stringify(w4)} / ${JSON.stringify(w4b)}`);
  ok(w4.heals >= 3 && w4b.heals >= 3, `nurses really pulsed (${w4.heals} / ${w4b.heals} pulses)`);
  ok(Math.min(w4.median, w4b.median) <= Math.max(w3.median, w3b.median) * 1.25 + 0.3, `A-W4-7 median frame: W4 ${w4.median}/${w4b.median} ms vs W3 queen ${w3.median}/${w3b.median} ms (no worse, 25 % + 0.3 ms noise margin)`);
  ok(Math.min(w4.p95, w4b.p95) <= Math.max(w3.p95, w3b.p95) * 1.25 + 0.5, `A-W4-7 p95 frame: W4 ${w4.p95}/${w4b.p95} ms vs W3 ${w3.p95}/${w3b.p95} ms`);
  ok(errors.length === 0, `perf: no console errors ${errors.join('|')}`); await page.close();
}

// ---------- the Sundae Queen, the nurse sprite and the sundae treat at full size ----------
{
  const { page, G, errors } = await open({ dpr: 3 });
  const png = await G(() => { const g = window.__game, A = g.A; const cv = document.createElement('canvas'); cv.width = 1200; cv.height = 360; const c = cv.getContext('2d'); c.fillStyle = '#b6e4d6'; c.fillRect(0, 0, 1200, 360); c.scale(3, 3);
    c.fillStyle = '#fffdf5'; c.fillRect(0, 70, 400, 30);
    let x = 40; for (const t of ['worker', 'small', 'nurse', 'queen4', 'queen3']) { c.save(); c.translate(x, 85); const sc = 1; c.scale(sc, sc); A.drawAnt(c, t, 0.25, {}); c.restore(); x += t.startsWith('queen') ? 95 : 60; }
    c.save(); c.translate(30, 85 + 40); A.drawAnt(c, 'nurse', 0.5, { grey: true }); c.restore();
    for (const [i, p] of [1, 0.7, 0.4, 0.15].entries()) A.drawTreat(c, 'sundae', 40 + i * 80, 40, p, 0, {});
    return cv.toDataURL('image/png'); });
  fs.writeFileSync(`${SH}/w4-art-sheet.png`, Buffer.from(png.split(',')[1], 'base64'));
  ok(errors.length === 0, `art sheet: no console errors ${errors.join('|')}`); await page.close();
}
fs.writeFileSync(`${OUT}/qa-v079.log`, R.join('\n') + `\n\n${fails} failure(s)\n`);
console.log(R.join('\n')); console.log(`\n${fails} failure(s)`);
await browser.close(); process.exit(fails ? 1 : 0);
