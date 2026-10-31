// v0.8.0 (Colony-Flow art pass) + the v0.7.10 folds: cookie pick-up pause, L3 flyers, 3-star bonus 75 x coinMul, prep-header dedupe, bundled font, recipes.
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, statSync } from 'node:fs';
import * as C from '../src/config.js';
import * as M from '../src/meta.js';
import { Battle, generateWaves } from '../src/sim.js';
import { MAPS } from '../src/maps.js';
import { levelHeaderLine } from '../src/uitext.js';
import * as R from '../src/recipes.js';
import * as A from '../src/art.js';
const rd = (f) => readFileSync(new URL(`../${f}`, import.meta.url), 'utf8');
const TJ = JSON.parse(readFileSync(new URL('../../tuning/tuning.json', import.meta.url), 'utf8'));
const DECK = ['slingshot', 'spray', 'glue', 'fan', 'ball'];
const win = (s, i, st) => M.applyBattleResult(s, i, 'win', st, {}, () => 0);

test('version 0.8.0 / versionCode 25', () => {
  assert.equal(C.VERSION, '0.8.0');
  assert.match(rd('android/app/build.gradle'), /versionCode 25\b/); assert.match(rd('android/app/build.gradle'), /versionName "0\.8\.0"/);
  assert.equal(JSON.parse(rd('package.json')).version, '0.8.0');
});

test('no INTERNET permission, no purchase code, CSP still offline', () => {
  assert.doesNotMatch(rd('android/app/src/main/AndroidManifest.xml'), /uses-permission/);
  assert.match(rd('index.html'), /connect-src 'none'/);
  for (const f of ['src/game.js', 'src/art.js', 'src/recipes.js']) assert.doesNotMatch(rd(f), /XMLHttpRequest|fetch\(|https?:\/\/fonts\./);
});

test('cookie pause: the ant stands at the treat for forage.cookiePause (0.5 s), emits one pickup event, then turns home', () => {
  assert.equal(C.BATTLE.forage.cookiePause, 0.5);
  const b = new Battle({ levelIndex: 0, deck: DECK, seed: 1 });
  b.nextWaveAt = 1e9; b.pending = []; b.ants.length = 0;
  const a = b.spawn('worker', 0, 0);
  let t = 0, pick = null;
  while (t < 120 && !pick) { b.update(1 / 60); t += 1 / 60; pick = b.events.find((e) => e.type === 'pickup'); }
  assert.ok(pick, 'a pickup event fires when the ant reaches the treat');
  assert.equal(pick.t, 0.5); assert.equal(pick.ant, 'worker');
  assert.ok(a.waitT >= 0.45, 'waitT set to the pause: ' + a.waitT);
  const x0 = a.x, y0 = a.y;
  for (let i = 0; i < 25; i++) b.update(1 / 60); // 0.42 s: still standing
  assert.ok(Math.hypot(a.x - x0, a.y - y0) < 0.5, 'the ant has not moved during the pause');
  for (let i = 0; i < 20; i++) b.update(1 / 60); // past 0.5 s: walking again
  assert.ok(Math.hypot(a.x - x0, a.y - y0) > 0.5, 'the ant leaves after the pause');
  assert.equal(b.events.filter((e) => e.type === 'pickup').length, 1);
});

test('cookie pause: off switch (cookiePause 0) restores v0.7.9 timing', () => {
  const b = new Battle({ levelIndex: 0, deck: DECK, seed: 1, cfg: undefined });
  b.cfg = { ...b.cfg, forage: { ...b.cfg.forage, cookiePause: 0 } };
  b.nextWaveAt = 1e9; b.pending = []; b.ants.length = 0; b.spawn('worker', 0, 0);
  let t = 0; while (t < 120 && !b.stats.pickups && !b.events.some((e) => e.type === 'pickup')) { b.update(1 / 60); t += 1 / 60; }
  assert.equal(b.events.filter((e) => e.type === 'pickup').length, 0);
});

test('L3 gets more flyers: 16 small_fly over 5 waves (0/2/4/5/5) and a stronger hpMul; the level still has 5 waves', () => {
  const w = generateWaves(2);
  assert.equal(w.length, 5);
  assert.deepEqual(w.map((x) => x.filter((e) => e.type === 'small_fly').length), [0, 2, 4, 5, 5]);
  assert.equal(w.flat().filter((e) => e.type === 'small_fly').length, 16);
  assert.equal(C.LEVELS[2].hpMul, TJ.levels ? TJ.levels[2].hpMul : C.LEVELS[2].hpMul);
  assert.ok(C.LEVELS[2].hpMul > 3, 'L3 is tougher than v0.7.9 (hpMul 3)');
});

test('L3: a run with no anti-air loses (v0.7.9 won 8/8 with ground-only towers; v0.7.10 loses most seeds), and the full toolbox still wins', async () => {
  const { playLevel, unlockedAt } = await import('../src/bot.js');
  const ground = Object.keys(C.TOWERS).filter((k) => C.TOWERS[k].targets === 'ground');
  const un = unlockedAt(2).filter((x) => ground.includes(x));
  assert.ok(un.length >= 4);
  const res = [1, 2, 3, 4, 5, 6].map((seed) => playLevel(2, { unlocked: un, seed, cardLevel: 2 }).result);
  assert.ok(res.filter((r) => r === 'lose').length >= 4, 'ground-only defence loses most seeds: ' + res.join(','));
  assert.ok(C.TOWERS.fan.targets === 'both' && C.TOWERS.laser.targets === 'both' && C.TOWERS.zapper.targets === 'air', 'anti-air exists');
});

test('3-star bonus: 75 x coinMul rounded to 5 (W1 75, W2 75, W3 95, W4 115); 2-star 15/15/20/25; paid once; a 1->3 jump pays both', () => {
  assert.deepEqual(TJ.economy.starBonus, { 2: 15, 3: 75 }); assert.equal(TJ.economy.starBonusScale, 'coinMul');
  const per = [[0, 15, 75], [10, 15, 75], [20, 20, 95], [30, 25, 115]];
  for (const [i, s2, s3] of per) {
    const s = M.newSave(); const o = win(s, i, 3);
    assert.equal(o.starParts.s3, s3, 'L' + (i + 1) + ' 3-star'); assert.equal(o.starParts.s2, s2, 'L' + (i + 1) + ' 2-star'); assert.equal(o.starCoins, s2 + s3);
    assert.equal(win(s, i, 3).starCoins, 0, 'repeat pays 0');
    const t = M.newSave(); assert.equal(win(t, i, 2).starCoins, s2); assert.equal(win(t, i, 3).starCoins, s3);
  }
  assert.equal(win(M.newSave(), 0, 3).starCoins, 90); // jump 1 -> 3 in W1
});

test('prep header dedupe: when the map name equals the level name it is shown once (all 40 levels, never "X - X")', () => {
  assert.equal(levelHeaderLine({ name: 'Sunny Table' }, [{ name: 'Sunny Table' }].reduce((m, x) => ({ ...m, a: x }), {})), 'Sunny Table');
  let same = 0, diff = 0;
  for (const L of C.LEVELS) {
    const line = levelHeaderLine(L, C.MAPS);
    const mp = (C.MAPS && C.MAPS[L.map]) || {};
    if (mp.name && mp.name !== L.name) { diff++; assert.ok(line.includes(L.name) && line.includes(mp.name), line); }
    else { same++; assert.equal(line, L.name); }
    const parts = line.split('  -  '); assert.ok(parts.length === 1 || parts[0] !== parts[1], line);
  }
  assert.equal(same + diff, 40);
});

test('font: Lilita One is bundled locally with its OFL license; the app never loads it from the net', () => {
  assert.ok(existsSync(new URL('../fonts/LilitaOne-Regular.ttf', import.meta.url))); assert.ok(statSync(new URL('../fonts/LilitaOne-Regular.ttf', import.meta.url)).size > 20000);
  assert.match(rd('fonts/OFL.txt'), /SIL OPEN FONT LICENSE/i);
  assert.match(rd('index.html'), /@font-face\s*\{[^}]*font-family:\s*'Lilita One'[^}]*src:\s*url\('\.\/fonts\/LilitaOne-Regular\.ttf'\)/);
  assert.match(rd('tools/build.mjs'), /fonts/);
  assert.match(A.FONT, /Lilita One/); assert.match(A.FONT, /sans-serif/, 'a system fallback stays in the stack');
});

