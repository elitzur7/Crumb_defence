// Floating-text helper: merges duplicates and caps how many are alive, so texts never pile up.
export const FLOAT_TEXT = { mergeRadius: 60, maxAlive: 10, perKeyMax: { queen: 1, immune: 2 } };

/**
 * Adds a floating text to `list` (array of fx objects with k === 'txt').
 * item: { key, n, fmt(n) -> string, x, y, col, life }
 * - same key nearby (and not fading out yet) -> counts are summed into the existing text and it is refreshed
 * - keys listed in perKeyMax are limited to that many alive texts
 * - never more than maxAlive texts at once (the oldest is dropped)
 * Returns the fx object that now shows the text.
 */
export function addFloatText(list, item, cfg = FLOAT_TEXT) {
  const kind = item.k || 'txt';
  const texts = list.filter((f) => f.k === kind && f.life > 0);
  const same = texts.filter((f) => f.key === item.key);
  const near = same.find((f) => Math.hypot(f.x - item.x, f.y0 - item.y) <= cfg.mergeRadius && f.life > f.max * 0.35);
  if (near) {
    near.n += item.n || 0; near.s = item.fmt(near.n); near.life = near.max;
    return near;
  }
  const lim = cfg.perKeyMax[item.key];
  if (lim != null && same.length >= lim) { const f = same[same.length - 1]; f.life = f.max; return f; }
  if (texts.length >= cfg.maxAlive) { const i = list.indexOf(texts[0]); if (i >= 0) list.splice(i, 1); }
  const f = { k: kind, key: item.key, n: item.n || 0, s: item.fmt(item.n || 0), x: item.x, y: item.y, y0: item.y, col: item.col, life: item.life || 1, max: item.life || 1 };
  list.push(f);
  return f;
}
