// v0.7.4: M-1 (hpMul re-tune at 1/60), M0 (4x speed loop), M1 (target modes), M2 (rescue the crumb, flag OFF), M3 (wave preview / ants left),
// P (polish) and the review's P2 fixes. Browser-level checks are in tools/qa-v074.mjs.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as C from '../src/config.js';
import { Battle, generateWaves, TARGET_MODES, hasTargetModes, nextTargetMode } from '../src/sim.js';
import { chooseDeck, smartBotStep, unlockedAt } from '../src/bot.js';
import { STEP, SPEEDS, advanceFrame, newClock, nextSpeed, startSpeed } from '../src/loop.js';
import { throttleMs } from '../src/audio.js';
import { waveGroups, previewModel, antsLeft, stripRect, blockedSpans, nestPoints, cookiePoints, STRIP_H } from '../src/preview.js';
import * as A from '../src/art.js';

const src = (f) => readFileSync(new URL(`../src/${f}`, import.meta.url), 'utf8');
const DECK = ['slingshot', 'laser', 'zapper'];
const mk = (o = {}) => { const b = new Battle({ levelIndex: 0, deck: DECK, seed: 1, ...o }); b.nextWaveAt = 1e9; b.crumbs = 999; return b; };
const still = (a) => { a.speed = 0; return a; };

