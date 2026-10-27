// Pure, deterministic battle simulation. No DOM. Used by the game, tests and headless bot.
import * as C from './config.js';
import { parseMap } from './maps.js';

export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ---------- damage / economy helpers (exported for tests) ----------
export function applyArmor(dmg, armor, ignoreArmor = false) {
  if (ignoreArmor) return dmg;
  return Math.max(1, dmg - armor);
}
export function cardCost(cardsPlayed, cfg = C.BATTLE) {
  return cfg.firstCardCost + cardsPlayed * cfg.cardCostStep;
}
export function starsFor(foodLeft, foodHP = C.BATTLE.foodHP, table = C.STARS) {
  const pct = (foodLeft / foodHP) * 100;
  for (const s of table) if (pct >= s.minPct - 1e-9) return s.stars;
  return 0;
}
const LOWEST_HP = new Set(['slingshot', 'laser', 'zapper', 'lizard']);
// v0.7.4 M1: the single-target towers (Slingshot, Laser, Zapper's first zap, Gecko) have a target mode, per tower, default 'weak' (= v0.7.3 behaviour exactly).
//   weak    fewest HP left (tie -> the ant nearest the cookie)
//   carrier ants walking home with food first (the one nearest the nest = highest threat); none in range -> weak
//   front   ants walking in, the one nearest the cookie first (highest threat); carriers only when no walker is in range
export const TARGET_MODES = ['weak', 'carrier', 'front'];
export function hasTargetModes(type) { return LOWEST_HP.has(type); }
export function nextTargetMode(mode) { return TARGET_MODES[(TARGET_MODES.indexOf(mode) + 1) % TARGET_MODES.length]; }
export function onTile(a, c, r) { return Math.floor(a.x / C.TILE) === c && Math.floor(a.y / C.TILE) === r; }
// v0.6 item 6: a Tractor lifting `lift` size classes can lift this ant (never a queen, never a flyer in the air)
export function liftable(a, lift) {
  const A = C.ANTS[a.type];
  return !A.boss && !a.flying && (C.SIZE_RANK[A.sizeClass] || 9) <= lift;
}
export function canHit(targets, flying) {
  return targets === 'both' || (targets === 'air') === !!flying;
}
// v0.7 D-T6: total damage of a tower at in-battle level `lvl` vs. the same tower at level 1 (power x rate):
// x2 / x3 / x4 / x5 / x6 for the damage towers (Gate 6.05 at L6; Laser 1.7 / 2.4 / 3.1 / 4.5 / 6.3). 0 for towers without damage
// upgrades (Fan, Glue, Perfume, Tractor). Shown as "x2 dmg" on the tower panel and the upgrade pop-up.
export function worldCardLevelCap(levelIndex) { const L = C.LEVELS[levelIndex]; const w = L && C.WORLDS.find((x) => x.id === L.world); return (w && w.cardLevelCap) || null; }
export const DAMAGE_UPGRADE_TOWERS = ['slingshot', 'spray', 'sound', 'ball', 'lizard', 'laser', 'zapper', 'gate', 'lava'];
export function upgradeGain(type, lvl, cardLevel = 1) {
  if (!DAMAGE_UPGRADE_TOWERS.includes(type)) return 0;
  const dps = (L) => towerStat(type, 'power', L, cardLevel) * (towerStat(type, 'rate', L, cardLevel) || 1)
    * (type === 'laser' ? 1 + (towerStat(type, 'heatMax', L, cardLevel) || 0) : 1); // Laser: at full heat
  const base = dps(1); return base > 0 ? dps(lvl) / base : 0;
}
export function isDamageCard(id) {
  const T = C.TOWERS[id];
  return T.kind === 'tower' && id !== 'fan' && T.targets !== 'air' && !T.nearTrail;
}

// ---------- tower stats (all numbers come from C.TOWERS) ----------
export function towerStat(type, key, lvl = 1, cardLevel = 1) {
  const T = C.TOWERS[type];
  let v = T.stats && key in T.stats ? T.stats[key] : T[key];
  if (v == null || typeof v !== 'number') return v == null ? null : v;
  v = applyCardSteps(T, key, v, cardLevel);
  const ups = T.upgrades || [];
  // v0.6 item 6 (Tractor): an in-battle `liftSize` step ADDS a size class; if the card already lifts every size (card L8+),
  // that step raises the rate instead (`rateIfMaxLift`).
  const cardLift = type === 'tractor' ? applyCardSteps(T, 'liftSize', T.liftSize, cardLevel) : 0;
  for (let i = 0; i < lvl - 1 && i < ups.length; i++) {
    const u = ups[i];
    if (key === 'liftSize') { if (u.liftSize != null && cardLift < C.LIFT_MAX) v += u.liftSize; continue; }
    if (key === 'rate' && u.rateIfMaxLift != null && cardLift >= C.LIFT_MAX) v *= u.rateIfMaxLift;
    if (u[key] != null) v *= u[key];
  }
  if (key === 'liftSize') v = Math.min(C.LIFT_MAX, Math.round(v));
  if (key === 'slow' || (key === 'power' && T.powerFmt === 'pct')) v = Math.min(C.SLOW_CAP, v);
  if (key === 'chain') v = Math.round(v);
  return v;
}
// v0.5 items 5/5b: card levels L2..L10 apply the tower's own step sequence (C.TOWERS[x].cardUpgrades, from tuning.json):
// step i (to level i+2) = { stat: amount }; range adds tiles, every other key adds a fraction (+0.10 = +10%).
export function applyCardSteps(T, key, v, cardLevel = 1) {
  const steps = T.cardUpgrades || [];
  for (let i = 0; i < cardLevel - 1 && i < steps.length; i++) {
    const a = steps[i][key]; if (a == null) continue;
    v = key === 'range' ? v + a * C.TILE : key === 'liftSize' ? Math.min(C.LIFT_MAX, v + a) : v * (1 + a);
  }
  return v;
}
// what the NEXT card level (fromLevel -> fromLevel + 1) changes, for the Cards / Shop info panel
export function cardUpgradeDiff(type, fromLevel) {
  const step = (C.TOWERS[type].cardUpgrades || [])[fromLevel - 1];
  if (!step || fromLevel >= C.MAX_CARD_LEVEL) return [];
  return Object.keys(step).map((key) => ({ key, label: statLabel(type, key), amount: step[key], from: towerStat(type, key, 1, fromLevel), to: towerStat(type, key, 1, fromLevel + 1) }));
}
// what the next in-battle upgrade (fromLvl -> fromLvl + 1) changes: only the keys listed in the config entry
export function upgradeDiff(type, fromLvl, cardLevel = 1) {
  const up = (C.TOWERS[type].upgrades || [])[fromLvl - 1];
  if (!up) return [];
  // v0.6: only what really changes (Tractor step 4 = lift size, or rate when the card already lifts every size)
  const keys = [...new Set(Object.keys(up).map((k) => (k === 'rateIfMaxLift' ? 'rate' : k)))];
  return keys.map((key) => ({ key, label: statLabel(type, key), from: towerStat(type, key, fromLvl, cardLevel), to: towerStat(type, key, fromLvl + 1, cardLevel) }))
    .filter((d) => d.from !== d.to);
}
export function statLabel(type, key) {
  const T = C.TOWERS[type];
  if (key === 'power') return T.powerLabel || 'Power';
  if (key === 'range') return T.rangeLabel || (T.place === 'path' ? 'Area' : 'Range');
  return C.STAT_LABELS[key] || key;
}
// v0.4.1: every range is shown as the radius of its on-screen circle in map cells (1 tile = C.TILE px), the same unit Yair measures in
export function rangeTiles(type, px) {
  return px / C.TILE;
}
const r1 = (v) => (Math.abs(v - Math.round(v)) < 0.05 ? String(Math.round(v)) : v.toFixed(1));
export function formatStat(type, key, v) {
  const T = C.TOWERS[type];
  if (v == null) return key === 'rate' ? 'always on' : '-';
  if (key === 'power') return T.powerFmt === 'pct' ? `${Math.round(v * 100)}%` : r1(v);
  if (key === 'rate') return v >= 1 ? `${v.toFixed(1)}/s` : `1 per ${(1 / v).toFixed(1)}s`;
  if (key === 'range') return T.place === 'path' ? 'its tile' : `${(rangeTiles(type, v)).toFixed(1)} tiles`; // v0.6 item 3: on-path items cover their own tile
  if (key === 'liftSize') return C.LIFT_NAMES[v] || String(v);
  if (key === 'slow') return `${Math.round(v * 100)}%`;
  if (key === 'ballRadius') return `${((2 * v) / C.TILE).toFixed(2)} tiles`; // diameter, in trail tiles
  if (key === 'cloudRadius' || key === 'chainRange') return `${(v / C.TILE).toFixed(1)} tiles`;
  if (key === 'heatMax') return `+${Math.round(v * 100)}%`;
  if (key === 'chain') return `${v} jumps`;
  if (/Time$/.test(key) || key === 'stagger') return `${v.toFixed(1)}s`;
  return r1(v);
}

