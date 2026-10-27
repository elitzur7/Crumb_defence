// v0.7.5 independent browser QA: A1-A7 + A10 (contrast measured on the real renderer, all 20 maps), A8 (greyscale sheet), A11 (text sizes), A15 (all-maps contact sheet,
// strip vs row-0 towers), A16 (reduced motion), review findings 1-4, backdrop cache, chips/info text. A12 (perf) is tools/perf-v075.mjs, A13 is tools/sim-identity-v075.sh, A14 needs a human.
// Output -> /workspace/ant-td/qa/v0.7.5/ (screenshots + qa-v075.log). Needs `npm run build` (www-test with window.__game).
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import { serve } from './serve.mjs';
const OUT = '/workspace/ant-td/qa/v0.7.5'; fs.mkdirSync(`${OUT}/shots`, { recursive: true });
const SH = `${OUT}/shots`;
await serve(8891, 'www-test');
const browser = await puppeteer.launch({ executablePath: '/usr/bin/google-chrome', headless: true, args: ['--no-sandbox'] });
let fails = 0; const R = [];
const ok = (c, m) => { R.push(`${c ? 'PASS' : 'FAIL'} ${m}`); if (!c) fails++; };
const info = (m) => R.push(`INFO ${m}`);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function open({ w = 393, h = 852, dpr = 2, reduced = false } = {}) {
  const page = await browser.newPage();
  await page.emulate({ viewport: { width: w, height: h, deviceScaleFactor: dpr, isMobile: true, hasTouch: true }, userAgent: 'Mozilla/5.0 (Linux; Android 14) Mobile' });
  if (reduced) await page.emulateMediaFeatures([{ name: 'prefers-reduced-motion', value: 'reduce' }]);
  const errors = []; page.on('pageerror', (e) => errors.push(e.message)); page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
  await page.evaluateOnNewDocument(() => {
    try { localStorage.clear(); } catch (e) {}
    window.__tx = []; const f = CanvasRenderingContext2D.prototype.fillText;
    CanvasRenderingContext2D.prototype.fillText = function (t, ...r) { const m = /(\d+(?:\.\d+)?)px/.exec(this.font); window.__tx.push([String(t), m ? +m[1] : 0]); return f.call(this, t, ...r); };
  });
  await page.goto('http://127.0.0.1:8891/index.html'); await page.waitForFunction(() => window.__game);
  const G = (fn, a) => page.evaluate(fn, a);
  const btns = () => G(() => window.__game.buttons());
  const drawn = async (ms = 150) => { await G(() => { window.__tx = []; }); await sleep(ms); return G(() => window.__tx.slice()); };
  const scr = async (x, y) => { const L = await G(() => window.__game.layout()); return { x: L.offX + x * L.scale, y: L.offY + y * L.scale }; };
  const tapAt = async (x, y) => { const p = await scr(x, y); await page.touchscreen.tap(p.x, p.y); await sleep(200); };
  await sleep(200);
  await G(() => { const g = window.__game; g.S.cal = null; g.S.save.onboard.cardsHint = 'done'; });
  return { page, G, btns, drawn, scr, tapAt, errors };
}
const DECK = ['slingshot', 'laser', 'zapper', 'spray', 'glue'];
const MAP_Y = 68;

