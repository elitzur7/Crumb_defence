// v0.8.0 P1: the shared soft-3D "glossy candy" recipes (spec §6). Pure canvas code, no assets, no shadowBlur / filter, gradients only in
// baked sprites or in a handful of per-screen shapes. Everything here is module-level pure (loads in node for the tests).
export const INK = '#523c4b';
export const FONT_BODY = "'Trebuchet MS','Nunito','Arial Rounded MT Bold','Segoe UI',Roboto,sans-serif";
// Lilita One (SIL OFL 1.1, bundled in fonts/, loaded from 'self' only - the app never goes to the internet) for titles, numbers and button labels
export const FONT_DISPLAY = `'Lilita One','Trebuchet MS','Arial Rounded MT Bold',${FONT_BODY}`;

// ---- colour maths ----
const _pc = new Map();
export function parseColor(c) {
  let v = _pc.get(c); if (v) return v;
  let r = 0, g = 0, b = 0;
  if (c[0] === '#') { let h = c.slice(1); if (h.length === 3) h = h.split('').map((x) => x + x).join(''); const n = parseInt(h.slice(0, 6), 16); r = (n >> 16) & 255; g = (n >> 8) & 255; b = n & 255; }
  else { const m = c.match(/-?[\d.]+/g); if (m) { r = +m[0]; g = +m[1]; b = +m[2]; } }
  v = [r, g, b]; if (_pc.size > 600) _pc.clear(); _pc.set(c, v); return v;
}
const hx = (n) => { n = Math.max(0, Math.min(255, Math.round(n))); return (n < 16 ? '0' : '') + n.toString(16); };
export function toHex(rgb) { return '#' + hx(rgb[0]) + hx(rgb[1]) + hx(rgb[2]); }
export function mixHex(a, b, t) { const p = parseColor(a), q = parseColor(b); return toHex([p[0] + (q[0] - p[0]) * t, p[1] + (q[1] - p[1]) * t, p[2] + (q[2] - p[2]) * t]); }
export function lum(c) { const [r, g, b] = parseColor(c); return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255; }
function hueOf(c) { const [r, g, b] = parseColor(c).map((v) => v / 255); const mx = Math.max(r, g, b), mn = Math.min(r, g, b), d = mx - mn; if (d < 0.001) return [0, 0]; let h = mx === r ? ((g - b) / d) % 6 : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h *= 60; if (h < 0) h += 360; return [h, d / (mx || 1)]; }

// ---- ramps (spec §6.1): hi (rim light), lit, base, shade, deep, line ----
const _ramp = new Map();
export function ramp(base, cool) {
  const key = base + (cool === undefined ? '' : cool ? '|c' : '|w'); let r = _ramp.get(key); if (r) return r;
  if (cool === undefined) { const [h, s] = hueOf(base); cool = s > 0.12 && h >= 85 && h <= 285; } // greens, cyans, blues, purples get the cool shadow
  r = cool
    ? { hi: mixHex(base, '#ffffff', 0.7), lit: mixHex(base, '#fffdf0', 0.32), base, shade: mixHex(base, '#6f6aa8', 0.34), deep: mixHex(base, '#4a3f7a', 0.56), line: INK }
    : { hi: mixHex(base, '#fffdf0', 0.7), lit: mixHex(base, '#fffdf0', 0.32), base, shade: mixHex(base, '#8c3f4f', 0.30), deep: mixHex(base, '#5a2438', 0.5), line: INK };
  if (_ramp.size > 500) _ramp.clear(); _ramp.set(key, r); return r;
}
// candy palette (spec §6.2): [lit, base, deep] per button / gem family
export const CANDY = {
  green: ['#b6f08a', '#6fd44a', '#2f9a3a'], gold: ['#fff0a0', '#ffd23f', '#d98a14'], orange: ['#ffd29a', '#ff9a3c', '#d8561a'],
  pink: ['#ffc4d8', '#ff7fa8', '#d1497b'], cyan: ['#c4f6ff', '#6fd8ef', '#2a98c0'], blue: ['#c8dcff', '#7ba8ff', '#3f66d6'],
  red: ['#ffb0a4', '#ff6a5a', '#c93030'], purple: ['#e2d0ff', '#b896f5', '#7a4cc2'], grey: ['#eee6ea', '#d8cfd6', '#a89aa6'],
};
// map the app's existing pastel button colours onto the candy families (so every call site inherits the look)
const COL2CANDY = { '#9fe0b5': 'green', '#ffd27a': 'gold', '#d9cfe0': 'purple', '#ffb3c1': 'pink', '#b5d8ff': 'blue', '#ff9a9a': 'red', '#ffd0d0': 'red', '#8fd0ff': 'cyan', '#ffb3b3': 'red', '#d8cfd6': 'grey' };
export function candyOf(col) {
  const k = COL2CANDY[col.toLowerCase()]; if (k) return CANDY[k];
  const r = ramp(col); return [r.lit, col, r.shade];
}

