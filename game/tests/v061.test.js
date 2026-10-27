// v0.6.1: B1 onboarding dim cut-out, B2 tower bodies pre-rendered to cached sprites, item 7 card pictures on Shop + prep.
// (The pixel-level checks - brightness, cache keys per type/level, rebuild after a resize - run in tools/regress-ui.mjs.)
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as C from '../src/config.js';

const src = (f) => readFileSync(new URL(`../src/${f}`, import.meta.url), 'utf8');
const fnBody = (s, name) => { const i = s.indexOf(`function ${name}(`); assert.ok(i >= 0, name); let d = 0, j = s.indexOf('{', i); for (let k = j; k < s.length; k++) { if (s[k] === '{') d++; else if (s[k] === '}' && --d === 0) return s.slice(i, k + 1); } };

test('B1: onboarding dim = one even-odd path (full screen + cut-out), no beginPath()-ing helper before the fill', () => {
  const b = fnBody(src('game.js'), 'onboardSpot');
  const fill = b.indexOf("fill('evenodd')"); assert.ok(fill > 0, 'even-odd fill');
  const before = b.slice(0, fill).replace(/\/\/.*$/gm, ''); // code only
  assert.ok(/ctx\.rect\(-2000, -2000, W \+ 4000, H \+ 4000\)/.test(before), 'full-screen rect');
  assert.equal((before.match(/beginPath\(\)/g) || []).length, 1, 'exactly one beginPath before the fill');
  assert.ok(!/A\.rr\(/.test(before), 'A.rr (which calls beginPath) is not used before the fill');
  assert.ok(/arcTo/.test(before), 'rounded cut-out added to the same path');
});

test('B2: every tower type + on-trail item + Tractor draws its body from baked sprites; levelParts is static-only', () => {
  const a = src('art.js'); const dt = fnBody(a, 'drawTower');
  assert.ok(/export function clearTowerCache\(/.test(a));
  const prefix = { slingshot: 'sling:', spray: 'spray:', sound: 'sound:', ball: 'ball:', fan: 'fan:', pheromone: 'pher:', glue: 'glue:', lava: 'lava:', gate: 'gate:', lizard: 'liz:', laser: 'laser:', tractor: 'tractor', zapper: 'zap:' };
  assert.deepEqual(Object.keys(prefix).sort(), Object.keys(C.TOWERS).sort(), 'all 13 types covered');
  for (const [type, p] of Object.entries(prefix)) assert.ok(dt.includes(`baked(ctx, '${p}`), `${type} body is baked`);
  for (const k of ["'plinth'", "'trim'", "'crown'", "'pennantPole'"]) assert.ok(dt.includes(k) || a.includes(`baked(ctx, ${k}`), k);
  // the static level parts are pure functions of (type, level): no time-driven animation left in levelParts
  const lp = fnBody(a, 'levelParts'); assert.ok(!/Math\.sin\(t|Math\.cos\(t|\bt \*/.test(lp), 'levelParts has no animation');
  // sprites are keyed by the device scale (DPR x fit) and trimmed to their painted pixels
  const bk = fnBody(a, 'baked'); assert.ok(/devScale\(ctx\)/.test(bk) && /getImageData/.test(bk) && /partClipped/.test(bk));
});

test('B2: the tower sprite cache is rebuilt after a DPR / size change', () => {
  const r = fnBody(src('game.js'), 'resize'); assert.ok(/A\.clearTowerCache\(\)/.test(r));
});

test('item 7: Shop and pre-battle grids use the card picture (drawCardPic), like the Cards screen', () => {
  const g = src('game.js');
  for (const fn of ['renderShop', 'renderPrep']) { const b = fnBody(g, fn); assert.ok(/drawCardPic\(/.test(b), fn); assert.ok(!/\bdrawCard\(/.test(b), fn + ' no old tile'); }
});
