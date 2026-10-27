// v0.6.2: scope = NEXT_VERSION_FIXES.md items 1-15 (item 5 untouched). New logic tested here: fewest-HP targeting in battle,
// tile-only trail items, Tractor size rules, five varied in-battle upgrades, tiered Shop unlock prices + "New" marker,
// card-pack chance of a new tower, the queen-win celebration hold and the World 2 gate (20 stars).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as C from '../src/config.js';
import { Battle, towerStat, onTile, liftable } from '../src/sim.js';
import * as M from '../src/meta.js';

const src = (f) => readFileSync(new URL(`../src/${f}`, import.meta.url), 'utf8');
const OLD = JSON.parse(readFileSync(new URL('../../backup-v0.6.1-vc13/tuning/tuning.json', import.meta.url), 'utf8'));
const TJ = JSON.parse(readFileSync(new URL('../../tuning/tuning.json', import.meta.url), 'utf8'));
const DECK = ['slingshot', 'spray', 'gate', 'fan', 'tractor'];
const mk = (o = {}) => { const b = new Battle({ levelIndex: 0, deck: DECK, seed: 1, ...o }); b.nextWaveAt = 1e9; return b; };
const centreD = (b, a, x, y) => { const rt = b.route(a); let best = null; for (let d = 0; d < rt.length; d += 1) { const p = rt.at(d); const k = Math.hypot(p.x - x, p.y - y); if (!best || k < best.k) best = { d, k }; } return best.d; };
const freeze = (...as) => { for (const a of as) a.stunT = 99; };
const seq = (...v) => { let i = 0; return () => v[Math.min(i++, v.length - 1)]; };
const sideSpot = (b, near) => { let best = null; for (let r = 0; r < 12; r++) for (let c = 0; c < 10; c++) { const t = b.tileInfo(c, r); if (!t.valid || t.onPath || t.tower) continue; const k = Math.hypot((c + 0.5) * 40 - near.x, (r + 0.5) * 40 - near.y); if (!best || k < best.k) best = { c, r, k }; } return best; };
const pathTiles = (b) => { const o = []; for (let r = 2; r < 11; r++) for (let c = 0; c < 10; c++) { const t = b.tileInfo(c, r); if (t.valid && t.onPath && !t.tower) o.push({ c, r }); } return o; };

// ---------- item 2 (verified in a real battle) ----------
test('item 2: in battle, each single-target tower fires at the ant with the fewest HP in range', () => {
  for (const type of ['slingshot', 'laser', 'lizard']) {
    const b = mk({ deck: [type, 'spray', 'glue', 'fan', 'ball'] });
    const a1 = b.spawn('worker', 0); const mid = b.route(a1).length * 0.3; a1.d = mid;
    const a2 = b.spawn('worker', mid + 10), a3 = b.spawn('worker', mid - 10);
    freeze(a1, a2, a3); b.update(0.01);
    a1.hp = 9; a2.hp = 8; a3.hp = 2; // a2 leads, a3 is the weakest
    const s = sideSpot(b, a1); const tw = b.addTower(type, s.c, s.r); tw.cd = 0;
    b.update(0.01);
    assert.equal(tw.target, a3.id, `${type} aims at the weakest`);
  }
});

// ---------- item 3 (all four trail items) ----------
test('item 3: Glue, Lava, Perfume and E-Gate affect an ant only while it is on their own square tile', () => {
  for (const type of ['glue', 'lava', 'pheromone', 'gate']) {
    const b = mk({ deck: ['slingshot', 'spray', type, 'fan', 'ball'] });
    const pt = pathTiles(b)[3]; const tw = b.addTower(type, pt.c, pt.r);
    const on = b.spawn('worker', 0); on.d = centreD(b, on, tw.x, tw.y);
    const near = b.spawn('worker', on.d + 26); // one step further along the trail: next tile, still within 1 tile of the centre
    freeze(on, near); b.update(0.01);
    assert.ok(onTile(on, tw.c, tw.r) && !onTile(near, tw.c, tw.r), type);
    on.stunT = 99; near.stunT = 99; const hp0 = near.hp;
    for (let i = 0; i < 20; i++) { b.update(0.05); }
    if (type === 'glue') { assert.ok(b.towers[0].stuckSet.has(on.id) && !b.towers[0].stuckSet.has(near.id), 'glue sticks only its tile'); }
    else { assert.ok(on.hp < on.maxHp, `${type} hurts the ant on its tile`); assert.equal(near.hp, hp0, `${type} ignores the next tile`); }
  }
});

