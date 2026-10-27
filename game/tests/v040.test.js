// v0.4.0: FEEDBACK-v0.3.0 items 1-20 (waves/ants halved, ant sizes, queen formula, ranges, Roasted Lava, fixed booster prices,
// diamonds in battle, Cards blink, calendar layout/prizes, treat faces, no direction arrows, save migration).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as C from '../src/config.js';
import { Battle, generateWaves, levelAntTypes, towerStat, rangeTiles, formatStat, starsFor } from '../src/sim.js';
import * as M from '../src/meta.js';
import * as Cal from '../src/calendar.js';
import * as Treat from '../src/treat.js';
import { playLevel, unlockedAt } from '../src/bot.js';

const DAY = 86400000;
const DECK = ['slingshot', 'spray', 'glue', 'fan', 'ball'];
const mk = (o = {}) => { const b = new Battle({ levelIndex: 0, deck: DECK, seed: 1, bonusTypes: ['bomb', 'freeze'], bonusStock: { bomb: 0, freeze: 0 }, ...o }); b.nextWaveAt = 1e9; return b; };
const src = (f) => readFileSync(new URL(`../src/${f}`, import.meta.url), 'utf8');
const at = (y, m, d, h = 10) => new Date(y, m - 1, d, h).getTime();

// v0.3.0 (vc7) reference values, from backup-v0.3.0-vc7
const V03_WAVES = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15];
const V03_ANTS = [106, 113, 142, 184, 223, 287, 307, 371, 520, 525];

// ---------- items 12 + 13 + 15: waves and ants ----------
test('items 12+13: every stage has 30-50% fewer waves; stage count unchanged', () => {
  assert.equal(C.LEVELS.filter((L) => L.world === 1).length, 10); // v0.5: world 2 is new content, not cut from v0.3
  C.LEVELS.slice(0, 10).forEach((L, i) => {
    const n = generateWaves(i).length; const cut = 1 - n / V03_WAVES[i];
    assert.ok(cut >= 0.3 - 1e-9 && cut <= 0.5 + 1e-9, `level ${i + 1}: ${V03_WAVES[i]} -> ${n} waves (${Math.round(cut * 100)}%)`);
  });
});
test('item 12: the number of ants in each stage is about halved (42-65% of v0.3; v0.7.3 C17 mixes have more small scouts (2 ants per spawn), so the upper bound went from 55% to 65%)', () => {
  C.LEVELS.slice(0, 10).forEach((L, i) => {
    const n = generateWaves(i).flat().length; const r = n / V03_ANTS[i];
    assert.ok(r >= 0.42 && r <= 0.65, `level ${i + 1}: ${V03_ANTS[i]} -> ${n} ants (${r.toFixed(2)})`);
  });
});
test('item 15: at most 5 ant types per battle', () => {
  assert.equal(C.MAX_ANT_TYPES_PER_BATTLE, 5);
  C.LEVELS.forEach((L, i) => assert.ok(levelAntTypes(i).length <= 5, `level ${i + 1}: ${levelAntTypes(i).join(',')}`));
});
test('balance: the smart bot wins >= 3 of 5 seeds on every level (v0.7 proxy card levels: world 1 CL2, world 2 CL3 - plan D-S3); doing nothing loses from level 5', () => {
  for (let i = 0; i < C.LEVELS.length; i++) {
    const cardLevel = C.LEVELS[i].world === 1 ? 2 : 3; // v0.7: the economy plan's proxy card levels (v0.6: W1 CL1 / W2 CL5, every seed)
    const wins = [1, 2, 3, 4, 5].filter((seed) => playLevel(i, { unlocked: unlockedAt(i), seed, cardLevel }).result === 'win').length;
    assert.ok(wins >= 3, `level ${i + 1}: ${wins}/5 wins`);
    if (i >= 4) assert.equal(playLevel(i, { bot: 'idle', unlocked: unlockedAt(i), seed: 1 }).result, 'lose', `idle level ${i + 1}`);
  }
});

