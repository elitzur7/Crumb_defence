// Crumb Defense - wave preview + "Ants left" (v0.7.4 M3). Pure data/layout helpers (no DOM) so they can be unit-tested; game.js draws the strip.
import * as C from './config.js';

export const STRIP_H = 22, STRIP_Y = 4, STRIP_MAX_TYPES = 4, TANK_HP = 40;

// the ants of one wave grouped by type, biggest group first (ties keep the wave's own order); `more` = what did not fit in `max` groups
export function waveGroups(wave, max = STRIP_MAX_TYPES) {
  const m = new Map();
  for (const e of wave) m.set(e.type, (m.get(e.type) || 0) + 1);
  const all = [...m.entries()].map(([type, count], i) => ({ type, count, i })).sort((a, b) => b.count - a.count || a.i - b.i).map(({ type, count }) => ({ type, count }));
  const groups = all.slice(0, max), rest = all.slice(max);
  return { groups, moreTypes: rest.length, moreAnts: rest.reduce((s, g) => s + g.count, 0), total: wave.length };
}
export const isTank = (type) => C.ANTS[type].hp >= TANK_HP;
export const isFlyer = (type) => !!C.ANTS[type].flying;

// what the strip shows right now: { kind: 'next', ...waveGroups } between waves (also before wave 1) | { kind: 'left', left } after the last wave has started | null
export function previewModel(b) {
  if (b.result) return null;
  if (b.nextWave >= b.waves.length) return { kind: 'left', left: antsLeft(b) };
  if (b.pending.length > 0) return null;           // a wave is spawning
  return { kind: 'next', n: b.nextWave + 1, ...waveGroups(b.waves[b.nextWave]) };
}
// alive + not yet spawned
export function antsLeft(b) { return b.ants.filter((a) => !a.dead).length + b.pending.length; }

// the free horizontal span(s) of the top band of the map (design px, map coordinates), given the tiles / towers / nest / cookie the band must not cover
export function nestPoints(b) {
  const nests = [];
  for (const rt of b.routes) { const q = rt.pts[0]; if (!nests.some((n) => Math.hypot(n.x - q.x, n.y - q.y) < 5)) nests.push(q); }
  const W = C.GRID_COLS * C.TILE, Hh = C.GRID_ROWS * C.TILE;
  return nests.map((q) => ({ x: Math.max(30, Math.min(W - 30, q.x)), y: Math.max(26, Math.min(Hh - 20, q.y + 6)) })); // exactly where game.js draws the nests
}
export function cookiePoints(b) { const pts = b.path.pts; return [pts[pts.length - 1]]; }
export function blockedSpans(b, y0 = STRIP_Y, h = STRIP_H) {
  const W = C.GRID_COLS * C.TILE, out = [], y1 = y0 + h;
  const row0 = Math.floor(y0 / C.TILE), row1 = Math.floor((y1 - 1) / C.TILE);
  for (let r = row0; r <= row1; r++) for (let c = 0; c < C.GRID_COLS; c++) if (b.isPathTile(c, r)) out.push([c * C.TILE - 6, (c + 1) * C.TILE + 6, 'trail']);
  for (const n of nestPoints(b)) if (n.y + 22 > y0 && n.y - 34 < y1) out.push([n.x - 36, n.x + 36, 'nest']);   // body +-30, flag 28 px up; 22 px of base + shadow below
  for (const t of b.towers || []) if (t.r >= row0 && t.r <= row1) out.push([t.x - 24, t.x + 24, 'tower']); // v0.7.5 (review finding 1): the strip never covers a tower built in the top row (the head draws ~16 px above its tile centre)
  for (const q of cookiePoints(b)) if (q.y + 34 > y0 && q.y - 34 < y1) out.push([q.x - 36, q.x + 36, 'cookie']);
  return out.sort((a, c) => a[0] - c[0]).map(([a, c, k]) => [Math.max(0, a), Math.min(W, c), k]);
}
export function freeSpans(b, y0 = STRIP_Y, h = STRIP_H, margin = 4) {
  const W = C.GRID_COLS * C.TILE, spans = []; let x = margin;
  for (const [a, c] of blockedSpans(b, y0, h)) { if (a - margin > x) spans.push([x, a - margin]); x = Math.max(x, c + margin); }
  if (W - margin > x) spans.push([x, W - margin]);
  return spans;
}
// {x, y, w, h} of a strip `w` px wide: centred in the widest free span (the one nearest the middle of the map on a tie); w is clamped to the span. null when nothing fits (>= 60 px)
export function stripRect(b, w, y0 = STRIP_Y, h = STRIP_H) {
  const W = C.GRID_COLS * C.TILE, spans = freeSpans(b, y0, h).filter(([a, c]) => c - a >= 60);
  if (!spans.length) return null;
  spans.sort((p, q) => (q[1] - q[0]) - (p[1] - p[0]) || Math.abs((p[0] + p[1]) / 2 - W / 2) - Math.abs((q[0] + q[1]) / 2 - W / 2));
  const [a, c] = spans[0], ww = Math.min(w, c - a);
  return { x: a + (c - a - ww) / 2, y: y0, w: ww, h };
}