// ---- contact shadow (the ONE shadow shape: a soft ellipse, no blur) ----
export function contactShadow(ctx, x, y, rx, ry = rx * 0.34, a = 0.2) {
  ctx.save(); ctx.translate(x, y); ctx.scale(1, ry / Math.max(rx, 0.01));
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx * 1.15);
  g.addColorStop(0, `rgba(74,40,60,${a * 1.25})`); g.addColorStop(0.55, `rgba(74,40,60,${a * 0.85})`); g.addColorStop(1, 'rgba(74,40,60,0)');
  ctx.beginPath(); ctx.arc(0, 0, rx * 1.15, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill(); ctx.restore();
}

// ---- glossy blob (spec §6.3) ----
// Body radial gradient (lit up-left, 4 stops), a thin bounce light low-right, the INK outline, then ONE specular ellipse (gloss) + one dot.
// o = { lw (outline, default 2), rot, gloss (0..1, default 1), rim (bool), cool (bool|undefined) }
export function drawGlossyBlob(ctx, x, y, rx, ry, base, o = {}) {
  const lw = o.lw === undefined ? 2 : o.lw, rot = o.rot || 0, m = Math.min(rx, ry), gl = o.gloss === undefined ? 1 : o.gloss;
  const R = ramp(base, o.cool);
  const g = ctx.createRadialGradient(x - rx * 0.36, y - ry * 0.46, Math.max(0.6, m * 0.1), x, y, Math.max(rx, ry) * 1.18);
  g.addColorStop(0, R.lit); g.addColorStop(0.42, R.base); g.addColorStop(0.82, R.shade); g.addColorStop(1, R.deep);
  ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
  if (m >= 5 && o.rim !== false) { // bounce light: a thin warm arc along the lower-right inside edge
    ctx.beginPath(); ctx.ellipse(x, y, rx * 0.8, ry * 0.8, rot, Math.PI * 0.12, Math.PI * 0.62); ctx.lineWidth = Math.max(1, m * 0.13); ctx.lineCap = 'round';
    ctx.strokeStyle = mixHex(R.base, '#fffdf0', 0.38); ctx.globalAlpha = 0.55; ctx.stroke(); ctx.globalAlpha = 1;
  }
  if (lw) { ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2); ctx.lineWidth = lw; ctx.strokeStyle = o.line || INK; ctx.stroke(); } // (the rim arc replaced the current path: re-trace the outline)
  if (gl > 0 && m >= 3.2) { // the one gloss: a soft ellipse near the top-left + a dot
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
    ctx.beginPath(); ctx.ellipse(-rx * 0.32, -ry * 0.44, rx * 0.34, ry * 0.2, -0.5, 0, Math.PI * 2); ctx.fillStyle = R.hi; ctx.globalAlpha = 0.78 * gl; ctx.fill();
    if (m >= 6) { ctx.beginPath(); ctx.arc(-rx * 0.6, -ry * 0.12, Math.max(0.8, m * 0.07), 0, Math.PI * 2); ctx.globalAlpha = 0.85 * gl; ctx.fillStyle = '#ffffff'; ctx.fill(); }
    ctx.restore(); ctx.globalAlpha = 1;
  }
}
// rounded-rect path helper (kept here so recipes has no import cycle with art.js)
export function rrPath(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
// ---- beveled tile / slab (spec §6.4): a lip (side slab) below, the face with a top-lit gradient, an inner top highlight and bottom shade, the outline ----
// o = { lip (default 4), r, lw (default 2.2), hi (inner highlight alpha), outline }
export function drawBeveledTile(ctx, x, y, w, h, base, o = {}) {
  const lip = o.lip === undefined ? 4 : o.lip, r = o.r === undefined ? Math.min(10, h / 3) : o.r, lw = o.lw === undefined ? 2.2 : o.lw, R = ramp(base, o.cool);
  if (lip) { rrPath(ctx, x, y + lip, w, h, r); ctx.fillStyle = R.deep; ctx.fill(); if (lw) { ctx.lineWidth = lw; ctx.strokeStyle = o.line || INK; ctx.stroke(); } }
  const g = ctx.createLinearGradient(0, y, 0, y + h); g.addColorStop(0, R.lit); g.addColorStop(0.5, R.base); g.addColorStop(1, R.shade);
  rrPath(ctx, x, y, w, h, r); ctx.fillStyle = g; ctx.fill();
  if (lw) { ctx.lineWidth = lw; ctx.strokeStyle = o.line || INK; ctx.stroke(); }
  if (h >= 14 && w >= 14) { // inner top highlight + inner bottom shade (inset, so it stays inside the corners)
    ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x + r * 0.7 + 1, y + lw + 1.2); ctx.lineTo(x + w - r * 0.7 - 1, y + lw + 1.2); ctx.lineWidth = 1.6; ctx.strokeStyle = R.hi; ctx.globalAlpha = o.hi === undefined ? 0.8 : o.hi; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x + r * 0.7 + 1, y + h - lw - 1.4); ctx.lineTo(x + w - r * 0.7 - 1, y + h - lw - 1.4); ctx.lineWidth = 2.2; ctx.strokeStyle = R.deep; ctx.globalAlpha = 0.28; ctx.stroke(); ctx.globalAlpha = 1;
  }
}

