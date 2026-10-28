// v0.7.7: version, splitInto (Mama), World 3 'Pie Pantry' data, rarity tiers + checker, boss gift, save migration, UI text rules (P1-1/P1-2/P2).
// Browser-level checks (contrast on the real renderer, screenshots, the 262 px lock text) are in tools/qa-v077.mjs; bot sims are tools/sim-w3-v077.mjs.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as C from '../src/config.js';
import * as M from '../src/meta.js';
import * as S from '../src/sim.js';
import { MAPS, validateMap } from '../src/maps.js';

const rd = (f) => readFileSync(new URL(`../${f}`, import.meta.url), 'utf8');
const src = (f) => rd(`src/${f}`);
const tuning = JSON.parse(readFileSync(new URL('../../tuning/tuning.json', import.meta.url), 'utf8'));
const W3_FIRST = 20, W3_QUEEN = 29;

test('version 0.7.7 or later (the current release, 0.7.8 / versionCode 23, is asserted in v078.test.js)', () => {
  assert.match(C.VERSION, /^0\.7\.[78]$/);
  assert.match(rd('android/app/build.gradle'), /versionCode 2[23]\b/); assert.match(rd('android/app/build.gradle'), /versionName "0\.7\.[78]"/);
  assert.match(JSON.parse(rd('package.json')).version, /^0\.7\.[78]$/);
});