export const DIRS = [[1, 0], [0, 1], [-1, 0], [0, -1]]; // right, down, left, up
// every trail tile of a route, in walking order (expands the compressed waypoints; off-board entry points are skipped)
export function routeTileSeq(wps) {
  const out = []; const push = (c, r) => { const l = out[out.length - 1]; if (!l || l[0] !== c || l[1] !== r) out.push([c, r]); };
  for (let i = 0; i < wps.length; i++) {
    const b = [Math.round(wps[i][0]), Math.round(wps[i][1])];
    if (!i) { push(b[0], b[1]); continue; }
    const a = out[out.length - 1]; const sx = Math.sign(b[0] - a[0]), sy = Math.sign(b[1] - a[1]);
    let c = a[0], r = a[1]; while (c !== b[0] || r !== b[1]) { c += sx; r += sy; push(c, r); }
  }
  return out.filter(([c, r]) => c >= 0 && r >= 0 && c < C.GRID_COLS && r < C.GRID_ROWS);
}
// unit vector from (x, y) toward the board centre (true angle unless aim.snap)
export function aimVector(x, y, aim = C.BATTLE.aim) {
  const cx = C.GRID_COLS * C.TILE / 2, cy = C.GRID_ROWS * C.TILE / 2;
  let vx = cx - x, vy = cy - y; if (!vx && !vy) vx = 1;
  if (aim && aim.snap) { const [sx, sy] = DIRS[dirFromVec(vx, vy)]; return { ax: sx, ay: sy }; }
  const l = Math.hypot(vx, vy); return { ax: vx / l, ay: vy / l };
}
export function dirFromVec(dx, dy) { return Math.abs(dx) >= Math.abs(dy) ? (dx >= 0 ? 0 : 2) : (dy >= 0 ? 1 : 3); }

// ---------- path ----------
export class Path {
  constructor(tilePts) {
    this.pts = tilePts.map(([c, r]) => ({ x: (c + 0.5) * C.TILE, y: (r + 0.5) * C.TILE }));
    this.cum = [0];
    for (let i = 1; i < this.pts.length; i++) {
      const a = this.pts[i - 1], b = this.pts[i];
      this.cum.push(this.cum[i - 1] + Math.hypot(b.x - a.x, b.y - a.y));
    }
    this.length = this.cum[this.cum.length - 1];
    this.tiles = new Set();
    for (let d = 0; d <= this.length; d += 4) {
      const p = this.at(d);
      const c = Math.floor(p.x / C.TILE), r = Math.floor(p.y / C.TILE);
      if (c >= 0 && r >= 0 && c < C.GRID_COLS && r < C.GRID_ROWS) this.tiles.add(c + ',' + r);
    }
  }
  at(d) {
    d = Math.max(0, Math.min(this.length, d));
    let i = 1;
    while (i < this.cum.length - 1 && this.cum[i] < d) i++;
    const a = this.pts[i - 1], b = this.pts[i];
    const seg = this.cum[i] - this.cum[i - 1] || 1;
    const t = (d - this.cum[i - 1]) / seg;
    return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t, dx: (b.x - a.x) / seg, dy: (b.y - a.y) / seg };
  }
  nearestD(x, y) {
    let best = 0, bd = Infinity;
    for (let d = 0; d <= this.length; d += 2) {
      const p = this.at(d); const q = (p.x - x) ** 2 + (p.y - y) ** 2;
      if (q < bd) { bd = q; best = d; }
    }
    return { d: best, dist: Math.sqrt(bd) };
  }
  isPathTile(c, r) { return this.tiles.has(c + ',' + r); }
}

// ---------- waves ----------
const SPACING = { small: 0.45, worker: 1, big: 1.6, gasmask: 1, armored: 1.5, flyer: 0.8, sprinter: 0.9, heavy: 1.7, queen: 1, queen2: 1,
  small_gasmask: 0.45, small_armed: 0.6, small_fly: 0.5 }; // v0.7: small variants (Yair ANT-STATS-v0.6.3)
export function generateWaves(levelIndex, levels = C.LEVELS) {
  const L = levels[levelIndex];
  if (L.waves) return L.waves.map((groups) => expandGroups(groups, L.interval || 1));
  const rng = mulberry32(1000 + levelIndex * 7919);
  const waves = [];
  for (let i = 0; i < L.waveCount; i++) {
    const n = i + 1;
    const pool = L.mix.filter((m) => (m.from || 1) <= n);
    const total = pool.reduce((s, m) => s + m.w, 0);
    const count = Math.round(L.base + L.growth * i);
    const list = [];
    let t = 0;
    for (let k = 0; k < count; k++) {
      let r = rng() * total, type = pool[0].type;
      for (const m of pool) { r -= m.w; if (r <= 0) { type = m.type; break; } }
      const reps = type === 'small' || type === 'small_gasmask' || type === 'small_fly' ? 2 : 1;
      for (let j = 0; j < reps; j++) { list.push({ t, type }); t += L.interval * SPACING[type] * (j < reps - 1 ? 0.5 : 1); }
    }
    if (L.special && L.special[n]) {
      let t2 = t;
      for (const g of L.special[n]) {
        t2 += g.delay || 0;
        for (let j = 0; j < g.count; j++) { list.push({ t: t2, type: g.type }); t2 += g.interval; }
      }
    }
    list.sort((a, b) => a.t - b.t);
    waves.push(list);
  }
  return waves;
}
function expandGroups(groups, interval) {
  const list = []; let t = 0;
  for (const g of groups) { t += g.delay || 0; for (let j = 0; j < g.count; j++) { list.push({ t, type: g.type }); t += g.interval || interval; } }
  return list;
}
export function levelAntTypes(levelIndex) {
  const s = new Set();
  for (const w of generateWaves(levelIndex)) for (const e of w) s.add(e.type);
  return [...s];
}

// food that comes back when a carrier dies on the way home
export function foodReturned(carrying, progress, R = C.BATTLE.foodReturn) {
  const f = R.mode === 'distance' ? R.distMin + (R.distMax - R.distMin) * Math.max(0, Math.min(1, progress)) : R.fixed;
  let v = carrying * f;
  if (R.rounding === 'floor') v = Math.floor(v + 1e-9); else if (R.rounding === 'round') v = Math.round(v);
  return Math.round(v * 1000) / 1000;
}

