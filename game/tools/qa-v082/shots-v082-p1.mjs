// Pass 1 shots (R2, R4, R5, R6, R9, R12). usage: HASH=<7-char commit> node shots-v082-p1.mjs <outdir> [parts]
import { launch, richSave, sleep, clearScene, namedShot } from './harness.mjs'; import fs from 'node:fs';
const OUT = process.argv[2]; fs.mkdirSync(OUT, { recursive: true }); const PARTS = (process.argv[3] || 'r2,r4,r6,r9,r12').split(',');
const freeze = (ev) => ev(() => { window.__ft = performance.now(); window.__run = 0; window.requestAnimationFrame = (cb) => setTimeout(() => { if (window.__run > 0) { window.__run--; window.__ft += 16.667; } cb(window.__ft); }, 16); });
const step = (page, ev) => async (sec) => { await ev((s) => { window.__run = Math.max(1, Math.round(s * 60)); }, sec); await page.waitForFunction(() => window.__run === 0, { polling: 10 }); await sleep(40); };
const VP = { width: 393, height: 852, deviceScaleFactor: 2 }, FULL = { x: 0, y: 0, width: 393, height: 852 }; const res = {};
if (PARTS.includes('r2')) {
  // 1) win scene first, then a LOSS in the same page after clearScene (the contamination case); 2) win3 / perfect on fresh pages
  let h = await launch({ viewport: VP }); let { page, ev } = h; let st = step(page, ev);
  await richSave(page, 4); await sleep(200);
  await ev(() => { const g = window.__game; g.go('map'); g.startBattle(2, ['slingshot', 'laser', 'glue', 'spray', 'fan'], ['bomb', 'freeze'], 5); g.S.paused = false; const b = g.S.battle; b.crumbs = 9999; g.simulate(900, true); const R = g.S.result; R.stars = 3; R.win = true; R.moment = null; R.hold = 0; });
  await freeze(ev); await st(2.2); await clearScene(page);
  await ev(() => { const g = window.__game; g.go('map'); g.startBattle(2, ['slingshot', 'laser', 'glue', 'spray', 'fan'], ['bomb', 'freeze'], 5); g.S.paused = false; g.S.battle.foodStored = 0; g.S.battle.result = 'lose'; g.finishBattle(); });
  await clearScene(page); await st(2.2);
  res.loss = await namedShot(page, OUT, 'fix-R2-loss', FULL);
  // pixel check: no #ffd24a-family pixels outside the panel (margins x<36 / x>364, y 100..560; the panel, HUD and buttons hold gold of their own)
  const px = await ev(() => { const cv = document.querySelector('canvas'), c = cv.getContext('2d'), d = c.getImageData(0, 0, cv.width, cv.height).data, k = cv.width / 400; let n = 0; for (let y = 0; y < cv.height; y += 2) for (let x = 0; x < cv.width; x += 2) { if (x / k > 36 && x / k < 364) continue; if (y / k < 100 || y / k > 560) continue; const i = (y * cv.width + x) * 4; if (Math.abs(d[i] - 255) < 14 && Math.abs(d[i + 1] - 210) < 22 && Math.abs(d[i + 2] - 74) < 40) n++; } return n; });
  res.lossGoldPixelsOutsidePanel = px; res.lossState = await ev(() => { const S = window.__game.S; return { fwParts: S.fireworks.parts.length, fwRockets: S.fireworks.rockets.length, confetti: S.result.confetti.length, fx: S.fx.length }; }); console.log('R2 loss state', JSON.stringify(res.lossState)); console.log('R2 loss: gold-family pixels outside the panel:', px); await h.close();
  for (const [nm, perfect] of [['fix-R5-win3', false], ['fix-R2-perfect', true]]) {
    h = await launch({ viewport: VP }); ({ page, ev } = h); st = step(page, ev); await richSave(page, 4); await sleep(200);
    await ev((perfect) => { const g = window.__game; g.go('map'); g.startBattle(2, ['slingshot', 'laser', 'glue', 'spray', 'fan'], ['bomb', 'freeze'], 5); g.S.paused = false; const b = g.S.battle; b.crumbs = 9999; g.simulate(900, true); const R = g.S.result; R.stars = 3; R.perfect = perfect; R.win = true; R.moment = null; R.hold = 0; }, perfect);
    await freeze(ev); await ev(() => { window.__game.S.result.t = 0.62; }); await st(0.2); await namedShot(page, OUT, nm + '-t0.8', FULL);
    await ev(() => { window.__game.S.result.t = 1.15; }); await st(0.1); await namedShot(page, OUT, nm, FULL);
    await ev(() => { window.__game.S.result.t = 3.4; }); await st(0.1); await namedShot(page, OUT, nm + '-t3.4', FULL); await h.close();
  }
  // titlecard + W5 map (version string)
  h = await launch({ viewport: VP }); ({ page, ev } = h); st = step(page, ev); await richSave(page, 45); await sleep(200); await freeze(ev);
  await ev(() => { const g = window.__game; g.go('map'); g.S.mapScroll = 0; }); await st(0.5); await namedShot(page, OUT, 'fix-R2-titlecard', FULL);
  await ev(() => { const g = window.__game; g.S.mapScroll = Math.min(g.maxMapScroll(), Math.max(0, 440 - g.gateY(5))); }); await st(0.3); await namedShot(page, OUT, 'fix-R2-w5map', FULL); await h.close();
}
if (PARTS.includes('r4')) {
  const cases = [['L38-nurse-2losses-none', 37, 2, (b) => b.spawn('nurse', 40)], ['L39-nurse-2losses-healer', 38, 2, (b) => b.spawn('nurse', 40)], ['L39-nurse-first-loss-none', 38, 1, (b) => b.spawn('nurse', 40)]];
  for (const [nm, li, run, f] of cases) {
    const h = await launch({ viewport: VP }); const { page, ev } = h; const st = step(page, ev); await richSave(page, 45); await sleep(200);
    await ev((li, run, f) => { const g = window.__game; g.go('map'); g.startBattle(li, ['slingshot', 'laser', 'glue', 'spray', 'fan'], ['bomb', 'freeze'], 5); g.S.paused = false; const b = g.S.battle; g.S.save.lossRun = { li, n: run - 1 }; b.foodStored = 0; b.result = 'lose'; eval('(' + f + ')')(b); g.finishBattle(); }, li, run, f.toString());
    await freeze(ev); await st(2.2); const hint = await ev(() => window.__game.S.result.hint); res['R4-' + nm] = hint; console.log('R4', nm, JSON.stringify(hint)); await namedShot(page, OUT, 'fix-R4-' + nm, FULL); await h.close();
  }
}
if (PARTS.includes('r6')) {
  const h = await launch({ viewport: VP }); const { page, ev } = h; const st = step(page, ev); await richSave(page, 4); await sleep(200);
  await ev(() => { const g = window.__game; g.S.save.bonusStock = { bomb: 0, freeze: 2, plane: 0 }; g.S.save.lastBonuses = ['plane', 'freeze']; g.openPrep ? g.openPrep(3) : null; }); await freeze(ev); await st(0.5);
  res.r6sel = await ev(() => window.__game.S.prep && window.__game.S.prep.bonuses.slice()); await namedShot(page, OUT, 'fix-R6-prep-default', FULL);
  await ev(() => { const g = window.__game; g.S.prep.bonuses = ['freeze']; }); await st(0.2);
  console.log('R6 preselected', JSON.stringify(res.r6sel)); await h.close();
}
if (PARTS.includes('r12')) {
  const h = await launch({ viewport: VP }); const { page, ev } = h; const st = step(page, ev); await richSave(page, 4); await sleep(200);
  await ev(() => { const g = window.__game; for (const id of g.C.ALL_CARDS) { const c = g.S.save.cards[id]; if (c) c.unlocked = false; } const own = g.C.ALL_CARDS.slice(0, 7); for (const id of own) g.S.save.cards[id].unlocked = true; g.openPrep ? g.openPrep(3) : null; }); await freeze(ev); await st(0.5);
  await namedShot(page, OUT, 'fix-R12-prep-7owned-6locked', FULL); await h.close();
}
fs.writeFileSync(`${OUT}/p1-results.json`, JSON.stringify(res, null, 1));

