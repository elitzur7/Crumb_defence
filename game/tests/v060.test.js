// v0.6.0: time coins, fewest-HP targeting, tile-only trail items, cards without copies + merge 3 -> 1, Merge all,
// Zapper onboarding, the Tractor, card pictures, sprite cache, level shapes, five in-battle upgrades.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as C from '../src/config.js';
import { Battle, towerStat, onTile, liftable, formatStat } from '../src/sim.js';
import * as M from '../src/meta.js';
import { playLevel, unlockedAt } from '../src/bot.js';

const src = (f) => readFileSync(new URL(`../src/${f}`, import.meta.url), 'utf8');
const DECK = ['slingshot', 'spray', 'gate', 'fan', 'tractor'];
const mk = (o = {}) => { const b = new Battle({ levelIndex: 0, deck: DECK, seed: 1, ...o }); b.nextWaveAt = 1e9; return b; };
const pathTile = (b) => { for (let r = 3; r < 12; r++) for (let c = 0; c < 10; c++) { const t = b.tileInfo(c, r); if (t.valid && t.onPath && !t.tower) return { c, r }; } };
const centreD = (b, a, x, y) => { const rt = b.route(a); let best = null; for (let d = 0; d < rt.length; d += 1) { const p = rt.at(d); const k = Math.hypot(p.x - x, p.y - y); if (!best || k < best.k) best = { d, k }; } return best.d; };
const freeze = (...as) => { for (const a of as) a.stunT = 99; };

// ---------- item 1: coins for time survived ----------
test('item 1: + floor(time / 3) coins on a win (own line) and on a loss (inside the loss cap)', () => {
  assert.equal(C.ECONOMY.secondsPerCoin, 3);
  assert.equal(M.timeCoins(0), 0); assert.equal(M.timeCoins(2.9), 0); assert.equal(M.timeCoins(3), 1); assert.equal(M.timeCoins(299.9), 99);
  const w0 = M.battleCoins('win', { kills: 50, foodLeft: 80, levelIndex: 2 });
  const w = M.battleCoins('win', { kills: 50, foodLeft: 80, levelIndex: 2, time: 200 });
  assert.equal(w.parts.time, 66); assert.equal(w.total, w0.total + 66);
  const l = M.battleCoins('lose', { kills: 40, time: 30 });
  assert.deepEqual(l.parts, { kills: 4, time: 10 }); assert.equal(l.total, 14);
  assert.equal(M.battleCoins('lose', { kills: 100, time: 300 }).total, C.ECONOMY.lossCap, 'cap covers kills + time together');
  assert.equal(M.battleCoins('lose', { kills: 200, time: 300 }).parts.time, 0, 'kills first, time fills the rest');
  const s = M.newSave(); const c0 = s.coins;
  const out = M.applyBattleResult(s, 0, 'win', 3, { kills: 10, foodLeft: 100, time: 90 }, () => 0);
  assert.equal(out.parts.time, 30); assert.equal(s.coins - c0, out.coins);
  const g = src('game.js'); assert.ok(/Time survived/.test(g), 'results show its own line'); assert.ok(/time: b\.time/.test(g));
});

// ---------- item 2: fewest HP ----------
test('item 2: Slingshot, Laser, Zapper and Gecko aim at the ant with the fewest HP left; chain jumps stay nearest-flyer', () => {
  const b = mk();
  const a1 = b.spawn('worker', 100), a2 = b.spawn('worker', 150), a3 = b.spawn('worker', 60);
  a1.hp = 7; a2.hp = 3; a3.hp = 9;
  for (const type of ['laser', 'zapper', 'lizard', 'slingshot']) assert.equal(b.weakestTarget({ type }, [a1, a2, a3]), a2, type);
  a1.hp = 3; assert.equal(b.weakestTarget({ type: 'laser' }, [a1, a2, a3]), a2, 'tie -> the one further along (the leader)');
  const sim = src('sim.js');
  assert.match(sim, /const LOWEST_HP = new Set\(\['slingshot', 'laser', 'zapper', 'lizard'\]\)/);
  for (const id of ['slingshot', 'laser', 'zapper', 'lizard']) assert.ok(/fewest HP/i.test(C.TOWERS[id].desc + ' ' + C.TOWERS[id].ability), id + ' text');
});