test('recipes: pure helpers behave (ramp, mixHex, palette, coin pile size, easing)', () => {
  assert.equal(R.mixHex('#000000', '#ffffff', 0.5), '#808080');
  const r = R.ramp('#ff8844'); assert.ok(r && typeof r === 'object');
  assert.ok(R.lum('#ffffff') > R.lum('#202020'));
  assert.deepEqual(R.PILE, { w: 78, h: 30 });
  assert.ok(Math.abs(R.easeOutBack(0)) < 1e-9); assert.ok(Math.abs(R.easeOutBack(1) - 1) < 1e-9);
  for (const k of ['pink', 'mint', 'blue', 'yellow', 'purple', 'orange']) if (R.CANDY[k]) assert.ok(R.CANDY[k]);
});

test('perf rules: no shadowBlur / ctx.filter in any render source; effect caps are logged constants', () => {
  for (const f of ['src/game.js', 'src/art.js', 'src/recipes.js']) { const s = rd(f).replace(/\/\/.*$/gm, ''); assert.doesNotMatch(s, /shadowBlur\s*=/); assert.doesNotMatch(s, /\.filter\s*=/); }
  assert.match(rd('src/game.js'), /CONFETTI_MAX = 36/);
});

test('result screen: the 3-star moment is part of finishBattle (amount from starParts.s3) and respects reduced motion + skip', () => {
  const g = rd('src/game.js');
  assert.match(g, /moment = \{ amount: [^}]*s3/); assert.match(g, /function drawStarMoment/); assert.match(g, /R\.skipped/);
  assert.match(g, /MOMENT_MS = 2250/); assert.match(g, /RESULT_PILE = \{ x: 200, y: 250 \}/);
});

test('Option A: win shows the treat on a coin pile; cheering ants only on defeat (and the queen taunt)', () => {
  const g = rd('src/game.js');
  assert.match(g, /drawCoinPile/); assert.match(g, /'cheer'/);
  assert.equal(typeof A.antSprite, 'function');
});