if (PARTS.includes('r9')) {
  // R9: glazed / nurse / queen4 / queen5, art81 on vs off: greyscale 24 px renders; >= 12 % of pixels must differ for glazed and queen5 vs off; halo clipping check on the sprite canvas
  const IDS = ['glazed', 'nurse', 'queen4', 'queen5'];
  const render = async (query) => { const h = await launch({ viewport: { width: 700, height: 300, deviceScaleFactor: 1 }, query }); const r = await h.ev((ids) => { const A = window.__game.A; const out = {}; for (const id of ids) { const t = document.createElement('canvas'); t.width = 140; t.height = 110; const c2 = t.getContext('2d'); c2.translate(70, id.startsWith('queen') ? 78 : 70); const qs = id.startsWith('queen') ? 0.85 : 2; c2.scale(qs, qs); A.drawAnt(c2, id, 0.2, id === 'glazed' ? { shield: 5 } : {}); const d = document.createElement('canvas'); d.width = 40; d.height = 36; const dc = d.getContext('2d'); dc.imageSmoothingQuality = 'high'; dc.drawImage(t, 0, 0, 140, 110, 0, 0, 40, 36); const px = dc.getImageData(0, 0, 40, 36).data; const g = []; for (let k = 0; k < px.length; k += 4) g.push(Math.round(0.2126 * px[k] + 0.7152 * px[k + 1] + 0.0722 * px[k + 2])); const big = t.getContext('2d').getImageData(0, 0, 140, 110).data; let edge = 0; for (let x = 0; x < 140; x++) for (const y of [0, 109]) edge += big[(y * 140 + x) * 4 + 3] > 8 ? 1 : 0; for (let y = 0; y < 110; y++) for (const x of [0, 139]) edge += big[(y * 140 + x) * 4 + 3] > 8 ? 1 : 0; out[id] = { g, edge, url: t.toDataURL() }; } return out; }, IDS); await h.close(); return r; };
  const on = await render(''), off = await render('?art81=0'); const R9 = {};
  for (const id of IDS) { let diff = 0; for (let i = 0; i < on[id].g.length; i++) if (Math.abs(on[id].g[i] - off[id].g[i]) > 12) diff++; R9[id] = { diffPct: +(100 * diff / on[id].g.length).toFixed(1), edgePixelsOn: on[id].edge }; }
  const pair = (a, b, A0, B0) => { let d = 0; for (let i = 0; i < A0[a].g.length; i++) if (Math.abs(A0[a].g[i] - B0[b].g[i]) > 12) d++; return +(100 * d / A0[a].g.length).toFixed(1); };
  R9.pairs = { 'glazed-vs-nurse (art81 on)': pair('glazed', 'nurse', on, on), 'glazed-vs-nurse (v0.8.1)': pair('glazed', 'nurse', off, off), 'queen4-vs-queen5 (art81 on)': pair('queen4', 'queen5', on, on), 'queen4-vs-queen5 (v0.8.1)': pair('queen4', 'queen5', off, off) };
  console.log('R9', JSON.stringify(R9)); res.r9 = R9;
  const h = await launch({ viewport: { width: 760, height: 330, deviceScaleFactor: 2 } });
  await h.ev((a, b) => { document.body.innerHTML = '<div style="background:#e8d2bd;font:12px sans-serif;color:#523c4b;padding:4px">R9 - top: art81 ON, bottom: art81 OFF (v0.8.1), 140x110 sprites at 1x</div>'; for (const set of [a, b]) { const row = document.createElement('div'); row.style.cssText = 'display:flex;background:#e8d2bd'; for (const id of Object.keys(set)) { const im = new Image(); im.src = set[id].url; row.appendChild(im); } document.body.appendChild(row); } }, Object.fromEntries(IDS.map((i) => [i, on[i]])), Object.fromEntries(IDS.map((i) => [i, off[i]])));
  await sleep(300); await namedShot(h.page, OUT, 'fix-R9-glazed-nurse-queens-on-vs-off', { x: 0, y: 0, width: 600, height: 300 }); await h.close();
}
fs.writeFileSync(`${OUT}/p1-results.json`, JSON.stringify(res, null, 1));
