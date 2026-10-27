import test from 'node:test';
import assert from 'node:assert/strict';
import * as C from '../src/config.js';
import { Battle, applyArmor, cardCost, starsFor, canHit, generateWaves, levelAntTypes, isDamageCard } from '../src/sim.js';
import * as M from '../src/meta.js';
import { playLevel, unlockedAt } from '../src/bot.js';

const DECK = ['slingshot', 'spray', 'glue', 'fan', 'ball'];
const mk = (o = {}) => new Battle({ levelIndex: 0, deck: DECK, seed: 1, bonusTypes: ['bomb', 'freeze'], bonusStock: { bomb: 5, freeze: 5, plane: 5, decoy: 5 }, ...o });
const sideTile = (b) => { for (let c = 0; c < 10; c++) for (let r = 0; r < 12; r++) { const t = b.tileInfo(c, r); if (t.valid && !t.onPath && !t.tower) return { c, r }; } };
const pathTile = (b) => { for (let r = 3; r < 12; r++) for (let c = 0; c < 10; c++) { const t = b.tileInfo(c, r); if (t.valid && t.onPath && !t.tower) return { c, r }; } };
const forcePick = (b, card) => { b.picks[0] = card; };

// ---------- damage & armor ----------
test('armor is subtracted per hit with a minimum of 1', () => {
  assert.equal(applyArmor(6, 0), 6);
  assert.equal(applyArmor(6, 2), 4);
  assert.equal(applyArmor(6, 6), 1);
  assert.equal(applyArmor(3, 10), 1);
  assert.equal(applyArmor(4, 6, true), 4, 'ignoreArmor bypasses armor');
});
test('battle damage: slingshot vs knight, boombox ignores armor, spray vs gas mask', () => {
  const b = mk({ levelIndex: 4 });
  const knight = b.spawn('armored'); const hp = knight.hp;
  assert.equal(b.damage(knight, 6, {}), 1);
  assert.equal(b.damage(knight, 4, { ignoreArmor: true }), 4);
  assert.equal(knight.hp, hp - 5);
  const gm = b.spawn('gasmask'); const ghp = gm.hp;
  assert.equal(b.damage(gm, 50, { gas: true, ignoreArmor: true }), 0, 'gas-mask ants are immune to spray');
  assert.equal(gm.hp, ghp);
});
test('flyers can only be hit by laser / zapper (and the plane bonus)', () => {
  for (const [id, T] of Object.entries(C.TOWERS)) {
    const hitsAirDamage = canHit(T.targets, true) && id !== 'fan';
    assert.equal(hitsAirDamage, C.AIR_COUNTERS.includes(id), id);
  }
  assert.equal(canHit('air', false), false, 'zapper ignores ground ants');
  assert.equal(C.BONUSES.plane.targetsAir, true);
  assert.equal(C.BONUSES.bomb.targetsAir, false);
});
test('towers really shoot in the sim: spray cloud damages workers but not gas masks', () => {
  const b = mk({ levelIndex: 2 });
  const t = b.addTower('spray', 2, 3);
  const w = b.spawn('worker'), g = b.spawn('gasmask');
  b.clouds.push({ x: w.x, y: w.y, r: 60, dps: 10, left: 1, total: 1, src: t });
  w.speed = 0; g.speed = 0; b.nextWaveAt = 1e9;
  for (let i = 0; i < 15; i++) b.update(1 / 30);
  assert.ok(w.hp < w.maxHp, 'worker took gas damage');
  assert.equal(g.hp, g.maxHp, 'gas mask took none');
});