// ---------- battle ----------
let NEXT_ID = 1;
export class Battle {
  /**
   * opts: { levelIndex, deck: [cardIds], bonusTypes: [ids], bonusStock: {id:n}, cardLevels: {id:L}, seed, battleCfg, onBonusUsed }
   */
  constructor(opts) {
    this.cfg = { ...C.BATTLE, ...(opts.battleCfg || {}) };
    this.cfg.foodReturn = { ...C.BATTLE.foodReturn, ...((opts.battleCfg || {}).foodReturn || {}) };
    this.cfg.rescue = { ...C.BATTLE.rescue, ...((opts.battleCfg || {}).rescue || {}) }; // v0.7.4 M2 (flag: rescue.on, default off)
    this.levelIndex = opts.levelIndex;
    this.level = C.LEVELS[opts.levelIndex];
    this.mapId = opts.mapId || this.level.map;
    this.map = C.MAPS[this.mapId];
    const parsed = parseMap(this.map, C.GRID_COLS, C.GRID_ROWS);
    this.routes = parsed.routes.map((r) => new Path(r));
    this.path = this.routes[0];
    this.props = parsed.props;
    this.pathTiles = new Set(); for (const rt of this.routes) for (const t of rt.tiles) this.pathTiles.add(t);
    // v0.5 item 2: trail connections between neighbouring tiles (both ways) - used to find straight stretches of trail
    this.trailEdges = new Set();
    for (const wps of parsed.routes) { const seq = routeTileSeq(wps); for (let i = 1; i < seq.length; i++) { const [a, b] = [seq[i - 1], seq[i]]; this.trailEdges.add(a + '>' + b); this.trailEdges.add(b + '>' + a); } }
    // tiles hidden under the ant nests, the cookie and kitchen props cannot be built on
    this.blocked = new Set();
    const ends = [];
    for (const rt of this.routes) { ends.push({ ...rt.pts[0], k: 0 }); ends.push({ ...rt.pts[rt.pts.length - 1], k: 1 }); }
    for (let c = 0; c < C.GRID_COLS; c++) for (let r = 0; r < C.GRID_ROWS; r++) {
      const x = (c + 0.5) * C.TILE, y = (r + 0.5) * C.TILE;
      if (ends.some((e) => Math.hypot(e.x - x, Math.max(e.y, 20) - y) < (e.k ? 36 : 30))) this.blocked.add(c + ',' + r);
    }
    for (const p of this.props) this.blocked.add(p.c + ',' + p.r);
    this.rng = mulberry32(opts.seed ?? 12345);
    this.deck = opts.deck.slice(0, this.cfg.deckSize);
    // v0.7 D-P4 (Should, S3 passed): per-world card-level cap - in battle a card acts as at most worlds[w].cardLevelCap (W1 4, W2 6)
    this.cardLevelCap = opts.noCardLevelCap ? null : worldCardLevelCap(opts.levelIndex || 0);
    this.cardLevels = { ...(opts.cardLevels || {}) };
    if (this.cardLevelCap) for (const k of Object.keys(this.cardLevels)) this.cardLevels[k] = Math.min(this.cardLevels[k], this.cardLevelCap);
    this.bonusTypes = (opts.bonusTypes || []).slice(0, this.cfg.bonusTypesToBring);
    this.bonusStock = { ...(opts.bonusStock || {}) };
    this.bonusUsesLeft = this.cfg.maxBonusUses;
    this.dia = { crumbs: 0, boosters: 0, per: {} }; // v0.3: diamond purchases made in THIS battle (escalating prices reset every battle)
    this.waves = generateWaves(opts.levelIndex);
    this.time = 0;
    this.crumbs = this.cfg.startCrumbs;     // battle-only currency
    this.crumbsEarned = 0;
    this.cardsPlayed = 0;
    this.rerolls = 0;                        // v0.5 item 17: redraws this battle (the price resets every battle)
    this.foodStored = this.cfg.foodHP;
    this.foodDelivered = 0;
    this.ants = []; this.towers = []; this.projectiles = []; this.clouds = []; this.balls = [];
    this.pending = [];
    this.nextWave = 0;
    this.nextWaveAt = this.cfg.firstWaveDelay;
    this.routeCounter = 0;
    this.freezeUntil = -1;
    this.decoy = null; this.planes = null;
    this.events = [];
    this.pieces = []; this.rescueScale = 1; this.pieceId = 1; // v0.7.4 M2: dropped crumbs; rescueScale = game speed, so a piece lives `window` seconds of WALL time at any speed
    this.stats = { kills: 0, spawned: 0, byType: {}, stolen: 0, returned: 0, lostOnWay: 0 };
    this.result = null;            // 'win' | 'lose'
    this.paused = false;           // while paused, every player action and the clock are blocked
    this.onBonusUsed = opts.onBonusUsed || null;
    this.picks = [];
    this.dealHand();
  }

  // v0.7 D-R1/D-R2: a full hand (start of battle and every redraw). Distinct cards when the deck allows it; while no card has been
  // played yet, the hand holds >= openingDamageCards damage cards (when the deck has that many): draw those first, then the rest.
  dealHand() {
    const n = this.cfg.visiblePicks, hand = [];
    if (this.cfg.distinctHand) {
      const ids = [...new Set(this.deck)];
      const take = (pool) => { const id = pool[Math.floor(this.rng() * pool.length) % pool.length]; hand.push(id); ids.splice(ids.indexOf(id), 1); };
      if (this.cardsPlayed === 0 && this.cfg.openingDamageCards) {
        for (let k = 0; k < this.cfg.openingDamageCards && hand.length < n; k++) { const dmg = ids.filter(isDamageCard); if (!dmg.length) break; take(dmg); }
      }
      while (hand.length < n && ids.length) take(ids);
      while (hand.length < n) hand.push(this.draw()); // deck smaller than the hand: repeats are unavoidable
      for (let i = hand.length - 1; i > 0; i--) { const j = Math.floor(this.rng() * (i + 1)); [hand[i], hand[j]] = [hand[j], hand[i]]; }
    } else {
      for (let i = 0; i < n; i++) hand.push(this.draw());
    }
    if (this.cfg.guaranteeDamageOpening && this.cardsPlayed === 0) {
      const dmg = this.deck.filter(isDamageCard);
      if (dmg.length && !hand.some(isDamageCard)) hand[0] = dmg[Math.floor(this.rng() * dmg.length)];
    }
    this.picks = hand;
  }
  // v0.7 D-R1: the card that replaces a played one differs from the two still in the hand (when the deck allows it)
  drawReplacement(pickIndex) {
    if (!this.cfg.distinctHand) return this.draw();
    const others = this.picks.filter((_, i) => i !== pickIndex);
    const pool = [...new Set(this.deck)].filter((id) => !others.includes(id));
    return pool.length ? pool[Math.floor(this.rng() * pool.length) % pool.length] : this.draw();
  }

  draw() { return this.deck[Math.floor(this.rng() * this.deck.length)]; }
  get nextCardCost() { return cardCost(this.cardsPlayed, this.cfg); }
  get totalWaves() { return this.waves.length; }
  get foodLeft() { return this.foodStored; }
  get perfect() { return this.result === 'win' && this.stats.stolen === 0 && this.foodStored >= this.cfg.foodHP; }
  route(a) { return this.routes[a.ri || 0]; }
  isPathTile(c, r) { return this.pathTiles.has(c + ',' + r); }
  nearestOnTrail(x, y) {
    let best = null;
    this.routes.forEach((rt, ri) => { const n = rt.nearestD(x, y); if (!best || n.dist < best.dist) best = { ...n, ri }; });
    return best;
  }
  emit(e) { this.events.push(e); if (this.events.length > 400) this.events.splice(0, 200); }

  // ----- waves -----
  startWave() {
    if (this.nextWave >= this.waves.length) return false;
    const w = this.waves[this.nextWave];
    let last = 0;
    for (const e of w) { this.pending.push({ t: this.time + e.t, type: e.type }); last = Math.max(last, e.t); }
    this.nextWave++;
    this.nextWaveAt = this.time + last + this.cfg.waveGap;
    this.emit({ type: 'wave', n: this.nextWave });
    return true;
  }
  callWaveEarly() {
    if (this.result || this.paused || this.nextWave >= this.waves.length) return 0;
    const skipped = Math.max(0, this.nextWaveAt - this.time);
    const bonus = Math.floor(skipped * this.cfg.earlyCallBonusPerSec);
    this.addCrumbs(bonus);
    this.startWave();
    return bonus;
  }
  addCrumbs(n) { this.crumbs += n; this.crumbsEarned += n; }

