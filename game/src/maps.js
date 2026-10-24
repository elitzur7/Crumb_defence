// =====================================================================
//  CRUMB DEFENSE - MAPS. v0.5 item 15: the map layouts live in tuning/tuning.json "maps" (source of truth); this file parses them.
//  Grid is 10 columns x 12 rows (one string per row, top to bottom). Legend:
//    N  ant nest (1 or 2; on an edge the ants walk in from outside)   C  the cookie (exactly 1)
//    #  trail                                                          +  trail crossing (ants go straight through)
//    .  free counter (towers can be built)                             M mug  B sugar bowl  J jam jar  S spoon  P plant  (props: blocked)
//  Routes are found automatically: every way from each nest to the cookie (forks and merges allowed). Ants alternate routes.
//  Alternatively give `path: [[col,row], ...]` waypoints (tile centres) and `props: [{ k: 'mug', c, r }]`.
//  theme: 0 breakfast gingham, 1 baking-table wood, 2 midnight tiles, 3 picnic blanket.
// =====================================================================
export const PROP_KINDS = { M: 'mug', B: 'sugar', J: 'jam', S: 'spoon', P: 'plant' };

import TUNING from '../../tuning/tuning.json' with { type: 'json' };
export const MAPS = JSON.parse(JSON.stringify(TUNING.maps));

const DIRS = [[1, 0], [0, 1], [-1, 0], [0, -1]];

// Parse one map into { routes: [[ [c,r], ... waypoints ]], props: [{k,c,r}], nests: n }
export function parseMap(m, cols = 10, rows = 12) {
  if (m.path) return { routes: [m.path], props: m.props || [], errors: [] };
  const errors = [];
  const g = m.grid;
  if (!g || g.length !== rows || g.some((row) => row.length !== cols)) errors.push(`grid must be ${rows} rows of ${cols} chars`);
  const at = (c, r) => (c < 0 || r < 0 || c >= cols || r >= rows ? ' ' : g[r][c]);
  const nests = [], props = []; let cookie = null;
  for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
    const ch = at(c, r);
    if (ch === 'N') nests.push([c, r]);
    else if (ch === 'C') { if (cookie) errors.push('more than one cookie'); cookie = [c, r]; }
    else if (PROP_KINDS[ch]) props.push({ k: PROP_KINDS[ch], c, r });
    else if (!'.#+'.includes(ch)) errors.push(`unknown char '${ch}' at ${c},${r}`);
  }
  if (!nests.length) errors.push('no nest N'); if (nests.length > 2) errors.push('max 2 nests');
  if (!cookie) errors.push('no cookie C');
  const walk = (ch) => ch === '#' || ch === '+' || ch === 'C';
  const routes = [];
  if (!errors.length) for (const n of nests) {
    // depth-first search for every simple route; '+' may be visited twice and must be crossed straight
    const found = [];
    const visit = (c, r, dir, seen, acc) => {
      if (found.length > 8) return;
      if (at(c, r) === 'C') { found.push(acc.slice()); return; }
      const cand = at(c, r) === '+' && dir != null ? [dir] : [0, 1, 2, 3];
      for (const k of cand) {
        const nc = c + DIRS[k][0], nr = r + DIRS[k][1], ch = at(nc, nr);
        if (!walk(ch)) continue;
        const key = nc + ',' + nr; const times = seen.get(key) || 0;
        if (times >= (ch === '+' ? 2 : 1)) continue;
        seen.set(key, times + 1); acc.push([nc, nr]);
        visit(nc, nr, k, seen, acc);
        acc.pop(); seen.set(key, times);
      }
    };
    visit(n[0], n[1], null, new Map([[n[0] + ',' + n[1], 1]]), [n]);
    if (!found.length) errors.push(`nest at ${n} does not reach the cookie`);
    for (const tiles of found) {
      // ants walk in from outside when the nest sits on the edge
      const [c0, r0] = tiles[0]; const pre = r0 === 0 ? [c0, -0.6] : c0 === 0 ? [-0.6, r0] : c0 === cols - 1 ? [cols - 0.4, r0] : r0 === rows - 1 ? [c0, rows - 0.4] : null;
      const pts = pre ? [pre, ...tiles] : tiles;
      routes.push(compress(pts));
    }
  }
  return { routes, props, errors };
}
function compress(pts) {
  const out = [pts[0]];
  for (let i = 1; i < pts.length - 1; i++) {
    const a = out[out.length - 1], b = pts[i], c = pts[i + 1];
    const d1 = [Math.sign(b[0] - a[0]), Math.sign(b[1] - a[1])], d2 = [Math.sign(c[0] - b[0]), Math.sign(c[1] - b[1])];
    if (d1[0] !== d2[0] || d1[1] !== d2[1]) out.push(b);
  }
  out.push(pts[pts.length - 1]);
  return out;
}

// Validation used by tests and `npm run maps`
export function validateMap(id, m, cols = 10, rows = 12) {
  const p = parseMap(m, cols, rows); const errs = p.errors.map((e) => `${id}: ${e}`);
  if (!p.routes.length) errs.push(`${id}: no route`);
  const end = p.routes[0] && p.routes[0][p.routes[0].length - 1];
  for (const rt of p.routes) {
    const last = rt[rt.length - 1];
    if (end && (last[0] !== end[0] || last[1] !== end[1])) errs.push(`${id}: routes end on different cookies`);
    for (let i = 1; i < rt.length; i++) if (rt[i][0] !== rt[i - 1][0] && rt[i][1] !== rt[i - 1][1]) errs.push(`${id}: diagonal segment ${rt[i - 1]} -> ${rt[i]}`);
    for (const [c, r] of rt.slice(1)) if (c < 0 || r < 0 || c >= cols || r >= rows) errs.push(`${id}: point ${c},${r} out of bounds`);
  }
  for (const pr of p.props) if (p.routes.some((rt) => onRoute(rt, pr.c, pr.r))) errs.push(`${id}: prop ${pr.k} on the trail`);
  return errs;
}
function onRoute(rt, c, r) {
  for (let i = 1; i < rt.length; i++) {
    const [a, b] = [rt[i - 1], rt[i]];
    if (a[0] === b[0] && c === a[0] && r >= Math.min(a[1], b[1]) && r <= Math.max(a[1], b[1])) return true;
    if (a[1] === b[1] && r === a[1] && c >= Math.min(a[0], b[0]) && c <= Math.max(a[0], b[0])) return true;
  }
  return false;
}
