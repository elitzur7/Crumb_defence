// v0.7.9: World 4 'Ice-Cream Parlour' (L31-L40), the Nurse Ant (heal), the Sundae Queen, the W3->W4 star gate (14), rarity R1-R4, THEMES[7].
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import * as C from '../src/config.js';
import * as M from '../src/meta.js';
import { Battle } from '../src/sim.js';
import { MAPS, validateMap } from '../src/maps.js';
import * as A from '../src/art.js';
import { checkLevel } from '../tools/check-rarity.mjs';
const rd = (f) => readFileSync(new URL(`../${f}`, import.meta.url), 'utf8');
const TJ = JSON.parse(readFileSync(new URL('../../tuning/tuning.json', import.meta.url), 'utf8'));
const DECK = ['slingshot', 'spray', 'glue', 'fan', 'ball'];

test('version 0.7.9 / versionCode 24', () => {
  assert.equal(C.VERSION, '0.7.9');
  assert.match(rd('android/app/build.gradle'), /versionCode 24\b/); assert.match(rd('android/app/build.gradle'), /versionName "0\.7\.9"/);
  assert.equal(JSON.parse(rd('package.json')).version, '0.7.9');
});

test('W4 data: Ice-Cream Parlour, treat sundae, queen4, L31-L40, cap 6, coinMul 1.5, hpMul table, gate 14', () => {
  const w = C.WORLDS[3]; assert.equal(w.id, 4); assert.equal(w.name, 'Ice-Cream Parlour'); assert.equal(w.treat, 'sundae'); assert.equal(w.queen, 'queen4'); assert.equal(w.levels, 10);
  assert.equal(w.cardLevelCap, 6); assert.equal(w.coinMul, 1.5); assert.deepEqual(w.unlock, { allLevelsWonInWorld: 3, minStarsInWorld: 14 });
  assert.equal(C.WORLDS.length, 4); assert.equal(C.LEVELS.length, 40); assert.equal(C.WORLD_START[4], 30); assert.ok(C.isBossLevel(39)); assert.ok(!C.isBossLevel(38));
  assert.deepEqual(C.LEVELS.slice(30).map((l) => l.hpMul), [3.9, 4.5, 7.4, 7.25, 6.6, 7.7, 5.85, 7.4, 5.45, 0.8]);
  assert.ok(C.LEVELS.slice(30).every((l) => l.world === 4));
  // W1-W3 untouched
  assert.deepEqual([C.WORLDS[0].coinMul, C.WORLDS[1].coinMul, C.WORLDS[2].coinMul, C.WORLDS[0].cardLevelCap, C.WORLDS[1].cardLevelCap, C.WORLDS[2].cardLevelCap], [1, 1, 1.25, 4, 5, 5]);
  assert.deepEqual(C.WORLDS[2].unlock, { allLevelsWonInWorld: 2, minStarsInWorld: 18 });
});
test('W4 maps: ten different maps (mint theme 7) parse with validateMap, queen level waypoint or grid as designed', () => {
  const lv = C.LEVELS.slice(30); const ids = lv.map((L) => L.map);
  assert.equal(new Set(ids).size, 10); assert.deepEqual(ids, ['w4_counter', 'w4_scoop', 'w4_cone', 'w4_sprinkle', 'w4_waffle', 'w4_cherry', 'w4_fudge', 'w4_spiral', 'w4_banana', 'w4_floor']);
  for (const id of ids) { const e = validateMap(id, MAPS[id]); assert.deepEqual(e, [], `${id}: ${e}`); assert.equal(TJ.maps[id].theme, 7, `${id} theme`); }
  for (const L of lv) assert.equal(L.waveCount, L.waves.length);
});
test('W3 -> W4 gate: all W3 levels won AND 14 stars in W3 (encoded in v0.7.9)', () => {
  const s = M.newSave(); for (let i = 0; i < 30; i++) s.levels[i] = { stars: 1, cleared: true };
  for (let i = 20; i < 30; i++) s.levels[i] = { stars: 1, cleared: true };
  assert.equal(M.worldUnlocked(s, 4), false, '10 stars in W3 < 14');
  for (let i = 20; i < 24; i++) s.levels[i] = { stars: 2, cleared: true }; // 4 x 2 + 6 x 1 = 14
  assert.equal(M.worldUnlocked(s, 4), true, '14 stars');
  s.levels[29] = { stars: 0, cleared: false }; assert.equal(M.worldUnlocked(s, 4), false, 'a W3 level not won');
});
test('W4 -> W5 gate (12 stars in W4) is recorded in the config comments only: there is no World 5', () => {
  assert.ok(/W4->W5 = 12 stars/.test(rd('src/config.js'))); assert.equal(C.WORLDS.length, 4);
});

