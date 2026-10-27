// v0.5.0: marble/fan direction, ranges, card-level upgrades, per-level inventory + merge, prizes/reveal, move/swap,
// redraw price, world 2 + unlock, queen 2, tuning JSON/CSV, no treat speech.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { tmpdir } from 'node:os';
import * as C from '../src/config.js';
import { Battle, towerStat, cardUpgradeDiff, generateWaves, levelAntTypes } from '../src/sim.js';
import * as M from '../src/meta.js';
import { validateMap } from '../src/maps.js';

const TUNING_DIR = new URL('../../tuning/', import.meta.url);
const TJ = JSON.parse(readFileSync(new URL('tuning.json', TUNING_DIR), 'utf8'));
const DECK = ['slingshot', 'spray', 'glue', 'fan', 'ball'];
const mk = (o = {}) => { const b = new Battle({ levelIndex: 0, deck: DECK, seed: 1, ...o }); b.nextWaveAt = 1e9; return b; };
const src = (f) => readFileSync(new URL(`../src/${f}`, import.meta.url), 'utf8');

// ---------- item 15: tuning files ----------
test('item 15: the game reads tuning/tuning.json (config = JSON), no in-app editor', () => {
  for (const [id, t] of Object.entries(TJ.towers)) {
    const T = C.TOWERS[id]; assert.ok(T, id);
    assert.equal(T.stats.power, t.power, id); assert.equal(T.stats.rate, t.rate, id);
    assert.equal(T.stats.range, t.rangeTiles == null ? null : t.rangeTiles * C.TILE, id);
    assert.deepEqual(T.cardUpgrades, t.cardUpgrades, id); assert.deepEqual(T.upgrades, t.battleUpgrades, id);
  }
  for (const [id, a] of Object.entries(TJ.ants)) { assert.equal(C.ANTS[id].hp, a.hp, id); assert.equal(C.ANTS[id].speed, a.speed, id); }
  assert.equal(C.LEVELS.length, TJ.levels.length); TJ.levels.forEach((L, i) => { assert.equal(C.LEVELS[i].map, L.map); assert.equal(C.LEVELS[i].hpMul, L.hpMul); });
  assert.deepEqual(Object.keys(C.MAPS).sort(), Object.keys(TJ.maps).sort());
  assert.ok(/from '\.\.\/\.\.\/tuning\/tuning\.json'/.test(src('config.js')));
  assert.ok(!/tuning\.json|csv/i.test(src('game.js')), 'not in-app');
});
test('item 15: JSON -> CSV -> JSON round trip is lossless; CSV import rejects bad data', () => {
  const dir = mkdtempSync(tmpdir() + '/tuning-'); const out = dir + '/rt.json';
  const j = new URL('tuning.json', TUNING_DIR).pathname;
  execFileSync(process.execPath, [new URL('json2csv.mjs', TUNING_DIR).pathname, '--json', j, '--dir', dir]);
  execFileSync(process.execPath, [new URL('csv2json.mjs', TUNING_DIR).pathname, '--dir', dir, '--json', j, '--out', out]);
  assert.deepEqual(JSON.parse(readFileSync(out, 'utf8')), TJ);
  const csv = readFileSync(dir + '/levels.csv', 'utf8'); assert.ok(csv.startsWith('level,world,name,map,') && /_waves,_ants/.test(csv));
  // broken edit: unknown map -> nothing written, exit code 1
  const lv = readFileSync(dir + '/levels.csv', 'utf8').replace(',zigzag,', ',nomap,');
  execFileSync('bash', ['-c', `cat > ${dir}/levels.csv`], { input: lv });
  assert.throws(() => execFileSync(process.execPath, [new URL('csv2json.mjs', TUNING_DIR).pathname, '--dir', dir, '--json', j, '--out', dir + '/bad.json'], { stdio: 'pipe' }));
});

// ---------- item 4: ranges ----------
test('item 4: ranges back to v0.4.0 (basic 1.5 tiles, Zapper 2, Laser 2.5), measured from the tower centre', () => {
  for (const id of ['slingshot', 'spray', 'sound', 'fan', 'lizard']) assert.equal(towerStat(id, 'range'), 1.5 * C.TILE, id);
  assert.equal(towerStat('zapper', 'range'), 2 * C.TILE); assert.equal(towerStat('laser', 'range'), 2.5 * C.TILE);
  const b = mk(); const s = b.addTower('slingshot', 4, 3); assert.equal(s.x, 4.5 * C.TILE); assert.equal(s.y, 3.5 * C.TILE);
});

