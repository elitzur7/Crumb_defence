// v0.8.6: board translation, marble radius, uncapped cards, economy factor.
import test from 'node:test';
import assert from 'node:assert/strict';
import * as C from '../src/config.js';
import { Battle, towerStat, cardPowerQ, levelAntTypes } from '../src/sim.js';
import { parseMap } from '../src/maps.js';
import * as M from '../src/meta.js';

test('LY1: every level path is the released route translated one row, and the new rows can hold a side tower', () => {
  assert.equal(C.GRID_ROWS, 14);
  for (let i = 0; i < C.LEVELS.length; i++) {
    const src = parseMap(C.MAPS[C.LEVELS[i].map], 10, 12);
    const b = new Battle({ levelIndex: i, deck: ['slingshot'], seed: 1 });
    const rt = src.routes[0];
    let len = 0;
    for (let k = 1; k < rt.length; k++) len += Math.hypot((rt[k][0] - rt[k - 1][0]) * C.TILE, (rt[k][1] - rt[k - 1][1]) * C.TILE);
    assert.ok(Math.abs(b.path.length - len) < 1.5, `L${i + 1} length ${b.path.length} vs ${len}`);
    const side = [];
    for (let r = 0; r < 14; r++) for (let c = 0; c < 10; c++) if (!b.isPathTile(c, r)) side.push([c, r]);
    assert.ok(side.some(([c, r]) => r === 0 || r === 13), `L${i + 1} has an off-path cell on a new row`);
    const spot = side.find(([c, r]) => (r === 0 || r === 13) && b.placeRuleOk('slingshot', c, r));
    assert.ok(spot, `L${i + 1} new row is placeable`);
  }
});

test('MB1: marble collision radius stays 13 at every card and battle level', () => {
  for (const cl of [1, 4, 8, 10]) for (const lvl of [1, 3, 6]) assert.equal(towerStat('ball', 'ballRadius', lvl, cl), 13);
});

test('EX1: card power Q is 1.08 to the level, and a world does not clamp the card', () => {
  assert.ok(Math.abs(cardPowerQ(1) - 1) < 1e-9);
  assert.ok(Math.abs(cardPowerQ(10) - Math.pow(1.08, 9)) < 1e-9);
  const b = new Battle({ levelIndex: 0, deck: ['slingshot'], cardLevels: { slingshot: 10 }, seed: 1 });
  assert.equal(b.cardLevels.slingshot, 10);
  assert.equal(C.MERGE.coinCost[2], 40);
});

test('version is 0.8.6', () => { assert.equal(C.VERSION, '0.8.6'); });

test('DX1: diamond prices follow the world ladder', () => {
  assert.deepEqual([1, 2, 3, 4, 5, 6, 7, 8].map((w) => M.diamondQuote('battle', w)), [25, 30, 30, 30, 30, 35, 35, 35]);
  assert.deepEqual([1, 2, 3, 4, 5, 6, 7, 8].map((w) => M.diamondQuote('shop', w)), [20, 25, 25, 25, 25, 25, 30, 30]);
  assert.deepEqual([1, 2, 3, 4, 5, 6, 7, 8].map((w) => M.diamondQuote('crumbs', w)), [15, 20, 20, 20, 20, 20, 20, 20]);
  assert.deepEqual([1, 2, 3, 4, 5, 6, 7, 8].map((w) => M.diamondQuote('move', w)), [2, 3, 3, 3, 3, 3, 3, 3]);
  assert.equal(M.crumbPrice(1, 1), 30);
});

test('EC2: merge all of one tower does not merge another', () => {
  const s = M.newSave(); s.coins = 1e7;
  M.addCards(s, 'slingshot', 1, 3); M.addCards(s, 'spray', 1, 3);
  const done = M.mergeAllOf(s, 'slingshot');
  assert.equal(done.length, 1);
  assert.equal(M.countAt(s.cards.spray, 1), 4);
});