// ---- small sprite cache (LRU) for UI faces: keyed by size + colour + device scale; drawn with one drawImage ----
const _spr = new Map(); let _sprCount = 0;
export function sprStats() { return { entries: _spr.size, bakes: _sprCount }; }
export function clearSprites() { _spr.clear(); }
let _mk = null; export function setCanvasFactory(f) { _mk = f; }
function mkCanvas(w, h) { if (_mk) return _mk(w, h); if (typeof OffscreenCanvas !== 'undefined') return new OffscreenCanvas(w, h); const c = document.createElement('canvas'); c.width = w; c.height = h; return c; }
function devScale(ctx) { const m = ctx.getTransform(); return Math.min(4, Math.max(0.5, Math.round(Math.hypot(m.a, m.b) * 4) / 4)); }
// bake (w x h logical px, pad around) -> draw(g) paints in logical coordinates with the top-left of the box at (pad, pad)
export function bakedBox(ctx, key, x, y, w, h, pad, draw, cap = 96) {
  const sc = devScale(ctx), k = key + '@' + sc + '|' + w + 'x' + h; let e = _spr.get(k);
  if (!e) {
    const cv = mkCanvas(Math.ceil((w + pad * 2) * sc), Math.ceil((h + pad * 2) * sc)); const g = cv.getContext('2d'); g.scale(sc, sc); g.translate(pad, pad); g.lineJoin = 'round'; g.lineCap = 'round'; draw(g, w, h);
    e = { cv, sc }; _sprCount++; if (_spr.size >= cap) _spr.delete(_spr.keys().next().value);
  } else { _spr.delete(k); }
  _spr.set(k, e); // LRU touch
  ctx.drawImage(e.cv, x - pad, y - pad, w + pad * 2, h + pad * 2);
}

// ---- pill button (spec §6.5): lip + beveled face + top gloss strip. state: normal / pressed (face drops 3, lip hidden) / disabled ----
export function drawPillButton(ctx, x, y, w, h, family, o = {}) {
  const press = o.pressed ? 3 : 0, dis = !!o.disabled, r = o.r === undefined ? Math.min(h / 2, 16) : o.r;
  const fam = dis ? CANDY.grey : (typeof family === 'string' && CANDY[family]) || (Array.isArray(family) ? family : candyOf(family || '#ffb3c1'));
  bakedBox(ctx, 'pill|' + fam.join(',') + '|' + (o.pressed ? 1 : 0) + '|' + r, x, y, w, h + 5, 4, (g, bw, bh) => {
    const hh = bh - 5, ph = press;
    rrPath(g, 0, 4, bw, hh, r); g.fillStyle = fam[2]; g.fill(); g.lineWidth = 2.5; g.strokeStyle = INK; g.stroke();
    const gr = g.createLinearGradient(0, ph, 0, ph + hh); gr.addColorStop(0, fam[0]); gr.addColorStop(0.55, fam[1]); gr.addColorStop(1, mixHex(fam[1], fam[2], 0.42));
    rrPath(g, 0, ph, bw, hh, r); g.fillStyle = gr; g.fill(); g.lineWidth = 2.5; g.strokeStyle = INK; g.stroke();
    rrPath(g, 5, ph + 3.5, bw - 10, Math.max(6, hh * 0.3), Math.min(8, hh * 0.18)); g.fillStyle = 'rgba(255,255,255,0.42)'; g.fill(); // the gloss strip (< 25% of the face)
    g.beginPath(); g.moveTo(r * 0.8, ph + hh - 4.5); g.lineTo(bw - r * 0.8, ph + hh - 4.5); g.lineWidth = 2; g.strokeStyle = fam[2]; g.globalAlpha = 0.3; g.stroke(); g.globalAlpha = 1;
  });
}