// ---------- item 3: trail items cover their own tile ----------
test('item 3: Glue / Lava / Perfume / Gate act only on their own square tile; upgrades never grow it', () => {
  const b = mk(); const pt = pathTile(b); const g = b.addTower('gate', pt.c, pt.r);
  const a = b.spawn('worker', 0); a.d = centreD(b, a, g.x, g.y); const out = b.spawn('worker', a.d + 30);
  freeze(a, out); for (let i = 0; i < 20; i++) b.update(0.05);
  assert.ok(onTile(a, g.c, g.r) && !onTile(out, g.c, g.r));
  assert.ok(Math.hypot(out.x - g.x, out.y - g.y) <= 40, 'inside the old 1-tile circle ...');
  assert.ok(a.hp < a.maxHp); assert.equal(out.hp, out.maxHp, '... but outside the square tile: untouched');
  for (const id of ['glue', 'pheromone', 'gate', 'lava']) {
    for (let l = 1; l <= C.BATTLE.maxInBattleLevel; l++) for (const cl of [1, 10]) assert.equal(towerStat(id, 'range', l, cl), C.TILE, id);
    assert.ok(C.TOWERS[id].upgrades.every((u) => !('range' in u)) && C.TOWERS[id].cardUpgrades.every((u) => !('range' in u)), id);
    assert.equal(formatStat(id, 'range', 40), 'its tile');
  }
});

// ---------- item 4: no copies ----------
test('item 4: no "copies" anywhere - cards L1..L4 only, merge 3 same-level cards -> 1 of the next level at every level', () => {
  assert.equal(C.ECONOMY.shop.cardCopy, undefined);
  const s = M.newSave(); s.coins = 1e6;
  for (const id of C.ALL_CARDS) assert.ok(!('copies' in s.cards[id]), id);
  M.addCards(s, 'spray', 4, 3);
  const r = M.mergeAt(s, 'spray', 4); assert.deepEqual([r.from, r.to], [4, 5]); assert.equal(s.cards.spray.level, 5);
  assert.equal(M.mergeRow(s.cards.spray, 1).need, 3);
  for (const f of ['game.js', 'meta.js', 'sim.js', 'config.js']) assert.ok(!/['"`][^'"`\n]*\bcop(y|ies)\b[^'"`\n]*['"`]/i.test(src(f).replace(/\/\/.*$/gm, '')), f + ': no "copies" text');
  assert.ok(!/addCopies/.test(src('meta.js')));
});
test('item 4: saves migrate with no lost progress (each copy -> one L1 card; copy-only types unlocked)', () => {
  const old = { version: 3, coins: 9, diamonds: 1, cards: {}, bonusStock: {}, levels: Array.from({ length: 20 }, () => ({ stars: 0, cleared: false })), calendar: M.newCalendarState() };
  for (const id of C.ALL_CARDS) old.cards[id] = { unlocked: false, level: 0, copies: 0, inv: {}, seen: [], fresh: false };
  old.cards.slingshot = { unlocked: true, level: 3, copies: 2, inv: { 1: 1, 3: 1 }, seen: [1, 2, 3], fresh: false };
  old.cards.laser.copies = 2;
  const store = new Map([[M.SAVE_KEY, JSON.stringify(old)]]); const st = { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, v) };
  const s = M.loadSave(st);
  assert.deepEqual(s.cards.slingshot.inv, { 1: 3, 3: 1 }); assert.equal(s.cards.slingshot.level, 3);
  assert.ok(s.cards.laser.unlocked); assert.deepEqual(s.cards.laser.inv, { 1: 2 });
  for (const id of C.ALL_CARDS) assert.ok(!('copies' in s.cards[id]), id);
  assert.equal(s.version, M.SAVE_VERSION); assert.equal(s.coins, 9);
});

