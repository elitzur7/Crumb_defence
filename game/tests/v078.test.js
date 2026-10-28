// v0.7.8: W2 + W3 hpMul re-tune (typical-profile calibration), 'typical profile' QA mode, boss gift cap-1 from W3, review P2 fixes (P2-1 effective stats, P2-2 rarity legend, P2-4 scroll hint).
// Sim numbers (1000 battles per level on the typical profile) are in qa/v0.7.8/sim/; tools/sim-typical.mjs reproduces them (npm run sim:typical).
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import * as C from '../src/config.js';
import * as M from '../src/meta.js';
import { runBattle, aggregate } from '../tools/sim-typical.mjs';

const rd = (f) => readFileSync(new URL(`../${f}`, import.meta.url), 'utf8');
const TJ = JSON.parse(readFileSync(new URL('../../tuning/tuning.json', import.meta.url), 'utf8'));

test('version 0.7.8 / versionCode 23', () => {
  assert.equal(C.VERSION, '0.7.8');
  assert.match(rd('android/app/build.gradle'), /versionCode 23\b/); assert.match(rd('android/app/build.gradle'), /versionName "0\.7\.8"/);
  assert.equal(JSON.parse(rd('package.json')).version, '0.7.8');
});

test('Must 1: World 3 hpMul = [3.3, 4.3, 5.2, 4.9, 8.0, 6.0, 8.0, 6.0, 8.8, 1.45] (L21-L30), nothing else in W3 changed', () => {
  assert.deepEqual(TJ.levels.slice(20, 30).map((l) => l.hpMul), [3.3, 4.3, 5.2, 4.9, 8, 6, 8, 6, 8.8, 1.45]);
  assert.deepEqual(C.LEVELS.slice(20, 30).map((l) => l.hpMul), [3.3, 4.3, 5.2, 4.9, 8, 6, 8, 6, 8.8, 1.45]);
  assert.equal(C.LEVELS.slice(20).length, 10); assert.ok(C.LEVELS.slice(20).every((l) => l.world === 3));
});
test('Must 2: World 2 hpMul = [3.665, 4.064, 3.45, 4.32, 6.365, 5.056, 2.856, 4.268, 4.878, 1.92] (L11-L20) = v0.7.7 x 1.2', () => {
  const now = TJ.levels.slice(10, 20).map((l) => l.hpMul);
  assert.deepEqual(now, [3.665, 4.064, 3.45, 4.32, 6.365, 5.056, 2.856, 4.268, 4.878, 1.92]);
  const old = [3.054, 3.387, 2.875, 3.6, 5.304, 4.213, 2.38, 3.557, 4.065, 1.6];
  now.forEach((v, k) => assert.ok(Math.abs(v - old[k] * 1.2) < 0.0051, `L${11 + k}: ${v} vs ${old[k]} x 1.2`));
});
test('Must 2: World 1 hpMul untouched (L1-L10)', () => {
  assert.deepEqual(TJ.levels.slice(0, 10).map((l) => l.hpMul), [1, 1.56, 3, 6.6, 2.803, 4.321, 2.225, 3.72, 4.8, 2.373]);
});
test('Must 4: star gates - W1->W2 18, W2->W3 18 (unchanged); World 4 is not in the game yet, so the W3->W4 gate (14, review §1.5) has nothing to attach to', () => {
  assert.deepEqual(C.WORLDS[1].unlock, { allLevelsWonInWorld: 1, minStarsInWorld: 18 });
  assert.deepEqual(C.WORLDS[2].unlock, { allLevelsWonInWorld: 2, minStarsInWorld: 18 });
  assert.equal(C.WORLDS.length, 3); assert.equal(TJ.worlds.length, 3);
  assert.deepEqual(C.STARS, [{ stars: 3, minPct: 90 }, { stars: 2, minPct: 50 }, { stars: 1, minPct: 0.0001 }], 'star thresholds unchanged');
});