// ---------- items 5 + 5b: card-level upgrades ----------
test('items 5/5b: each tower has its own hand-made 9-step sequence (L2..L10), one stat per step (sometimes two), sizes ~10% / +0.2 tiles', () => {
  const seqs = new Set();
  for (const [id, T] of Object.entries(C.TOWERS)) {
    assert.equal(T.cardUpgrades.length, C.MAX_CARD_LEVEL - 1, id);
    const keys = T.cardUpgrades.map((s) => Object.keys(s).sort().join('+')); seqs.add(keys.join('|'));
    assert.ok(T.cardUpgrades.every((s) => Object.keys(s).length >= 1 && Object.keys(s).length <= 2), id);
    assert.ok(T.cardUpgrades.filter((s) => Object.keys(s).length === 2).length <= 2, `${id}: two-stat steps are occasional`);
    assert.ok(new Set(keys).size >= (id === 'tractor' ? 2 : 3), `${id}: varied`); // v0.6: the Tractor has only rate + lift size (uneven steps)
    // not cyclic: the sequence is not a repetition of a shorter pattern
    for (let p = 1; p < 5; p++) assert.ok(keys.some((k, i) => i >= p && k !== keys[i - p]), `${id}: not a ${p}-cycle`);
    for (const s of T.cardUpgrades) for (const [k, v] of Object.entries(s)) {
      if (k === 'range') assert.ok(v >= 0.15 && v <= 0.2, `${id} range +${v} tiles`);
      else if (k === 'liftSize') assert.ok(id === 'tractor' && v === 1, 'v0.6: the Tractor card lifts one size more at L3 and L8');
      else assert.ok(v >= 0.05 && v <= 0.15, `${id} ${k} +${v}`);
    }
    if (T.stats.range != null && T.place !== 'path') assert.ok(T.cardUpgrades.some((s) => 'range' in s), `${id}: upgrades improve range`);
    if (T.place === 'path') assert.ok(!T.cardUpgrades.some((s) => 'range' in s), `${id}: v0.6 item 3 - a trail item covers only its own tile, never more`);
  }
  assert.equal(seqs.size, Object.keys(C.TOWERS).length, 'every tower has a different sequence');
});
test('items 5/5b: a card level changes only its own stat(s); the panel diff names the next upgrade', () => {
  // slingshot L1 -> L2 = range +0.2 tiles only
  assert.equal(towerStat('slingshot', 'range', 1, 2), 1.7 * C.TILE); assert.equal(towerStat('slingshot', 'power', 1, 2), towerStat('slingshot', 'power', 1, 1));
  assert.ok(Math.abs(towerStat('slingshot', 'power', 1, 3) - C.TOWERS.slingshot.stats.power * 1.1) < 1e-9);
  const d = cardUpgradeDiff('slingshot', 1); assert.deepEqual(d.map((x) => x.key), ['range']); assert.ok(d[0].to > d[0].from);
  assert.deepEqual(cardUpgradeDiff('slingshot', 10), [], 'max level: nothing next');
  const g = src('game.js'); assert.ok(/cardUpgradeDiff\(/.test(g), 'the panel shows the next card upgrade');
  // in-battle upgrades stack on top of the card level
  assert.ok(towerStat('slingshot', 'power', 2, 3) > towerStat('slingshot', 'power', 1, 3));
});

// ---------- items 6 + 7: inventory per level ----------
test('items 6/7 (+ v0.6 item 4): v0.4 save migrates: a level-L card = one L-L card, each loose copy = one L1 card, nothing lost, no NEW reveal for owned levels', () => {
  const v04 = { version: 2, coins: 50, diamonds: 3, cards: {}, bonusStock: {}, levels: Array.from({ length: 10 }, (_, i) => ({ stars: 3, cleared: true })), calendar: M.newCalendarState() };
  for (const id of C.ALL_CARDS) v04.cards[id] = { unlocked: id === 'slingshot' || id === 'laser', level: id === 'slingshot' ? 4 : id === 'laser' ? 1 : 0, copies: id === 'slingshot' ? 5 : 0 };
  const store = new Map([[M.SAVE_KEY, JSON.stringify(v04)]]); const st = { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, v) };
  const s = M.loadSave(st);
  assert.equal(s.version, M.SAVE_VERSION); assert.equal(s.levels.length, 20, 'world 2 levels added');
  assert.deepEqual(s.cards.slingshot.inv, { 1: 5, 4: 1 }); assert.equal(s.cards.slingshot.copies, undefined); assert.equal(s.cards.slingshot.level, 4);
  assert.deepEqual(s.cards.slingshot.seen, [1, 2, 3, 4]); assert.equal(s.cards.laser.level, 1);
  assert.equal(s.cards.spray.unlocked, false); assert.deepEqual(s.cards.spray.inv, {});
  let r = M.addCards(s, 'slingshot', 3, 1); assert.equal(r.newType || r.newLevel, false, 'owned level -> no reveal');
  r = M.addCards(s, 'slingshot', 5, 1); assert.equal(r.newLevel, true); assert.equal(s.cards.slingshot.level, 5, 'highest level shown / used');
  assert.equal(M.cardLevels(s).slingshot, 5);
});
test('item 7: a card prize goes straight into the inventory, flagged fresh; reveal only for a new type or a new level', () => {
  const s = M.newSave();
  const p = M.grantCardPrize(s, 1, () => 0); assert.ok(p.newCard && p.reveal); assert.equal(s.cards[p.id].inv[1], 1); assert.ok(s.cards[p.id].fresh);
  const q = M.grantCardPrize(s, 1, () => 0.999); assert.ok(q.reveal);
  const st = C.STARTER_CARDS[0]; for (const id of M.lockedCards(s)) M.unlockCard(s, id);
  const r = M.grantCardPrize(s, 1, () => C.ALL_CARDS.indexOf(st) / C.ALL_CARDS.length); assert.equal(r.id, st); assert.equal(r.reveal, false, 'same type + level already owned -> no reveal');
  assert.equal(M.countAt(s.cards[st], 1), 2);
  const g = src('game.js'); assert.ok(/You won a card/.test(g)); assert.ok(/NEW CARD/.test(g));
});

