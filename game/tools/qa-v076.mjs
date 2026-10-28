// v0.7.6 independent browser QA: V1 (A5 small ant >= 1.40 on 20 maps), V2 (A10 contact ring, 9 side towers x 4 themes, lizard + tractor shots),
// V3 (runtime fillText scan on every screen, drawn font sizes), E1/E2/E3/E4/E6 UI (results 'Star bonus' + 'Gems', calendar, boss gems, W2 cap line/pill).
// Output -> /workspace/ant-td/qa/v0.7.6/ (screenshots in shots/, qa-v076.log, fillText-scan.json). Needs `npm run build` (www-test with window.__game).
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import { serve } from './serve.mjs';
const OUT = '/workspace/ant-td/qa/v0.7.6'; const SH = `${OUT}/shots`; fs.mkdirSync(SH, { recursive: true });
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
    smallVsTrail: +ratio(hexL(A.ANT_COL.small), Lt).toFixed(2), inkVsTrail: +ratio(hexL(A.INK), Lt).toFixed(1), edgeVsBody: +ratio(hexL(th.edge), Lt).toFixed(2),
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
  ok(n === 20, `${n} maps measured`);
  const mn = (k) => Math.min(...cont.map((c) => c[k])), mx = (k) => Math.max(...cont.map((c) => c[k]));
  ok(mn('trailVsGround') >= 1.40, `A1 trail vs ground mean >= 1.40 (min ${mn('trailVsGround')})`);
  ok(mn('trailVsLightest') >= 1.25, `A2 trail vs lightest ground tile >= 1.25 (min ${mn('trailVsLightest')}; v0.7.5 1.27)`);
  ok(mn('trailVsLightest') >= 1.27, `A2 not regressed vs v0.7.5 (1.27)`);
  ok(mx('checker') <= 1.12, `A3 checker ratio <= 1.12 (max ${mx('checker')}; v0.7.5 1.119)`);
  ok(mn('smallVsTrail') >= 1.40, `V1/A5' small ant #f8c07e vs trail >= 1.40 on all 20 maps (min ${mn('smallVsTrail')}, plan expects 1.447)`);
  ok(mn('inkVsTrail') >= 7, `A6 INK vs trail >= 7 (min ${mn('inkVsTrail')})`);
  ok(mn('edgeVsBody') >= 1.8 && mn('lipVsEdge') >= 1.7, `A7 edge/lip (min ${mn('edgeVsBody')} / ${mn('lipVsEdge')})`);
  const byTheme = {}; for (const c of cont) (byTheme[c.theme] ||= []).push(c);
  for (const [t, a] of Object.entries(byTheme)) info(`theme ${t} (${a.length} maps): small/trail min ${Math.min(...a.map((x) => x.smallVsTrail))} | ring fill/ground min ${Math.min(...a.map((x) => x.ring))} | trail/ground min ${Math.min(...a.map((x) => x.trailVsGround))}`);
  ok(mn('ring') >= 1.4, `V2/A10' ring fill #a67c5c vs ground mean, all 20 maps: min ${mn('ring')} (>= 1.4; plan expects worst 1.91)`);
  fs.writeFileSync(`${OUT}/contrast-allmaps-v076.json`, JSON.stringify(cont, null, 1));
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
  ok(res.every((x) => x.r.side === 9) && sideOnly.length === 36, `V2 9 side towers x 4 themes = ${sideOnly.length} samples`);
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
  for (let i = 0; i < 20; i++) { await G((i) => window.__game.openPrep(i), i); await scan(`prep L${i + 1}`, 220, [0, 9, 10, 19].includes(i) ? `screen-prep-L${i + 1}` : null); }
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
  ok(tx.some(([t]) => t === 'A card above L5 acts as L5 in this world'), 'E4/E-A6 prep L11 shows "A card above L5 acts as L5 in this world"');
  { const pills = tx.filter(([t]) => t === 'acts as L5').length, frames = tx.filter(([t]) => t === 'A card above L5 acts as L5 in this world').length; ok(frames > 0 && pills === 2 * frames, `E4/E-A6 the two over-cap cards (L6, L7) show an "acts as L5" pill (${pills} pill draws / ${frames} frames)`); }
  ok(tx.filter(([t]) => /^acts as L5$|in this world/.test(t)).every(([, s]) => s >= 12), 'E4 cap text drawn at >= 12 px');
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
fs.writeFileSync(`${OUT}/qa-v076.log`, R.join('\n') + `\n\n${R.filter((x) => x.startsWith('PASS')).length} pass, ${fails} fail\n`);
console.log(R.join('\n')); console.log(`\n${fails ? 'FAILURES: ' + fails : 'ALL PASS'}`);
await browser.close(); process.exit(fails ? 1 : 0);