// ---------- item 6: Tractor size rules ----------
test('item 6: Tractor lift size by card level (1-2 small, 3+ medium, 8+ large), 4th battle upgrade, never the queen, slow', () => {
  const lift = (bl, cl) => towerStat('tractor', 'liftSize', bl, cl);
  for (let cl = 1; cl <= 10; cl++) assert.equal(lift(1, cl), cl <= 2 ? 1 : cl <= 7 ? 2 : 3, `card L${cl}`);
  for (let cl = 1; cl <= 10; cl++) {
    for (let bl = 2; bl <= 6; bl++) {
      const up = bl - 1; // the upgrade just applied (1..5)
      const dLift = lift(bl, cl) - lift(bl - 1, cl);
      const dRate = towerStat('tractor', 'rate', bl, cl) - towerStat('tractor', 'rate', bl - 1, cl);
      if (up === 4 && lift(1, cl) < 3) { assert.equal(dLift, 1, `card L${cl}: 4th upgrade raises the lift size`); assert.equal(dRate, 0); }
      else { assert.equal(dLift, 0, `card L${cl} upgrade ${up}`); assert.ok(dRate > 0, `card L${cl} upgrade ${up} raises the rate`); }
    }
  }
  assert.ok(towerStat('tractor', 'rate', 1, 1) <= 0.15, 'slow: one scoop every ~7.7 s at L1');
  assert.ok(towerStat('tractor', 'rate', 6, 10) < 0.4, 'still slow at the top');
  const ant = (type) => ({ type, flying: false });
  for (const q of ['queen', 'queen2']) assert.equal(liftable(ant(q), 3), false);
  assert.deepEqual(['small', 'worker', 'big', 'heavy', 'armored'].map((t) => C.SIZE_RANK[C.ANTS[t].sizeClass]), [1, 2, 3, 3, 2], '3 sizes');
});

// ---------- item 11: five in-battle upgrades, Yair's design rules ----------
test('item 11: every tower has 5 in-battle upgrades; 1-2 stats per step; side towers with a range get power, range and rate; not cyclic', () => {
  const sig = (u) => Object.keys(u).filter((k) => k !== 'rateIfMaxLift' && k !== 'power').sort().join('+') || 'power'; // v0.7 D-T6: power is on (almost) every step -> compare the other stats; Lava (power every step, slow on steps 2+4 since v0.6.2) is exempt from the cycle check
  for (const [id, T] of Object.entries(C.TOWERS)) {
    assert.equal(T.upgrades.length, 5, id);
    // v0.7 D-T6 adds a `power` multiplier to steps that had other stats -> up to 3 keys (the v0.6.2 stats + power)
    for (const u of T.upgrades) { const n = Object.keys(u).filter((k) => k !== 'rateIfMaxLift' && k !== 'power').length; assert.ok(n >= 0 && n <= 2 && Object.keys(u).length >= 1, `${id}: one stat per step, occasionally two (+ power)`); }
    const s = T.upgrades.map(sig);
    if (id !== 'lava') for (let i = 0; i + 3 < s.length; i++) assert.ok(!(s[i] === s[i + 2] && s[i + 1] === s[i + 3]), `${id}: no A,B,A,B cycle (${s.join(' | ')})`);
    for (let i = 0; i + 1 < s.length; i++) if (id !== 'tractor') assert.ok(s[i] !== s[i + 1] || s.filter((x) => x === s[i]).length < 4, id);
    if (T.place === 'side' && T.stats.range != null && T.stats.power != null) {
      for (const k of ['power', 'rate', 'range']) assert.ok(T.upgrades.some((u) => k in u), `${id}: an upgrade improves ${k}`);
    }
    // every step is an improvement (multiplier > 1, except times that get shorter: chewTime)
    for (const u of T.upgrades) for (const [k, v] of Object.entries(u)) if (k !== 'liftSize') assert.ok(k === 'chewTime' ? v < 1 : v > 1, `${id} ${k}`);
  }
  // the resequenced towers keep their v0.6.1 L6 totals for every stat they had (no rebalancing); only a range step was added
  const prod = (ups, k) => ups.reduce((p, u) => p * (u[k] ?? 1), 1);
  for (const id of ['sound', 'laser', 'zapper', 'spray']) {
    const o = OLD.towers[id].battleUpgrades, n = TJ.towers[id].battleUpgrades;
    for (const k of new Set(o.flatMap((u) => Object.keys(u)))) if (k !== 'power') assert.ok(Math.abs(prod(o, k) - prod(n, k)) < 1e-9, `${id} ${k} L6 total kept`);
  }
  const noPower = (ups) => ups.map((u) => { const c = { ...u }; delete c.power; return c; }); // v0.7 D-T6 changes only `power`
  for (const id of Object.keys(TJ.towers)) if (!['sound', 'laser', 'zapper', 'spray'].includes(id)) assert.deepEqual(noPower(TJ.towers[id].battleUpgrades), noPower(OLD.towers[id].battleUpgrades), `${id} unchanged`);
});