// ---------- item 17: redraw ----------
test('item 17: redraw costs 3, 6, 9, 12 ... and the price resets every battle (v0.7 D-R3: the first redraw is free)', () => {
  const b = mk(); b.addCrumbs(1000); const prices = [];
  for (let i = 0; i < 5; i++) { prices.push(b.rerollPrice); const c = b.crumbs; assert.ok(b.reroll()); assert.equal(c - b.crumbs, prices[i]); }
  assert.deepEqual(prices, [0, 3, 6, 9, 12]);
  assert.equal(mk().rerollPrice, 0, 'new battle -> free again');
});

// ---------- items 11 + 12: move / swap ----------
test('item 11: moving a tower in battle costs 1 diamond and obeys the placement rules', () => {
  const s = M.newSave(); s.diamonds = 1; const b = mk(); const tw = b.addTower('slingshot', 0, 3);
  assert.equal(M.moveTowerWithDiamond(s, b, tw, 2, 2).why, 'spot', 'cannot move a side tower onto the trail'); assert.equal(s.diamonds, 1);
  const r = M.moveTowerWithDiamond(s, b, tw, 9, 3); assert.ok(r.ok); assert.equal(s.diamonds, 0); assert.deepEqual([tw.c, tw.r, tw.x], [9, 3, 9.5 * C.TILE]);
  assert.ok(b.events.some((e) => e.type === 'move'));
  assert.equal(M.moveTowerWithDiamond(s, b, tw, 9, 4).why, 'diamonds', 'no diamonds -> no move');
  // a moved marble / fan re-aims at its new spot
  const m = b.addTower('ball', 0, 3); assert.equal(m.trailDir, null); s.diamonds = 1; assert.ok(M.moveTowerWithDiamond(s, b, m, 0, 1).ok); assert.ok(m.trailDir);
});
test('item 12: swapping two towers is free and only if both fit the other spot', () => {
  const b = mk(); const crumbs = b.crumbs;
  const a = b.addTower('slingshot', 0, 3); const g = b.addTower('glue', 3, 2); const f = b.addTower('fan', 9, 2);
  assert.equal(b.swapTowers(a, g), false, 'a side tower cannot go on the trail');
  assert.ok(b.swapTowers(a, f)); assert.deepEqual([a.c, a.r, f.c, f.r], [9, 2, 0, 3]); assert.equal(b.crumbs, crumbs);
  assert.deepEqual([f.ax, f.ay, f.trailDir], [0, 0, null], 'fan re-aimed at its new spot (no trail beside it)');
  assert.ok(b.events.some((e) => e.type === 'swap'));
});