// ---- chunky text (spec §6.6): Lilita One, fill, a darker inner stroke for the pop, the INK outline; modes title / num / btn / plain ----
export const TEXT_MODES = {
  title: { fill: '#fff6d8', inner: '#f59a2a', outer: '#b8531a', ink: INK, drop: 3 },
  num: { fill: '#fffdf0', inner: null, outer: INK, ink: INK, drop: 1.5 },
  btn: { fill: '#ffffff', inner: null, outer: INK, ink: INK, drop: 2 },
  plain: { fill: '#fffdf0', inner: null, outer: INK, ink: INK, drop: 0 },
};
let _fontEpoch = 0, _fontOk = false;
export function fontReady() { return _fontOk; }
export function setFontReady(v) { if (v !== _fontOk) { _fontOk = v; _fontEpoch++; _spr.clear(); } }
// o = { mode, fill, align, outline (px override), drop }
export function drawChunkyText(ctx, str, x, y, size, o = {}) {
  const M = TEXT_MODES[o.mode || 'btn'], fill = o.fill || M.fill, align = o.align || 'center';
  ctx.save(); ctx.font = `${size}px ${FONT_DISPLAY}`; ctx.textAlign = align; ctx.textBaseline = 'middle'; ctx.lineJoin = 'round'; ctx.miterLimit = 2;
  const ow = o.outline || Math.max(2.4, size * 0.16);
  if (M.drop) { ctx.lineWidth = ow * 2; ctx.strokeStyle = 'rgba(60,30,40,0.30)'; ctx.strokeText(str, x, y + M.drop); }
  ctx.lineWidth = ow * 2; ctx.strokeStyle = M.ink; ctx.strokeText(str, x, y);
  if (M.inner) { ctx.lineWidth = ow * 1.35; ctx.strokeStyle = M.outer; ctx.strokeText(str, x, y); }
  // one fillText per label (the regress "drawn once per frame" check counts them): the title's lit top half is a hard-stop gradient on the same fill
  if (M.inner && size >= 20) { const lit = mixHex(fill, '#ffffff', 0.35), g = ctx.createLinearGradient(0, y - size * 0.5, 0, y + size * 0.5); g.addColorStop(0, lit); g.addColorStop(0.45, lit); g.addColorStop(0.46, fill); g.addColorStop(1, fill); ctx.fillStyle = g; }
  else ctx.fillStyle = fill;
  ctx.fillText(str, x, y);
  ctx.restore();
}

// ---- sparkle (4-point star), burst rays, squash ----
export function sparkle(ctx, x, y, r, col = '#fff7a8', rot = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.beginPath();
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, rr2 = i % 2 ? r * 0.28 : r; ctx.lineTo(Math.cos(a) * rr2, Math.sin(a) * rr2); }
  ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ctx.lineWidth = Math.max(0.8, r * 0.14); ctx.strokeStyle = INK; ctx.lineJoin = 'round'; ctx.stroke(); ctx.restore();
}
// a 5-point rounded star in candy gold (confetti / result stars share it); size r outer radius
export function candyStar(ctx, x, y, r, base = '#ffd23f', lw = 1.6, rot = 0) { // cached: the star (a gradient + outline + glint) is baked per size / colour, then blitted rotated
  const rr = r >= 6 ? Math.round(r) : Math.round(r * 2) / 2, S = rr + lw + 1;
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot);
  bakedBox(ctx, 'star' + rr + base + lw, -S, -S, 2 * S, 2 * S, 1, (g) => { g.translate(S, S); candyStarRaw(g, 0, 0, rr, base, lw, 0); }, 128);
  ctx.restore();
}
function candyStarRaw(ctx, x, y, r, base, lw, rot) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.lineJoin = 'round';
  ctx.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, rr2 = i % 2 ? r * 0.5 : r; ctx.lineTo(Math.cos(a) * rr2, Math.sin(a) * rr2); } ctx.closePath();
  const R = ramp(base, false); const g = ctx.createLinearGradient(0, -r, 0, r); g.addColorStop(0, R.lit); g.addColorStop(0.55, R.base); g.addColorStop(1, R.shade);
  ctx.fillStyle = g; ctx.fill(); if (lw) { ctx.lineWidth = lw; ctx.strokeStyle = INK; ctx.stroke(); }
  if (r >= 6) { ctx.beginPath(); ctx.moveTo(-r * 0.3, -r * 0.35); ctx.lineTo(-r * 0.08, -r * 0.68); ctx.lineWidth = Math.max(1, r * 0.12); ctx.strokeStyle = 'rgba(255,255,255,0.8)'; ctx.lineCap = 'round'; ctx.stroke(); }
  ctx.restore();
}
// squash & stretch about the feet: scale(1/s, s) with the origin at (x, y) = the contact point. k: 0..1 envelope, amt: peak (0.12 = 12%)
export function squashAt(ctx, x, y, k, amt = 0.12) { const s = 1 + amt * Math.sin(Math.max(0, Math.min(1, k)) * Math.PI); ctx.translate(x, y); ctx.scale(1 / Math.sqrt(s), s); ctx.translate(-x, -y); }
export const easeOutBack = (k) => { k = Math.max(0, Math.min(1, k)); const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(k - 1, 3) + c1 * Math.pow(k - 1, 2); };
// light burst: n wedge rays that fade outward. Drawn live but it is ONE path + one gradient; call with the 'result' screen's centre.
export function lightBurst(ctx, x, y, R, t, o = {}) {
  const n = o.rays || 14, a0 = (o.spin === undefined ? 0.25 : o.spin) * t, al = o.alpha === undefined ? 0.42 : o.alpha;
  ctx.save(); ctx.translate(x, y); ctx.rotate(a0);
  const g = ctx.createRadialGradient(0, 0, 4, 0, 0, R); g.addColorStop(0, `rgba(255,248,196,${al})`); g.addColorStop(0.6, `rgba(255,236,150,${al * 0.55})`); g.addColorStop(1, 'rgba(255,236,150,0)');
  ctx.beginPath(); for (let i = 0; i < n; i++) { const a = i * Math.PI * 2 / n, w = Math.PI / n * 0.62; ctx.moveTo(0, 0); ctx.lineTo(Math.cos(a - w) * R, Math.sin(a - w) * R); ctx.lineTo(Math.cos(a + w) * R, Math.sin(a + w) * R); ctx.closePath(); }
  ctx.fillStyle = g; ctx.fill(); ctx.restore();
}

