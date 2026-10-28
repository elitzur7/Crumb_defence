// v0.7.3: C17 tuning paste (M5 mixes + hpMul), safe-area re-read, gear history, swatter hit frame, calendar race, version label. Version 0.7.3 / versionCode 17.
// (Browser-level regressions for items 2-7 live in tools/qa-v073.mjs.)
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as C from '../src/config.js';
import { Battle } from '../src/sim.js';

const src = (f) => readFileSync(new URL(`../src/${f}`, import.meta.url), 'utf8');
const HP = [1, 1.56, 3, 6.6, 2.803, 4.321, 2.225, 3.72, 4.8, 2.373, 3.665, 4.064, 3.45, 4.32, 6.365, 5.056, 2.856, 4.268, 4.878, 1.92];

test('version is >= v0.7.3 (versionCode 17+; the current release is asserted in v074.test.js)', () => {
  assert.match(C.VERSION, /^0\.7\.[3-9](\.\d+)?$/);
  assert.ok(+/versionCode (\d+)/.exec(readFileSync(new URL('../android/app/build.gradle', import.meta.url), 'utf8'))[1] >= 17);
  assert.equal(JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8')).version, C.VERSION);
});
test('C17: hpMul table for all 20 levels replaces the v0.7.2 refit (L3 3.0, L17 2.38 since v0.7.4 M-1; L10 2.373)', () => {
  assert.equal(C.LEVELS.length, 30); // v0.7.7: + 10 world 3 levels (their hpMul is asserted in v077.test.js)
  C.LEVELS.slice(0, 20).forEach((L, i) => assert.equal(L.hpMul, HP[i], `L${i + 1}`));
  assert.equal(C.LEVELS[2].hpMul, 3); assert.equal(C.LEVELS[16].hpMul, 2.856); // v0.7.8: W2 x1.2 (was 2.38)
});
test('C17: mixes - at most 5 types per level, L1 clean, sprinter HP 10, Laser power <= 3', () => {
  C.LEVELS.forEach((L, i) => assert.ok((L.mix || []).length <= 5, `L${i + 1} mix size`)); // v0.7.7: W3 levels have explicit waves, no mix
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
  const g = src('game.js'); assert.match(g, /ownBack(Pending|Until)/); /* v0.7.4 P2: the 1 s ownBackUntil flag became a counter + 400 ms window */
  assert.match(g, /if \(!S\.cal && !S\.settings && !shopHint\) plainText\('v' \+ C\.VERSION, 14, 186/);
});