// ---------- 'typical profile' QA mode ----------
test('Must 3: typical-profile QA mode - profile file covers L1-L30 with 100 trajectories and a deck of owned cards; aggregate() reports win %, stars/win, 3-star %', () => {
  assert.ok(existsSync(new URL('../tools/sim-typical.mjs', import.meta.url))); assert.ok(existsSync(new URL('../tools/data/profiles-typical.json', import.meta.url)));
  const P = JSON.parse(rd('tools/data/profiles-typical.json'));
  for (let L = 1; L <= 30; L++) { assert.equal(P[L].length, 100, `L${L}`); const p = P[L][0]; assert.ok(p.owned.length >= 5 && p.cl && p.bonus); }
  const a = aggregate([{ L: 1, win: 1, stars: 3 }, { L: 1, win: 1, stars: 2 }, { L: 1, win: 0, stars: 0 }, { L: 1, win: 1, stars: 3 }])[0];
  assert.equal(a.n, 4); assert.equal(a.win, 75); assert.equal(a.star3, 50); assert.ok(Math.abs(a.starsPerWin - 8 / 3) < 1e-9);
  assert.match(rd('package.json'), /"sim:typical": "node tools\/sim-typical\.mjs"/);
});
test('typical-profile QA mode: a battle on the typical profile is deterministic for a seed (paired seeds)', () => {
  const P = JSON.parse(rd('tools/data/profiles-typical.json')); const p = P[1][0]; const BOT = null; void BOT;
  const r1 = runBattle(0, ['slingshot', 'spray', 'ball'], { ...p.cl }, { ...p.bonus }, 1000), r2 = runBattle(0, ['slingshot', 'spray', 'ball'], { ...p.cl }, { ...p.bonus }, 1000);
  assert.deepEqual(r1, r2);
});

// ---------- boss gift (P2-5) ----------
const winBoss = (s, i) => M.applyBattleResult(s, i, 'win', 3, {}, () => 0);
test('P2-5: with every tower unlocked the boss gift is cap-2 in W1/W2 (L2, L3) and cap-1 from W3 on (L4)', () => {
  const s = M.newSave(); for (const id of C.ALL_CARDS) M.unlockCard(s, id); M.addCards(s, 'laser', 1, 3);
  assert.equal(winBoss(s, 9).bossGift.level, 2, 'W1 cap 4 -> L2'); assert.equal(winBoss(s, 19).bossGift.level, 3, 'W2 cap 5 -> L3'); assert.equal(winBoss(s, 29).bossGift.level, 4, 'W3 cap 5 -> L4');
  assert.equal(M.countAt(s.cards.laser, 4), 1);
});

// ---------- UI fixes (P2-1, P2-2, P2-4) ----------
test('P2-1: the Cards stats panel shows the effective (capped) numbers; at/above the cap there is no next-level preview', () => {
  const g = rd('src/game.js');
  assert.match(g, /const Le = capCard \? Math\.min\(L, capCard\) : L;/); assert.match(g, /formatStat\(id, k, towerStat\(id, k, 1, Le\)\)/);
  assert.match(g, /At the world cap \(L\$\{capCard\}\): higher cards add nothing yet/); assert.doesNotMatch(g, /towerStat\(id, k, 1, L\)\)/);
});
test('P2-2: rarity pips have a tap tooltip with the dot legend', () => {
  const g = rd('src/game.js');
  assert.match(g, /S\.prepTip = \{ type: t, until: S\.t \+ 3\.4 \}/); assert.match(g, /Dots: 1 common, 2 uncommon, 3 rare, 4 elite/); assert.match(g, /button\('antTip'/);
  assert.equal(C.rarityRank('worker') + 1, 1); assert.ok(C.rarityRank('mama') + 1 >= 1);
});
test('P2-4: the "World n - scroll up" hint sits above the map window (y 164-188), not over node labels', () => {
  const g = rd('src/game.js');
  assert.match(g, /A\.rr\(ctx, 128, MAPVIEW\.top - 30, 144, 24, 12\)/); assert.match(g, /scroll up`, 200, MAPVIEW\.top - 17\.5/); assert.doesNotMatch(g, /MAPVIEW\.top \+ 17\.5/);
});
test('P2-6: the stale qa-v07 and qa-v076 scripts are retired from tools/', () => {
  assert.ok(!existsSync(new URL('../tools/qa-v07.mjs', import.meta.url))); assert.ok(!existsSync(new URL('../tools/qa-v076.mjs', import.meta.url)));
  assert.ok(existsSync(new URL('../tools/qa-v077.mjs', import.meta.url)));
});
