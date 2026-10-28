// Procedural, soft & cute art. Everything is drawn with canvas paths - no external assets.
import * as C from './config.js';

export const CRUMB_OUTLINE = '#2e1a12'; // v0.7.4 P: the carried crumb's outline (INK is #523c4b)
export const INK = '#523c4b';           // warm dark outline (v0.3: a touch softer)
export const FONT = "'Trebuchet MS','Nunito','Arial Rounded MT Bold','Segoe UI',Roboto,sans-serif";

export function rr(ctx, x, y, w, h, r) {
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
export function shade(hex, amt) {
  let c = hex.replace('#', ''); if (c.length === 3) c = c.split('').map((x) => x + x).join('');
  const n = parseInt(c, 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  const f = (v) => Math.max(0, Math.min(255, Math.round(amt > 0 ? v + (255 - v) * amt : v * (1 + amt))));
  return `rgb(${f(r)},${f(g)},${f(b)})`;
}
// soft shaded blob with outline
export function blob(ctx, x, y, rx, ry, color, lw = 2, rot = 0) {
  const g = ctx.createRadialGradient(x - rx * 0.35, y - ry * 0.45, Math.max(1, Math.min(rx, ry) * 0.12), x, y, Math.max(rx, ry) * 1.15);
  g.addColorStop(0, shade(color, 0.28)); g.addColorStop(0.6, color); g.addColorStop(1, shade(color, -0.2)); // v0.7.5 C18: 3 stops
  ctx.beginPath(); ctx.ellipse(x, y, rx, ry, rot, 0, Math.PI * 2);
  ctx.fillStyle = g; ctx.fill();
  if (lw) { ctx.lineWidth = lw; ctx.strokeStyle = INK; ctx.stroke(); }
}
// soft radial contact shadow (v0.3: feathered edge instead of a hard ellipse)
export function shadow(ctx, x, y, rx, ry = rx * 0.35, a = 0.2) {
  ctx.save(); ctx.translate(x, y); ctx.scale(1, ry / Math.max(rx, 0.01));
  const g = ctx.createRadialGradient(0, 0, 0, 0, 0, rx * 1.15);
  g.addColorStop(0, `rgba(74,40,60,${a * 1.25})`); g.addColorStop(0.55, `rgba(74,40,60,${a * 0.85})`); g.addColorStop(1, 'rgba(74,40,60,0)');
  ctx.beginPath(); ctx.arc(0, 0, rx * 1.15, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill(); ctx.restore();
}
// thin light rim on the upper-left of a shape just drawn as an ellipse
export function rim(ctx, x, y, rx, ry, a = 0.7, from = Math.PI * 1.05, to = Math.PI * 1.55) {
  ctx.beginPath(); ctx.ellipse(x, y, rx * 0.86, ry * 0.86, 0, from, to); ctx.lineWidth = Math.max(1, Math.min(rx, ry) * 0.16); ctx.strokeStyle = `rgba(255,255,255,${a})`; ctx.lineCap = 'round'; ctx.stroke();
}
export function text(ctx, s, x, y, size = 16, fill = '#fff', align = 'center', stroke = INK, weight = 'bold') {
  ctx.font = `${weight} ${size}px ${FONT}`; ctx.textAlign = align; ctx.textBaseline = 'middle';
  if (stroke) { ctx.lineJoin = 'round'; ctx.lineWidth = Math.max(2, size / 4.5); ctx.strokeStyle = stroke; ctx.strokeText(s, x, y); }
  ctx.fillStyle = fill; ctx.fillText(s, x, y);
}
function eye(ctx, x, y, r, look = 0.5, blink = false) {
  if (blink) { ctx.beginPath(); ctx.moveTo(x - r, y); ctx.quadraticCurveTo(x, y + r * 0.7, x + r, y); ctx.lineWidth = 1.6; ctx.strokeStyle = INK; ctx.stroke(); return; }
  ctx.beginPath(); ctx.ellipse(x, y, r, r * 1.12, 0, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill();
  ctx.lineWidth = 1.5; ctx.strokeStyle = INK; ctx.stroke();
  ctx.beginPath(); ctx.arc(x + r * 0.35 * look, y + r * 0.1, r * 0.6, 0, Math.PI * 2); ctx.fillStyle = '#2b1d28'; ctx.fill();
  ctx.beginPath(); ctx.arc(x + r * 0.35 * look - r * 0.22, y - r * 0.2, r * 0.22, 0, Math.PI * 2); ctx.fillStyle = '#fff'; ctx.fill();
}

// ---------------- crumb icon ----------------
export function crumbIcon(ctx, x, y, s = 1, dark = false) { // dark: the crumb an ant carries (v0.7.4 P: a darker, heavier outline so it reads against the ant and the trail)
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(-7, 3); ctx.quadraticCurveTo(-8, -5, -1, -7); ctx.quadraticCurveTo(7, -7, 7, 0); ctx.quadraticCurveTo(7, 6, 0, 6); ctx.quadraticCurveTo(-6, 7, -7, 3); ctx.closePath();
  const g = ctx.createLinearGradient(0, -7, 0, 7); g.addColorStop(0, '#f6c77d'); g.addColorStop(1, '#d48f45');
  ctx.fillStyle = g; ctx.fill(); ctx.lineWidth = dark ? 2.3 : 1.8; ctx.strokeStyle = dark ? CRUMB_OUTLINE : INK; ctx.stroke();
  ctx.fillStyle = '#7a4a2a'; for (const [a, b] of [[-3, -2], [2, 1], [-1, 3]]) { ctx.beginPath(); ctx.arc(a, b, 1.1, 0, 7); ctx.fill(); }
  ctx.restore();
}
export function coinIcon(ctx, x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  blob(ctx, 0, 0, 8, 8, '#ffd45e', 1.8);
  ctx.beginPath(); ctx.arc(0, 0, 5, 0, 7); ctx.strokeStyle = '#d99a1e'; ctx.lineWidth = 1.4; ctx.stroke();
  ctx.fillStyle = '#d99a1e'; ctx.font = `bold 8px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText('C', 0, 0.5);
  ctx.restore();
}
// diamond (premium currency, earned from Daily Rewards only - no real money)
export function diamondIcon(ctx, x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineJoin = 'round';
  const top = -6, mid = -1.5, bot = 8;
  ctx.beginPath(); ctx.moveTo(-8, mid); ctx.lineTo(-4.5, top); ctx.lineTo(4.5, top); ctx.lineTo(8, mid); ctx.lineTo(0, bot); ctx.closePath();
  const g = ctx.createLinearGradient(-8, top, 8, bot); g.addColorStop(0, '#d9f6ff'); g.addColorStop(0.45, '#7fd3ff'); g.addColorStop(1, '#4a9de8');
  ctx.fillStyle = g; ctx.fill(); ctx.lineWidth = 1.7; ctx.strokeStyle = INK; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-8, mid); ctx.lineTo(8, mid); ctx.moveTo(-2, top); ctx.lineTo(-3.4, mid); ctx.lineTo(0, bot); ctx.lineTo(3.4, mid); ctx.lineTo(2, top);
  ctx.lineWidth = 0.9; ctx.strokeStyle = 'rgba(40,90,150,0.55)'; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-5.6, mid - 0.6); ctx.lineTo(-3.6, top + 1); ctx.lineTo(-1.6, top + 1); ctx.lineTo(-3.2, mid - 0.6); ctx.closePath(); ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.fill();
  ctx.restore();
}
// little wrapped present (Daily Rewards)
export function giftIcon(ctx, x, y, s = 1) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.lineJoin = 'round';
  rr(ctx, -11, -3, 22, 15, 3); let g = ctx.createLinearGradient(0, -3, 0, 12); g.addColorStop(0, '#ffb3cb'); g.addColorStop(1, '#f17ea6'); ctx.fillStyle = g; ctx.fill(); ctx.lineWidth = 1.8; ctx.strokeStyle = INK; ctx.stroke();
  rr(ctx, -13, -8, 26, 7, 2.5); g = ctx.createLinearGradient(0, -8, 0, -1); g.addColorStop(0, '#ffd0e0'); g.addColorStop(1, '#ff9ab9'); ctx.fillStyle = g; ctx.fill(); ctx.stroke();
  ctx.fillStyle = '#ffe36e'; ctx.fillRect(-2.2, -8, 4.4, 20); ctx.strokeRect(-2.2, -8, 4.4, 20);
  for (const sx of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sx * 5, -11, 5, 3, sx * 0.5, 0, 7); ctx.fillStyle = '#ffe36e'; ctx.fill(); ctx.stroke(); }
  ctx.restore();
}
// v0.4 item 1: monthly streak boxes (days 10 / 20 / 30) - bigger, more colourful; tier 3 (day 30) is clearly the biggest and
// most attractive (gold, rainbow ribbon, rotating glow + sparkles). Contents stay a surprise (visual only).
const BOX_STYLES = [
  null,
  { body: ['#9ff0e0', '#3fc0b0'], lid: ['#c8fff4', '#69d8c8'], ribbon: '#ff7fa8', knot: '#ffb3cb' },        // day 10: mint + pink
  { body: ['#d7c2ff', '#9a72e8'], lid: ['#ece2ff', '#b896f5'], ribbon: '#ffd45e', knot: '#fff0a0' },        // day 20: violet + gold
  { body: ['#fff0a0', '#f2b632'], lid: ['#fff8cf', '#ffd45e'], ribbon: 'rainbow', knot: '#ff7fa8' },       // day 30: gold + rainbow
];
export function monthBox(ctx, x, y, s, tier, t = 0, reached = false) {
  const st = BOX_STYLES[tier] || BOX_STYLES[1];
  ctx.save(); ctx.translate(x, y); ctx.lineJoin = 'round';
  if (tier === 3) { // glow + rays behind the big box
    ctx.save(); ctx.rotate(t * 0.5); for (let k = 0; k < 10; k++) { ctx.rotate(Math.PI / 5); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(-4 * s, -30 * s); ctx.lineTo(4 * s, -30 * s); ctx.closePath(); ctx.fillStyle = 'rgba(255,226,120,0.35)'; ctx.fill(); } ctx.restore();
    const g = ctx.createRadialGradient(0, 0, 2, 0, 0, 28 * s); g.addColorStop(0, 'rgba(255,240,170,0.9)'); g.addColorStop(1, 'rgba(255,240,170,0)'); ctx.beginPath(); ctx.arc(0, 0, 28 * s, 0, 7); ctx.fillStyle = g; ctx.fill();
  }
  const bob = Math.sin(t * 3 + tier) * (tier === 3 ? 1.6 : 0.8);
  ctx.translate(0, bob); ctx.scale(s, s);
  shadow(ctx, 0, 13, 13, 3, 0.18);
  // body
  rr(ctx, -12, -3, 24, 16, 3.5); let g = ctx.createLinearGradient(0, -3, 0, 13); g.addColorStop(0, st.body[0]); g.addColorStop(1, st.body[1]); ctx.fillStyle = g; ctx.fill(); ctx.lineWidth = 1.8; ctx.strokeStyle = INK; ctx.stroke();
  // polka dots on the body
  ctx.fillStyle = 'rgba(255,255,255,0.55)'; for (const [dx, dy] of [[-7, 3], [7, 8], [-6, 10], [8, 1]]) { ctx.beginPath(); ctx.arc(dx, dy, 1.3, 0, 7); ctx.fill(); }
  // lid (pops a little on tier 3)
  const lift = tier === 3 ? Math.max(0, Math.sin(t * 2.4)) * 1.6 : 0;
  rr(ctx, -14, -9 - lift, 28, 7.5, 2.5); g = ctx.createLinearGradient(0, -9, 0, -1); g.addColorStop(0, st.lid[0]); g.addColorStop(1, st.lid[1]); ctx.fillStyle = g; ctx.fill(); ctx.stroke();
  // ribbon
  const rib = st.ribbon === 'rainbow' ? (() => { const r = ctx.createLinearGradient(0, -9, 0, 13); for (const [o, c] of [[0, '#ff7fa8'], [0.25, '#ffb347'], [0.5, '#ffe36e'], [0.75, '#7fe0a0'], [1, '#7fc4ff']]) r.addColorStop(o, c); return r; })() : st.ribbon;
  ctx.fillStyle = rib; ctx.fillRect(-2.6, -9 - lift, 5.2, 22 + lift); ctx.strokeRect(-2.6, -9 - lift, 5.2, 22 + lift);
  ctx.fillRect(-12, 3, 24, 3.6); ctx.strokeRect(-12, 3, 24, 3.6);
  for (const sx of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sx * 5.5, -12.5 - lift, 5.6, 3.4, sx * 0.5, 0, 7); ctx.fillStyle = st.knot; ctx.fill(); ctx.stroke(); }
  ctx.beginPath(); ctx.arc(0, -11.5 - lift, 2.2, 0, 7); ctx.fillStyle = st.knot; ctx.fill(); ctx.stroke();
  // shine + question mark (contents are a surprise)
  ctx.beginPath(); ctx.ellipse(-7, -0.5, 2.6, 1, -0.3, 0, 7); ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.fill();
  if (!reached) { ctx.font = `bold 9px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.lineWidth = 2.4; ctx.strokeStyle = INK; ctx.strokeText('?', 7.5, 9.5); ctx.fillStyle = '#ffffff'; ctx.fillText('?', 7.5, 9.5); }
  ctx.restore();
  if (tier >= 2) for (let k = 0; k < (tier === 3 ? 4 : 2); k++) { const a = t * 1.6 + k * (Math.PI * 2 / (tier === 3 ? 4 : 2)); starShape(ctx, x + Math.cos(a) * 20 * s, y + bob + Math.sin(a) * 13 * s, (tier === 3 ? 3.4 : 2.4) * (0.75 + 0.25 * Math.sin(t * 5 + k)), '#fff7a8', 1); }
}
// v0.4 item 16 (visuals only): stage markers on the level map - a chunky 3D disc (side + glossy top + inner ring) instead of a
// flat numbered circle. One template, small per-stage nuances: each stage has its own colour and a little ornament on top;
// cleared stages get a gold rim, a perfect (3-star) stage a little crown; the last (boss) stage is a crown-shaped badge.
const NODE_COLS = ['#ffc38a', '#ffb3c1', '#b9e89a', '#9fd6ff', '#c9b6f2', '#ffd27a', '#ff9e9e', '#a8e6e0', '#f7b6e8', '#d7b8ff'];
const NODE_ORN = ['leaf', 'crumb', 'bubble', 'wing', 'shield', 'cloud', 'cone', 'mask', 'dots', 'crown'];
function miniCrown(ctx, x, y, s, fill = '#ffe36e') {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.moveTo(-7, 3); ctx.lineTo(-8, -5); ctx.lineTo(-3.5, -1); ctx.lineTo(0, -7); ctx.lineTo(3.5, -1); ctx.lineTo(8, -5); ctx.lineTo(7, 3); ctx.closePath();
  ctx.fillStyle = fill; ctx.fill(); ctx.lineWidth = 1.8; ctx.strokeStyle = INK; ctx.lineJoin = 'round'; ctx.stroke();
  ctx.beginPath(); ctx.arc(0, -0.5, 1.4, 0, 7); ctx.fillStyle = '#ff6f91'; ctx.fill();
  ctx.restore();
}
function nodeOrnament(ctx, kind, x, y, t) {
  ctx.save(); ctx.translate(x, y); ctx.lineWidth = 1.6; ctx.strokeStyle = INK; ctx.lineJoin = 'round';
  switch (kind) {
    case 'leaf': ctx.rotate(-0.5); ctx.beginPath(); ctx.ellipse(0, 0, 6, 3.2, 0, 0, 7); ctx.fillStyle = '#8fdc7a'; ctx.fill(); ctx.stroke(); ctx.beginPath(); ctx.moveTo(-5, 0); ctx.lineTo(5, 0); ctx.stroke(); break;
    case 'crumb': blob(ctx, 0, 0, 5, 4, '#e8b878', 1.6); ctx.fillStyle = '#8a5a3a'; ctx.beginPath(); ctx.arc(-1.5, -0.5, 1, 0, 7); ctx.arc(2, 1, 0.8, 0, 7); ctx.fill(); break;
    case 'bubble': for (const [bx, by, r] of [[-3, 1, 3.4], [3, -2, 2.6], [4, 3, 1.6]]) { ctx.beginPath(); ctx.arc(bx, by + Math.sin(t * 2 + bx) * 0.8, r, 0, 7); ctx.fillStyle = '#c9f5b8'; ctx.fill(); ctx.stroke(); } break;
    case 'wing': for (const sx of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sx * 4, 0, 5, 2.8, sx * -0.5 + Math.sin(t * 8) * 0.15 * sx, 0, 7); ctx.fillStyle = 'rgba(225,245,255,0.95)'; ctx.fill(); ctx.strokeStyle = '#6f9cc2'; ctx.stroke(); } break;
    case 'shield': ctx.beginPath(); ctx.moveTo(0, -5); ctx.lineTo(5, -3); ctx.quadraticCurveTo(5, 3, 0, 6); ctx.quadraticCurveTo(-5, 3, -5, -3); ctx.closePath(); ctx.fillStyle = '#dfe4ef'; ctx.fill(); ctx.stroke(); break;
    case 'cloud': for (const [bx, by, r] of [[-4, 1, 3.2], [0, -1.5, 4], [4, 1, 3.2]]) { ctx.beginPath(); ctx.arc(bx, by, r, 0, 7); ctx.fillStyle = '#ffffff'; ctx.fill(); } ctx.beginPath(); ctx.ellipse(0, 0.5, 8, 4.5, 0, 0, 7); ctx.strokeStyle = 'rgba(82,60,75,0.5)'; ctx.stroke(); break;
    case 'cone': ctx.beginPath(); ctx.moveTo(-4.5, 4); ctx.lineTo(0, -6); ctx.lineTo(4.5, 4); ctx.closePath(); ctx.fillStyle = '#ffa25e'; ctx.fill(); ctx.stroke(); ctx.fillStyle = '#fff'; ctx.fillRect(-2.4, -1, 4.8, 1.8); break;
    case 'mask': blob(ctx, 0, 0, 6, 4, '#a7afbb', 1.6); for (const sx of [-2.5, 2.5]) { ctx.beginPath(); ctx.arc(sx, -0.5, 1.6, 0, 7); ctx.fillStyle = '#d9f3ff'; ctx.fill(); ctx.stroke(); } break;
    case 'dots': for (let k = 0; k < 5; k++) { const a = k * 1.256 + t; blob(ctx, Math.cos(a) * 4.5, Math.sin(a) * 2.6, 1.6, 1.6, '#f2a65f', 1.1); } break;
    case 'crown': miniCrown(ctx, 0, 0, 1.05); break;
  }
  ctx.restore();
}
export function mapNode(ctx, x, y, i, st, t = 0) {
  const base = !st.open ? '#cfc6cf' : NODE_COLS[i % NODE_COLS.length];
  const R = st.boss ? 29 : 27, depth = 7;
  ctx.save();
  shadow(ctx, x, y + 26, 30, 7, 0.28);
  if (st.next) { ctx.beginPath(); ctx.ellipse(x, y + 3, R + 7 + Math.sin(t * 4) * 2, R * 0.92 + 6, 0, 0, 7); ctx.fillStyle = 'rgba(255,212,94,0.35)'; ctx.fill(); }
  // side (depth)
  ctx.beginPath(); ctx.ellipse(x, y + depth, R, R * 0.9, 0, 0, Math.PI); ctx.lineTo(x - R, y); ctx.ellipse(x, y, R, R * 0.9, 0, Math.PI, 0, true); ctx.closePath();
  ctx.fillStyle = shade(base, -0.3); ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke();
  // top face: a crown-shaped badge for the boss stage, a round disc otherwise
  ctx.beginPath();
  if (st.boss) { const pts = 5; for (let k = 0; k <= pts * 2; k++) { const a = Math.PI + k / (pts * 2) * Math.PI; const rr2 = k % 2 ? R * 0.82 : R; if (k === 0) ctx.moveTo(x + Math.cos(a) * R, y + Math.sin(a) * R * 0.9); else ctx.lineTo(x + Math.cos(a) * rr2, y + Math.sin(a) * rr2 * 0.9 - (k % 2 ? 0 : 3)); } ctx.ellipse(x, y, R, R * 0.9, 0, 0, Math.PI); }
  else ctx.ellipse(x, y, R, R * 0.9, 0, 0, 7);
  const g = ctx.createRadialGradient(x - R * 0.35, y - R * 0.4, 2, x, y, R * 1.1); g.addColorStop(0, shade(base, 0.55)); g.addColorStop(0.6, base); g.addColorStop(1, shade(base, -0.12));
  ctx.fillStyle = g; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = st.cleared ? '#e0a830' : INK; ctx.stroke();
  if (st.cleared) { ctx.beginPath(); ctx.ellipse(x, y, R - 2.5, R * 0.9 - 2.5, 0, 0, 7); ctx.lineWidth = 2; ctx.strokeStyle = '#ffe9a0'; ctx.stroke(); }
  // inner ring + gloss
  ctx.beginPath(); ctx.ellipse(x, y + 1, R * 0.66, R * 0.6, 0, 0, 7); ctx.lineWidth = 2; ctx.strokeStyle = `rgba(255,255,255,${st.open ? 0.55 : 0.3})`; ctx.stroke();
  ctx.beginPath(); ctx.ellipse(x - R * 0.38, y - R * 0.5, R * 0.36, R * 0.16, -0.4, 0, 7); ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.fill();
  if (st.open) {
    text(ctx, String(i + 1), x, y + 1, 23, '#fff');
    nodeOrnament(ctx, NODE_ORN[i % NODE_ORN.length], x + R * 0.72, y - R * 0.72, t);
    if (st.stars >= 3 && !st.boss) miniCrown(ctx, x, y - R - 3, 1.1);
  } else {
    rr(ctx, x - 8, y - 3, 16, 13, 3); ctx.fillStyle = '#8c8090'; ctx.fill(); ctx.beginPath(); ctx.arc(x, y - 4, 5.5, Math.PI, 0); ctx.lineWidth = 3; ctx.strokeStyle = '#8c8090'; ctx.stroke();
  }
  ctx.restore();
}
export function starShape(ctx, x, y, r, fill, lw = 2) {
  ctx.beginPath();
  for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5; const rr2 = i % 2 ? r * 0.48 : r; ctx.lineTo(x + Math.cos(a) * rr2, y + Math.sin(a) * rr2); }
  ctx.closePath(); ctx.fillStyle = fill; ctx.fill(); ctx.lineJoin = 'round'; ctx.lineWidth = lw; ctx.strokeStyle = INK; ctx.stroke();
}

// ---------------- ANTS (chibi, side/3-4 view, facing right) ----------------
// Warm caramel palette, big heads, glossy eyes, thick clean outlines.
export const ANT_COL = { small: '#f8c07e', worker: '#f0994d', big: '#d97a3f', gasmask: '#f0994d', armored: '#e48a47', flyer: '#f9b878', queen: '#f59b9b', queen2: '#c7a6f5', sprinter: '#f0994d', heavy: '#b95b34', greasy: '#ee9f45', mama: '#d9774a', queen3: '#e9b05c', nurse: '#f2b49b', queen4: '#f4b9c8' }; // v0.7.5 C18: value ladder small > worker > big > heavy; v0.7.6 V1 (A5): small #fbc98a -> #f8c07e (>= 1.447 vs the trail on all 20 maps; ladder 1.37 / 1.38 / 1.48)
const ALW = 2.4; // ant outline width (v0.3: thinner = softer)

function softBlob(ctx, x, y, rx, ry, col, lw = ALW) {
  blob(ctx, x, y, rx, ry, col, lw);
  ctx.beginPath(); ctx.ellipse(x - rx * 0.28, y - ry * 0.46, rx * 0.4, ry * 0.22, -0.35, 0, 7);
  ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fill();
}
function glossyEye(ctx, x, y, rx, ry, blink) {
  if (blink) {
    ctx.beginPath(); ctx.moveTo(x - rx, y + 0.5); ctx.quadraticCurveTo(x, y + ry * 0.9, x + rx, y + 0.5);
    ctx.lineWidth = 1.9; ctx.strokeStyle = INK; ctx.stroke(); return;
  }
  ctx.beginPath(); ctx.ellipse(x, y, rx, ry, 0, 0, 7);
  const g = ctx.createLinearGradient(0, y - ry, 0, y + ry); g.addColorStop(0, '#24151f'); g.addColorStop(0.65, '#3b2533'); g.addColorStop(1, '#7a4f62');
  ctx.fillStyle = g; ctx.fill();
  ctx.beginPath(); ctx.ellipse(x - rx * 0.22, y - ry * 0.32, rx * 0.46, ry * 0.36, -0.3, 0, 7); ctx.fillStyle = '#ffffff'; ctx.fill();
  ctx.beginPath(); ctx.arc(x + rx * 0.38, y + ry * 0.36, rx * 0.2, 0, 7); ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.fill();
}
function cheek(ctx, x, y, r = 2.4) { ctx.beginPath(); ctx.ellipse(x, y, r, r * 0.62, 0, 0, 7); ctx.fillStyle = 'rgba(255,112,140,0.55)'; ctx.fill(); }
function leg(ctx, x0, y0, x1, y1, col) {
  ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x0, y0); ctx.quadraticCurveTo((x0 + x1) / 2 + 1, (y0 + y1) / 2 + 1, x1, y1);
  ctx.lineWidth = 4.8; ctx.strokeStyle = INK; ctx.stroke();
  ctx.lineWidth = 2.6; ctx.strokeStyle = col; ctx.stroke();
}

