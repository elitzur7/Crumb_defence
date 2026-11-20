// v0.8.5: pace 1.35, play ants at 0.72 with the 3D recipe, World 8 Frosting Factory.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as C from '../src/config.js';
import { PACE, SPEEDS } from '../src/loop.js';
import * as A from '../src/art.js';

const src = (f) => readFileSync(new URL('../src/' + f, import.meta.url), 'utf8');

test('PACE2: PACE is 1.35 and the labels stay 1 / 2 / 4', () => {
  assert.equal(PACE, 1.35);
  assert.deepEqual(SPEEDS, [1, 2, 4]);
  assert.match(src('loop.js'), /clk\.acc \+= dt \* speed \* PACE/);
});

test('ANT4/ANT5: play scale 0.72, vivid worker, radial play segment, smaller dark eyes', () => {
  assert.equal(A.PLAY_ANT_SCALE, 0.72);
  assert.equal(A.ANT_COL.worker, '#f58f36');
  assert.equal(A.ANT_COL.sugarcube, '#efe6ff');
  assert.equal(A.ANT_COL.queen8, '#7ec8e8');
  const a = src('art.js');
  assert.match(a, /createRadialGradient/);
  assert.match(a, /#1a1218/);
  assert.match(a, /globalAlpha = 0\.55/);
});

test('W8: Frosting Factory hpMul table, cap 7, Drone then Sugar Cube', () => {
  const w = C.WORLDS[7];
  assert.equal(w.name, 'Frosting Factory');
  assert.equal(w.treat, 'cupcake');
  assert.equal(w.queen, 'queen8');
  assert.equal(w.coinMul, 2.5);
  assert.equal(w.cardLevelCap, 7);
  assert.deepEqual(w.unlock, { allLevelsWonInWorld: 7, minStarsInWorld: 14 });
  assert.deepEqual(C.LEVELS.slice(70).map((L) => L.hpMul), [6.5, 7.8, 10.2, 16, 5.2, 14.6, 4.6, 6.68, 3.73, 1.55]);
  assert.equal(C.LEVELS[66].hpMul, 4.68);
  assert.equal(C.LEVELS[67].hpMul, 7.05);
  assert.equal(C.ANTS.sugarcube.armor, 4);
  assert.equal(C.ANTS.sugarcube.speed, 26);
  assert.equal(C.ANTS.sugarcube.slowResist, 0.35);
  assert.equal(C.ANTS.queen8.spawn.type, 'sugarcube');
  assert.equal(C.ANTS.queen8.spawn.alt, 'drone');
  assert.equal(C.ANTS.queen8.spawn.every, 13);
  assert.equal(A.THEMES[11].name, 'W8 frosting');
  assert.equal(A.THEMES[11].trail, '#fffaf5');
  assert.equal(typeof A.TREAT_BODIES.cupcake, 'function');
  assert.ok(C.LEVELS.slice(70).every((L) => C.MAPS[L.map].theme === 11));
});