// ---------- item 5: Zapper onboarding ----------
test('item 5: first stage-2 win -> one free 5-card gift (4 random + Zapper); existing players past stage 2 get the free pack once (v0.7 D-P0)', () => {
  const s = M.newSave(); assert.equal(s.cards.zapper.unlocked, false);
  M.applyBattleResult(s, 0, 'win', 3, {}, () => 0); assert.equal(M.zapperGiftPending(s), false);
  const out = M.applyBattleResult(s, 1, 'win', 3, {}, () => 0); assert.equal(out.zapperGift, true); assert.ok(M.zapperGiftPending(s));
  const n0 = C.ALL_CARDS.reduce((k, id) => k + M.totalCards(s.cards[id]), 0); const coins = s.coins;
  const g = M.claimZapperGift(s, () => 0.3);
  assert.equal(g.got.length, 5); assert.equal(g.got.at(-1), 'zapper'); assert.ok(g.zapper.newType);
  assert.equal(s.coins, coins, 'free'); assert.equal(C.ALL_CARDS.reduce((k, id) => k + M.totalCards(s.cards[id]), 0), n0 + 5);
  assert.equal(M.claimZapperGift(s), null, 'one-time'); assert.equal(M.applyBattleResult(s, 1, 'win', 3, {}, () => 0).zapperGift, undefined);
  // an existing player past stage 2 without a Zapper
  const old = { version: 3, coins: 0, cards: {}, bonusStock: {}, levels: Array.from({ length: 20 }, (_, i) => ({ stars: 3, cleared: i < 4 })), calendar: M.newCalendarState() };
  for (const id of C.ALL_CARDS) old.cards[id] = C.STARTER_CARDS.includes(id) ? { unlocked: true, level: 1, inv: { 1: 1 }, seen: [1], fresh: false } : { unlocked: false, level: 0, inv: {}, seen: [], fresh: false };
  const store = new Map([[M.SAVE_KEY, JSON.stringify(old)]]); const st = { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, v) };
  // v0.7 D-P0: no direct Zapper any more - the free pack (always with the Zapper card) waits in the Shop, once
  const l = M.loadSave(st); assert.equal(l.cards.zapper.unlocked, false); assert.equal(l.onboard.grantedOnLoad, false); assert.equal(M.zapperGiftPending(l), true);
  const lg = M.claimZapperGift(l, () => 0.3); assert.equal(lg.got.length, 5); assert.ok(l.cards.zapper.unlocked);
  M.writeSave(st, l); assert.equal(M.zapperGiftPending(M.loadSave(st)), false, 'once');
  const gs = src('game.js');
  assert.ok(/onboardSpot\(/.test(gs) && /drawFinger\(/.test(gs) && /claimZapperGift/.test(gs) && /openPackReveal/.test(gs));
});

// ---------- item 6: the Tractor ----------
test('item 6: Tractor - scoops ONE trail tile beside it, lifts every liftable ant there (instant kill), never a queen', () => {
  const T = C.TOWERS.tractor; assert.equal(T.kind, 'tower'); assert.equal(T.place, 'side'); assert.ok(C.ALL_CARDS.includes('tractor'));
  assert.ok(T.stats.rate >= 0.12 && T.stats.rate <= 0.15);
  // lift sizes by card level: L1-2 small, L3+ regular, L8+ large
  assert.deepEqual([1, 2, 3, 7, 8, 10].map((cl) => towerStat('tractor', 'liftSize', 1, cl)), [1, 1, 2, 2, 3, 3]);
  // the 4th in-battle upgrade (battle L5) raises the lift size, or the rate once the card lifts everything
  assert.equal(towerStat('tractor', 'liftSize', 4, 1), 1); assert.equal(towerStat('tractor', 'liftSize', 5, 1), 2);
  assert.equal(towerStat('tractor', 'rate', 5, 1), towerStat('tractor', 'rate', 4, 1));
  assert.equal(towerStat('tractor', 'liftSize', 5, 8), 3); assert.ok(towerStat('tractor', 'rate', 5, 8) > towerStat('tractor', 'rate', 4, 8));
  for (const l of [2, 3, 4, 6]) assert.ok(towerStat('tractor', 'rate', l, 1) > towerStat('tractor', 'rate', l - 1, 1), 'other upgrades raise the rate');
  const ant = (type) => ({ type, flying: !!C.ANTS[type].flying });
  assert.ok(liftable(ant('small'), 1) && !liftable(ant('worker'), 1) && liftable(ant('worker'), 2) && !liftable(ant('big'), 2) && liftable(ant('big'), 3));
  assert.ok(!liftable(ant('queen'), 3) && !liftable(ant('queen2'), 3), 'the queen is never lifted');
  // in a battle
  const b = mk({ cardLevels: { tractor: 3 } });
  let tw = null;
  for (let r = 0; r < 12 && !tw; r++) for (let c = 0; c < 10 && !tw; c++) { const t = b.tileInfo(c, r); if (t.valid && !t.onPath && !t.tower && b.trailDirection(c, r)) tw = b.addTower('tractor', c, r); }
  const d = tw.trailDir; const tx = (d.nc + 0.5) * C.TILE, ty = (d.nr + 0.5) * C.TILE;
  const w = b.spawn('worker', 0); w.d = centreD(b, w, tx, ty); const sm = b.spawn('small', w.d + 4); const big = b.spawn('big', w.d - 4); const far = b.spawn('worker', w.d + 120);
  freeze(w, sm, big, far); b.update(0.01);
  b.fireTractor(tw);
  assert.ok(w.dead && sm.dead, 'all liftable ants on the tile'); assert.ok(!big.dead, 'too big for a card-L3 tractor'); assert.ok(!far.dead, 'only that one tile');
  const ev = b.events.find((e) => e.type === 'scoop'); assert.ok(ev && ev.ants.length === 2);
  assert.ok(Math.abs(tw.cd - 1 / tw.stat('rate')) < 1e-9);
  // nothing liftable on the tile -> it does not spend its scoop
  const tw2 = b.addTower('tractor', tw.c, tw.r); tw2.cd = 0; b.fireTractor(tw2); assert.ok(tw2.cd < 0.1 && !tw2.lifts);
  // varied card sequence
  assert.ok(T.cardUpgrades.some((u) => 'liftSize' in u) && T.cardUpgrades.some((u) => 'rate' in u));
  assert.ok(/case 'tractor'/.test(src('art.js')) && /case 'thrown'/.test(src('game.js')));
});

// ---------- items 7/8: card pictures + Merge all ----------
test('items 7/8: card pictures on the Cards + card screens; Merge all does every ready merge, lowest level first', () => {
  const g = src('game.js');
  assert.ok(/function drawCardPic\(/.test(g)); assert.ok((g.match(/drawCardPic\(/g) || []).length >= 4);
  assert.ok(/Merge all/.test(g) && /M\.mergeAll\(/.test(g));
  const s = M.newSave(); s.coins = 1e6; M.addCards(s, 'slingshot', 1, 8); // 9 x L1 -> 3 x L2 -> 1 x L3
  const done = M.mergeAll(s); assert.equal(done.length, 4); assert.equal(s.cards.slingshot.inv[3], 1); assert.equal(M.totalCards(s.cards.slingshot), 1);
  const p = M.newSave(); p.coins = C.MERGE.coinCost[2]; M.addCards(p, 'spray', 1, 5); M.addCards(p, 'glue', 1, 2);
  assert.equal(M.mergeAll(p).length, 1, 'stops when the coins run out'); assert.equal(p.coins, 0);
});

// ---------- items 9/10: sprite cache, level shapes ----------
test('items 9/10: tower bodies cached as offscreen sprites; upgrade levels change the tower shape', () => {
  const a = src('art.js');
  assert.ok(/function baked\(/.test(a) && /export function spriteCacheStats/.test(a)); // v0.6.1: cachedPart() -> baked() (whole bodies, see v061.test.js)
  for (const k of ["'pad'", "'plinth'", "'tractorBody'"]) assert.ok(a.includes(k), k);
  assert.ok(/function levelParts\(/.test(a));
  assert.ok(/lvl >= 6/.test(a), 'crown at the top level');
});

// ---------- item 11: five in-battle upgrades ----------
test('item 11: every tower has five in-battle upgrades (max level 6), sequences differ, difficulty holds', () => {
  assert.equal(C.BATTLE.maxInBattleLevel, 6);
  const seqs = new Set();
  for (const [id, T] of Object.entries(C.TOWERS)) { assert.equal(T.upgrades.length, 5, id); seqs.add(JSON.stringify(T.upgrades.map((u) => Object.keys(u).sort()))); }
  assert.ok(seqs.size >= 6, 'varied sequences');
  for (const L of [0, 4, 9]) for (let seed = 1; seed <= 3; seed++) assert.equal(playLevel(L, { unlocked: unlockedAt(L), seed, cardLevel: 1 }).result, 'win', `level ${L + 1} seed ${seed}`);
});