// v0.4 item 14e: Sprint Knight sneakers (white with a red swoosh-free stripe)
function sneaker(ctx, x, y, far) {
  ctx.beginPath(); ctx.ellipse(x + 1, y + 0.6, 2.8, 1.7, 0, 0, 7); ctx.fillStyle = far ? '#e6e6ee' : '#ffffff'; ctx.fill(); ctx.lineWidth = 1.3; ctx.strokeStyle = INK; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x - 0.8, y + 0.4); ctx.lineTo(x + 2.4, y + 0.1); ctx.lineWidth = 1.1; ctx.strokeStyle = '#ff5a6e'; ctx.stroke();
}
// v0.7: the small variants wear their parent's look (gas mask / knight armour / wings) on the small body
const ANT_LOOK = { small_gasmask: 'gasmask', small_armed: 'armored', small_fly: 'flyer' };
// v0.7.9: a medical plus (a SHAPE, never a colour-only cue): 12-point cross, half-length s, arm width s*0.62
export function plusShape(ctx, x, y, s, fill, lw = 1.5) {
  const a = s * 0.31, t = s;
  ctx.beginPath(); ctx.moveTo(x - a, y - t); ctx.lineTo(x + a, y - t); ctx.lineTo(x + a, y - a); ctx.lineTo(x + t, y - a); ctx.lineTo(x + t, y + a); ctx.lineTo(x + a, y + a);
  ctx.lineTo(x + a, y + t); ctx.lineTo(x - a, y + t); ctx.lineTo(x - a, y + a); ctx.lineTo(x - t, y + a); ctx.lineTo(x - t, y - a); ctx.lineTo(x - a, y - a); ctx.closePath();
  ctx.fillStyle = fill; ctx.fill(); if (lw > 0) { ctx.lineWidth = lw; ctx.strokeStyle = INK; ctx.stroke(); }
}
export function drawAnt(ctx, type, phase = 0, opt = {}) {
  const S = C.ANTS[type].size;
  type = ANT_LOOK[type] || type;
  const col = ANT_COL[type];
  const legCol = shade(col, -0.18), farCol = shade(col, -0.32);
  const P = phase * Math.PI * 2;
  const step = Math.sin(P);
  const hop = Math.abs(Math.sin(P));
  const flying = type === 'flyer', queen = type === 'queen' || type === 'queen2' || type === 'queen3' || type === 'queen4', swiftQueen = type === 'queen2';
  const mama = type === 'mama', greasy = type === 'greasy', pieQueen = type === 'queen3'; // v0.7.7 world 3
  const nurse = type === 'nurse', sundaeQueen = type === 'queen4'; // v0.7.9 world 4
  // v0.4 item 14: 'big' and 'heavy' are the LARGE size class (2x a regular ant, was ~3x); armour = shell + helmet
  const big = type === 'big' || type === 'heavy' || mama, shell = type === 'armored' || type === 'heavy' || type === 'sprinter';
  const sprinter = type === 'sprinter', heavy = type === 'heavy';
  ctx.save();
  ctx.scale(S, S); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  if (!flying) shadow(ctx, 0, 10.5, 15 - hop * 2, 4, 0.2); else shadow(ctx, 0, 21, 10, 3, 0.13);
  // large ants: lower, heavier steps with a side-to-side waddle and a stomp puff (v0.4 item 14a: nicer large-ant animation)
  const lift = flying ? 9 + Math.sin(P * 2) * 2 : big ? hop * 1.8 : hop * 3.2;
  if (big && !flying) {
    ctx.translate(0, 10); ctx.rotate(Math.sin(P) * 0.06); ctx.translate(0, -10);
    if (hop < 0.18) { ctx.save(); ctx.globalAlpha = (0.18 - hop) * 3; for (const fx0 of [-12, 6]) { ctx.beginPath(); ctx.ellipse(fx0 + (Math.sin(P) > 0 ? 0 : 4), 11, 3.5, 1.4, 0, 0, 7); ctx.fillStyle = '#efe1c8'; ctx.fill(); } ctx.restore(); }
  }
  // Sprint Knight: speed lines behind (v0.4 item 14e: reads as FAST)
  // v0.5: world 2's Swift Queen (lavender, otherwise the queen's look) gets the same speed lines
  if (sprinter || swiftQueen) { ctx.save(); ctx.lineCap = 'round'; for (let k = 0; k < 3; k++) { const ph = (phase * 3 + k * 0.33) % 1; ctx.globalAlpha = 0.65 * (1 - ph); ctx.beginPath(); ctx.moveTo(-22 - ph * 6, -6 + k * 5); ctx.lineTo(-30 - ph * 10, -6 + k * 5); ctx.lineWidth = 2; ctx.strokeStyle = '#8fcfff'; ctx.stroke(); } ctx.restore(); }
  ctx.translate(0, -lift);
  if (!flying) { const sq = 1 + (0.5 - hop) * 0.09; ctx.translate(0, 10); ctx.scale(1 / sq, sq); ctx.translate(0, -10); }

  // ---- behind the body: wings, cape, far legs
  if (flying) {
    const flap = Math.sin(P * 8);
    for (const k of [1, 0]) {
      ctx.save(); ctx.translate(-2, -4); ctx.rotate(-2.0 - flap * 0.45 - k * 0.5);
      ctx.beginPath(); ctx.ellipse(11, 0, 12.5, 6.5, 0, 0, 7);
      ctx.fillStyle = k ? 'rgba(205,236,255,0.8)' : 'rgba(232,247,255,0.92)'; ctx.fill();
      ctx.lineWidth = 2; ctx.strokeStyle = '#6f9cc2'; ctx.stroke();
      ctx.beginPath(); ctx.ellipse(13, -1.5, 5, 1.6, 0, 0, 7); ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.fill();
      ctx.restore();
    }
  }
  if (queen) {
    const sw = Math.sin(P) * 1.5;
    ctx.beginPath(); ctx.moveTo(3, -8); ctx.quadraticCurveTo(-14, -12 + sw, -24, 7); ctx.quadraticCurveTo(-11, 11, 2, 5); ctx.closePath();
    const g = ctx.createLinearGradient(0, -10, 0, 10); g.addColorStop(0, sundaeQueen ? '#8fe0c8' : pieQueen ? '#7f9be6' : '#b597f0'); g.addColorStop(1, sundaeQueen ? '#3fa88f' : pieQueen ? '#4f69b8' : '#8a68d8'); // v0.7.9: the Sundae Queen's cape is mint // v0.7.7: the Pie Queen's cape is blueberry
    ctx.fillStyle = g; ctx.fill(); ctx.lineWidth = ALW; ctx.strokeStyle = INK; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-22, 6.5); ctx.quadraticCurveTo(-10, 10, 1.5, 4.5); ctx.lineWidth = 3.4; ctx.strokeStyle = '#ffffff'; ctx.stroke();
    ctx.fillStyle = INK; for (const [a, b] of [[-17, 6.8], [-10, 8], [-4, 6.6]]) { ctx.beginPath(); ctx.arc(a, b, 0.9, 0, 7); ctx.fill(); }
  }
  const legY = 3, footY = flying ? 7.5 : 10;
  for (let i = 0; i < 3; i++) { const sw = (i % 2 ? -1 : 1) * step * 2.4; leg(ctx, -7 + i * 4.5, legY, -6 + i * 4.5 - sw, footY - 0.5, farCol); if (sprinter) sneaker(ctx, -6 + i * 4.5 - sw, footY - 0.5, true); }

  // ---- body
  const abRx = queen ? 12 : big ? 11.5 : 9.5, abRy = queen ? 10 : big ? 9.5 : 8;
  softBlob(ctx, -10, 0.5, abRx, abRy, col);
  ctx.save(); ctx.beginPath(); ctx.ellipse(-10, 0.5, abRx - 1, abRy - 1, 0, 0, 7); ctx.clip();
  ctx.strokeStyle = shade(col, -0.14); ctx.lineWidth = 2;
  for (const sx of [-15, -10.5]) { ctx.beginPath(); ctx.ellipse(sx - (big ? 1.5 : 0), 0.5, 2, abRy + 2, 0, -1.3, 1.3); ctx.stroke(); }
  ctx.restore();
  if (mama) { // v0.7.7 Brood Ant: three little eggs on her back = the three babies she drops
    for (const [ex, ey, er] of [[-16.5, -2.2, 2.9], [-10.5, -4.6, 3.1], [-5.2, -1.4, 2.7]]) { ctx.beginPath(); ctx.ellipse(ex, ey, er, er * 1.2, 0.2, 0, 7); ctx.fillStyle = '#fffaf0'; ctx.fill(); ctx.lineWidth = 1.7; ctx.strokeStyle = INK; ctx.stroke(); ctx.beginPath(); ctx.arc(ex - 0.7, ey - 0.8, 0.8, 0, 7); ctx.fillStyle = '#f2a0b0'; ctx.fill(); }
  }
  if (shell) {
    ctx.save(); ctx.beginPath(); ctx.ellipse(-10, 0, abRx + 1.2, abRy + 0.8, 0, Math.PI * 1.02, Math.PI * 1.98); ctx.quadraticCurveTo(-10, 3, -10 - abRx - 1, 0); ctx.closePath();
    const g = ctx.createLinearGradient(0, -9, 0, 2); g.addColorStop(0, '#ffffff'); g.addColorStop(1, heavy ? '#9aa3ba' : sprinter ? '#bfe3ff' : '#b4bdd0'); ctx.fillStyle = g; ctx.fill();
    ctx.lineWidth = 2.4; ctx.strokeStyle = INK; ctx.stroke();
    ctx.fillStyle = heavy ? '#f4b632' : '#8992aa'; for (const rx of [-16, -10, -4]) { ctx.beginPath(); ctx.arc(rx, -3, 1.1, 0, 7); ctx.fill(); }
    if (heavy) { ctx.beginPath(); ctx.ellipse(-10, -2.5, abRx * 0.8, 1.4, 0, Math.PI * 1.1, Math.PI * 1.9); ctx.lineWidth = 1.6; ctx.strokeStyle = '#f4b632'; ctx.stroke(); }
    ctx.restore();
  }
  softBlob(ctx, -1, 1.5, 5.2, 4.8, col);
  if (opt.carrying) crumbIcon(ctx, -10, -11, 1.3, true);
  // near legs (in front of the body)
  for (let i = 0; i < 3; i++) { const sw = (i % 2 ? 1 : -1) * step * 2.6; leg(ctx, -5 + i * 4.5, legY + 1, -4 + i * 4.5 + sw, footY + 0.5, legCol); if (sprinter) sneaker(ctx, -4 + i * 4.5 + sw, footY + 0.5, false); if (big) blob(ctx, -4 + i * 4.5 + sw, footY + 0.8, 2.2, 1.6, shade(col, -0.3), 1.4); }
  // Sprint Knight jersey: a sporty striped vest with a number on the thorax
  if (sprinter) {
    ctx.save(); ctx.beginPath(); ctx.ellipse(-1, 1.5, 5.2, 4.8, 0, 0, 7); ctx.clip();
    ctx.fillStyle = '#4fb4ff'; ctx.fillRect(-7, -4, 12, 12); ctx.fillStyle = '#ffffff'; ctx.fillRect(-7, -0.6, 12, 1.6);
    ctx.restore(); ctx.beginPath(); ctx.ellipse(-1, 1.5, 5.2, 4.8, 0, 0, 7); ctx.lineWidth = ALW; ctx.strokeStyle = INK; ctx.stroke();
    ctx.font = `bold 5px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#ffffff'; ctx.fillText('7', -1, 4.2);
  }

  // ---- head
  const hr = type === 'small' ? 11.5 : big ? 11.5 : queen ? 11 : 10.8;
  const hx = 8, hy = -9;
  // antennae (behind the head)
  const bob = Math.sin(P * 2 + 0.6) * 1.4;
  if (type !== 'armored' && type !== 'heavy' && type !== 'small') {
    for (const k of [0, 1]) {
      const bx0 = hx - 3 + k * 6, by0 = hy - hr + 3;
      const tx = hx - 4.5 + k * 10 + bob * (k ? 1 : -0.6), ty = hy - hr - 4.5 + k * 0.5 - Math.abs(bob) * 0.5;
      ctx.beginPath(); ctx.moveTo(bx0, by0); ctx.quadraticCurveTo(bx0 + (k ? 3 : -2), ty + 3, tx, ty);
      ctx.lineWidth = 3.8; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 1.5; ctx.strokeStyle = legCol; ctx.stroke();
      blob(ctx, tx, ty, 2.5, 2.5, shade(col, 0.25), 2);
    }
  }
  softBlob(ctx, hx, hy, hr, hr * 0.94, col);

  // ---- face
  const e1x = hx + 0.5, e2x = hx + 7.3, ey = hy + 0.8;
  const blink = opt.blink;
  if (type === 'gasmask') {
    // strap
    ctx.beginPath(); ctx.moveTo(hx - hr + 1, hy - 3); ctx.quadraticCurveTo(hx - 2, hy - 6, e1x, ey - 1); ctx.lineWidth = 3; ctx.strokeStyle = '#6f6a7c'; ctx.stroke();
    for (const [ex, r] of [[e1x, 4.6], [e2x, 4.1]]) {
      ctx.beginPath(); ctx.arc(ex, ey - 0.3, r, 0, 7); ctx.fillStyle = '#d9f3ff'; ctx.fill();
      ctx.lineWidth = 2.6; ctx.strokeStyle = '#5d5a6b'; ctx.stroke();
      glossyEye(ctx, ex + 0.3, ey - 0.2, r * 0.55, r * 0.68, blink);
      ctx.beginPath(); ctx.arc(ex - r * 0.35, ey - r * 0.45, r * 0.22, 0, 7); ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.fill();
    }
    blob(ctx, hx + 5, hy + 7.4, 5.2, 3.8, '#a7afbb', 2.4);
    ctx.fillStyle = '#7d8592'; for (const dx of [-1.8, 0.4, 2.6]) { ctx.beginPath(); ctx.arc(hx + 5 + dx, hy + 7.6, 0.8, 0, 7); ctx.fill(); }
    blob(ctx, hx + 10.5, hy + 9.2, 2.8, 3.1, '#7fd3ad', 2.2);
  } else {
    glossyEye(ctx, e1x, ey, 3.1, 3.9, blink);
    glossyEye(ctx, e2x, ey - 0.3, 2.7, 3.6, blink);
    cheek(ctx, hx - 3, hy + 5.6); cheek(ctx, hx + 10, hy + 5.2, 2);
    if (big && !mama) {
      ctx.beginPath(); ctx.moveTo(hx + 1, hy + 6.2); ctx.quadraticCurveTo(hx + 4, hy + 3.6, hx + 4.2, hy + 5.4); ctx.quadraticCurveTo(hx + 4.6, hy + 3.6, hx + 8, hy + 6.2); ctx.quadraticCurveTo(hx + 4.4, hy + 8, hx + 1, hy + 6.2);
      ctx.fillStyle = '#8a4b33'; ctx.fill(); ctx.lineWidth = 1.3; ctx.strokeStyle = INK; ctx.stroke();
    } else {
      ctx.beginPath(); ctx.moveTo(hx + 2.6, hy + 5.6); ctx.quadraticCurveTo(hx + 4.3, hy + 8.4, hx + 6, hy + 5.6);
      ctx.lineWidth = 1.8; ctx.strokeStyle = INK; ctx.stroke();
      if (queen) { ctx.beginPath(); ctx.ellipse(hx + 4.3, hy + 6.6, 1.3, 0.8, 0, 0, 7); ctx.fillStyle = '#ff6f91'; ctx.fill(); }
    }
    if (queen) {
      ctx.lineWidth = 1.5; ctx.strokeStyle = INK;
      for (const [ex, k] of [[e1x - 2.4, 0], [e1x - 1, 1], [e2x + 1.8, 2]]) { ctx.beginPath(); ctx.moveTo(ex, ey - 3); ctx.lineTo(ex + (k === 2 ? 1.6 : -1.2), ey - 5.2); ctx.stroke(); }
    }
  }

  // ---- hats & gear
  const top = hy - hr;
  if (type === 'worker') {
    ctx.beginPath(); ctx.ellipse(hx, hy - 3.6, hr * 0.98, hr * 0.78, 0, Math.PI, 0); ctx.closePath();
    const g = ctx.createLinearGradient(0, top - 1, 0, hy - 3); g.addColorStop(0, '#fff3a3'); g.addColorStop(1, '#f6c33a');
    ctx.fillStyle = g; ctx.fill(); ctx.lineWidth = 2.5; ctx.strokeStyle = INK; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(hx - 1, top + 0.5); ctx.quadraticCurveTo(hx, hy - 7, hx - 0.5, hy - 3.8); ctx.lineWidth = 2.2; ctx.strokeStyle = '#e2a521'; ctx.stroke();
    rr(ctx, hx - hr - 1.5, hy - 5.2, hr * 2 + 5, 3.6, 1.8); ctx.fillStyle = '#f6c33a'; ctx.fill(); ctx.lineWidth = 2.2; ctx.strokeStyle = INK; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(hx - 4, top + 3.5, 2.5, 1.3, -0.5, 0, 7); ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.fill();
  } else if (type === 'small') { // propeller beanie
    ctx.beginPath(); ctx.ellipse(hx - 0.5, hy - 4.2, hr * 0.92, hr * 0.7, 0, Math.PI, 0); ctx.closePath();
    ctx.fillStyle = '#8fd0f7'; ctx.fill(); ctx.lineWidth = 2.4; ctx.strokeStyle = INK; ctx.stroke();
    ctx.save(); ctx.beginPath(); ctx.ellipse(hx - 0.5, hy - 4.2, hr * 0.92, hr * 0.7, 0, Math.PI, 0); ctx.clip();
    ctx.fillStyle = '#ff9fb8'; ctx.fillRect(hx - 4, top - 4, 3.2, 14); ctx.fillStyle = '#ffe27a'; ctx.fillRect(hx + 3, top - 4, 3.2, 14); ctx.restore();
    ctx.beginPath(); ctx.ellipse(hx - 0.5, hy - 4.2, hr * 0.92, hr * 0.7, 0, Math.PI, 0); ctx.lineWidth = 2.4; ctx.strokeStyle = INK; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(hx - 0.5, top + 1.5); ctx.lineTo(hx - 0.5, top - 3); ctx.lineWidth = 2; ctx.stroke();
    const sp = Math.cos(P * 3);
    ctx.beginPath(); ctx.ellipse(hx - 0.5 - 3.6 * sp, top - 3.5, 3.8 * Math.abs(sp) + 0.8, 1.5, 0, 0, 7); ctx.ellipse(hx - 0.5 + 3.6 * sp, top - 3.5, 3.8 * Math.abs(sp) + 0.8, 1.5, 0, 0, 7);
    ctx.fillStyle = '#ff7f9e'; ctx.fill(); ctx.lineWidth = 1.5; ctx.stroke();
    blob(ctx, hx - 0.5, top - 3.5, 1.4, 1.4, '#ffe27a', 1.2);
  } else if (greasy) { // v0.7.7 Buttery Ant: a pat of butter on its head, melting down one side, and an oily shine
    const ty = top + 1.5;
    ctx.beginPath(); ctx.moveTo(hx - 6.5, ty); ctx.lineTo(hx + 7.5, ty); ctx.lineTo(hx + 7.5, ty - 6.5); ctx.lineTo(hx - 6.5, ty - 6.5); ctx.closePath();
    ctx.fillStyle = '#fff3a8'; ctx.fill(); ctx.lineWidth = 2.2; ctx.strokeStyle = INK; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(hx + 7.5, ty - 1); ctx.quadraticCurveTo(hx + 11, ty + 1, hx + 9.6, ty + 5 + Math.abs(step) * 0.8); ctx.quadraticCurveTo(hx + 8, ty + 6, hx + 7.5, ty + 2.5);
    ctx.fillStyle = '#ffe36a'; ctx.fill(); ctx.lineWidth = 1.8; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(hx - 4.5, ty - 4.6); ctx.lineTo(hx + 1.5, ty - 4.6); ctx.lineWidth = 1.6; ctx.strokeStyle = '#ffffff'; ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.8)'; for (const [gx, gy, gr] of [[-8, 1, 1.5], [-3, 6, 1.1], [-12, -3, 1]]) { ctx.beginPath(); ctx.arc(hx + gx + 2, hy + gy, gr, 0, 7); ctx.fill(); }
  } else if (mama) { // v0.7.7 Brood Ant: a pink polka-dot headscarf knotted on the side
    ctx.beginPath(); ctx.ellipse(hx, hy - 3.4, hr * 1.0, hr * 0.8, 0, Math.PI, 0); ctx.closePath();
    ctx.fillStyle = '#ff8fb0'; ctx.fill(); ctx.lineWidth = 2.5; ctx.strokeStyle = INK; ctx.stroke();
    ctx.fillStyle = '#ffffff'; for (const [dx, dy] of [[-6, -9], [0, -11.5], [6, -9], [-2, -6.2], [4, -5.6]]) { ctx.beginPath(); ctx.arc(hx + dx, hy + dy + 1, 1.15, 0, 7); ctx.fill(); }
    ctx.beginPath(); ctx.moveTo(hx - hr + 1, hy - 4.5); ctx.quadraticCurveTo(hx - hr - 6, hy - 9, hx - hr - 7, hy - 3 + step); ctx.quadraticCurveTo(hx - hr - 3, hy - 4, hx - hr + 1, hy - 1.6);
    ctx.fillStyle = '#ff8fb0'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = INK; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(hx - 4, top + 3.2, 2.4, 1.2, -0.4, 0, 7); ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.fill();
  } else if (type === 'big') { // sweatband
    ctx.save(); ctx.beginPath(); ctx.ellipse(hx, hy, hr, hr * 0.94, 0, 0, 7); ctx.clip();
    ctx.fillStyle = '#ff6f91'; ctx.fillRect(hx - hr - 1, hy - 7.5, hr * 2 + 2, 4); ctx.fillStyle = '#ffffff'; ctx.fillRect(hx - hr - 1, hy - 6.2, hr * 2 + 2, 1.2);
    ctx.restore();
    ctx.beginPath(); ctx.ellipse(hx, hy, hr, hr * 0.94, 0, 0, 7); ctx.lineWidth = ALW; ctx.strokeStyle = INK; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(hx - hr + 0.5, hy - 5.5); ctx.quadraticCurveTo(hx - hr - 4, hy - 4 + step, hx - hr - 5, hy + 0.5); ctx.lineWidth = 3; ctx.strokeStyle = '#ff6f91'; ctx.stroke();
  } else if (sprinter) { // light racing helmet with a visor stripe (sporty, still a knight)
    ctx.beginPath(); ctx.ellipse(hx, hy - 3.4, hr * 1.0, hr * 0.8, 0, Math.PI, 0); ctx.closePath();
    const g = ctx.createLinearGradient(0, top - 1, 0, hy - 3); g.addColorStop(0, '#e6f4ff'); g.addColorStop(1, '#4fb4ff');
    ctx.fillStyle = g; ctx.fill(); ctx.lineWidth = 2.4; ctx.strokeStyle = INK; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(hx - hr + 1, hy - 6); ctx.quadraticCurveTo(hx, top - 0.5, hx + hr - 1, hy - 6); ctx.lineWidth = 2; ctx.strokeStyle = '#ffffff'; ctx.stroke();
    rr(ctx, hx - 2, hy - 5.8, hr + 3, 2.8, 1.4); ctx.fillStyle = '#ffe27a'; ctx.fill(); ctx.lineWidth = 1.6; ctx.strokeStyle = INK; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(hx - 4, top + 3, 2.4, 1.1, -0.4, 0, 7); ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.fill();
  } else if (type === 'armored' || heavy) { // knight helmet with plume (face stays visible); Heavy Knight: darker steel, gold trim, horns
    ctx.beginPath(); ctx.moveTo(hx - hr - 1, hy - 3.5); ctx.quadraticCurveTo(hx - hr - 1.5, top - 2.5, hx, top - 2.5); ctx.quadraticCurveTo(hx + hr + 1.5, top - 2.5, hx + hr + 1, hy - 4.5); ctx.closePath();
    const g = ctx.createLinearGradient(0, top - 2, 0, hy - 1); g.addColorStop(0, '#ffffff'); g.addColorStop(1, heavy ? '#8c96ae' : '#aeb8cc'); ctx.fillStyle = g; ctx.fill();
    ctx.lineWidth = 2.6; ctx.strokeStyle = INK; ctx.stroke();
    rr(ctx, hx - hr - 2, hy - 6.6, hr * 2 + 4, 3.6, 1.8); ctx.fillStyle = heavy ? '#f4c84a' : '#cfd6e4'; ctx.fill(); ctx.lineWidth = 2.2; ctx.stroke();
    if (heavy) for (const sx of [-1, 1]) { ctx.beginPath(); ctx.moveTo(hx + sx * (hr - 2), top + 2); ctx.quadraticCurveTo(hx + sx * (hr + 4), top - 2, hx + sx * (hr + 3), top - 7); ctx.quadraticCurveTo(hx + sx * (hr + 0.5), top - 2, hx + sx * (hr - 5), top + 1); ctx.closePath(); ctx.fillStyle = '#fff6dc'; ctx.fill(); ctx.lineWidth = 1.8; ctx.strokeStyle = INK; ctx.stroke(); }
    ctx.fillStyle = '#8992aa'; for (const dx of [-6, 0, 6]) { ctx.beginPath(); ctx.arc(hx + dx, hy - 4.8, 0.9, 0, 7); ctx.fill(); }
    ctx.beginPath(); ctx.moveTo(hx - 2, top - 1.5); ctx.quadraticCurveTo(hx - 5, top - 11, hx - 13, top - 8 + step); ctx.quadraticCurveTo(hx - 8, top - 5, hx - 6, top);
    ctx.quadraticCurveTo(hx - 3.5, top - 3, hx - 2, top - 1.5);
    ctx.fillStyle = heavy ? '#b48cf0' : '#ff7b7b'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = INK; ctx.stroke();
    ctx.beginPath(); ctx.ellipse(hx - 4, top + 2, 2.6, 1.2, -0.4, 0, 7); ctx.fillStyle = 'rgba(255,255,255,0.8)'; ctx.fill();
  } else if (flying) { // leather aviator cap + goggles on the forehead + scarf
    ctx.beginPath(); ctx.ellipse(hx, hy - 3, hr * 0.97, hr * 0.8, 0, Math.PI * 0.98, Math.PI * 2.02); ctx.closePath();
    ctx.fillStyle = '#b9805a'; ctx.fill(); ctx.lineWidth = 2.4; ctx.strokeStyle = INK; ctx.stroke();
    for (const [gx, r] of [[hx - 1, 3.3], [hx + 6, 3]]) { blob(ctx, gx, hy - 5.8, r, r, '#bfe8ff', 2.2); ctx.beginPath(); ctx.arc(gx - 1, hy - 7, 0.9, 0, 7); ctx.fillStyle = '#fff'; ctx.fill(); }
    ctx.beginPath(); ctx.moveTo(hx + 2.3, hy - 5.8); ctx.lineTo(hx + 3, hy - 5.8); ctx.lineWidth = 2; ctx.strokeStyle = INK; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(1, -2); ctx.quadraticCurveTo(-7, -4 + step * 2, -15, -8 + step * 3); ctx.lineWidth = 5.6; ctx.strokeStyle = INK; ctx.stroke();
    ctx.lineWidth = 3.2; ctx.strokeStyle = '#ff7f9e'; ctx.stroke();
  } else if (nurse) { // v0.7.9 Nurse Ant: a white nurse cap with a red-pink plus (the plus is a SHAPE cue; the grey cap = recharging / frozen)
    const grey = !!opt.grey;
    ctx.beginPath(); ctx.ellipse(hx, hy - 3.4, hr * 0.98, hr * 0.8, 0, Math.PI, 0); ctx.closePath();
    const g = ctx.createLinearGradient(0, top - 1, 0, hy - 3); g.addColorStop(0, grey ? '#e3e3ea' : '#ffffff'); g.addColorStop(1, grey ? '#b9bac6' : '#eef3f6');
    ctx.fillStyle = g; ctx.fill(); ctx.lineWidth = 2.5; ctx.strokeStyle = INK; ctx.stroke();
    rr(ctx, hx - hr - 1, hy - 5.2, hr * 2 + 2, 3.2, 1.6); ctx.fillStyle = grey ? '#b9bac6' : '#ffffff'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = INK; ctx.stroke();
    plusShape(ctx, hx, hy - 12.6, 4.6, grey ? '#9a9ba8' : '#ff5a7e', 1.5);
    ctx.beginPath(); ctx.ellipse(hx - 5.6, top + 3.6, 2, 1, -0.5, 0, 7); ctx.fillStyle = 'rgba(255,255,255,0.85)'; ctx.fill();
  } else if (queen) { // crown
    const cy = top + 3;
    if (sundaeQueen) { // v0.7.9 Sundae Queen: a waffle cone worn point-down as a crown, with a pink scoop and a cherry on top
      ctx.beginPath(); ctx.moveTo(hx - 8.5, cy - 8.5); ctx.lineTo(hx + 8.5, cy - 8.5); ctx.lineTo(hx + 1.2, cy + 1); ctx.lineTo(hx - 1.2, cy + 1); ctx.closePath();
      const gc = ctx.createLinearGradient(0, cy - 9, 0, cy + 1); gc.addColorStop(0, '#f6cf8a'); gc.addColorStop(1, '#d99a4a'); ctx.fillStyle = gc; ctx.fill(); ctx.lineWidth = 2.3; ctx.strokeStyle = INK; ctx.stroke();
      ctx.save(); ctx.beginPath(); ctx.moveTo(hx - 8.5, cy - 8.5); ctx.lineTo(hx + 8.5, cy - 8.5); ctx.lineTo(hx + 1.2, cy + 1); ctx.lineTo(hx - 1.2, cy + 1); ctx.closePath(); ctx.clip();
      ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(122,70,30,0.7)'; for (const k of [-6, -2, 2, 6]) { ctx.beginPath(); ctx.moveTo(hx + k - 4, cy - 9); ctx.lineTo(hx + k + 4, cy + 1); ctx.moveTo(hx + k + 4, cy - 9); ctx.lineTo(hx + k - 4, cy + 1); ctx.stroke(); } ctx.restore();
      blob(ctx, hx, cy - 11, 8.2, 5.6, '#ff9ec0', 2.2); blob(ctx, hx - 1.6, cy - 12.6, 2.6, 1.4, '#ffd3e2', 0.1);
      ctx.beginPath(); ctx.moveTo(hx - 6.5, cy - 8.6); for (let k = 0; k < 4; k++) ctx.quadraticCurveTo(hx - 6.5 + k * 4.4 + 1.6, cy - 5.6, hx - 6.5 + (k + 1) * 4.4, cy - 8.6); ctx.lineWidth = 1.6; ctx.strokeStyle = INK; ctx.stroke();
      blob(ctx, hx + 1, cy - 17.4, 2.6, 2.6, '#e8304e', 1.6); ctx.beginPath(); ctx.moveTo(hx + 1, cy - 19.6); ctx.quadraticCurveTo(hx + 2.5, cy - 23, hx + 5, cy - 23.4); ctx.lineWidth = 1.6; ctx.strokeStyle = INK; ctx.stroke();
      ctx.restore(); return;
    }
    ctx.beginPath(); ctx.moveTo(hx - 7, cy); ctx.lineTo(hx - 8, cy - 9); ctx.lineTo(hx - 3.5, cy - 4.5); ctx.lineTo(hx, cy - 11); ctx.lineTo(hx + 3.5, cy - 4.5); ctx.lineTo(hx + 8, cy - 9); ctx.lineTo(hx + 7, cy); ctx.closePath();
    const g = ctx.createLinearGradient(0, cy - 11, 0, cy); g.addColorStop(0, pieQueen ? '#ff8aa0' : '#fff5ad'); g.addColorStop(1, pieQueen ? '#d93a5c' : '#f4b632'); ctx.fillStyle = g; ctx.fill(); // v0.7.7: the Pie Queen wears a cherry-red crown
    ctx.lineWidth = 2.3; ctx.strokeStyle = INK; ctx.stroke();
    blob(ctx, hx, cy - 2.6, 1.8, 1.8, '#ff6f91', 1.2); blob(ctx, hx - 5, cy - 2.2, 1.2, 1.2, '#7cc6f2', 1); blob(ctx, hx + 5, cy - 2.2, 1.2, 1.2, '#7cc6f2', 1);
    for (const [x, y] of [[hx - 8, cy - 9], [hx, cy - 11], [hx + 8, cy - 9]]) blob(ctx, x, y, 1.4, 1.4, '#fff5ad', 1.2);
  }
  ctx.restore();
}

// Sprite cache: renders each ant type/frame/carrying once at device scale.
const spriteCache = new Map();
export const ANT_FRAMES = 12; // v0.3: smoother walk cycle
export function antSprite(type, frame, carrying, dpr, variant = '') {
  const key = type + frame + (carrying ? 'c' : '') + dpr + variant; // v0.7.9: variant 'g' = the Nurse's grey (recharging / frozen) cap
  let s = spriteCache.get(key);
  if (s) return s;
  const S = C.ANTS[type].size;
  const w = Math.ceil(80 * S), h = Math.ceil(84 * S);
  const cv = makeCanvas(Math.ceil(w * dpr), Math.ceil(h * dpr));
  const g = cv.getContext('2d');
  g.scale(dpr, dpr); g.translate(w / 2, h * 0.66);
  drawAnt(g, type, frame / ANT_FRAMES, { carrying, blink: frame === 7 && !C.isQueen(type), grey: variant === 'g' });
  s = { cv, w, h, ox: w / 2, oy: h * 0.66 };
  spriteCache.set(key, s);
  return s;
}
export function makeCanvas(w, h) {
  if (typeof OffscreenCanvas !== 'undefined') return new OffscreenCanvas(w, h);
  const c = document.createElement('canvas'); c.width = w; c.height = h; return c;
}

// ---------------- TOWERS ----------------
export const CARD_COLORS = Object.fromEntries(Object.entries(C.TOWERS).map(([k, v]) => [k, v.color]));

// ---------------- tower body sprite cache (v0.6.1, research item 10) ----------------
// Every static part of a tower (pad, plinth, trim ring, the body itself, the level-2/3/5 parts, crown, pennant pole, studs)
// is rendered ONCE per tower type x visual level x variant (facing / aim / gate direction) x device scale into an offscreen
// sprite, trimmed to its pixels, and blitted with drawImage. Only genuinely animated bits (slingshot band + pebble, spray wave
// + drip, speaker cones + notes, marble, fan blades + wind, hearts, glue bubbles, molten lava, gate sparks, gecko tail + eyes,
// laser beam / lens / glow / orbiting crystal, zapper glow + spark + lamps, tractor arms + bucket + smoke, pennant flag, the
// trim-ring shine) are still drawn live on top, in the original order. Device scale comes from the current transform (DPR x
// fit scale x level scale), rounded UP to 0.25 steps, so sprites are never upscaled. clearTowerCache() runs on resize / DPR.
const partCache = new Map(); let partHits = 0, partMisses = 0, partBytes = 0, partClipped = 0;
const BAKE_BOX = [-44, -60, 44, 36];
export function spriteCacheStats(withKeys = false) { const o = { parts: partCache.size, hits: partHits, misses: partMisses, bytes: partBytes, clipped: partClipped, ants: spriteCache.size }; if (withKeys) o.keys = [...partCache.keys()]; return o; }
export function clearTowerCache() { partCache.clear(); partBytes = 0; }
function devScale(ctx) {
  let sc = 1;
  if (ctx.getTransform) { const m = ctx.getTransform(); sc = Math.hypot(m.a, m.b); }
  // 0.25 steps up to 4 (phones / battle); above that (card zoom + NEW CARD reveal) 2^(1/4) steps, so a zoom animation bakes few sizes
  if (sc <= 4) return Math.max(1, Math.ceil(sc * 4 - 1e-6) / 4);
  return Math.min(8, +Math.pow(2, Math.ceil(Math.log2(sc) * 4 - 1e-6) / 4).toFixed(3));
}
// draw(g) paints in tower-local units; os > 1 oversamples (used for the parts that are drawn rotated)
function baked(ctx, key, draw, os = 1) {
  const sc = devScale(ctx) * os; const k = key + '@' + sc; let e = partCache.get(k);
  if (!e) {
    partMisses++;
    if (partBytes > 40e6) clearTowerCache();
    const [x0, y0, x1, y1] = BAKE_BOX; const W0 = Math.ceil((x1 - x0) * sc), H0 = Math.ceil((y1 - y0) * sc);
    const big = makeCanvas(W0, H0); const g = big.getContext('2d');
    g.setTransform(sc, 0, 0, sc, -x0 * sc, -y0 * sc); g.lineJoin = 'round'; g.lineCap = 'round'; draw(g);
    // trim to the painted pixels (keeps memory small); a sprite that touches the bake box edge is counted as clipped
    let minX = W0, minY = H0, maxX = -1, maxY = -1;
    if (g.getImageData) {
      const d = g.getImageData(0, 0, W0, H0).data;
      for (let y = 0; y < H0; y++) { const row = y * W0 * 4; for (let x = 0; x < W0; x++) if (d[row + x * 4 + 3]) { if (x < minX) minX = x; if (x > maxX) maxX = x; if (y < minY) minY = y; if (y > maxY) maxY = y; } }
    } else { minX = 0; minY = 0; maxX = W0 - 1; maxY = H0 - 1; }
    if (maxX < 0) e = { cv: null };
    else {
      if (minX === 0 || minY === 0 || maxX === W0 - 1 || maxY === H0 - 1) partClipped++;
      const w = maxX - minX + 1, h = maxY - minY + 1; const cv = makeCanvas(w, h); cv.getContext('2d').drawImage(big, minX, minY, w, h, 0, 0, w, h);
      e = { cv, x: x0 + minX / sc, y: y0 + minY / sc, w: w / sc, h: h / sc }; partBytes += w * h * 4;
    }
    partCache.set(k, e);
  } else partHits++;
  if (e.cv) ctx.drawImage(e.cv, e.x, e.y, e.w, e.h);
}
function pad(ctx, color) { baked(ctx, 'pad' + color, (g) => padPaths(g, color)); }
function padPaths(ctx, color) {
  shadow(ctx, 0, 11, 18, 6.5, 0.24);
  // two-tier base: darker skirt + glossy top
  ctx.beginPath(); ctx.ellipse(0, 8, 16, 8.5, 0, 0, 7); ctx.fillStyle = shade(color, -0.22); ctx.fill(); ctx.lineWidth = 3.0; ctx.strokeStyle = INK; ctx.stroke();
  blob(ctx, 0, 5.5, 15.5, 8, shade(color, -0.02), 3.0);
  const g = ctx.createRadialGradient(-4, 3, 1, 0, 5, 12); g.addColorStop(0, shade(color, 0.6)); g.addColorStop(1, shade(color, 0.2));
  ctx.beginPath(); ctx.ellipse(0, 4.5, 11, 5, 0, 0, 7); ctx.fillStyle = g; ctx.fill();
  rim(ctx, 0, 5.5, 15.5, 8, 0.75);
  // tiny rivets
  ctx.fillStyle = shade(color, -0.35); for (const a of [0.35, 1.2, 1.95, 2.8]) { ctx.beginPath(); ctx.arc(Math.cos(a) * 13.2, 6.5 + Math.sin(a) * 6.3, 0.9, 0, 7); ctx.fill(); }
}
const lvKey = (lvl) => (lvl >= 5 ? 5 : lvl >= 3 ? 3 : lvl >= 2 ? 2 : 1); // the visual steps of the level parts
const r2 = (v) => Math.round(v * 100) / 100;

// draw a tower centred at 0,0 (tile 40x40). t = time, tw = tower object (may be null for icons)
export function drawTower(ctx, type, t = 0, tw = null) {
  const T = C.TOWERS[type];
  const aim = tw ? tw.aim : -0.6;
  const fx = tw ? tw.fireFx : 0;
  const lvl = tw ? tw.lvl || 1 : 1;
  const lk = lvKey(lvl);
  ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  // upgraded towers look fancier: gold trim ring (L2+), a bit bigger each level, and (v0.6 research item 8) every level adds
  // visible parts that change the silhouette: L2 + L3 tower-specific parts, L4 a studded stone plinth, L5 a third part,
  // L6 (max) the crown + a pennant.
  // v0.7.6 V2 (A10): one contact ring under every side tower (fan, lizard, tractor included; path items get none), drawn first
  if (T.place === 'side') baked(ctx, 'ring76', (g) => { g.beginPath(); g.ellipse(0, 9, 19.5, 10.5, 0, 0, 7); g.fillStyle = '#a67c5c'; g.fill(); g.lineWidth = 3; g.strokeStyle = INK; g.stroke(); });
  if (lvl >= 4 && T.place === 'side') baked(ctx, 'plinth', plinthPaths);
  if (lvl >= 2 && T.place === 'side') {
    baked(ctx, 'trim', (g) => { g.beginPath(); g.ellipse(0, 7, 19, 10.5, 0, 0, 7); g.lineWidth = 3.2; g.strokeStyle = '#f4b632'; g.stroke(); });
    ctx.beginPath(); ctx.ellipse(0, 7, 19, 10.5, 0, Math.PI * 1.1 + (t % 3) * 0.6, Math.PI * 1.3 + (t % 3) * 0.6); ctx.lineWidth = 2; ctx.strokeStyle = '#fff6c0'; ctx.stroke();
  }
  if (lvl > 1) ctx.scale(1 + 0.03 * (lvl - 1), 1 + 0.03 * (lvl - 1));
  if (lvl >= 4 && T.place === 'path') pathStuds(ctx, t);
  switch (type) {
    case 'slingshot': {
      pad(ctx, '#f6c99a');
      const face = Math.cos(aim) >= 0 ? 1 : -1;
      ctx.save(); ctx.scale(face, 1); // facing = a mirrored blit of the same sprites
      baked(ctx, 'sling:frame', (g) => {
        g.lineWidth = 7; g.strokeStyle = INK;
        g.beginPath(); g.moveTo(0, 6); g.lineTo(0, -4); g.moveTo(0, -4); g.quadraticCurveTo(-8, -8, -8, -17); g.moveTo(0, -4); g.quadraticCurveTo(8, -8, 8, -17); g.stroke();
        g.lineWidth = 4.2; g.strokeStyle = '#c98a55';
        g.beginPath(); g.moveTo(0, 6); g.lineTo(0, -4); g.moveTo(0, -4); g.quadraticCurveTo(-8, -8, -8, -17); g.moveTo(0, -4); g.quadraticCurveTo(8, -8, 8, -17); g.stroke();
      });
      const pull = fx > 0 ? 0 : 4.2 + Math.sin(t * 3) * 0.8;
      ctx.lineWidth = 2; ctx.strokeStyle = '#ff7a8a';
      ctx.beginPath(); ctx.moveTo(-8, -16); ctx.lineTo(-2 - pull, -12 + pull * 0.4); ctx.lineTo(8, -16); ctx.stroke();
      baked(ctx, 'sling:caps', (g) => {
        g.lineWidth = 1; g.strokeStyle = 'rgba(255,240,220,0.6)'; g.beginPath(); g.moveTo(-1, 4); g.lineTo(-1, -3); g.moveTo(-6.5, -10); g.quadraticCurveTo(-7, -14, -7, -16); g.stroke();
        for (const sx2 of [-8, 8]) { rr(g, sx2 - 2.6, -18, 5.2, 4, 1.5); g.fillStyle = '#ff9aa6'; g.fill(); g.lineWidth = 1.2; g.strokeStyle = INK; g.stroke(); }
      });
      ctx.beginPath(); ctx.ellipse(-2 - pull, -12 + pull * 0.4, 3.6, 2.6, 0.3, 0, 7); ctx.fillStyle = '#a0623a'; ctx.fill(); ctx.lineWidth = 1.2; ctx.strokeStyle = INK; ctx.stroke();
      if (!fx) { blob(ctx, -3 - pull, -12.5 + pull * 0.4, 2.8, 2.8, '#c9c2d6', 1.3); }
      if (lk >= 2) baked(ctx, 'sling:lp' + lk, (g) => levelParts(g, type, lvl, 0, 0, 0));
      ctx.restore();
      break;
    }
    case 'spray': {
      pad(ctx, '#bfe8b2');
      const sx = fx > 0 ? 1.06 : 1; ctx.scale(1 / sx, sx);
      baked(ctx, 'spray:can', (g) => {
        rr(g, -9, -20, 18, 26, 6);
        const gr = g.createLinearGradient(-9, 0, 9, 0); gr.addColorStop(0, '#ffd0e0'); gr.addColorStop(0.4, '#ffb3cb'); gr.addColorStop(1, '#ee86a8');
        g.fillStyle = gr; g.fill(); g.lineWidth = 2.2; g.strokeStyle = INK; g.stroke();
        rr(g, -9, -9, 18, 7, 2); g.fillStyle = '#9be38a'; g.fill(); g.stroke();
      });
      ctx.save(); rr(ctx, -8, -19, 16, 9, 4); ctx.clip(); ctx.beginPath(); ctx.moveTo(-9, -13 + Math.sin(t * 3) * 1.2);
      for (let k = -8; k <= 9; k += 3) ctx.lineTo(k, -13 + Math.sin(t * 3 + k * 0.4) * 1.4); ctx.lineTo(9, -10); ctx.lineTo(-9, -10); ctx.closePath(); ctx.fillStyle = 'rgba(255,255,255,0.45)'; ctx.fill(); ctx.restore();
      baked(ctx, 'spray:top', (g) => {
        g.lineWidth = 2.2; g.strokeStyle = INK;
        g.fillStyle = INK; g.beginPath(); g.arc(-3, -6, 1.2, 0, 7); g.arc(3, -6, 1.2, 0, 7); g.fill();
        rr(g, -5, -27, 10, 7, 2); g.fillStyle = '#ffffff'; g.fill(); g.stroke();
        rr(g, 3, -26, 6, 3, 1); g.fillStyle = '#8fd17d'; g.fill(); g.stroke();
        rr(g, -7, -18, 3, 22, 1.5); g.fillStyle = 'rgba(255,255,255,0.45)'; g.fill();
      });
      { const dp = (t * 0.8) % 1; ctx.globalAlpha = 1 - dp; ctx.beginPath(); ctx.ellipse(11 + dp * 4, -24 + dp * 6, 1.6, 2.1, 0, 0, 7); ctx.fillStyle = '#b8f0a8'; ctx.fill(); ctx.lineWidth = 1; ctx.strokeStyle = INK; ctx.stroke(); ctx.globalAlpha = 1; }
      if (lk >= 2) baked(ctx, 'spray:lp' + lk, (g) => levelParts(g, type, lvl, 0, 0, 0));
      if (lk >= 5) { ctx.beginPath(); ctx.moveTo(-11, -16); ctx.lineTo(-11 + Math.cos(-2 + Math.sin(t * 2) * 0.5) * 3, -16 + Math.sin(-2 + Math.sin(t * 2) * 0.5) * 3); ctx.lineWidth = 1.3; ctx.strokeStyle = '#e0607e'; ctx.stroke(); } // gauge needle
      break;
    }
    case 'sound': {
      pad(ctx, '#d6c8f5');
      const beat = Math.max(0, Math.sin(t * 7.5));
      const pump = fx > 0 ? 1 + fx * 0.25 : 1 + beat * 0.04;
      ctx.translate(0, 6); ctx.scale(pump, 1 / pump); ctx.translate(0, -6 - beat * 1.2);
      if (fx <= 0 && beat > 0.6) { ctx.save(); ctx.globalAlpha = (beat - 0.6) * 2; const ny = -26 - (t % 1) * 5; ctx.fillStyle = '#a58be0'; ctx.beginPath(); ctx.ellipse(13, ny, 2.4, 1.8, -0.4, 0, 7); ctx.fill(); ctx.fillRect(14.6, ny - 7, 1.3, 7); ctx.restore(); }
      baked(ctx, 'sound:body' + lk, (g) => {
        rr(g, -15, -19, 30, 22, 7);
        const gr = g.createLinearGradient(0, -19, 0, 3); gr.addColorStop(0, '#c9b6f2'); gr.addColorStop(1, '#9d84d8');
        g.fillStyle = gr; g.fill(); g.lineWidth = 2.2; g.strokeStyle = INK; g.stroke();
        rr(g, -12, -17, 4, 18, 2); g.fillStyle = 'rgba(255,255,255,0.3)'; g.fill();
        for (const sx of [-7.5, 7.5]) { blob(g, sx, -8, 5.5, 5.5, '#5b4a7a', 1.8); g.beginPath(); g.arc(sx, -8, 3.6, 0, 7); g.lineWidth = 1; g.strokeStyle = 'rgba(232,221,255,0.6)'; g.stroke(); }
        g.beginPath(); g.moveTo(-8, -19); g.quadraticCurveTo(0, -27, 8, -19); g.lineWidth = 2.4; g.strokeStyle = INK; g.stroke();
        if (lk >= 2) levelParts(g, type, lvl, 0, 0, 0);
      });
      for (const sx of [-7.5, 7.5]) { ctx.beginPath(); ctx.arc(sx, -8, 2 + beat * 0.5, 0, 7); ctx.fillStyle = '#e8ddff'; ctx.fill(); } // pumping speaker cones
      break;
    }
    case 'ball': {
      pad(ctx, '#b6defa');
      // wooden chute pointing at the launch tile on the trail (sprite, rotated per tower; oversampled so it stays crisp)
      const ca = tw && tw.lx != null ? Math.atan2(tw.ly - tw.y, tw.lx - tw.x) : 0.5;
      ctx.save(); ctx.rotate(ca);
      const cl = lvl >= 2 ? 27 : 22; // v0.6 research item 8: L2+ a longer chute with side rails
      baked(ctx, 'ball:chute' + (lvl >= 2 ? 2 : 1), (g) => {
        rr(g, 0, -5, cl, 10, 4); g.fillStyle = '#e8c08a'; g.fill(); g.lineWidth = 2; g.strokeStyle = INK; g.stroke();
        g.beginPath(); g.moveTo(3, 0); g.lineTo(cl - 2, 0); g.lineWidth = 2; g.strokeStyle = '#c99a62'; g.stroke();
        if (lvl >= 2) { g.beginPath(); g.moveTo(4, -5.5); g.lineTo(cl - 3, -5.5); g.moveTo(4, 5.5); g.lineTo(cl - 3, 5.5); g.lineWidth = 1.8; g.strokeStyle = '#f4b632'; g.stroke(); }
      }, 2);
      ctx.restore();
      baked(ctx, 'ball:body', (g) => {
        rr(g, -11, -14, 22, 18, 6);
        const gr = g.createLinearGradient(-11, 0, 11, 0); gr.addColorStop(0, '#f6dcb4'); gr.addColorStop(1, '#ddb27c');
        g.fillStyle = gr; g.fill(); g.lineWidth = 2.2; g.strokeStyle = INK; g.stroke();
        g.beginPath(); g.moveTo(-9, -6); g.lineTo(9, -6); g.moveTo(-9, 0); g.lineTo(9, 0); g.lineWidth = 1.3; g.strokeStyle = '#c99a62'; g.stroke();
        g.beginPath(); g.ellipse(0, -14, 10, 4, 0, 0, 7); g.fillStyle = '#8f6a48'; g.fill(); g.lineWidth = 2; g.strokeStyle = INK; g.stroke();
      });
      if (fx <= 0) { const wob = Math.sin(t * 2.2) * 0.8; marble(ctx, wob, -20 - Math.abs(Math.sin(t * 2.2)) * 0.8, 7.5 * (tw ? towerSize(tw) : 1), t * 0.3); }
      else { ctx.save(); ctx.globalAlpha = fx / 0.3; ctx.beginPath(); ctx.arc(0, -20, 10 + (0.3 - fx) * 30, 0, 7); ctx.lineWidth = 2; ctx.strokeStyle = '#fff'; ctx.stroke(); ctx.restore(); }
      if (lk >= 3) baked(ctx, 'ball:lp' + lk, (g) => levelParts(g, type, lvl, 0, 0, 0));
      break;
    }
    case 'fan': {
      // v0.3: the head turns to the TRUE aim angle (toward the board centre); one sprite set per aim (fixed per tower)
      const ax = r2(tw && tw.ax != null ? tw.ax : 0.45), ay = r2(tw && tw.ay != null ? tw.ay : 0.9);
      const spin = t * (fx > 0 ? 30 : 5);
      const sx = ax < 0 ? -1 : 1, wf = Math.max(0.36, Math.abs(ay)), back = ay < -0.25;
      const mx = -ax * 7, my = -ay * 3, v = ax + ',' + ay;
      const cage = (g) => { g.translate(0, -16); g.translate(ax * 2, ay * 1); g.scale(wf * sx, 1); };
      baked(ctx, 'fan:below:' + v, (g) => {
        padPaths(g, '#bdeee8');
        g.lineWidth = 4; g.strokeStyle = INK; g.beginPath(); g.moveTo(0, 6); g.lineTo(0, -8); g.stroke();
        g.lineWidth = 2.2; g.strokeStyle = '#7fcfc4'; g.beginPath(); g.moveTo(0, 6); g.lineTo(0, -8); g.stroke();
        g.save(); g.translate(0, -16); if (!back) blob(g, mx, my, 6, 6, '#bfe9e2', 1.8); g.restore();
        g.save(); cage(g); blob(g, 0, 0, 14, 14, '#effcfa', 2); g.restore();
      });
      ctx.save(); ctx.translate(0, -16); ctx.save(); ctx.translate(ax * 2, ay * 1); ctx.scale(wf * sx, 1);
      ctx.globalAlpha = back ? 0.55 : 1;
      const nb = lvl >= 2 ? 4 : 3; // v0.6 research item 8: L2+ four blades
      for (let k = 0; k < nb; k++) { const a = spin + k * Math.PI * 2 / nb; ctx.beginPath(); ctx.ellipse(Math.cos(a) * 6, Math.sin(a) * 6, 6, 3.2, a, 0, 7); const g = ctx.createLinearGradient(-6, -6, 6, 6); g.addColorStop(0, '#a6ece2'); g.addColorStop(1, '#5fc4b6'); ctx.fillStyle = g; ctx.fill(); ctx.lineWidth = 1.3 / wf * 0.8; ctx.strokeStyle = INK; ctx.stroke(); }
      ctx.globalAlpha = 1; ctx.restore(); ctx.restore();
      baked(ctx, 'fan:above:' + v + ':' + (lvl >= 3 ? 3 : 1), (g) => {
        g.save(); cage(g);
        for (let k = 0; k < 6; k++) { g.beginPath(); g.moveTo(0, 0); g.lineTo(Math.cos(k * 1.047 + 0.5) * 13, Math.sin(k * 1.047 + 0.5) * 13); g.lineWidth = 0.8 / wf; g.strokeStyle = 'rgba(82,60,75,0.45)'; g.stroke(); }
        g.beginPath(); g.arc(0, 0, 14, 0, 7); g.lineWidth = 2.6 / Math.max(wf, 0.6); g.strokeStyle = INK; g.stroke();
        if (lvl >= 3) { g.beginPath(); g.arc(0, 0, 16, 0, 7); g.lineWidth = 2.4 / Math.max(wf, 0.6); g.strokeStyle = '#c4ccd8'; g.stroke(); g.lineWidth = 1; g.strokeStyle = INK; g.stroke(); } // chrome cage
        g.beginPath(); g.arc(0, 0, 11.5, Math.PI * 1.1, Math.PI * 1.5); g.lineWidth = 1.5; g.strokeStyle = 'rgba(255,255,255,0.8)'; g.stroke();
        g.restore();
        g.save(); g.translate(0, -16); if (back) blob(g, mx, my, 6, 6, '#bfe9e2', 1.8); else blob(g, ax * 3, ay * 1.5, 2.6, 2.6, '#ff9ab0', 1.3); g.restore();
      });
      // wind streaks in the aim direction
      if (tw) { ctx.save(); ctx.translate(0, -16); ctx.globalAlpha = 0.5; for (let k = 0; k < 2; k++) { const p2 = (t * 1.6 + k * 0.5) % 1; const d = 16 + p2 * 10; ctx.beginPath(); ctx.moveTo(ax * d - ay * (k ? 4 : -4), ay * d * 0.6 + ax * (k ? 4 : -4)); ctx.lineTo(ax * (d + 6) - ay * (k ? 4 : -4), ay * (d + 6) * 0.6 + ax * (k ? 4 : -4)); ctx.lineWidth = 1.6; ctx.strokeStyle = '#ffffff'; ctx.stroke(); } ctx.globalAlpha = 1; ctx.restore(); }
      if (lk >= 3) for (const s2 of [-1, 1]) { const w = Math.sin(t * 9 + s2) * 3; ctx.beginPath(); ctx.moveTo(s2 * 12, -24); ctx.quadraticCurveTo(s2 * 18, -30 + w, s2 * 22, -26 - w); ctx.lineWidth = 2.2; ctx.strokeStyle = s2 < 0 ? '#ff9ab0' : '#ffd45e'; ctx.stroke(); } // streamers
      if (lk >= 5) baked(ctx, 'fan:lp5', (g) => { rr(g, -9, 1, 18, 5, 2); g.fillStyle = '#9fe0d6'; g.fill(); g.lineWidth = 1.4; g.strokeStyle = INK; g.stroke(); }); // motor base
      break;
    }
    case 'pheromone': {
      baked(ctx, 'pher:body', (g) => {
        shadow(g, 0, 9, 13, 4.5, 0.18);
        g.beginPath(); g.ellipse(0, 6, 15, 6, 0, 0, 7); g.fillStyle = 'rgba(255,170,210,0.45)'; g.fill();
        rr(g, -8, -12, 16, 18, 7);
        const gr = g.createLinearGradient(-8, 0, 8, 0); gr.addColorStop(0, '#ffd9ec'); gr.addColorStop(1, '#f59cc6');
        g.fillStyle = gr; g.fill(); g.lineWidth = 2.2; g.strokeStyle = INK; g.stroke();
        rr(g, -3.5, -18, 7, 6, 2); g.fillStyle = '#e7c4ff'; g.fill(); g.stroke();
        heart(g, 0, -3, 4, '#ff6fa5');
      });
      for (let k = 0; k < 2; k++) { const p = ((t * 0.6 + k * 0.5) % 1); ctx.globalAlpha = 1 - p; heart(ctx, -5 + k * 10 + Math.sin(p * 6) * 2, -20 - p * 16, 2.6, '#ff8fbf'); }
      ctx.globalAlpha = 1;
      if (lk >= 2) baked(ctx, 'pher:lp' + lk, (g) => levelParts(g, type, lvl, 0, 0, 0));
      break;
    }
    case 'glue': {
      baked(ctx, 'glue:body' + (lvl >= 2 ? 2 : 1), (g) => {
        shadow(g, 0, 8, 16, 4, 0.12);
        g.beginPath();
        for (let k = 0; k <= 12; k++) { const a = k / 12 * Math.PI * 2; const r = 15 + Math.sin(a * 3 + 1) * 2.5; g.lineTo(Math.cos(a) * r, 3 + Math.sin(a) * r * 0.5); }
        g.closePath(); g.fillStyle = 'rgba(255,248,205,0.92)'; g.fill(); g.lineWidth = 2; g.strokeStyle = '#d8c27a'; g.stroke();
        g.beginPath(); g.ellipse(-5, 0, 4, 1.6, -0.3, 0, 7); g.fillStyle = '#fff'; g.fill();
        // glue bottle tipped over
        g.save(); g.translate(9, -5); g.rotate(0.9);
        rr(g, -5, -9, 10, 15, 4); g.fillStyle = '#fffdf3'; g.fill(); g.lineWidth = 2; g.strokeStyle = INK; g.stroke();
        rr(g, -5, -3, 10, 5, 1); g.fillStyle = '#ffb347'; g.fill(); g.stroke();
        g.beginPath(); g.moveTo(-2, -9); g.lineTo(0, -14); g.lineTo(2, -9); g.closePath(); g.fillStyle = '#ff8c6b'; g.fill(); g.stroke();
        g.restore();
        if (lvl >= 2) { g.save(); g.translate(-10, -3); g.rotate(-0.7); rr(g, -3.5, -6, 7, 10, 3); g.fillStyle = '#fffdf3'; g.fill(); g.lineWidth = 1.5; g.strokeStyle = INK; g.stroke(); rr(g, -3.5, -2, 7, 3, 1); g.fillStyle = '#7fd3ff'; g.fill(); g.restore(); } // second bottle
      });
      if (lk >= 3) for (let k = 0; k < 2; k++) { const p = (t * 0.8 + k * 0.5) % 1; ctx.globalAlpha = 1 - p; ctx.beginPath(); ctx.arc(-4 + k * 8, 2 - p * 8, 1.5 + p, 0, 7); ctx.lineWidth = 1; ctx.strokeStyle = '#d8c27a'; ctx.stroke(); ctx.globalAlpha = 1; } // sticky bubbles
      if (lk >= 5) baked(ctx, 'glue:lp5', (g) => { for (const [x, y] of [[-14, 8], [14, 9], [0, 12]]) blob(g, x, y, 2.6, 1.5, '#fff4c0', 1); }); // splats
      break;
    }
    case 'lava': { // v0.4 item 7: Roasted Lava - a molten puddle on the trail (like Glue) with a dark crust, bubbles and heat
      baked(ctx, 'lava:crust', (g) => {
        shadow(g, 0, 8, 17, 4.5, 0.14);
        g.beginPath();
        for (let k = 0; k <= 14; k++) { const a = k / 14 * Math.PI * 2; const r = 16.5 + Math.sin(a * 4 + 0.6) * 2; g.lineTo(Math.cos(a) * r, 3 + Math.sin(a) * r * 0.55); }
        g.closePath(); g.fillStyle = '#6b3a34'; g.fill(); g.lineWidth = 2; g.strokeStyle = INK; g.stroke();
      });
      // molten centre (gently pulsing) - live
      const glow = 0.5 + Math.sin(t * 3) * 0.5;
      ctx.beginPath();
      for (let k = 0; k <= 14; k++) { const a = k / 14 * Math.PI * 2; const r = 12.5 + Math.sin(a * 3 + t * 1.5) * 1.6; ctx.lineTo(Math.cos(a) * r, 3 + Math.sin(a) * r * 0.5); }
      ctx.closePath();
      const g = ctx.createRadialGradient(-2, 2, 1, 0, 3, 14); g.addColorStop(0, '#fff3a0'); g.addColorStop(0.35, glow > 0.5 ? '#ffc04d' : '#ffb347'); g.addColorStop(1, '#ff6a3d');
      ctx.fillStyle = g; ctx.fill();
      for (const [px, py, w, h, r] of [[-7, 1, 4.5, 2.2, 0.3], [6, 5, 4, 1.8, -0.4], [3, -1, 2.6, 1.3, 0.8]]) { ctx.beginPath(); ctx.ellipse(px + Math.sin(t + px) * 0.6, py, w, h, r, 0, 7); ctx.fillStyle = '#8a4a3c'; ctx.fill(); ctx.lineWidth = 1; ctx.strokeStyle = '#ffdf80'; ctx.stroke(); }
      for (let k = 0; k < 3; k++) { const p = (t * 0.9 + k * 0.37) % 1; const bx = [-3, 8, -9][k], by = [5, 0, 6][k]; ctx.globalAlpha = 1 - p * p; ctx.beginPath(); ctx.arc(bx, by - p * 2, 1 + p * 2.4, 0, 7); ctx.lineWidth = 1.2; ctx.strokeStyle = '#fff6c0'; ctx.stroke(); }
      ctx.globalAlpha = 1;
      for (let k = 0; k < 2; k++) { const p = (t * 0.7 + k * 0.5) % 1; ctx.globalAlpha = (1 - p) * 0.7; ctx.beginPath(); const x0 = -5 + k * 10; ctx.moveTo(x0, -2 - p * 14); ctx.quadraticCurveTo(x0 + 4, -6 - p * 14, x0, -10 - p * 14); ctx.quadraticCurveTo(x0 - 4, -14 - p * 14, x0, -18 - p * 14); ctx.lineWidth = 1.8; ctx.strokeStyle = '#ffb36b'; ctx.stroke(); }
      ctx.globalAlpha = 1;
      if (fx > 0) { ctx.globalAlpha = Math.min(1, fx * 2); ctx.beginPath(); ctx.ellipse(0, 3, 18, 9, 0, 0, 7); ctx.lineWidth = 2; ctx.strokeStyle = '#ffe08a'; ctx.stroke(); ctx.globalAlpha = 1; }
      if (lk >= 2) baked(ctx, 'lava:lp' + Math.min(lk, 3), (g2) => levelParts(g2, type, Math.min(lvl, 4), 0, 0, 0));
      if (lk >= 5) for (let k = 0; k < 3; k++) { const h = 4 + Math.sin(t * 8 + k * 2) * 2; ctx.beginPath(); ctx.moveTo(-8 + k * 8 - 2, 2); ctx.quadraticCurveTo(-8 + k * 8, 2 - h * 2, -8 + k * 8 + 2, 2); ctx.fillStyle = '#ff8a3d'; ctx.fill(); } // flame tongues
      break;
    }
    case 'gate': {
      const dirx = tw ? tw.dirx : 0, diry = tw ? tw.diry : 1;
      const nx = -diry, ny = dirx; // perpendicular to path
      const d = 16;
      const ax = nx * d, ay = ny * d * 0.8, bx = -nx * d, by = -ny * d * 0.8;
      // spark arcs (live)
      const live = fx > 0;
      ctx.beginPath(); ctx.moveTo(ax, ay - 14);
      for (let k = 1; k < 8; k++) { const f = k / 8; ctx.lineTo(ax + (bx - ax) * f + Math.sin(t * 40 + k * 2) * 2.5, ay - 14 + (by - ay) * f + Math.cos(t * 33 + k) * 3); }
      ctx.lineTo(bx, by - 14);
      ctx.lineWidth = live ? 4 : 2.5; ctx.strokeStyle = live ? '#fff7a8' : 'rgba(255,240,120,0.75)'; ctx.stroke();
      ctx.lineWidth = 1.2; ctx.strokeStyle = '#ffb000'; ctx.stroke();
      if (lvl >= 5) { ctx.beginPath(); ctx.moveTo(ax, ay - 6); for (let k = 1; k < 8; k++) { const f = k / 8; ctx.lineTo(ax + (bx - ax) * f + Math.sin(t * 37 + k * 3) * 2, ay - 6 + (by - ay) * f + Math.cos(t * 29 + k) * 2.5); } ctx.lineTo(bx, by - 6); ctx.lineWidth = 1.6; ctx.strokeStyle = 'rgba(255,240,120,0.8)'; ctx.stroke(); } // L5 second arc
      // the two poles (sprite per direction x level look)
      baked(ctx, 'gate:poles:' + dirx + ',' + diry + ':' + Math.min(lk, 3), (g) => {
        for (const [px, py] of [[ax, ay], [bx, by]]) {
          shadow(g, px, py + 5, 6, 2.2, 0.22);
          rr(g, px - 3, py - 14, 6, 19, 3); g.fillStyle = '#c3c9d8'; g.fill(); g.lineWidth = 1.8; g.strokeStyle = INK; g.stroke();
          if (lvl >= 3) for (const k of [0, 1]) { g.beginPath(); g.ellipse(px, py - 3 - k * 5, 4.2, 1.6, 0, 0, 7); g.fillStyle = '#ffb3c1'; g.fill(); g.lineWidth = 1.1; g.strokeStyle = INK; g.stroke(); } // L3 insulator rings
          if (lvl >= 2) starShape(g, px, py - 16, 5.2, '#ffe066', 1.4); else blob(g, px, py - 15, 4.2, 4.2, '#ffe066', 1.8); // L2 star caps
        }
      });
      break;
    }
    case 'lizard': {
      baked(ctx, 'liz:shadow', (g) => shadow(g, 0, 11, 17, 5, 0.22));
      const chew = tw && tw.chew > 0;
      const face = Math.cos(aim) >= 0 ? 1 : -1;
      ctx.save(); ctx.scale(face, 1);
      // tail (live)
      ctx.beginPath(); ctx.moveTo(-8, 4); ctx.quadraticCurveTo(-20, 8 + Math.sin(t * 3) * 3, -18, -4); ctx.lineWidth = 6; ctx.strokeStyle = INK; ctx.stroke();
      ctx.lineWidth = 3.6; ctx.strokeStyle = '#a7d96a'; ctx.stroke();
      baked(ctx, 'liz:body', (g) => {
        blob(g, -2, 2, 12, 8, '#b8e07a');
        g.fillStyle = '#8cc456'; for (const [a, b] of [[-6, 0], [-1, -2], [3, 1]]) { g.beginPath(); g.arc(a, b, 1.6, 0, 7); g.fill(); }
        for (const fx2 of [-9, 6]) blob(g, fx2, 9, 3.5, 2.2, '#a7d96a', 1.5);
      });
      const hb = chew ? Math.sin(t * 25) * 1.5 : 0;
      ctx.save(); ctx.translate(0, hb); baked(ctx, 'liz:head', (g) => blob(g, 9, -6, 9, 7.5, '#c4ea86')); ctx.restore();
      // big eyes on top (live: blink + bob)
      const blink = (t % 3.7) < 0.12, br = Math.sin(t * 2.4) * 0.6;
      eye(ctx, 6, -13 + hb + br, 3.6, 0.6, blink); eye(ctx, 12.5, -12.5 + hb + br, 3.4, 0.6, blink);
      ctx.save(); ctx.translate(0, hb); baked(ctx, 'liz:mouth', (g) => {
        g.beginPath(); g.arc(13, -3, 3, 0.1, Math.PI - 0.3); g.lineWidth = 1.5; g.strokeStyle = INK; g.stroke();
        g.beginPath(); g.ellipse(8, -2, 2, 1.2, 0, 0, 7); g.fillStyle = 'rgba(255,120,140,0.6)'; g.fill();
      }); ctx.restore();
      if (lk >= 2) baked(ctx, 'liz:lp' + Math.min(lk, 3), (g) => levelParts(g, type, Math.min(lvl, 4), 0, 0, 0)); // spikes, headband
      if (lk >= 5) { ctx.beginPath(); ctx.moveTo(-4, -2); ctx.quadraticCurveTo(-16, 2 + Math.sin(t * 4) * 2, -18, 9); ctx.lineTo(-6, 6); ctx.closePath(); ctx.fillStyle = '#8fb6ff'; ctx.fill(); ctx.lineWidth = 1.3; ctx.strokeStyle = INK; ctx.stroke(); } // little cape (flutters)
      ctx.restore();
      break;
    }
    case 'laser': {
      // v0.3 redesign: rounded turret on a ring, crystal core, twin-rail emitter barrel with lens + cooling fins
      pad(ctx, '#ffc2c7');
      const charge = fx > 0 ? 1 : 0.5 + 0.5 * Math.sin(t * 4);
      baked(ctx, 'laser:ped', (g) => {
        rr(g, -7.5, -8, 15, 13, 4); const gr = g.createLinearGradient(-7, 0, 7, 0); gr.addColorStop(0, '#f3eff9'); gr.addColorStop(1, '#bdb5d1'); g.fillStyle = gr; g.fill(); g.lineWidth = 1.8; g.strokeStyle = INK; g.stroke();
        g.beginPath(); g.ellipse(0, -8, 10.5, 4.2, 0, 0, 7); g.fillStyle = '#e4dff0'; g.fill(); g.stroke();
        g.beginPath(); g.ellipse(0, -8, 10.5, 4.2, 0, Math.PI * 1.05, Math.PI * 1.6); g.lineWidth = 1.2; g.strokeStyle = '#fff'; g.stroke();
      });
      // rotating head: sprites (oversampled, they are drawn rotated) with the live beam / lens between them
      const ra = aim + (fx > 0 ? 0 : Math.sin(t * 1.3) * 0.12);
      ctx.save(); ctx.translate(0, -13); ctx.rotate(ra);
      baked(ctx, 'laser:rails', (g) => { for (const sy of [-3.2, 3.2]) { rr(g, 2, sy - 1.8, 18, 3.6, 1.8); g.fillStyle = '#cfc8e0'; g.fill(); g.lineWidth = 1.5; g.strokeStyle = INK; g.stroke(); } }, 2);
      ctx.save(); ctx.globalAlpha = 0.35 + 0.5 * charge; ctx.beginPath(); ctx.moveTo(4, 0); ctx.lineTo(19, 0); ctx.lineWidth = 2.4; ctx.strokeStyle = '#ff4f6d'; ctx.stroke(); ctx.restore();
      baked(ctx, 'laser:lensbox', (g) => { rr(g, 17, -5.5, 5, 11, 2.2); g.fillStyle = '#ffd1d8'; g.fill(); g.lineWidth = 1.6; g.strokeStyle = INK; g.stroke(); }, 2);
      ctx.beginPath(); ctx.arc(22.5, 0, 2.6 + charge * 0.6, 0, 7); ctx.fillStyle = fx > 0 ? '#ffffff' : '#ff3d63'; ctx.fill(); ctx.lineWidth = 1.2; ctx.strokeStyle = INK; ctx.stroke();
      if (fx > 0) { ctx.beginPath(); ctx.arc(22.5, 0, 6, 0, 7); ctx.fillStyle = 'rgba(255,90,120,0.4)'; ctx.fill(); }
      baked(ctx, 'laser:shell', (g) => {
        g.beginPath(); g.ellipse(-1, 0, 10, 8.5, 0, 0, 7);
        const gr = g.createRadialGradient(-4, -4, 1, 0, 0, 11); gr.addColorStop(0, '#ffe7ea'); gr.addColorStop(0.55, '#ff9aaa'); gr.addColorStop(1, '#e56a80');
        g.fillStyle = gr; g.fill(); g.lineWidth = 2; g.strokeStyle = INK; g.stroke();
        for (const k of [-1, 0, 1]) { g.beginPath(); g.moveTo(-9.5, k * 3.6); g.lineTo(-13.5, k * 4.4); g.lineWidth = 2.6; g.strokeStyle = INK; g.stroke(); g.lineWidth = 1.2; g.strokeStyle = '#ffd1d8'; g.stroke(); }
      }, 2);
      ctx.restore();
      // crystal core on top (does not rotate, so it always reads as a gem); its glow is live
      ctx.save(); ctx.translate(0, -15);
      ctx.beginPath(); ctx.arc(0, 0, 7 + charge * 1.5, 0, 7); ctx.fillStyle = `rgba(255,80,120,${0.12 + 0.18 * charge})`; ctx.fill();
      baked(ctx, 'laser:gem', (g) => {
        g.beginPath(); g.moveTo(0, -6); g.lineTo(4.4, -1); g.lineTo(0, 4.5); g.lineTo(-4.4, -1); g.closePath();
        const gr = g.createLinearGradient(-4, -6, 4, 4); gr.addColorStop(0, '#fff2f5'); gr.addColorStop(0.5, '#ff6f8f'); gr.addColorStop(1, '#c8324f'); g.fillStyle = gr; g.fill(); g.lineWidth = 1.5; g.strokeStyle = INK; g.stroke();
        g.beginPath(); g.moveTo(-1.6, -3.6); g.lineTo(-3, -1.2); g.lineWidth = 1.2; g.strokeStyle = '#fff'; g.stroke();
      });
      ctx.restore();
      if (lk >= 2) { ctx.save(); ctx.translate(0, -13); ctx.rotate(aim); baked(ctx, 'laser:hood', (g) => { rr(g, 15, -7, 8, 14, 3); g.fillStyle = 'rgba(80,70,100,0.85)'; g.fill(); g.lineWidth = 1.4; g.strokeStyle = INK; g.stroke(); }, 2); ctx.restore(); } // lens hood
      if (lk >= 3) { const a = t * 2.2; const ox = Math.cos(a) * 11, oy = -18 + Math.sin(a) * 4; ctx.beginPath(); ctx.moveTo(ox, oy - 3.5); ctx.lineTo(ox + 2.6, oy); ctx.lineTo(ox, oy + 3); ctx.lineTo(ox - 2.6, oy); ctx.closePath(); ctx.fillStyle = '#ff9fb6'; ctx.fill(); ctx.lineWidth = 1.1; ctx.strokeStyle = INK; ctx.stroke(); } // orbiting crystal
      if (lk >= 5) baked(ctx, 'laser:sinks', (g) => { for (const sx of [-1, 1]) for (const k of [0, 1, 2]) { g.beginPath(); g.moveTo(sx * 8, -6 + k * 3.5); g.lineTo(sx * 13, -5 + k * 3.5); g.lineWidth = 2.2; g.strokeStyle = INK; g.stroke(); g.lineWidth = 1; g.strokeStyle = '#d9d2ea'; g.stroke(); } }); // heat sinks
      break;
    }
    case 'tractor': { // v0.6 item 6: a cute little tractor with a front bucket; scoops the trail tile next to it
      const dx = tw && tw.trailDir ? tw.trailDir.nc - tw.c : 1, dy = tw && tw.trailDir ? tw.trailDir.nr - tw.r : 0;
      const face = dx < 0 ? -1 : 1;
      ctx.save(); ctx.scale(face, 1);
      if (dy) ctx.translate(0, dy * 2); // leans a touch toward a tile above / below
      const bob = fx > 0 ? 0 : Math.sin(t * 9) * 0.35;
      ctx.translate(0, bob);
      baked(ctx, 'tractorBody', tractorBodyPaths);
      // front arms + bucket (live): idle low, scoop = dip down, then lift up high (throw), then back
      const p = fx > 0 ? 1 - fx / 0.9 : 0;
      const ang = fx > 0 ? (p < 0.25 ? 0.35 * (p / 0.25) : p < 0.55 ? 0.35 - 1.45 * ((p - 0.25) / 0.3) : -1.1 + 1.1 * ((p - 0.55) / 0.45)) : Math.sin(t * 1.5) * 0.04;
      ctx.save(); ctx.translate(5, -6); ctx.rotate(ang);
      for (const oy of [-1.2, 1.2]) { ctx.beginPath(); ctx.moveTo(0, oy); ctx.lineTo(12, oy + 5); ctx.lineWidth = 3.2; ctx.strokeStyle = INK; ctx.stroke(); ctx.lineWidth = 1.6; ctx.strokeStyle = '#ffb347'; ctx.stroke(); }
      ctx.translate(13, 6); ctx.rotate(-ang * 0.6);
      ctx.beginPath(); ctx.moveTo(-1, -5); ctx.lineTo(7, -6); ctx.quadraticCurveTo(10, 1, 6, 5); ctx.lineTo(-2, 5); ctx.closePath();
      ctx.fillStyle = '#c9cfdc'; ctx.fill(); ctx.lineWidth = 1.8; ctx.strokeStyle = INK; ctx.stroke();
      ctx.fillStyle = INK; for (const ty of [-3, 0.5, 3.5]) { ctx.beginPath(); ctx.moveTo(7.5, ty - 1); ctx.lineTo(10, ty); ctx.lineTo(7.5, ty + 1); ctx.fill(); }
      if (fx > 0 && p > 0.15 && p < 0.6) { ctx.beginPath(); ctx.arc(3, -5, 3, Math.PI, 0); ctx.fillStyle = '#c8956a'; ctx.fill(); } // a scoop of trail dirt
      ctx.restore();
      ctx.restore();
      if (lk >= 2) baked(ctx, 'tractor:lp' + (lk >= 5 ? 5 : 2), (g) => {
        rr(g, 4, -21, 3.4, 9, 1.5); g.fillStyle = '#9aa3b5'; g.fill(); g.lineWidth = 1.2; g.strokeStyle = INK; g.stroke(); // exhaust pipe
        if (lk >= 5) { g.beginPath(); g.moveTo(-16, -4); g.lineTo(-20, 2); g.lineTo(-16, 4); g.lineWidth = 2; g.strokeStyle = INK; g.stroke(); } // tow hook
      });
      if (lk >= 2) { const sp = (t * 1.2) % 1; ctx.globalAlpha = 0.6 * (1 - sp); ctx.beginPath(); ctx.arc(5.7 + sp * 2, -23 - sp * 8, 1.6 + sp * 2, 0, 7); ctx.fillStyle = '#ffffff'; ctx.fill(); ctx.globalAlpha = 1; } // exhaust puff
      if (lk >= 3) { const on = Math.sin(t * 7) > 0; baked(ctx, 'tractor:beacon' + (on ? 1 : 0), (g) => { rr(g, -9, -27, 6, 4, 2); g.fillStyle = on ? '#ffb347' : '#ffe0a8'; g.fill(); g.lineWidth = 1.2; g.strokeStyle = INK; g.stroke(); }); } // roof beacon (blinks)
      break;
    }
    case 'zapper': {
      pad(ctx, '#c5e4ff');
      baked(ctx, 'zap:stem', (g) => { rr(g, -3, -8, 6, 12, 2); g.fillStyle = '#9aa3b5'; g.fill(); g.lineWidth = 1.8; g.strokeStyle = INK; g.stroke(); });
      const glow = 0.5 + Math.sin(t * 6) * 0.2 + (fx > 0 ? 0.5 : 0);
      ctx.beginPath(); ctx.arc(0, -20, 15, 0, 7); ctx.fillStyle = `rgba(150,200,255,${0.25 * glow})`; ctx.fill();
      baked(ctx, 'zap:box', (g) => { rr(g, -11, -31, 22, 22, 7); g.fillStyle = '#6a7ad8'; g.fill(); g.lineWidth = 2.2; g.strokeStyle = INK; g.stroke(); });
      rr(ctx, -7.5, -27.5, 15, 15, 4); ctx.fillStyle = `rgba(190,170,255,${0.7 + 0.3 * glow})`; ctx.fill();
      baked(ctx, 'zap:top' + (lk >= 5 ? 5 : lk >= 2 ? 2 : 1), (g) => {
        g.strokeStyle = '#f2f4ff'; g.lineWidth = 1.3;
        for (let k = -1; k <= 1; k++) { g.beginPath(); g.moveTo(-7, -20 + k * 4.5); g.lineTo(7, -20 + k * 4.5); g.stroke(); }
        g.beginPath(); g.moveTo(-8, -32); g.quadraticCurveTo(0, -38, 8, -32); g.lineWidth = 2.2; g.strokeStyle = INK; g.stroke();
        rr(g, -9.5, -29.5, 4, 18, 2); g.fillStyle = 'rgba(255,255,255,0.3)'; g.fill();
        for (let k = 0; k < 3; k++) { g.beginPath(); g.ellipse(0, -2 - k * 2.6, 4.2, 1.3, 0, 0, 7); g.lineWidth = 1.2; g.strokeStyle = '#f2b54a'; g.stroke(); }
        if (lk >= 2) for (let k = 0; k < 2; k++) { g.beginPath(); g.ellipse(0, -10 + k * 2.6, 6, 1.6, 0, 0, 7); g.lineWidth = 1.4; g.strokeStyle = '#f2b54a'; g.stroke(); } // second coil
        if (lk >= 5) { g.beginPath(); g.moveTo(0, -36); g.lineTo(0, -44); g.lineWidth = 2; g.strokeStyle = INK; g.stroke(); blob(g, 0, -45, 2.4, 2.4, '#fff3a0', 1.1); } // lightning rod
      });
      if (Math.sin(t * 9) > 0.7 || fx > 0) { ctx.beginPath(); ctx.moveTo(9, -34); ctx.lineTo(12, -38); ctx.lineTo(10, -38.5); ctx.lineTo(14, -43); ctx.lineWidth = 1.6; ctx.strokeStyle = '#fff3a0'; ctx.stroke(); }
      if (lk >= 3) for (const s2 of [-1, 1]) { const on = Math.sin(t * 6 + s2) > 0; baked(ctx, 'zap:lamp' + s2 + (on ? 1 : 0), (g) => blob(g, s2 * 14, -26, 3.2, 3.2, on ? '#fff3a0' : '#c9d4ff', 1.3)); } // twin lamps (blink)
      break;
    }
  }
  if (lvl >= 6) {
    // little crown for max level (v0.6: max is now level 6) + a pennant on side towers
    const side = T.place === 'side';
    baked(ctx, 'crown' + (side ? 's' : 'p'), (g) => {
      g.translate(side ? 13 : 11, side ? -24 : -14);
      g.beginPath(); g.moveTo(-5, 3); g.lineTo(-6, -4); g.lineTo(-2.5, -1); g.lineTo(0, -6); g.lineTo(2.5, -1); g.lineTo(6, -4); g.lineTo(5, 3); g.closePath();
      g.fillStyle = '#ffd45e'; g.fill(); g.lineWidth = 1.6; g.strokeStyle = INK; g.stroke();
    });
    if (side) {
      baked(ctx, 'pennantPole', (g) => { g.translate(-15, 2); g.beginPath(); g.moveTo(0, 6); g.lineTo(0, -26); g.lineWidth = 2.2; g.strokeStyle = INK; g.stroke(); g.lineWidth = 1; g.strokeStyle = '#e8d9c8'; g.stroke(); });
      ctx.save(); ctx.translate(-15, 2);
      const wv = Math.sin(t * 5) * 1.5; ctx.beginPath(); ctx.moveTo(0, -26); ctx.quadraticCurveTo(6, -24 + wv, 11, -22 + wv); ctx.lineTo(0, -18); ctx.closePath();
      ctx.fillStyle = '#ff8fab'; ctx.fill(); ctx.lineWidth = 1.4; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore();
    }
  }
  ctx.restore();
}
// L4: a round stone plinth with gold studs under the pad (wider silhouette). Static -> cached sprite.
function plinthPaths(ctx) {
  ctx.beginPath(); ctx.ellipse(0, 11, 22, 10, 0, 0, 7); ctx.fillStyle = '#d8ccd4'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = INK; ctx.stroke();
  ctx.beginPath(); ctx.ellipse(0, 9.5, 21, 8.6, 0, Math.PI * 1.05, Math.PI * 1.6); ctx.lineWidth = 1.4; ctx.strokeStyle = '#f6f0f3'; ctx.stroke();
  for (const a of [0.25, 0.95, 1.6, 2.25, 2.9]) { ctx.beginPath(); ctx.arc(Math.cos(a) * 19, 11 + Math.sin(a) * 8.4, 1.7, 0, 7); ctx.fillStyle = '#ffd45e'; ctx.fill(); ctx.lineWidth = 0.9; ctx.strokeStyle = INK; ctx.stroke(); }
}
// the Tractor's static chassis (cached): big rear wheel, small front wheel, yellow body with a cab and a cute face on the grille
function tractorBodyPaths(ctx) {
  shadow(ctx, 0, 9, 18, 5, 0.24);
  // body + hood
  rr(ctx, -12, -10, 25, 13, 5); let g = ctx.createLinearGradient(0, -10, 0, 3); g.addColorStop(0, '#ffe39e'); g.addColorStop(1, '#f2b84a');
  ctx.fillStyle = g; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = INK; ctx.stroke();
  // cab with window and a pink roof
  rr(ctx, -13, -23, 13, 15, 3); ctx.fillStyle = '#ffd27a'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = INK; ctx.stroke();
  rr(ctx, -10.5, -20.5, 8, 8, 2); ctx.fillStyle = '#bfe6ff'; ctx.fill(); ctx.lineWidth = 1.3; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-9, -19); ctx.lineTo(-6, -16); ctx.lineWidth = 1.2; ctx.strokeStyle = '#ffffff'; ctx.stroke();
  rr(ctx, -15, -25.5, 17, 4, 2); ctx.fillStyle = '#ff8fab'; ctx.fill(); ctx.lineWidth = 1.6; ctx.strokeStyle = INK; ctx.stroke();
  // face on the grille: two glossy eyes + smile + blush
  for (const ex of [6, 10.5]) { ctx.beginPath(); ctx.ellipse(ex, -5.5, 1.7, 2.1, 0, 0, 7); ctx.fillStyle = INK; ctx.fill(); ctx.beginPath(); ctx.arc(ex + 0.5, -6.3, 0.6, 0, 7); ctx.fillStyle = '#fff'; ctx.fill(); }
  ctx.beginPath(); ctx.arc(8.3, -2.6, 2, 0.2, Math.PI - 0.2); ctx.lineWidth = 1.2; ctx.strokeStyle = INK; ctx.stroke();
  ctx.beginPath(); ctx.ellipse(3.5, -2.5, 1.6, 1, 0, 0, 7); ctx.fillStyle = 'rgba(255,112,140,0.55)'; ctx.fill();
  // wheels
  for (const [wx, wy, r] of [[-7, 3, 8.5], [8, 5.5, 5.2]]) {
    ctx.beginPath(); ctx.arc(wx, wy, r, 0, 7); ctx.fillStyle = '#5a4652'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = INK; ctx.stroke();
    for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; ctx.beginPath(); ctx.moveTo(wx + Math.cos(a) * (r - 1.6), wy + Math.sin(a) * (r - 1.6)); ctx.lineTo(wx + Math.cos(a) * r, wy + Math.sin(a) * r); ctx.lineWidth = 1.4; ctx.strokeStyle = '#3d2a36'; ctx.stroke(); }
    ctx.beginPath(); ctx.arc(wx, wy, r * 0.48, 0, 7); ctx.fillStyle = '#ffd45e'; ctx.fill(); ctx.lineWidth = 1.3; ctx.strokeStyle = INK; ctx.stroke();
    ctx.beginPath(); ctx.arc(wx, wy, r * 0.16, 0, 7); ctx.fillStyle = INK; ctx.fill();
  }
  g = null;
}
// L4 on-path items: four little gold studs at the tile corners (their area is their own tile)
function pathStuds(ctx, t) {
  for (const [x, y] of [[-15, -9], [15, -9], [-15, 15], [15, 15]]) { ctx.save(); ctx.translate(x, y + Math.sin(t * 3 + x) * 0.6); baked(ctx, 'stud', (g) => starShape(g, 0, 0, 2.8, '#ffd45e', 1)); ctx.restore(); }
}
// v0.6 research item 8: the STATIC per-tower parts for levels 2, 3 and 5, baked into the body sprites (v0.6.1). The animated
// level parts (spray gauge needle, fan streamers, glue bubbles, lava flames, gecko cape, laser orbiting crystal, zapper lamps,
// tractor smoke + beacon) are drawn live in drawTower; fan / glue / laser / zapper / tractor / gate statics are baked there.
function levelParts(ctx, type, lvl, t, fx, aim) {
  if (lvl < 2) return;
  const L2 = lvl >= 2, L3 = lvl >= 3, L5 = lvl >= 5;
  ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  const steel = (x, y, w, h, r = 1.5) => { rr(ctx, x, y, w, h, r); ctx.fillStyle = '#c9cfdc'; ctx.fill(); ctx.lineWidth = 1.3; ctx.strokeStyle = INK; ctx.stroke(); };
  switch (type) {
    case 'slingshot': {
      const face = Math.cos(aim) >= 0 ? 1 : -1; ctx.scale(face, 1);
      if (L2) for (const sx of [-8, 8]) steel(sx - 3, -21, 6, 5, 2);                            // metal-capped prongs
      if (L3) { ctx.beginPath(); ctx.moveTo(-8, -14); ctx.lineTo(-1, -9); ctx.lineTo(8, -14); ctx.lineWidth = 1.6; ctx.strokeStyle = '#ffb3c1'; ctx.stroke(); // double band
        blob(ctx, 7, 4, 4.5, 3.6, '#c98a55', 1.3); blob(ctx, 6, 2, 1.6, 1.4, '#f3d2a2', 0.8); }               // crumb pouch
      if (L5) { rr(ctx, -15, -2, 7, 9, 2); ctx.fillStyle = '#e0b07a'; ctx.fill(); ctx.lineWidth = 1.3; ctx.strokeStyle = INK; ctx.stroke(); // pebble basket
        for (const [x, y] of [[-13, -3], [-10, -4]]) blob(ctx, x, y, 2, 2, '#c9c2d6', 1); }
      break;
    }
    case 'spray': {
      if (L2) { rr(ctx, -9, -26, 6, 3, 1); ctx.fillStyle = '#8fd17d'; ctx.fill(); ctx.lineWidth = 1.2; ctx.strokeStyle = INK; ctx.stroke(); } // twin nozzle
      if (L3) { rr(ctx, 9, -12, 7, 15, 3); ctx.fillStyle = '#9be38a'; ctx.fill(); ctx.lineWidth = 1.6; ctx.strokeStyle = INK; ctx.stroke(); // side tank + hose
        ctx.beginPath(); ctx.moveTo(12.5, -12); ctx.quadraticCurveTo(13, -22, 6, -24); ctx.lineWidth = 1.6; ctx.stroke(); }
      if (L5) { ctx.beginPath(); ctx.arc(-11, -16, 4, 0, 7); ctx.fillStyle = '#fff'; ctx.fill(); ctx.lineWidth = 1.3; ctx.strokeStyle = INK; ctx.stroke(); } // pressure gauge (needle is live)
      break;
    }
    case 'sound': {
      if (L2) { blob(ctx, 0, -25, 4, 4, '#5b4a7a', 1.5); ctx.beginPath(); ctx.arc(0, -25, 1.8, 0, 7); ctx.fillStyle = '#e8ddff'; ctx.fill(); } // tweeter on top
      if (L3) for (const sx of [-1, 1]) { rr(ctx, sx * 15 - (sx < 0 ? 7 : 0), -14, 7, 14, 3); ctx.fillStyle = '#b39ee6'; ctx.fill(); ctx.lineWidth = 1.6; ctx.strokeStyle = INK; ctx.stroke(); blob(ctx, sx * 18.5, -7, 2.3, 2.3, '#5b4a7a', 1); } // side cabinets
      if (L5) { ctx.beginPath(); ctx.moveTo(6, -21); ctx.lineTo(10, -31); ctx.lineWidth = 1.6; ctx.strokeStyle = INK; ctx.stroke(); blob(ctx, 10, -32, 2.2, 2.2, '#ff8fab', 1.1); } // antenna
      break;
    }
    case 'ball': {
      if (L3) { ctx.beginPath(); ctx.ellipse(0, -14, 11, 4.6, 0, 0, 7); ctx.lineWidth = 2.4; ctx.strokeStyle = '#f4b632'; ctx.stroke(); } // gold-trimmed cup
      if (L5) for (const [x, y] of [[-14, 2], [-11, -2], [-15, -3]]) marble(ctx, x, y, 3, x); // spare marbles
      break;
    }
    case 'lizard': {
      const face = Math.cos(aim) >= 0 ? 1 : -1; ctx.scale(face, 1);
      if (L2) for (const x of [-9, -4, 1]) { ctx.beginPath(); ctx.moveTo(x - 2, -4); ctx.lineTo(x, -9); ctx.lineTo(x + 2, -4); ctx.closePath(); ctx.fillStyle = '#ffb36b'; ctx.fill(); ctx.lineWidth = 1.1; ctx.strokeStyle = INK; ctx.stroke(); } // back spikes
      if (L3) { ctx.beginPath(); ctx.ellipse(9, -11, 8.5, 2.2, 0, Math.PI, 0); ctx.lineWidth = 2.6; ctx.strokeStyle = '#ff6f91'; ctx.stroke(); } // headband
      break;
    }
    case 'pheromone': {
      if (L2) { rr(ctx, -2, -23, 4, 5, 1.5); ctx.fillStyle = '#ff9ec0'; ctx.fill(); ctx.lineWidth = 1.2; ctx.strokeStyle = INK; ctx.stroke(); } // pump top
      if (L3) { for (const sx of [-1, 1]) { ctx.beginPath(); ctx.ellipse(sx * 4, -12, 4, 2.2, sx * 0.4, 0, 7); ctx.fillStyle = '#c9b6f2'; ctx.fill(); ctx.lineWidth = 1.1; ctx.strokeStyle = INK; ctx.stroke(); } } // ribbon bow
      if (L5) { rr(ctx, 9, -4, 6, 9, 3); ctx.fillStyle = '#ffd9ec'; ctx.fill(); ctx.lineWidth = 1.3; ctx.strokeStyle = INK; ctx.stroke(); } // second vial
      break;
    }
    case 'lava': {
      if (L2) for (const [x, y] of [[-16, 2], [16, 3], [-8, 10], [9, 10]]) blob(ctx, x, y, 3, 2.2, '#8c7a86', 1.1); // rim rocks
      if (L3) { ctx.beginPath(); ctx.moveTo(-5, 3); ctx.lineTo(-2, -5); ctx.lineTo(2, -5); ctx.lineTo(5, 3); ctx.closePath(); ctx.fillStyle = '#7a4238'; ctx.fill(); ctx.lineWidth = 1.4; ctx.strokeStyle = INK; ctx.stroke(); blob(ctx, 0, -5, 2.2, 1, '#ffb347', 0.8); } // mini volcano
      break;
    }
  }
  ctx.restore();
}
function towerSize(tw) { const T = C.TOWERS[tw.type]; let v = 1; for (let i = 0; i < (tw.lvl || 1) - 1; i++) if (T.upgrades[i] && T.upgrades[i].ballRadius) v *= T.upgrades[i].ballRadius; return v; }
export function arrow(ctx, x, y, ang, s, col) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang);
  ctx.beginPath(); ctx.moveTo(s, 0); ctx.lineTo(-s * 0.6, -s * 0.8); ctx.lineTo(-s * 0.25, 0); ctx.lineTo(-s * 0.6, s * 0.8); ctx.closePath();
  ctx.fillStyle = col; ctx.fill(); ctx.lineWidth = Math.max(1.2, s / 5); ctx.strokeStyle = INK; ctx.lineJoin = 'round'; ctx.stroke();
  ctx.restore();
}
export function stunStars(ctx, x, y, t, s = 1) {
  for (let i = 0; i < 3; i++) { const a = t * 6 + i * 2.1; starShape(ctx, x + Math.cos(a) * 9 * s, y + Math.sin(a) * 3, 2.6, '#fff27a', 1); }
}
// animated red "lava" border (selected bonus with 0 left)
export function lavaBorder(ctx, x, y, w, h, r, t) {
  ctx.save();
  rr(ctx, x, y, w, h, r); ctx.lineWidth = 6; ctx.strokeStyle = '#c0281e'; ctx.stroke();
  ctx.setLineDash([10, 8]); ctx.lineDashOffset = -t * 40; ctx.lineWidth = 3.5; ctx.strokeStyle = '#ff9a2e'; ctx.stroke();
  ctx.setLineDash([3, 15]); ctx.lineDashOffset = t * 25; ctx.lineWidth = 2; ctx.strokeStyle = '#ffe36e'; ctx.stroke();
  ctx.restore();
}
export function marble(ctx, x, y, r, rot = 0) {
  shadow(ctx, x, y + r * 0.9, r * 0.9, r * 0.3, 0.2);
  blob(ctx, x, y, r, r, '#7fc4f0', 2);
  ctx.save(); ctx.beginPath(); ctx.arc(x, y, r - 1, 0, 7); ctx.clip();
  ctx.strokeStyle = 'rgba(255,255,255,0.7)'; ctx.lineWidth = r * 0.35;
  ctx.beginPath(); ctx.ellipse(x, y, r * 0.9, r * 0.35, rot, 0, 7); ctx.stroke();
  ctx.restore();
  ctx.beginPath(); ctx.arc(x - r * 0.35, y - r * 0.4, r * 0.22, 0, 7); ctx.fillStyle = '#fff'; ctx.fill();
}
export function heart(ctx, x, y, s, col) {
  ctx.beginPath(); ctx.moveTo(x, y + s);
  ctx.bezierCurveTo(x - s * 2, y - s * 0.5, x - s * 0.8, y - s * 2, x, y - s * 0.7);
  ctx.bezierCurveTo(x + s * 0.8, y - s * 2, x + s * 2, y - s * 0.5, x, y + s);
  ctx.fillStyle = col; ctx.fill(); ctx.lineWidth = 1.2; ctx.strokeStyle = INK; ctx.stroke();
}

// ---------------- Bonus icons ----------------
export function drawBonusIcon(ctx, type, t = 0) {
  ctx.save(); ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  if (type === 'bomb') {
    blob(ctx, 0, 2, 11, 11, '#5f5a78');
    ctx.beginPath(); ctx.arc(-4, -2, 3, 0, 7); ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.fill();
    rr(ctx, -3.5, -12, 7, 5, 2); ctx.fillStyle = '#9a96b0'; ctx.fill(); ctx.lineWidth = 1.8; ctx.strokeStyle = INK; ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, -12); ctx.quadraticCurveTo(5, -18, 9, -15); ctx.lineWidth = 1.8; ctx.stroke();
    starShape(ctx, 9, -15, 4 + Math.sin(t * 20), '#ffd45e', 1.2);
  } else if (type === 'plane') {
    ctx.save(); ctx.rotate(-0.15);
    rr(ctx, -13, -4, 24, 9, 4.5); ctx.fillStyle = '#ffd36e'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = INK; ctx.stroke();
    rr(ctx, -5, -12, 8, 24, 3); ctx.fillStyle = '#ff8c8c'; ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(-13, 0); ctx.lineTo(-17, -7); ctx.lineTo(-11, -3); ctx.closePath(); ctx.fillStyle = '#ff8c8c'; ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.arc(2, -3, 2.6, 0, 7); ctx.fillStyle = '#bfe7ff'; ctx.fill(); ctx.stroke();
    ctx.beginPath(); ctx.ellipse(12, 0, 1.5, 6 * Math.abs(Math.sin(t * 30)) + 1, 0, 0, 7); ctx.fillStyle = '#ccc'; ctx.fill();
    ctx.restore();
  } else if (type === 'freeze') {
    blob(ctx, 0, 0, 12, 12, '#bfe9ff');
    ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 2.4;
    for (let k = 0; k < 3; k++) { const a = k * Math.PI / 3; ctx.beginPath(); ctx.moveTo(Math.cos(a) * 8, Math.sin(a) * 8); ctx.lineTo(-Math.cos(a) * 8, -Math.sin(a) * 8); ctx.stroke(); }
    ctx.strokeStyle = '#6fb8e8'; ctx.lineWidth = 1;
    for (let k = 0; k < 3; k++) { const a = k * Math.PI / 3; ctx.beginPath(); ctx.moveTo(Math.cos(a) * 8, Math.sin(a) * 8); ctx.lineTo(-Math.cos(a) * 8, -Math.sin(a) * 8); ctx.stroke(); }
  } else if (type === 'decoy') {
    sugarCube(ctx, 0, 2, 10);
  }
  ctx.restore();
}
export function sugarCube(ctx, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(-s, -s * 0.4); ctx.lineTo(0, -s); ctx.lineTo(s, -s * 0.4); ctx.lineTo(s, s * 0.6); ctx.lineTo(0, s * 1.1); ctx.lineTo(-s, s * 0.6); ctx.closePath();
  ctx.fillStyle = '#fffaf0'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = INK; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-s, -s * 0.4); ctx.lineTo(0, s * 0.15); ctx.lineTo(s, -s * 0.4); ctx.moveTo(0, s * 0.15); ctx.lineTo(0, s * 1.1); ctx.lineWidth = 1.4; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, s * 0.15); ctx.lineTo(s, -s * 0.4); ctx.lineTo(s, s * 0.6); ctx.lineTo(0, s * 1.1); ctx.closePath(); ctx.fillStyle = 'rgba(200,180,160,0.35)'; ctx.fill();
  ctx.fillStyle = '#e8dccb'; for (const [a, b] of [[-4, 2], [-6, -1], [3, -5], [-2, -6]]) { ctx.fillRect(a * s / 10, b * s / 10, 1.4, 1.4); }
  ctx.restore();
}

// ---------------- COOKIE (the food) ----------------
// v0.3 item 4: the cookie's mood follows how much is left (C.UI.cookieFaces). Never scary: worried -> sad -> crying ->
// screaming (cartoon "AAAH!") -> pleading puppy eyes -> fainted (swirly eyes). opts: legacy bool or { face, ouch }.
export function cookieFace(pct) { for (const f of C.UI.cookieFaces) if (pct >= f.min) return f.face; return 'fainted'; }
// v0.4 item 18: every world's treat is drawn by drawTreat(kind): the body comes from TREAT_BODIES, the faces (mood faces by
// food left + the animated bite reactions from src/treat.js) are SHARED by every treat. drawCookie stays as the cookie shortcut.
function cookieBody(ctx, r, pct) {
  ctx.save();
  const bites = Math.round((1 - pct) * 9);
  ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2);
  for (let k = 0; k < bites; k++) { const a = -0.6 + k * 0.72; const bx = Math.cos(a) * r * 0.98, by = Math.sin(a) * r * 0.98; ctx.moveTo(bx + 9, by); ctx.arc(bx, by, 9, 0, Math.PI * 2, true); }
  ctx.clip('evenodd');
  const g = ctx.createRadialGradient(-8, -10, 4, 0, 0, r * 1.1); g.addColorStop(0, '#ffe2a8'); g.addColorStop(0.7, '#f2b866'); g.addColorStop(1, '#d58f3f');
  ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fillStyle = g; ctx.fill();
  ctx.fillStyle = '#6b3d2a';
  for (const [a, b, s] of [[-12, -8, 3.4], [9, -12, 3], [14, 5, 3.6], [-4, 13, 3.2], [-16, 7, 2.6], [3, -2, 2.4], [-6, -17, 2.2], [18, -6, 2]]) { ctx.beginPath(); ctx.ellipse(a, b, s, s * 0.8, a, 0, 7); ctx.fill(); }
  ctx.restore();
  // outline (approximate, including bites)
  ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.lineWidth = 3; ctx.strokeStyle = INK;
  ctx.save();
  ctx.beginPath(); ctx.rect(-r - 12, -r - 12, r * 2 + 24, r * 2 + 24);
  for (let k = 0; k < bites; k++) { const a = -0.6 + k * 0.72; ctx.moveTo(Math.cos(a) * r * 0.98 + 9, Math.sin(a) * r * 0.98); ctx.arc(Math.cos(a) * r * 0.98, Math.sin(a) * r * 0.98, 9, 0, Math.PI * 2, true); }
  ctx.clip('evenodd');
  ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.stroke(); ctx.restore();
  // bite edges
  ctx.save(); ctx.beginPath(); ctx.arc(0, 0, r + 1, 0, 7); ctx.clip();
  for (let k = 0; k < bites; k++) { const a = -0.6 + k * 0.72; ctx.beginPath(); ctx.arc(Math.cos(a) * r * 0.98, Math.sin(a) * r * 0.98, 9, 0, 7); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke(); }
  ctx.restore();
}
// A second body only to prove the scheme is shared (a future world's cake): same faces, same reactions, different body.
function cakeBody(ctx, r, pct) {
  const w = r * 1.05, h = r * 0.95, cut = Math.round((1 - pct) * 4);
  ctx.save();
  ctx.beginPath(); ctx.roundRect(-w, -h * 0.55, w * 2, h * 1.35, 6);
  if (cut) { ctx.rect(w - cut * w * 0.42, -h * 0.6, cut * w * 0.42 + 1, h * 1.5); }
  ctx.clip('evenodd');
  const g = ctx.createLinearGradient(0, -h, 0, h); g.addColorStop(0, '#ffd9e6'); g.addColorStop(1, '#f2a7c0');
  ctx.beginPath(); ctx.roundRect(-w, -h * 0.55, w * 2, h * 1.35, 6); ctx.fillStyle = g; ctx.fill();
  ctx.fillStyle = '#fff6f0'; ctx.fillRect(-w, h * 0.18, w * 2, 4);
  ctx.beginPath(); ctx.moveTo(-w, -h * 0.5); for (let k = 0; k <= 8; k++) ctx.quadraticCurveTo(-w + (k - 0.5) * w / 4, -h * 0.5 + 8, -w + k * w / 4, -h * 0.5); ctx.lineTo(w, -h * 0.62); ctx.lineTo(-w, -h * 0.62); ctx.fillStyle = '#fffaf2'; ctx.fill();
  ctx.beginPath(); ctx.roundRect(-w, -h * 0.55, w * 2, h * 1.35, 6); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke();
  ctx.restore();
  ctx.beginPath(); ctx.arc(0, -h * 0.75, 4.5, 0, 7); ctx.fillStyle = '#e8304e'; ctx.fill(); ctx.lineWidth = 1.6; ctx.strokeStyle = INK; ctx.stroke();
}
// v0.7.7 world 3: the Pie (a lattice-top apple pie in a tin). Same bite scheme as the cookie (bites bitten out of the rim), the shared faces sit on the lattice.
function pieBody(ctx, r, pct) {
  const bites = Math.round((1 - pct) * 9), bAt = (k) => { const a = -0.6 + k * 0.72; return [Math.cos(a) * r * 0.98, Math.sin(a) * r * 0.98]; };
  ctx.save();
  ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2);
  for (let k = 0; k < bites; k++) { const [bx, by] = bAt(k); ctx.moveTo(bx + 9, by); ctx.arc(bx, by, 9, 0, Math.PI * 2, true); }
  ctx.clip('evenodd');
  const g = ctx.createRadialGradient(-8, -10, 4, 0, 0, r * 1.1); g.addColorStop(0, '#fff0c4'); g.addColorStop(0.7, '#f3c878'); g.addColorStop(1, '#d99a4a');
  ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fillStyle = g; ctx.fill();
  // pie tin rim + fluted crust edge
  ctx.beginPath(); ctx.arc(0, 0, r - 1, 0, 7); ctx.lineWidth = 7; ctx.strokeStyle = '#e2a65c'; ctx.stroke();
  ctx.fillStyle = '#c98a3e'; for (let k = 0; k < 18; k++) { const a = k * Math.PI / 9; ctx.beginPath(); ctx.arc(Math.cos(a) * (r - 3.4), Math.sin(a) * (r - 3.4), 1.7, 0, 7); ctx.fill(); }
  // lattice: two sets of diagonal strips (kept light so the face reads), with red apple showing between
  ctx.save(); ctx.beginPath(); ctx.arc(0, 0, r - 7, 0, 7); ctx.clip();
  ctx.fillStyle = '#f0a58f'; ctx.fillRect(-r, -r, r * 2, r * 2);
  ctx.lineWidth = 4.2; ctx.strokeStyle = '#fbe0a0'; ctx.lineCap = 'butt';
  for (let k = -3; k <= 3; k++) { ctx.beginPath(); ctx.moveTo(-r, -r + k * 12 + 4); ctx.lineTo(r, r + k * 12 + 4); ctx.stroke(); ctx.beginPath(); ctx.moveTo(r, -r + k * 12 + 4); ctx.lineTo(-r, r + k * 12 + 4); ctx.stroke(); }
  ctx.restore();
  ctx.beginPath(); ctx.arc(0, 0, r - 7, 0, 7); ctx.lineWidth = 1.6; ctx.strokeStyle = 'rgba(122,70,30,0.7)'; ctx.stroke();
  ctx.restore();
  // outline incl. bites (same as the cookie)
  ctx.save();
  ctx.beginPath(); ctx.rect(-r - 12, -r - 12, r * 2 + 24, r * 2 + 24);
  for (let k = 0; k < bites; k++) { const [bx, by] = bAt(k); ctx.moveTo(bx + 9, by); ctx.arc(bx, by, 9, 0, Math.PI * 2, true); }
  ctx.clip('evenodd');
  ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.arc(0, 0, r + 1, 0, 7); ctx.clip();
  for (let k = 0; k < bites; k++) { const [bx, by] = bAt(k); ctx.beginPath(); ctx.arc(bx, by, 9, 0, 7); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke(); }
  ctx.restore();
}
// v0.7.9 world 4: the Sundae (a glass dish seen from above: pink scoop, fudge drizzle, sprinkles, a cherry). Same bite scheme as the cookie; the shared faces sit on the scoop.
function sundaeBody(ctx, r, pct) {
  const bites = Math.round((1 - pct) * 9), bAt = (k) => { const a = -0.6 + k * 0.72; return [Math.cos(a) * r * 0.98, Math.sin(a) * r * 0.98]; };
  ctx.save();
  ctx.beginPath(); ctx.arc(0, 0, r, 0, Math.PI * 2);
  for (let k = 0; k < bites; k++) { const [bx, by] = bAt(k); ctx.moveTo(bx + 9, by); ctx.arc(bx, by, 9, 0, Math.PI * 2, true); }
  ctx.clip('evenodd');
  const g = ctx.createRadialGradient(-8, -10, 4, 0, 0, r * 1.1); g.addColorStop(0, '#fff3f6'); g.addColorStop(0.7, '#ffc4d6'); g.addColorStop(1, '#f08fb0');
  ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.fillStyle = g; ctx.fill();
  ctx.beginPath(); ctx.arc(0, 0, r - 1, 0, 7); ctx.lineWidth = 6; ctx.strokeStyle = '#d6f1ea'; ctx.stroke(); // glass dish rim
  ctx.beginPath(); ctx.arc(0, 0, r - 4.2, 0, 7); ctx.lineWidth = 1.4; ctx.strokeStyle = 'rgba(80,150,135,0.7)'; ctx.stroke();
  ctx.lineWidth = 3.4; ctx.strokeStyle = '#7a4a34'; ctx.lineCap = 'round'; // fudge drizzle
  ctx.beginPath(); ctx.moveTo(-r + 7, -9); for (let k = 0; k < 5; k++) ctx.quadraticCurveTo(-r + 7 + k * 9 + 4.5, -9 + (k % 2 ? 8 : -8), -r + 7 + (k + 1) * 9, -9); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-r + 10, 15); for (let k = 0; k < 4; k++) ctx.quadraticCurveTo(-r + 10 + k * 10 + 5, 15 + (k % 2 ? -7 : 7), -r + 10 + (k + 1) * 10, 15); ctx.stroke();
  for (const [x, y, c, a] of [[-14, -17, '#ffe27a', 0.6], [12, -15, '#8fd0f7', -0.5], [17, 8, '#ffffff', 0.9], [-17, 3, '#ffe27a', -0.3], [5, 18, '#8fd0f7', 0.4], [-6, 19, '#ffffff', 1.2], [20, -3, '#ffe27a', 0.2]]) { ctx.save(); ctx.translate(x, y); ctx.rotate(a); ctx.fillStyle = c; ctx.fillRect(-2.2, -0.8, 4.4, 1.7); ctx.restore(); }
  ctx.restore();
  blob(ctx, -r * 0.5, -r * 0.62, 4.4, 4.4, '#e8304e', 1.8); ctx.beginPath(); ctx.moveTo(-r * 0.5, -r * 0.62 - 3.8); ctx.quadraticCurveTo(-r * 0.5 + 3, -r * 0.62 - 8, -r * 0.5 + 6.5, -r * 0.62 - 8); ctx.lineWidth = 1.8; ctx.strokeStyle = INK; ctx.stroke();
  ctx.save();
  ctx.beginPath(); ctx.rect(-r - 12, -r - 12, r * 2 + 24, r * 2 + 24);
  for (let k = 0; k < bites; k++) { const [bx, by] = bAt(k); ctx.moveTo(bx + 9, by); ctx.arc(bx, by, 9, 0, Math.PI * 2, true); }
  ctx.clip('evenodd');
  ctx.beginPath(); ctx.arc(0, 0, r, 0, 7); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke(); ctx.restore();
  ctx.save(); ctx.beginPath(); ctx.arc(0, 0, r + 1, 0, 7); ctx.clip();
  for (let k = 0; k < bites; k++) { const [bx, by] = bAt(k); ctx.beginPath(); ctx.arc(bx, by, 9, 0, 7); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke(); }
  ctx.restore();
}
export const TREAT_BODIES = { cookie: cookieBody, cake: cakeBody, pie: pieBody, sundae: sundaeBody };
// The body moves with the reaction: a jump (surprised), a fast shiver (oy oy oy), sinking (sad), sobbing bounces (crying).
function reactMotion(react, t) {
  if (!react) return { dx: 0, dy: 0, sx: 1, sy: 1 };
  const a = react.age, e = Math.max(0, 1 - a / 1.6);
  switch (react.face) {
    case 'surprised': { const hop = a < 0.45 ? Math.sin(a / 0.45 * Math.PI) : 0; return { dx: 0, dy: -hop * 9, sx: 1 - hop * 0.06, sy: 1 + hop * 0.08 }; }
    case 'oyoy': return { dx: Math.sin(t * 46) * 2.2 * e, dy: 0, sx: 1 + Math.sin(t * 23) * 0.03, sy: 1 - Math.sin(t * 23) * 0.03 };
    case 'sad': { const d = Math.min(1, a / 0.4); return { dx: 0, dy: d * 2, sx: 1 + d * 0.05, sy: 1 - d * 0.07 }; }
    case 'crying': { const b = Math.abs(Math.sin(t * 9)) * e; return { dx: 0, dy: -b * 2.5, sx: 1 + b * 0.04, sy: 1 - b * 0.03 }; }
  }
  return { dx: 0, dy: 0, sx: 1, sy: 1 };
}
// opts: legacy bool or { face, ouch, react: { face, age }, kind }  (v0.5 item 3: faces only, no text)
export function drawTreat(ctx, kind, x, y, pct, t, opts = {}) {
  if (typeof opts === 'boolean') opts = {};
  const face = opts.face || cookieFace(pct);
  const react = opts.react || null;
  const r = 26, m = reactMotion(react, t);
  ctx.save(); ctx.translate(x, y);
  shadow(ctx, 0, r * 0.75, r * 1.05 * (1 - Math.min(0.2, -m.dy / 40)), r * 0.32, 0.25);
  ctx.save(); ctx.translate(m.dx, m.dy + r * 0.75); ctx.scale(m.sx, m.sy); ctx.translate(0, -r * 0.75);
  (TREAT_BODIES[kind] || cookieBody)(ctx, r, pct);
  if (react) drawTreatFace(ctx, react.face, t, react.age);
  else drawCookieFace(ctx, opts.ouch ? 'ouch' : face, t);
  ctx.restore();
  ctx.restore();
}
export function drawCookie(ctx, x, y, pct, t, opts = {}) { return drawTreat(ctx, 'cookie', x, y, pct, t, opts); }
// v0.5 item 3: no speech bubbles / words at all - the treat reacts with animated FACES only (drawTreatFace).
// The four animated bite reactions (shared by every treat). age = seconds since the reaction started.
export const TREAT_REACTION_FACES = ['surprised', 'oyoy', 'sad', 'crying'];
export function drawTreatFace(ctx, face, t, age = 0) {
  ctx.lineCap = 'round';
  switch (face) {
    case 'surprised': { // eyes pop open (overshoot), brows fly up, little "o" mouth that opens
      const pop = age < 0.25 ? 0.6 + age / 0.25 * 0.65 : 1.25 - Math.min(0.25, (age - 0.25) * 0.6);
      for (const sx of [-7, 7]) { ctx.beginPath(); ctx.ellipse(sx, -3, 3.4 * pop, 4 * pop, 0, 0, 7); ctx.fillStyle = '#fff'; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = INK; ctx.stroke(); ctx.beginPath(); ctx.arc(sx, -3, 1.6, 0, 7); ctx.fillStyle = '#2b1d28'; ctx.fill(); }
      const bu = Math.min(1, age / 0.2) * 3;
      brow(ctx, -7, -9 - bu, -0.2); brow(ctx, 7, -9 - bu, 0.2);
      const o = 2 + Math.min(1, age / 0.3) * 2;
      ctx.beginPath(); ctx.ellipse(0, 8, o * 0.8, o, 0, 0, 7); ctx.fillStyle = '#7a3040'; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = INK; ctx.stroke();
      blushes(ctx, 0.5); break;
    }
    case 'oyoy': { // "they're eating me!": eyes squeezed > <, mouth chattering open/closed, sweat drops flying
      ctx.beginPath(); ctx.moveTo(-10, -5); ctx.lineTo(-5, -2); ctx.lineTo(-10, 1); ctx.moveTo(10, -5); ctx.lineTo(5, -2); ctx.lineTo(10, 1); ctx.lineWidth = 1.9; ctx.strokeStyle = INK; ctx.stroke();
      brow(ctx, -7, -9, 0.45, 3.5); brow(ctx, 7, -9, -0.45, 3.5);
      const open = 1 + Math.abs(Math.sin(t * 16)) * 3.2;
      ctx.beginPath(); ctx.ellipse(0, 8, 4.6, open, 0, 0, 7); ctx.fillStyle = '#7a3040'; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = INK; ctx.stroke();
      for (const sx of [-1, 1]) { const p = (age * 2.2 + (sx > 0 ? 0.5 : 0)) % 1; ctx.globalAlpha = 1 - p; tear(ctx, sx * (17 + p * 8), -12 - p * 6, 0.8); ctx.globalAlpha = 1; }
      blushes(ctx, 0.75); break;
    }
    case 'sad': { // eyes droop, lip trembles, one big tear rolls down
      const d = Math.min(1, age / 0.4);
      eye(ctx, -7, -1 + d, 3.2, 0); eye(ctx, 7, -1 + d, 3.2, 0);
      for (const sx of [-7, 7]) { ctx.beginPath(); ctx.moveTo(sx - 3.6, -3.4 + d); ctx.quadraticCurveTo(sx, -1.6 + d * 1.4, sx + 3.6, -3.4 + d); ctx.lineWidth = 1.8; ctx.strokeStyle = INK; ctx.stroke(); } // heavy lids (treat-neutral)
      brow(ctx, -7, -7 + d, 0.55); brow(ctx, 7, -7 + d, -0.55);
      const tr = Math.sin(t * 30) * 0.6;
      ctx.beginPath(); ctx.arc(0 + tr, 11, 4, Math.PI + 0.35, -0.35); ctx.lineWidth = 1.8; ctx.strokeStyle = INK; ctx.stroke();
      const p = Math.min(1, age / 1.2); tear(ctx, -9, 3 + p * 12, 1.0);
      blushes(ctx, 0.3); break;
    }
    case 'crying': { // squeezed eyes, two streams of tears, big wailing mouth
      closedEye(ctx, -7, -1, 3.6, false); closedEye(ctx, 7, -1, 3.6, false);
      brow(ctx, -7, -7, 0.6); brow(ctx, 7, -7, -0.6);
      for (const sx of [-1, 1]) for (let k = 0; k < 3; k++) { const p = (t * 1.8 + k * 0.33) % 1; ctx.globalAlpha = 1 - p * 0.7; tear(ctx, sx * (9 + p * 5), 2 + p * 18, 0.9); ctx.globalAlpha = 1; }
      const w = 5.5 + Math.sin(t * 10) * 0.8;
      ctx.beginPath(); ctx.moveTo(-w, 6); ctx.quadraticCurveTo(0, 2, w, 6); ctx.quadraticCurveTo(w * 0.6, 14, 0, 14); ctx.quadraticCurveTo(-w * 0.6, 14, -w, 6); ctx.fillStyle = '#7a3040'; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = INK; ctx.stroke();
      ctx.beginPath(); ctx.ellipse(0, 11.5, 2.6, 1.4, 0, 0, 7); ctx.fillStyle = '#ff8fa0'; ctx.fill();
      blushes(ctx, 0.6); break;
    }
    default: drawCookieFace(ctx, face, t);
  }
}

function brow(ctx, x, y, ang, len = 4) { ctx.beginPath(); ctx.moveTo(x - Math.cos(ang) * len, y - Math.sin(ang) * len); ctx.lineTo(x + Math.cos(ang) * len, y + Math.sin(ang) * len); ctx.lineWidth = 1.7; ctx.strokeStyle = INK; ctx.lineCap = 'round'; ctx.stroke(); }
function tear(ctx, x, y, s = 1) { ctx.beginPath(); ctx.moveTo(x, y - 3.2 * s); ctx.quadraticCurveTo(x + 2.6 * s, y + 0.6 * s, x, y + 2.6 * s); ctx.quadraticCurveTo(x - 2.6 * s, y + 0.6 * s, x, y - 3.2 * s); ctx.fillStyle = '#9fdcff'; ctx.fill(); ctx.lineWidth = 1; ctx.strokeStyle = '#4a9de8'; ctx.stroke(); }
function closedEye(ctx, x, y, r, up = true) { ctx.beginPath(); ctx.moveTo(x - r, y); ctx.quadraticCurveTo(x, y + (up ? -r : r) * 0.9, x + r, y); ctx.lineWidth = 1.8; ctx.strokeStyle = INK; ctx.lineCap = 'round'; ctx.stroke(); }
function blushes(ctx, a = 0.5) { ctx.beginPath(); ctx.ellipse(-12, 5, 3, 1.8, 0, 0, 7); ctx.ellipse(12, 5, 3, 1.8, 0, 0, 7); ctx.fillStyle = `rgba(255,120,140,${a})`; ctx.fill(); }
export const COOKIE_FACES = ['happy', 'content', 'worried', 'nervous', 'sad', 'crying', 'screaming', 'pleading', 'fainted', 'ouch'];
export function drawCookieFace(ctx, face, t) {
  const by = Math.sin(t * 2) * 0.8; const blink = (t % 4) < 0.12;
  ctx.lineCap = 'round';
  switch (face) {
    case 'happy': // ^ ^ big smile
      closedEye(ctx, -7, -1 + by, 3.4, true); closedEye(ctx, 7, -1 + by, 3.4, true);
      ctx.beginPath(); ctx.moveTo(-5, 4 + by); ctx.quadraticCurveTo(0, 11 + by, 5, 4 + by); ctx.closePath(); ctx.fillStyle = '#7a3040'; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = INK; ctx.stroke();
      ctx.beginPath(); ctx.ellipse(0, 7.6 + by, 2.4, 1.3, 0, 0, 7); ctx.fillStyle = '#ff8fa0'; ctx.fill();
      blushes(ctx, 0.6); break;
    case 'content':
      eye(ctx, -7, -2 + by, 3.2, 0.2, blink); eye(ctx, 7, -2 + by, 3.2, 0.2, blink);
      ctx.beginPath(); ctx.arc(0, 4 + by, 4, 0.25, Math.PI - 0.25); ctx.lineWidth = 1.8; ctx.strokeStyle = INK; ctx.stroke();
      blushes(ctx, 0.5); break;
    case 'worried':
      eye(ctx, -7, -2 + by, 3.3, 0, blink); eye(ctx, 7, -2 + by, 3.3, 0, blink);
      brow(ctx, -7, -8 + by, 0.35); brow(ctx, 7, -8 + by, -0.35);
      ctx.beginPath(); ctx.moveTo(-4, 7 + by); ctx.quadraticCurveTo(-2, 5 + by, 0, 7 + by); ctx.quadraticCurveTo(2, 9 + by, 4, 7 + by); ctx.lineWidth = 1.7; ctx.strokeStyle = INK; ctx.stroke();
      blushes(ctx, 0.4); break;
    case 'nervous': { // side glance + sweat drop
      const look = Math.sin(t * 3) > 0 ? 0.8 : -0.8;
      eye(ctx, -7, -2 + by, 3.4, look); eye(ctx, 7, -2 + by, 3.4, look);
      brow(ctx, -7, -8 + by, 0.4); brow(ctx, 7, -8 + by, -0.4);
      ctx.beginPath(); ctx.moveTo(-4, 7 + by); for (let k = 1; k <= 4; k++) ctx.lineTo(-4 + k * 2, 7 + by + (k % 2 ? -1.4 : 0)); ctx.lineWidth = 1.6; ctx.strokeStyle = INK; ctx.stroke();
      tear(ctx, 15, -10 + Math.sin(t * 4) * 0.8, 1.1); blushes(ctx, 0.35); break;
    }
    case 'sad':
      eye(ctx, -7, -1 + by, 3.2, 0); eye(ctx, 7, -1 + by, 3.2, 0);
      brow(ctx, -7, -7 + by, 0.5); brow(ctx, 7, -7 + by, -0.5);
      ctx.beginPath(); ctx.arc(0, 10 + by, 4, Math.PI + 0.35, -0.35); ctx.lineWidth = 1.8; ctx.strokeStyle = INK; ctx.stroke();
      tear(ctx, -9, 4 + by, 0.8); blushes(ctx, 0.3); break;
    case 'crying': { // closed eyes, streaming tears, wobbly open mouth
      closedEye(ctx, -7, -1 + by, 3.4, false); closedEye(ctx, 7, -1 + by, 3.4, false);
      brow(ctx, -7, -7 + by, 0.55); brow(ctx, 7, -7 + by, -0.55);
      for (const sx of [-1, 1]) for (let k = 0; k < 2; k++) { const p = (t * 1.4 + k * 0.5) % 1; ctx.globalAlpha = 1 - p * 0.6; tear(ctx, sx * (9 + p * 2), 2 + p * 14 + by, 0.85); ctx.globalAlpha = 1; }
      ctx.beginPath(); ctx.ellipse(0, 8 + by, 4.2, 3 + Math.sin(t * 9) * 0.6, 0, 0, 7); ctx.fillStyle = '#7a3040'; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = INK; ctx.stroke();
      blushes(ctx, 0.45); break;
    }
    case 'screaming': { // cartoon "AAAH!" - wide eyes, big round mouth, little shake
      const sh = Math.sin(t * 40) * 0.8;
      ctx.save(); ctx.translate(sh, 0);
      for (const sx of [-7, 7]) { ctx.beginPath(); ctx.ellipse(sx, -3, 3.8, 4.4, 0, 0, 7); ctx.fillStyle = '#fff'; ctx.fill(); ctx.lineWidth = 1.5; ctx.strokeStyle = INK; ctx.stroke(); ctx.beginPath(); ctx.arc(sx, -3, 1.5, 0, 7); ctx.fillStyle = '#2b1d28'; ctx.fill(); }
      brow(ctx, -7, -10, -0.25); brow(ctx, 7, -10, 0.25);
      ctx.beginPath(); ctx.ellipse(0, 8, 5, 6, 0, 0, 7); ctx.fillStyle = '#7a3040'; ctx.fill(); ctx.lineWidth = 1.6; ctx.strokeStyle = INK; ctx.stroke();
      ctx.beginPath(); ctx.ellipse(0, 11, 3, 2, 0, 0, 7); ctx.fillStyle = '#ff8fa0'; ctx.fill();
      ctx.restore();
      ctx.font = `bold 8px ${FONT}`; ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillStyle = '#e0607e';
      ctx.fillText('!', 21 + Math.sin(t * 8), -18); ctx.fillText('!', -21 - Math.sin(t * 8), -16);
      break;
    }
    case 'pleading': { // big shiny puppy eyes, tiny wobbly mouth, "pls"
      for (const sx of [-7, 7]) {
        ctx.beginPath(); ctx.ellipse(sx, -2 + by, 4.4, 4.8, 0, 0, 7); ctx.fillStyle = '#2b1d28'; ctx.fill(); ctx.lineWidth = 1.4; ctx.strokeStyle = INK; ctx.stroke();
        ctx.beginPath(); ctx.arc(sx - 1.4, -3.6 + by, 1.8, 0, 7); ctx.arc(sx + 1.6, 0 + by, 0.9, 0, 7); ctx.fillStyle = '#fff'; ctx.fill();
        ctx.beginPath(); ctx.ellipse(sx, 2 + by, 3.6, 1.1, 0, 0, Math.PI); ctx.fillStyle = 'rgba(159,220,255,0.9)'; ctx.fill();
      }
      brow(ctx, -7, -9 + by, 0.5, 3); brow(ctx, 7, -9 + by, -0.5, 3);
      ctx.beginPath(); ctx.moveTo(-2.5, 8 + by); ctx.quadraticCurveTo(0, 6.5 + by, 2.5, 8 + by); ctx.lineWidth = 1.6; ctx.strokeStyle = INK; ctx.stroke();
      blushes(ctx, 0.65); break;
    }
    case 'fainted': // swirly eyes, little tongue, floating stars
      for (const sx of [-7, 7]) { ctx.beginPath(); for (let k = 0; k <= 24; k++) { const a = k / 24 * Math.PI * 4 + t * 3; const rr2 = k / 24 * 3.6; ctx.lineTo(sx + Math.cos(a) * rr2, -2 + Math.sin(a) * rr2); } ctx.lineWidth = 1.4; ctx.strokeStyle = INK; ctx.stroke(); }
      ctx.beginPath(); ctx.arc(0, 6, 3.5, 0.2, Math.PI - 0.2); ctx.lineWidth = 1.6; ctx.strokeStyle = INK; ctx.stroke();
      ctx.beginPath(); ctx.ellipse(1.5, 9, 1.8, 2.2, 0.2, 0, 7); ctx.fillStyle = '#ff8fa0'; ctx.fill();
      for (let k = 0; k < 3; k++) { const a = t * 2 + k * 2.1; starShape(ctx, Math.cos(a) * 14, -22 + Math.sin(a) * 4, 2.8, '#ffe36e', 1); }
      break;
    case 'ouch': // a bite just got taken: squeezed eyes > <, wavy mouth
      ctx.beginPath(); ctx.moveTo(-10, -5); ctx.lineTo(-5, -2); ctx.lineTo(-10, 1); ctx.moveTo(10, -5); ctx.lineTo(5, -2); ctx.lineTo(10, 1); ctx.lineWidth = 1.9; ctx.strokeStyle = INK; ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-4, 7); ctx.quadraticCurveTo(-2, 4, 0, 7); ctx.quadraticCurveTo(2, 10, 4, 7); ctx.lineWidth = 1.8; ctx.stroke();
      blushes(ctx, 0.7); break;
  }
}

// ---------------- NEST ----------------
export function drawNest(ctx, x, y, t) {
  ctx.save(); ctx.translate(x, y);
  shadow(ctx, 0, 12, 30, 8, 0.2);
  ctx.beginPath(); ctx.moveTo(-30, 12); ctx.quadraticCurveTo(-24, -14, 0, -16); ctx.quadraticCurveTo(24, -14, 30, 12); ctx.closePath();
  const g = ctx.createLinearGradient(0, -16, 0, 12); g.addColorStop(0, '#d9a77a'); g.addColorStop(1, '#a8754e');
  ctx.fillStyle = g; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = INK; ctx.stroke();
  ctx.fillStyle = '#c08a5e'; for (const [a, b] of [[-15, 2], [12, -4], [18, 6], [-6, -8]]) { ctx.beginPath(); ctx.arc(a, b, 2, 0, 7); ctx.fill(); }
  ctx.beginPath(); ctx.ellipse(0, 4, 10, 7, 0, 0, 7); ctx.fillStyle = '#3c2630'; ctx.fill(); ctx.lineWidth = 2; ctx.stroke();
  // tiny flag
  ctx.beginPath(); ctx.moveTo(14, -10); ctx.lineTo(14, -30); ctx.lineWidth = 2; ctx.strokeStyle = INK; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(14, -30); ctx.quadraticCurveTo(22, -28 + Math.sin(t * 4) * 2, 28, -26); ctx.lineTo(14, -22); ctx.closePath(); ctx.fillStyle = '#ff7a8a'; ctx.fill(); ctx.lineWidth = 1.6; ctx.stroke();
  ctx.restore();
}

// ---------------- MAP BACKGROUND ----------------
export const THEMES = [
  { name: 'gingham', a: '#f7d3ca', b: '#f1c7bd', check: 'rgba(222,112,122,0.10)', grout: 'rgba(200,160,130,0.18)', trail: '#fff8ec', edge: '#d9a08c', dot: '#e7a3a3' },
  { name: 'wood', a: '#ead1a8', b: '#e1c49b', grain: 'rgba(120,80,40,0.16)', grout: 'rgba(120,80,45,0.3)', trail: '#fffaf0', edge: '#c49766', dot: '#c9a074' },
  { name: 'midnight', a: '#d2cbee', b: '#c7bfe7', grout: 'rgba(120,110,175,0.3)', trail: '#fffaf2', edge: '#a89fd8', dot: '#b9aee6', moon: true },
  { name: 'picnic', a: '#c9e6b2', b: '#bddca3', check: 'rgba(80,160,100,0.19)', grout: 'rgba(100,150,90,0.2)', trail: '#fffdf2', edge: '#98c283', dot: '#a6d18c' },
  // v0.7.7 world 3 (Crumb Design palettes-W3-W10.json, the first three): butter, blueberry, crust. Checked by the A1-A7/A10 contrast pass on every W3 map.
  { name: 'W3 butter', a: '#ecd37f', b: '#e5c974', grout: 'rgba(160,130,50,0.25)', trail: '#fffaf0', edge: '#c9a64f', dot: '#d9bb60' },
  { name: 'W3 blueberry', a: '#bcd5ef', b: '#b0cbea', check: 'rgba(90,130,200,0.14)', grout: 'rgba(90,120,170,0.22)', trail: '#fffaf2', edge: '#86a9d6', dot: '#9dbde4' },
  { name: 'W3 crust', a: '#e4bf92', b: '#deb88a', grain: 'rgba(130,80,40,0.14)', grout: 'rgba(130,85,45,0.28)', trail: '#fffaf0', edge: '#b98a57', dot: '#c99c6a' },
  // v0.7.9 world 4 (Crumb Design w4-paste.json artThemes_add index 7): mint. Contrast A1/A2/A3 on all ten W4 maps in qa/v0.7.9/contrast.
  { name: 'W4 mint', a: '#b6e4d6', b: '#abdccd', check: 'rgba(60,170,150,0.14)', grout: 'rgba(70,150,130,0.22)', trail: '#fffdf5', edge: '#80c3b0', dot: '#98d3c2' },
];
export function renderMapBackground(routes, theme, w, h, dpr, props = []) {
  if (!Array.isArray(routes)) routes = [routes];
  const cv = makeCanvas(Math.ceil(w * dpr), Math.ceil(h * dpr));
  const g = cv.getContext('2d'); g.scale(dpr, dpr);
  const th = THEMES[theme % THEMES.length];
  let seed = 7 + theme * 13; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  // base surface
  for (let c = 0; c < C.GRID_COLS; c++) for (let r = 0; r < C.GRID_ROWS; r++) { g.fillStyle = (c + r) % 2 ? th.a : th.b; g.fillRect(c * C.TILE, r * C.TILE, C.TILE, C.TILE); }
  if (th.check) {
    // woven tablecloth: translucent stripes both ways
    g.fillStyle = th.check;
    for (let x = 0; x < w; x += 40) g.fillRect(x + 10, 0, 20, h);
    for (let y = 0; y < h; y += 40) g.fillRect(0, y + 10, w, 20);
  } else if (th.grain) {
    // wooden planks with grain and knots
    for (let x = 0; x < w; x += 80) { g.fillStyle = (x / 80) % 2 ? 'rgba(255,255,255,0.08)' : 'rgba(120,80,40,0.05)'; g.fillRect(x, 0, 80, h); g.fillStyle = 'rgba(110,70,40,0.35)'; g.fillRect(x, 0, 1.5, h); }
    g.strokeStyle = th.grain; g.lineWidth = 1.2;
    for (let k = 0; k < 40; k++) { const x = rnd() * w; g.beginPath(); g.moveTo(x, 0); for (let y = 0; y <= h; y += 20) g.lineTo(x + Math.sin(y * 0.02 + k) * 4, y); g.stroke(); }
    for (let k = 0; k < 5; k++) { const x = rnd() * w, y = rnd() * h; g.beginPath(); g.ellipse(x, y, 5, 3, 0, 0, 7); g.lineWidth = 1.5; g.stroke(); }
  } else {
    g.strokeStyle = th.grout; g.lineWidth = 1.5;
    for (let c = 1; c < C.GRID_COLS; c++) { g.beginPath(); g.moveTo(c * C.TILE, 0); g.lineTo(c * C.TILE, h); g.stroke(); }
    for (let r = 1; r < C.GRID_ROWS; r++) { g.beginPath(); g.moveTo(0, r * C.TILE); g.lineTo(w, r * C.TILE); g.stroke(); }
    for (let k = 0; k < 30; k++) { g.fillStyle = 'rgba(255,255,255,0.25)'; g.fillRect(Math.floor(rnd() * 10) * 40 + 3, Math.floor(rnd() * 12) * 40 + 3, 12, 3); }
  }
  if (th.moon) { const mg = g.createRadialGradient(w * 0.85, -20, 10, w * 0.85, -20, 300); mg.addColorStop(0, 'rgba(255,255,230,0.45)'); mg.addColorStop(1, 'rgba(255,255,230,0)'); g.fillStyle = mg; g.fillRect(0, 0, w, h); }
  // little printed flowers / dots
  for (let k = 0; k < 10; k++) {
    const x = rnd() * w, y = rnd() * h;
    g.globalAlpha = 0.5; g.fillStyle = th.dot;
    for (let p = 0; p < 5; p++) { const a = p * Math.PI * 2 / 5; g.beginPath(); g.arc(x + Math.cos(a) * 3, y + Math.sin(a) * 3, 2.2, 0, 7); g.fill(); }
    g.fillStyle = '#fff'; g.beginPath(); g.arc(x, y, 1.6, 0, 7); g.fill(); g.globalAlpha = 1;
  }
  // trail(s): drop shadow, outline, body, stitched border
  const strokeAll = (lw, col, dash) => {
    for (const path of routes) {
      const pts = path.pts;
      g.beginPath(); g.moveTo(pts[0].x, pts[0].y); for (const p of pts.slice(1)) g.lineTo(p.x, p.y);
      g.lineWidth = lw; g.strokeStyle = col; g.lineJoin = 'round'; g.lineCap = 'round'; g.setLineDash(dash || []); g.stroke(); g.setLineDash([]);
    }
  };
  // v0.7.5 C18: cast shadow (falls down), INK outline, lip (darker, 1.5 px lower), edge, body. No dashed stitching.
  g.save(); g.translate(0, 5); strokeAll(40, 'rgba(70,35,50,0.26)'); g.restore();
  strokeAll(36, INK);
  g.save(); g.translate(0, 1.5); strokeAll(32, shade(th.edge, -0.28)); g.restore();
  strokeAll(30, th.edge); strokeAll(25, th.trail);
  // ant footprints and sprinkled crumbs along the trail
  for (const path of routes) {
    for (let d = 14; d < path.length; d += 15) {
      const p = path.at(d); const side = (Math.floor(d / 15) % 2 ? 1 : -1) * 4;
      g.fillStyle = 'rgba(160,110,80,0.22)'; g.beginPath(); g.arc(p.x + p.dy * side, p.y - p.dx * side, 1.3, 0, 7); g.fill();
    }
    for (let d = 20; d < path.length; d += 37) {
      const p = path.at(d); const o = (rnd() - 0.5) * 14;
      g.fillStyle = '#e8b878'; g.beginPath(); g.ellipse(p.x + p.dy * o, p.y - p.dx * o, 2, 1.5, rnd() * 3, 0, 7); g.fill();
    }
  }
  // grass tufts around the nest openings
  for (const path of routes) {
    const p = path.pts[0]; const nx = Math.max(30, Math.min(w - 30, p.x)), ny = Math.max(26, p.y + 6);
    for (let k = 0; k < 6; k++) { const a = Math.PI * (0.1 + k * 0.16); tuft(g, nx + Math.cos(a) * 36 * (k % 2 ? 1 : -1), ny + 10 + Math.sin(a) * 6, 0.8 + rnd() * 0.4); }
  }
  for (const pr of props) drawProp(g, pr.k, (pr.c + 0.5) * C.TILE, (pr.r + 0.5) * C.TILE);
  // soft vignette
  const vg = g.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.45, w / 2, h / 2, Math.max(w, h) * 0.75);
  vg.addColorStop(0, 'rgba(80,40,50,0)'); vg.addColorStop(1, 'rgba(80,40,50,0.18)');
  g.fillStyle = vg; g.fillRect(0, 0, w, h);
  { const ig = g.createLinearGradient(0, 0, 0, 12); ig.addColorStop(0, 'rgba(70,35,50,0.22)'); ig.addColorStop(1, 'rgba(70,35,50,0)'); g.fillStyle = ig; g.fillRect(0, 0, w, 12); } // v0.7.5 C18: inset top edge (the board sits below the HUD)
  return cv;
}
function tuft(g, x, y, s) {
  g.save(); g.translate(x, y); g.scale(s, s);
  for (const [a, l] of [[-0.5, 8], [0, 10], [0.5, 8]]) { g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(Math.sin(a) * 4, -l * 0.6, Math.sin(a) * 6, -l); g.lineWidth = 3.4; g.strokeStyle = INK; g.lineCap = 'round'; g.stroke(); g.lineWidth = 1.8; g.strokeStyle = '#8fd17d'; g.stroke(); }
  g.restore();
}
// kitchen props on blocked tiles (drawn into the cached background)
export function drawProp(g, kind, x, y) {
  g.save(); g.translate(x, y); g.lineJoin = 'round'; g.lineCap = 'round';
  shadow(g, 2, 13, 17, 5, 0.25);
  if (kind === 'mug') {
    g.beginPath(); g.arc(13, -2, 7, -1.4, 1.4); g.lineWidth = 6; g.strokeStyle = INK; g.stroke(); g.lineWidth = 3; g.strokeStyle = '#ff9fb2'; g.stroke();
    rr(g, -13, -14, 26, 27, 6); const gr = g.createLinearGradient(-13, 0, 13, 0); gr.addColorStop(0, '#ffc4cf'); gr.addColorStop(1, '#f28aa0'); g.fillStyle = gr; g.fill(); g.lineWidth = 2.4; g.strokeStyle = INK; g.stroke();
    g.beginPath(); g.ellipse(0, -14, 13, 4, 0, 0, 7); g.fillStyle = '#7a4a34'; g.fill(); g.lineWidth = 2.2; g.stroke();
    heart(g, 0, -1, 4, '#fff');
    g.globalAlpha = 0.5; g.strokeStyle = '#fff'; g.lineWidth = 2; for (const k of [-4, 3]) { g.beginPath(); g.moveTo(k, -20); g.quadraticCurveTo(k + 4, -25, k, -30); g.stroke(); }
  } else if (kind === 'sugar') {
    blob(g, 0, 2, 16, 11, '#cfe8ff', 2.4);
    g.beginPath(); g.ellipse(0, -6, 14, 5, 0, 0, 7); g.fillStyle = '#fffaf0'; g.fill(); g.lineWidth = 2; g.strokeStyle = INK; g.stroke();
    sugarCube(g, -4, -9, 4); sugarCube(g, 4, -10, 3.5);
    g.fillStyle = '#8fc2ef'; for (const k of [-8, 0, 8]) { g.beginPath(); g.arc(k, 5, 2, 0, 7); g.fill(); }
  } else if (kind === 'jam') {
    rr(g, -11, -10, 22, 23, 6); const gr = g.createLinearGradient(-11, 0, 11, 0); gr.addColorStop(0, '#ff7a8a'); gr.addColorStop(1, '#c9304a'); g.fillStyle = gr; g.fill(); g.lineWidth = 2.4; g.strokeStyle = INK; g.stroke();
    rr(g, -12, -16, 24, 8, 3); g.fillStyle = '#fff0f0'; g.fill(); g.stroke();
    g.fillStyle = '#ff9aa8'; for (let k = -10; k < 12; k += 5) { g.beginPath(); g.arc(k, -8, 2.4, 0, Math.PI); g.fill(); }
    rr(g, -7, -2, 14, 9, 3); g.fillStyle = '#fff6e8'; g.fill(); g.lineWidth = 1.4; g.stroke();
    g.beginPath(); g.ellipse(-5, -4, 2, 5, 0.2, 0, 7); g.fillStyle = 'rgba(255,255,255,0.5)'; g.fill();
  } else if (kind === 'spoon') {
    g.rotate(-0.6);
    rr(g, -2.5, -4, 5, 24, 2.5); g.fillStyle = '#d8dce8'; g.fill(); g.lineWidth = 2; g.strokeStyle = INK; g.stroke();
    blob(g, 0, -11, 8, 10, '#eef0f7', 2.2);
    g.beginPath(); g.ellipse(-2, -14, 2, 4, 0, 0, 7); g.fillStyle = '#fff'; g.fill();
  } else if (kind === 'plant') {
    for (const [a, l] of [[-0.8, 16], [-0.3, 20], [0.2, 19], [0.7, 15]]) { g.save(); g.translate(0, -6); g.rotate(a); g.beginPath(); g.ellipse(0, -l / 2, 5, l / 2, 0, 0, 7); g.fillStyle = '#8fd17d'; g.fill(); g.lineWidth = 2; g.strokeStyle = INK; g.stroke(); g.beginPath(); g.moveTo(0, 0); g.lineTo(0, -l + 3); g.lineWidth = 1; g.strokeStyle = '#5fa34e'; g.stroke(); g.restore(); }
    g.beginPath(); g.moveTo(-11, -4); g.lineTo(11, -4); g.lineTo(8, 13); g.lineTo(-8, 13); g.closePath(); g.fillStyle = '#e88a5c'; g.fill(); g.lineWidth = 2.4; g.strokeStyle = INK; g.stroke();
    rr(g, -12, -7, 24, 5, 2); g.fillStyle = '#f2a274'; g.fill(); g.stroke();
  }
  g.restore();
}

// ---------------- v0.7.2 C13: the cookie guard - a cute fly swatter (code-drawn) ----------------
// Pivot (0,0) = the bottom of the handle; the swatter points up (-y). ang: rotation in radians (+ = clockwise).
// Pink frame (#ff9fb6), cream mesh with two dot eyes, wooden handle (#d9a066), INK outline. No slingshot fork, no elastic.
// v0.7.4 P: where the swatter head's centre is for a pivot / angle / scale (the head is 55 design px up the handle axis)
export function swatHead(px, py, ang, sc = 0.8) { const L = 55 * sc; return { x: px + L * Math.sin(ang), y: py - L * Math.cos(ang) }; }
export function drawSwatter(ctx, x, y, ang = 0, sc = 1, flash = 0) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(ang); ctx.scale(sc, sc);
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  shadow(ctx, 0, 2, 9, 3, 0.22);
  // handle
  rr(ctx, -3.2, -34, 6.4, 34, 3.2); ctx.fillStyle = '#d9a066'; ctx.fill(); ctx.lineWidth = 2.2; ctx.strokeStyle = INK; ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-1, -6); ctx.lineTo(-1, -28); ctx.lineWidth = 1.4; ctx.strokeStyle = 'rgba(255,240,210,0.55)'; ctx.stroke();
  ctx.beginPath(); ctx.arc(0, -2.5, 1.7, 0, 7); ctx.fillStyle = '#b97f48'; ctx.fill(); // the hanging-hole at the grip end
  // head: pink frame, cream mesh
  const hx = -15, hy = -78, hw = 30, hh = 46;
  rr(ctx, hx, hy, hw, hh, 12); ctx.fillStyle = '#ff9fb6'; ctx.fill(); ctx.lineWidth = 2.6; ctx.strokeStyle = INK; ctx.stroke();
  rr(ctx, hx + 4, hy + 4, hw - 8, hh - 8, 8); ctx.fillStyle = '#fff6ee'; ctx.fill(); ctx.lineWidth = 1.6; ctx.strokeStyle = INK; ctx.stroke();
  ctx.save(); rr(ctx, hx + 4, hy + 4, hw - 8, hh - 8, 8); ctx.clip();
  ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(255,159,182,0.75)';
  for (let k = 1; k < 4; k++) { ctx.beginPath(); ctx.moveTo(hx + 4 + k * 5.5, hy + 4); ctx.lineTo(hx + 4 + k * 5.5, hy + hh - 4); ctx.stroke(); }
  for (let k = 1; k < 6; k++) { ctx.beginPath(); ctx.moveTo(hx + 4, hy + 4 + k * 6); ctx.lineTo(hx + hw - 4, hy + 4 + k * 6); ctx.stroke(); }
  ctx.restore();
  // two dot eyes (cute)
  ctx.fillStyle = INK; ctx.beginPath(); ctx.arc(-4.6, hy + 20, 2.3, 0, 7); ctx.arc(4.6, hy + 20, 2.3, 0, 7); ctx.fill();
  ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(-5.3, hy + 19.2, 0.8, 0, 7); ctx.arc(3.9, hy + 19.2, 0.8, 0, 7); ctx.fill();
  // cheeks
  ctx.fillStyle = 'rgba(255,111,145,0.45)'; ctx.beginPath(); ctx.ellipse(-8.6, hy + 25, 2.6, 1.7, 0, 0, 7); ctx.ellipse(8.6, hy + 25, 2.6, 1.7, 0, 0, 7); ctx.fill();
  if (flash > 0) { rr(ctx, hx, hy, hw, hh, 12); ctx.globalAlpha = flash * 0.7; ctx.fillStyle = '#fff'; ctx.fill(); }
  ctx.restore();
}