  spawn(type, d = 0, ri = null) {
    const a = C.ANTS[type];
    const hp = Math.round(a.hp * (this.level.hpMul || 1));
    if (ri == null) ri = this.routeCounter++ % this.routes.length;
    const ant = { id: NEXT_ID++, type, ri, hp, maxHp: hp, armor: a.armor, d, speed: a.speed, flying: !!a.flying,
      gasImmune: !!a.gasImmune, weight: a.weight, size: a.size, state: 'go', carrying: 0, trips: 0, waitT: 0, slow: 0, stunT: 0, charmT: 0, charmD: 0,
      plantSlow: 0, plantSlowT: 0, spawnT: a.spawn ? a.spawn.every : 0, dead: false, x: 0, y: 0, born: this.time, hitFlash: 0, dir: 1 };
    const p = this.routes[ri].at(d); ant.x = p.x; ant.y = p.y;
    this.ants.push(ant);
    this.stats.spawned++;
    return ant;
  }

  damage(ant, dmg, opt = {}) {
    if (ant.dead || dmg <= 0) return 0;
    if (opt.gas && ant.gasImmune) { if (opt.fx !== false && this.rng() < 0.05) this.emit({ type: 'immune', x: ant.x, y: ant.y }); return 0; }
    const real = applyArmor(dmg, ant.armor, opt.ignoreArmor);
    ant.hp -= real; ant.hitFlash = 0.12;
    if (ant.hp <= 0) this.kill(ant, opt.src);
    return real;
  }
  kill(ant, src) {
    ant.dead = true;
    const crumbs = C.crumbsFor(ant.type);
    this.addCrumbs(crumbs);
    this.stats.kills++;
    this.stats.byType[ant.type] = (this.stats.byType[ant.type] || 0) + 1;
    if (ant.carrying > 0 && this.cfg.rescue && this.cfg.rescue.on) { // v0.7.4 M2: `auto` of the piece comes back at once, the rest (`tap - auto`) stays on the trail as a piece to tap
      const R = this.cfg.rescue, auto = Math.round(ant.carrying * R.auto * 1000) / 1000, bonus = Math.round(ant.carrying * (R.tap - R.auto) * 1000) / 1000;
      this.stats.lostOnWay += ant.carrying - auto;
      if (auto > 0) { this.foodStored = Math.min(this.cfg.foodHP, this.foodStored + auto); this.stats.returned += auto; this.emit({ type: 'foodReturn', x: ant.x, y: ant.y, n: auto, of: ant.carrying }); }
      if (bonus > 0) this.dropPiece(ant.x, ant.y, bonus);
      ant.carrying = 0;
    } else if (ant.carrying > 0) {
      const rt = this.route(ant);
      const back = foodReturned(ant.carrying, ant.d / rt.length, this.cfg.foodReturn);
      this.stats.lostOnWay += ant.carrying - back;
      if (back > 0) { this.foodStored = Math.min(this.cfg.foodHP, this.foodStored + back); this.stats.returned += back; this.emit({ type: 'foodReturn', x: ant.x, y: ant.y, n: back, of: ant.carrying }); }
      ant.carrying = 0;
    }
    this.emit({ type: 'kill', x: ant.x, y: ant.y, ant: ant.type, crumbs, src: src && src.type, ...(src && src.type === 'swatter' ? { ref: ant } : {}) }); // ref: the view keeps the swatted ant visible until the slap frame (v0.7.3)
    if (src && src.type === 'lizard') src.chew = src.stat('chewTime');
  }
  // ----- v0.7.4 M2: rescue the crumb (flag cfg.rescue.on; default off = v0.7.3's automatic 40%) -----
  dropPiece(x, y, bonus) {
    const R = this.cfg.rescue;
    const near = this.pieces.find((q) => Math.hypot(q.x - x, q.y - y) <= R.mergeRadius);
    if (near) { // piles merge: bonuses add, the timer restarts (= the later of the two), the pile sits between them (weighted)
      const w = near.bonus + bonus; near.x = (near.x * near.bonus + x * bonus) / w; near.y = (near.y * near.bonus + y * bonus) / w;
      near.bonus = Math.round(w * 1000) / 1000; near.left = R.window; near.total = R.window; near.n++;
      this.emit({ type: 'pieceDrop', id: near.id, x: near.x, y: near.y, bonus: near.bonus, merged: true });
      return near;
    }
    const q = { id: this.pieceId++, x, y, bonus, left: R.window, total: R.window, n: 1, born: this.time };
    this.pieces.push(q); this.emit({ type: 'pieceDrop', id: q.id, x, y, bonus, merged: false });
    return q;
  }
  pieceAt(x, y, radius = this.cfg.rescue.radius) {
    let best = null, bd = radius;
    for (const q of this.pieces) { const d = Math.hypot(q.x - x, q.y - y); if (d <= bd) { bd = d; best = q; } }
    return best;
  }
  // tap / sweep: adds the piece's bonus to the cookie (never above foodHP) and removes it. Returns false when there is no such piece (double-collect), or paused / over.
  collectPiece(id, auto = false) {
    if (this.result && !auto) return false;
    if (this.paused && !auto) return false;
    const i = this.pieces.findIndex((q) => q.id === id); if (i < 0) return false;
    const q = this.pieces[i]; this.pieces.splice(i, 1);
    const gain = Math.min(q.bonus, Math.max(0, this.cfg.foodHP - this.foodStored));
    this.foodStored += gain; this.stats.returned += gain; this.stats.lostOnWay -= gain; this.stats.rescued = (this.stats.rescued || 0) + gain;
    this.emit({ type: 'pieceCollect', id: q.id, x: q.x, y: q.y, n: q.bonus, gain, auto });
    return true;
  }
  threat(a) { return a.state === 'go' ? a.d : this.route(a).length * 2 - a.d; }

