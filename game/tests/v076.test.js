// v0.7.6: V1 (small ant colour), V2 (contact ring), V3 (12 px floor), V4/V5, E1 star coins, E2 calendar ladder, E3 boss gems, E4 W2 cap, E5 tuning hooks,
// and the guarantee that the battle simulation did not change. Browser-level checks (contrast on the real renderer, ring pixels, runtime fillText scan) were in tools/qa-v076.mjs (retired in v0.7.8; see tag v0.7.7).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import * as C from '../src/config.js';
import * as M from '../src/meta.js';
import * as Cal from '../src/calendar.js';
import * as A from '../src/art.js';

const rd = (f) => readFileSync(new URL(`../${f}`, import.meta.url), 'utf8');
const src = (f) => rd(`src/${f}`);
const tuning = JSON.parse(readFileSync(new URL('../../tuning/tuning.json', import.meta.url), 'utf8'));
const win = (s, i, st) => M.applyBattleResult(s, i, 'win', st, {}, () => 0);
const lin = (v) => { v /= 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
const Lm = (h) => { const n = parseInt(h.slice(1), 16); return 0.2126 * lin((n >> 16) & 255) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255); };
const ratio = (a, b) => (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);

test('version 0.7.6 or later (the current release, 0.7.9 / versionCode 24, is asserted in v078.test.js)', () => {
  assert.match(C.VERSION, /^0\.(7|8)\.\d+$/);
  assert.match(rd('android/app/build.gradle'), /versionCode (2[0-9]|[3-9]\d)/); assert.match(rd('android/app/build.gradle'), /versionName "0\.(7|8)\.\d+"/);
  assert.match(JSON.parse(rd('package.json')).version, /^0\.(7|8)\.\d+$/);
});
test('V1: small ant is the vivid #f8b05b; the ladder stays ordered', () => {
  assert.equal(A.ANT_COL.small, '#f8b05b');
  const q = [ratio(Lm(A.ANT_COL.small), Lm(A.ANT_COL.worker)), ratio(Lm(A.ANT_COL.worker), Lm(A.ANT_COL.big)), ratio(Lm(A.ANT_COL.big), Lm(A.ANT_COL.heavy))];
  assert.ok(q.every((v) => v >= 1.25), q.join(' '));
  assert.ok(Math.abs(q[0] - 1.28) < 0.02 && Math.abs(q[1] - 1.38) < 0.02 && Math.abs(q[2] - 1.47) < 0.02, `ladder ${q.map((v) => v.toFixed(3))}`);
});
test('V2: one ring sprite, drawn first for side towers only (9 of them); spec 19.5 x 10.5 at (0, 9), #a67c5c, 3 px INK', () => {
  const side = Object.keys(C.TOWERS).filter((id) => C.TOWERS[id].place === 'side');
  assert.deepEqual(side.sort(), ['ball', 'fan', 'laser', 'lizard', 'slingshot', 'sound', 'spray', 'tractor', 'zapper']);
  const a = src('art.js');
  assert.match(a, /T\.place === 'side'\) baked\(ctx, 'ring76'/);
  assert.match(a, /ellipse\(0, 10\.2, 19\.2, 9\.6/); assert.match(a, /drawGlossyBlob\(g, 0, 9, 19\.5, 10\.5, '#a67c5c'/); // v0.8.0: lipped slab, the #a67c5c ring kept
  assert.match(a, /#a67c5c/);
  assert.ok(a.indexOf("'ring76'") < a.indexOf("baked(ctx, 'plinth'"), 'the ring is drawn before the level plinth/trim');
  assert.equal((a.match(/ring76/g) || []).length, 1, 'one ring sprite, no per-tower copies');
  assert.ok(Lm('#a67c5c') < 0.25); // L 0.233; the real-renderer contrast vs the 20 grounds (min 1.91) was measured in tools/qa-v076.mjs (retired in v0.7.8; tag v0.7.7)
});
test('V3: static scan - no text/fit/wrap/plain call below 12 px except the tower tags and the L badges (11 bold)', async () => {
  const { execFileSync } = await import('node:child_process');
  const out = execFileSync('node', ['tools/a11-static-scan.mjs'], { cwd: new URL('..', import.meta.url).pathname, encoding: 'utf8' });
  const rows = out.split('\n').filter((l) => /^game\.js:\d+/.test(l));
  const bad = rows.filter((l) => !/text=(tag|'L' \+ (opt\.level|L|Le)|'BOOM!')$/.test(l));
  assert.deepEqual(bad, [], out);
  assert.equal(rows.filter((l) => /size=11 /.test(l)).length, 0, 'v0.8.1 F2: the tower tags and L badges are 12 px now - nothing below 12'); // v0.7.7: the prep/cards badge text is `L${effective level}`
});
test('V3: fitText / plainFit have a 12 px floor; NEW pill 38 px; Crop Duster width 70; battle tags 11 bold', () => {
  const g = src('game.js');
  assert.match(g, /const MIN_FONT = 12;/); assert.match(g, /Math\.max\(MIN_FONT, s\)/);
  assert.equal((g.match(/x \+ w \/ 2 - 19, y - 9, 38, 17, 8/g) || []).length, 2, 'NEW pill 38 px (2 sites)');
  assert.match(g, /fitText\(C\.BONUSES\[bt\]\.name, x \+ 59, by \+ 15, 70, 12/);
  assert.match(g, /A\.text\(ctx, tag, x \+ w - 7, y \+ 11, 12, '#fff', 'right'\)/); // v0.8.1 F2: 12 px
});
test('V4: KO life 0.32 s, pop in the first 25 %', () => {
  const g = src('game.js');
  assert.match(g, /life: 0\.32/); assert.match(g, /k < 0\.25/);
});
test('V5: the warning text is measured at the 12 px it is drawn at', () => {
  const g = src('game.js'); assert.match(g, /wrapLines\(warn, 324, 12\)/); assert.match(g, /ctx\.font = `bold 12px/);
});
test('E1: star coins are paid once, from the stored stars (no retroactive grant)', () => {
  const inc = (i) => { const F = M.levelFactor(i); return [Math.round(20 * F), Math.round(20 * F), Math.round(80 * F)]; };
  const s = M.newSave();
  let o = win(s, 0, 1); assert.equal(o.starCoins, inc(0)[0]);
  o = win(s, 0, 3); assert.equal(o.starCoins, inc(0)[1] + inc(0)[2], '1 star -> 3 stars pays the two new records');
  o = win(s, 0, 3); assert.equal(o.starCoins, 0, '3 -> 3 pays 0');
  const t = M.newSave(); assert.equal(win(t, 1, 2).starCoins, inc(1)[0] + inc(1)[1]); assert.equal(win(t, 1, 3).starCoins, inc(1)[2]); assert.equal(win(t, 1, 2).starCoins, 0);
  const u = M.newSave(); assert.equal(win(u, 2, 3).starCoins, inc(2)[0] + inc(2)[1] + inc(2)[2]);
  const l = M.newSave(); l.levels[0].stars = 3; l.levels[0].cleared = true;
  assert.equal(M.applyBattleResult(l, 0, 'lose', 0, {}, () => 0).starCoins, 0);
});
test('E-A5: an existing save loads with the same coins, diamonds and stars (nothing is paid on load)', () => {
  const store = new Map(); const st = { getItem: (k) => store.get(k) ?? null, setItem: (k, v) => store.set(k, v) };
  const s = M.newSave(); for (let i = 0; i < 12; i++) win(s, i, (i % 3) + 1); s.coins = 321; s.diamonds = 17;
  const stars = s.levels.map((l) => l.stars); M.writeSave(st, s);
  const l = M.loadSave(st); assert.equal(l.coins, 321); assert.equal(l.diamonds, 17); assert.deepEqual(l.levels.map((x) => x.stars), stars);
  // a replay of an already 3-star level pays no star coins
  const i3 = stars.findIndex((x) => x === 3); assert.equal(win(l, i3, 3).starCoins, 0);
});
test('EX1: calendar coin days are 36, 72, 108, 144 times 3.2 to the world', () => {
  assert.deepEqual([1, 2, 3, 4].map((k) => Cal.coinAmount(k, C.CALENDAR, 1)), [36, 72, 108, 144]);
  assert.deepEqual([1, 2, 3, 4].map((k) => Cal.coinAmount(k, C.CALENDAR, 2)), [115, 230, 346, 461]);
  assert.equal(Cal.coinAmount(9, C.CALENDAR, 1), 144);
  assert.equal(M.highestWorld(M.newSave()), 1);
  const s = M.newSave(); for (let i = 0; i < 10; i++) win(s, i, 3); assert.equal(M.highestWorld(s), 2);
});
test('E-A2: calendar-only W1 income = 180 c in 7 days and 1,500 c in 30 days; gems 55 and cards 9 in 30 days (unchanged)', () => {
  const DAY = 86400000, T0 = Date.UTC(2026, 9, 1, 12); let seed = 5; const rng = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  const sv = M.newSave(); const at = {}; const count = () => C.ALL_CARDS.reduce((s, id) => s + Object.values(sv.cards[id].inv || {}).reduce((a, b) => a + b, 0), 0);
  const cards0 = count(); for (let d = 0; d < 30; d++) { Cal.touch(sv, T0 + d * DAY); Cal.claim(sv, T0 + d * DAY, rng); if (d === 6) at[7] = [sv.coins, sv.diamonds]; }
  assert.equal(at[7][0], 216); assert.equal(sv.coins, 1800); assert.equal(sv.diamonds, 55); assert.equal(count() - cards0, 9);
});
test('DX1: first clear pays one diamond tier; a boss adds 10; later stars pay nothing', () => {
  assert.deepEqual([...Array(20).keys()].filter((i) => C.isBossLevel(i)), [9, 19]);
  const s = M.newSave(); const d0 = s.diamonds;
  let o = win(s, 9, 2); assert.equal(o.gems, 15); assert.equal(s.diamonds, d0 + 15);
  o = win(s, 9, 3); assert.equal(o.gems, 0); assert.equal(s.diamonds, d0 + 15);
  const t = M.newSave(); assert.equal(win(t, 9, 3).gems, 30); assert.equal(win(t, 19, 3).gems, 30);
  assert.equal(win(M.newSave(), 4, 3).gems, 20);
  assert.equal(win(M.newSave(), 4, 1).gems, 1);
  assert.equal(M.applyBattleResult(M.newSave(), 9, 'lose', 0, {}, () => 0).gems, 0);
  assert.equal(C.ECONOMY.bossGems.firstClear, 10);
});
test('UC1: the prep screen no longer tells the player a card acts as a lower level', () => {
  const g = src('game.js');
  assert.doesNotMatch(g, /acts as L\$\{capW\} in this world/);
});
test('EX1: win coins come from the level factor, not coinMul', () => {
  const one = M.battleCoins('win', { levelIndex: 4, stars: 1, firstClear: true });
  assert.equal(one.parts.replay, Math.round(M.replayBase(4)));
  assert.equal(one.parts.firstClear, Math.round(30 * M.levelFactor(4)));
  assert.equal(M.battleCoins('win', { levelIndex: 4, stars: 3 }).total, Math.round(M.replayBase(4) * 1.1));
});
test('unchanged: unlock prices (100 / 200 / 400 tiers) and the W2 gate (18 stars)', () => {
  const p = Object.fromEntries(C.ALL_CARDS.map((id) => [id, M.unlockPrice(id)]));
  assert.deepEqual(p, { slingshot: 200, spray: 200, sound: 100, ball: 200, fan: 200, pheromone: 100, lizard: 200, laser: 400, zapper: 200, glue: 200, gate: 200, lava: 100, tractor: 400 });
  assert.equal(C.WORLDS[1].unlock.minStarsInWorld, 18);
});
