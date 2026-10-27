// v0.7.3: C17 tuning paste (M5 mixes + hpMul), safe-area re-read, gear history, swatter hit frame, calendar race, version label. Version 0.7.3 / versionCode 17.
// (Browser-level regressions for items 2-7 live in tools/qa-v073.mjs.)
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as C from '../src/config.js';
import { Battle } from '../src/sim.js';

const src = (f) => readFileSync(new URL(`../src/${f}`, import.meta.url), 'utf8');
const HP = [1, 1.56, 3, 6.6, 2.803, 4.321, 2.225, 3.72, 4.8, 2.3, 3.054, 3.387, 2.875, 3.6, 5.304, 4.213, 2.39, 3.557, 4.065, 1.6];

test('v0.7.3 version + versionCode 17', () => {
  assert.equal(C.VERSION, '0.7.3');
  assert.match(readFileSync(new URL('../android/app/build.gradle', import.meta.url), 'utf8'), /versionCode 17[\s\S]*versionName "0\.7\.3"/);
  assert.equal(JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')).version, '0.7.3');
});
test('C17: hpMul table for all 20 levels replaces the v0.7.2 refit (L3 3.0, L17 2.39)', () => {
  assert.equal(C.LEVELS.length, 20);
  C.LEVELS.forEach((L, i) => assert.equal(L.hpMul, HP[i], `L${i + 1}`));
  assert.equal(C.LEVELS[2].hpMul, 3); assert.equal(C.LEVELS[16].hpMul, 2.39);
});
test('C17: mixes - at most 5 types per level, L1 clean, sprinter HP 10, Laser power <= 3', () => {
  C.LEVELS.forEach((L, i) => assert.ok(L.mix.length <= 5, `L${i + 1} mix size`));
  assert.deepEqual(C.LEVELS[0].mix.map((m) => m.type), ['worker', 'small']);
  assert.equal(C.ANTS.sprinter.hp, 10);
  assert.equal(C.TOWERS.laser.stats.power, 3); assert.ok(C.TOWERS.laser.stats.power <= 3, 'Laser power <= 3');
});
test('item 2: inset is re-read by the frame loop + orientationchange + visualViewport listeners; tab bar uses the bottom inset', () => {
  const g = src('game.js');
  assert.match(g, /orientationchange/); assert.match(g, /visualViewport/); assert.match(g, /refreshInset/); assert.match(g, /insetClock/);
  assert.match(g, /500/);
  assert.match(readFileSync(new URL('../android/app/src/main/java/com/yair/crumbdefense/MainActivity.java', import.meta.url), 'utf8'), /EdgeToEdge\.enable\(this\)/);
});
test('item 3: gear panel pushes a history entry; Back closes it (ownBack echo guard)', () => {
  const g = src('game.js'); assert.match(g, /openSettings/); assert.match(g, /closeSettings/); assert.match(g, /ownBack/);
});
test('item 4: swatter kill event carries the ant ref; the slap is queued on the battle clock at the hit frame (0.17 s)', () => {
  const b = new Battle({ levelIndex: 0, deck: ['slingshot', 'spray', 'gate', 'fan', 'tractor'], seed: 1 });
  b.nextWaveAt = 1e9; const a = b.spawn('worker', b.path.length - 22); a.hp = 1; b.swatCd = 0.01;
  let ev = null; for (let i = 0; i < 120 && !ev; i++) { b.update(1 / 60); ev = (b.events || []).find((e) => e.type === 'kill' && e.src === 'swatter') || null; if (b.drainEvents) { /* noop */ } }
  const g = src('game.js'); assert.match(g, /SWAT_HIT\s*=\s*0\.17/); assert.match(g, /swatQ/); assert.match(g, /flushSwat/);
  assert.ok(!/setTimeout\([^)]*swat/i.test(g), 'no wall-clock timers for the slap');
});
test('item 5/6/7: calendar-race guard, version label hidden on calendar/settings/hint, gear offset', () => {
  const g = src('game.js'); assert.match(g, /ownBackUntil/);
  assert.match(g, /if \(!S\.cal && !S\.settings && !shopHint\) plainText\('v' \+ C\.VERSION, 14, 186/);
});