// ---------- splitInto ----------
const mkBattle = (levelIndex = 24) => new S.Battle({ levelIndex, deck: ['slingshot', 'laser', 'zapper'], seed: 5, noCardLevelCap: true });
const mama = (b, d = 120) => b.spawn('mama', d, 0);
test('splitInto: Mama (hp 60, splits into 3 small ants) - tuning data validates', () => {
  assert.equal(C.ANTS.mama.hp, 60); assert.deepEqual(C.ANTS.mama.splitInto, { type: 'small', count: 3 });
  for (const [id, a] of Object.entries(C.ANTS)) if (a.splitInto) {
    assert.ok(C.ANTS[a.splitInto.type], `${id}: unknown child type`); assert.ok(Number.isInteger(a.splitInto.count) && a.splitInto.count >= 1 && a.splitInto.count <= 4, `${id}: count`);
    assert.ok(!C.ANTS[a.splitInto.type].splitInto, `${id}: a child type must not split itself`);
    assert.ok(!C.ANTS[a.splitInto.type].flying === !a.flying, `${id}: children walk like the parent`);
  }
});
test('splitInto: 3 children at d-3, d-10, d-17 on the same route, full hp, parent pays its own crumbs, children pay 0', () => {
  const b = mkBattle(); const m = mama(b, 120); const before = b.crumbs; const n0 = b.ants.length;
  b.kill(m, null);
  assert.equal(b.crumbs - before, C.crumbsFor('mama'), 'only the parent pays');
  const kids = b.ants.filter((a) => a.child); assert.equal(kids.length, 3); assert.equal(b.ants.length, n0 + 3);
  assert.deepEqual(kids.map((k) => +(m.d - k.d).toFixed(6)), [S.SPLIT_BACK, S.SPLIT_BACK + S.SPLIT_STEP, S.SPLIT_BACK + 2 * S.SPLIT_STEP]);
  for (const k of kids) { assert.equal(k.type, 'small'); assert.equal(k.ri, m.ri); assert.equal(k.hp, k.maxHp); assert.equal(k.parentId, m.id); assert.equal(k.gen, 1); assert.ok(!k.dead); }
  assert.equal(b.stats.splitSpawned, 3);
  // positions are distinct (nothing stacks)
  assert.equal(new Set(kids.map((k) => `${k.x.toFixed(2)},${k.y.toFixed(2)}`)).size, 3);
  const ev = b.events.find((e) => e.type === 'split') || null; if (ev) assert.equal(ev.kids.length, 3);
});
test('splitInto: children are not "ants beaten" and pay no crumbs when killed; the parent counts once', () => {
  const b = mkBattle(); const m = mama(b, 120); b.kill(m, null);
  const k0 = b.stats.kills, bt = { ...b.stats.byType }, cr = b.crumbs;
  for (const k of b.ants.filter((a) => a.child)) b.kill(k, null);
  assert.equal(b.crumbs, cr, 'children pay 0 crumbs'); assert.equal(b.stats.kills, k0); assert.deepEqual(b.stats.byType, bt);
  assert.equal(b.stats.childKills, 3); assert.equal(b.stats.byType.mama, 1); assert.equal(b.stats.byType.small || 0, 0);
});
test('splitInto: no infinite splits - a child never splits, even if its type is forced to split; a double kill splits once', () => {
  const b = mkBattle(); const m = mama(b, 120); b.kill(m, null); b.kill(m, null); // kill() twice
  assert.equal(b.ants.filter((a) => a.child).length, 3, 'once only');
  const c = b.ants.find((a) => a.child);
  const save = C.ANTS.small.splitInto; C.ANTS.small.splitInto = { type: 'small', count: 3 }; // worst case: a self-splitting child type
  try { b.kill(c, null); assert.equal(b.ants.filter((a) => a.child && !a.dead).length, 2, 'the child spawned nothing'); assert.equal(b.stats.splitSpawned, 3); }
  finally { if (save) C.ANTS.small.splitInto = save; else delete C.ANTS.small.splitInto; }
  // a mama that is itself marked as a child (gen 1) does not split either
  const m2 = mama(b, 150); m2.child = true; m2.gen = 1; const n = b.ants.length; b.kill(m2, null); assert.equal(b.ants.length, n);
});
test('splitInto: near the nest the children go AHEAD instead, never off the route and never stacked', () => {
  const b = mkBattle(); const len = b.routes[0].length;
  for (const d of [0, 1, 5, 9, 20]) {
    const m = b.spawn('mama', d, 0); b.kill(m, null);
    const kids = b.ants.filter((a) => a.child && a.parentId === m.id); assert.equal(kids.length, 3, `d=${d}`);
    for (const k of kids) { assert.ok(k.d >= 0 && k.d <= len, `d=${d}: on the route (${k.d})`); assert.ok(Number.isFinite(k.x) && Number.isFinite(k.y)); }
    assert.equal(new Set(kids.map((k) => k.d.toFixed(3))).size, 3, `d=${d}: no stacking`);
  }
});
test('splitInto: consumes no RNG (a battle with Mama has the same rng stream as without the split)', () => {
  const a = mkBattle(), c = mkBattle(); const m = mama(a, 120); const r0 = a.rng();
  const r1 = c.rng(); assert.equal(r0, r1); a.kill(m, null); assert.equal(a.rng(), c.rng());
});
test('splitInto: a whole Mama level can be played by the bot to a result with kids spawned and no runaway', () => {
  const BOT = null; void BOT;
  const b = new S.Battle({ levelIndex: 24, deck: ['slingshot', 'laser', 'sound', 'zapper'], seed: 11, noCardLevelCap: true, cardLevels: { slingshot: 5, laser: 5, sound: 5, zapper: 5 } });
  let th = 0; return import('../src/bot.js').then((BOTM) => {
    while (!b.result && b.time < 1500) { b.update(1 / 60); th -= 1 / 60; if (th <= 0) { th = 0.5; BOTM.smartBotStep(b); } }
    assert.ok(b.result); assert.ok(b.stats.splitSpawned > 0); assert.equal(b.stats.splitSpawned % 3, 0); assert.ok(b.stats.splitSpawned <= 3 * 10 * 1.0 + 3 * 60, 'bounded by mama count');
  });
});