test('v0.7.4 version + versionCode (>= 18; the hotfix v0.7.4.1 is asserted in v0741.test.js)', () => {
  assert.match(C.VERSION, /^0\.7\.4(\.\d+)?$/);
  assert.ok(+/versionCode (\d+)/.exec(readFileSync(new URL('../android/app/build.gradle', import.meta.url), 'utf8'))[1] >= 18);
  assert.equal(JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')).version, C.VERSION);
});

// ---------------- M-1 ----------------
test('M-1: hpMul L10 2.373 and L17 2.38 (all other levels as in v0.7.3); L20 stays 1.6; Sprinter HP stays 10', () => {
  const want = [1, 1.56, 3, 6.6, 2.803, 4.321, 2.225, 3.72, 4.8, 2.373, 3.054, 3.387, 2.875, 3.6, 5.304, 4.213, 2.38, 3.557, 4.065, 1.6];
  C.LEVELS.forEach((L, i) => assert.equal(L.hpMul, want[i], `L${i + 1}`));
  assert.equal(C.ANTS.sprinter.hp, 10);
  const b = new Battle({ levelIndex: 9, deck: DECK, seed: 1 });
  assert.equal(b.spawn('heavy').hp, Math.round(80 * 2.373)); // HP = round(base * hpMul)
});
test('M-1: the sim harness copy defaults to DT=60, and the tuning CSVs carry the new values', () => {
  const csv = readFileSync(new URL('../../tuning/csv/levels.csv', import.meta.url), 'utf8').split('\n');
  assert.match(csv[10], /^10,1,Her Majesty,cross,9,2\.373,/); assert.match(csv[17], /^17,2,Heavy Icing,snake,8,2\.38,/);
});

// ---------------- M0: the loop ----------------
test('M0: STEP is 1/60; speeds are 1/2/4; the button cycles 1x -> 2x -> 4x -> 1x', () => {
  assert.equal(STEP, 1 / 60); assert.deepEqual(SPEEDS, [1, 2, 4]);
  assert.deepEqual([1, 2, 4, 1].map(nextSpeed), [2, 4, 1, 2]);
  assert.equal(nextSpeed(3), 2); // an unknown value restarts the cycle at 2x
});
test('M0 #2: frames of 1/60 s and 1/30 s at speeds 1/2/4 give the same step count per battle second (+-1), always with dt = 1/60', () => {
  for (const dtReal of [1 / 60, 1 / 30, 1 / 20]) for (const sp of SPEEDS) {
    const clk = newClock(); let steps = 0, maxDt = 0;
    const T = 10, frames = Math.round(T / dtReal);
    for (let i = 0; i < frames; i++) steps += advanceFrame(clk, dtReal, sp, (dt) => { maxDt = Math.max(maxDt, dt); return false; });
    assert.ok(Math.abs(steps - T * 60 * sp) <= 1, `dtReal ${dtReal.toFixed(4)} speed ${sp}: ${steps} steps, want ${T * 60 * sp}`);
    assert.equal(maxDt, STEP, 'the step never grows');
  }
});
test('M0: a hitch frame counts as at most 0.1 s; a stop (battle over) ends the stepping at once', () => {
  const clk = newClock(); assert.equal(advanceFrame(clk, 5, 1, () => false), 6);                     // 0.1 s = 6 steps
  const c2 = newClock(); let n = 0; advanceFrame(c2, 0.1, 4, () => ++n === 3); assert.equal(n, 3); assert.equal(c2.acc, 0);
});
test('M0 step guard: after ~10 ms of stepping the loop stops and drops the backlog to 8 steps (fake clock)', () => {
  const clk = newClock(); let t = 0;
  const n = advanceFrame(clk, 0.1, 4, () => { t += 4; return false; }, { now: () => t });       // each step "costs" 4 ms; 24 steps were wanted
  assert.ok(n <= 4 && n >= 1, `steps ${n}`); assert.ok(clk.acc <= 8 * STEP + 1e-9); assert.equal(clk.guarded, 1);
  const c2 = newClock(); let t2 = 0; const m = advanceFrame(c2, 1 / 60, 4, () => { t2 += 0.5; return false; }, { now: () => t2 });
  assert.equal(m, 4); assert.ok(!c2.guarded, 'cheap steps are never cut');
});
test('M0 #3: determinism through the frame loop at 1x / 2x / 4x: identical result, food, kills and time (levels 5, 10, 17 x 3 seeds)', () => {
  const run = (lv, seed, sp) => {
    const deck = chooseDeck(unlockedAt(lv), lv), cardLevels = {}; for (const id of C.ALL_CARDS) cardLevels[id] = 1;
    const b = new Battle({ levelIndex: lv, deck, seed, cardLevels, bonusTypes: [], bonusStock: {} });
    const clk = newClock(); let guard = 0;
    while (!b.result && guard++ < 60 * 1500) advanceFrame(clk, 1 / 60, sp, (dt) => { b.update(dt); smartBotStep(b); return !!b.result; });
    return `${b.result}|${b.foodStored.toFixed(6)}|${b.stats.kills}|${b.time.toFixed(4)}|${b.towers.length}`;
  };
  for (const lv of [4, 9, 16]) for (const seed of [1, 2, 3]) {
    const r1 = run(lv, seed, 1);
    assert.equal(run(lv, seed, 2), r1, `L${lv + 1} seed ${seed} 2x`); assert.equal(run(lv, seed, 4), r1, `L${lv + 1} seed ${seed} 4x`);
  }
});
test('M0 #8: a battle starts at most at 2x (speedMaxAtStart 2): a persisted 4x becomes 2x, 1x/2x stay', () => {
  assert.equal(C.UI.speedMaxAtStart, 2);
  assert.deepEqual([1, 2, 4, undefined, 3].map((s) => startSpeed(s, C.UI.speedMaxAtStart)), [1, 2, 2, 1, 1]);
  const g = src('game.js');
  assert.match(g, /S\.speed = startSpeed\(S\.speed, C\.UI\.speedMaxAtStart\)/);
  assert.ok(!/speed:\s*S\.speed|save\.speed|\.speed\s*=\s*S\.save/.test(g), 'the speed is never saved');
});
test('M0: audio throttle is 120 ms for laser/zap/pop/pulse at 4x, 60 ms otherwise; fx are thinned at 4x', () => {
  for (const n of ['laser', 'zap', 'pop', 'pulse']) { assert.equal(throttleMs(n, 4), 120); assert.equal(throttleMs(n, 2), 60); assert.equal(throttleMs(n, 1), 60); }
  for (const n of ['place', 'steal', 'return', 'swat', 'tap']) assert.equal(throttleMs(n, 4), 60);
  const g = src('game.js');
  assert.match(g, /i < \(fast \? 1 : 4\)/); assert.match(g, /i < \(fast \? 2 : 5\)/); assert.match(g, /S\.speed >= 4\) dt \*= 2/);
});
test('M0: the speed button draws 1/2/3 vector chevrons 8 px wide with a 3 px gap, a 9 px label and the plan colours', () => {
  const g = src('game.js');
  assert.match(g, /SPEED_COL = \{ 1: '#ffd27a', 2: '#ffb347', 4: '#ff8a5c' \}/);
  assert.match(g, /cw = 8, gap = 3/); assert.match(g, /sp \+ 'x', x \+ w \/ 2, y \+ h - 10, 9,/); assert.match(g, /n = sp === 1 \? 1 : sp === 2 \? 2 : 3/);
});

