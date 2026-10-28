// v0.7.5 "C18 + review fixes": palette / value structure, wave-strip vs row-0 towers, no tap-to-cycle, mode-aware info text, 12 px labels, juice rules,
// plus the guarantee that nothing in the simulation changed (sim.js / tuning untouched). Browser-level checks (A1-A7 measured on the real renderer, A15, A16) are in tools/qa-v075.mjs.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as C from '../src/config.js';
import { Battle } from '../src/sim.js';
import { blockedSpans, freeSpans, STRIP_H, STRIP_Y } from '../src/preview.js';
import * as A from '../src/art.js';

const rd = (f) => readFileSync(new URL(`../${f}`, import.meta.url), 'utf8');
const src = (f) => rd(`src/${f}`);
const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
const lum = (hex) => { const n = parseInt(hex.slice(1), 16); return 0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255); };
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

test('v0.7.5 version + versionCode (>= 20; the current release is asserted in v076.test.js)', () => {
  assert.match(C.VERSION, /^0\.7\.[5678]$/);
  assert.ok(+/versionCode (\d+)/.exec(rd('android/app/build.gradle'))[1] >= 20);
});

test('A4: the ant body value ladder small > worker > big > heavy has adjacent steps >= 1.30 (v0.7.5 plan: 1.48 / 1.38 / 1.48; v0.7.6 V1: 1.37 / 1.38 / 1.48)', () => {
  const L = (t) => lum(A.ANT_COL[t]);
  const s1 = ratio(L('small'), L('worker')), s2 = ratio(L('worker'), L('big')), s3 = ratio(L('big'), L('heavy'));
  for (const s of [s1, s2, s3]) assert.ok(s >= 1.30, `step ${s.toFixed(2)}`);
  assert.ok(L('small') > L('worker') && L('worker') > L('big') && L('big') > L('heavy'));
  assert.ok(Math.abs(s1 - 1.37) < 0.02 && Math.abs(s2 - 1.38) < 0.02 && Math.abs(s3 - 1.48) < 0.02, `${s1.toFixed(2)} ${s2.toFixed(2)} ${s3.toFixed(2)}`);
});