// ---------- items 14 + 20: ant sizes ----------
test('items 14/20: four body sizes - small, regular, large, queen (largest); armored/flyer/gas mask are regular size', () => {
  const Z = C.ANT_SIZES; const sizes = new Set(Object.values(C.ANTS).map((a) => a.size));
  assert.deepEqual([...sizes].sort(), Object.values(Z).sort());
  assert.ok(Z.small < Z.regular && Z.regular < Z.large && Z.large < Z.queen);
  for (const t of ['worker', 'armored', 'gasmask', 'flyer', 'sprinter']) assert.equal(C.ANTS[t].size, Z.regular, t);
  for (const t of ['big', 'heavy']) assert.equal(C.ANTS[t].size, Z.large, t);
  assert.equal(C.ANTS.small.size, Z.small); assert.equal(C.ANTS.queen.size, Z.queen);
  assert.ok(Z.large <= 1.2, 'large shrunk (was 1.35)');
  assert.equal(Z.queen, 2.1, 'queen size kept');
});
test('item 14d/e: late-game exceptions - Heavy Knight (large armored) and Sprint Knight (fast armored) only in late stages', () => {
  assert.ok(C.ANTS.heavy.armor >= C.ANTS.armored.armor && C.ANTS.heavy.size === C.ANT_SIZES.large);
  assert.ok(C.ANTS.sprinter.armor > 0 && C.ANTS.sprinter.speed > C.ANTS.worker.speed);
  C.LEVELS.forEach((L, i) => { for (const t of levelAntTypes(i)) if (C.ANTS[t].lateGame) assert.ok(i >= 7, `${t} in level ${i + 1}`); });
  const art = src('art.js'); assert.ok(art.includes('function sneaker('), 'Sprint Knight sneakers');
});

// ---------- item 19: queen formula ----------
test('item 19: queen take = 50 average; fast 40, flying 35, slow 50-60; world-1 queen uses it', () => {
  assert.equal(C.queenTake([]), 50);
  assert.equal(C.queenTake(['fast']), 40); assert.equal(C.queenTake(['flying']), 35);
  assert.equal(C.queenTake(['slow']), 50); assert.equal(C.queenTake(['slower']), 55); assert.equal(C.queenTake(['slowest']), 60);
  assert.equal(C.ANTS.queen.steal, C.queenTake(C.QUEENS[1].traits));
  assert.equal(C.ANTS.queen.steal, 50);
});
test('item 19: a queen reaching the cookie takes half of it -> 3 stars are out of reach in that battle', () => {
  const b = mk({ levelIndex: 9 }); b.spawn('queen', b.path.length - 1); b.update(0.1);
  assert.equal(b.foodStored, C.BATTLE.foodHP - 50);
  assert.ok(starsFor(b.foodStored) < 3);
  assert.ok(/half/i.test(C.ANTS.queen.desc));
});

// ---------- item 6: ranges ----------
test('v0.5 item 4 (was v0.4.1 item 6): ranges back to v0.4.0 - basic 1.5 tiles, Zapper 2, Laser 2.5, from the tower centre; marble has no range', () => {
  for (const id of ['slingshot', 'spray', 'sound', 'fan', 'lizard']) assert.equal(rangeTiles(id, towerStat(id, 'range', 1, 1)), 1.5, id);
  assert.equal(rangeTiles('laser', towerStat('laser', 'range', 1, 1)), 2.5);
  assert.equal(rangeTiles('zapper', towerStat('zapper', 'range', 1, 1)), 2);
  assert.equal(C.TOWERS.ball.stats.range, null, 'marble: rolls the straight trail, no range circle');
  assert.equal(C.TILE, 40);
  for (const id of ['slingshot', 'spray', 'sound', 'fan', 'lizard']) assert.equal(towerStat(id, 'range', 1, 1), 60, id + ' radius px');
  assert.equal(towerStat('zapper', 'range', 1, 1), 80); assert.equal(towerStat('laser', 'range', 1, 1), 100);
  for (const id of ['glue', 'pheromone', 'gate', 'lava']) { assert.equal(towerStat(id, 'range', 1, 1), 40, id + ' (v0.6: covers its own square tile)'); assert.equal(formatStat(id, 'range', 40), 'its tile'); }
  assert.equal(formatStat('slingshot', 'range', 60), '1.5 tiles'); assert.equal(formatStat('laser', 'range', 100), '2.5 tiles');
});

// ---------- item 7: Roasted Lava ----------
test('item 7: Roasted Lava - a regular tower card on the trail like Glue, no special price', () => {
  const T = C.TOWERS.lava;
  assert.equal(T.name, 'Roasted Lava'); assert.equal(T.place, 'path'); assert.equal(T.kind, 'obstacle');
  assert.ok(C.ALL_CARDS.includes('lava'));
  for (const k of ['cost', 'price', 'unlockPrice']) assert.ok(!(k in T), `no special ${k}`);
  assert.equal(T.upgrades.length, C.TOWERS.glue.upgrades.length, 'same 3 in-battle levels');
});
test('item 7: lava slows slightly and damages continuously while the ant is on it', () => {
  const b = mk();
  // the first trail tile ~3 tiles from the nest
  const p = b.path.at(3 * C.TILE); const tw = b.addTower('lava', Math.floor(p.x / C.TILE), Math.floor(p.y / C.TILE));
  const a = b.spawn('worker', 0); const hp0 = a.hp; let drops = 0, last = a.hp, slowSeen = 0;
  for (let k = 0; k < 200 && !a.dead; k++) {
    b.update(0.02);
    if (a.hp < last - 1e-9) drops++; last = a.hp;
    if (Math.hypot(a.x - tw.px, a.y - tw.py) <= tw.stat('range')) slowSeen = Math.max(slowSeen, a.slow);
  }
  assert.ok(drops >= 10, `damage on many ticks (continuous), got ${drops}`);
  assert.ok(a.dead || a.hp < hp0);
  assert.ok(slowSeen > 0 && slowSeen <= 0.3, `slight slow, got ${slowSeen}`);
});

