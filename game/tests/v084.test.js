// v0.8.4: pace, play-field ants, field/feel passes, World 7. Each section is added with its pass.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as C from '../src/config.js';
import { Battle } from '../src/sim.js';
import { smartBotStep, chooseDeck, unlockedAt } from '../src/bot.js';
import { STEP, SPEEDS, PACE, advanceFrame, newClock } from '../src/loop.js';
import * as A from '../src/art.js';

const src = (f) => readFileSync(new URL('../src/' + f, import.meta.url), 'utf8');

test('PACE1: PACE is 1.5 and the speed labels stay 1 / 2 / 4', () => {
  assert.equal(PACE, 1.35);
  assert.deepEqual(SPEEDS, [1, 2, 4]);
  assert.equal(STEP, 1 / 60);
  assert.match(src('loop.js'), /clk\.acc \+= dt \* speed \* PACE/);
});

test('PACE1: label-1x wall time is 1/1.5 of sim time (within 5%)', () => {
  const deck = chooseDeck(unlockedAt(0), 0);
  const b = new Battle({ levelIndex: 0, deck, seed: 3, cardLevels: { slingshot: 2, spray: 2, glue: 2, gate: 2, sound: 2 }, bonusTypes: [], bonusStock: {} });
  const clk = newClock();
  let frames = 0;
  while (!b.result && frames < 60 * 400) { advanceFrame(clk, 1 / 60, 1, (dt) => { b.update(dt); smartBotStep(b); return !!b.result; }); frames++; }
  assert.ok(b.result, 'battle finished');
  const wall = frames / 60, ratio = wall / b.time;
  assert.ok(Math.abs(ratio - 1 / PACE) < 0.05, `wall/sim ${ratio.toFixed(3)} want ${ (1 / PACE).toFixed(3) }`);
});

test('PACE1: rescue window is about 3.0 s of wall time at every speed label', () => {
  for (const sp of SPEEDS) {
    const clk = newClock();
    let left = C.BATTLE.rescue.window, frames = 0;
    const rescueScale = sp * PACE;
    while (left > 1e-4 && frames < 20000) {
      advanceFrame(clk, 1 / 60, sp, (dt) => { left -= dt / rescueScale; return left <= 0; });
      frames++;
    }
    const wall = frames / 60;
    assert.ok(Math.abs(wall - 3) < 0.05, `label ${sp}: wall ${wall.toFixed(3)} s`);
  }
  assert.match(src('game.js'), /rescueScale = S\.speed \* PACE/);
  assert.match(src('game.js'), /setAudioSpeed\(S\.screen === 'battle' \? S\.speed : 1\)/);
});

test('PACE1: cookiePause stays 0.5 sim-seconds and toasts stay real-time', () => {
  assert.equal(C.BATTLE.forage.cookiePause, 0.5);
  assert.equal(C.UI.toastTime, 0.9);
  assert.equal(C.UI.menuToastTime, 1.3);
  const b = new Battle({ levelIndex: 0, deck: ['slingshot'], seed: 1, cardLevels: { slingshot: 1 }, bonusTypes: [], bonusStock: {} });
  b.nextWaveAt = 1e9; b.pending = []; b.ants.length = 0;
  const a = b.spawn('worker', Math.max(0, b.path.length - 1));
  let guard = 0;
  while (a.waitT <= 0 && !b.result && guard++ < 120) b.update(1 / 60);
  assert.ok(a.waitT > 0.4 && a.waitT <= 0.5, `waitT ${a.waitT}`);
  const before = a.waitT;
  b.update(0.2);
  assert.ok(Math.abs(before - 0.2 - a.waitT) < 0.02, 'cookie pause ticks in sim seconds');
});

test('QA9: every world has the scaffold pieces, and dropping one W7 tip fails the check', () => {
  const worlds = C.WORLDS;
  function scaffold(tipsByWorld) {
    const bad = [];
    for (const w of worlds) {
      if (!w.name || !w.treat || !w.queen || !w.levels || !(w.coinMul > 0) || !w.cardLevelCap) bad.push('meta ' + w.id);
      if (!A.TREAT_BODIES[w.treat]) bad.push('treat ' + w.id);
      if (!A.TABLE_SETS[w.id]) bad.push('table ' + w.id);
      if (!C.ANTS[w.queen] || !C.ANTS[w.queen].intro) bad.push('queen ' + w.id);
      const levels = C.LEVELS.filter((L) => L.world === w.id);
      if (levels.length !== 10) bad.push('levels ' + w.id);
      if (w.id > 1 && !(w.unlock && w.unlock.allLevelsWonInWorld && w.unlock.minStarsInWorld)) bad.push('unlock ' + w.id);
      const themes = new Set(levels.map((L) => C.MAPS[L.map].theme));
      for (const th of themes) { const t = A.THEMES[th]; if (!t || !t.a || !t.b || !t.trail) bad.push('theme ' + w.id); }
      if (w.id >= 6) {
        const tips = tipsByWorld[w.id] || {};
        levels.forEach((L, k) => { const idx = C.LEVELS.indexOf(L); if (!tips[idx]) bad.push('tip ' + (idx + 1)); else if (C.tipLint(tips[idx])) bad.push('tiplint ' + (idx + 1) + ' ' + C.tipLint(tips[idx])); });
      }
    }
    return bad;
  }
  assert.deepEqual(scaffold({ 6: C.W6_TIPS, 7: C.W7_TIPS, 8: C.W8_TIPS }), []);
  const broken = { ...C.W7_TIPS }; delete broken[60];
  assert.ok(scaffold({ 6: C.W6_TIPS, 7: broken, 8: C.W8_TIPS }).some((x) => x.startsWith('tip ')));
});