  // ----- cards -----
  tileInfo(c, r) {
    if (c < 0 || r < 0 || c >= C.GRID_COLS || r >= C.GRID_ROWS) return { valid: false };
    const onPath = this.isPathTile(c, r);
    if (this.blocked.has(c + ',' + r)) return { valid: false };
    const tower = this.towers.find((t) => t.c === c && t.r === r) || null;
    return { valid: true, onPath, tower };
  }
  touchesTrail(c, r) {
    for (let dc = -1; dc <= 1; dc++) for (let dr = -1; dr <= 1; dr++) if ((dc || dr) && this.isPathTile(c + dc, r + dr)) return true;
    return false;
  }
  canPlay(pickIndex, c, r) {
    const card = this.picks[pickIndex];
    if (!card || this.result) return { ok: false, why: 'none' };
    if (this.paused) return { ok: false, why: 'paused' };
    if (this.crumbs < this.nextCardCost) return { ok: false, why: 'crumbs' };
    const ti = this.tileInfo(c, r);
    if (!ti.valid) return { ok: false, why: 'tile' };
    if (ti.tower) {
      if (ti.tower.type === card && ti.tower.lvl < this.cfg.maxInBattleLevel) return { ok: true, upgrade: true, tower: ti.tower };
      return { ok: false, why: ti.tower.type === card ? 'max' : 'occupied' };
    }
    const T = C.TOWERS[card];
    if (T.place === 'path' && !ti.onPath) return { ok: false, why: 'needPath' };
    if (T.place === 'side' && ti.onPath) return { ok: false, why: 'needSide' };
    if (T.nearTrail && !this.touchesTrail(c, r)) return { ok: false, why: 'needNearTrail' };
    return { ok: true, upgrade: false };
  }
  playCard(pickIndex, c, r) {
    const chk = this.canPlay(pickIndex, c, r);
    if (!chk.ok) return chk;
    const card = this.picks[pickIndex];
    const cost = this.nextCardCost;
    this.crumbs -= cost;
    this.cardsPlayed++;
    let tower, diff = null;
    if (chk.upgrade) {
      tower = chk.tower; diff = upgradeDiff(tower.type, tower.lvl, tower.cardLevel);
      tower.lvl++; if (C.TOWERS[tower.type].directional) this.computeRun(tower);
      this.emit({ type: 'upgrade', x: tower.x, y: tower.y, lvl: tower.lvl, card, pick: pickIndex, cost, id: tower.id, diff });
    } else { tower = this.addTower(card, c, r); this.emit({ type: 'place', x: tower.x, y: tower.y, card, pick: pickIndex, cost, id: tower.id }); }
    this.picks[pickIndex] = this.drawReplacement(pickIndex);
    return { ok: true, upgrade: chk.upgrade, tower, cost, diff };
  }
  // v0.5 item 17: 3, 6, 9, 12 ... crumbs (rerollCost + rerolls * rerollStep), reset at the start of every battle.
  // v0.7 D-R3: the first `freeRedraws` redraws of a battle are free, then 3, 6, 9 ...
  get rerollPrice() { const f = this.cfg.freeRedraws || 0; return this.rerolls < f ? 0 : this.cfg.rerollCost + (this.rerolls - f) * (this.cfg.rerollStep || 0); }
  reroll() {
    const price = this.rerollPrice;
    if (this.crumbs < price || this.result || this.paused) return false;
    this.crumbs -= price; this.rerolls++;
    this.dealHand();
    return true;
  }
  // ----- v0.5 items 11/12: move a placed tower (1 diamond, charged by the game) / swap two placed towers (free) -----
  // placement rule of a tower type on a cell, ignoring which towers stand where
  placeRuleOk(type, c, r) {
    if (c < 0 || r < 0 || c >= C.GRID_COLS || r >= C.GRID_ROWS || this.blocked.has(c + ',' + r)) return false;
    const T = C.TOWERS[type], onPath = this.isPathTile(c, r);
    if (T.place === 'path' && !onPath) return false;
    if (T.place === 'side' && onPath) return false;
    if (T.nearTrail && !this.touchesTrail(c, r)) return false;
    return true;
  }
  canMoveTower(tw, c, r) {
    if (!tw || this.result || this.paused || !this.towers.includes(tw)) return false;
    if (tw.c === c && tw.r === r) return false;
    if (this.towers.some((o) => o.c === c && o.r === r)) return false;
    return this.placeRuleOk(tw.type, c, r);
  }
  // v0.7.4 M1: set / cycle a single-target tower's target mode (instant, free; per tower; not saved)
  setTargetMode(tw, mode) { if (!hasTargetModes(tw.type) || !TARGET_MODES.includes(mode)) return false; tw.mode = mode; this.emit({ type: 'mode', id: tw.id, x: tw.x, y: tw.y, mode }); return true; }
  cycleTargetMode(tw) { return hasTargetModes(tw.type) && this.setTargetMode(tw, nextTargetMode(tw.mode)) ? tw.mode : null; }
  moveTower(tw, c, r) {
    if (!this.canMoveTower(tw, c, r)) return false;
    const from = { x: tw.x, y: tw.y };
    this.relocate(tw, c, r);
    this.emit({ type: 'move', id: tw.id, fx: from.x, fy: from.y, x: tw.x, y: tw.y });
    return true;
  }
  canSwapTowers(a, b) {
    if (!a || !b || a === b || this.result || this.paused) return false;
    return this.placeRuleOk(a.type, b.c, b.r) && this.placeRuleOk(b.type, a.c, a.r);
  }
  swapTowers(a, b) {
    if (!this.canSwapTowers(a, b)) return false;
    const ac = a.c, ar = a.r;
    this.relocate(a, b.c, b.r); this.relocate(b, ac, ar);
    this.emit({ type: 'swap', a: a.id, b: b.id, ax: a.x, ay: a.y, bx: b.x, by: b.y });
    return true;
  }
  relocate(tw, c, r) {
    tw.c = c; tw.r = r; tw.x = (c + 0.5) * C.TILE; tw.y = (r + 0.5) * C.TILE;
    this.setupTower(tw);
  }
  addTower(type, c, r) {
    const T = C.TOWERS[type];
    const x = (c + 0.5) * C.TILE, y = (r + 0.5) * C.TILE;
    const cl = this.cardLevels[type] || 1;
    const tower = { id: NEXT_ID++, type, c, r, x, y, lvl: 1, cardLevel: cl, cd: 0.3, chew: 0, anim: 0, aim: -Math.PI / 2, fireFx: 0, target: null, tick: 0,
      heat: 0, heatTarget: null, mode: 'weak', dir: 0, stuckSet: new Set(), charmSet: new Set(), roastSet: new Set(), balls: 0,
      stat(key) { return towerStat(this.type, key, this.lvl, this.cardLevel); } };
    this.setupTower(tower);
    this.towers.push(tower);
    return tower;
  }
  // everything that depends on WHERE a tower stands (also after Move / Swap)
  setupTower(tower) {
    const T = C.TOWERS[tower.type];
    if (T.place === 'path') {
      const nd = this.nearestOnTrail(tower.x, tower.y); const p = this.routes[nd.ri].at(nd.d);
      tower.pathD = nd.d; tower.px = p.x; tower.py = p.y; tower.dirx = p.dx; tower.diry = p.dy;
      tower.routeD = this.routes.map((rt) => { const n = rt.nearestD(p.x, p.y); return n.dist < 24 ? n.d : null; });
    }
    if (T.directional) { this.aimTower(tower); this.computeRun(tower); }
  }
  // v0.5 items 2 + 10a (FEEDBACK-v0.3.0 item 4, final): a directional tower acts on the trail cell right next to it
  // (up / down / left / right), in the direction AWAY from the tower: tower -> that cell -> onward in a straight line while the
  // trail keeps going straight. It stops at a wall / turn. Two or more such cells: the LONGER straight run wins; tie -> the
  // one higher on the screen; still tied -> the left one. No trail cell next to it -> no direction (the marble does not roll,
  // the fan does not blow). v0.5 item 10b: the Fan uses exactly this direction.
  trailDirection(c, r) {
    let best = null;
    for (const [dx, dy] of DIRS) {
      const nc = c + dx, nr = r + dy;
      if (!this.isPathTile(nc, nr)) continue;
      let run = 1, cc = nc, cr = nr;
      while (run < 40 && this.trailEdges.has(cc + ',' + cr + '>' + (cc + dx) + ',' + (cr + dy))) { cc += dx; cr += dy; run++; }
      const cand = { dx, dy, run, nc, nr, ec: cc, er: cr };
      if (!best || run > best.run || (run === best.run && (nr < best.nr || (nr === best.nr && nc < best.nc)))) best = cand;
    }
    return best;
  }
  aimTower(tw) {
    const d = this.trailDirection(tw.c, tw.r);
    tw.trailDir = d; tw.hasLaunch = !!d;
    if (d) { tw.ax = d.dx; tw.ay = d.dy; tw.dir = dirFromVec(d.dx, d.dy); }
    else { tw.ax = 0; tw.ay = 0; tw.dir = 1; }
    // marble launch point = the edge between the tower cell and the trail cell
    tw.lx = tw.x + tw.ax * C.TILE / 2; tw.ly = tw.y + tw.ay * C.TILE / 2; tw.lc = d ? d.nc : tw.c; tw.lr = d ? d.nr : tw.r;
  }
  onTrailPx(px, py) { return this.isPathTile(Math.floor(px / C.TILE), Math.floor(py / C.TILE)); }
  computeRun(tw) {
    if (tw.type !== 'ball') return;
    const r = this.rollFor(tw); tw.runLen = r.len; tw.runStuck = false; tw.runTiles = r.tiles;
  }
  // roll of a marble at its spot: from the tower edge to the far wall of the last straight trail cell (minus the marble radius)
  rollFor(tw, lvl = tw.lvl) {
    const d = tw.trailDir;
    if (!d) return { len: 0, tiles: 0, stuck: true };
    const rad = towerStat(tw.type, 'ballRadius', lvl, tw.cardLevel);
    return { len: Math.max(0, d.run * C.TILE - Math.min(rad, C.TILE / 2)), tiles: d.run, stuck: false };
  }
  // wind effect of a fan blowing along (wx, wy) on ants near (x, y): >0 = pushes ants back (good), <0 = speeds them up (bad)
  windScore(x, y, wx, wy, range) {
    let s = 0;
    for (const rt of this.routes) for (let d = 0; d <= rt.length; d += 10) { const p = rt.at(d); if (Math.hypot(p.x - x, p.y - y) <= range) s -= wx * p.dx + wy * p.dy; }
    return s;
  }

