// contrast: A1/A2/A3/A4/A5/A7 on RENDERED baked maps for every level. usage: WWW=<www-test dir> node contrast.mjs <out.json> ; prints a table
import { launch, sleep } from './harness.mjs'; import { writeFileSync } from 'node:fs';
const out = process.argv[2] || '/workspace/ant-td/qa/v0.8.2/contrast.json';
const h = await launch({ viewport: { width: 393, height: 852, deviceScaleFactor: 1 }, init: process.env.QA_WASH ? `window.__QA_WASH = ${+process.env.QA_WASH};` : undefined }); const { ev } = h;
const n = await ev(() => window.__game.C.LEVELS.length);
const FN = (li) => { const g = window.__game, A = g.A, C = g.C;
  const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
  const Lm = (r, gg, b) => 0.2126 * lin(r) + 0.7152 * lin(gg) + 0.0722 * lin(b); const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
  const cc = document.createElement('canvas').getContext('2d'); const hexL = (hh) => { cc.fillStyle = '#000'; cc.fillStyle = hh; const v = cc.fillStyle; const nn = parseInt(v.slice(1), 16); return Lm((nn >> 16) & 255, (nn >> 8) & 255, nn & 255); };
  const b = g.S.battle; const th = A.THEMES[b.map.theme];
  const cv = A.renderMapBackground(b.routes, b.map.theme, 400, 480, 1, b.props, window.__QA_WASH ? { ...(b.map.art || {}), wash: window.__QA_WASH } : b.map.art); /* v0.8.3 F9: QA_WASH = negative control */ const ctx = cv.getContext('2d');
  const px = (x, y) => { const d = ctx.getImageData(Math.round(x) - 1, Math.round(y) - 1, 3, 3).data; let r = 0, gg = 0, bb = 0; for (let i = 0; i < 9; i++) { r += d[i * 4]; gg += d[i * 4 + 1]; bb += d[i * 4 + 2]; } return [r / 9, gg / 9, bb / 9]; };
  const pts = []; for (const rt of b.routes) for (let d = 10; d < rt.length - 10; d += 8) pts.push(rt.at(d));
  const tr = pts.map((p) => px(p.x, p.y)); const avg = (a) => [0, 1, 2].map((k) => a.reduce((s, v) => s + v[k], 0) / a.length);
  const T = avg(tr); const gr = []; const gmap = {};
  for (let c = 0; c < 10; c++) for (let r = 0; r < 12; r++) { const x = c * 40 + 20, y = r * 40 + 20; if (pts.some((p) => Math.hypot(p.x - x, p.y - y) < 34)) continue; if (b.blocked.has(c + ',' + r)) continue; const q = [c, r, px(x, y)]; gr.push(q); gmap[c + ',' + r] = q; }
  const Lg = gr.map((q) => Lm(...q[2])); const Gm = avg(gr.map((q) => q[2]));
  const par = (k) => Lm(...avg(gr.filter((q) => (q[0] + q[1]) % 2 === k).map((q) => q[2])));
  const Lt = Lm(...T);
  // review method (adjacent tiles): A3 = max ratio between horizontally/vertically adjacent GROUND tiles; A1r = min over trail samples of trail px vs the ground tile nearest to it
  let a3r = 1; for (const q of gr) for (const [dx, dy] of [[1, 0], [0, 1]]) { const o = gmap[(q[0] + dx) + ',' + (q[1] + dy)]; if (o) a3r = Math.max(a3r, ratio(Lm(...q[2]), Lm(...o[2]))); }
  let a1r = 9; for (const p of pts.filter((_, i) => i % 3 === 0)) { let best = null, bd = 1e9; for (const q of gr) { const d = Math.hypot(q[0] * 40 + 20 - p.x, q[1] * 40 + 20 - p.y); if (d < bd) { bd = d; best = q; } } if (best) a1r = Math.min(a1r, ratio(Lm(...px(p.x, p.y)), Lm(...best[2]))); }
  // A5 on rendered pixels: the small / worker ant sprite body (thorax + abdomen samples) vs the trail
  const body = (id) => { const cv2 = document.createElement('canvas'); cv2.width = 160; cv2.height = 160; const c2 = cv2.getContext('2d'); c2.translate(80, 80); c2.scale(4, 4); A.drawAnt(c2, id, 0, {}); const s = (x, y) => { const d = c2.getImageData(Math.round(80 + x * 4) - 1, Math.round(80 + y * 4) - 1, 3, 3).data; return [d[0], d[1], d[2]]; }; const a = s(-1, 1.5); return Lm(a[0], a[1], a[2]); };
  const v = (id) => +ratio(hexL(A.ANT_COL[id]), Lt).toFixed(3); const vr = (id) => +ratio(body(id), Lt).toFixed(3);
  const lad = [['small', 'worker'], ['worker', 'big'], ['big', 'heavy']].map(([x, y]) => +ratio(hexL(A.ANT_COL[x]), hexL(A.ANT_COL[y])).toFixed(3));
  const padLs = Object.values(A.TOWER_PAD).slice(0, 6).map(hexL), gl = Math.max(hexL(th.a), hexL(th.b)); /* v0.8.2 R8 A10b colour level: the 6 side-tower pad colours vs the lightest ground of the theme */ const A10b = +Math.min(...padLs.map((pl) => ratio(pl, gl))).toFixed(3); /* v0.8.3 F9 A10r: the six pad colours as drawn (TOWER_PAD, x0.97 included) against the MEAN ground tile of the rendered map */ const A10r = +Math.min(...padLs.map((pl) => ratio(pl, Lm(...Gm)))).toFixed(3);
  return { li, theme: b.map.theme, A10b, A10r, A1: +ratio(Lt, Lm(...Gm)).toFixed(3), A1r: +a1r.toFixed(3), A2: +ratio(Lt, Math.max(...Lg)).toFixed(3), A3: +ratio(par(0), par(1)).toFixed(3), A3r: +a3r.toFixed(3),
    A4: lad, A5: v('small'), A5r: vr('small'), A5w: vr('worker'), A5nest: undefined, A7e: +ratio(hexL(th.edge), Lt).toFixed(2), A7l: +ratio(hexL(A.shade(th.edge, -0.28)), hexL(th.edge)).toFixed(2) }; };
const res = [];
for (let li = 0; li < n; li++) { await ev((li) => { const g = window.__game; g.go('map'); g.startBattle(li, ['slingshot'], [], 1); }, li); await sleep(60); res.push(await ev(`(${FN.toString()})(${li})`)); }
writeFileSync(out, JSON.stringify(res, null, 1));
const mn = (k) => Math.min(...res.map((r) => r[k])), mx = (k) => Math.max(...res.map((r) => r[k]));
console.log(`maps ${n}: A1 min ${mn('A1')} | A1r min ${mn('A1r')} | A2 min ${mn('A2')} | A3 max ${mx('A3')} | A10r min ${mn('A10r')} | A3r max ${mx('A3r')} | A5 min ${mn('A5')} | A5r(rendered) min ${mn('A5r')} | A7e min ${mn('A7e')} A7l min ${mn('A7l')}`);
const byTheme = {}; for (const r of res) (byTheme[r.theme] ||= []).push(r); for (const [t, a] of Object.entries(byTheme)) console.log(`theme ${t}: A5r min ${Math.min(...a.map((r) => r.A5r))} A5w min ${Math.min(...a.map((r) => r.A5w))} A2 min ${Math.min(...a.map((r) => r.A2))}`);
await h.close();