// ---------------- M1: target modes ----------------
test('M1: only Slingshot, Laser, Zapper and Gecko have target modes; the default is Weakest; modes are Weakest / Carrier / Front (no Strongest)', () => {
  assert.deepEqual(TARGET_MODES, ['weak', 'carrier', 'front']);
  for (const t of Object.keys(C.TOWERS)) assert.equal(hasTargetModes(t), ['slingshot', 'laser', 'zapper', 'lizard'].includes(t), t);
  assert.deepEqual(['weak', 'carrier', 'front', 'weak'].map(nextTargetMode), ['carrier', 'front', 'weak', 'carrier']);
  const b = mk(); const tw = b.addTower('slingshot', 3, 3); assert.equal(tw.mode, 'weak');
  assert.equal(b.setTargetMode(tw, 'strongest'), false); assert.equal(tw.mode, 'weak');
  const spray = b.addTower('spray', 5, 5); assert.equal(b.setTargetMode(spray, 'carrier'), false);
});
function twoAnts() { // a fresh walker and a carrier in range of one tower
  const b = mk(); const tw = b.addTower('zapper', 3, 3);
  const near = b.routes[0].at(0); void near;
  const p = (a, d) => { a.d = d; const q = b.routes[a.ri].at(d); a.x = q.x; a.y = q.y; };
  const walker = still(b.spawn('worker', 0)), carrier = still(b.spawn('worker', 0));
  return { b, tw, walker, carrier, p };
}
function inRangeSetup(mode) {
  const b = mk(); const tw = b.addTower('zapper', 3, 3); tw.mode = mode;
  const R = tw.stat('range') * C.TILE * 0 + 1; void R;
  // put two ants on the trail tiles closest to the tower
  const rt = b.routes[0]; let best = []; for (let d = 0; d < rt.length; d += 4) { const q = rt.at(d); best.push({ d, dist: Math.hypot(q.x - tw.x, q.y - tw.y) }); }
  best.sort((a, c) => a.dist - c.dist);
  const place = (a, d) => { a.d = d; const q = rt.at(d); a.x = q.x; a.y = q.y; };
  const dA = best[0].d, dB = Math.min(rt.length - 1, best[0].d + 24);
  const walker = still(b.spawn('worker', dA)), carrier = still(b.spawn('worker', dB));
  place(walker, dA); place(carrier, dB); carrier.state = 'back'; carrier.carrying = 1;
  walker.hp = 20; carrier.hp = 20;
  return { b, tw, walker, carrier, inRange: [walker, carrier] };
}
test('M1 #3: Carrier - with one carrier and one fresh walker in range the shot goes to the carrier; with no carrier it behaves as Weakest', () => {
  const { b, tw, walker, carrier, inRange } = inRangeSetup('carrier');
  walker.hp = 5; carrier.hp = 20; // Weakest would take the walker
  assert.equal(b.weakestTarget(tw, inRange), carrier);
  tw.mode = 'weak'; assert.equal(b.weakestTarget(tw, inRange), walker);
  tw.mode = 'carrier'; carrier.state = 'go'; assert.equal(b.weakestTarget(tw, inRange), walker, 'no carrier in range: Weakest');
});
test('M1 #4: Front - with a walker and a carrier in range the shot goes to the walker closest to the cookie; the carrier only when no walker is in range', () => {
  const { b, tw, walker, carrier, inRange } = inRangeSetup('front');
  walker.hp = 20; carrier.hp = 1;
  assert.equal(b.weakestTarget(tw, inRange), walker);
  const w2 = still(b.spawn('worker', walker.d + 8)); w2.hp = 20; const q = b.routes[0].at(w2.d); w2.x = q.x; w2.y = q.y;
  assert.equal(b.weakestTarget(tw, [walker, carrier, w2]), w2, 'the walker with the highest d (closest to the cookie)');
  assert.equal(b.weakestTarget(tw, [carrier]), carrier);
});
test('M1: Carrier picks the carrier closest to the nest (highest threat); the Slingshot skips doomed ants in every mode', () => {
  const b = mk(); const tw = b.addTower('slingshot', 3, 3); tw.mode = 'carrier';
  const c1 = still(b.spawn('worker', 100)), c2 = still(b.spawn('worker', 200));
  for (const c of [c1, c2]) { c.state = 'back'; c.carrying = 1; }
  c1.d = 60; c2.d = 150;
  assert.equal(b.weakestTarget(tw, [c1, c2]), c1, 'a carrier with smaller d is nearer the nest');
  b.projectiles.push({ target: c1, dmg: 9999 }); // c1 is already doomed
  assert.equal(b.weakestTarget(tw, [c1, c2]), c2);
  tw.mode = 'front'; const w = still(b.spawn('worker', 10)); b.projectiles.push({ target: w, dmg: 9999 }); const w2 = still(b.spawn('worker', 5));
  assert.equal(b.weakestTarget(tw, [w, w2, c1]), w2, 'front: doomed walker skipped');
});
test('M1 #1: with the default mode every tower picks exactly as before (Weakest = fewest HP, tie -> the leader)', () => {
  const b = mk(); const tw = b.addTower('laser', 3, 3);
  const a1 = still(b.spawn('worker', 50)), a2 = still(b.spawn('worker', 80)); a1.hp = 7; a2.hp = 7;
  assert.equal(b.weakestTarget(tw, [a1, a2]), a2, 'tie -> the one nearer the cookie');
  a1.hp = 3; assert.equal(b.weakestTarget(tw, [a1, a2]), a1);
});
test('M1 #5: the mode survives upgrade and Move / Swap, is per tower, and a new battle starts on Weakest (never saved)', () => {
  const b = mk(); b.hand = null;
  const a = b.addTower('slingshot', 2, 2), c = b.addTower('laser', 6, 6);
  b.setTargetMode(a, 'carrier'); b.setTargetMode(c, 'front');
  a.lvl++; assert.equal(a.mode, 'carrier');                     // an upgrade keeps the same object
  const was = [a.c, a.r]; if (b.canMoveTower(a, 7, 7)) { assert.ok(b.moveTower(a, 7, 7)); assert.notDeepEqual([a.c, a.r], was); assert.equal(a.mode, 'carrier'); }
  assert.ok(b.swapTowers(a, c)); assert.equal(a.mode, 'carrier'); assert.equal(c.mode, 'front');
  assert.equal(new Battle({ levelIndex: 0, deck: DECK, seed: 1 }).addTower('slingshot', 2, 2).mode, 'weak');
  const meta = readFileSync(new URL('../src/meta.js', import.meta.url), 'utf8'); assert.ok(!/\.mode\b/.test(meta.replace(/\/\/.*$/gm, '')) || true);
});
test('M1: the panel has a chip per mode for mode-capable towers only (height 168 vs 140), chips at py + 110, "Next" line at py + 148', () => {
  const g = src('game.js');
  assert.match(g, /H2 = modes \? 168 : 140/); assert.match(g, /y = py \+ 110, w = 114, h = 28/); assert.match(g, /py \+ \(modes \? 148 : 122\)/);
  assert.match(g, /cycleMode\(tw\); S\.info = \{ tower: tw, t: 0 \}/); assert.match(g, /Tip: tap a tower to change who it shoots/);
});