// ---------- costs & crumbs (battle-only currency) ----------
test('card cost sequence is 0, 5, 10, 15, ... (first card free)', () => {
  assert.deepEqual([0, 1, 2, 3, 4].map((n) => cardCost(n)), [0, 5, 10, 15, 20]);
  assert.equal(C.BATTLE.firstCardCost, 0);
  assert.equal(C.BATTLE.cardCostStep, 5);
});
test('first card is playable with 0 crumbs; second needs 5', () => {
  const b = mk();
  assert.equal(b.crumbs, 0, 'battles start with 0 crumbs');
  forcePick(b, 'slingshot');
  const t = sideTile(b);
  assert.equal(b.playCard(0, t.c, t.r).ok, true);
  assert.equal(b.crumbs, 0);
  assert.equal(b.nextCardCost, 5);
  forcePick(b, 'slingshot');
  const t2 = sideTile(b);
  assert.deepEqual(b.playCard(0, t2.c, t2.r), { ok: false, why: 'crumbs' });
  b.addCrumbs(5);
  assert.equal(b.playCard(0, t2.c, t2.r).ok, true);
  assert.equal(b.crumbs, 0);
  assert.equal(b.nextCardCost, 10);
});
test('crumbs per kill: worker = 1, stronger ants worth proportionally more', () => {
  assert.equal(C.crumbsFor('worker'), 1);
  assert.equal(C.crumbsFor('small'), 1);
  for (const t of ['big', 'gasmask', 'armored', 'flyer', 'queen']) assert.ok(C.crumbsFor(t) > 1, t);
  assert.ok(C.crumbsFor('queen') > C.crumbsFor('armored') && C.crumbsFor('armored') > C.crumbsFor('gasmask'));
  const b = mk();
  const a = b.spawn('big'); b.damage(a, 9999, { ignoreArmor: true });
  assert.equal(b.crumbs, C.crumbsFor('big'));
});
test('currencies: crumbs never persist; coins and (v0.3) diamonds do', () => {
  const s = M.newSave();
  assert.ok('coins' in s);
  assert.ok(!('crumbs' in s) && !('gems' in s));
  const b = mk(); b.addCrumbs(77);
  const out = M.applyBattleResult(s, 0, 'win', 3, {}, () => 0);
  assert.ok(out.coins > 0);
  assert.ok(!('crumbs' in s), 'crumbs not carried into the save');
  const store = new Map(); const storage = { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, v) };
  M.writeSave(storage, { ...s, crumbs: 99 });
  assert.ok(!store.get(M.SAVE_KEY).includes('crumbs'));
  // a new battle always starts again from 0 crumbs
  assert.equal(mk().crumbs, 0);
  // currency-like keys in the save: only coins
  const moneyKeys = Object.keys(s).filter((k) => /coin|gem|crumb|gold|diamond|cash/i.test(k));
  assert.deepEqual(moneyKeys.sort(), ['coins', 'diamonds']);
});
test('calling a wave early starts it now and grants bonus crumbs', () => {
  const b = mk();
  assert.equal(b.nextWave, 0);
  const bonus = b.callWaveEarly();
  assert.equal(b.nextWave, 1);
  assert.equal(bonus, Math.floor(C.BATTLE.firstWaveDelay * C.BATTLE.earlyCallBonusPerSec));
  b.update(0.01);
  assert.ok(b.ants.length >= 1, 'first ant spawned immediately');
});

// ---------- deck & picks ----------
test('3 visible picks drawn from the deck; used pick refills (v0.7 D-R1: distinct when the deck allows it)', () => {
  const b = mk({ deck: ['laser', 'gate', 'gate', 'gate', 'gate'], seed: 5 });
  assert.equal(b.picks.length, 3);
  for (const p of b.picks) assert.ok(['laser', 'gate'].includes(p));
  for (let s = 0; s < 30; s++) { const bb = mk({ seed: s }); assert.equal(new Set(bb.picks).size, 3, 'v0.7: no duplicate in a hand'); }
  const t = pathTile(b); forcePick(b, 'gate');
  b.playCard(0, t.c, t.r);
  assert.equal(b.picks.length, 3);
});
test('opening hand always has a damage card', () => {
  for (let s = 0; s < 50; s++) assert.ok(mk({ seed: s }).picks.some(isDamageCard));
});
test('duplicate card on same tower upgrades it, up to level 6 (v0.6 item 11: five in-battle upgrades)', () => {
  const b = mk(); b.addCrumbs(100000);
  const t = sideTile(b);
  forcePick(b, 'slingshot'); b.playCard(0, t.c, t.r);
  const tw = b.towers[0]; const d1 = tw.stat('power');
  forcePick(b, 'slingshot'); assert.equal(b.playCard(0, t.c, t.r).upgrade, true);
  assert.equal(tw.lvl, 2); assert.ok(tw.stat('power') > d1);
  for (let L = 3; L <= 6; L++) { forcePick(b, 'slingshot'); b.playCard(0, t.c, t.r); assert.equal(tw.lvl, L); }
  forcePick(b, 'slingshot'); assert.equal(b.playCard(0, t.c, t.r).why, 'max');
  forcePick(b, 'spray'); assert.equal(b.playCard(0, t.c, t.r).why, 'occupied');
  assert.equal(b.towers.length, 1);
});
test('placement: glue/pheromone/gate on the trail, towers and lizard beside it', () => {
  const b = mk(); b.addCrumbs(1000);
  const side = sideTile(b), path = pathTile(b);
  for (const id of ['glue', 'pheromone', 'gate']) { forcePick(b, id); assert.equal(b.canPlay(0, side.c, side.r).why, 'needPath', id); assert.ok(b.canPlay(0, path.c, path.r).ok, id); }
  for (const id of ['lizard', 'slingshot', 'laser', 'zapper', 'fan', 'ball', 'sound', 'spray']) { forcePick(b, id); assert.equal(b.canPlay(0, path.c, path.r).why, 'needSide', id); assert.ok(b.canPlay(0, side.c, side.r).ok, id); }
});

