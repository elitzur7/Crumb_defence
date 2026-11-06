// v0.8.4: pace, play-field ants, field/feel passes, World 7. Each section is added with its pass.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as C from '../src/config.js';
import { Battle } from '../src/sim.js';
import { smartBotStep, chooseDeck, unlockedAt } from '../src/bot.js';
import { STEP, SPEEDS, PACE, advanceFrame, newClock } from '../src/loop.js';

const src = (f) => readFileSync(new URL('../src/' + f, import.meta.url), 'utf8');

test('PACE1: PACE is 1.5 and the speed labels stay 1 / 2 / 4', () => {
  assert.equal(PACE, 1.5);
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