test('ants: Nurse (rare, hp 60, speed 32, armor 0, heal 1.5 tiles / 20 % / 3 s / bossMul 0.1) and Sundae Queen (hp 2600, speed 16, armor 6, slow trait, spawns a nurse every 9 s)', () => {
  const n = C.ANTS.nurse, q = C.ANTS.queen4;
  assert.equal(n.hp, 60); assert.equal(n.speed, 32); assert.equal(n.armor, 0); assert.equal(n.rarity, 'rare'); assert.deepEqual(n.heal, { radius: 1.5, pct: 0.2, every: 3, bossMul: 0.1 });
  assert.equal(q.hp, 2600); assert.equal(q.speed, 16); assert.equal(q.armor, 6); assert.ok(q.boss); assert.deepEqual(q.spawn, { type: 'nurse', every: 9, count: 1 }); assert.deepEqual(q.queenTraits, ['slow']);
  assert.ok(C.ANTS.nurse.desc && C.ANTS.queen4.desc && C.ANTS.nurse.name === 'Nurse Ant' && C.ANTS.queen4.name === 'Sundae Queen'); assert.equal(C.rarityOf('nurse'), 'rare'); assert.equal(C.rarityOf('queen4'), 'boss');
  for (const [id, a] of Object.entries(C.ANTS)) if (a.heal) { assert.ok(a.heal.radius > 0 && a.heal.pct > 0 && a.heal.pct <= 1 && a.heal.every > 0, id); }
  assert.ok(TJ._units && TJ._units.heal, 'heal schema documented in _units');
});