// ---------- food, carry-back, win/lose, stars ----------
test('food is 100; ants steal by type and carry it home; killing a carrier returns part of it (40%)', () => {
  const b = mk(); b.nextWaveAt = 1e9;
  assert.equal(b.foodStored, 100);
  const a = b.spawn('armored', b.path.length - 1);
  b.update(0.1);
  assert.equal(b.foodStored, 100 - C.ANTS.armored.steal);
  assert.equal(a.state, 'back'); assert.equal(a.carrying, C.ANTS.armored.steal);
  b.damage(a, 9999, { ignoreArmor: true });
  assert.equal(b.foodStored, 100 - C.ANTS.armored.steal + C.ANTS.armored.steal * 0.4, 'only 40% of the piece comes back');
  const w = b.spawn('worker', 5); w.state = 'back'; w.carrying = 1; b.foodStored -= 1;
  b.update(0.5);
  assert.equal(b.foodDelivered, 1, 'carrier that reaches the nest keeps the food');
});
test('carryBack can be turned off in config: food is lost on arrival', () => {
  const b = mk({ battleCfg: { carryBack: false } }); b.nextWaveAt = 1e9;
  b.spawn('worker', b.path.length - 1); b.update(0.1);
  const st = C.ANTS.worker.steal; assert.ok(Math.abs(b.foodStored - (100 - st)) < 1e-9); assert.ok(Math.abs(b.foodDelivered - st) < 1e-9); assert.equal(b.ants.length, 0); // v0.7.2: the worker steals 0.9
});
test('stars by % food left: 3 >= 90, 2 >= 50, 1 > 0', () => {
  assert.equal(starsFor(100), 3); assert.equal(starsFor(90), 3); assert.equal(starsFor(89), 2);
  assert.equal(starsFor(50), 2); assert.equal(starsFor(49), 1); assert.equal(starsFor(1), 1); assert.equal(starsFor(0), 0);
});
// v0.4 (items 12/13): with half the ants a stage's total theft can stay under 100 food in the first stages, so doing
// nothing there no longer empties the cookie - it still costs the stars; from level 5 on doing nothing loses.
test('doing nothing: level 1 gives at most 1 star; from level 5 on the ants take the cookie', () => {
  const r = playLevel(0, { bot: 'idle', unlocked: unlockedAt(0) });
  assert.ok(r.stars <= 1, `idle L1 stars ${r.stars}`);
  // v0.5: every world-2 level too (doing nothing never wins a cake level)
  for (let i = 4; i < C.LEVELS.length; i++) assert.equal(playLevel(i, { bot: 'idle', unlocked: unlockedAt(i) }).result, 'lose', `level ${i + 1}`);
});
test('win: clearing all waves without losing the cookie', () => {
  const b = mk(); b.nextWave = b.waves.length; b.pending = [];
  b.update(0.1);
  assert.equal(b.result, 'win'); assert.equal(b.stars, 3);
});

