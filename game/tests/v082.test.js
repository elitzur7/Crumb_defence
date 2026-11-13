// v0.8.2 tests (grown pass by pass). Pass 1: QA6 level lint, R4 evidence hints, R6/R12 prep screen, R5 result header, release metadata is added at the release step.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import TUNING from '../../tuning/tuning.json' with { type: 'json' };
import * as C from '../src/config.js';
import { generateWaves, levelAntTypes, Battle } from '../src/sim.js';
import * as M from '../src/meta.js';
import { lintLevels, MAX_ANT_TYPES } from '../tools/lint-levels.mjs';
const src = (f) => readFileSync(new URL('../src/' + f, import.meta.url), 'utf8');
const rd = (f) => readFileSync(new URL('../' + f, import.meta.url), 'utf8');
const real = () => ({ LEVELS: C.LEVELS, ANTS: C.ANTS, WORLDS: C.WORLDS, TUNING, wavesOf: generateWaves });

test('QA6: the shipped level data passes the lint (all LEVELS)', () => {
  const v = lintLevels(real()); assert.deepEqual(v, [], v.join('\n'));
  assert.equal(MAX_ANT_TYPES, 5);
});
test('QA6: a deliberately bad fixture for each rule fails with the rule number in the message', () => {
  const base = () => ({ LEVELS: [{ world: 1, hpMul: 1, waveCount: 1, waves: [[{ type: 'worker', count: 1 }]] }], ANTS: { worker: { armor: 0 }, fly: { armor: 0, flying: true }, bigfly: { armor: 3, flying: true }, a: {}, b: {}, c: {}, d: {}, e: {}, f: {} }, WORLDS: [{ id: 1 }, { id: 2, unlock: { allLevelsWonInWorld: 1, minStarsInWorld: 14 } }], TUNING: {} });
  assert.deepEqual(lintLevels(base()), []);
  const cases = [
    [1, (x) => { x.LEVELS[0].waves = [['a', 'b', 'c', 'd', 'e', 'f'].map((t) => ({ type: t, count: 1 }))]; }],
    [2, (x) => { x.LEVELS[0].waves = [[{ type: 'nope', count: 1 }]]; }],
    [3, (x) => { x.LEVELS[0].waves = [[{ type: 'bigfly', count: 1 }]]; }],
    [4, (x) => { x.LEVELS[0].world = 6; x.TUNING = { specials: false }; }],
    [5, (x) => { x.LEVELS[0].hpMul = 0; }],
    [5, (x) => { x.LEVELS[0].waveCount = 3; }],
    [6, (x) => { x.WORLDS[1].unlock.allLevelsWonInWorld = 9; }],
    [6, (x) => { x.WORLDS[1].unlock.minStarsInWorld = 31; }],
  ];
  for (const [rule, mut] of cases) { const x = base(); mut(x); const v = lintLevels(x); assert.ok(v.some((m) => m.startsWith(`QA6 rule ${rule}:`)), `rule ${rule}: ${v.join('|')}`); }
});
test('R4: HINT_OK is data in config.js and game.js passes lossRun to lossHint', () => {
  assert.deepEqual(C.HINT_OK.healer, [35, 39, 49, 59]); assert.deepEqual(C.HINT_OK.carrier, [40, 50, 59, 60]); assert.deepEqual(C.HINT_OK.drone, [60]);
  assert.match(src('game.js'), /lossRun >= 2 \? lossHint\(b, lossRun\) : null/);
});
test('R6: prep never pre-selects a 0-stock booster and the buy-one text is a neutral hint after a tap', () => {
  const g = src('game.js');
  assert.match(g, /\.filter\(\(b\) => \(S\.save\.bonusStock\[b\] \|\| 0\) > 0\); S\.zeroHint = null/);
  assert.match(g, /S\.zeroHint = \{ bt, until: S\.t \+ 8 \}/); assert.ok(!/ffd9d0/.test(g.slice(g.indexOf('// warnings are word-wrapped'), g.indexOf('// warnings are word-wrapped') + 600)), 'no pink warning fill');
});
test('R5: result sparkles are drawn before the ribbon, outside its text box; the count-up ends at t = 1.0 s', () => {
  const a = src('art.js'); const f = a.slice(a.indexOf('export function drawRewardHeader'), a.indexOf('// v0.8.1 G6: hero ants'));
  assert.ok(f.indexOf('R8.sparkle') < f.indexOf('ribbonSprite(ctx, rp)'), 'sparkles first'); assert.match(f, /\[40, 360\]/);
  assert.match(src('game.js'), /countDone: 1\.0/);
});
test('R12: the deck picker lists owned cards first, locked cards after a "Not yet unlocked" divider', () => {
  const g = src('game.js'); assert.match(g, /ownedIds\.forEach/); assert.match(g, /'Not yet unlocked'/);
});
test('R7: the wood plank seam alpha is 15 % lower (ART81 only)', () => { assert.match(src('art.js'), /C\.ART81 \? 0\.2975 : 0\.35/); assert.match(src('art.js'), /mixHex\(th\.a, th\.b, 0\.3\)/); });

