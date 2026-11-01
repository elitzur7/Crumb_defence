// v0.8.3 F10 lint: every maps.<id>.art.plate override must either set hide:true, or leave >= 40 % of the plate outline ellipse OUTSIDE the cookie sprite box (so a half-hidden plate is never an accident).
// usage: node plate-lint.mjs [--inject]  (--inject re-adds the v0.8.2 L58 override { dy: -21.5, scale: 0.92 }: the lint must FAIL)
import TUNING from '../../../tuning/tuning.json' with { type: 'json' };
const maps = JSON.parse(JSON.stringify(TUNING.maps)); if (process.argv.includes('--inject')) maps.w6_waffle_iron.art = { plate: { dy: -21.5, scale: 0.92 } };
const BOX = 22; // the treat sprite box: +-22 px around the route end (tile 40; the cookie body radius is < 20)
const outside = (po) => { const s = po.scale || 1, dy = 23.5 + (po.dy || 0); let tot = 0, out = 0; for (let x = -30; x <= 30; x += 0.5) for (let y = -11; y <= 11; y += 0.5) { if ((x / 30) ** 2 + (y / 11) ** 2 > 1) continue; tot++; const X = x * s, Y = y * s + dy; if (Math.abs(X) > BOX || Math.abs(Y) > BOX) out++; } return out / tot; };
const rows = [], fails = [];
for (const [id, m] of Object.entries(maps)) { const po = m.art && m.art.plate; if (!po) continue; const f = po.hide ? 1 : outside(po); rows.push({ id, hide: !!po.hide, outsideFrac: +f.toFixed(3) }); if (!po.hide && f < 0.4) fails.push(`${id}: only ${(f * 100).toFixed(0)} % of the plate is outside the cookie box and plate.hide is not set`); }
console.log(`plate-lint: ${rows.length} plate override(s) ${JSON.stringify(rows)}; ${fails.length ? 'FAIL ' + fails.join(' | ') : 'PASS'}`); process.exit(fails.length ? 1 : 0);