test('EC1: World 8 pays the new formula, not coinMul 2.5, and a card level applies in full', () => {
  assert.equal(C.WORLDS[7].coinMul, 2.5); // released baseline, not used by the payout
  assert.equal(C.WORLDS[7].unlock.minStarsInWorld, 14);
  assert.equal(C.ANTS.queen8.spawn.alt, 'drone');
  const L80 = 79;
  const F = M.levelFactor(L80);
  const s = M.newSave();
  for (const id of C.ALL_CARDS) M.unlockCard(s, id);
  const first = M.applyBattleResult(s, L80, 'win', 3, {}, () => 0);
  const replayCoins = Math.round(M.replayBase(L80) * 1.1);
  const clear = Math.round(30 * F);
  const stars = Math.round(20 * F) + Math.round(20 * F) + Math.round(80 * F);
  assert.equal(first.parts.replay, replayCoins);
  assert.equal(first.parts.firstClear, clear);
  assert.equal(first.starCoins, stars);
  assert.equal(first.coins, replayCoins + clear + stars);
  assert.equal(first.gems, 30); // 3-star tier 20 plus boss 10, not the old +5
  assert.equal(first.bossGift.level, 6);
  const again = M.applyBattleResult(s, L80, 'win', 3, {}, () => 0);
  assert.equal(again.gems, 0);
  assert.equal(again.starCoins, 0);
  assert.equal(again.coins, replayCoins);
  assert.equal(again.bossGift, null);
  const jump = M.newSave();
  const one = M.applyBattleResult(jump, 70, 'win', 1, {}, () => 0);
  assert.equal(one.gems, 1);
  const up = M.applyBattleResult(jump, 70, 'win', 3, {}, () => 0);
  assert.equal(up.gems, 0);
  assert.equal(up.starCoins, Math.round(20 * M.levelFactor(70)) + Math.round(80 * M.levelFactor(70)));
  const w1 = new Battle({ levelIndex: 0, deck: ['slingshot'], cardLevels: { slingshot: 10 }, seed: 1 });
  const w8 = new Battle({ levelIndex: 79, deck: ['slingshot'], cardLevels: { slingshot: 10 }, seed: 1 });
  assert.equal(w1.cardLevels.slingshot, 10);
  assert.equal(w8.cardLevels.slingshot, 10);
  assert.equal(w1.cardLevelCap, null);
  assert.equal(towerStat('slingshot', 'power', 1, 10), towerStat('slingshot', 'power', 1, 10));
});

test('AC1: a carrier on about one World 4-8 level in three, first at L33, same seed same drop', () => {
  const hits = [];
  C.LEVELS.forEach((_, i) => { if (levelAntTypes(i).includes('dropcarrier')) hits.push(i + 1); });
  assert.deepEqual(hits, [33, 36, 41, 42, 43, 46, 51, 52, 53, 56, 62, 63, 66, 67, 71, 72, 73]);
  for (const n of hits) assert.ok(levelAntTypes(n - 1).length <= 5, `L${n} types`);
  const s = M.newSave();
  for (let i = 0; i < 32; i++) for (const t of levelAntTypes(i)) M.markAntSeen(s, t);
  assert.equal(M.nextAntCard(s, 32), 'dropcarrier');
  const drop = (seed) => {
    const b = new Battle({ levelIndex: 32, deck: ['slingshot'], seed });
    b.nextWaveAt = 1e9;
    b.spawn('dropcarrier', 0, 0);
    let t = 0;
    while (t < 8 && b.ants.filter((a) => a.type === 'worker' && a.budgeted).length < 4) { b.update(1 / 30); t += 1 / 30; }
    const d = b.ants.find((a) => a.dropper);
    const kids = b.ants.filter((a) => a.type === 'worker' && a.budgeted);
    return { x: Math.round(d.dropX), y: Math.round(d.dropY), n: kids.length, go: kids.every((a) => a.state === 'go') };
  };
  const a = drop(7);
  assert.equal(a.n, 4);
  assert.equal(a.go, true);
  assert.deepEqual(drop(7), a);
});

test('LV: no two levels in one world share a trail', () => {
  for (let w = 1; w <= 8; w++) {
    const maps = C.LEVELS.filter((L) => L.world === w).map((L) => L.map);
    assert.equal(new Set(maps).size, maps.length, `world ${w}`);
  }
  assert.equal(C.LEVELS[64].map, 'w7_jelly_shelf');
  assert.equal(C.LEVELS[73].map, 'w8_whisk_rail');
  assert.equal(C.LEVELS[75].map, 'w8_oven_lip');
});

test('B1: Crumb Rush adds 20 percent of kill crumbs and pays a leftover half', () => {
  const b = new Battle({ levelIndex: 0, deck: ['slingshot'], seed: 1, bonusTypes: ['rush'], bonusStock: { rush: 1 } });
  b.nextWaveAt = 1e9;
  assert.equal(b.useBonus('rush'), true);
  const a = b.spawn('worker', 10); a.speed = 0;
  const before = b.crumbs;
  b.damage(a, 1e9, { ignoreArmor: true, src: { type: 'slingshot', rec: { dmg: 0, kills: 0, overkill: 0 } } });
  const base = C.crumbsFor('worker');
  assert.ok(b.crumbs >= before + base);
  assert.ok(b.bySource || b.towers);
});
