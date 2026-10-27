// v0.7.0: economy & balance plan (crumb-design/v0.7-economy-plan.md rev 2026-10-27 (b)). Tested here: ant values (ANT-STATS-v0.6.3
// + the plan's exceptions), explicit crumbs, Laser/Zapper base values, D-T6 in-battle power multipliers + the shown gain, hpMul
// retunes, opener rules D-R1..R3, free pack D-P0 (+ old saves), D-P2 cheapest tier + D-P3 pity, World 2 gate 18, pack reveal.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as C from '../src/config.js';
import { Battle, upgradeGain, isDamageCard, DAMAGE_UPGRADE_TOWERS } from '../src/sim.js';
import * as M from '../src/meta.js';

const src = (f) => readFileSync(new URL(`../src/${f}`, import.meta.url), 'utf8');
const TJ = JSON.parse(readFileSync(new URL('../../tuning/tuning.json', import.meta.url), 'utf8'));
const seq = (...v) => { let i = 0; return () => v[Math.min(i++, v.length - 1)]; };
const lcg = (x = 7) => () => (x = (x * 1103515245 + 12345) % 2147483648) / 2147483648;
const mk = (o = {}) => { const b = new Battle({ levelIndex: 0, deck: ['slingshot', 'spray', 'gate', 'fan', 'tractor'], seed: 1, ...o }); b.nextWaveAt = 1e9; return b; };
const near = (a, b, e = 0.011) => Math.abs(a - b) < e;

test('Must 1+2: ant HP / armor / explicit crumbs (ANT-STATS-v0.6.3 + plan exceptions)', () => {
  const want = { small: [4, 1], worker: [20, 1], big: [100, 4], gasmask: [16, 2], armored: [40, 4], flyer: [12, 2], sprinter: [10, 3], heavy: [80, 8], queen: [1200, 93], queen2: [2000, 141], small_gasmask: [4, 1], small_armed: [10, 1], small_fly: [3, 1] };
  for (const [t, [hp, cr]] of Object.entries(want)) { assert.equal(C.ANTS[t].hp, hp, `${t} hp`); assert.equal(C.ANTS[t].crumbs, cr, `${t} crumbs`); assert.equal(C.crumbsFor(t), cr, `${t} crumbsFor`); assert.equal(TJ.ants[t].crumbs, cr, `${t} explicit in tuning.json`); }
  assert.equal(C.ANTS.queen.armor, 6); assert.equal(C.ANTS.queen2.armor, 5);
  assert.ok(C.ANTS.small_gasmask.gasImmune && C.ANTS.small_fly.flying && C.ANTS.small_armed.armor === 4);
  for (const t of ['small_gasmask', 'small_armed', 'small_fly']) { assert.equal(C.ANTS[t].sizeClass, 'small'); assert.ok(C.ANTS[t].name && C.ANTS[t].desc, t); }
});

test('Must 3: Laser power 3, heatPerHit 0.1; Zapper power 10', () => {
  assert.equal(C.TOWERS.laser.stats.power, 3); assert.equal(C.TOWERS.laser.heatPerHit, 0.1); assert.equal(C.TOWERS.zapper.stats.power, 10);
});

test('Must 4: D-T6 in-battle power multipliers -> cumulative x2..x6 (Laser 1.70/2.40/3.10/4.46/6.31 at full heat)', () => {
  for (const id of DAMAGE_UPGRADE_TOWERS) {
    const g = [2, 3, 4, 5, 6].map((l) => upgradeGain(id, l));
    if (id === 'laser') g.forEach((v, i) => assert.ok(near(v, [1.70, 2.40, 3.10, 4.46, 6.31][i]), `laser L${i + 2} ${v}`));
    else if (id === 'gate') { g.slice(0, 4).forEach((v, i) => assert.ok(near(v, i + 2, 0.06), `gate L${i + 2} ${v}`)); assert.ok(g[4] >= 6 - 0.06, `gate L6 ${g[4]}`); }
    else g.forEach((v, i) => assert.ok(near(v, i + 2, 0.02), `${id} L${i + 2} ${v}`));
  }
  const g = src('game.js'); assert.ok(/dmg/.test(g) && /upgradeGain/.test(g), 'upgrade display shows the gain');
});

test('Must 5 (replaced in v0.7.3 by the C17 table; L10 2.373 and L17 2.38 since v0.7.4 M-1): hpMul per level', () => {
  const h = (n) => C.LEVELS[n - 1].hpMul;
  const want = [1, 1.56, 3, 6.6, 2.803, 4.321, 2.225, 3.72, 4.8, 2.373, 3.054, 3.387, 2.875, 3.6, 5.304, 4.213, 2.38, 3.557, 4.065, 1.6]; // C17 (crumb-design paste-mix-v073.txt)
  want.forEach((v, i) => assert.equal(h(i + 1), v, `L${i + 1}`));
});