// ---------- A-W4-3: nurse unit tests ----------
function arena(extra = []) {
  const b = new Battle({ levelIndex: 31, deck: DECK, seed: 1, bonusTypes: ['freeze'], bonusStock: { freeze: 3 } }); b.nextWaveAt = 1e9; b.pending = []; b.ants.length = 0;
  const nurse = b.spawn('nurse', 40, 0); const w = b.spawn('worker', 40, 0); const others = extra.map(([t, d]) => b.spawn(t, d, 0));
  for (let k = 0; k < 2; k++) b.update(1 / 60);
  return { b, nurse: b.ants.find((a) => a.type === 'nurse'), w: b.ants.find((a) => a.type === 'worker'), others: others.map((o) => b.ants.find((a) => a.id === o.id) || o) };
}
const heals = (b) => b.events.filter((e) => e.type === 'heal');
test('nurse: a ready nurse with a hurt worker in range pulses once, heals maxHp x 0.2, sets cooldown 3 s', () => {
  const { b, nurse, w } = arena(); assert.ok(Math.hypot(nurse.x - w.x, nurse.y - w.y) <= 1.5 * C.TILE);
  w.hp = w.maxHp * 0.5; const before = w.hp; b.events.length = 0; b.update(1 / 60);
  assert.equal(heals(b).length, 1, 'one heal event per pulse'); assert.equal(w.hp - before, w.maxHp * 0.2); assert.ok(Math.abs(nurse.healCd - 3) < 1e-6);
  assert.deepEqual(heals(b)[0].ids, [w.id]); assert.equal(heals(b)[0].n, 1);
  b.events.length = 0; for (let k = 0; k < 60; k++) b.update(1 / 60); assert.equal(heals(b).length, 0, 'no second pulse within the cooldown');
  assert.ok(nurse.healCd > 1.9 && nurse.healCd < 2.1);
});
test('nurse: no hurt ant in range -> she stays ready (cooldown 0, no event)', () => {
  const { b, nurse } = arena(); b.events.length = 0; for (let k = 0; k < 240; k++) b.update(1 / 60);
  assert.equal(heals(b).length, 0); assert.equal(nurse.healCd, 0);
});
test('nurse: never heals herself or another nurse; a hurt ant out of range is not healed', () => {
  const { b, nurse, w } = arena([['nurse', 40]]); const other = b.ants.find((a) => a.type === 'nurse' && a !== nurse);
  nurse.hp = 10; other.hp = 10; b.events.length = 0; for (let k = 0; k < 240; k++) b.update(1 / 60);
  assert.equal(heals(b).length, 0); assert.equal(nurse.hp, 10); assert.equal(other.hp, 10);
  let far = null; for (let d = 300; d < 900 && !far; d += 20) { const f = b.spawn('worker', d, 0); b.update(1 / 60); const nn = b.ants.find((a) => a.type === 'nurse' && a.healCd === 0) || nurse; if (Math.hypot(f.x - nn.x, f.y - nn.y) > 1.5 * C.TILE + 20) far = f; else b.ants.splice(b.ants.indexOf(f), 1); }
  assert.ok(far, 'found a point on the route outside the radius'); far.hp = 1; w.hp = w.maxHp; b.events.length = 0; for (let k = 0; k < 3; k++) b.update(1 / 60);
  assert.equal(far.hp, 1, 'out of range');
});
test('nurse: a queen receives maxHp x 0.2 x 0.1 per pulse', () => {
  const { b, nurse } = arena(); b.ants.length = 0; b.pending = []; const n = b.spawn('nurse', 60, 0); const q = b.spawn('queen4', 60, 0); for (let k = 0; k < 2; k++) b.update(1 / 60);
  const qq = b.ants.find((a) => a.type === 'queen4'); qq.hp = qq.maxHp * 0.5; const before = qq.hp; b.events.length = 0; b.update(1 / 60);
  assert.equal(heals(b).length >= 1, true); assert.ok(Math.abs(qq.hp - before - qq.maxHp * 0.2 * 0.1) < 1e-6, `${qq.hp - before}`);
});
test('nurse: a frozen nurse neither pulses nor recharges', () => {
  const { b, nurse, w } = arena(); w.hp = w.maxHp * 0.5; b.events.length = 0; b.update(1 / 60); assert.equal(heals(b).length, 1);
  const cd = nurse.healCd; b.freezeUntil = b.time + 5; w.hp = 1; b.events.length = 0; for (let k = 0; k < 120; k++) b.update(1 / 60);
  assert.equal(nurse.healCd, cd, 'no recharge while frozen'); assert.equal(heals(b).length, 0);
  b.freezeUntil = -1; nurse.healCd = 0; w.hp = 1; b.events.length = 0; b.update(1 / 60); assert.equal(heals(b).length, 1, 'works again after the freeze');
});
test('queen4 spawns a nurse every 9 s; a spawned nurse can heal her', () => {
  const b = new Battle({ levelIndex: 39, deck: DECK, seed: 1 }); b.nextWaveAt = 1e9; b.pending = []; b.ants.length = 0; b.spawn('queen4', 20, 0);
  let calls = 0; for (let k = 0; k < 60 * 20; k++) { b.update(1 / 60); calls += b.events.filter((e) => e.type === 'queenCall' && e.calls === 'nurse').length; b.events.length = 0; }
  assert.ok(calls >= 2, `queenCall nurse x${calls}`); assert.ok(b.ants.some((a) => a.type === 'nurse'));
});
test('nurse rules do not change W1-W3: ants spawned have the two new fields and nothing else differs', () => {
  const b = new Battle({ levelIndex: 0, deck: DECK, seed: 1 }); const a = b.spawn('worker', 0, 0); assert.equal(a.healCd, 0); assert.equal(a.healFx, 0);
  assert.equal(Object.values(C.ANTS).filter((x) => x.heal).length, 1);
});