  // ----- bonuses -----
  canUseBonus(type) {
    return !this.result && !this.paused && this.bonusTypes.includes(type) && this.bonusUsesLeft > 0 && (this.bonusStock[type] || 0) > 0;
  }
  useBonus(type, x, y) {
    if (!this.canUseBonus(type)) return false;
    const B = C.BONUSES[type];
    this.bonusUsesLeft--; this.bonusStock[type]--;
    if (this.onBonusUsed) this.onBonusUsed(type);
    if (type === 'bomb') {
      for (const a of this.ants) if (!a.dead && !a.flying && Math.hypot(a.x - x, a.y - y) <= B.radius) this.damage(a, B.damage, { ignoreArmor: true, src: { type: 'bomb' } });
      this.emit({ type: 'bomb', x, y, r: B.radius });
    } else if (type === 'plane') {
      this.planes = this.routes.map((rt, ri) => ({ ri, d: rt.length + 60, x: 0, y: 0, dx: 0 }));
      this.planeHit = new Set();
      this.emit({ type: 'plane' });
    } else if (type === 'freeze') {
      this.freezeUntil = this.time + B.time;
      this.emit({ type: 'freeze' });
    } else if (type === 'decoy') {
      const nd = this.nearestOnTrail(x, y); const p = this.routes[nd.ri].at(nd.d);
      this.decoy = { x: p.x, y: p.y, until: this.time + B.time, ds: this.routes.map((rt) => { const n = rt.nearestD(p.x, p.y); return n.dist < 50 ? n.d : null; }) };
      this.emit({ type: 'decoy', x: p.x, y: p.y });
    }
    return true;
  }
  get plane() { return this.planes && this.planes[0]; } // compatibility for older callers