// ---------- item 5: fan = marble direction logic, no arrows ----------
test('item 5: fan uses the same direction logic as the marble (marble unchanged)', () => {
  const b = mk(); const f = b.addTower('fan', 2, 2); const m = b.addTower('ball', 2, 2);
  assert.equal(f.ax, m.ax); assert.equal(f.ay, m.ay);
});
test('item 5: no direction arrows are drawn in the game (fan, marble, board-centre mark)', () => {
  const g = src('game.js'); assert.ok(!g.includes('A.arrow('), 'no arrow calls in game.js');
  const a = src('art.js'); assert.ok(!/arrow\(ctx, Math\.cos\(ang\)/.test(a), 'marble pad chevron removed');
  assert.ok(g.includes('function drawFanAreas('), 'fan area circle');
});

// ---------- items 9 + 10: diamonds in battle, fixed booster prices ----------
test('item 10: booster prices are fixed - Shop 15 diamonds, battle 20, no escalation, all 4 boosters', () => {
  const s = M.newSave(); s.diamonds = 15 * 8;
  for (const bt of C.BONUS_TYPES) for (let k = 0; k < 2; k++) { const d = s.diamonds; assert.ok(M.buyBonus(s, bt)); assert.equal(d - s.diamonds, 15); }
  const save = M.newSave(); save.diamonds = 1000;
  const b = mk({ bonusTypes: ['bomb', 'freeze'], bonusStock: { bomb: 0, freeze: 0 } });
  for (const bt of C.BONUS_TYPES) assert.equal(M.nextBoosterPrice(b, bt), 20);
  M.buyBoosterWithDiamonds(save, b, 'bomb'); M.buyBoosterWithDiamonds(save, b, 'freeze');
  for (const bt of C.BONUS_TYPES) assert.equal(M.nextBoosterPrice(b, bt), 20, `${bt} after purchases`);
  assert.equal(save.diamonds, 960);
});
test('item 9: the battle HUD shows the diamonds in stock', () => {
  const g = src('game.js'); assert.ok(/renderHud[\s\S]{0,2500}diamondIcon[\s\S]{0,200}S\.save\.diamonds/.test(g));
});

// ---------- item 17: Cards button blink ----------
test('item 17: Cards blink fires exactly twice ever - first affordable card, first affordable after a loss', () => {
  const s = M.newSave(); s.coins = 0;
  assert.equal(M.checkCardBlink(s), false, 'cannot afford');
  s.coins = C.ECONOMY.shop.cardL1 - 1; assert.equal(M.checkCardBlink(s), false);
  s.coins = C.ECONOMY.shop.cardL1; assert.equal(M.checkCardBlink(s), true, 'trigger 1');
  assert.equal(M.checkCardBlink(s), false, 'only once');
  s.coins = 0; M.noteLossForCardBlink(s); assert.equal(M.checkCardBlink(s), false, 'lost but cannot afford');
  s.coins = 100; assert.equal(M.checkCardBlink(s), true, 'trigger 2: first time affordable after a loss');
  M.noteLossForCardBlink(s); assert.equal(M.checkCardBlink(s), false, 'never again');
  assert.equal(C.ECONOMY.cardsBlinkSec, 5);
});

// ---------- items 1 + 2: calendar ----------
test('item 2: day 7 = level-2 card + 5 diamonds; item 1: day-30 box gives a level-3 card', () => {
  assert.deepEqual(C.CALENDAR.week[6], { kind: 'card', level: 2, extra: { kind: 'diamonds', count: 5 } });
  assert.deepEqual(C.CALENDAR.monthMilestones[30], { kind: 'card', level: 3 });
  assert.deepEqual(Object.keys(C.CALENDAR.monthMilestones).map(Number), [10, 20, 30]);
  const s = M.newSave(); const d1 = at(2026, 11, 2); let r;
  for (let d = 0; d < 30; d++) { Cal.touch(s, d1 + d * DAY); r = Cal.claim(s, d1 + d * DAY, () => 0); assert.ok(r.ok); if (r.tile === 6) assert.deepEqual(r.extra, { kind: 'diamonds', count: 5 }); }
  assert.equal(r.streak, 30); assert.equal(r.milestone.kind, 'card'); assert.equal(r.milestone.level, 3);
});
test('items 1/2/11: calendar visuals - 3x3 weekly grid, monthly boxes by tier, square badge', () => {
  const g = src('game.js'); const a = src('art.js');
  assert.ok(g.includes("const big = i === 6; const row = big ? 2 : Math.floor(i / 3), col = big ? 0 : i % 3;"));
  assert.ok(a.includes('export function monthBox(') && g.includes('A.monthBox('));
  assert.ok(/Reward Calendar badge \(v0\.4 item 11: a flat SQUARE/.test(g));
});

// ---------- item 16: map visuals ----------
test('item 16: level map uses a winding road and 3D stage markers (positions unchanged)', () => {
  const g = src('game.js'); const a = src('art.js');
  assert.ok(g.includes('function drawMapRoad(') && a.includes('export function mapNode('));
});

// ---------- item 18: treat faces ----------
test('item 18: treat reactions - first bite surprised, fast bites "oy oy oy", big bite crying, then back to the mood face', () => {
  const R = C.UI.treatReact; const st = Treat.newTreatState();
  assert.equal(Treat.onBite(st, 10, 1), 'surprised');
  assert.equal(Treat.onBite(st, 10.5, 1), 'sad', 'second bite: next face in the rotation');
  assert.equal(Treat.onBite(st, 11, 1), 'oyoy', '3 bites within the rush window -> oy oy oy');
  assert.equal(Treat.onBite(st, 30, 50), 'crying', 'queen bite');
  assert.ok(Treat.reaction(st, 30.5));
  assert.equal(Treat.reaction(st, 30 + R.time + 0.01), null, 'mood face again afterwards');
  const seen = new Set(); const s2 = Treat.newTreatState(); for (let k = 0; k < 6; k++) seen.add(Treat.onBite(s2, k * 10, 1));
  for (const f of ['surprised', 'sad', 'oyoy']) assert.ok(seen.has(f), f);
});
test('item 18: one face scheme for every treat (cookie now, cake later)', () => {
  const a = src('art.js');
  for (const f of Treat.TREAT_REACTIONS) assert.ok(a.includes(`case '${f}'`), f);
  assert.ok(a.includes('export const TREAT_BODIES = { cookie: cookieBody, cake: cakeBody }'));
  assert.equal(C.TREATS[1], 'cookie');
});

// ---------- save compatibility ----------
test('v0.3 save loads: fields kept, card-blink flags + Roasted Lava card added, same save key', () => {
  assert.equal(M.SAVE_KEY, 'crumbdefense.save.v1');
  const v03 = { version: 1, coins: 321, diamonds: 17, cards: {}, bonusStock: { bomb: 1, plane: 0, freeze: 2, decoy: 0 },
    levels: Array.from({ length: 10 }, (_, i) => ({ stars: i < 3 ? 3 : 0, cleared: i < 3 })), lastDeck: DECK.slice(), lastBonuses: ['bomb', 'freeze'],
    calendar: { ...M.newCalendarState(), streak: 12, lastClaimDay: 20000 } };
  for (const id of C.ALL_CARDS) if (id !== 'lava') v03.cards[id] = { unlocked: DECK.includes(id), level: DECK.includes(id) ? 2 : 0, copies: 4 };
  const store = new Map([[M.SAVE_KEY, JSON.stringify(v03)]]); const st = { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, v) };
  const s = M.loadSave(st);
  assert.equal(s.coins, 321); assert.equal(s.diamonds, 17); assert.equal(s.calendar.streak, 12); assert.equal(s.levels[2].stars, 3);
  assert.equal(s.cards.slingshot.level, 2); assert.equal(s.cards.slingshot.copies, undefined, 'v0.6: no copies');
  assert.deepEqual(s.cards.lava, { unlocked: false, level: 0, inv: {}, seen: [], fresh: false });
  assert.deepEqual(s.cards.slingshot.inv, { 1: 4, 2: 1 }, 'v0.5: a level-2 card = one L2 card; v0.6: each of the 4 copies = one L1 card');
  assert.deepEqual(s.cardBlink, { affordShown: false, afterLossShown: false, lossPending: false });
  assert.equal(s.version, M.SAVE_VERSION);
  M.writeSave(st, s); const again = M.loadSave(st); assert.equal(again.coins, 321); assert.deepEqual(again.cardBlink, s.cardBlink);
});
test('versions: package 0.7.3, Android versionCode 17 / versionName 0.7.3', () => {
  const pkg = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')); assert.equal(pkg.version, '0.7.3');
  const gradle = readFileSync(new URL('../android/app/build.gradle', import.meta.url), 'utf8');
  assert.match(gradle, /versionCode 17\b/); assert.match(gradle, /versionName "0\.7\.3"/);
});