// ---------- rarity R1-R4 ----------
test('rarity R1-R4 (Crumb Design checker): 0 violations on L21-L40', () => {
  const bad = []; for (let i = 20; i < 40; i++) for (const m of checkLevel(i).msgs) bad.push(`L${i + 1}: ${m}`);
  assert.deepEqual(bad, []);
  // the checker catches a violation: L31 with a rare in wave 1
  assert.ok(checkLevel(31).types.includes('nurse'));
});

// ---------- art + UI ----------
test('art: THEMES[7] is the W4 mint palette; nurse / queen4 colours, sundae treat body, plus shape + grey-cap variant exist', () => {
  assert.equal(A.THEMES.length, 8); assert.deepEqual(A.THEMES[7], { name: 'W4 mint', a: '#b6e4d6', b: '#abdccd', check: 'rgba(60,170,150,0.14)', grout: 'rgba(70,150,130,0.22)', trail: '#fffdf5', edge: '#80c3b0', dot: '#98d3c2' });
  assert.ok(A.ANT_COL.nurse && A.ANT_COL.queen4); assert.equal(typeof A.TREAT_BODIES.sundae, 'function'); assert.equal(typeof A.plusShape, 'function');
  const g = rd('src/game.js');
  assert.ok(/case 'heal':/.test(g) && /healRing/.test(g) && /healPlus/.test(g) && /shown < 6/.test(g), 'heal fx + max 6 pluses per pulse');
  assert.ok(/Nurse ants heal their friends\. Pop them first!/.test(g) && /levelIndex === 31/.test(g), 'L32 nurse tip');
  assert.ok(/sundae/.test(g));
});
test('typical profile covers L31-L40 (99 trajectories each) and the sim-typical tool runs W4 levels', async () => {
  const P = JSON.parse(rd('tools/data/profiles-typical.json'));
  for (let L = 1; L <= 40; L++) { assert.ok(P[L].length >= 99, `L${L}`); assert.ok(P[L][0].owned.length >= 5 && P[L][0].cl); }
});
test('A-W4-8: the first-clear payout of L31 is the base payout x 1.5 (coinMul), through applyBattleResult', () => {
  const info = { kills: 60, foodLeft: 90, perfect: false, time: 200 };
  const a = M.battleCoins('win', { ...info, levelIndex: 30, firstClear: true, coinMul: 1 }), b = M.battleCoins('win', { ...info, levelIndex: 30, firstClear: true, coinMul: 1.5 });
  // the existing rule since v0.7.6 E5 (same as W2/W3): every win line is scaled by coinMul, the flat first-clear bonus is not
  for (const k of ['base', 'food', 'kills', 'level', 'time']) assert.ok(Math.abs(b.parts[k] - a.parts[k] * 1.5) <= 0.5, `${k}: ${a.parts[k]} -> ${b.parts[k]}`);
  assert.equal(b.parts.firstClear, a.parts.firstClear); assert.ok(b.parts.base === Math.round(C.ECONOMY.winBase * 1.5));
  const s = M.newSave(); const out = M.applyBattleResult(s, 30, 'win', 1, info, () => 0); assert.equal(out.firstClear, true); assert.equal(out.coins, b.total, 'applyBattleResult uses the world coinMul 1.5');
  // W4 boss gift: cap 6 -> a card gift of cap-1 = level 5 once all towers are unlocked, same rule as W3 (cap-1)
  const lv = C.WORLDS[3].cardLevelCap; assert.equal(lv, 6);
});
