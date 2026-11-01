// plate-edge lint (v0.8.2, Crumbie's A3r ruling): on every level's map, the G1.4 treat plate (outline ellipse + contact shadow, with the map's art.plate override applied)
// must not change any ground-sample tile centre (the 3x3 patch contrast.mjs samples): an OUTLINE edge crossing a patch fails outright; a SHADOW edge crossing a patch is allowed only while every adjacent-ground pair that includes the touched tile stays <= 1.356 (the v0.8.0 A3r max) in the rendered map. The effect (with/without plate) is reported for the record.
// usage: node plate-edge.mjs [out.json]; exit 1 when any map fails
import { launch, sleep } from './harness.mjs'; import { writeFileSync } from 'node:fs';
const out = process.argv.find((a) => a.endsWith('.json')) || '/workspace/ant-td/qa/v0.8.2/plate-edge.json';
const h = await launch({ viewport: { width: 393, height: 852, deviceScaleFactor: 1 } }); const { ev } = h;
const n = await ev(() => window.__game.C.LEVELS.length);
const FN = (li) => { const g = window.__game, b = g.S.battle, po = (b.map.art && b.map.art.plate) || {}, s = po.scale || 1, dy = po.dy || 0;
  const pts = []; for (const rt of b.routes) for (let d = 10; d < rt.length - 10; d += 8) pts.push(rt.at(d));
  const ends = []; for (const rt of b.routes) { const p = rt.pts[rt.pts.length - 1]; if (!ends.some((q) => Math.hypot(q.x - p.x, q.y - p.y) < 5)) ends.push(p); }
  const bad = [], cand = [];
  for (const e of ends) { const cy = e.y + 23.5 + dy; // [centre dx, dy, rx, ry] of the outline (stroke 2.4 -> +1.2) and the shadow, scaled about the plate centre
    const ells = [['outline', 0, 0, 31.2 * s, 12.2 * s], ['shadow', 0, 10 * s, 32 * s, 7 * s]];
    for (let c = 0; c < 10; c++) for (let r = 0; r < 12; r++) { const x = c * 40 + 20, y = r * 40 + 20; if (pts.some((p) => Math.hypot(p.x - x, p.y - y) < 34)) continue; if (b.blocked.has(c + ',' + r)) continue;
      for (const [nm, ox, oy, rx, ry] of ells) { let inn = 0, outn = 0; for (const [px, py] of [[-1.5, -1.5], [0, -1.5], [1.5, -1.5], [-1.5, 0], [0, 0], [1.5, 0], [-1.5, 1.5], [0, 1.5], [1.5, 1.5]]) { const q = Math.hypot((x + px - e.x - ox) / rx, (y + py - cy - oy) / ry); (q <= 1 ? inn++ : outn++); }
        if (inn && outn) cand.push({ tile: `${c},${r}`, x, y, edge: nm }); } }
  }
  const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); }, Lm = (a) => 0.2126 * lin(a[0]) + 0.7152 * lin(a[1]) + 0.0722 * lin(a[2]);
  const patch = (cv, x, y) => { const d = cv.getContext('2d').getImageData(Math.round(x) - 1, Math.round(y) - 1, 3, 3).data; const a = [0, 0, 0]; for (let i = 0; i < 9; i++) for (let k = 0; k < 3; k++) a[k] += d[i * 4 + k] / 9; return a; };
  const A = g.A, a1 = { ...(b.map.art || {}) }, a0 = { ...a1, plate: { ...(a1.plate || {}), hide: true } };
  const w = A.renderMapBackground(b.routes, b.map.theme, 400, 480, 1, b.props, a1), wo = A.renderMapBackground(b.routes, b.map.theme, 400, 480, 1, b.props, a0);
  for (const q of cand) { const l1 = Lm(patch(w, q.x, q.y)), l0 = Lm(patch(wo, q.x, q.y)); q.effect = +((Math.max(l1, l0) + 0.05) / (Math.min(l1, l0) + 0.05)).toFixed(3); const gl = (c, r) => { if (c < 0 || r < 0 || c > 9 || r > 11) return null; const x = c * 40 + 20, y = r * 40 + 20; if (pts.some((p) => Math.hypot(p.x - x, p.y - y) < 34) || b.blocked.has(c + ',' + r)) return null; return Lm(patch(w, x, y)); };
    const [tc, tr] = q.tile.split(',').map(Number), lt = gl(tc, tr); q.pair = 1; for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const lo = gl(tc + dx, tr + dy); if (lo != null) q.pair = Math.max(q.pair, +((Math.max(lt, lo) + 0.05) / (Math.min(lt, lo) + 0.05)).toFixed(3)); }
    if (q.edge === 'outline' || q.pair > 1.356) bad.push(q); }
  return { li, level: li + 1, map: b.mapId, cand, bad }; };
const res = [];
for (let li = 0; li < n; li++) { await ev((li) => { const g = window.__game; g.go('map'); g.startBattle(li, ['slingshot'], [], 1); }, li); await sleep(40); res.push(await ev(`(${FN.toString()})(${li})`)); }
const fails = res.filter((r) => r.bad.length);
writeFileSync(out, JSON.stringify(res, null, 1));
console.log(fails.length ? 'FAIL plate-edge: ' + fails.map((r) => `L${r.level} ${r.map} ${JSON.stringify(r.bad.map((q) => [q.tile, q.edge, 'effect ' + q.effect, 'pair ' + q.pair]))}`).join(' | ') : `PASS plate-edge: ${res.length} levels, ${res.reduce((a, r) => a + r.cand.length, 0)} patches touched by a shadow edge, worst touched-tile pair ${Math.max(1, ...res.flatMap((r) => r.cand.map((q) => q.pair)))} (limit 1.356)`);
await h.close(); process.exit(fails.length ? 1 : 0);