// ---- embossed-star coin (spec §6.7) + coin pile ----
function coinDraw(g, cx, cy, r, th) { // a slightly squashed disc with a side slab: lip first, then the face
  const ry = r * 0.92;
  g.beginPath(); g.ellipse(cx, cy + th, r, ry, 0, 0, Math.PI * 2); g.fillStyle = '#c47a10'; g.fill(); g.lineWidth = Math.max(1.4, r * 0.2); g.strokeStyle = INK; g.stroke();
  drawGlossyBlob(g, cx, cy, r, ry, '#ffd23f', { lw: Math.max(1.4, r * 0.2), gloss: 0.9, cool: false });
  g.beginPath(); g.ellipse(cx, cy, r * 0.7, ry * 0.7, 0, 0, Math.PI * 2); g.lineWidth = Math.max(0.8, r * 0.1); g.strokeStyle = '#d98a14'; g.stroke(); // inner ring
  if (r >= 4.5) { // the embossed star: dark offset below-right, then a light star (the pressed-in look)
    g.save(); g.translate(cx, cy + 0.2); const sr = r * 0.46;
    for (const [dx, dy, col] of [[0.6, 0.7, '#b8741a'], [-0.3, -0.4, '#fff6b8']]) { g.beginPath(); for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5, q = i % 2 ? sr * 0.5 : sr; g.lineTo(dx + Math.cos(a) * q, dy + Math.sin(a) * q); } g.closePath(); g.fillStyle = col; g.fill(); }
    g.restore();
  }
}
export function drawCoin(ctx, x, y, r = 8) { bakedBox(ctx, 'coin' + r, x - r - 1, y - r - 1, 2 * r + 2, 2 * r + 3, 2, (g) => coinDraw(g, r + 1, r + 1, r, Math.max(1.2, r * 0.22))); }
// the pile: rows of overlapping stacked coins, baked (w x h = 78 x 30, bottom centre = (w/2, h)); x, y = bottom centre
export const PILE = { w: 78, h: 30 };
export function drawCoinPile(ctx, x, y, k = 1) {
  bakedBox(ctx, 'pile', x - PILE.w / 2 * k, y - PILE.h * k, PILE.w * k, PILE.h * k, 6, (g) => {
    g.save(); g.scale(k, k);
    const rows = [[[-24, 19], [-8, 19.5], [8, 19.5], [24, 19]], [[-16, 13], [0, 13.5], [16, 13]], [[-7, 8], [8, 8]], [[0, 3.2]]];
    for (const row of rows) for (const [px, py] of row) coinDraw(g, PILE.w / 2 + px, py, 8, 3);
    g.restore();
  });
}