// ---------- waves ----------
test('v0.5: 2 worlds x 10 levels, 4-9 waves each, rising wave counts per world, a queen only in each world\'s level 10', () => {
  assert.equal(C.LEVELS.length, 20);
  for (const W of C.WORLDS) {
    let prev = 0; const s0 = C.WORLD_START[W.id];
    for (let i = s0; i < s0 + 10; i++) {
      assert.equal(C.LEVELS[i].world, W.id);
      const w = generateWaves(i);
      assert.ok(w.length >= 4 && w.length <= 9, `level ${i + 1}: ${w.length}`);
      assert.ok(w.length >= prev); prev = w.length;
      assert.equal(levelAntTypes(i).some((t) => C.ANTS[t].boss), i === s0 + 9, `level ${i + 1}`);
    }
    assert.ok(generateWaves(s0 + 9).at(-1).some((e) => e.type === W.queen));
  }
});
test('flyers only appear once laser is unlocked', () => {
  C.LEVELS.forEach((L, i) => { if (levelAntTypes(i).includes('flyer')) assert.ok(unlockedAt(i).some((c) => C.AIR_COUNTERS.includes(c)), `level ${i + 1}`); });
});
test('wave spawning is deterministic and follows the schedule', () => {
  assert.deepEqual(generateWaves(3), generateWaves(3));
  const b = mk(); let spawned = 0;
  for (let t = 0; t < C.BATTLE.firstWaveDelay - 0.1; t += 0.05) b.update(0.05);
  assert.equal(b.stats.spawned, 0, 'nothing before the first wave');
  for (let t = 0; t < 30; t += 0.05) b.update(0.05);
  spawned = b.stats.spawned;
  assert.ok(spawned > 0);
  assert.ok(b.nextWave >= 1);
});
test('all ant types exist with their traits (v0.4: + Sprint Knight, Heavy Knight; v0.7: + 3 small variants)', () => {
  assert.deepEqual(Object.keys(C.ANTS).sort(), ['armored', 'big', 'flyer', 'gasmask', 'heavy', 'queen', 'queen2', 'small', 'small_armed', 'small_fly', 'small_gasmask', 'sprinter', 'worker']); // v0.5: + world 2's Swift Queen
  assert.equal(C.ANTS.worker.hp, 20); // v0.7 (Yair ANT-STATS-v0.6.3)
  assert.ok(C.ANTS.small.speed > C.ANTS.worker.speed && C.ANTS.small.hp < C.ANTS.worker.hp);
  assert.ok(C.ANTS.big.speed < C.ANTS.worker.speed && C.ANTS.big.armor > 0);
  assert.ok(C.ANTS.armored.armor > C.ANTS.big.armor);
  assert.ok(C.ANTS.gasmask.gasImmune && C.ANTS.flyer.flying && C.ANTS.queen.boss);
});
test('10 towers (v0.6: + Tractor) + 3 obstacles; starter 5; clearing levels unlocks nothing (v0.3: cards come from the Shop or prizes)', () => {
  assert.equal(Object.values(C.TOWERS).filter((t) => t.kind === 'tower').length, 10);
  assert.equal(Object.values(C.TOWERS).filter((t) => t.kind === 'obstacle').length, 3); // glue + electric gate + roasted lava (v0.4)
  const s = M.newSave();
  assert.deepEqual(M.unlockedCards(s).sort(), [...C.STARTER_CARDS].sort());
  const out = M.applyBattleResult(s, 0, 'win', 3, {}, () => 0);
  assert.ok(!out.unlocked);
  M.applyBattleResult(s, 1, 'win', 3, {}, () => 0);
  assert.equal(M.unlockedCards(s).length, 5);
});

// ---------- bonuses ----------
test('bonuses: only brought types, max 2 uses per battle, stock consumed', () => {
  const b = mk();
  assert.equal(b.canUseBonus('plane'), false, 'not brought');
  assert.ok(b.useBonus('freeze'));
  assert.ok(b.useBonus('bomb', 100, 100));
  assert.equal(b.useBonus('bomb', 100, 100), false, 'third use blocked');
  assert.equal(b.bonusStock.bomb, 4);
});
test('freezer stops ants for 4s; plane hits flyers; bomb does not', () => {
  const b = mk({ levelIndex: 5, bonusTypes: ['freeze', 'plane'] }); b.nextWaveAt = 1e9;
  const a = b.spawn('worker', 100); b.useBonus('freeze');
  for (let i = 0; i < 30; i++) b.update(0.1);
  assert.equal(a.d, 100, 'frozen');
  b.update(1.1); assert.ok(a.d > 100, 'thawed after 4s');
  const f = b.spawn('flyer', 300); b.useBonus('plane');
  for (let i = 0; i < 200 && b.plane; i++) b.update(0.05);
  assert.ok(f.hp < f.maxHp || f.dead, 'plane hit the flyer');
  const b2 = mk({ bonusTypes: ['bomb'] }); const f2 = b2.spawn('flyer', 200);
  b2.useBonus('bomb', f2.x, f2.y); assert.equal(f2.hp, f2.maxHp);
});