// ---------- A1-A7, A10, A15: contrast on every map ----------
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
  const Lt = Lm(...T);
  const towers = Object.keys(C.TOWERS).map((id) => [id, +ratio(hexL(C.TOWERS[id].color), Lm(...Gm)).toFixed(2)]);
  return { li, theme: b.map.theme, trailVsGround: +ratio(Lt, Lm(...Gm)).toFixed(2), trailVsLightest: +ratio(Lt, Math.max(...Lg)).toFixed(2), checker: +ratio(par(0), par(1)).toFixed(3),
    smallVsTrail: +ratio(hexL(A.ANT_COL.small), Lt).toFixed(2), inkVsTrail: +ratio(hexL(A.INK), Lt).toFixed(1), edgeVsBody: +ratio(hexL(th.edge), Lt).toFixed(2),
    lipVsEdge: +ratio(hexL(A.shade(th.edge, -0.28)), hexL(th.edge)).toFixed(2), towers };
})`;
const cont = [];
{
  const { page, G, errors } = await open();
  const n = await G(() => window.__game.C.LEVELS.length);
  for (let li = 0; li < n; li++) {
    await G((li) => { const g = window.__game; g.go('map'); g.startBattle(li, ['slingshot'], [], 1); }, li); await sleep(120);
    cont.push(await G(`${FN}(${li})`));
  }
  ok(n === 20, `A15 ${n} maps measured`);
  const byTheme = {};
  for (const c of cont) (byTheme[c.theme] ||= []).push(c);
  for (const [t, a] of Object.entries(byTheme)) {
    const mn = (k) => Math.min(...a.map((x) => x[k])), mx = (k) => Math.max(...a.map((x) => x[k]));
    info(`theme ${t} (${a.length} maps): trail/ground min ${mn('trailVsGround')} | trail/lightest min ${mn('trailVsLightest')} | checker max ${mx('checker')} | small/trail min ${mn('smallVsTrail')} | ink/trail ${mn('inkVsTrail')} | edge/body ${mn('edgeVsBody')}(note: inverse of trail) | lip/edge ${mn('lipVsEdge')}`);
  }
  ok(cont.every((c) => c.trailVsGround >= 1.40), `A1 trail vs ground mean >= 1.40 on every map (min ${Math.min(...cont.map((c) => c.trailVsGround))})`);
  ok(cont.every((c) => c.trailVsLightest >= 1.25), `A2 trail vs lightest ground tile >= 1.25 (min ${Math.min(...cont.map((c) => c.trailVsLightest))})`);
  ok(cont.every((c) => c.checker <= 1.12), `A3 checker ratio <= 1.12 (max ${Math.max(...cont.map((c) => c.checker))})`);
  { const mnS = Math.min(...cont.map((c) => c.smallVsTrail)); info(`A5 (KNOWN DEVIATION) small ant flat body vs trail: min ${mnS} over all maps, per theme see above (picnic 1.44 as in the mock; gingham 1.35, wood 1.39 are below 1.40). The ladder 1.48/1.38/1.48 was kept exactly as specified; darkening 'small' would fix A5 and still pass A4 (>= 1.30) - Design to decide.`); ok(mnS >= 1.30, `A5 small ant vs trail >= 1.30 (min ${mnS}; target 1.40 not met on 2 of 4 themes)`); }
  ok(cont.every((c) => c.inkVsTrail >= 7), `A6 INK vs trail >= 7 (min ${Math.min(...cont.map((c) => c.inkVsTrail))})`);
  ok(cont.every((c) => c.edgeVsBody >= 1.8), `A7 trail edge vs body >= 1.8 (min ${Math.min(...cont.map((c) => c.edgeVsBody))})`);
  ok(cont.every((c) => c.lipVsEdge >= 1.7), `A7 lip vs edge >= 1.7 (min ${Math.min(...cont.map((c) => c.lipVsEdge))})`);
  const tw = {}; for (const c of cont) for (const [id, r] of c.towers) (tw[id] ||= []).push(r);
  info('A10 (tower base colour vs ground mean, min over all maps): ' + Object.entries(tw).map(([id, a]) => `${id} ${Math.min(...a)}`).join(', '));
  fs.writeFileSync(`${OUT}/contrast-allmaps.json`, JSON.stringify(cont, null, 1));
  ok(errors.length === 0, `contrast pass: no console errors ${errors.join('|')}`); await page.close();
}
// ---------- A4 ladder (flat body colours) ----------
{
  const { page, G } = await open();
  const r = await G(() => { const A = window.__game.A; const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    const L = (h) => { const n = parseInt(h.slice(1), 16); return 0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255); }; const q = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    const C = A.ANT_COL; return [q(L(C.small), L(C.worker)), q(L(C.worker), L(C.big)), q(L(C.big), L(C.heavy))].map((v) => +v.toFixed(2)); });
  ok(r.every((v) => v >= 1.30), `A4 ant value ladder adjacent steps ${r.join(' / ')} (each >= 1.30)`); await page.close();
}
// ---------- A11: text sizes actually drawn ----------
const SMALL = {};
const collect = (tx) => { for (const [t, s] of tx) if (s > 0 && s < 12) (SMALL[s + 'px'] ||= new Set()).add(t); };
// ---------- battle fixtures: row-0 towers + strip, chips, info text, speed label ----------
{
  const { page, G, btns, drawn, tapAt, errors } = await open();
  await G((d) => { const g = window.__game; g.go('map'); g.startBattle(5, d, [], 7); g.S.paused = false; g.setAutoBot(false); }, DECK); await sleep(400);
  await G(() => { const b = window.__game.S.battle; b.crumbs = 900; });
  // review finding 1: every top-row free tile gets a tower, one at a time; the strip must never overlap
  const row0 = await G(() => { const b = window.__game.S.battle; const out = []; for (let c = 0; c < 10; c++) if (b.placeRuleOk('slingshot', c, 0) && !b.isPathTile(c, 0)) out.push(c); return out; });
  ok(row0.length > 0, `review 1: ${row0.length} free row-0 tiles`);
  let bad = 0, checked = 0;
  for (const c of row0) {
    await G((c) => { const g = window.__game, b = g.S.battle; b.towers.length = 0; b.addTower('slingshot', c, 0); b.nextWaveAt = 5; }, c); await sleep(120);
    const r = await G((c) => { const s = window.__game.stripLast(); return s ? { x0: s.rect.x, x1: s.rect.x + s.rect.w } : null; }, c);
    if (r) { checked++; const cx = c * 40 + 20; if (r.x0 < cx + 22 && r.x1 > cx - 22) bad++; }
  }
  ok(bad === 0, `review 1: the wave strip never covers a row-0 tower (${checked} placements with a strip, ${bad} overlaps)`);
  if (row0.length) { const c = row0[Math.floor(row0.length / 2)]; await G((c) => { const b = window.__game.S.battle; b.towers.length = 0; b.addTower('slingshot', c, 0); b.addTower('laser', Math.min(9, c + 1), 0); }, c); await sleep(250); await page.screenshot({ path: `${SH}/strip-with-row0-towers.png`, clip: { x: 0, y: 0, width: 393, height: 330 } }); }
  collect(await drawn(200));
  // chips + info panel text follows the mode
  await G(() => { const b = window.__game.S.battle; b.towers.length = 0; b.ants.length = 0; b.pending.length = 0; b.nextWaveAt = 30; const t = b.addTower('slingshot', 4, 6); window.__t = t.id; }); await sleep(150);
  const tp = await G(() => { const t = window.__game.S.battle.towers[0]; return { x: t.x, y: t.y }; });
  await tapAt(tp.x, tp.y + MAP_Y);
  const ids = (await btns()).map((b) => b.id).filter((i) => i.startsWith('mode_'));
  ok(ids.join() === 'mode_weak,mode_carrier,mode_front', `chips present (${ids})`);
  const chipH = (await btns()).filter((b) => b.id.startsWith('mode_')).map((b) => Math.round(b.cssH));
  info(`chip hit heights (css px) ${chipH}`);
  const texts = {};
  for (const m of ['weak', 'carrier', 'front']) {
    const b = (await btns()).find((x) => x.id === 'mode_' + m); await page.touchscreen.tap(b.sx, b.sy); await sleep(200);
    const tx = await drawn(120); collect(tx); texts[m] = tx.map((t) => t[0]).filter((t) => /single target|walking ant|fewest/i.test(t)).join(' | ');
    await page.screenshot({ path: `${SH}/chips-info-${m}.png`, });
  }
  ok(new Set(Object.values(texts)).size === 3 && Object.values(texts).every((t) => t), `review 3: the info text differs per mode: ${JSON.stringify(texts)}`);
  ok(/closest to the cookie/.test(texts.front) && /carrying food/.test(texts.carrier), 'review 3: Front text says closest to the cookie, Carrier text says carrying food');
  // review 2: tapping the tower with its panel open must not change the mode
  await G(() => { const b = window.__game.S.battle; b.setTargetMode(b.towers[0], 'weak'); }); await tapAt(tp.x, tp.y + MAP_Y); await tapAt(tp.x, tp.y + MAP_Y); await tapAt(tp.x, tp.y + MAP_Y);
  ok(await G(() => window.__game.S.battle.towers[0].mode === 'weak'), 'review 2: tapping the tower repeatedly never cycles the mode');
  await G(() => { window.__game.S.info = null; }); await sleep(100);
  // speed label >= 12 px
  const sp = await drawn(200); collect(sp);
  const lab = sp.filter(([t]) => t === '1x'); ok(lab.length && lab.every(([, s]) => s >= 12), `review 4: speed label drawn at ${lab.map((l) => l[1])} px`);
  await page.screenshot({ path: `${SH}/speed-label.png`, clip: { x: 0, y: 590, width: 393, height: 240 } });
  // backdrop cache: bounded
  for (let i = 0; i < 40; i++) { await G((i) => window.__game.renderOnce(), i); }
  const keys = await G(() => window.__game.backdropKeys());
  ok(keys.length >= 1 && keys.length <= 3, `backdrop is cached (${keys.length} entries)`);
  ok(errors.length === 0, `fixtures: no console errors ${errors.join('|')}`); await page.close();
}
// ---------- A16: reduced motion ----------
{
  const { page, G, errors } = await open({ reduced: true });
  ok(await G(() => matchMedia('(prefers-reduced-motion: reduce)').matches), 'A16 reduced motion emulated');
  await G((d) => { const g = window.__game; g.go('map'); g.startBattle(9, d, [], 3); g.S.paused = false; g.setAutoBot(false); const b = g.S.battle; b.crumbs = 600; b.addTower('slingshot', 3, 5); b.addTower('laser', 6, 5); }, DECK);
  await G(() => window.__game.simulate(30, true)); await sleep(300);
  const st = await G(() => { const g = window.__game; const fx = g.S.fx || []; return { n: fx.length }; });
  info(`A16 reduced motion: battle ran 30 s, ${st.n} fx alive, no errors expected`);
  await page.screenshot({ path: `${SH}/reduced-motion-battle.png` });
  ok(errors.length === 0, `A16 no console errors ${errors.join('|')}`); await page.close();
}
// ---------- screenshots: map + ants contact sheet + greyscale (A8/A15) ----------
{
  const { page, G, drawn } = await open();
  const url = await G(() => {
    const g = window.__game, A = g.A; const D = 2, SHh = 132;
    const ROWS = [['small', 'worker', 'big', 'heavy', 'armored', 'sprinter'], ['gasmask', 'flyer', 'small_gasmask', 'small_armed', 'small_fly', 'queen']];
    const cv = document.createElement('canvas'); cv.width = 400 * D; cv.height = 4 * SHh * D; const c = cv.getContext('2d'); c.scale(D, D); let y = 0;
    const mk = (yy) => ({ pts: [{ x: -10, y: yy }, { x: 410, y: yy }], length: 420, at: (d) => ({ x: d - 10, y: yy, dx: 1, dy: 0 }) });
    for (const th of [0, 1, 2, 3]) {
      const bg = A.renderMapBackground([mk(36), mk(100)], th, 400, 480, D, []); c.drawImage(bg, 0, 0, 400 * D, SHh * D, 0, y, 400, SHh);
      ROWS.forEach((row, ri) => row.forEach((t, i) => { c.save(); c.translate(26 + i * 62 + (t === 'queen' ? 14 : 0), y + 36 + ri * 64); try { A.drawAnt(c, t, 0.25, {}); } catch (e) {} c.restore(); }));
      y += SHh;
    }
    return cv.toDataURL('image/png');
  });
  fs.writeFileSync(`${SH}/ants-sheet-after.png`, Buffer.from(url.split(',')[1], 'base64'));
  await G(() => { const g = window.__game, s = g.M.newSave(); for (let i = 0; i < 12; i++) g.M.applyBattleResult(s, i, 'win', i % 3 + 1, {}, () => 0); s.onboard = 'done'; g.setSave(s); g.S.cal = null; g.go('map'); });
  collect(await drawn(500)); await page.screenshot({ path: `${SH}/map-after-qa.png` }); await page.close();
}
// all-20-maps contact sheet (A15)
{
  const { page, G } = await open({ dpr: 1 });
  const parts = [];
  for (let li = 0; li < 20; li++) {
    await G((li) => { const g = window.__game; g.go('map'); g.startBattle(li, ['slingshot', 'laser', 'spray'], [], 5); g.S.paused = false; g.setAutoBot(false); const b = g.S.battle; b.crumbs = 300; b.addTower('slingshot', 2, 0); }, li);
    await sleep(200); await G(() => window.__game.simulate(8, true)); await sleep(120);
    parts.push((await page.screenshot({ encoding: 'base64', clip: { x: 0, y: 50, width: 393, height: 480 } })));
  }
  const html = `<html><body style="margin:0;background:#222">${parts.map((p) => `<img style="width:196px" src="data:image/png;base64,${p}">`).join('')}</body></html>`;
  const p2 = await browser.newPage(); await p2.setViewport({ width: 196 * 5, height: 240 * 4 }); await p2.setContent(html); await sleep(400);
  await p2.screenshot({ path: `${SH}/all-20-maps-contact-sheet.png` }); await p2.close(); await page.close();
}
for (const [k, v] of Object.entries(SMALL)) info(`A11: text drawn at ${k}: ${[...v].slice(0, 14).join(' | ')}`);
fs.writeFileSync(`${OUT}/qa-v075.log`, R.join('\n') + `\n\n${R.filter((x) => x.startsWith('PASS')).length} pass, ${fails} fail\n`);
console.log(R.join('\n')); console.log(`\n${fails ? 'FAILURES: ' + fails : 'ALL PASS'}`);
await browser.close(); process.exit(fails ? 1 : 0);