test('Must 8: D-R1 distinct hands, D-R2 >= 2 damage cards in the opening hand, D-R3 first redraw free', () => {
  const decks = [['slingshot', 'spray', 'gate', 'fan', 'tractor'], ['fan', 'glue', 'tractor', 'slingshot', 'spray'], ['fan', 'glue', 'pheromone', 'lava', 'laser']];
  for (const deck of decks) for (let s = 0; s < 60; s++) {
    const b = mk({ deck, seed: s });
    assert.equal(new Set(b.picks).size, 3, `distinct ${deck} ${s}`);
    const dmgInDeck = deck.filter(isDamageCard).length;
    assert.ok(b.picks.filter(isDamageCard).length >= Math.min(2, dmgInDeck), `>=2 damage ${deck} ${s}: ${b.picks}`);
    assert.equal(b.rerollPrice, 0); const c = b.crumbs; assert.ok(b.reroll()); assert.equal(b.crumbs, c, 'free redraw');
    assert.equal(new Set(b.picks).size, 3); assert.ok(b.rerollPrice > 0, 'second redraw costs');
  }
  // refill after a play stays distinct (drawReplacement never repeats the 2 kept cards)
  for (let seed = 0; seed < 40; seed++) { const b = mk({ seed }); for (let k = 0; k < 3; k++) { const n = b.drawReplacement(k); const kept = b.picks.filter((_, j) => j !== k); assert.ok(!kept.includes(n), `refill ${seed}/${k}: ${n} vs ${kept}`); } }
  assert.ok(/this\.picks\[pickIndex\] = this\.drawReplacement\(pickIndex\)/.test(src('sim.js')), 'playCard refills with drawReplacement');
  assert.equal(C.BATTLE.freeRedraws, 1); assert.equal(C.BATTLE.openingDamageCards, 2); assert.ok(C.BATTLE.distinctHand);
});

test('Must 7: free pack (D-P0) after the first L2 win = 4 random owned (>= 1 damage) + Zapper last; once; old saves get it once', () => {
  for (let k = 0; k < 40; k++) {
    const s = M.newSave(); M.applyBattleResult(s, 0, 'win', 3, {}, () => 0);
    assert.equal(M.applyBattleResult(s, 1, 'win', 3, {}, () => 0).zapperGift, true);
    const r = M.claimZapperGift(s, lcg(k * 31 + 1));
    assert.equal(r.got.length, 5); assert.equal(r.got.at(-1), 'zapper'); assert.equal(r.got.slice(0, 4).filter((id) => id === 'zapper').length, 0);
    assert.ok(r.got.slice(0, 4).some(M.isDamageId), `>=1 damage: ${r.got}`);
    assert.ok(r.got.slice(0, 4).every((id) => C.STARTER_CARDS.includes(id)), 'owned only');
    assert.ok(s.cards.zapper.unlocked); assert.equal(M.claimZapperGift(s), null);
  }
  // rng forcing all-non-damage picks still yields a damage card
  const s = M.newSave(); s.onboard.zapperGift = 'pending'; const pool = C.ALL_CARDS.filter((id) => s.cards[id].unlocked);
  const fanIdx = pool.indexOf('fan'); const r = M.claimZapperGift(s, () => (fanIdx + 0.5) / pool.length);
  assert.ok(r.got.slice(0, 4).some(M.isDamageId), `forced: ${r.got}`);
  // old (v0.6, SAVE_VERSION 4) save past stage 2 that already had its gift -> one more free pack, once
  const old = { ...M.newSave(), version: 4 }; old.levels[0] = { stars: 3, cleared: true }; old.levels[1] = { stars: 2, cleared: true }; old.onboard = { zapperGift: 'done', grantedOnLoad: true };
  const store = new Map([[M.SAVE_KEY, JSON.stringify(old)]]); const st = { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, v) };
  const l = M.loadSave(st); assert.equal(l.version, 5); assert.ok(M.zapperGiftPending(l)); assert.ok(M.claimZapperGift(l, lcg(3)));
  M.writeSave(st, l); assert.equal(M.zapperGiftPending(M.loadSave(st)), false);
  // an old save that never won L2 gets nothing extra
  const fresh = { ...M.newSave(), version: 4 }; const st2 = { getItem: () => JSON.stringify(fresh), setItem: () => {} };
  assert.equal(M.zapperGiftPending(M.loadSave(st2)), false);
  assert.ok(/random \+ Zapper/.test(src('game.js')) && C.ECONOMY.shop.cardPackSize - 1 === 4, 'Shop label: 4 random + Zapper');
});