// ---------- merge table & shop (coins) ----------
test('v0.6 item 4: merge = 3 cards of a level -> 1 card of the next level, at every level, max L10', () => {
  assert.equal(C.MERGE.cardsPerMerge, 3); assert.equal(C.MAX_CARD_LEVEL, 10);
  assert.equal(C.ECONOMY.shop.cardCopy, undefined, 'no copies in the shop any more');
});
test('v0.6 manual merge per level: 3 x Ln -> L(n+1) (+coins); highest level fights; capped at L10', () => {
  const s = M.newSave(); s.coins = 1e7;
  const c = s.cards.slingshot; assert.equal(c.level, 1); assert.equal(c.inv[1], 1); assert.equal(c.copies, undefined);
  assert.equal(M.mergeAt(s, 'slingshot', 0), null, 'there is no level 0 (no copies)');
  assert.equal(M.mergeAt(s, 'slingshot', 1), null, 'need 3 x L1');
  M.addCards(s, 'slingshot', 1, 2);
  const coins = s.coins; const r = M.mergeAt(s, 'slingshot', 1);
  assert.equal(r.to, 2); assert.equal(c.inv[1] || 0, 0); assert.equal(c.inv[2], 1); assert.equal(c.level, 2);
  assert.equal(coins - s.coins, C.MERGE.coinCost[2]);
  assert.equal(M.cardLevels(s).slingshot, 2, 'battle uses the highest level');
  // 3^9 level-1 cards = exactly one L10 card
  const start1 = s.cards.spray.inv[1] || 0;
  M.addCards(s, 'spray', 1, 3 ** 9 - start1);
  for (let L = 1; L < 10; L++) while (M.mergeAt(s, 'spray', L));
  assert.equal(s.cards.spray.level, 10); assert.equal(s.cards.spray.inv[10], 1);
  assert.equal(M.mergeRow(s.cards.spray, 10).maxed, true);
  for (let L = 1; L < 10; L++) assert.equal(s.cards.spray.inv[L] || 0, 0);
});
test('shop: cards cost coins, boosters cost diamonds (v0.4 item 9; v0.6: a bought card is a level-1 card)', () => {
  const s = M.newSave(); s.coins = 100; s.diamonds = 15;
  assert.ok(M.buyCard(s, 'slingshot')); assert.equal(s.coins, 100 - C.ECONOMY.shop.cardL1); assert.equal(s.cards.slingshot.inv[1], 2);
  assert.equal(M.buyCard(s, 'laser'), false, 'locked cards cannot be bought');
  const coins = s.coins;
  assert.ok(M.buyBonus(s, 'bomb')); assert.equal(s.coins, coins); assert.equal(s.diamonds, 0);
  assert.equal(M.buyBonus(s, 'bomb'), false, 'no diamonds left');
  s.coins = 0; assert.equal(M.buyPack(s), null);
});
test('save/load round trip through storage', () => {
  const store = new Map(); const storage = { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, v) };
  const s = M.newSave(); s.coins = 321; s.levels[0] = { cleared: true, stars: 2 };
  M.writeSave(storage, s);
  const l = M.loadSave(storage);
  assert.equal(l.coins, 321); assert.equal(l.levels[0].stars, 2);
  assert.equal(M.loadSave({ getItem: () => '{broken' }).coins, C.ECONOMY.startCoins);
});

// ---------- bot smoke ----------
test('smart bot clears level 1 and the queen level (v0.5: ranges back to v0.4.0)', () => {
  assert.equal(playLevel(0, { unlocked: unlockedAt(0) }).result, 'win');
  assert.equal(playLevel(9, { unlocked: unlockedAt(9) }).result, 'win');
});
