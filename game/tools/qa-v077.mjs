// v0.7.7 independent browser QA: V1 (A5 small ant >= 1.40 on 20 maps), V2 (A10 contact ring, 9 side towers x 4 themes, lizard + tractor shots),
// V3 (runtime fillText scan on every screen, drawn font sizes), E1/E2/E3/E4/E6 UI (results 'Star bonus' + 'Gems', calendar, boss gems, W2 cap line/pill).
// Output -> /workspace/ant-td/qa/v0.7.7/ (screenshots in shots/, qa-v077.log, fillText-scan.json). Needs `npm run build` (www-test with window.__game).
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import { serve } from './serve.mjs';
const OUT = '/workspace/ant-td/qa/v0.7.9/suites/v077'; const SH = `${OUT}/shots`; fs.mkdirSync(SH, { recursive: true });
await serve(8894, 'www-test');
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
  await page.goto('http://127.0.0.1:8894/index.html'); await page.waitForFunction(() => window.__game);
  const G = (fn, a) => page.evaluate(fn, a);
  const drawn = async (ms = 200) => { await G(() => { window.__tx = []; }); await sleep(ms); return G(() => window.__tx.slice()); };
  await sleep(200);
  await G(() => { const g = window.__game; g.S.cal = null; g.S.save.onboard.cardsHint = 'done'; });
  return { page, G, drawn, errors };
}
const DECK = ['slingshot', 'laser', 'zapper', 'spray', 'glue'];