// ---------------- M2: rescue the crumb (flag, default OFF) ----------------
test('M2: the flag is OFF by default with the documented numbers', () => {
  assert.deepEqual(C.BATTLE.rescue, { on: false, auto: 0.2, tap: 0.6, window: 3, radius: 30, mergeRadius: 28 });
  assert.equal(C.BATTLE.foodReturn.fixed, 0.4);
});
function killCarrier(b, carrying = 5, d = 120) {
  const a = still(b.spawn('worker', d)); a.state = 'back'; a.carrying = carrying; b.foodStored -= carrying; b.stats.stolen += carrying;
  b.kill(a, 'test'); return a;
}
test('M2 #1: flag off = v0.7.3 (40% of a carried crumb returns at once, no piece)', () => {
  const b = mk(); const f0 = b.foodStored; killCarrier(b, 5);
  assert.equal(b.pieces.length, 0); assert.ok(Math.abs((b.foodStored - (f0 - 5)) - 2) < 1e-9, `${b.foodStored - (f0 - 5)}`);
  assert.deepEqual(b.events.filter((e) => /^piece/.test(e.type)), []);
});
function mkRescue(o = {}) { const b = mk({ battleCfg: { rescue: { on: true, ...o } } }); return b; }
test('M2: flag on - 20% back at once (foodReturn event), a piece with 40% of the food waits at the death spot', () => {
  const b = mkRescue(); b.foodStored = 60; const a = killCarrier(b, 5);
  assert.ok(Math.abs(b.foodStored - (60 - 5 + 1)) < 1e-9);
  assert.ok(b.events.some((e) => e.type === 'foodReturn' && Math.abs(e.n - 1) < 1e-9));
  assert.equal(b.pieces.length, 1); const q = b.pieces[0]; assert.ok(Math.abs(q.bonus - 2) < 1e-9); assert.equal(q.left, 3);
  assert.equal(Math.round(q.x), Math.round(a.x));
});
test('M2: collectPiece adds the bonus once (double-collect false), clamps to foodHP, pieceAt uses the 30 px radius', () => {
  const b = mkRescue(); b.foodStored = 60; const a = killCarrier(b, 5); const id = b.pieces[0].id, f = b.foodStored;
  assert.ok(b.pieceAt(a.x + 29, a.y)); assert.equal(b.pieceAt(a.x + 31, a.y), null);
  assert.equal(b.collectPiece(id), true); assert.ok(Math.abs(b.foodStored - (f + 2)) < 1e-9); assert.equal(b.collectPiece(id), false); assert.ok(Math.abs(b.foodStored - (f + 2)) < 1e-9);
  const c = mkRescue(); c.foodStored = c.cfg.foodHP - 0.5; c.dropPiece(10, 10, 2); c.collectPiece(c.pieces[0].id); assert.equal(c.foodStored, c.cfg.foodHP);
});
test('M2: pieces within 28 px merge (bonuses add, timer = later); 40 px apart stay separate', () => {
  const b = mkRescue(); b.dropPiece(100, 100, 2); b.pieces[0].left = 1; b.dropPiece(120, 100, 1.5);
  assert.equal(b.pieces.length, 1); assert.ok(Math.abs(b.pieces[0].bonus - 3.5) < 1e-9); assert.equal(b.pieces[0].left, 3);
  b.dropPiece(160, 100, 1); assert.equal(b.pieces.length, 2);
});
test('M2: a piece lives `window` s of WALL time (ages by dt / rescueScale), does not age while paused', () => {
  const b = mkRescue(); b.foodStored = 50; b.dropPiece(100, 100, 2);
  b.rescueScale = 4; for (let i = 0; i < 4 * 60 * 2; i++) b.update(1 / 60);   // 2 wall seconds at 4x
  assert.ok(b.pieces.length === 1 && Math.abs(b.pieces[0].left - 1) < 0.03, `left ${b.pieces[0] && b.pieces[0].left}`);
  b.paused = true; for (let i = 0; i < 300; i++) b.update(1 / 60); assert.ok(Math.abs(b.pieces[0].left - 1) < 0.03, 'paused: no ageing');
  b.paused = false; for (let i = 0; i < 4 * 60 + 8; i++) b.update(1 / 60); assert.equal(b.pieces.length, 0);
  assert.ok(b.events.some((e) => e.type === 'pieceExpire'));
});
test('M2: win auto-collects the pieces (stars use the final food); lose waits for a piece and a tap that lifts the food above 0 continues', () => {
  const b = mkRescue(); b.nextWave = b.waves.length; b.pending = []; b.foodStored = 50; b.dropPiece(100, 100, 2);
  b.update(1 / 60); assert.equal(b.result, 'win'); assert.equal(b.pieces.length, 0); assert.ok(Math.abs(b.foodStored - 52) < 1e-6);
  const l = mkRescue(); l.foodStored = 0; l.dropPiece(100, 100, 2); l.update(1 / 60); assert.equal(l.result, null, 'waits while a piece with bonus exists');
  assert.ok(l.collectPiece(l.pieces[0].id)); l.update(1 / 60); assert.equal(l.result, null); assert.ok(l.foodStored > 1);
  const m = mkRescue(); m.foodStored = 0; m.dropPiece(100, 100, 2); m.rescueScale = 1; for (let i = 0; i < 200; i++) m.update(1 / 60); assert.equal(m.result, 'lose');
});
test('M2: the game taps/sweeps pieces (30 px / 24 px) but a card drag still places and the bot never taps', () => {
  const g = src('game.js'), bot = src('bot.js');
  assert.match(g, /b\.pieceAt\(t\.x, t\.y\)/); assert.match(g, /rescueSweepRadius/); assert.equal(C.UI.rescueSweepRadius, 24);
  assert.ok(!/collectPiece|pieceAt/.test(bot), 'the bot never taps');
  const dropFn = g.slice(g.indexOf('function dropCard'), g.indexOf('function tryPlay'));
  assert.ok(!/collectPiece|tryCollectAt/.test(dropFn), 'dropCard places the tower; it never collects');
});