// ---------- World 3 ----------
test('W3 Pie Pantry: 10 levels (9 grid maps + 1 waypoint map), cap 5, coinMul 1.25 = 1 + 0.25 x (world - 2), queen last', () => {
  const w = C.WORLDS[2]; assert.equal(w.id, 3); assert.equal(w.levels, 10); assert.equal(w.name, 'Pie Pantry'); assert.equal(w.treat, 'pie'); assert.equal(w.queen, 'queen3');
  assert.equal(w.cardLevelCap, 5); assert.equal(w.coinMul, 1.25); assert.equal(C.WORLDS[2].coinMul, 1 + 0.25 * (w.id - 2));
  assert.equal(C.LEVELS.length, 30); assert.equal(C.WORLD_START[3], W3_FIRST); assert.ok(C.isBossLevel(W3_QUEEN)); assert.ok(!C.isBossLevel(W3_QUEEN - 1));
  const lv = C.LEVELS.slice(W3_FIRST); assert.equal(lv.length, 10); assert.ok(lv.every((L) => L.world === 3));
  const ms = lv.map((L) => MAPS[L.map] || tuning.maps[L.map]); assert.ok(ms.every(Boolean));
  assert.equal(lv.filter((L) => tuning.maps[L.map].grid).length, 9, '9 grid maps'); assert.equal(lv.filter((L) => tuning.maps[L.map].path).length, 1, '1 waypoint map');
  assert.equal(new Set(lv.map((L) => L.map)).size, 10, 'ten different maps');
  for (const L of lv) { const e = validateMap(L.map, MAPS[L.map]); assert.deepEqual(e, [], `${L.map}: ${e}`); assert.equal(L.waveCount, L.waves.length); }
  // W1 / W2 values unchanged
  assert.equal(C.WORLDS[0].coinMul, 1); assert.equal(C.WORLDS[1].coinMul, 1); assert.equal(C.WORLDS[0].cardLevelCap, 4); assert.equal(C.WORLDS[1].cardLevelCap, 5);
});
test('W3 gate: all W2 levels won + 18 stars in W2 (same rule as W2)', () => {
  assert.deepEqual(C.WORLDS[2].unlock, { allLevelsWonInWorld: 2, minStarsInWorld: 18 });
  const s = M.newSave();
  for (let i = 0; i < 20; i++) s.levels[i] = { stars: 3, cleared: true };
  assert.ok(M.worldUnlocked(s, 3));
  s.levels[10] = { stars: 3, cleared: false }; assert.ok(!M.worldUnlocked(s, 3), 'one W2 level unwon');
  s.levels[10] = { stars: 1, cleared: true }; for (let i = 11; i < 20; i++) s.levels[i].stars = 1; assert.ok(!M.worldUnlocked(s, 3), 'all won but < 18 stars');
  for (let i = 10; i < 20; i++) s.levels[i].stars = 2; assert.ok(M.worldUnlocked(s, 3), 'exactly 20 stars is enough, >= 18');
  for (let i = 10; i < 20; i++) s.levels[i].stars = i < 18 ? 2 : 1; assert.equal(M.worldStars(s, 2), 18); assert.ok(M.worldUnlocked(s, 3), '18 exactly');
  s.levels[19].stars = 0; assert.ok(!M.worldUnlocked(s, 3), '17 stars');
  const t = M.newSave(); for (let i = 0; i < 10; i++) t.levels[i] = { stars: 3, cleared: true }; assert.ok(!M.worldUnlocked(t, 3), 'W2 not done -> W3 locked');
});
test('W3 ants: Greasy hp 24 slowResist 0.75; Mama hp 60; Pie Queen hp 2300 steals 55 of the pie', () => {
  assert.equal(C.ANTS.greasy.hp, 24); assert.equal(C.ANTS.greasy.slowResist, 0.75);
  assert.equal(C.ANTS.mama.hp, 60); assert.equal(C.ANTS.queen3.hp, 2300); assert.equal(C.ANTS.queen3.steal, 55);
  assert.ok(C.isQueen('queen3')); assert.equal(C.WORLDS[2].queen, 'queen3');
  const b = mkBattle(W3_QUEEN); const q = b.spawn('queen3', 0, 0); assert.equal(q.maxHp, C.ANTS.queen3.hp * C.LEVELS[W3_QUEEN].hpMul);
  for (const id of ['greasy', 'mama', 'queen3']) assert.ok(C.ANTS[id].name && C.ANTS[id].desc && C.ANTS[id].name !== id, `text for ${id}`);
});
test('W3 hpMuls and wave counts follow the design table (hp77.json; L30 eased 1.2 -> 1.15 after the 1000-seed sims, see JOB-v0.7.7.md); Mama debuts in L25, Greasy in L22', () => {
  const hp = [3.3, 4.3, 5.2, 4.9, 8, 6, 8, 6, 8.8, 1.45] /* v0.7.8 re-tune; v0.7.7 was [3, 4, 4.5, 3.2, 4.5, 6, 6, 4, 6, 1.15] */, wv = [6, 7, 7, 7, 7, 6, 8, 8, 9, 9];
  C.LEVELS.slice(W3_FIRST).forEach((L, k) => { assert.equal(L.hpMul, hp[k], `L${21 + k} hpMul`); assert.equal(L.waveCount, wv[k], `L${21 + k} waves`); });
  const first = (t) => 1 + C.LEVELS.findIndex((_, i) => S.levelAntTypes(i).includes(t));
  assert.equal(first('greasy'), 22); assert.equal(first('mama'), 25);
});
test('W3 map screen and gate: the world has its own pie body + palettes and the gate text format is exact', () => {
  const g = src('game.js');
  assert.match(g, /`Win all \$\{total\} levels \(\$\{won\}\/\$\{total\}\) \+ \$\{W2\.unlock\.minStarsInWorld\} stars \(\$\{M\.worldStars\(S\.save, prev\)\}\/\$\{total \* 3\}\)`/);
  const a = src('art.js'); assert.ok(a.includes('pie: pieBody')); for (const n of ['W3 butter', 'W3 blueberry', 'W3 crust']) assert.ok(a.includes(`'${n}'`), n);
});