// ---------- item 12: tiered Shop unlock prices + "New" marker ----------
test('item 12: Shop unlock prices are tiered by base power (100/200/400) and the unlocked card is marked New', () => {
  const tiers = { 100: ['sound', 'pheromone', 'lava'], 200: ['lizard', 'gate', 'zapper'], 400: ['laser', 'tractor'] };
  for (const [p, ids] of Object.entries(tiers)) for (const id of ids) assert.equal(M.unlockPrice(id), Number(p), id);
  const locked = M.lockedCards(M.newSave()).sort(); assert.deepEqual(locked, Object.values(tiers).flat().sort(), 'every lockable tower has a tier');
  assert.equal(C.ECONOMY.shop.cardUnlock, undefined, 'the flat 60c price is gone');
  for (const [id, p] of [['lava', 100], ['zapper', 200], ['laser', 400]]) {
    const s = M.newSave(); s.coins = p - 1;
    assert.equal(M.buyCardUnlock(s, id), false, `${id}: ${p - 1} coins are not enough`);
    s.coins = p; assert.ok(M.buyCardUnlock(s, id)); assert.equal(s.coins, 0);
    assert.ok(s.cards[id].unlocked && s.cards[id].level === 1 && s.cards[id].fresh === true, `${id}: unlocked at L1, fresh (New marker)`);
  }
  // available any time: not tied to stage progress
  const s = M.newSave(); s.coins = 400; assert.ok(M.buyCardUnlock(s, 'tractor'), 'a brand-new save can unlock in the Shop');
  assert.equal(M.cheapestCardPrice(M.newSave()), C.ECONOMY.shop.cardL1);
  const all = M.newSave(); for (const id of C.ALL_CARDS) all.cards[id] = M.newCard(); assert.equal(M.cheapestCardPrice(all), 100, 'cheapest unlock = 100c');
  const g = src('game.js'); assert.ok(/Unlock \$\{up\}c/.test(g) && /M\.unlockPrice\(id\)/.test(g), 'the shop shows each tower\'s own price');
  // the prize paths are unchanged
  assert.ok(/zapperGift/.test(src('meta.js')) && C.ECONOMY.perfectPrizes.length === 5);
});

// ---------- item 13: card packs can hold a new tower ----------
test('item 13: a card pack holds ONE new (locked) tower with chance packNewTowerChance (tuning.json)', () => {
  const ch = C.ECONOMY.shop.packNewTowerChance; assert.equal(ch, TJ.shop.packNewTowerChance); assert.ok(ch > 0 && ch <= 0.15, 'modest');
  // rng below the chance -> a new tower is one of the 5 cards
  const s = M.newSave(); s.coins = 40; const locked0 = M.lockedCards(s);
  const got = M.buyPack(s, seq(ch - 0.001, 0, 0.1, 0.2, 0.3, 0.4, 0.5));
  assert.equal(got.length, C.ECONOMY.shop.cardPackSize); assert.equal(got.newTower, locked0[0]);
  assert.ok(s.cards[got.newTower].unlocked && s.cards[got.newTower].fresh, 'new tower unlocked + New marker');
  assert.equal(got.filter((id) => locked0.includes(id)).length, 1, 'exactly one new tower');
  // rng at/above the chance -> only owned towers
  const t = M.newSave(); t.coins = 40; const g2 = M.buyPack(t, seq(ch, 0.1, 0.2, 0.3, 0.4, 0.5));
  assert.equal(g2.newTower, null); assert.ok(g2.every((id) => C.STARTER_CARDS.includes(id))); assert.equal(M.lockedCards(t).length, locked0.length);
  // nothing locked -> never a new tower, still 5 cards
  const u = M.newSave(); u.coins = 40; for (const id of C.ALL_CARDS) M.unlockCard(u, id);
  const g3 = M.buyPack(u, () => 0); assert.equal(g3.newTower, null); assert.equal(g3.length, 5);
  // the long-run rate matches the chance (deterministic LCG)
  let x = 12345; const rng = () => (x = (x * 1103515245 + 12345) % 2147483648) / 2147483648;
  let hits = 0; const N = 4000;
  for (let i = 0; i < N; i++) { const v = M.newSave(); v.coins = 40; if (M.buyPack(v, rng).newTower) hits++; }
  assert.ok(Math.abs(hits / N - ch) < 0.02, `rate ${hits / N}`);
  assert.ok(/openPackReveal\(got, \{ source: 'paid', newTower: got\.newTower \}\)/.test(src('game.js')), 'v0.7: a pack (with or without a new tower) opens the pack reveal');
  // the one-time Zapper gift is unchanged (4 owned + Zapper, no random new tower)
  const z = M.newSave(); z.onboard.zapperGift = 'pending'; const zg = M.claimZapperGift(z, () => 0);
  assert.equal(zg.got.length, 5); assert.equal(zg.got.filter((id) => !C.STARTER_CARDS.includes(id)).join(), 'zapper');
});