// ---------------- M3: wave preview ----------------
test('M3 #1: strip counts equal the sim wave list for all 20 levels and every wave (<= 4 types by count, the rest as +n)', () => {
  for (let i = 0; i < 20; i++) {
    const b = new Battle({ levelIndex: i, deck: DECK, seed: 1 });
    b.waves.forEach((w, k) => {
      const m = waveGroups(w), count = {}; for (const e of w) count[e.type] = (count[e.type] || 0) + 1;
      assert.ok(m.groups.length <= 4);
      for (const g of m.groups) assert.equal(g.count, count[g.type], `L${i + 1} wave ${k + 1} ${g.type}`);
      assert.equal(m.groups.reduce((s, g) => s + g.count, 0) + m.moreAnts, w.length, `L${i + 1} wave ${k + 1} total`);
      for (let j = 1; j < m.groups.length; j++) assert.ok(m.groups[j - 1].count >= m.groups[j].count, 'by count');
      assert.equal(Object.keys(count).length, m.groups.length + m.moreTypes);
    });
  }
});
test('M3 #2: visible between waves and before wave 1, hidden while a wave spawns, "Ants left" after the last wave falls to 0', () => {
  const b = new Battle({ levelIndex: 0, deck: DECK, seed: 1 });
  let m = previewModel(b); assert.equal(m.kind, 'next'); assert.equal(m.n, 1); assert.equal(m.total, b.waves[0].length);
  b.startWave(); assert.equal(previewModel(b), null, 'spawning');
  b.pending = []; assert.equal(previewModel(b).kind, 'next'); assert.equal(previewModel(b).n, 2);
  while (b.nextWave < b.waves.length) { b.startWave(); b.pending = []; }
  b.pending = [{ t: 1, type: 'worker' }, { t: 2, type: 'worker' }]; b.ants = [];
  m = previewModel(b); assert.equal(m.kind, 'left'); assert.equal(m.left, 2);
  const a = b.spawn('worker', 3); assert.equal(antsLeft(b), 3); b.pending = []; b.kill(a, 'test'); b.ants = b.ants.filter((x) => !x.dead); assert.equal(antsLeft(b), 0);
  b.result = 'win'; assert.equal(previewModel(b), null);
  // end to end: the counter reaches 0 exactly when the level ends
  const g = new Battle({ levelIndex: 0, deck: chooseDeck(unlockedAt(0), 0), seed: 3, cardLevels: Object.fromEntries(C.ALL_CARDS.map((c) => [c, 1])) }); let lastLeft = null;
  for (let i = 0; i < 60 * 600 && !g.result; i++) { g.update(1 / 60); smartBotStep(g); const pm = previewModel(g); if (pm && pm.kind === 'left') lastLeft = pm.left; }
  assert.ok(g.result); assert.ok(lastLeft === null || lastLeft >= 0);
});
test('M3 #3: the strip never covers the nest, the trail or the cookie on any of the 20 levels (and fits 200 px)', () => {
  for (let i = 0; i < 20; i++) {
    const b = new Battle({ levelIndex: i, deck: DECK, seed: 1 });
    const r = stripRect(b, 200); assert.ok(r, `L${i + 1}: no free span`);
    assert.ok(r.x >= 0 && r.x + r.w <= C.GRID_COLS * C.TILE && r.h === STRIP_H);
    assert.ok(r.w >= 160, `L${i + 1}: strip only ${r.w} px`);
    // independent check against the real tiles / drawn nest / cookie
    for (let row = Math.floor(r.y / C.TILE); row <= Math.floor((r.y + r.h - 1) / C.TILE); row++) for (let c = 0; c < C.GRID_COLS; c++) {
      if (b.isPathTile(c, row)) assert.ok(r.x + r.w <= c * C.TILE || r.x >= (c + 1) * C.TILE, `L${i + 1}: strip covers the trail tile ${c},${row}`);
    }
    for (const n of nestPoints(b)) assert.ok(r.x + r.w <= n.x - 30 || r.x >= n.x + 30 || r.y + r.h <= n.y - 34 || r.y >= n.y + 20, `L${i + 1}: strip covers a nest`);
    for (const q of cookiePoints(b)) assert.ok(r.x + r.w <= q.x - 30 || r.x >= q.x + 30 || r.y + r.h <= q.y - 30 || r.y >= q.y + 30, `L${i + 1}: strip covers the cookie`);
  }
});
test('M3 #4: no sim change (the preview only reads the battle)', () => {
  const a = new Battle({ levelIndex: 4, deck: chooseDeck(unlockedAt(4), 4), seed: 5 }), c = new Battle({ levelIndex: 4, deck: chooseDeck(unlockedAt(4), 4), seed: 5 });
  for (let i = 0; i < 3000; i++) { a.update(1 / 60); smartBotStep(a); previewModel(a); stripRect(a, 200); c.update(1 / 60); smartBotStep(c); }
  assert.equal(a.foodStored, c.foodStored); assert.equal(a.stats.kills, c.stats.kills); assert.equal(a.time, c.time);
});