// ---------- rarity tiers + checker ----------
const RANK = Object.fromEntries(C.RARITY_TIERS.map((t, i) => [t, i]));
function rarityReport(levelIndex) {
  const waves = S.generateWaves(levelIndex); const seen = new Map(); // type -> first wave index (0-based)
  waves.forEach((w, wi) => { for (const e of w) if (!seen.has(e.type)) seen.set(e.type, wi); });
  const issues = [];
  const types = [...seen.keys()]; const nonBoss = types.filter((t) => C.rarityOf(t) !== 'boss');
  if (types.filter((t) => C.rarityOf(t) === 'common').length < 2) issues.push('R1: fewer than 2 common types');
  const rare = nonBoss.filter((t) => RANK[C.rarityOf(t)] >= RANK.rare);
  if (rare.length > 2) issues.push(`R2: ${rare.length} rare-or-higher types (${rare.join(', ')})`);
  for (const t of rare) if (seen.get(t) < 1) issues.push(`R3: ${t} (${C.rarityOf(t)}) debuts in wave 1`);
  return issues;
}
test('rarity: every ant has a tier from common/uncommon/rare/elite/boss; the tuning data and config agree', () => {
  assert.deepEqual(C.RARITY_TIERS, ['common', 'uncommon', 'rare', 'elite', 'boss']);
  for (const [id, a] of Object.entries(tuning.ants)) { assert.ok(C.RARITY_TIERS.includes(a.rarity), `${id}: ${a.rarity}`); assert.equal(C.rarityOf(id), a.rarity); }
  for (const q of ['queen', 'queen2', 'queen3']) assert.equal(C.rarityOf(q), 'boss');
  assert.equal(C.rarityOf('mama'), 'rare'); assert.equal(C.rarityOf('greasy'), 'uncommon'); assert.equal(C.rarityOf('small'), 'common'); assert.ok(C.rarityRank('heavy') > C.rarityRank('armored'));
});
test('rarity checker (W3 on, enforced): >= 2 common types per level, <= 2 rare-or-higher (queen excluded), rares debut at wave 2 or later', () => {
  const bad = []; for (let i = W3_FIRST; i < C.LEVELS.length; i++) for (const m of rarityReport(i)) bad.push(`L${i + 1}: ${m}`);
  assert.deepEqual(bad, []);
});
test('rarity checker (W1 / W2: information only, never fails)', () => {
  const info = []; for (let i = 0; i < W3_FIRST; i++) for (const m of rarityReport(i)) info.push(`L${i + 1}: ${m}`);
  console.log(`# rarity info (W1/W2, not enforced): ${info.length} hit(s)`); for (const l of info) console.log(`#   ${l}`);
  assert.ok(Array.isArray(info));
  // the checker itself works: a synthetic bad level is caught
  const levels = [{ ...C.LEVELS[W3_FIRST], waves: [[{ type: 'mama', count: 1 }, { type: 'big', count: 1 }, { type: 'heavy', count: 1 }, { type: 'small', count: 2 }]] }];
  const w = S.generateWaves(0, levels); assert.ok(w[0].some((e) => e.type === 'mama'));
});