// ---------- V1/V2: contrast on every map ----------
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
    smallVsTrail: +ratio(hexL(A.ANT_COL.small), Lt).toFixed(2), greasyVsTrail: +ratio(hexL(A.ANT_COL.greasy), Lt).toFixed(2), mamaVsTrail: +ratio(hexL(A.ANT_COL.mama), Lt).toFixed(2), queen3VsTrail: +ratio(hexL(A.ANT_COL.queen3), Lt).toFixed(2), inkVsTrail: +ratio(hexL(A.INK), Lt).toFixed(1), edgeVsBody: +ratio(hexL(th.edge), Lt).toFixed(2),
    lipVsEdge: +ratio(hexL(A.shade(th.edge, -0.28)), hexL(th.edge)).toFixed(2), towers, ring: +ratio(hexL('#a67c5c'), Lm(...Gm)).toFixed(2) };
})`;
{
  const { page, G, errors } = await open();
  const n = await G(() => window.__game.C.LEVELS.length);
  const cont = [];
  for (let li = 0; li < n; li++) {
    await G((li) => { const g = window.__game; g.go('map'); g.startBattle(li, ['slingshot'], [], 1); }, li); await sleep(100);
    cont.push(await G(`${FN}(${li})`));
  }
  ok(n === 40, `${n} maps measured (20 + the 10 W3 maps + the 10 W4 maps)`);
  const mn = (k) => Math.min(...cont.map((c) => c[k])), mx = (k) => Math.max(...cont.map((c) => c[k]));
  ok(mn('trailVsGround') >= 1.40, `A1 trail vs ground mean >= 1.40 (min ${mn('trailVsGround')})`);
  ok(mn('trailVsLightest') >= 1.25, `A2 trail vs lightest ground tile >= 1.25 (min ${mn('trailVsLightest')}; v0.7.5 1.27)`);
  ok(mn('trailVsLightest') >= 1.27, `A2 not regressed vs v0.7.5 (1.27)`);
  ok(mx('checker') <= 1.12, `A3 checker ratio <= 1.12 (max ${mx('checker')}; v0.7.5 1.119)`);
  ok(mn('smallVsTrail') >= 1.40, `V1/A5' small ant #f8c07e vs trail >= 1.40 on all 30 maps (min ${mn('smallVsTrail')}, plan expects 1.447)`);
  for (const k of ['greasyVsTrail', 'mamaVsTrail', 'queen3VsTrail']) ok(mn(k) >= 1.40, `A5 (new W3 ants) ${k.replace('VsTrail', '')} body vs trail >= 1.40 on all 30 maps (min ${mn(k)})`);
  { const w3 = cont.filter((c) => c.theme >= 4 && c.li < 30); ok(w3.length === 10 && new Set(w3.map((c) => c.theme)).size === 3, `W3 palettes: 10 maps on 3 new themes (${[...new Set(w3.map((c) => c.theme))]})`); info('W3 contrast per map: ' + w3.map((c) => `L${c.li + 1} t${c.theme} trail/ground ${c.trailVsGround} lightest ${c.trailVsLightest} checker ${c.checker} small ${c.smallVsTrail} ring ${c.ring}`).join(' | ')); }
  ok(mn('inkVsTrail') >= 7, `A6 INK vs trail >= 7 (min ${mn('inkVsTrail')})`);
  ok(mn('edgeVsBody') >= 1.8 && mn('lipVsEdge') >= 1.7, `A7 edge/lip (min ${mn('edgeVsBody')} / ${mn('lipVsEdge')})`);
  const byTheme = {}; for (const c of cont) (byTheme[c.theme] ||= []).push(c);
  for (const [t, a] of Object.entries(byTheme)) info(`theme ${t} (${a.length} maps): small/trail min ${Math.min(...a.map((x) => x.smallVsTrail))} | ring fill/ground min ${Math.min(...a.map((x) => x.ring))} | trail/ground min ${Math.min(...a.map((x) => x.trailVsGround))}`);
  ok(mn('ring') >= 1.4, `V2/A10' ring fill #a67c5c vs ground mean, all 30 maps: min ${mn('ring')} (>= 1.4; plan expects worst 1.91)`);
  fs.writeFileSync(`${OUT}/contrast-allmaps-v077.json`, JSON.stringify(cont, null, 1));
  const lad = await G(() => { const A = window.__game.A; const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    const L = (h) => { const n = parseInt(h.slice(1), 16); return 0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255); }; const q = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
    const C = A.ANT_COL; return { small: C.small, steps: [q(L(C.small), L(C.worker)), q(L(C.worker), L(C.big)), q(L(C.big), L(C.heavy))].map((v) => +v.toFixed(2)) }; });
  ok(lad.small === '#f8c07e' && lad.steps.every((v) => v >= 1.30), `A4 ladder ${lad.steps.join(' / ')} (plan 1.37/1.38/1.48), small ${lad.small}`);
  ok(errors.length === 0, `contrast pass: no console errors ${errors.join('|')}`); await page.close();
}
// ---------- V2: ring pixel test, 9 side towers x 4 themes + zoom sheet ----------
{
  const { page, G, errors } = await open();
  const levelOfTheme = await G(() => { const g = window.__game, C = g.C, o = {}; C.LEVELS.forEach((L, i) => { const th = C.MAPS[L.map].theme; if (!(th in o)) o[th] = i; }); return o; });
  info(`theme -> first level: ${JSON.stringify(levelOfTheme)}`);
  const res = [];
  for (const [th, li] of Object.entries(levelOfTheme)) {
    await G((li) => { const g = window.__game; g.go('map'); g.startBattle(li, ['slingshot'], [], 1); }, li);
    const r = await G(() => {
      const g = window.__game, A = g.A, C = g.C, b = g.S.battle; const side = Object.keys(C.TOWERS).filter((id) => C.TOWERS[id].place === 'side'), path = Object.keys(C.TOWERS).filter((id) => C.TOWERS[id].place === 'path');
      const D = 4, cell = 60; const out = { side: side.length, path, towers: [] };
      const bg = A.renderMapBackground(b.routes, b.map.theme, 400, 480, D, b.props);
      const cv = document.createElement('canvas'); cv.width = (side.length + path.length) * cell * D; cv.height = cell * D; const c = cv.getContext('2d'); c.scale(D, D);
      c.drawImage(bg, 0, 0, cv.width, cv.height, 0, 0, cv.width, cv.height);
      const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }; const Lm = (r, g2, b2) => 0.2126 * lin(r) + 0.7152 * lin(g2) + 0.0722 * lin(b2); const ratio = (a, b2) => (Math.max(a, b2) + 0.05) / (Math.min(a, b2) + 0.05);
      // ground mean around the tower footprint = the bare background pixels of the same cell
      const gd = c.getImageData(0, 0, cv.width, cv.height).data; const gmean = (i) => { let r = 0, g2 = 0, b2 = 0, n = 0; for (let y = 0; y < cell * D; y += 3) for (let x = i * cell * D; x < (i + 1) * cell * D; x += 3) { const k = (y * cv.width + x) * 4; r += gd[k]; g2 += gd[k + 1]; b2 += gd[k + 2]; n++; } return Lm(r / n, g2 / n, b2 / n); };
      [...side, ...path].forEach((id, i) => {
        const Lg = gmean(i);
        const one = document.createElement('canvas'); one.width = cell * D; one.height = cell * D; const t = one.getContext('2d'); t.scale(D, D); t.translate(30, 30); A.drawTower(t, id, 0, null);
        const d = t.getImageData(0, 0, one.width, one.height).data;
        const at = (x, y) => { const k = (Math.round((y + 30) * D) * one.width + Math.round((x + 30) * D)) * 4; return [d[k], d[k + 1], d[k + 2], d[k + 3]]; };
        // ring: 3px INK stroke centred on the ellipse (0,9) 19.5x10.5 -> sample the bottom (0,19.5), the left (-19.5,9) and the right (19.5,9)
        const pts = [at(0, 19.5), at(-19.5, 9), at(19.5, 9)]; const dark = pts.every((p) => p[3] > 240 && p[0] < 90 && p[1] < 70 && p[2] < 90);
        let fill = 0, minx = 1e9, maxx = -1e9, maxy = -1e9; for (let k = 0; k < d.length; k += 4) { if (d[k + 3] > 250 && Math.abs(d[k] - 0xa6) < 4 && Math.abs(d[k + 1] - 0x7c) < 4 && Math.abs(d[k + 2] - 0x5c) < 4) fill++; }
        const sc = { x: 0 }; for (let y = 0; y < one.height; y++) for (let x = 0; x < one.width; x++) { if (d[(y * one.width + x) * 4 + 3] > 20) { const X = x / D - 30, Y = y / D - 30; if (Y > 8) { minx = Math.min(minx, X); maxx = Math.max(maxx, X); } maxy = Math.max(maxy, Y); } }
        const inkL = Lm(...at(0, 19.5).slice(0, 3));
        out.towers.push({ id, ring: dark, fillPx: +(fill / (D * D)).toFixed(1), maxY: +maxy.toFixed(1), lowerMinX: +minx.toFixed(1), lowerMaxX: +maxx.toFixed(1), inkVsGround: +ratio(inkL, Lg).toFixed(1) });
        c.save(); c.translate(i * cell + 30, 30); A.drawTower(c, id, 0, null); c.restore();
      });
      out.png = cv.toDataURL('image/png'); return out;
    });
    fs.writeFileSync(`${SH}/ring-zoom-sheet-theme${th}.png`, Buffer.from(r.png.split(',')[1], 'base64')); delete r.png; res.push({ th, r });
  }
  const sideOnly = res.flatMap((x) => x.r.towers.filter((t) => ['slingshot', 'spray', 'sound', 'ball', 'fan', 'lizard', 'laser', 'zapper', 'tractor'].includes(t.id)).map((t) => ({ th: x.th, ...t })));
  const pathOnly = res.flatMap((x) => x.r.towers.filter((t) => !['slingshot', 'spray', 'sound', 'ball', 'fan', 'lizard', 'laser', 'zapper', 'tractor'].includes(t.id)));
  ok(res.length === 8 && res.every((x) => x.r.side === 9) && sideOnly.length === 72, `V2 9 side towers x ${res.length} themes = ${sideOnly.length} samples`);
  ok(sideOnly.every((t) => t.ring), `V2 the INK ring stroke is drawn under every side tower on every theme (${sideOnly.filter((t) => !t.ring).map((t) => t.id + '@' + t.th)} missing)`);
  ok(sideOnly.every((t) => t.lowerMinX >= -21 && t.lowerMaxX <= 21 && t.maxY <= 21.5), `V2 ring stays inside the 40px tile (lower x ${Math.min(...sideOnly.map((t) => t.lowerMinX))}..${Math.max(...sideOnly.map((t) => t.lowerMaxX))}, max y ${Math.max(...sideOnly.map((t) => t.maxY))})`);
  ok(pathOnly.every((t) => !t.ring), `V2 path items (${[...new Set(pathOnly.map((t) => t.id))]}) get no ring`);
  ok(sideOnly.every((t) => t.inkVsGround >= 3), `V2 ring INK stroke vs ground >= 3 (min ${Math.min(...sideOnly.map((t) => t.inkVsGround))})`);
  info(`V2 exposed #a67c5c fill px per tower (the pad skirt covers most of it; the ring reads as a dark contour + brown rim): ${[...new Set(sideOnly.map((t) => t.id))].map((id) => id + ' ' + sideOnly.filter((t) => t.id === id).map((t) => t.fillPx).join('/')).join(', ')}`);
  fs.writeFileSync(`${OUT}/ring-pixel-test.json`, JSON.stringify(res, null, 1));
  ok(errors.length === 0, `ring pass: no console errors ${errors.join('|')}`); await page.close();
}
// ---------- V2: lizard + tractor (and the whole side set) on a real battle map, picnic + midnight ----------
{
  const { page, G, errors } = await open({ dpr: 3 });
  const lv = await G(() => { const C = window.__game.C, o = {}; C.LEVELS.forEach((L, i) => { const th = C.MAPS[L.map].theme; if (!(th in o)) o[th] = i; }); return o; });
  for (const [th, name] of [[3, 'picnic'], [2, 'midnight'], [0, 'gingham'], [1, 'wood']]) {
    if (!(th in lv)) continue;
    const placed = await G((li) => {
      const g = window.__game; g.go('map'); g.startBattle(li, ['slingshot', 'lizard', 'tractor', 'fan', 'zapper'], [], 3); g.S.paused = false; g.setAutoBot(false);
      const b = g.S.battle; b.crumbs = 5000; b.nextWaveAt = 99; const types = ['lizard', 'tractor', 'fan', 'slingshot', 'spray', 'zapper', 'laser', 'ball', 'sound']; const got = [];
      let k = 0; for (const ty of types) { let done = false; for (let r = 3; r < 11 && !done; r++) for (let c = (k * 3 + r) % 10; c < 10 && !done; c++) { if (b.placeRuleOk(ty, c, r) && !b.isPathTile(c, r) && !b.towers.some((t) => Math.abs(t.c - c) < 2 && Math.abs(t.r - r) < 2)) { try { const t = b.addTower(ty, c, r); if (t) { got.push([ty, c, r]); done = true; } } catch (e) {} } } k++; }
      return got;
    }, lv[th]);
    await sleep(500);
    info(`${name} (L${lv[th] + 1}): placed ${placed.map((p) => p.join(':')).join(' ')}`);
    ok(placed.some((p) => p[0] === 'lizard') && placed.some((p) => p[0] === 'tractor'), `${name}: lizard and tractor are on the map`);
    await page.screenshot({ path: `${SH}/lizard-tractor-${name}.png`, clip: { x: 0, y: 60, width: 393, height: 480 } });
  }
  ok(errors.length === 0, `battle shots: no console errors ${errors.join('|')}`); await page.close();
}
// ---------- V1: small ant on all four themes (ant sheet) ----------
{
  const { page, G } = await open();
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
  fs.writeFileSync(`${SH}/small-ant-all-themes.png`, Buffer.from(url.split(',')[1], 'base64')); await page.close();
}
// ---------- V3: runtime fillText scan on every screen + economy UI (E1/E2/E3/E4/E6) ----------
{
  const { page, G, drawn, errors } = await open();
  const SCAN = {}; // screen -> { n, small: [[text,size]], min }
  const scan = async (label, ms = 260, shot = null) => {
    const tx = await drawn(ms); const small = {}; for (const [t, s, w] of tx) if (s > 0 && s < 12) small[`${t}@${s}${w}`] = 1;
    SCAN[label] = { n: tx.length, minSize: Math.min(...tx.filter((x) => x[1] > 0).map((x) => x[1])), small: Object.keys(small) };
    if (shot) await page.screenshot({ path: `${SH}/${shot}.png` });
    return tx;
  };
  const RICH = (wins, stars, caps) => G(([wins, stars, caps]) => { const g = window.__game; const s = g.M.newSave(); for (let i = 0; i < wins; i++) g.M.applyBattleResult(s, i, 'win', stars, {}, () => 0);
    for (const id of g.C.ALL_CARDS) s.cards[id].unlocked = true; s.coins = 800; s.diamonds = 40; s.onboard = 'done'; if (caps) { s.cards.slingshot.level = 6; s.cards.laser.level = 7; }
    g.setSave(s); g.S.cal = null; g.S.reveal = []; g.go('map'); }, [wins, stars, caps]);
  await RICH(12, 3, true);
  await scan('map', 400, 'screen-map');
  await G(() => { const g = window.__game; g.S.mapScroll = g.maxMapScroll(); }); await scan('map (scrolled to the top world)', 300);
  await G(() => { window.__game.S.settings = { t: 0 }; }); await scan('map + settings panel', 300, 'screen-settings');
  await G(() => { const g = window.__game; g.S.settings = null; g.openCalendar(); }); await scan('map + calendar', 600, 'screen-calendar-w2');
  await G(() => { window.__game.go('map'); });
  for (let i = 0; i < 30; i++) { await G((i) => window.__game.openPrep(i), i); await scan(`prep L${i + 1}`, 220, [0, 9, 10, 19, 20, 21, 24, 29].includes(i) ? `screen-prep-L${i + 1}` : null); }
  await G(() => window.__game.go('cards')); await scan('cards', 300, 'screen-cards');
  for (const id of ['slingshot', 'fan', 'lizard', 'tractor', 'glue', 'gate']) { await G((id) => window.__game.openCardView(id), id); await scan(`card view ${id}`, 220, id === 'lizard' ? 'screen-cardview-lizard' : null); }
  await G(() => window.__game.go('shop')); await scan('shop', 300, 'screen-shop');
  await G(() => { const g = window.__game; g.S.shopSel = 'laser'; }); await scan('shop + info', 250);
  await G(() => { const g = window.__game; g.go('map'); g.openPackReveal(['slingshot', 'laser', 'fan', 'zapper', 'glue'], {}); }); await scan('pack reveal', 1800, 'screen-pack');
  await G(() => { const g = window.__game; g.skipPack(); g.closePack(); g.go('map'); g.queueReveal('lizard', 1, true, 0); }); await scan('new-card reveal', 1500, 'screen-newcard');
  await G(() => { const g = window.__game; g.S.reveal = []; });
  // battles: every theme, every tower type placed + tower info panel + dialogs + paused
  const lv = await G(() => { const C = window.__game.C, o = {}; C.LEVELS.forEach((L, i) => { const th = C.MAPS[L.map].theme; if (!(th in o)) o[th] = i; }); return o; });
  for (const [th, li] of Object.entries(lv)) {
    await G(([li]) => { const g = window.__game; g.go('map'); g.startBattle(li, ['slingshot', 'laser', 'zapper', 'spray', 'glue'], ['bomb', 'plane'], 4); g.S.paused = false; g.setAutoBot(false);
      const b = g.S.battle; b.crumbs = 3000; const types = Object.keys(g.C.TOWERS); let k = 0;
      for (const ty of types) { let done = false; for (let r = 1; r < 11 && !done; r++) for (let c = (k * 3 + r) % 10; c < 10 && !done; c++) { if (b.placeRuleOk(ty, c, r) && !b.towers.some((t) => Math.abs(t.c - c) < 1 && Math.abs(t.r - r) < 1)) { try { if (b.addTower(ty, c, r)) done = true; } catch (e) {} } } k++; }
      b.nextWaveAt = 1; }, [li]);
    await G(() => window.__game.simulate(14, true)); await scan(`battle theme ${th} (L${li + 1})`, 350, `screen-battle-theme${th}`);
    const ntw = await G(() => window.__game.S.battle.towers.length);
    for (let t = 0; t < ntw; t++) { await G((t) => { const g = window.__game; g.S.info = { tower: g.S.battle.towers[t], t: 0 }; }, t); await scan(`battle theme ${th} tower-info #${t}`, 160, th === '3' && t === 1 ? 'screen-towerinfo' : null); }
    await G(() => { const g = window.__game; g.S.info = null; const b = g.S.battle; g.S.dialog = { kind: 'crumbs', title: 'More crumbs', line: 'Buy 100 crumbs for', price: g.M.nextCrumbPrice(b), note: 'Price doubles with every purchase this battle.', onBuy: () => ({ ok: false }) }; }); await scan(`battle theme ${th} + dialog`, 200);
    await G(() => { const g = window.__game; g.S.dialog = null; g.S.paused = true; g.S.battle.paused = true; }); await scan(`battle theme ${th} paused`, 250);
  }
  // results: a loss, a win without stars bonus (replay), E1 first-time stars, E3 boss gems
  const result = async (label, li, win, stars, fresh, shot) => {
    await G(([li, win, stars, fresh]) => { const g = window.__game; if (fresh) { const s = g.M.newSave(); for (const id of g.C.ALL_CARDS) s.cards[id].unlocked = true; s.onboard = 'done'; for (let i = 0; i < li; i++) g.M.applyBattleResult(s, i, 'win', 3, {}, () => 0); g.setSave(s); }
      g.go('map'); g.startBattle(li, ['slingshot', 'laser', 'zapper', 'spray', 'glue'], [], 5); g.S.paused = false; const b = g.S.battle; b.result = win ? 'win' : 'lose'; b.foodStored = win ? b.cfg.foodHP * (stars >= 3 ? 1 : stars === 2 ? 0.6 : 0.2) : 0; g.finishBattle(); g.S.reveal = []; g.S.result.t = 9; }, [li, win, stars, fresh]);
    await scan(label, 500, shot);
    return G(() => { const r = window.__game.S.result; return { win: r.win, stars: r.stars, coins: r.out.coins, parts: r.out.parts, starCoins: r.out.starCoins, gems: r.out.gems }; });
  };
  const rLose = await result('results: loss', 2, false, 0, true, 'screen-results-loss'); info(`results loss: ${JSON.stringify(rLose)}`);
  const rE1 = await result('results: first win 3 stars (E1 Star bonus)', 0, true, 3, true, 'screen-results-star-coins'); info(`E1 results L1 3-star: ${JSON.stringify(rE1)}`);
  ok(rE1.starCoins === 40, `E1 first win with 3 stars pays 15 + 25 = 40 star coins (got ${rE1.starCoins})`);
  const t1 = await G(() => window.__game.S.battle && 1); await sleep(50);
  const rE1b = await result('results: first win 2 stars', 1, true, 2, true, 'screen-results-2star'); ok(rE1b.starCoins === 15, `E1 first win with 2 stars pays 15 (got ${rE1b.starCoins})`);
  const rE1c = await result('results: first win 1 star', 3, true, 1, true, null); ok(rE1c.starCoins === 0, `E1 first win with 1 star pays 0 star coins (got ${rE1c.starCoins})`);
  const rBoss = await result('results: boss L10 first clear 3 stars (E3 gems)', 9, true, 3, true, 'screen-results-boss-gems'); info(`E3 boss L10 3-star: ${JSON.stringify(rBoss)}`);
  ok(rBoss.gems === 15, `E3 L10 first clear with 3 stars = +10 +5 gems (got ${rBoss.gems})`);
  const rBoss2 = await result('results: boss L10 first clear 2 stars', 9, true, 2, true, null); ok(rBoss2.gems === 10, `E3 L10 first clear with 2 stars = +10 gems (got ${rBoss2.gems})`);
  const rB20 = await result('results: boss L20 first clear 3 stars', 19, true, 3, true, 'screen-results-boss-L20'); ok(rB20.gems === 15, `E3 L20 first clear with 3 stars = +15 gems (got ${rB20.gems})`);
  // replay of a 3-star boss: no gems, no star coins
  const rep = await G(() => { const g = window.__game, s = g.S.save; const d0 = s.diamonds, c0 = s.coins; const o = g.M.applyBattleResult(s, 9, 'win', 3, {}, () => 0); return { gems: o.gems, starCoins: o.starCoins, dDiamonds: s.diamonds - d0 }; });
  ok(rep.gems === 0 && rep.starCoins === 0 && rep.dDiamonds === 0, `E3/E-A3 replay of a cleared 3-star boss gives 0 gems and 0 star coins (${JSON.stringify(rep)})`);
  const non = await G(() => { const g = window.__game, s = g.M.newSave(); const o = g.M.applyBattleResult(s, 4, 'win', 3, {}, () => 0); return o.gems; });
  ok(non === 0, `E3 a normal level gives no gems (${non})`);
  // E2 calendar tile values per world
  const cal = await G(() => { const g = window.__game; const out = {}; for (const w of [1, 2]) { const s = g.M.newSave(); const n = w === 1 ? 0 : 10; for (let i = 0; i < n; i++) g.M.applyBattleResult(s, i, 'win', 3, {}, () => 0); out['W' + w] = [1, 2, 3, 4].map((k) => g.Cal.coinAmount ? g.Cal.coinAmount(k, g.C.CALENDAR, g.M.highestWorld(s)) : null); } return out; });
  info(`E2 calendar coin tiles (streak 1-4): ${JSON.stringify(cal)}`);
  ok(JSON.stringify(cal.W1) === '[30,60,90,120]', `E2 W1 tiles 30/60/90/120 (${cal.W1})`);
  ok(JSON.stringify(cal.W2) === '[45,90,135,180]', `E2 W2 tiles x1.5 = 45/90/135/180 (${cal.W2})`);
  // E4/E-A6: W2 prep shows the cap line + pill
  await RICH(12, 3, true); await G(() => window.__game.openPrep(10)); const tx = await scan('E4 prep L11 (W2) with over-cap cards', 300, 'screen-prep-W2-cap');
  ok(tx.some(([t]) => t === 'A card above L5 acts as L5 in this world'), 'E4 prep L11 shows "A card above L5 acts as L5 in this world"');
  ok(!tx.some(([t]) => t === 'acts as L5'), 'P1-1 the per-card "acts as L5" pill is gone');
  ok(tx.filter(([t]) => t === 'L5').length >= 2, 'P1-1 the two over-cap cards (L6, L7) show the effective level L5 in the badge');
  ok(!tx.some(([t]) => t === 'L6' || t === 'L7'), 'P1-1 no raw L6 / L7 badge on a capped card in a battle prep');
  ok(tx.filter(([t]) => /in this world/.test(t)).every(([, s2]) => s2 >= 12), 'E4 cap text drawn at >= 12 px');
  await G(() => window.__game.openPrep(0)); const tx0 = await scan('E4 prep L1 (W1) with over-cap cards', 250, 'screen-prep-W1-cap');
  ok(tx0.some(([t]) => t === 'A card above L4 acts as L4 in this world'), 'E4 W1 prep shows the L4 version of the line');
  await RICH(12, 3, false); await G(() => window.__game.openPrep(10)); const tx2 = await drawn(250);
  ok(!tx2.some(([t]) => /acts as L/.test(t)), 'E4 no cap text when no card is above the cap');
  // verdict on the fillText scan
  const allowedGlyph = (t) => t.length <= 2; const bad = [];
  for (const [label, s] of Object.entries(SCAN)) for (const k of s.small) { const m = /^(.*)@([\d.]+)([bn])$/.exec(k); const [, t, sz] = m; const isTag = ['on trail', 'air only', 'gnd+air'].includes(t) && +sz === 11; const isBadge = /^L\d+$/.test(t) && +sz === 11; if (!(isTag || isBadge || allowedGlyph(t))) bad.push(`${label}: "${t}" ${sz}px`); }
  const over = await G(() => window.__fitOver || []);
  ok(over.length === 0, `V3 fitText/plainFit never needed to shrink below 12 (overflow reports: ${JSON.stringify(over.slice(0, 6))})`);
  const screens = Object.keys(SCAN).length;
  ok(bad.length === 0, `V3 runtime fillText scan: ${screens} screens/states, every drawn string >= 12px except the 11px bold tags/L-badge and icon glyphs (violations: ${bad.slice(0, 12).join(' | ') || 'none'})`);
  const smallAll = {}; for (const s of Object.values(SCAN)) for (const k of s.small) smallAll[k] = (smallAll[k] || 0) + 1;
  info(`V3 every string drawn below 12px across all scanned screens: ${JSON.stringify(smallAll)}`);
  info(`V3 smallest drawn size per screen: ${Object.entries(SCAN).map(([k, v]) => `${k}=${v.minSize}`).join('; ')}`);
  fs.writeFileSync(`${OUT}/fillText-scan.json`, JSON.stringify(SCAN, null, 1));
  ok(errors.length === 0, `screens pass: no console errors ${errors.join('|')}`); await page.close();
}
// ---------- v0.7.7: W3 Pie Pantry, review fixes, boss gift, rarity pips (screenshots from real saves) ----------
{
  const { page, G, drawn, errors } = await open();
  const shot = (name, clip) => page.screenshot({ path: `${SH}/${name}.png`, ...(clip ? { clip } : {}) });
  // a real save: every card unlocked, W1 and W2 cleared with the given stars (applyBattleResult, not hand-edited), W3 progress `w3`
  const SAVE = (opts) => G((o) => { const g = window.__game; const s = g.M.newSave(); for (const id of g.C.ALL_CARDS) s.cards[id].unlocked = true; s.coins = 800; s.diamonds = 40; s.onboard = 'done';
    for (let i = 0; i < o.wins; i++) g.M.applyBattleResult(s, i, 'win', (o.starsOf ? o.starsOf(i) : o.stars) || o.stars, {}, () => 0);
    if (o.laser) s.cards.laser.level = o.laser; g.setSave(s); g.S.cal = null; g.S.reveal = []; g.S.save.onboard = 'done'; g.go('map'); }, opts);
  const mapAt = async (w, name) => { await G((w) => { const g = window.__game; g.S.mapScroll = Math.max(0, Math.min(g.maxMapScroll(), 330 - g.nodePos(g.C.WORLD_START[w]).y)); }, w); await sleep(350); await shot(name); };
  // ----- W3 lock + the exact W2-lock text, from real saves -----
  await SAVE({ wins: 10, stars: 3 });
  await G(() => { const g = window.__game; const s = g.S.save; // W2: 7 of 10 won, 12 of 30 stars: 5 levels with 2 stars + 2 with 1 star
    const st = [2, 2, 2, 2, 2, 1, 1]; for (let k = 0; k < 7; k++) { s.levels[10 + k] = { stars: st[k], cleared: true }; } });
  await G(() => { const g = window.__game; g.S.mapScroll = Math.max(0, Math.min(g.maxMapScroll(), 330 - g.gateY(2))); }); 
  let tx = await drawn(400); await shot('w2-lock-text');
  const want = 'Win all 10 levels (7/10) + 18 stars (12/30)';
  const lockT = tx.find(([t]) => t === want);
  ok(!!lockT, `P2 the W2 lock reads exactly "${want}" (drawn: ${tx.filter(([t]) => /^Win all/.test(t)).map(([t]) => t).join(' | ') || 'none'})`);
  if (lockT) { const wpx = await G(([t, sz]) => { const g = window.__game; const c = document.createElement('canvas').getContext('2d'); c.font = `700 ${sz}px ${g.A.FONT}`; return c.measureText(t).width; }, lockT); ok(lockT[1] >= 12 && wpx <= 262, `P2 lock text fits 262 px: ${wpx.toFixed(1)} px at ${lockT[1]} px bold`); info(`W2 lock text width ${wpx.toFixed(1)} px @${lockT[1]}`); }
  // ----- W3 lock (W2 won but too few stars) and the gate when it opens -----
  await SAVE({ wins: 10, stars: 3 }); await G(() => { const g = window.__game, s = g.S.save; for (let i = 10; i < 20; i++) s.levels[i] = { stars: 1, cleared: true }; s.levels[19] = { stars: 1, cleared: true }; g.S.mapScroll = Math.max(0, Math.min(g.maxMapScroll(), 330 - g.gateY(3))); });
  tx = await drawn(400); await shot('w3-lock-gate');
  const l3 = tx.find(([t]) => /^Win all 10 levels \(10\/10\) \+ 18 stars \(10\/30\)$/.test(t)); ok(!!l3, `W3 lock "Win all 10 levels (10/10) + 18 stars (10/30)" (drawn: ${tx.filter(([t]) => /^Win all/.test(t)).map(([t]) => t).join(' | ') || 'none'})`);
  ok(await G(() => !window.__game.M.worldUnlocked(window.__game.S.save, 3)), 'W3 locked with all W2 won but 10 stars');
  await SAVE({ wins: 20, stars: 3 }); ok(await G(() => window.__game.M.worldUnlocked(window.__game.S.save, 3)), 'W3 opens with all W2 won + 18 stars (30 stars here)');
  await G(() => { const g = window.__game; g.S.mapScroll = Math.max(0, Math.min(g.maxMapScroll(), 330 - g.gateY(3))); }); tx = await drawn(500); await shot('w3-gate-open');
  ok(tx.some(([t]) => t === 'World 3: Pie Pantry') && tx.some(([t]) => /^Open!/.test(t)), 'W3 gate shows "World 3: Pie Pantry" and Open!');
  await mapAt(3, 'w3-map'); await G(() => { const g = window.__game; g.S.mapScroll = 0; }); await sleep(300); await shot('w3-map-bottom'); await G(() => { const g = window.__game; g.S.mapScroll = Math.max(0, g.maxMapScroll() - 0); }); await sleep(300); await shot('w3-map-top');
  // ----- W3 prep screens (rarity pips on the Incoming row) -----
  for (const li of [20, 21, 24, 25, 29]) { await G((li) => window.__game.openPrep(li), li); tx = await drawn(350); await shot(`w3-prep-L${li + 1}`);
    if (li === 21) ok(tx.some(([t]) => t === 'Buttery') && tx.some(([t]) => t === 'Incoming ants'), 'L22 prep lists Buttery (greasy) on the Incoming row');
    if (li === 24) ok(tx.some(([t]) => t === 'Brood'), 'L25 prep lists Brood (mama)'); if (li === 29) ok(tx.some(([t]) => /Pie Queen/.test(t)), 'L30 prep lists the Pie Queen'); }
  await G(() => window.__game.openPrep(24)); await sleep(300); await shot('rarity-pips-L25', { x: 0, y: 70, width: 393, height: 130 });
  await G(() => window.__game.openPrep(16)); await sleep(300); await shot('rarity-pips-L17', { x: 0, y: 70, width: 393, height: 130 });
  // ----- W3 battles: several levels, bot-played -----
  const play = async (li, secs, name, seed = 7) => { await G(([li, secs, seed]) => { const g = window.__game; g.go('map'); g.startBattle(li, ['slingshot', 'laser', 'zapper', 'spray', 'sound'], ['bomb', 'plane'], seed); g.S.paused = false; g.setAutoBot(false); const b = g.S.battle; b.crumbs = 600; g.simulate(secs, true); }, [li, secs, seed]); await sleep(450); await shot(name); return G(() => ({ ants: window.__game.S.battle.ants.length, types: [...new Set(window.__game.S.battle.ants.map((a) => a.type))] })); };
  for (const li of [20, 22, 25, 26, 27]) { const r = await play(li, 24, `w3-battle-L${li + 1}`); info(`W3 battle L${li + 1}: ${JSON.stringify(r)}`); }
  // Greasy: run until one is on the field
  const until = async (li, type, name, seed = 7) => { await G(([li, seed]) => { const g = window.__game; g.go('map'); g.startBattle(li, ['slingshot', 'laser', 'zapper', 'spray', 'sound'], [], seed); g.S.paused = false; g.setAutoBot(false); g.S.battle.crumbs = 600; }, [li, seed]);
    const found = await G((type) => { const g = window.__game; for (let k = 0; k < 120; k++) { g.simulate(1, true); if (g.S.battle.ants.some((a) => a.type === type && a.d > 40)) return true; if (g.S.battle.result) return false; } return false; }, type); await sleep(400); await shot(name); return found; };
  ok(await until(21, 'greasy', 'w3-greasy-L22'), 'Greasy ants appear on L22 (screenshot w3-greasy-L22)');
  // Mama + the split: kill her when she is mid-field, shoot the frame with the children
  ok(await until(24, 'mama', 'w3-mama-L25'), 'Mama appears on L25 (screenshot w3-mama-L25)');
  const sp = await G(() => { const g = window.__game, b = g.S.battle; const m = b.ants.find((a) => a.type === 'mama'); const before = b.ants.length; const cr = b.crumbs; b.kill(m, null); g.simulate(0.2, false); return { kids: b.ants.filter((a) => a.child).length, ants: b.ants.length - before, crumbs: b.crumbs - cr, expect: g.C.crumbsFor('mama') }; });
  await sleep(120); await shot('w3-mama-split'); ok(sp.kids === 3 && sp.crumbs === sp.expect, `Mama split: 3 small children, only Mama's own ${sp.expect} crumbs paid (${JSON.stringify(sp)})`);
  await G(() => { const g = window.__game; g.S.paused = true; }); await sleep(100); await shot('w3-mama-split-paused');
  // Pie Queen
  await G(() => { const g = window.__game; g.go('map'); g.startBattle(29, ['slingshot', 'laser', 'zapper', 'spray', 'sound'], [], 3); g.S.paused = false; g.setAutoBot(false); const b = g.S.battle; b.crumbs = 900; g.simulate(18, true); b.spawn('queen3', 120, 0); g.simulate(2, true); });
  await sleep(500); await shot('w3-pie-queen'); ok(await G(() => window.__game.S.battle.ants.some((a) => a.type === 'queen3')), 'Pie Queen on the field (w3-pie-queen)');
  await G(() => { const g = window.__game; g.S.paused = true; });
  // ----- cap badges: prep + in-battle + Cards, laser L7 -----
  await SAVE({ wins: 12, stars: 3, laser: 7 }); await G(() => window.__game.openPrep(10)); tx = await drawn(350); await shot('cap-badges-prep-W2');
  await G(() => window.__game.openPrep(0)); await drawn(350); await shot('cap-badges-prep-W1');
  await G(() => { const g = window.__game; g.go('map'); g.startBattle(0, ['laser', 'slingshot', 'zapper', 'spray', 'sound'], [], 5); g.S.paused = false; g.setAutoBot(false); g.S.battle.crumbs = 100; });
  tx = await drawn(400); await shot('cap-badge-battle-W1');
  const badges = tx.filter(([t]) => /^L\d+$/.test(t)).map(([t]) => t); info(`in-battle hand badges drawn on W1 L1 with laser L7: ${badges.join(',')}`);
  ok(badges.includes('L4') && !badges.includes('L7'), 'P1-2 in-battle hand badge shows min(level, cap) = L4 for the L7 Laser (no raw L7)');
  await G(() => { const g = window.__game; g.go('map'); g.startBattle(10, ['laser', 'slingshot', 'zapper', 'spray', 'sound'], [], 5); g.S.paused = false; g.setAutoBot(false); g.S.battle.crumbs = 100; });
  tx = await drawn(400); await shot('cap-badge-battle-W2'); ok(tx.filter(([t]) => /^L\d+$/.test(t)).some(([t]) => t === 'L5') && !tx.some(([t]) => t === 'L7'), 'P1-2 in-battle badge on W2 shows L5');
  await G(() => { const g = window.__game; g.go('cards'); }); tx = await drawn(400); await shot('cards-screen');
  await G(() => window.__game.openCardView('laser')); tx = await drawn(400); await shot('cards-cap-text-laser');
  ok(tx.some(([t]) => t === 'Fights as L5'), `P1 Cards: laser L7 in a W2 save reads "Fights as L5" (${tx.filter(([t]) => /ights as/.test(t)).map(([t]) => t)})`);
  ok(tx.some(([t]) => t === 'W1 acts as L4, W2 as L5'), `P1 Cards: the cap line reads "W1 acts as L4, W2 as L5" (${tx.filter(([t]) => /^W\d acts/.test(t)).map(([t]) => t)})`);
  await SAVE({ wins: 3, stars: 3, laser: 7 }); await G(() => window.__game.openCardView('laser')); tx = await drawn(400); await shot('cards-cap-text-laser-W1');
  ok(tx.some(([t]) => t === 'Fights as L4') && tx.some(([t]) => t === 'W1 acts as L4, W2 as L5'), 'P1 Cards, a W1-only save: "Fights as L4" + "W1 acts as L4, W2 as L5"');
  // ----- results screens from real saves: the strip gap, the boss gift, the pie queen -----
  const strip = async (li, perfect, name, setup) => { await G(([li, perfect, setup]) => { const g = window.__game; const s = g.M.newSave(); for (const id of g.C.ALL_CARDS) s.cards[id].unlocked = setup !== 'locked'; if (setup === 'locked') for (const id of g.C.STARTER_CARDS) s.cards[id].unlocked = true; s.onboard = 'done';
        for (let i = 0; i < li; i++) g.M.applyBattleResult(s, i, 'win', 3, {}, () => 0); g.setSave(s); g.S.cal = null; g.go('map'); g.startBattle(li, ['slingshot', 'laser', 'zapper', 'spray', 'glue'], [], 5); g.S.paused = false; const b = g.S.battle; b.result = 'win'; b.foodStored = b.cfg.foodHP; b.perfect = perfect;
        g.finishBattle(); g.S.reveal = []; g.S.result.t = 9; }, [li, perfect, setup]); await sleep(600);
    return G(() => { const g = window.__game, R = g.S.result; const bt = g.buttons().find((b) => b.id === 'rmap' || b.id === 'rcontinue'); const cv = document.querySelector('canvas'); const ctx2 = cv.getContext('2d'); const dpr = cv.width / cv.clientWidth; const scale = bt.cssW / bt.w; const offX = bt.sx - (bt.x + bt.w / 2) * scale, offY = bt.sy - (bt.y + bt.h / 2) * scale;
      let last = -1; for (let y = 440; y < bt.y; y++) { const d = ctx2.getImageData(Math.round((offX + 322 * scale) * dpr), Math.round((offY + y * scale) * dpr), 1, 1).data; if (Math.abs(d[0] - 224) < 28 && Math.abs(d[1] - 168) < 28 && Math.abs(d[2] - 48) < 40) last = y; }
      return { btnTop: bt.y, stripBottom: last, gift: R.out.bossGift && { id: R.out.bossGift.id, level: R.out.bossGift.level, newCard: R.out.bossGift.newCard }, prize: R.out.prize && { id: R.out.prize.id || R.out.prize.kind }, win: R.win }; }); };
  for (const [li, perfect, name, setup] of [[0, true, 'results-strip-L1-perfect'], [4, true, 'results-strip-L5-perfect'], [9, false, 'results-boss-gift-L10', 'locked'], [9, true, 'results-boss-gift-L10-twin-strips', 'locked'], [19, false, 'results-boss-gift-L20'], [29, false, 'results-pie-queen-L30'], [29, true, 'results-pie-queen-L30-perfect', 'locked']]) {
    const r = await strip(li, perfect, name, setup); await shot(name); info(`${name}: ${JSON.stringify(r)}`);
    if (r.stripBottom > 0) ok(r.btnTop - r.stripBottom >= 8, `P2 ${name}: strip bottom ${r.stripBottom} -> buttons ${r.btnTop} = ${r.btnTop - r.stripBottom}px gap (>= 8)`); else info(`${name}: no strip drawn`);
    if (li === 9 || li === 19 || li === 29) ok(!!r.gift, `${name}: boss gift strip data present ${JSON.stringify(r.gift)}`);
  }
  ok(errors.length === 0, `v0.7.7 pass: no console errors ${errors.join('|')}`); await page.close();
}
fs.writeFileSync(`${OUT}/qa-v077.log`, R.join('\n') + `\n\n${R.filter((x) => x.startsWith('PASS')).length} pass, ${fails} fail\n`);
console.log(R.join('\n')); console.log(`\n${fails ? 'FAILURES: ' + fails : 'ALL PASS'}`);
await browser.close(); process.exit(fails ? 1 : 0);