test('Should D-P2 / D-P3: the new tower comes from the cheapest locked tier; pity guarantees one by the 10th paid pack', () => {
  assert.equal(C.ECONOMY.shop.packPity, 10);
  const s = M.newSave(); s.coins = 1e6; const tier = M.cheapestLockedTier(s); assert.deepEqual(tier.sort(), ['lava', 'pheromone', 'sound']);
  for (let i = 0; i < 9; i++) assert.equal(M.buyPack(s, () => 0.99).newTower, null, `pack ${i + 1}`);
  const p10 = M.buyPack(s, () => 0.99); assert.ok(p10.newTower, 'pity on pack 10'); assert.equal(p10.at(-1), p10.newTower); assert.ok(['lava', 'pheromone', 'sound'].includes(p10.newTower));
  assert.equal(s.packsSinceNew, 0);
  // once the 100c tier is all owned -> 200c tier
  const t = M.newSave(); t.coins = 1e6; for (const id of ['lava', 'pheromone', 'sound']) M.unlockCard(t, id);
  const g = M.buyPack(t, seq(0, 0)); assert.ok(['lizard', 'gate', 'zapper'].includes(g.newTower), g.newTower);
  assert.ok(/sure in/.test(src('game.js')), 'pity hint on the pack label');
});

test('Must 9: World 2 gate = 18 stars', () => { assert.equal(TJ.worlds[1].unlock.minStarsInWorld, 18); });

test('Must 6: pack reveal for ALL packs (paid + free), skippable, no toast / NEW CARD queue for packs', () => {
  const g = src('game.js');
  assert.ok(/function openPackReveal/.test(g) && /function renderPack/.test(g) && /function skipPack/.test(g));
  assert.ok(/openPackReveal\(got, \{ source: 'paid'/.test(g)); assert.ok(/source: 'free'/.test(g));
  assert.ok(!/got\.newTower\) queueReveal/.test(g), 'no separate NEW CARD reveal for a pack');
  assert.ok(/NEW TOWER!/.test(g) && /MERGE!/.test(g) && /Tap anywhere to continue/.test(g));
  assert.ok(/reducedMotion/.test(g), 'reduced motion path');
  assert.ok(!/@capacitor\/haptics/.test(readFileSync(new URL('../package.json', import.meta.url), 'utf8')), 'no haptics dependency');
});

test('version label in game (0.7.5)', () => { assert.equal(C.VERSION, '0.7.5'); assert.ok(/'v' \+ C\.VERSION/.test(src('game.js'))); });

test('Should D-P4: per-world card-level cap in battle (W1 L4, W2 L6); the prep screen says so', () => {
  assert.equal(TJ.worlds[0].cardLevelCap, 4); assert.equal(TJ.worlds[1].cardLevelCap, 6);
  const cl = { slingshot: 9, spray: 3 };
  const b1 = new Battle({ levelIndex: 0, deck: ['slingshot', 'spray'], cardLevels: cl, seed: 1 });
  assert.deepEqual([b1.cardLevels.slingshot, b1.cardLevels.spray], [4, 3]);
  const b2 = new Battle({ levelIndex: 12, deck: ['slingshot', 'spray'], cardLevels: cl, seed: 1 });
  assert.deepEqual([b2.cardLevels.slingshot, b2.cardLevels.spray], [6, 3]);
  assert.equal(cl.slingshot, 9, 'the save is not touched');
  assert.ok(/Cards act as L\$\{cap\} max/.test(src('game.js')));
});

test('Should D-A6 (updated for the v0.7.3 C17 mixes): variants wired - small_gasmask from L2 (wave 3), small_fly from L3, small_armed from L5 (<= 5 ant types each)', async () => {
  const { levelAntTypes } = await import('../src/sim.js');
  const first = (t) => C.LEVELS.findIndex((L) => L.mix.some((m) => m.type === t)) + 1;
  assert.equal(first('small_gasmask'), 2); assert.equal(first('small_fly'), 3); assert.equal(first('small_armed'), 5);
  for (const i of [2, 3, 4]) assert.ok(levelAntTypes(i).length <= 5, `L${i + 1}`);
  assert.ok(!levelAntTypes(0).some((t) => t.startsWith('small_')), 'L1 stays tutorial-clean'); // C17: L2 gets small_gasmask from wave 3
});