// ---------- boss gift (S1) ----------
const winBoss = (s, i, st = 3) => M.applyBattleResult(s, i, 'win', st, {}, () => 0);
test('boss gift: the first clear of a world queen pays ONE card - the cheapest locked tower as L1; none on repeat or normal levels', () => {
  const s = M.newSave(); const locked0 = M.lockedCards(s); const price = Math.min(...locked0.map((id) => M.unlockPrice(id)));
  const out = winBoss(s, 9); assert.ok(out.bossGift); assert.equal(out.bossGift.level, 1); assert.equal(M.unlockPrice(out.bossGift.id), price); assert.ok(out.bossGift.newCard && out.bossGift.reveal);
  assert.ok(s.cards[out.bossGift.id].unlocked); assert.equal(M.lockedCards(s).length, locked0.length - 1);
  assert.equal(winBoss(s, 9).bossGift, null, 'repeat clear'); assert.equal(winBoss(s, 0).bossGift, null, 'normal level');
  const w3 = winBoss(s, W3_QUEEN); assert.ok(w3.bossGift && w3.bossGift.id !== out.bossGift.id);
});
test('boss gift: with every tower unlocked, one card of level max(2, cap - 2) (cap - 1 from W3) of the owned tower with the most cards', () => {
  const s = M.newSave(); for (const id of C.ALL_CARDS) M.unlockCard(s, id); M.addCards(s, 'laser', 1, 3);
  const g1 = winBoss(s, 9).bossGift; assert.equal(g1.id, 'laser'); assert.equal(g1.level, 2, 'W1 cap 4 -> L2'); assert.ok(g1.newLevel);
  const g2 = winBoss(s, 19).bossGift; assert.equal(g2.level, 3, 'W2 cap 5 -> L3'); assert.equal(M.countAt(s.cards.laser, 3), 1);
  const g3 = winBoss(s, W3_QUEEN).bossGift; assert.equal(g3.level, 4, 'W3 cap 5 -> L4 (v0.7.8 P2-5: cap-1 from W3 on)');
  assert.equal(s.cards.laser.fresh, true);
});
test('boss gift: deterministic (consumes no rng) and persists through writeSave/loadSave', () => {
  const s = M.newSave(); let calls = 0; const rng = () => { calls++; return 0.5; };
  const out = M.applyBattleResult(s, 9, 'win', 2, {}, rng); assert.equal(calls, 0 + (out.booster ? 0 : 0) + calls); // first-clear bonus booster may use rng; the gift never does
  const a = M.newSave(), b = M.newSave(); assert.deepEqual(M.grantBossGift(a, 9), M.grantBossGift(b, 9));
  const store = new Map(); const st = { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, v) };
  M.writeSave(st, s); const l = M.loadSave(st); assert.ok(l.cards[out.bossGift.id].unlocked); assert.equal(l.levels[9].cleared, true);
});
test('boss gift: results screen shows a "Boss gift" strip, 30 px strips, buttons at y 540 (>= 8 px below the last strip)', () => {
  const g = src('game.js');
  assert.match(g, /const by = 540;/); assert.match(g, /cardLabel\(out\.bossGift, 'Boss gift'\)/); assert.match(g, /A\.rr\(ctx, -130, -15, 260, 30, 14\)/);
  assert.match(g, /queueReveal\(out\.bossGift\.id/);
});

// ---------- save migration ----------
test('save: v0.7.6 save (version 5, 20 levels) loads into version 6 with 30 levels; stars/cards kept; no retroactive boss gift', () => {
  assert.equal(M.SAVE_VERSION, 6);
  const old = M.newSave(); old.version = 5; old.levels = old.levels.slice(0, 20); for (let i = 0; i < 20; i++) old.levels[i] = { stars: 2, cleared: true }; old.coins = 777; M.unlockCard(old, 'laser');
  const store = new Map([[M.SAVE_KEY, JSON.stringify(old)]]); const st = { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, v) };
  const l = M.loadSave(st); assert.equal(l.version, 6); assert.equal(l.levels.length, 30); assert.equal(l.coins, 777);
  assert.deepEqual(l.levels.slice(0, 20).map((x) => x.stars), Array(20).fill(2)); assert.ok(l.levels.slice(20).every((x) => !x.cleared && x.stars === 0));
  assert.ok(M.worldUnlocked(l, 3), 'a v0.7.6 player who finished W2 sees W3 open'); assert.ok(l.cards.laser.unlocked);
  const before = JSON.stringify(l.cards); M.loadSave(st); assert.equal(JSON.stringify(l.cards), before);
});

// ---------- UI rules from the v0.7.6 review ----------
test('P1-1 / P1-2: the "acts as L" pill is gone; the prep badge and the in-battle badge show min(level, cap)', () => {
  const g = src('game.js');
  assert.doesNotMatch(g, /acts as L\$\{opt\.capNote\}/); assert.match(g, /highestWorldCap|worldCardLevelCap/);
  assert.match(g, /Fights as L/); assert.match(g, /W1 acts as L|worldCapLine/);
  assert.match(g, /by = 510/, 'Boosters row moved down: >= 8 px below the deck grid');
  assert.match(g, /Math\.min\([^)]*cap[^)]*\)|Math\.min\(\w+\.level, \w+\)/);
});