  // ----- main update -----
  update(dt) {
    if (this.result || this.paused) return;
    this.time += dt;
    const t = this.time;
    if (this.nextWave < this.waves.length && t >= this.nextWaveAt) this.startWave();
    if (this.pending.length) {
      const due = this.pending.filter((p) => p.t <= t);
      if (due.length) { this.pending = this.pending.filter((p) => p.t > t); for (const p of due) this.spawn(p.type); }
    }
    const frozen = t < this.freezeUntil;

    for (const a of this.ants) a.slow = 0;
    // on-trail objects (auras)
    for (const tw of this.towers) {
      const T = C.TOWERS[tw.type];
      tw.anim += dt;
      if (T.place !== 'path') continue;
      if (tw.type === 'gate') tw.tick -= dt;
      let zapped = false;
      for (const a of this.ants) {
        if (a.dead || a.flying) continue;
        if (!onTile(a, tw.c, tw.r)) continue; // v0.6 item 3: an on-path item covers exactly its own square tile
        const boss = C.ANTS[a.type].boss;
        if (tw.type === 'glue') {
          a.slow = Math.max(a.slow, tw.stat('power'));
          if (!tw.stuckSet.has(a.id)) { tw.stuckSet.add(a.id); a.stunT = Math.max(a.stunT, tw.stat('stickTime') * (boss ? 0.3 : a.size >= C.ANT_SIZES.large ? 0.6 : 1)); this.emit({ type: 'stick', x: a.x, y: a.y }); } // large ants stick less
        } else if (tw.type === 'pheromone') {
          a.slow = Math.max(a.slow, tw.stat('slow'));
          this.damage(a, tw.stat('power') * dt, { ignoreArmor: true, src: tw });
          const rd = tw.routeD[a.ri];
          if (!boss && rd != null && !tw.charmSet.has(a.id) && a.state === 'go') { tw.charmSet.add(a.id); a.charmT = tw.stat('charmTime'); a.charmD = rd; this.emit({ type: 'charm', x: a.x, y: a.y }); }
        } else if (tw.type === 'lava') {
          // v0.4 item 7: Roasted Lava - slight slow + continuous damage for as long as the ant is on it
          a.slow = Math.max(a.slow, tw.stat('slow'));
          this.damage(a, tw.stat('power') * dt, { ignoreArmor: true, src: tw });
          if (!tw.roastSet.has(a.id)) { tw.roastSet.add(a.id); this.emit({ type: 'roast', x: a.x, y: a.y }); }
        } else if (tw.type === 'gate' && tw.tick <= 0) { this.damage(a, tw.stat('power'), { ignoreArmor: true, src: tw }); zapped = true; }
      }
      if (tw.type === 'gate' && tw.tick <= 0) { tw.tick = 1 / tw.stat('rate'); if (zapped) { tw.fireFx = 0.2; this.emit({ type: 'gateZap', x: tw.px, y: tw.py }); } }
    }
    // move ants
    for (const a of this.ants) {
      if (a.dead) continue;
      const rt = this.route(a); const L = rt.length;
      a.hitFlash = Math.max(0, a.hitFlash - dt);
      if (a.plantSlowT > 0) { a.plantSlowT -= dt; a.slow = Math.max(a.slow, a.plantSlow); }
      const A = C.ANTS[a.type];
      const slow = a.slow * (1 - (A.slowResist || 0));
      let v = a.speed * (1 - slow);
      if (frozen) v = 0;
      if (a.stunT > 0) { a.stunT -= dt; v = 0; }
      if (a.waitT > 0) { a.waitT -= dt; v = 0; }
      if (a.state === 'back') v *= this.cfg.carrierSpeedMul;
      if (A.spawn && !frozen) { a.spawnT -= dt; if (a.spawnT <= 0) { a.spawnT = A.spawn.every; for (let k = 0; k < A.spawn.count; k++) this.spawn(A.spawn.type, Math.max(0, a.d - 6 - k * 10), a.ri); this.emit({ type: 'queenCall', x: a.x, y: a.y, calls: A.spawn.type }); } }
      const dd = this.decoy && t < this.decoy.until ? this.decoy.ds[a.ri] : null;
      if (dd != null) {
        const diff = dd - a.d;
        if (Math.abs(diff) > 3) { a.d += Math.sign(diff) * Math.min(Math.abs(diff), v * 1.3 * dt); a.dir = Math.sign(diff); }
      } else if (a.charmT > 0) {
        a.charmT -= dt; const diff = a.charmD - a.d;
        if (Math.abs(diff) > 2) { a.d += Math.sign(diff) * Math.min(Math.abs(diff), v * dt); a.dir = Math.sign(diff); }
      } else if (a.state === 'go') {
        a.d += v * dt; a.dir = 1;
        if (a.d >= L) this.reachFood(a);
      } else {
        a.d -= v * dt; a.dir = -1;
        if (a.d <= 0) {
          this.foodDelivered += a.carrying; this.emit({ type: 'delivered', n: a.carrying, first: a.trips === 0 }); a.carrying = 0; a.trips++;
          const F = this.cfg.forage; // v0.7.2 (C14): shuttle until death - the ant drops the piece at the nest (lost for good), waits a moment and walks back for more
          if (F && F.on && !(A.boss && F.queenLoop === false)) { a.state = 'go'; a.d = 0; a.dir = 1; a.waitT = F.pause || 0; this.stats.loops = (this.stats.loops || 0) + 1; }
          else { a.dead = true; a.escaped = true; }
        }
      }
      const p = rt.at(a.d); a.x = p.x; a.y = p.y;
    }
    if (this.decoy && t >= this.decoy.until) this.decoy = null;

    // v0.7.2 (C13): the cookie guard (fly swatter) - one automatic swat every `interval` s at the best ant within `range` px of the cookie.
    // Carrier nearest the cookie first (a kill gives food back), else the nearest ant. The timer waits at 0 while nothing is in range.
    const SW = this.cfg.swatter;
    if (SW && SW.on) {
      const ck = this.path.pts[this.path.pts.length - 1];
      this.swatCd = (this.swatCd == null ? (SW.first ?? SW.interval) : this.swatCd) - dt;
      this.swatFx = Math.max(0, (this.swatFx || 0) - dt);
      if (this.swatCd <= 0) {
        const cand = this.ants.filter((a) => !a.dead && (SW.air !== false || !a.flying) && Math.hypot(a.x - ck.x, a.y - ck.y) <= SW.range);
        if (cand.length) {
          const car = cand.filter((a) => a.carrying > 0);
          const pool = car.length ? car : cand;
          const tg = pool.reduce((b, a) => (Math.hypot(a.x - ck.x, a.y - ck.y) < Math.hypot(b.x - ck.x, b.y - ck.y) ? a : b));
          this.damage(tg, SW.damage, { src: { type: 'swatter' } });
          this.stats.swats = (this.stats.swats || 0) + 1; this.swatFx = 0.5; this.swatTarget = { x: tg.x, y: tg.y };
          this.emit({ type: 'swat', x: tg.x, y: tg.y });
          this.swatCd = SW.interval;
        } else this.swatCd = 0; // ready: waits for an ant
      }
    }
    // towers
    for (const tw of this.towers) {
      const T = C.TOWERS[tw.type];
      if (T.place === 'path') continue;
      tw.fireFx = Math.max(0, tw.fireFx - dt);
      if (tw.chew > 0) { tw.chew -= dt; continue; }
      tw.cd -= dt;
      if (tw.cd > 0) continue;
      const range = tw.stat('range');
      if (tw.type === 'ball') { this.fireMarble(tw, T); continue; }
      if (tw.type === 'tractor') { this.fireTractor(tw); continue; }
      const inRange = this.ants.filter((a) => !a.dead && canHit(T.targets, a.flying) && Math.hypot(a.x - tw.x, a.y - tw.y) <= range);
      if (!inRange.length) continue;
      if (tw.type === 'sound') {
        const st = tw.stat('stagger');
        for (const a of inRange) { this.damage(a, tw.stat('power'), { ignoreArmor: true, src: tw }); if (!a.dead) a.stunT = Math.max(a.stunT, st * (C.ANTS[a.type].boss ? 0.3 : 1)); }
        tw.cd = 1 / tw.stat('rate'); tw.fireFx = 0.4; this.emit({ type: 'pulse', x: tw.x, y: tw.y, r: range });
        continue;
      }
      if (tw.type === 'fan') {
        if (!tw.trailDir) { tw.cd = 0.5; continue; } // v0.5 item 10b: no trail next to the fan -> no wind
        const push = tw.stat('power'); const wx = tw.ax, wy = tw.ay; // wind along the trail, away from the fan
        for (const a of inRange) {
          const w = a.weight; if (!w) continue;
          const rt = this.route(a); const p = rt.at(a.d);
          const dot = wx * p.dx + wy * p.dy; // +1 = wind blows the way the trail goes (towards the cookie)
          a.d = Math.max(0, Math.min(rt.length - 0.5, a.d + push * w * dot));
          const q = rt.at(a.d); a.x = q.x; a.y = q.y;
        }
        tw.cd = 1 / tw.stat('rate'); tw.fireFx = 0.6; tw.aim = Math.atan2(wy, wx);
        this.emit({ type: 'gust', x: tw.x, y: tw.y, ang: tw.aim });
        continue;
      }
      let target;
      if (LOWEST_HP.has(tw.type)) target = this.weakestTarget(tw, inRange);
      else target = inRange.reduce((b, a) => (this.threat(a) > this.threat(b) ? a : b));
      tw.aim = Math.atan2(target.y - tw.y, target.x - tw.x); tw.target = target.id;
      tw.cd = 1 / tw.stat('rate'); tw.fireFx = 0.18;
      if (tw.type === 'slingshot') this.projectiles.push({ x: tw.x, y: tw.y - 6, target, dmg: tw.stat('power'), speed: T.projSpeed, src: tw });
      else if (tw.type === 'laser') {
        if (tw.heatTarget === target.id) tw.heat++; else { tw.heatTarget = target.id; tw.heat = 0; }
        const heat = Math.min(tw.stat('heatMax'), tw.heat * T.heatPerHit);
        this.damage(target, tw.stat('power') * (1 + heat), { src: tw });
        this.emit({ type: 'beam', x: tw.x, y: tw.y - 10, tx: target.x, ty: target.y, heat: heat / (tw.stat('heatMax') || 1) });
      } else if (tw.type === 'zapper') {
        const hit = new Set([target.id]); let cur = target, dmg = tw.stat('power');
        this.damage(target, dmg, { src: tw }); this.emit({ type: 'zap', x: tw.x, y: tw.y - 14, tx: target.x, ty: target.y });
        for (let k = 0; k < tw.stat('chain'); k++) {
          let nx = null, nd = T.chainRange;
          for (const a of this.ants) { if (a.dead || !a.flying || hit.has(a.id)) continue; const q = Math.hypot(a.x - cur.x, a.y - cur.y); if (q <= nd) { nd = q; nx = a; } }
          if (!nx) break;
          dmg *= T.chainFalloff; hit.add(nx.id);
          this.emit({ type: 'zap', x: cur.x, y: cur.y, tx: nx.x, ty: nx.y, chain: true });
          this.damage(nx, dmg, { src: tw }); cur = nx;
        }
      } else if (tw.type === 'lizard') { this.damage(target, tw.stat('power'), { src: tw }); this.emit({ type: 'tongue', x: tw.x, y: tw.y, tx: target.x, ty: target.y }); tw.fireFx = 0.25; }
      else if (tw.type === 'spray') {
        this.clouds.push({ x: target.x, y: target.y, r: tw.stat('cloudRadius'), dps: tw.stat('power'), left: T.cloudTime, total: T.cloudTime, src: tw });
        this.emit({ type: 'spray', x: tw.x, y: tw.y, tx: target.x, ty: target.y });
      }
    }
    // projectiles
    for (const p of this.projectiles) {
      const tg = p.target;
      const dx = tg.x - p.x, dy = tg.y - p.y, dist = Math.hypot(dx, dy);
      const step = p.speed * dt;
      if (dist <= step || tg.dead) { if (!tg.dead) this.damage(tg, p.dmg, { src: p.src }); p.done = true; this.emit({ type: 'hit', x: tg.x, y: tg.y }); }
      else { p.x += (dx / dist) * step; p.y += (dy / dist) * step; }
    }
    this.projectiles = this.projectiles.filter((p) => !p.done);
    for (const c of this.clouds) {
      c.left -= dt;
      for (const a of this.ants) if (!a.dead && !a.flying && Math.hypot(a.x - c.x, a.y - c.y) <= c.r) this.damage(a, c.dps * dt, { gas: true, ignoreArmor: true, src: c.src, fx: true });
    }
    this.clouds = this.clouds.filter((c) => c.left > 0);
    // rolling marbles: straight line along the launcher's arrow; trail walls make them stuck
    for (const b of this.balls) {
      if (b.stuck > 0) { b.stuck -= dt; b.rot += dt * 18; if (b.stuck <= 0) b.done = true; continue; }
      const step = Math.min(b.speed * dt, b.left); b.x += b.dx * step; b.y += b.dy * step; b.left -= step; b.rot += step / b.r; b.travel += step;
      for (const a of this.ants) {
        if (a.dead || a.flying || b.hit.has(a.id)) continue;
        if (Math.hypot(a.x - b.x, a.y - b.y) <= b.r + 8 * a.size) { b.hit.add(a.id); this.damage(a, b.dmg, { src: b.src }); a.hitFlash = 0.2; this.emit({ type: 'squash', x: a.x, y: a.y }); }
      }
      // v0.5 item 2: at the wall / turn the marble simply breaks - no extra damage
      if (b.left <= 0) { b.done = true; this.emit({ type: 'marbleBreak', x: b.x, y: b.y, travel: b.travel }); }
    }
    for (const b of this.balls) if (b.done && b.src) b.src.balls = Math.max(0, b.src.balls - 1);
    this.balls = this.balls.filter((b) => !b.done);
    // crop duster planes (cookie -> nest along every route, hit everything incl. flyers)
    if (this.planes) {
      const B = C.BONUSES.plane; let alive = 0;
      for (const pl of this.planes) {
        const rt = this.routes[pl.ri];
        pl.d -= B.speed * dt;
        if (pl.d < -60) continue; alive++;
        for (const a of this.ants) {
          if (a.dead || this.planeHit.has(a.id) || a.ri !== pl.ri) continue;
          if (Math.abs(a.d - pl.d) < 30) { this.planeHit.add(a.id); this.damage(a, B.damage, { ignoreArmor: true, src: { type: 'plane' } }); a.plantSlow = B.slow; a.plantSlowT = B.slowTime; }
        }
        const p = rt.at(pl.d); pl.x = p.x; pl.y = p.y; pl.dx = p.dx;
      }
      if (!alive) this.planes = null;
    }
    this.ants = this.ants.filter((a) => !a.dead);
    if (this.pieces.length) { // v0.7.4 M2: a piece lives `window` s of wall time (dt / speed); it does not age while paused (update returns early)
      const k = dt / (this.rescueScale || 1);
      for (const q of this.pieces) q.left -= k;
      for (const q of this.pieces.filter((q) => q.left <= 0)) this.emit({ type: 'pieceExpire', id: q.id, x: q.x, y: q.y, bonus: q.bonus });
      this.pieces = this.pieces.filter((q) => q.left > 0);
    }

    // end conditions: the cookie is gone -> lose (with a rescue piece still alive the loss waits until it expires or is tapped)
    if (this.foodStored <= 1e-6 && !this.pieces.length) { this.foodStored = Math.max(0, this.foodStored); this.result = 'lose'; this.emit({ type: 'lose' }); }
    else if (this.nextWave >= this.waves.length && this.pending.length === 0 && this.ants.length === 0) {
      for (const q of this.pieces.slice()) this.collectPiece(q.id, true); // win: pieces left are collected automatically, the stars use the final food
      this.result = 'win'; this.emit({ type: 'win', perfect: this.perfect });
    }
  }
  // v0.6 item 2: single-target towers (Slingshot, Laser, Zapper's first zap, Gecko) aim at the ant with the FEWEST HP left.
  // The Slingshot skips ants its pebbles already in flight will finish (unless nothing else is in range). Tie -> the leader.
  weakestTarget(tw, inRange) {
    let pool = inRange;
    if (tw.type === 'slingshot' && this.projectiles.length) { // applies in every mode
      const pend = new Map();
      for (const p of this.projectiles) if (!p.target.dead) pend.set(p.target.id, (pend.get(p.target.id) || 0) + applyArmor(p.dmg, p.target.armor, false));
      const alive = inRange.filter((a) => a.hp - (pend.get(a.id) || 0) > 1e-6);
      if (alive.length) pool = alive;
    }
    const mode = tw.mode || 'weak';
    if (mode === 'carrier' || mode === 'front') { // v0.7.4 M1
      const maxThreat = (list) => list.reduce((b, a) => (this.threat(a) > this.threat(b) ? a : b));
      if (mode === 'carrier') { const cs = pool.filter((a) => a.state !== 'go'); if (cs.length) return maxThreat(cs); } // none carrying: falls through to Weakest
      else { const ws = pool.filter((a) => a.state === 'go'); return maxThreat(ws.length ? ws : pool); }
    }
    return pool.reduce((b, a) => (a.hp < b.hp - 1e-9 || (Math.abs(a.hp - b.hp) <= 1e-9 && this.threat(a) > this.threat(b)) ? a : b));
  }
  // v0.6 item 6: the Tractor lowers its bucket onto the trail tile next to it (trailDirection, like the marble / fan) and lifts
  // EVERY liftable ant on that tile off the trail (instant kill; carried food returns as for any kill). It only acts when at
  // least one liftable ant is on the tile. No trail next to it -> it does nothing.
  fireTractor(tw) {
    const d = tw.trailDir;
    if (!d) { tw.cd = 0.5; return; }
    const lift = tw.stat('liftSize');
    const on = this.ants.filter((a) => !a.dead && onTile(a, d.nc, d.nr) && liftable(a, lift));
    if (!on.length) { tw.cd = 0.05; return; } // ready: waits for an ant
    tw.cd = 1 / tw.stat('rate'); tw.fireFx = 0.9; tw.lifts = (tw.lifts || 0) + 1;
    this.emit({ type: 'scoop', tower: tw.id, x: tw.x, y: tw.y, tx: (d.nc + 0.5) * C.TILE, ty: (d.nr + 0.5) * C.TILE, dx: d.dx, dy: d.dy,
      ants: on.map((a) => ({ type: a.type, x: a.x, y: a.y, size: a.size, dir: a.dir })) });
    for (const a of on) this.kill(a, tw);
  }
  fireMarble(tw, T) {
    if (tw.balls >= T.maxBalls || !tw.trailDir || tw.runLen <= 0) return; // no trail next to it -> it does not roll
    const dx = tw.ax, dy = tw.ay; // away from the tower, along the straight trail
    const ex = tw.lx + dx * tw.runLen, ey = tw.ly + dy * tw.runLen;
    const any = this.ants.some((a) => !a.dead && !a.flying && segDist(a.x, a.y, tw.lx, tw.ly, ex, ey) <= 24);
    if (!any) return;
    this.balls.push({ x: tw.lx, y: tw.ly, dx, dy, left: tw.runLen, stuck: 0, travel: 0,
      r: tw.stat('ballRadius'), dmg: tw.stat('power'), speed: T.rollSpeed, hit: new Set(), src: tw, rot: 0 });
    tw.balls++;
    tw.cd = 1 / tw.stat('rate'); tw.fireFx = 0.3; this.emit({ type: 'roll', x: tw.x, y: tw.y });
  }
  reachFood(a) {
    const steal = Math.min(C.ANTS[a.type].steal, this.foodStored);
    this.foodStored -= steal;               // the cookie loses the piece immediately
    this.stats.stolen += steal;
    this.emit({ type: 'steal', x: a.x, y: a.y, n: steal, ant: a.type });
    if (this.cfg.carryBack && steal > 0) { a.state = 'back'; a.carrying = steal; a.d = this.route(a).length - 0.01; }
    else { if (!this.cfg.carryBack) this.foodDelivered += steal; a.dead = true; a.escaped = true; }
  }
  get stars() { return this.result === 'win' ? starsFor(this.foodStored, this.cfg.foodHP) : 0; }
}
function segDist(px, py, ax, ay, bx, by) {
  const vx = bx - ax, vy = by - ay, l2 = vx * vx + vy * vy || 1;
  const t = Math.max(0, Math.min(1, ((px - ax) * vx + (py - ay) * vy) / l2));
  return Math.hypot(px - (ax + vx * t), py - (ay + vy * t));
}