test('W7: shield aura, alternating queen, and the calibrated hp table', () => {
  const hp = C.LEVELS.slice(60, 70).map((L) => L.hpMul);
  assert.deepEqual(hp, [6, 7.4, 9.6, 12, 9.4, 9.5, 4.68, 7.05, 3.99, 1.64]);
  assert.equal(C.WORLDS[6].name, 'Jelly Jamboree');
  assert.equal(C.WORLDS[6].coinMul, 2.25);
  assert.equal(C.WORLDS[6].treat, 'tart');
  assert.equal(C.ANTS.shieldbearer.aura.radius, 55);
  assert.equal(C.ANTS.queen7.spawn.alt, 'worker');
  assert.equal(C.ANTS.queen7.spawn.every, 14);
  const b = new Battle({ levelIndex: 60, deck: ['slingshot'], seed: 1, cardLevels: { slingshot: 1 }, bonusTypes: [], bonusStock: {} });
  b.nextWaveAt = 1e9; b.pending = []; b.ants.length = 0;
  const bearer = b.spawn('shieldbearer', 40, 0);
  const pal = b.spawn('worker', 40, 0);
  b.update(1 / 60);
  assert.equal(pal.armor, 1);
  assert.equal(bearer.armor, 3);
  const fly = b.spawn('flyer', 40, 0);
  b.update(1 / 60);
  assert.ok(fly.armor <= 2);
  bearer.dead = true;
  const plain = b.spawn('worker', 200, 0);
  b.update(1 / 60);
  assert.equal(plain.armor, 0);
  const q = b.spawn('queen7', 10, 0);
  q.spawnT = 0.01;
  b.update(0.02);
  const calls = b.events.filter((e) => e.type === 'queenCall').map((e) => e.calls);
  assert.deepEqual(calls, ['worker']);
  q.spawnT = 0.01;
  b.update(0.02);
  assert.equal(b.events.filter((e) => e.type === 'queenCall').at(-1).calls, 'drone');
});

test('M7h-fix: a hit event carries armor fields and Static emits its own event', () => {
  const b = new Battle({ levelIndex: 51, deck: ['zapper', 'slingshot'], seed: 1, cardLevels: { zapper: 5, slingshot: 5 }, bonusTypes: [], bonusStock: {} });
  b.nextWaveAt = 1e9; b.pending = []; b.ants.length = 0;
  const a = b.spawn('armored', 80, 0);
  const before = a.armor;
  b.damage(a, 4, { src: { type: 'slingshot' } });
  const clang = b.events.find((e) => e.type === 'clang');
  assert.ok(clang && clang.armor === before && clang.armorBlocked > 0);
  const tw = b.addTower('zapper', 2, 2);
  tw.cardLevel = 5; tw.cd = 0;
  let best = 0, bestD = 1e9;
  for (let d = 0; d < b.path.length; d += 4) { const p = b.path.at(d); const q = Math.hypot(p.x - tw.x, p.y - tw.y); if (q < bestD) { bestD = q; best = d; } }
  b.ants.length = 0;
  for (let k = 0; k < 4; k++) b.spawn('drone', Math.min(b.path.length - 1, best + k * 10), 0);
  b.events.length = 0;
  b.update(1 / 60);
  assert.ok(b.events.some((e) => e.type === 'special' && e.sp === 'static'), JSON.stringify(b.events.filter((e) => e.type === 'special' || e.type === 'zap').slice(0, 6)));
});

test('ANT1/ANT2: play ants scale by 0.62 with the soft recipe; book art stays outlined', () => {
  assert.equal(A.PLAY_ANT_SCALE, 0.72);
  assert.match(src('art.js'), /if \(opt\.play\) ctx\.scale\(PLAY_ANT_SCALE, PLAY_ANT_SCALE\)/);
  assert.match(src('art.js'), /if \(_play\) \{ playSegment/);
  assert.match(src('art.js'), /ctx\.lineWidth = quiet \? 1\.35 : 2\.35/);
  assert.match(src('game.js'), /pxRatio, mood, \{ play: true/);
  assert.equal(C.ANT_SIZES.regular, 1);
  assert.equal(C.ANTS.worker.size, 1);
});

test('PACE1: advanceFrame at 1x/2x/4x matches a pure Battle.update loop (sample levels)', () => {
  const run = (lv, seed, throughFrame, sp) => {
    const deck = chooseDeck(unlockedAt(lv), lv);
    const cardLevels = {}; for (const id of deck) cardLevels[id] = lv >= 30 ? 4 : 2;
    const b = new Battle({ levelIndex: lv, deck, seed, cardLevels, bonusTypes: [], bonusStock: {} });
    if (!throughFrame) { let g = 0; while (!b.result && g++ < 60 * 800) { b.update(1 / 60); smartBotStep(b); } }
    else { const clk = newClock(); let g = 0; while (!b.result && g++ < 60 * 800) advanceFrame(clk, 1 / 60, sp, (dt) => { b.update(dt); smartBotStep(b); return !!b.result; }); }
    return `${b.result}|${b.foodStored.toFixed(4)}|${b.stats.kills}|${b.time.toFixed(3)}`;
  };
  for (const lv of [9, 24, 37]) for (const seed of [1, 2]) {
    const pure = run(lv, seed, false, 1);
    assert.equal(run(lv, seed, true, 1), pure, `L${lv + 1} seed ${seed} 1x`);
    assert.equal(run(lv, seed, true, 4), pure, `L${lv + 1} seed ${seed} 4x`);
  }
});
