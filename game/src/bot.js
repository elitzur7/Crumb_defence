// Simple bots used by the headless level simulation and tests.
import * as C from './config.js';
import { Battle, levelAntTypes, DIRS, towerStat, isDamageCard } from './sim.js';

const PRIORITY = ['laser', 'slingshot', 'sound', 'lizard', 'spray', 'zapper', 'gate', 'lava', 'ball', 'tractor', 'glue', 'pheromone', 'fan'];
const VALUE = { laser: 1.3, slingshot: 1, sound: 1.1, lizard: 1.1, spray: 1, zapper: 0.9, gate: 0.8, lava: 0.8, ball: 0.9, glue: 0.6, pheromone: 0.7, fan: 0.5, tractor: 0.8 };

export function chooseDeck(unlocked, levelIndex, { prefer = [] } = {}) {
  const types = levelAntTypes(levelIndex);
  const flyers = types.some((t) => C.ANTS[t].flying) || types.some((t) => C.ANTS[t].spawn && C.ANTS[t].spawn.type === 'flyer');
  const armored = types.some((t) => (C.ANTS[t].armor || 0) >= 4 && !C.ANTS[t].boss); // knights (incl. v0.4 Sprint / Heavy Knight)
  let pri = PRIORITY.filter((id) => unlocked.includes(id));
  if (armored) pri = ['sound', 'gate', ...pri.filter((x) => x !== 'sound' && x !== 'gate')].filter((id) => unlocked.includes(id));
  const deck = [];
  for (const id of prefer) if (unlocked.includes(id) && !deck.includes(id)) deck.push(id); // forced cards (balance checks, e.g. the Tractor)
  if (flyers) { for (const id of C.AIR_COUNTERS) if (unlocked.includes(id)) deck.push(id); }
  for (const id of pri) { if (deck.length >= C.BATTLE.deckSize) break; if (!deck.includes(id)) deck.push(id); }
  return deck;
}

function coverage(b, x, y, range) {
  let n = 0;
  for (const rt of b.routes) for (let d = 0; d <= rt.length; d += 10) { const p = rt.at(d); if (Math.hypot(p.x - x, p.y - y) <= range) n++; }
  return n;
}
// v0.5: directional towers act along the straight trail next to them (sim trailDirection), so a spot's value is fixed:
// fan = pushback score of its wind, marble = length of its roll (preferring rolls that go against the ants).
export function directionalScore(b, card, c, r) {
  const T = C.TOWERS[card];
  const tmp = b.addTower(card, c, r); b.towers.pop();
  if (!tmp.trailDir) return card === 'fan' ? -1 : 0; // v0.5: no trail next to it -> no wind / no roll
  if (card === 'fan') return b.windScore(tmp.x, tmp.y, tmp.ax, tmp.ay, tmp.stat('range'));
  if (card === 'tractor') { // v0.6: scoop tile = the trail cell next to it; later on the trail is better (more ants pass by then)
    const x = (tmp.trailDir.nc + 0.5) * C.TILE, y = (tmp.trailDir.nr + 0.5) * C.TILE; const nd = b.nearestOnTrail(x, y);
    return 1 + nd.d / b.routes[nd.ri].length;
  }
  if (tmp.runLen <= 0) return 0;
  const nd = b.nearestOnTrail((tmp.lc + 0.5) * C.TILE, (tmp.lr + 0.5) * C.TILE); const p = b.routes[nd.ri].at(nd.d);
  const up = -(tmp.ax * p.dx + tmp.ay * p.dy);
  return tmp.runLen * (up > 0.5 ? 1 : 0.4);
}

function bestTile(b, card) {
  const T = C.TOWERS[card];
  let best = null, bs = -1;
  for (let c = 0; c < C.GRID_COLS; c++) for (let r = 0; r < C.GRID_ROWS; r++) {
    const ti = b.tileInfo(c, r); if (!ti.valid || ti.tower) continue;
    if (T.place === 'path' ? !ti.onPath : ti.onPath) continue;
    if (T.nearTrail && !b.touchesTrail(c, r)) continue;
    const x = (c + 0.5) * C.TILE, y = (r + 0.5) * C.TILE;
    let s;
    if (T.place === 'path') {
      const nd = b.nearestOnTrail(x, y);
      s = nd.d / b.routes[nd.ri].length * 5;
      for (const tw of b.towers) if (C.TOWERS[tw.type].place === 'side' && Math.hypot(tw.x - x, tw.y - y) <= tw.stat('range')) s += 3;
      for (const tw of b.towers) if (tw.type === card && Math.hypot(tw.x - x, tw.y - y) < 80) s -= 6;
    } else if (card === 'ball') {
      s = directionalScore(b, card, c, r) / 10;
    } else if (card === 'fan' || card === 'tractor') {
      s = directionalScore(b, card, c, r);
    } else {
      s = coverage(b, x, y, towerStat(card, 'range', 1, b.cardLevels[card] || 1));
    }
    if (s > bs) { bs = s; best = { c, r, s }; }
  }
  return best;
}