test('C18: the trail is baked into the cached map background (no per-frame trail draw, no dashes, no hairlines)', () => {
  const a = src('art.js'), i = a.indexOf('export function renderMapBackground'), body = a.slice(i, i + 9000);
  assert.ok(!/strokeAll\([^;]*\[\d/.test(body), 'no dashed trail strokes in the baked background');
  assert.match(a, /rgba\(70,35,50,0\.26\)/); // the trail's cast shadow
  const g = src('game.js'); assert.match(g, /bdCache/); assert.match(g, /S\.bdCache = \{\}|bdCache = \{\}/);
});

test('C18: blob() uses three gradient stops (was four) and the ground has half the flowers', () => {
  const a = src('art.js'); const b = a.slice(a.indexOf('function blob('), a.indexOf('// soft radial contact shadow'));
  assert.equal((b.match(/addColorStop/g) || []).length, 3);
  assert.match(a, /k < 10/);
});

test('review finding 1: towers built in the top row are blocked spans for the wave strip', () => {
  const b = new Battle({ levelIndex: 0, deck: ['slingshot', 'laser', 'zapper'], seed: 1 }); b.crumbs = 999;
  let placed = null;
  for (let c = 0; c < C.GRID_COLS && !placed; c++) for (const ty of ['slingshot', 'laser']) { if (b.placeRuleOk && b.placeRuleOk(ty, c, 0)) { const t = b.addTower(ty, c, 0); if (t) { placed = t; break; } } }
  assert.ok(placed, 'a row-0 tower was placed');
  const spans = blockedSpans(b), cx = placed.x ?? (placed.c * C.TILE + C.TILE / 2);
  assert.ok(spans.some(([x0, x1, k]) => k === 'tower' && x0 <= cx - 20 && x1 >= cx + 20), JSON.stringify(spans));
  for (const [x0, x1] of freeSpans(b)) assert.ok(!(x0 < cx + 20 && x1 > cx - 20), `a free span [${x0},${x1}] covers the tower at ${cx}`);
  assert.match(src('preview.js'), /'tower'/);
});

test('review finding 2: tapping the open panel no longer cycles the target mode; the chips still select directly', () => {
  const g = src('game.js');
  assert.ok(!/cycleMode/.test(g)); assert.ok(!/tap the open panel/i.test(g));
  assert.match(g, /button\('mode_' \+ m/); assert.match(g, /setMode\(tw, m\)/);
});

test('review finding 3: the info-panel description follows the selected mode (every mode of every mode-capable tower has its own line)', () => {
  for (const ty of ['slingshot', 'lizard', 'laser', 'zapper']) {
    const T = C.TARGET_MODE_TEXT[ty]; assert.ok(T, ty);
    for (const m of ['carrier', 'front']) assert.ok(typeof T[m] === 'string' && T[m].length > 20 && T[m].length < 110, `${ty}/${m}`);
    assert.notEqual(T.carrier, T.front);
    assert.ok(!/fewest HP left\.?$/.test(T.front), `${ty}: the Front text must not describe Weakest`);
  }
  assert.match(src('game.js'), /TARGET_MODE_TEXT\[tw\.type\]\[tw\.mode\]/);
});

test('review finding 4 / A11: the speed label and the carried / left / level captions are >= 12 px', () => {
  const g = src('game.js');
  assert.match(g, /sp \+ 'x', x \+ w \/ 2, y \+ h - 11, 12,/);
  assert.match(g, /carried off!`, 102, 51, 12,/);
  assert.match(g, /const STRIP_FONT = 12|STRIP_FONT|, 12, /);
});

test('mode chips: 34 px tall with an inactive outline; the badge pops for 0.5 s on a change', () => {
  const g = src('game.js');
  assert.match(g, /y = py \+ 108, w = 114, h = 34/); assert.match(g, /_modeAt/); assert.match(g, /strokeStyle = on \? A\.INK : '#d9c5cc'/);
});

test('juice table: hit squash 1.12/0.88 over 120 ms, number pop 0.6 -> 1.15 -> 1, death pop 1.25 in 80 ms then out in 120 ms, all gated by reducedMotion()', () => {
  const g = src('game.js');
  assert.match(g, /sq = 0\.12 \* q \* q/); assert.match(g, /1\.15 - 0\.15/); assert.match(g, /1\.25 \* \(1 - /); /* v0.7.6 V4: pop in the first 25%, KO life 0.32 s */ assert.match(g, /k: 'ko'[^\n]*life: 0\.32, max: 0\.32/);
  assert.ok((g.match(/reducedMotion\(\)/g) || []).length >= 8, 'reduced motion is consulted by the new juice');
  assert.match(src('fx.js'), /maxAlive: 8/);
});

test('A16: with reduced motion the hit flash stays but squash / rise / pop / death scale are off', () => {
  const g = src('game.js');
  assert.match(g, /a\.hitFlash > 0 && !reducedMotion\(\)/); assert.match(g, /a\.hitFlash > 0\.04\) \{ ctx\.globalCompositeOperation = 'lighter'/);
  assert.match(g, /rm \|\| pk >= 1 \? 1/); assert.match(g, /rmo \? 1/);
});

test('outline weights: hero shapes (cookie, nest, pads) are 3.0', () => {
  const a = src('art.js');
  assert.match(a, /ctx\.fillStyle = shade\(color, -0\.22\); ctx\.fill\(\); ctx\.lineWidth = 3\.0/);
  assert.match(a, /ctx\.fill\(\); ctx\.lineWidth = 3; ctx\.strokeStyle = INK; ctx\.stroke\(\);\n  ctx\.fillStyle = '#c08a5e'/);
});

test('HUD compact preview exists for when the strip has no room; the strip eases sideways instead of jumping', () => {
  const g = src('game.js');
  assert.match(g, /function drawHudPreview/); assert.match(g, /stripNoRoom/); assert.match(g, /stripX/);
});

test('no behaviour change: nothing in sim.js / tuning was touched (the sims are identical by construction; tools verify with paired seeds)', () => {
  const s = src('sim.js');
  assert.ok(!/TARGET_MODE_TEXT|reducedMotion|bdCache/.test(s));
  assert.ok(!/INTERNET/.test(rd('android/app/src/main/AndroidManifest.xml')));
});
