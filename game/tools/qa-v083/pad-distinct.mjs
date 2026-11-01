// v0.8.3 F3 lint: every base tower pad and every cabinet skin pad is pairwise CIE76 dE >= 15, except the named KNOWN base-pair collisions (they pre-date the cabinet).
// usage: node pad-distinct.mjs [--inject]   (--inject adds the old v0.8.2 "Lime" skin: the lint must FAIL)
import * as C from '../../src/config.js'; import * as A from '../../src/art.js';
const lab = (hex) => { const f = (i) => { let v = parseInt(hex.slice(i, i + 2), 16) / 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; const [r, g, b] = [1, 3, 5].map(f);
  let x = (0.4124 * r + 0.3576 * g + 0.1805 * b) / 0.95047, y = 0.2126 * r + 0.7152 * g + 0.0722 * b, z = (0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.08883; const t = (v) => (v > 0.008856 ? Math.cbrt(v) : 7.787 * v + 16 / 116);
  return [116 * t(y) - 16, 500 * (t(x) - t(y)), 200 * (t(y) - t(z))]; };
const dE = (a, b) => Math.hypot(...lab(a).map((v, i) => v - lab(b)[i]));
const KNOWN = { 'gate|tractor': 7.7, 'gate|glue': 9.2, 'ball|zapper': 9.9 }; // base-pair collisions that pre-date v0.8.3 (computed 7.7 / 9.2 / 9.9); a NEW pair under 15 fails
const items = Object.entries(A.TOWER_PAD).map(([k, v]) => ({ id: k, hex: v })).concat(C.SKINS.map((s) => ({ id: s.id, hex: s.pad })));
if (process.argv.includes('--inject')) items.push({ id: 'skin-lime-old', hex: '#42ab0f' });
const bad = [], known = []; let min = 1e9;
for (let i = 0; i < items.length; i++) for (let j = i + 1; j < items.length; j++) { const d = dE(items[i].hex, items[j].hex), key = [items[i].id, items[j].id].sort().join('|'); if (d < 15) { if (KNOWN[key] !== undefined && Math.abs(KNOWN[key] - d) < 0.1) known.push(`${key} ${d.toFixed(1)}`); else bad.push(`${key} ${d.toFixed(1)}`); } else min = Math.min(min, d); }
console.log(`pad-distinct: ${items.length} pads, min dE outside KNOWN ${min.toFixed(1)}; KNOWN: ${known.join(', ') || 'none'}; ${bad.length ? 'FAIL ' + bad.join(' | ') : 'PASS'}`); process.exit(bad.length ? 1 : 0);