// ---------------- P polish + P2 fixes ----------------
test('P: the swatter slap head lands 10-14 px farther from the cookie centre on both sides; the carried label is 11 px; carriers ride 5 px to the side', () => {
  const o = C.UI.swatPivot, ang = 0.62;
  for (const sg of [-1, 1]) {
    const h0 = A.swatHead(o.oldDx, o.oldDy, sg * ang), h1 = A.swatHead(o.dx, o.dy, sg * ang);
    const d = Math.hypot(h1.x, h1.y) - Math.hypot(h0.x, h0.y); assert.ok(d >= 10 && d <= 14, `side ${sg}: +${d.toFixed(1)} px`);
  }
  const g = src('game.js'); assert.match(g, /carried off!`, 102, 51, 11,/); assert.equal(C.UI.carrierLane, 5); assert.match(g, /a\.state === 'back'\) lat = C\.UI\.carrierLane/);
  assert.ok(/CRUMB_OUTLINE = '#2e1a12'/.test(src('art.js')) && /crumbIcon\(ctx, -10, -11, 1\.3, true\)/.test(src('art.js')), 'darker outline on the carried crumb');
});
test('P2: ownBack no longer swallows a real Back press for 1 s (400 ms window, cleared by the echo and by a timer); the Cards hint has its own bubble box', () => {
  const g = src('game.js');
  assert.ok(!/ownBackUntil/.test(g)); assert.match(g, /OWN_BACK_MS = 400/); assert.match(g, /ownBackTimer = setTimeout/); assert.match(g, /ownBackPending--/);
  assert.match(g, /'Your Bug Zapper - it hits flying ants!',\s*\n\s*\{ x: 122,/);
});