// ---------- item 14: queen-win celebration above the result panel ----------
test('item 14: on a queen win the cheer is drawn above the result panel and the panel + buttons wait ~4 s', () => {
  const g = src('game.js');
  assert.ok(C.UI.queenCheerHold >= 3.5 && C.UI.queenCheerHold <= 4.6);
  const rb = g.slice(g.indexOf('function renderBattle('), g.indexOf('function tileArea('));
  assert.ok(rb.indexOf('renderResult(dt)') >= 0 && rb.indexOf('drawQueenCheer(') > rb.indexOf('renderResult(dt)'), 'cheer drawn after (above) the result panel');
  assert.ok(/const hold = queenKilled \? C\.UI\.queenCheerHold : 0/.test(g), 'hold only on a queen win (queenKilled = win && queen)');
  const rr = g.slice(g.indexOf('function renderResult('), g.indexOf('function renderResult(') + 2000);
  const holdAt = rr.indexOf('if (R.hold > 0)'); assert.ok(holdAt > 0 && holdAt < rr.indexOf('panel('), 'no panel while holding');
  assert.ok(rr.slice(holdAt, rr.indexOf('return;', holdAt)).indexOf('drawButton') < 0, 'no buttons while holding');
  const r = g.slice(g.indexOf('function render(dt)'), g.indexOf('function render(dt)') + 700);
  assert.ok(r.indexOf('renderFireworks(dt)') > r.indexOf("renderBattle(dt)"), 'fireworks above the battle screen and its result panel');
});

// ---------- item 15: World 2 gate ----------
test('item 15: World 2 needs all world-1 levels won and 20 (not 25) of 30 stars (v0.7: 18)', () => {
  assert.equal(TJ.worlds[1].unlock.minStarsInWorld, 18); assert.equal(TJ.worlds[1].unlock.allLevelsWonInWorld, 1);
  const s = M.newSave(); const W2 = C.WORLD_START[2];
  for (let i = 0; i < 10; i++) s.levels[i] = { stars: 2, cleared: true };
  assert.equal(M.levelUnlocked(s, W2), true, '20 stars');
  s.levels[3].stars = 1; s.levels[4].stars = 1; assert.equal(M.levelUnlocked(s, W2), true, '18 stars');
  s.levels[5].stars = 1; assert.equal(M.levelUnlocked(s, W2), false, '17 stars');
  for (let i = 0; i < 10; i++) s.levels[i].stars = 3; s.levels[9].cleared = false;
  assert.equal(M.levelUnlocked(s, W2), false, 'all levels must still be won');
});

// ---------- item 1 (coins for time) still on top ----------
test('item 1: +1 coin per 3 s survived on top of the win formula', () => {
  const a = M.battleCoins('win', { kills: 20, foodLeft: 90, levelIndex: 4 }), b = M.battleCoins('win', { kills: 20, foodLeft: 90, levelIndex: 4, time: 151 });
  assert.equal(b.total - a.total, 50);
});

// ---------- standing rules ----------
test('standing rules: the treat never speaks; version 0.7.0 / vc15', () => {
  assert.ok(!/treatBubble|speech/i.test(src('treat.js')));
  assert.equal(JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')).version, '0.7.0');
  assert.match(readFileSync(new URL('../android/app/build.gradle', import.meta.url), 'utf8'), /versionCode 15\b/);
});