test('R5b: the prize strip is skipped while k <= 0 (no negative-scale flip)', () => { assert.match(src('game.js'), /if \(!\(k > 0\)\) return; \/\/ v0\.8\.2 R5b/); });

// ---- Pass 4: World 6 "Pancake Picnic" (PP1, PP2, PP4, PP6, PP7, PP11, M7g, U11) ----
const W6_HP = [6, 7.2, 9.19, 9.5, 4.84, 9.57, 5.9, 5.29, 4.12, 1.7]; // v0.8.4 F11: mirrored L58/L59
test('PP1: World 6 exists (id 6, pancake, queen6, 10 levels, gate 14 stars in W5 + all won, cap 6, coinMul 2.0)', () => {
  const W = C.WORLDS.find((x) => x.id === 6); assert.ok(W); assert.equal(W.treat, 'pancake'); assert.equal(W.queen, 'queen6'); assert.equal(C.LEVELS.length, 80);
  assert.equal(W.levels, 10); assert.equal(W.cardLevelCap, 6); assert.equal(W.coinMul, 2); assert.deepEqual(W.unlock, { allLevelsWonInWorld: 5, minStarsInWorld: 14 });
  assert.equal(C.LEVELS.filter((L) => L.world === 6).length, 10);
});
test('PP1: the gate is locked at 13 stars and open at 14 stars (every W5 level won)', () => {
  const s = M.newSave(); for (let i = 40; i < 50; i++) { s.levels[i].cleared = true; s.levels[i].stars = 1; }
  s.levels[40].stars = 3; s.levels[41].stars = 3; // 3+3+8*1 = 14
  assert.equal(M.worldStars(s, 5), 14); assert.equal(M.worldUnlocked(s, 6), true);
  s.levels[41].stars = 2; assert.equal(M.worldStars(s, 5), 13); assert.equal(M.worldUnlocked(s, 6), false);
  s.levels[41].stars = 3; s.levels[49].cleared = false; assert.equal(M.worldUnlocked(s, 6), false, 'all W5 levels must be won');
});
test('EX1: the first 3-star record in W6 pays 20F + 20F + 80F once', () => {
  const s = M.newSave(); for (let i = 0; i < 50; i++) { s.levels[i].cleared = true; s.levels[i].stars = 1; }
  const F = M.levelFactor(50); const want = Math.round(20 * F) + Math.round(20 * F) + Math.round(80 * F);
  const r = M.applyBattleResult(s, 50, 'win', 3, { kills: 30, foodLeft: C.BATTLE.foodHP, time: 120 }); assert.equal(r.starCoins, want);
  const r2 = M.applyBattleResult(s, 50, 'win', 3, { kills: 30, foodLeft: C.BATTLE.foodHP, time: 120 }); assert.equal(r2.starCoins, 0, 'paid once');
});
test('PP2/PP4: the Drone and the Syrup Queen data equal the plan table', () => {
  const d = C.ANTS.drone, q = C.ANTS.queen6;
  assert.deepEqual([d.hp, d.speed, d.armor, d.steal, d.weight, d.size, d.crumbs, d.rarity, !!d.flying], [30, 54, 2, 1.1, 1.0, C.ANT_SIZES.regular, 4, 'rare', true]);
  assert.deepEqual([q.hp, q.speed, q.armor, !!q.boss, q.slowResist, q.shield || 0], [3000, 15, 6, true, 0.6, 0]);
  assert.deepEqual(q.spawn, { type: 'drone', every: 12, count: 1 }); assert.deepEqual(q.queenTraits, ['slow']);
  assert.ok(C.ANT_CARD.drone && C.ANT_CARD.queen6 && C.ANTS.drone.name && C.ANTS.queen6.intro);
});
test('PP7: the ten W6 levels carry the plan hp multipliers and 1 s spawn interval', () => {
  const L = C.LEVELS.slice(50, 60); assert.deepEqual(L.map((x) => x.hpMul), W6_HP); assert.ok(L.every((x) => x.interval === 1 || x.interval === undefined || x.interval === 1.0));
  assert.equal(L[4].hpMul, 4.84); assert.equal(L[8].hpMul, 4.12); // L59 is the F11 mirrored value (was 4.05 on the unmirrored grid)
});
test('PP6: ten W6 maps, theme 9, route counts 1,1,1,1,2,1,2,1,2,1, # counts and buildable tiles within the source maps', () => {
  const routes = [1, 1, 1, 1, 2, 1, 2, 1, 2, 1], hash = [31, 45, 27, 47, 22, 26, 29, 40, 27, 28], dots = [85, 71, 88, 69, 93, 90, 87, 76, 88, 87];
  const ids = new Set();
  for (let k = 0; k < 10; k++) {
    const L = C.LEVELS[50 + k]; ids.add(L.map); const m = TUNING.maps[L.map]; assert.equal(m.theme, 9, L.map);
    const g = m.grid.join(''); assert.equal((g.match(/#/g) || []).length, hash[k], 'hash L' + (51 + k)); assert.equal((g.match(/\./g) || []).length, dots[k], 'dots L' + (51 + k));
    const b = new Battle({ levelIndex: 50 + k, deck: [], bonusTypes: [], seed: 1 }); assert.equal(b.routes.length, routes[k], 'routes L' + (51 + k));
  }
  assert.equal(ids.size, 10);
});
test('PP11: W6 ships with specials on (the lint fails if tuning.specials is false), Drone armor <= 2', () => {
  assert.notEqual(TUNING.specials, false); assert.equal(C.TUNING.specials !== false, true);
  const bad = lintLevels({ ...real(), TUNING: { ...TUNING, specials: false } }); assert.ok(bad.some((m) => /QA6 rule 4/.test(m)), bad.join('\n'));
  assert.ok(C.ANTS.drone.armor <= 2);
});
test('R1/R2 note: the only rarity-rule exceptions in W6 are the plan data of L57 and L58', () => {
  const rk = (t) => C.rarityOf(t); const common = (i) => levelAntTypes(i).filter((t) => rk(t) === 'common').length, hi = (i) => levelAntTypes(i).filter((t) => ['rare', 'elite', 'boss'].includes(rk(t))).length;
  assert.ok(common(56) < 2, 'L57: fewer than 2 commons (Crumb data)'); assert.ok(hi(57) >= 3, 'L58: three rare-or-higher types (Crumb data)');
  for (const i of [50, 51, 52, 53, 54, 55, 58, 59]) assert.ok(common(i) >= 2 || i === 59, 'L' + (i + 1) + ' keeps >= 2 commons');
});
test('M7g: the Special row has three states, texts >= 12 px; the ring and the card star are ART81-only and only on active specials', () => {
  const g = src('game.js');
  assert.match(g, /Special unlocks at card level/); assert.match(g, /Awakens in World|awakens in World/); assert.match(g, /function specialState/);
  assert.match(g, /C\.ART81 && S\.battle && S\.battle\.specialsOn && C\.specialActive\(tw, S\.battle\.level\)/); assert.match(g, /spStar:/);
  for (const t of Object.values(C.TOWERS)) if (t.special) { assert.ok(t.special.short && t.special.short.length <= 30, t.special.id); assert.ok(t.special.text.length <= 60); }
  const row = g.slice(g.indexOf('function specialRow'), g.indexOf('function cardInfoPanel')); assert.ok(!/\b(1[01]|[0-9])(\.\d)?, '#/.test(row.replace(/x \+ 6, cy, 5\.5/, '')) , 'no text below 12 px in the Special row');
  assert.match(g, /button\('open' \+ S\.cardsSel, 24, 590, 172, 58/);
});
test('M7g: the ring follows the special and the card level in every world', () => {
  for (let i = 0; i < 80; i++) for (const id of Object.keys(C.TOWERS)) {
    assert.equal(C.specialActive(id, C.LEVELS[i], 4), false);
    assert.equal(C.specialActive(id, C.LEVELS[i], 5), !!C.TOWERS[id].special);
  }
});
test('U11: seenSpecial is an object in every loaded save; the banner needs ART81, specials on, a new tower; no banner on W5', () => {
  const st = (() => { const m = {}; return { getItem: (k) => (k in m ? m[k] : null), setItem: (k, v) => { m[k] = String(v); } }; })();
  const s = M.newSave(); delete s.seenSpecial; M.writeSave(st, s); const l = M.loadSave(st); assert.deepEqual(l.seenSpecial, {});
  const g = src('game.js'); assert.match(g, /S\.battle\.specialsOn && !S\.guide/); assert.match(g, /C\.specialActive\(id, S\.battle\.level/); assert.match(g, /!seen\[id\]/); assert.match(g, /Picnic power!/);
  const b = new Battle({ levelIndex: 49, deck: ['laser'], bonusTypes: [], seed: 1, cardLevels: { laser: 6 } }); assert.equal(b.specialsOn && C.specialActive('laser', b.level, b.cardLevels.laser), true, 'UC1: W5 at CL6 is active');
  const b6 = new Battle({ levelIndex: 50, deck: ['laser'], bonusTypes: [], seed: 1, cardLevels: { laser: 6 } }); assert.equal(b6.specialsOn && C.specialActive('laser', b6.level, b6.cardLevels.laser), true);
});

// ---- Pass 3 (G9, G10, G13, G16, G18) ----
test('v0.8.2 P3: table props per world, lip layer, chunky tray price, squash rules, groove and chevrons are present', async () => {
  const a = src('art.js'), g = src('game.js');
  for (const w of [1, 2, 3, 4, 5, 6]) assert.match(a, new RegExp(`\\b${w}: \\['`)); // TABLE_SETS has all six worlds
  assert.match(a, /export function renderTable/); assert.match(a, /rgba\(70,35,50,0\.18\)/); // contact shadow alpha .18
  assert.match(g, /A\.renderTable\(/); assert.match(g, /drawTableLip\(\);/); assert.match(g, /offX < 24/); // no lip without a 24 px margin
  assert.match(g, /A\.drawChunkyText\(ctx, opt\.cost === 0 \? 'FREE'[^]*?, 16, \{/); // price numeral 16 px
  assert.match(g, /b\.ants\.length <= 25/); assert.match(g, /S\.t - \(a\._sqT \?\? -9\) < 0\.12/); // squash: skip > 25 ants and within 120 ms
  assert.match(a, /rgba\(70,35,50,0\.20\)/); assert.match(a, /every 120 px/); assert.match(a, /d \+= 120/);
  assert.match(a, /rgba\(255,255,255,0\.35\)/); // G10 pad top highlight
  // sims untouched: the Pass 3 art never reads or writes sim state
  const sim = src('sim.js'); assert.doesNotMatch(sim, /renderTable|drawTableProp/);
});

// ---- Pass 5 (J13, J15, J16, J18, J19, U10, U14) ----
test('v0.8.2 P5: pressScale helper (J18)', async () => {
  const { pressScale } = await import('../src/recipes.js');
  assert.equal(pressScale(false, 0, null), 1); assert.ok(Math.abs(pressScale(true, 60, null) - 0.96) < 1e-9); assert.ok(pressScale(true, 30, null) < 1 && pressScale(true, 30, null) > 0.96);
  assert.ok(Math.abs(pressScale(false, 0, 0) - 1.04) < 1e-9); assert.equal(pressScale(false, 0, 110), 1); assert.ok(pressScale(false, 0, 55) > 1 && pressScale(false, 0, 55) < 1.04);
});
test('v0.8.2 P5: U10 returning player skips the guide; U14 best time is stored', () => {
  const s = M.newSave(); assert.equal(M.isReturningPlayer(s), false);
  M.applyBattleResult(s, 0, 'win', 2, { time: 222, kills: 10, foodLeft: 20 }, () => 0); assert.equal(M.isReturningPlayer(s), true); assert.equal(s.levels[0].bestTime, 222);
  M.applyBattleResult(s, 0, 'win', 3, { time: 240, kills: 10, foodLeft: 20 }, () => 0); assert.equal(s.levels[0].bestTime, 222); // slower is not a best
  M.applyBattleResult(s, 0, 'win', 3, { time: 200, kills: 10, foodLeft: 20 }, () => 0); assert.equal(s.levels[0].bestTime, 200);
  assert.match(src('game.js'), /!M\.isReturningPlayer\(S\.save\)/); assert.match(src('game.js'), /Best: \$\{/);
});
test('v0.8.2 P5: chips fire once per wave and never on the final wave; J13 pop and J15 pulse are in', () => {
  const g = src('game.js');
  assert.match(g, /b\.nextWave < b\.totalWaves && b\.ants\.length === 0 && b\.pending\.length === 0 && !chipSt\.waves\[b\.nextWave\]/); assert.match(g, /Food low!/); assert.match(g, /f < 0\.25/); assert.match(g, /Math\.PI \* 2 \* 1\.2/);
  assert.match(g, /sc = k < 0\.6 \? 0\.6 \+ 0\.52/); assert.match(g, /0\.25 \+ 0\.25 \* \(0\.5 \+ 0\.5 \* Math\.sin\(t \* Math\.PI \* 2\)\)/);
});

// ---- Pass 6 (EC5a, EC5b, EC6) ----
const lumOf = (c) => { const f = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; }; const [r, g, b] = [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16)); return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b); };
test('v0.8.2 EC5b: skins are colour-only data, same luminance as the base pad, the sim never reads a skin', async () => {
  const A = await import('../src/art.js');
  assert.equal(C.SKINS.length, 12); assert.equal(C.SKINS.reduce((s, x) => s + x.price, 0), 42000);
  for (const sk of C.SKINS) {
    assert.deepEqual(Object.keys(sk).sort(), ['id', 'name', 'pad', 'price', 'tier', 'tower']); // a power/range/etc. field would fail here
    assert.match(sk.pad, /^#[0-9a-f]{6}$/); assert.equal(sk.price, C.SKIN_TIERS[sk.tier - 1]);
    const r = lumOf(sk.pad) / lumOf(A.TOWER_PAD[sk.tower]); assert.ok(r > 0.97 && r < 1.03, `${sk.id} luminance ratio ${r}`);
  }
  assert.ok(!/skin/i.test(src('sim.js')) && !/skin/i.test(src('bot.js')) && !/skin/i.test(src('recipes.js')));
});
test('v0.8.2 EC5a: the skin purchase flow (no negative balance, no double charge, equip needs ownership)', () => {
  const s = M.newSave(); s.coins = 1600;
  assert.deepEqual(M.buySkin(s, 'laser-2'), { ok: false, reason: 'coins' }); assert.equal(s.coins, 1600);
  const r = M.buySkin(s, 'laser-1'); assert.equal(r.ok, true); assert.equal(s.coins, 100);
  assert.equal(M.buySkin(s, 'laser-1').reason, 'owned'); assert.equal(s.coins, 100);
  assert.equal(M.buySkin(s, 'nope').reason, 'unknown');
  assert.deepEqual(M.skinPads(s), { laser: '#6c9bb4' }); // v0.8.3 F3 palette
  assert.equal(M.equipSkin(s, 'laser', 'laser-3'), false); assert.equal(M.equipSkin(s, 'slingshot', 'laser-1'), false);
  assert.equal(M.equipSkin(s, 'laser', null), true); assert.deepEqual(M.skinPads(s), {}); assert.equal(M.equipSkin(s, 'laser', 'laser-1'), true);
  assert.equal(M.nextSkinPrice(s), 1500); assert.equal(M.skinState(M.newSave()).owned.length, 0);
});
test('EX1: the daily first win pays 60 times 3.2 to the frontier world', () => {
  const t = M.calendarTable(); assert.ok(t.length >= 8); assert.equal(t[0].daily, 60); assert.equal(t[5].daily, Math.round(60 * Math.pow(3.2, 5)));
  const s = M.newSave(); const a = M.applyBattleResult(s, 0, 'win', 1, { time: 100, kills: 10, foodLeft: 20, day: '2026-11-01' }, () => 0); assert.equal(a.dailyBonus, 60);
  const b = M.applyBattleResult(s, 0, 'win', 1, { time: 100, kills: 10, foodLeft: 20, day: '2026-11-01' }, () => 0); assert.equal(b.dailyBonus, undefined);
  const d = M.applyBattleResult(M.newSave(), 0, 'win', 1, { time: 100, kills: 10, foodLeft: 20 }, () => 0); assert.equal(d.dailyBonus, undefined);
});
test('v0.8.2 G19: motes are capped at 12, gated on render cost and reduced motion', () => {
  const g = src('game.js'); assert.match(g, /MOTE_N = 12/); assert.match(g, /reducedMotion\(\) \|\| \(S\.renderMs \|\| 0\) >= 10/); assert.match(g, /S\.renderMs = S\.renderMs \?/);
});
test('v0.8.2 U15: the Ant Book lists met ants only; the Drone appears once L52 is entered', () => {
  const s = M.newSave(); const m0 = M.metAnts(s); assert.ok(m0.has('small')); assert.ok(!m0.has('drone')); assert.ok(!m0.has('queen6'));
  for (let i = 0; i <= 50; i++) s.levels[i].cleared = true; // L51 cleared -> L52 is entered
  const m1 = M.metAnts(s); assert.ok(m1.has('drone')); assert.ok(!m1.has('queen6'));
  assert.ok(M.antLevels('drone').includes(52)); assert.ok(M.antLevels('drone').every((n) => n >= 52));
  assert.match(src('game.js'), /renderAntBook/);
});
test('version 0.8.2 / versionCode 27 (release) - or later', () => {
  const ge = (a, b) => { const x = a.split('.').map(Number), y = b.split('.').map(Number); for (let i = 0; i < 3; i++) if (x[i] !== y[i]) return x[i] > y[i]; return true; };
  assert.ok(ge(C.VERSION, '0.8.2')); assert.ok(+/versionCode (\d+)/.exec(rd('android/app/build.gradle'))[1] >= 27); assert.ok(ge(JSON.parse(rd('package.json')).version, '0.8.2'));
});

// ---- Crumbie's rulings on the release gate: G18 chevron alpha .03 (maps[].art.chev overrides it), L58 plate override, the plate-edge lint ----
test('G18/A1 (superseded by v0.8.3 F7): chevron alpha is a global default with a per-map art.chev override', () => {
  assert.match(src('art.js'), /art\.chev \?\? 0\.\d+/);
});
test('A3r/L58 (superseded by v0.8.3 F10): the waffle-iron plate is explicitly hidden via tuning.json art.plate; the plate-edge lint is part of qa-v082', () => {
  const t = JSON.parse(rd('../tuning/tuning.json')); assert.deepEqual(t.maps.w6_waffle_iron.art, { plate: { hide: true } });
  assert.match(src('art.js'), /po\.scale/); assert.match(readFileSync(new URL('../tools/qa-v082.mjs', import.meta.url), 'utf8'), /plate-edge\.mjs/);
});