// ---------- items 13 + 14: world 2 ----------
test('items 13/14: world 2 = 10 levels, Cake, its own queen at level 20; maps valid', () => {
  assert.deepEqual(C.WORLDS.map((w) => [w.id, w.treat, w.queen, w.levels]), [[1, 'cookie', 'queen', 10], [2, 'cake', 'queen2', 10]]);
  for (let i = 10; i < 20; i++) { assert.equal(C.worldOf(i), 2); assert.equal(C.treatOf(i), 'cake'); }
  assert.equal(C.treatOf(0), 'cookie');
  assert.ok(levelAntTypes(19).includes('queen2')); assert.ok(!levelAntTypes(9).includes('queen2'));
  for (const id of new Set(C.LEVELS.slice(10).map((L) => L.map))) assert.deepEqual(validateMap(id, C.MAPS[id]), [], id);
  // queen 2: same formula as queen 1 (50 + traits), slightly different: fast (takes 40), calls flyers, lavender
  assert.equal(C.ANTS.queen2.steal, 40); assert.equal(C.ANTS.queen.steal, 50);
  assert.ok(C.ANTS.queen2.speed > C.ANTS.queen.speed && C.ANTS.queen2.boss && C.ANTS.queen2.size === C.ANT_SIZES.queen);
  assert.ok(generateWaves(19).at(-1).some((e) => e.type === 'queen2'));
});
test('item 14: world 2 unlocks only after all 10 world-1 levels are won AND 18+ of 30 stars (v0.6.2: 20, v0.7 D-S2: 18)', () => {
  const s = M.newSave(); const W2 = C.WORLD_START[2]; assert.equal(W2, 10);
  for (let i = 0; i < 10; i++) s.levels[i] = { stars: 2, cleared: true };
  s.levels[0].stars = 1; s.levels[1].stars = 1; s.levels[2].stars = 1;
  assert.equal(M.worldStars(s, 1), 17); assert.equal(M.levelUnlocked(s, W2), false, '17 stars: locked');
  s.levels[0].stars = 2;
  assert.equal(M.worldStars(s, 1), 18); assert.equal(M.levelUnlocked(s, W2), true, '18 stars + all won: open');
  s.levels[9] = { stars: 0, cleared: false }; for (let i = 0; i < 9; i++) s.levels[i].stars = 3;
  assert.equal(M.worldStars(s, 1), 27); assert.equal(M.levelUnlocked(s, W2), false, 'level 10 not won: locked');
  s.levels[9] = { stars: 3, cleared: true }; assert.equal(M.levelUnlocked(s, W2 + 1), false, 'next level needs level 11 won');
});

// ---------- items 3, 16, 18 + UI source checks ----------
test('item 3: treats show faces only - no speech bubble / text', () => {
  const a = src('art.js'); assert.ok(!/treatBubble/.test(a)); assert.ok(!/treatBubble/.test(src('game.js')));
});
test('item 16: celebrations - 3 stars confetti, 100 food confetti + fireworks, queen down fireworks + text', () => {
  const g = src('game.js');
  assert.ok(/Way to go, you saved the cookies!/.test(g)); assert.ok(/function launchFireworks/.test(g)); assert.ok(/function renderFireworks/.test(g));
});
test('item 18: the queen still eats half (50) of the treat', () => { assert.equal(C.queenTake(C.ANTS.queen.queenTraits), 50); assert.equal(C.ANTS.queen.steal, 50); });
test('items 8/9: shop owned-count badge + 3 purchase animations; diamonds left of coins', () => {
  const g = src('game.js');
  assert.ok(/function countBadge/.test(g)); assert.ok(/priceFloat/.test(g)); assert.ok(/function shopBought/.test(g));
});

// ---------- v0.5.1 audit fixes ----------
test('v0.5.1 item 7: the reveal says NEW CARD for a new type AND for a new level (no "NEW LEVEL")', () => {
  const g = src('game.js'); assert.ok(!/NEW LEVEL/.test(g));
  const body = g.slice(g.indexOf('function renderReveal'), g.indexOf('function launchFireworks'));
  assert.ok(/A\.text\(ctx, 'NEW CARD!'/.test(body));
});
test('v0.5.1 item 16: the queen celebration (fireworks + "Way to go") only when the level is won', () => {
  const g = src('game.js');
  assert.ok(/const queenKilled = win && /.test(g));
  const ev = g.slice(g.indexOf('function consumeEvents'), g.indexOf("case 'leak'") > 0 ? g.indexOf("case 'leak'") : g.indexOf('function consumeEvents') + 1500);
  assert.ok(!/isQueen\(e\.ant\)/.test(ev), 'no celebration at the moment of the kill (the level may still be lost)');
});