export function smartBotStep(b) {
  if (b.result) return null;
  // v0.7 D-R3 (sim S2): before the first card, use the FREE redraw when the deck's top-priority damage card is not in the hand
  if (b.cardsPlayed === 0 && b.rerollPrice === 0 && !b.botRedrawn) {
    const top = b.deck.find(isDamageCard);
    b.botRedrawn = true;
    if (top && !b.picks.includes(top)) b.reroll();
  }
  if (b.crumbs < b.nextCardCost) return null;
  let bestMove = null, bestScore = -Infinity;
  b.picks.forEach((card, i) => {
    const same = b.towers.filter((t) => t.type === card);
    const upg = same.filter((t) => t.lvl < b.cfg.maxInBattleLevel).sort((a, z) => a.lvl - z.lvl)[0];
    const v = VALUE[card] || 1;
    // need anti-air early if flyers are coming
    const airNeed = C.AIR_COUNTERS.includes(card) && b.towers.filter((t) => C.AIR_COUNTERS.includes(t.type)).length < 2 && levelAntTypes(b.levelIndex).some((t) => C.ANTS[t].flying) ? 1.5 : 0;
    // v0.4: with half the ants there are fewer crumbs - open with a ground-damage tower (it earns the crumbs), not anti-air/utility
    const noEarner = !b.towers.some((t) => isDamageCard(t.type)) && b.picks.some(isDamageCard);
    if (noEarner && !isDamageCard(card)) return;
    if (same.length < 2 || !upg) {
      const t = bestTile(b, card);
      if (t) { const sc = v * (2 - same.length * 0.5) + airNeed; if (sc > bestScore) { bestScore = sc; bestMove = { i, c: t.c, r: t.r }; } }
    }
    if (upg) { const sc = v * 1.2 - upg.lvl * 0.2 + airNeed * 0.5; if (sc > bestScore) { bestScore = sc; bestMove = { i, c: upg.c, r: upg.r }; } }
  });
  if (!bestMove) return null;
  const card = b.picks[bestMove.i];
  const res = b.playCard(bestMove.i, bestMove.c, bestMove.r);
  return res;
}

export function randomBotStep(b, rng) {
  if (b.result || b.crumbs < b.nextCardCost) return null;
  const i = Math.floor(rng() * b.picks.length);
  for (let k = 0; k < 40; k++) {
    const c = Math.floor(rng() * C.GRID_COLS), r = Math.floor(rng() * C.GRID_ROWS);
    if (b.canPlay(i, c, r).ok) return b.playCard(i, c, r);
  }
  return null;
}

function maybeBonus(b) {
  if (b.foodStored > 70 || b.bonusUsesLeft <= 0 || b.ants.length < 6) return;
  for (const type of b.bonusTypes) {
    if (!b.canUseBonus(type)) continue;
    // aim at the ant closest to the cookie
    const a = b.ants.reduce((m, x) => (b.threat(x) > b.threat(m) ? x : m), b.ants[0]);
    b.useBonus(type, a.x, a.y); return;
  }
}

// Plays a full level. bot: 'smart' | 'random' | 'idle'
export function playLevel(levelIndex, { bot = 'smart', unlocked, cardLevel = 1, seed = 1, useBonuses = false, battleCfg, dt = 1 / 30, maxTime = 3600, prefer } = {}) {
  const deck = chooseDeck(unlocked, levelIndex, { prefer });
  const cardLevels = {}; for (const id of C.ALL_CARDS) cardLevels[id] = cardLevel;
  const b = new Battle({ levelIndex, deck, seed, cardLevels, bonusTypes: ['bomb', 'plane'], bonusStock: { bomb: 9, plane: 9, freeze: 9, decoy: 9 }, battleCfg });
  let rng = (() => { let s = seed * 9301 + 49297; return () => ((s = (s * 9301 + 49297) % 233280) / 233280); })();
  let think = 0;
  while (!b.result && b.time < maxTime) {
    b.update(dt);
    think -= dt;
    if (think <= 0) {
      think = 0.5;
      if (bot === 'smart') smartBotStep(b);
      else if (bot === 'random') randomBotStep(b, rng);
      if (useBonuses) maybeBonus(b);
    }
  }
  return { levelIndex, result: b.result || 'timeout', stars: b.stars, food: b.foodStored, time: Math.round(b.time), towers: b.towers.length,
    cards: b.cardsPlayed, crumbs: b.crumbsEarned, kills: b.stats.kills, spawned: b.stats.spawned, deck, bonusesUsed: b.cfg.maxBonusUses - b.bonusUsesLeft };
}

// cards the simulator assumes the player has OBTAINED (bought / won) by level i - v0.3 has no auto-unlock
export function unlockedAt(levelIndex) {
  return [...C.STARTER_CARDS, ...C.SIM_ASSUMED_CARDS.slice(0, levelIndex)];
}
